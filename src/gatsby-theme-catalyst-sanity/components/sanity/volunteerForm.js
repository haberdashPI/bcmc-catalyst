import React from 'react'
import debounce from 'debounce-promise'
import { Form, Select, PersonSubForm, person, personSchema, formToHtml, ShowFormikData, renameKeys } from "./formUtils"
import { set, isEmpty } from 'lodash'
import * as yup from 'yup'
import {
    Box,
    Label,
    Heading,
    Button,
} from 'theme-ui'
import { navigate } from 'gatsby-link'
import { useSlugIndex } from './util'

function validate(values){
    let schema = values.contactby === "Email" ?
        { email: yup.string().email().required("Required") } :
        values.contactby === "Mail" ? {
            street: yup.string().required("Required"),
            city: yup.string().required("Required"),
            state: yup.string().required("Required"),
            zip: yup.string().required("Required").matches(/^[0-9]*$/, "Must be a number"),
        } :
        { phone: yup.string().required("Required").matches(/^[0-9-]*$/,"Must be a number") }
    schema = {...personSchema, ...schema}

    try {
        yup.object().shape(schema).validateSync(values.person, {
            abortEarly: false,
        });
    } catch (error) {
        if (error.name !== "ValidationError") {
            throw error;
        }
        return {person: error.inner.reduce((errors, currentError) => {
            errors = set(errors, currentError.path, currentError.message);
            return errors
        }, {})}
    }

    return {}
}

function submitValuesFn(node) {
    return values => ({
        subject: 'Volunteer Form',
        replyTo: values.person.email,
        accessKey: node.sendto,
        formType: 'volunteer',
        content: formToHtml(values.person)
    })
}

const VolunteerForm = ({ node }) => {
    return (<Form
        initialValues = {{
            contactby: "Phone",
            person: person(node.info_questions),
        }}
        validate = {debounce(validate, 250)}
        submitMessage = {node.submit}
        submitValues = {submitValuesFn(node)}>
            {/* <ShowFormikData/> */}
            <Select label='Please reach me by' name='contactby'>
                <option key="Email">Email</option>
                <option key="Phone">Phone</option>
                <option key="Mail">Mail</option>
            </Select>
            <PersonSubForm name={'person'} questions={node.questions}/>
    </Form>)
}

export default VolunteerForm