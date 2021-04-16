/** @jsx jsx */
import * as yup from 'yup'
import debounce from 'debounce-promise'
import { Select, PersonSubForm, Form, ListOf, person, personSchema, renameKeys } from "./formUtils"

import { jsx, Themed } from "theme-ui"
import React from 'react'
import { set, isEmpty } from 'lodash'
import { navigate } from 'gatsby'
import {
    Box,
    Label,
    Heading,
    Close,
    Button,
} from 'theme-ui'
import { darken } from '@theme-ui/color';
import { useSlugIndex } from './util'

function validateFn(node, slugs){
    return (values) => {
        let firstPersonSchema = values.contactby === "Email" ?
            { email: yup.string().email().required("Missing email") } :
            values.contactby === "Mail" ? {
                street: yup.string().required("Missing street"),
                city: yup.string().required("Missing city"),
                state: yup.string().required("Missing state"),
                zip: yup.string().required("Missing zip").matches(/^[0-9]*$/, "Must be a number"),
            } :
            { phone: yup.string().required("Missing phone number").matches(/^[0-9-]*$/,"Must be a number") }

        const personError = values.person.map((p,i) => {
            let schema = i === 0 ? {...personSchema, ...firstPersonSchema} :
                personSchema
            try {
                yup.object().shape(schema).validateSync(p, {
                    abortEarly: false,
                });
            } catch (error) {
                if (error.name !== "ValidationError") {
                    throw error;
                }
                return error.inner.reduce((errors, currentError) => {
                    errors = set(errors, currentError.path, currentError.message);
                    return errors
                }, {})
            }

            return {}
        })
        return personError.every(isEmpty) ? {} : { person: personError }
    }
}


function submitValuesFn(node){
    return values => ({
        accessKey: node.sendto,
        replyTo: values.person[0].email,
        ['$formType']: "Mediation Request",
        ...(values.person.
            map((p, i) => renameKeys(p, str => `\$Person ${i+1}: ${str}`)).
            reduce((result, item) => {return {...result, ...item}}))
    })
}

const MediationRequestForm = ({ node }) => {
    const slugs = useSlugIndex()

    return (<Form
        initialValues = {{
            contactby: "Phone",
            person: [ person(node.info_questions) ],
        }}
        validate = {debounce(validateFn(node), 250)}
        submitMessage = {node.submit}
        submitValues = {submitValuesFn(node)}>
            <ListOf name="person" defaultItem={person(node.part_questions)}
                    deletedMessageFn={p => <span>
                        You removed {(!p.first && !p.last) ? "a person" :
                            (p.first+" " || "")+(p.last)}.</span>}>

                {(person, i, deleteFn) => (<span key={"person"+i}>
                    {i === 0 && <>
                        <Heading as='h2' sx={{mb: "1rem", fontVariant: "small-caps"}}>
                            My Information
                        </Heading>
                    </>}
                    {i === 1 && <>
                        <Heading as='h2' sx={{mt: "1rem", fontVariant: "small-caps"}}>
                            Other Participants
                        </Heading>
                        <p>Who would you like to schedule a mediation with?</p>
                    </>}
                    <Box sx={{mt: "3rem"}}>
                        {i === 0 && <>
                            <Select label='Please reach me by' name='contactby'>
                                <option key="Email">Email</option>
                                <option key="Phone">Phone</option>
                                <option key="Mail">Mail</option>
                            </Select>
                        </>}
                        <PersonSubForm name={`person.${i}`}
                            questions={i === 0 ? node.info_questions : node.part_questions}/>
                        {i > 0 && <Box sx={{textAlign: "right"}}><Button variant="tertiary"
                            sx={{
                                p: "0",
                                m: "0",
                                mb: "1rem",
                                px: "0.5rem",
                                display: "inline"
                            }}
                            type="button"
                            onClick={() => deleteFn(i)}>
                            Remove {person.first}
                        </Button></Box>}
                    </Box></span>)}
            </ListOf>
        </Form>)
}

export default MediationRequestForm