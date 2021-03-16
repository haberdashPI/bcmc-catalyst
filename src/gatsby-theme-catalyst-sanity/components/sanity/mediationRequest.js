/** @jsx jsx */
import { setConfig, cold } from 'react-hot-loader';
import { Formik, FieldArray } from "formik"

import { jsx, Styled } from "theme-ui"
import React, { useState, useContext } from 'react'
import _ from 'lodash'
import {
    Box,
    Label,
    Input as ThemeUIInput,
    Grid,
    Heading,
    Select,
    Button,
    Textarea as ThemeUITextarea,
    // Radio,
    // Checkbox,
    // Slider,
} from 'theme-ui'

const FormikContext = React.createContext({});

const Input = ({name, ...props}) => {
    const formik = useContext(FormikContext)
    const formval = idx => idx.split('.').reduce((o,i) => o[i], formik.values)
    // return <pre>{name}</pre>
    return <ThemeUIInput name={name} id={name} onChange={formik.handleChange}
        value={formval(name)} {...props}/>
}

const Textarea = ({name, ...props}) => {
    const formik = useContext(FormikContext)
    const formval = idx => idx.split('.').reduce((o,i) => o[i], formik.values)
    // return <pre>{name}</pre>
    return <ThemeUITextarea name={name} id={name} onChange={formik.handleChange}
        value={formval(name)} {...props}/>
}

const PersonSubForm = ({ index, questions }) => (<>
    <Grid gap={4} sx={{mb: "1rem"}} columns={'1fr 1fr'}>
        <Box>
            <Label>First Name</Label>
            <Input sx={{bg: "background"}} name={`person.${index}.first`}/>
        </Box>
        <Box>
            <Label>Last Name</Label>
            <Input sx={{bg: "background"}} name={`person.${index}.last`}/>
        </Box>
    </Grid>
    <Grid gap={4} sx={{mt: "1rem"}} columns={'1fr 2fr'}>
        <Box>
            <Label>Phone</Label>
            <Input sx={{bg: "background"}} name={`person.${index}.phone`}/>
        </Box>
        <Box>
            <Label>Email</Label>
            <Input type="email" name={`person.${index}.email`} sx={{bg: "background"}}/>
        </Box>
    </Grid>
    <Box sx={{mt: "2rem", borderRadius: "4px", border: "solid 1px", p: "1rem"}}>
        <Heading as='h4' sx={{fontVariant: "small-caps"}}>Address</Heading>
        <Label>Street</Label>
        <Input sx={{bg: "background"}} name={`person.${index}.street`}></Input>
        <Label>Line 2</Label>
        <Input sx={{bg: "background"}} name={`person.${index}.line2`}></Input>
        <Grid gap={4} columns={'1fr 4em 0.5fr'}>
            <Box>
                <Label>City</Label>
                <Input sx={{bg: "background"}} name={`person.${index}.city`}/>
            </Box>
            <Box>
                <Label>State</Label>
                <Input sx={{bg: "background"}} name={`person.${index}.state`}/>
            </Box>
            <Box>
                <Label>Zip</Label>
                <Input sx={{bg: "background"}} name={`person.${index}.zip`}/>
            </Box>
        </Grid>
        <Label htmlFor='Country'>Country</Label>
        <Input sx={{bg: "background"}} name={`person.${index}.country`}/>
    </Box>
    {questions && questions.map(q =>
        q.length !== "long" ? <>
            <Label sx={{mt: "1rem"}}>{q.text}></Label>
            <Input sx={{bg: "background"}} name={`person.${index}.${q.id}`}/>
        </> : <>
            <Label sx={{mt: "1rem"}}>{q.text}</Label>
            <Textarea rows={8} sx={{bg: "background"}} name={`person.${index}.${q.id}`}/>
        </>
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
const MediationRequestionForm = ({ node }) => {

    let [count, setCount] = useState(1)
    setConfig({ pureSFC: true });

    return (<><Formik
        initialValues = {{
            contactby: "",
            person: [ person(node.info_questions), person(node.part_questions) ],
        }}
        onSubmit = { (values, actions) => {
            alert(JSON.stringify(values, null, 2))
            actions.setSubmitting(false);
        }}>
            {formik => (
                // <pre>{JSON.stringify(formik, null, 2)}</pre>
                <FormikContext.Provider value={formik}>
                    <Box as='form' onSubmit={formik.handleSubmit}>
                        <Heading as='h2' sx={{mb: "1rem", fontVariant: "small-caps"}}>My Information</Heading>
                        <Box sx={{borderRadius: "4px", p: "1em", border: "solid 1px"}}>
                            <Label>Please reach me by</Label>
                            <Select sx={{bg: "background", mb: "1rem"}} defaultValue='Phone' name='contactby'
                                id='contactby' onChange={formik.handleChange}
                                value={formik.values.contactby}>
                                <option>Email</option>
                                <option>Phone</option>
                                <option>Mail</option>
                            </Select>
                            <PersonSubForm index={0} questions={node.info_questions} formik={formik}/>
                        </Box>
                        <Heading as='h2' sx={{mt: "1rem", fontVariant: "small-caps"}}>Other Participants</Heading>
                        <p>Who would you like to schedule a mediation with?</p>
                        <FieldArray name="person" render={helpers => (
                            _.range(formik.values.person.length-1).map(i => <>
                                <Box sx={{border: "solid 1px",
                                          borderRadius: "4px", my: "1em", p: "1em"}}>
                                    <Heading as='h3'
                                        sx={{mb: "0.5rem", fontVariant: "small-caps"}}>
                                        Person {i+2}
                                    </Heading>
                                    <PersonSubForm index={i+1} questions={node.part_questions}
                                        formik={formik}/>
                                    {formik.values.person.length > 2 && <Button
                                        type='button'
                                        sx={{m: "0.5rem", bg: "secondary"}}
                                        onClick={() => helpers.remove(i+1)}>
                                        Remove This Person
                                    </Button>}
                                    {i+1 == formik.values.person.length-1 && <Button
                                        type='button'
                                        sx={{m: "0.5rem", bg: "secondary"}}
                                        onClick={() => helpers.push()}>
                                        Add Person
                                    </Button>}
                                </Box>
                        </>))}/>
                        <Button sx={{float: "right", mt: "1rem", mx: "0.5rem"}}> Submit </Button>
                    </Box>
                </FormikContext.Provider>
            )}
        </Formik>
    </>)
}
cold(MediationRequestionForm)

export default MediationRequestionForm