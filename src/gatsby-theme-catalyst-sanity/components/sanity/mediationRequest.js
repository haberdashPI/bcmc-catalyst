/** @jsx jsx */
import { Formik, FieldArray } from "formik"
import * as yup from 'yup'
import debounce from 'debounce-promise'
import { List } from 'immutable'

import { jsx, Styled } from "theme-ui"
import React, { useState, useContext } from 'react'
import { get, merge, range, set, isEmpty } from 'lodash'
import {
    Box,
    Label,
    Input as ThemeUIInput,
    Grid,
    Heading,
    Select as ThemeUISelect,
    Button,
    Textarea as ThemeUITextarea,
    Message
    // Radio,
    // Checkbox,
    // Slider,
} from 'theme-ui'
import { lighten } from '@theme-ui/color';

function flatten(obj, roots = [], sep = '.'){
  return Object
  // find props of given object
  .keys(obj)
  // return an object by iterating props
  .reduce((memo, prop) => Object.assign(
    // create a new object
    {},
    // include previously returned object
    memo,
    Object.prototype.toString.call(obj[prop]) === '[object Object]'
      // keep working if value is an object
      ? flatten(obj[prop], roots.concat([prop]))
      // include current prop and value and prefix prop with the roots
      : {[roots.concat([prop]).join(sep)]: obj[prop]}
  ), {})
}

const FormikContext = React.createContext({});

const Input = ({name, ...props}) => {
    const formik = useContext(FormikContext)
    const error = get(formik.touched, name) && get(formik.errors, name)
    // return <pre>{name}</pre>
    return <>
        <ThemeUIInput name={name} id={name} onChange={formik.handleChange}
            onBlur={formik.handleBlur} variant={error ? "formError" : ""}
            sx={{bg: error ? "tertiary" : ""}}
            value={get(formik.values, name)} {...props}/>
        <Box variant="formValidation">{error}</Box>
    </>
}

const Textarea = ({name, ...props}) => {
    const formik = useContext(FormikContext)
    return <>
        <ThemeUITextarea name={name} id={name} onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={get(formik.values, name)} {...props}/>
        <Box variant="formValidation">{get(formik.errors, name)}</Box>
    </>
}

const Select = ({name, ...props}) => {
    const formik = useContext(FormikContext)
    return <>
        <ThemeUISelect name={name} id={name} onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={get(formik.values, name)} {...props}/>
        <Box variant="formValidation">{get(formik.errors, name)}</Box>
    </>
}

const PersonSubForm = ({ index, questions }) => (<>
    <Grid gap={4} sx={{mb: "1rem"}} columns={'1fr 1fr'}>
        <Box>
            <Label>First Name</Label>
            <Input name={`person.${index}.first`}/>
        </Box>
        <Box>
            <Label>Last Name</Label>
            <Input name={`person.${index}.last`}/>
        </Box>
    </Grid>
    <Grid gap={4} sx={{mt: "1rem"}} columns={'1fr 2fr'}>
        <Box>
            <Label>Phone</Label>
            <Input name={`person.${index}.phone`}/>
        </Box>
        <Box>
            <Label>Email</Label>
            <Input type="email" name={`person.${index}.email`}/>
        </Box>
    </Grid>
    <Box sx={{mt: "2rem", borderRadius: "4px", border: "solid 1px", p: "1rem"}}>
        <Heading as='h4' sx={{fontVariant: "small-caps"}}>Address</Heading>
        <Label>Street</Label>
        <Input name={`person.${index}.street`}></Input>
        <Label>Line 2</Label>
        <Input name={`person.${index}.line2`}></Input>
        <Grid gap={4} columns={'1fr 4em 0.5fr'}>
            <Box>
                <Label>City</Label>
                <Input name={`person.${index}.city`}/>
            </Box>
            <Box>
                <Label>State</Label>
                <Input name={`person.${index}.state`}/>
            </Box>
            <Box>
                <Label>Zip</Label>
                <Input name={`person.${index}.zip`}/>
            </Box>
        </Grid>
        <Label htmlFor='Country'>Country</Label>
        <Input name={`person.${index}.country`}/>
    </Box>
    {questions && questions.map((q, i) =>
        q.length !== "long" ? <div key={"addq"+i}>
            <Label sx={{mt: "1rem"}}>{q.text}</Label>
            <Input name={`person.${index}.${q.id}`}/>
        </div> : <div key={"addq"+i}>
            <Label sx={{mt: "1rem"}}>{q.text}</Label>
            <Textarea rows={8} name={`person.${index}.${q.id}`}/>
        </div>
    )}
</>)

function person(quests){
    let result = {
        first: "", last: "",
        phone: "", email: "",
        street: "", line2: "", city: "", state: "", zip: "", country: "",
    }
    quests && quests.forEach(q => {
        result[q.id] = ""
    })

    return result
}

const personSchema = {
    first: yup.string().required("Missing first name"),
    last: yup.string().required("Missing last name"),
    phone: yup.string().matches(/^[0-9-]*$/,"Must be a number"),
    email: yup.string().email("Must be an email"),
    zip: yup.string().matches(/^[0-9]*$/, "Must be a number")
}

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

function DeletedList( {children, deleted, helpers, setDeleted} ){
    return (<Box sx={{
        position: "fixed",
        zIndex: 999,
        bottom: "1rem",
        right: "1rem"}}>
        {deleted.map((p, i) =>
            <Message key={"message"+i} sx={{
                m: "0.5rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "4rem",
                bg: "background",
                boxShadow: "0px 0px 4px",
                color: "text"}}>

                {children(p, i)}
                <Button type='button' sx={{
                        m: "0.5rem",
                        float: "right",
                        fontSize: 1,
                        p: "0.2em"
                    }}
                    variant="secondary"
                    onClick={() => {
                        helpers.push(p)
                        setDeleted(deleted.delete(i))
                }}>
                    Undo
                </Button>
                <Button type='button' sx={{
                        m: "0.5rem",
                        float: "right",
                        fontSize: 1,
                        p: "0.2em"}}
                    variant="secondary"
                    onClick={() => {
                        setDeleted(deleted.delete(i))
                }}>
                    Confirm
                </Button>
            </Message>)}
    </Box>)
}

const MediationRequestionForm = ({ node }) => {

    let [deletedPersons, setDeletedPersons] = useState(List())

    return (<><Formik
        initialValues = {{
            contactby: "Phone",
            person: [ person(node.info_questions) ],
        }}
        validate = {debounce(validateFn(node), 500)}
        onSubmit = {onSubmitFn(node)}>
            {formik => (
                <FormikContext.Provider value={formik}>
                    <Box sx={{/* height: "500px", overflowY: "auto" */}}>
                    <Box as='form' onSubmit={formik.handleSubmit}>
                        <Heading as='h2' sx={{mb: "1rem", fontVariant: "small-caps"}}>
                            My Information
                        </Heading>
                        <Box sx={{borderRadius: "4px", p: "1em", border: "solid 1px"}}>
                            <Label>Please reach me by</Label>
                            <Select name='contactby'>
                                <option key="Email">Email</option>
                                <option key="Phone">Phone</option>
                                <option key="Mail">Mail</option>
                            </Select>
                            <PersonSubForm key="personfrist" index={0}
                                questions={node.info_questions} formik={formik}/>
                        </Box>
                        <Heading as='h2' sx={{mt: "1rem", fontVariant: "small-caps"}}>
                            Other Participants
                        </Heading>
                        <p>Who would you like to schedule a mediation with?</p>
                        <FieldArray key="additionpeople" name="person">
                            {helpers => (<>
                                {deletedPersons.size > 0 &&
                                <DeletedList helpers={helpers} deleted={deletedPersons}
                                    setDeleted={setDeletedPersons}>
                                    {p => <span>You removed {(!p.first && !p.last) ? "a person" :
                                        (p.first+" " || "")+(p.last)}.</span>}
                                </DeletedList>}
                                {range(formik.values.person.length-1).map(i => <span key={"person"+i}>
                                    <Box sx={{border: "solid 1px",
                                            borderRadius: "4px", my: "1em", p: "1em"}}>
                                        <Button
                                            type='button'
                                            variant='tertiary'
                                            sx={{float: "right", ml: "1em", mb: "1em"}}
                                            onClick={() => {
                                                setDeletedPersons(deletedPersons.push(
                                                    formik.values.person[i+1]))
                                                helpers.remove(i+1)
                                            }}>
                                            Remove
                                        </Button>
                                        {/* <Heading as='h3'
                                            sx={{mb: "0.5rem", fontVariant: "small-caps"}}>
                                            Person {i+2}
                                        </Heading> */}
                                        <PersonSubForm index={i+1}
                                            questions={node.part_questions}
                                            formik={formik}/>
                                    </Box>
                                </span>)}
                            {<Button
                                type='button'
                                variant='secondary'
                                sx={{m: "0.5rem"}}
                                onClick={() => helpers.push(person(node.part_questions))}>
                                Add Person
                            </Button>}
                            </>)}
                        </FieldArray>
                        <Button type="submit"
                            disabled = {!formik.isValid}
                            sx={{float: "right", mt: "1rem", mx: "0.5rem"}}> Submit </Button>
                        <Input name={`honeypot`} sx={{display: "none"}}></Input>
                    </Box>
                    {/* <pre>{JSON.stringify(formik.errors, null, 2)}</pre> */}
                    </Box>
                </FormikContext.Provider>
            )}
        </Formik>
    </>)
}

export default MediationRequestionForm