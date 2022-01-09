import React, { useContext, useEffect, useState } from 'react'
import req from "superagent";
import { baseColors } from "@theme-ui/preset-tailwind"
import { jsx, Themed } from "theme-ui"
import {
    Box,
    Label as ThemeUILabel,
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
import { OrderedSet, Set } from 'immutable'
import { get, entries, range } from 'lodash'
import * as yup from 'yup'
import { Formik, FieldArray } from "formik"
import { alpha, darken, lighten } from '@theme-ui/color'
import { navigate } from "gatsby"
import { theme } from '../../../gatsby-plugin-theme-ui/index'

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
    first: yup.string().required("Required"),
    last: yup.string().required("Required"),
    phone: yup.string().matches(/^[0-9-]*$/,"Must be a number"),
    email: yup.string().email("invalid address"),
    zip: yup.string().matches(/^[0-9]*$/, "Must be a number")
}

function onSubmitFn(valuesToSubmit, showAlert, submitMessage){
    return async (values) => {
        if(values.honeypot){
            return
        }
        let message = valuesToSubmit(values)

        if(process.env.FORM_SUBMISSION !== "debug"){
            try{
                let resp = await (req.post('/.netlify/functions/sendform').
                    send(message).
                    set('Accept', 'application/json'))
                if(resp.body.error){
                    showAlert(resp.body.error)
                }else if(resp.body.message === "SUCCESS"){
                    console.dir(resp.body)
                    showAlert(submitMessage)
                }else{
                    throw Exception("Unexpected response: "+JSON.stringify(resp))
                }
            } catch (e) {
                showAlert("Internal error: "+e.message, true)
            }
        }else{
            alert(JSON.stringify(message))
            showAlert(submitMessage)
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
                zIndex: 1000, bg: "rgba(1,1,1,0.5)", //alpha("background", 0.5),
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
                <Themed.p style={{margin: "0"}}>{alertMessage.text}</Themed.p>
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
                {visibleError(formik.errors, formik.touched) && <Box sx={{
                    position: "fixed", bottom: "0", left: "0", width: "100vw",
                    zIndex: 500, bg: lighten(theme.tertiary, 0.25), p: "1em", borderWidth: "0", borderLeftWidth: "5px", borderStyle: "solid",
                    borderColor: darken(theme.tertiary, 0.25),
                }}>
                    There are several errors in the form, check all fields before submitting.
                </Box>}
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

function visibleError(errors, touched){
    if(errors === undefined || touched === undefined){
        return false
    }
    if(errors instanceof Array){
        for(let i of range(errors.length)){
            if(visibleError(errors[i], touched[i])) return true
        }
        return false
    }
    else if(errors instanceof Object){
        if(!touched instanceof Object) return false
        for(let [key, value] of entries(errors)){
            if(visibleError(value, touched[key])) return true
        }
        return false
    }
    else{
        return touched && errors
    }
}

export const ListOf = ({name, children, defaultItem, deletedMessageFn}) => {
    let [deletedItems, setDeletedItems] = useState(new OrderedSet())
    const formik = useContext(FormikContext)
    const items = get(formik.values, name)
    function buildDeleteFn(helpers){ return (i) => {
        setDeletedItems(deletedItems.add(items[i]))
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

export const Label = ({children}) => {
    return (<ThemeUILabel sx={{fontSize: "smaller"}}>{children}</ThemeUILabel>)
}

export const Input = ({label, name, ...props}) => {
    const formik = useContext(FormikContext)
    const error = get(formik.touched, name) && get(formik.errors, name)
    // return <pre>{name}</pre>
    return (<Box sx={{mt: "0.5em"}}>
        <ThemeUIInput name={name} id={name} onChange={formik.handleChange}
            placeholder={label}
            onBlur={formik.handleBlur} variant={error ? "formError" : ""}
            sx={{borderWidth: 0,
                borderStyle: "dotted",
                borderBottomWidth: "1.5px", borderRadius: 0,
                borderColor: baseColors.gray[6],
                mt: "0px",
                px: 0, pb: "2px", pl: "0.25em",
                bg: error ? "tertiary" : baseColors.gray[1],
                borderTopLeftRadius: "0.25rem", borderTopRightRadius: "0.25rem",
                ":focus": {
                    borderStyle: "solid",
                    borderColor: error ? darken(theme.tertiary, 0.25) : "primary",
                    bg: error ? "tertiary" : lighten(theme.primary, 0.5),
                    outline: 0,
                }
            }}
            value={get(formik.values, name)} {...props}/>
            <ThemeUILabel sx={{
                display: "inline",
                mb: "0px",
                mr: "1em", pl: "0.25em",
                fontSize: "smaller",
                color: baseColors.gray[6]}}>

                {/* {label} */}
                {get(formik.values, name) ? label : ""}
            </ThemeUILabel>
        <Box sx={{display: "inline"}} variant="formValidation">{error}</Box>
    </Box>)
}

export const Textarea = ({label, name, ...props}) => {
    const formik = useContext(FormikContext)
    const error = get(formik.touched, name) && get(formik.errors, name)
    return <>
        <Box sx={{mt: "0.5em"}}>{label}</Box>
        <ThemeUITextarea name={name} id={name} onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            sx={{
                borderRadius: 0,
                borderTopLeftRadius: "0.25rem", borderTopRightRadius: "0.25rem",
                bg: "white", //baseColors.gray[3],
                borderWidth: "1px", borderBottomWidth: "2px",
                borderColor: baseColors.gray[5],
                borderStyle: "solid",
                // borderBottomStyle: "dotted",
                // boxShadow: "inset 0px 1px 1.5px 0.5px #555",
                outline: 0,
                ":focus": {
                    bg: lighten(theme.primary, 0.5),
                    borderBottomColor: "primary",
                    // borderStyle: "solid",
                }
            }}
            value={get(formik.values, name)} {...props}/>
        <Box variant="formValidation">{error}</Box>
    </>
}

export const ShowFormikData = () => {
    const formik = useContext(FormikContext)
    return (<pre>{JSON.stringify(formik, null, 2)}</pre>)
}

export const Select = ({label, name, ...props}) => {
    const formik = useContext(FormikContext)
    return <>
        <ThemeUISelect name={name} id={name} onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={get(formik.values, name)}
            sx={{
                borderWidth: 0,
                borderBottomWidth: "1.5px", borderRadius: 0,
                borderStyle: "dotted",
                px: 0, pb: "2px", pl: "0.25rem",
                bg: "background",
                borderTopLeftRadius: "0.25rem", borderTopRightRadius: "0.25rem",
                ":focus": {
                    borderStyle: "solid",
                    borderColor: "primary",
                    bg: lighten(theme.primary, 0.5),
                    outline: 0,
                }
            }}
            {...props}/>
        <ThemeUILabel sx={{
            display: "inline",
            mt: "1px",
            mr: "1em",
            pl: "0.25rem",
            fontSize: "smaller",
            color: baseColors.gray[6]}}>

            {label}
        </ThemeUILabel>
        {/* <Box sx={{display: "inline"}} variant="formValidation">{error}</Box> */}
    </>
}

export const PersonSubForm = ({ name, questions }) => (<>
    <Grid gap={4} sx={{mb: "1rem"}} columns={'1fr 1fr'}>
        <Box>
            <Input label={"First Name"} name={`${name}.first`}/>
        </Box>
        <Box>
            <Input label={"Last Name"} name={`${name}.last`}/>
        </Box>
    </Grid>
    <Grid gap={4} sx={{mt: "1rem"}} columns={'1fr 2fr'}>
        <Box>
            <Input label={"Phone"} name={`${name}.phone`}/>
        </Box>
        <Box>
            <Input label={"Email"} type="email" name={`${name}.email`}/>
        </Box>
    </Grid>
    <Box sx={{my: "0.5rem"}}>
        {/* <Heading as='h4' sx={{fontVariant: "small-caps"}}>Address</Heading> */}
        <Input label={"Street"} name={`${name}.street`}></Input>
        <Input label={"Line 2"} name={`${name}.line2`}></Input>
        <Grid gap={4} columns={'1fr 4em 0.5fr'}>
            <Box>
                <Input label={"City"} name={`${name}.city`}/>
            </Box>
            <Box>
                <Input label={"State"} name={`${name}.state`}/>
            </Box>
            <Box>
                <Input label={"Zip"} name={`${name}.zip`}/>
            </Box>
        </Grid>
        <Input label={"Country"} name={`${name}.country`}/>
    </Box>
    {questions && questions.map((q, i) =>
        q.length !== "long" ? <div key={"addq"+i}>
            <Input label={q.text} name={`${name}.${q.id}`}/>
        </div> : <div key={"addq"+i}>
            <Textarea label={q.text} rows={8} name={`${name}.${q.id}`}/>
        </div>
    )}
</>)

function DeletedItem({children, item, onClose, onUndo}){
    const [timers, setTimers] = useState(new Set())
    useEffect(() => {
        if(!timers.has(item)){
            setTimers(timers.add(item))
            setTimeout(() => onClose(item), 20000)
        }
    }, [item])
    return (<Message sx={{
        m: "0.5rem",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "4rem",
        bg: lighten(theme.tertiary, 0.25),
        borderLeftColor: darken(theme.tertiary, 0.25),
        boxShadow: "0px 0px 4px black",
        color: "text"}}>

        {children}
        <Button type='button' sx={{
                m: "0.5rem",
                float: "right",
                fontSize: 1,
                p: "0.2em"
            }}
            type="button"
            variant="tertiary"
            onClick={e => onUndo(item)}>
            Undo
        </Button>
        <Close sx={{m: "0", p: "0",
            float: "right",
            fontSize: 1,
            p: "0.2em"}}
            type="button"
            onClick={e => onClose(item)}/>
    </Message>)
}

function DeletedList( {children, deleted, onAdd, setDeleted} ){
    let key = 0;
    return (<Box sx={{
        position: "fixed",
        zIndex: 999,
        bottom: "1rem",
        right: "1rem"}}>
        {deleted.map((p) =>
            <DeletedItem
                key={"deleted_"+(key++)}
                item={p}
                deleted={deleted}
                onClose={(p) => {setDeleted(del => del.delete(p))}}
                onUndo={(p) => {
                    onAdd(p)
                    setDeleted(del => del.delete(p))
                }}>
                {children(p, key)}
            </DeletedItem>)}
    </Box>)
}

export function renameKeys(obj, renamefn){
    return Object.keys(obj).reduce((result, key) => ({
        ...result,
        ...{ [renamefn(key)]: obj[key] }
    }), {})
}

export function formToHtml(obj){
    // for now, something easy (clean up later)
    return `<pre>${JSON.stringify(obj)}</pre>`
}