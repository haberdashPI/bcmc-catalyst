import React from 'react'
import debounce from 'debounce-promise'
import { Form, Select, PersonSubForm, person, personSchema, ShowFormikData, renameKeys } from "./formUtils"
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
        { email: yup.string().email().required("Missing email") } :
        values.contactby === "Mail" ? {
            street: yup.string().required("Missing street"),
            city: yup.string().required("Missing city"),
            state: yup.string().required("Missing state"),
            zip: yup.string().required("Missing zip").matches(/^[0-9]*$/, "Must be a number"),
        } :
        { phone: yup.string().required("Missing phone number").matches(/^[0-9-]*$/,"Must be a number") }
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

function onSubmitFn(node, slugs){
    return async (values) => {
        if(values.honeypot){
            return
        }
        let message = {
            accessKey: node.sendto,
            replyTo: values.person.email,
            formType: "Volunteer Form",
            ...(renameKeys(values.person, str => `\$${str}`))
        }
        // console.dir(message)
        let res = await fetch('https://api.staticforms.xyz/submit', {
            method :'POST',
            body: JSON.stringify(message),
            headers: { 'Content-Type': 'application/json' }
        });
        const json = await res.json();
        if(json.success){
            node.success_page && node.success_page._ref &&
                navigate(slugs[node.success_page._ref])
        } else {
            alert(json.message)
        }
    }
}

const VolunteerForm = ({ node }) => {
    const slugs = useSlugIndex()

    return (<Form
        initialValues = {{
            contactby: "Phone",
            person: person(node.info_questions),
        }}
        validate = {debounce(validate, 250)}
        onSubmit = {onSubmitFn(node, slugs)}>
            {/* <ShowFormikData/> */}
            <Label>Please reach me by</Label>
            <Select name='contactby'>
                <option key="Email">Email</option>
                <option key="Phone">Phone</option>
                <option key="Mail">Mail</option>
            </Select>
            <PersonSubForm name={'person'} questions={node.questions}/>
    </Form>)
}

export default VolunteerForm