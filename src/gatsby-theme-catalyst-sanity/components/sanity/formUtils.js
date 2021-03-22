import React, { useContext, useState } from 'react'
import { jsx, Styled } from "theme-ui"
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
} from 'theme-ui'
import { List } from 'immutable'
import { get } from 'lodash'
import * as yup from 'yup'
import { Formik, FieldArray } from "formik"

const FormikContext = React.createContext({});

export function person(quests){
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

export const personSchema = {
    first: yup.string().required("Missing first name"),
    last: yup.string().required("Missing last name"),
    phone: yup.string().matches(/^[0-9-]*$/,"Must be a number"),
    email: yup.string().email("Must be an email"),
    zip: yup.string().matches(/^[0-9]*$/, "Must be a number")
}

export const Form = ({ children, ...props }) => {
    return(<Formik {...props}>
        {formik => (<>
            <FormikContext.Provider value={formik}>
                <Box sx={{position: "relative"}} as='form' onSubmit={formik.handleSubmit}>
                    <Input name={`honeypot`} sx={{display: "none"}}></Input>
                    {children}
                    <Button type="button" sx={{visibility: "hidden", my: "1rem"}} disabled={true}>Submit</Button>
                    <Button sx={{my: "1rem"}} type="submit"
                        disabled = {!formik.isValid}
                        sx={{position: "absolute", right: "0", bottom: "1rem", mt: "1rem", mx: "0.5rem"}}> Submit </Button>
                </Box>
            </FormikContext.Provider>
        </>)}
    </Formik>)
}

export const ListOf = ({name, children, defaultItem, deleteMessageFn}) => {
    let [deletedItems, setDeletedItems] = useState(List())
    const formik = useContext(FormikContext)
    const items = get(formik.values, name)
    function buildDeleteFn(helpers){ return (i) => {
        setDeletedItems(deletedItems.push(items[i]))
        helpers.remove(i+1)
    }}

    return (<FieldArray name={name}>
        {helpers => (<>
            {deletedItems.size > 0 &&
            <DeletedList onAdd={p => helpers.push(p)}
                deleted={deletedItems} setDeleted={setDeletedItems}>
                {p => deleteMessageFn(p)}
            </DeletedList>}
            {items.map((item, i) => children(item, i, buildDeleteFn(helpers)))}
            <Button
                type='button'
                variant='secondary'
                sx={{m: "0.5rem"}}
                onClick={() => helpers.push(defaultItem)}>
                Add Person
            </Button>
        </>)}
    </FieldArray>)
}


export const Input = ({name, ...props}) => {
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

export const Textarea = ({name, ...props}) => {
    const formik = useContext(FormikContext)
    const error = get(formik.touched, name) && get(formik.errors, name)
    return <>
        <ThemeUITextarea name={name} id={name} onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={get(formik.values, name)} {...props}/>
        <Box variant="formValidation">{error}</Box>
    </>
}

export const ShowFormikData = () => {
    const formik = useContext(FormikContext)
    return (<pre>{JSON.stringify(formik, null, 2)}</pre>)
}

export const Select = ({name, ...props}) => {
    const formik = useContext(FormikContext)
    return <>
        <ThemeUISelect name={name} id={name} onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={get(formik.values, name)} {...props}/>
        <Box variant="formValidation">{get(formik.errors, name)}</Box>
    </>
}

export const PersonSubForm = ({ name, questions }) => (<>
    <Grid gap={4} sx={{mb: "1rem"}} columns={'1fr 1fr'}>
        <Box>
            <Label>First Name</Label>
            <Input name={`${name}.first`}/>
        </Box>
        <Box>
            <Label>Last Name</Label>
            <Input name={`${name}.last`}/>
        </Box>
    </Grid>
    <Grid gap={4} sx={{mt: "1rem"}} columns={'1fr 2fr'}>
        <Box>
            <Label>Phone</Label>
            <Input name={`${name}.phone`}/>
        </Box>
        <Box>
            <Label>Email</Label>
            <Input type="email" name={`${name}.email`}/>
        </Box>
    </Grid>
    <Box sx={{mt: "2rem", borderRadius: "4px", border: "solid 1px", p: "1rem"}}>
        <Heading as='h4' sx={{fontVariant: "small-caps"}}>Address</Heading>
        <Label>Street</Label>
        <Input name={`${name}.street`}></Input>
        <Label>Line 2</Label>
        <Input name={`${name}.line2`}></Input>
        <Grid gap={4} columns={'1fr 4em 0.5fr'}>
            <Box>
                <Label>City</Label>
                <Input name={`${name}.city`}/>
            </Box>
            <Box>
                <Label>State</Label>
                <Input name={`${name}.state`}/>
            </Box>
            <Box>
                <Label>Zip</Label>
                <Input name={`${name}.zip`}/>
            </Box>
        </Grid>
        <Label htmlFor='Country'>Country</Label>
        <Input name={`${name}.country`}/>
    </Box>
    {questions && questions.map((q, i) =>
        q.length !== "long" ? <div key={"addq"+i}>
            <Label sx={{mt: "1rem"}}>{q.text}</Label>
            <Input name={`${name}.${q.id}`}/>
        </div> : <div key={"addq"+i}>
            <Label sx={{mt: "1rem"}}>{q.text}</Label>
            <Textarea rows={8} name={`${name}.${q.id}`}/>
        </div>
    )}
</>)

function DeletedList( {children, deleted, onAdd, setDeleted} ){
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
                bg: "tertiary",
                borderLeftColor: darken("tertiary", 0.25),
                boxShadow: "0px 0px 4px",
                color: "text"}}>

                {children(p, i)}
                <Button type='button' sx={{
                        m: "0.5rem",
                        float: "right",
                        fontSize: 1,
                        p: "0.2em"
                    }}
                    variant="tertiary"
                    onClick={() => {
                        onAdd(p)
                        setDeleted(deleted.delete(i))
                }}>
                    Undo
                </Button>
                <Button type='button' sx={{
                        m: "0.5rem",
                        float: "right",
                        fontSize: 1,
                        p: "0.2em"}}
                    variant="tertiary"
                    onClick={() => {
                        setDeleted(deleted.delete(i))
                }}>
                    Confirm
                </Button>
            </Message>)}
    </Box>)
}

