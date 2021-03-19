/** @jsx jsx */
import * as yup from 'yup'
import debounce from 'debounce-promise'
import { Select, PersonSubForm, Form, ListOf, person, personSchema } from "./formUtils"

import { jsx, Styled } from "theme-ui"
import React from 'react'
import { set, isEmpty } from 'lodash'
import {
    Box,
    Label,
    Heading,
    Button,
} from 'theme-ui'
import { darken } from '@theme-ui/color';

function validateFn(node){
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

function onSubmitFn(node){
    return async (values) => {
        // TODO: define a reasonable react-ish response
        // to complete the form (showing a message, etc...)
        let message = {
            accessKey: node.sendto,
            replyTo: values.person[0].email,
            ['$data']: values
        }
        // console.dir(message)
        let res = await fetch('https://api.staticforms.xyz/submit', {
            method :'POST',
            body: JSON.stringify(message),
            headers: { 'Content-Type': 'application/json' }
        });
        const json = await res.json();
        if(json.success){
            alert("Your form has been submitted!")
        } else {
            alert(json.message)
        }
    }
}

const MediationRequestForm = ({ node }) => {
    return (<Form
        initialValues = {{
            contactby: "Phone",
            person: [ person(node.info_questions) ],
        }}
        validate = {debounce(validateFn(node), 500)}
        onSubmit = {onSubmitFn(node)}>
            <ListOf name="person" defaultItem={person(node.part_questions)}
                    deletedMessageFn={p => <span>
                        You removed {(!p.first && !p.last) ? "a person" :
                            (p.first+" " || "")+(p.last)}.</span>}>

                {(person, i, deleteFn) => (<span key={"person"+1}>
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
                    <Box sx={{border: "solid 1px",
                        borderRadius: "4px", my: "1em", p: "1em"}}>
                        {i > 1 && <Button
                            type='button'
                            variant='tertiary'
                            sx={{float: "right", ml: "1em", mb: "1em"}}
                            onClick={() => {
                            }}>
                            Remove
                        </Button>}
                        {i === 0 && <>
                            <Label>Please reach me by</Label>
                            <Select name='contactby'>
                                <option key="Email">Email</option>
                                <option key="Phone">Phone</option>
                                <option key="Mail">Mail</option>
                            </Select>
                        </>}
                        <PersonSubForm name={`person.${i}`}
                            questions={i === 0 ? node.info_questions : node.part_questions}/>
                    </Box></span>)}
            </ListOf>
        </Form>)
}

export default MediationRequestForm