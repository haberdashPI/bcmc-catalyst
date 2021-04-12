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
    Message,
    Close,
    Spinner,
} from 'theme-ui'
import { List } from 'immutable'
import { get } from 'lodash'
import * as yup from 'yup'
import { Formik, FieldArray } from "formik"
import { alpha, darken } from '@theme-ui/color'
import { navigate } from "gatsby"

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

function onSubmitFn(valuesToSubmit, showAlert, submitMessage){
    return async (values) => {
        if(values.honeypot){
            return
        }
        let message = valuesToSubmit(values)

        try{
            let res = await fetch('https://api.staticforms.xyz/submit', {
                method :'POST',
                body: JSON.stringify(message),
                headers: { 'Content-Type': 'application/json' }
            });
            const json = await res.json();
            if(json.success){
                showAlert(submitMessage)
            } else {
                showAlert(json.message, true)
            }
        } catch (e) {
            showAlert("Internal error: "+e.message, true)
        }
    }
}

export const Form = ({ submitMessage, children, submitValues, ...props }) => {
    const [alertMessage, setAlertMessage] = useState({on: false})
    const alertClick = (e) =>
        alertMessage.error ? setAlertMessage({on: false}) :
        alertMessage.loading ? e.preventDefault() :
        navigate('/')
    return(<>

        <Box sx={{position: "absolute",
            display: alertMessage.on ? "block" : "none",
            zIndex: 1000, top: "0", left: "0"}}>
            <Box sx={{
                position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh",
                zIndex: 1000, bg: alpha("background", 0.5),
                backdropFilter: "blur(10px)"}}
                onClick={alertClick}
            />
            {alertMessage.loading ? <Box sx={{
                left: "50%",
                bottom: "50%",
                transform: "translate(-50%, -50%)",
                // width: "min(100vw, 15em)", height: "min(100vh, 15em)",
                // display: "flex", justifyContent: "center", alignContent: "center",
                opacity: 1, display: "block", position: "fixed",
                zIndex: 1001}}>

                <Spinner/>
            </Box> :
            <Box sx={{bg: "background", zIndex: 1001,
                left: "50%", top: "50%", transform: "translate(-50%, -50%)" ,
                width: "min(100vw, 30em)", height: "min(100vh, 15em)",
                p: "2rem", borderRadius: "0.5rem", opacity: 1, display: "block",
                display: "flex", flexWrap: "wrap",
                justifyContent: "center", alignContent: "top",
                position: "fixed",
                boxShadow: "2px 2px 6px black",
            }}>
                <Styled.p style={{margin: "0"}}>{alertMessage.text}</Styled.p>
                <Box sx={{flexBasis: "100%", height: 0, width: "100%"}}/>
                 <Button sx={{m: "1rem", justifySelf: "end", alignSelf: "end"}}
                    type='button' variant="primary"
                    onClick={alertClick}>
                    Okay
                </Button>
            </Box>}
        </Box>
        <Formik onSubmit={v => {
            setAlertMessage({on: true, loading: true});
            const fn = onSubmitFn(submitValues,
                (str, error) => (setAlertMessage({ on: true, text: str, error: error })),
                submitMessage)
            fn(v)}} {...props}>
            {formik => (<>
                <FormikContext.Provider value={formik}>
                    <Box sx={{position: "relative"}} as='form' onSubmit={formik.handleSubmit}>
                        <Input name={`honeypot`} sx={{display: "none"}}></Input>
                        {children}
                        <Button type="button" sx={{visibility: "hidden", my: "1rem"}} disabled={true}>Submit</Button>
                        <Box sx={{position: "absolute", right: "0", bottom: "1rem"}}>
                        <Button sx={{my: "1rem"}} type="submit"
                            disabled = {!formik.isValid || formik.isSubmitting}
                            onClick = {formik.submitForm}
                            sx={{mt: "1rem", mx: "0.5rem"}}> Submit </Button>
                        </Box>
                    </Box>
                </FormikContext.Provider>
            </>)}
        </Formik>
    </>)
}

export const ListOf = ({name, children, defaultItem, deletedMessageFn}) => {
    let [deletedItems, setDeletedItems] = useState(List())
    const formik = useContext(FormikContext)
    const items = get(formik.values, name)
    function buildDeleteFn(helpers){ return (i) => {
        setDeletedItems(deletedItems.push(items[i]))
        helpers.remove(i)
    }}

    return (<FieldArray name={name}>
        {helpers => (<>
            {deletedItems.size > 0 &&
            <DeletedList onAdd={p => helpers.push(p)}
                deleted={deletedItems} setDeleted={setDeletedItems}>
                {p => deletedMessageFn(p)}
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
                boxShadow: "0px 0px 4px black",
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
                <Close sx={{m: "0", p: "0",
                    float: "right",
                    fontSize: 1,
                    p: "0.2em"}}
                    onClick={() => {setDeleted(deleted.delete(i))}}/>
            </Message>)}
    </Box>)
}

export function renameKeys(obj, renamefn){
    return Object.keys(obj).reduce((result, key) => ({
        ...result,
        ...{ [renamefn(key)]: obj[key] }
    }), {})
}
