/** @jsx jsx */
import { setConfig, cold } from 'react-hot-loader';

import { jsx, Styled } from "theme-ui"
import React, { useState } from 'react'
import _ from 'lodash'
import {
    Box,
    Label,
    Input,
    Grid,
    Heading,
    Select,
    Button,
    Textarea,
    Radio,
    Checkbox,
    Slider,
  } from 'theme-ui'

const PersonSubForm = ({ index }) => (<>
    <Grid gap={4} sx={{mb: "1rem"}} columns={'1fr 1fr'}>
        <Box>
            <Label htmlFor={'first_name_'+index}>First Name</Label>
            <Input sx={{bg: "background"}} name={'first_name_'+index}/>
        </Box>
        <Box>
            <Label htmlFor={'last_name_'+index}>Last Name</Label>
            <Input sx={{bg: "background"}} name={'last_name_'+index}/>
        </Box>
    </Grid>
    <Grid gap={4} sx={{mt: "1rem"}} columns={'1fr 2fr'}>
        <Box>
            <Label htmlFor={'phone_'+index}>Phone</Label>
            <Input sx={{bg: "background"}} name={'phone_'+index}/>
        </Box>
        <Box>
            <Label htmlFor={'email_'+index}>Email</Label>
            <Input sx={{bg: "background"}} name={'email_'+index}/>
        </Box>
    </Grid>
    <Box sx={{mt: "2rem", borderRadius: "4px", bg: "background", p: "1rem"}}>
        <Heading as='h4' sx={{fontVariant: "small-caps"}}>Address</Heading>
        <Label htmlFor={'street_'+index}>Street</Label>
        <Input sx={{bg: "background"}} name={'street_'+index}></Input>
        <Label htmlFor={'line2_'+index}>Line 2</Label>
        <Input sx={{bg: "background"}} name={'line2_'+index}></Input>
        <Grid gap={4} columns={'1fr 4em 0.5fr'}>
            <Box>
                <Label htmlFor={'city_'+index}>City</Label>
                <Input sx={{bg: "background"}} name={'city_'+index}/>
            </Box>
            <Box>
                <Label htmlFor={'state_'+index}>State</Label>
                <Input sx={{bg: "background"}} name={'state_'+index}/>
            </Box>
            <Box>
                <Label htmlFor={'zip_'+index}>Zip</Label>
                <Input sx={{bg: "background"}} name={'zip_'+index}/>
            </Box>
        </Grid>
        <Label htmlFor='Country'>Country</Label>
        <Input sx={{bg: "background"}} name={'country_'+index}/>
    </Box>
</>)

const MediationRequestionForm = ({ node }) => {

    let [count, setCount] = useState(1)
    setConfig({ pureSFC: true });

    return (<><Box as='form'>
        <Heading as='h2' sx={{mb: "1rem", fontVariant: "small-caps"}}>My Information</Heading>
        <Box sx={{borderRadius: "4px", p: "1em", bg: "secondary"}}>
            <Label htmlFor='contactby' >Please reach me by</Label>
            <Select sx={{bg: "background"}} defaultValue='Phone' name='contactby'>
                <option>Email</option>
                <option>Phone</option>
                <option>Mail</option>
            </Select>
            <PersonSubForm index={1}/>
        </Box>
        <Heading as='h2' sx={{mt: "1rem", fontVariant: "small-caps"}}>Other Participants</Heading>
        <p>Who would you like to schedule a mediation with?</p>
        {_.range(count).map(i => <>
            <Box sx={{bg: "secondary", borderRadius: "4px", my: "1em", p: "1em"}}>
                <Heading as='h3' sx={{mb: "0.5rem", fontVariant: "small-caps"}}>Person {i+2}</Heading>
                <PersonSubForm index={i+2}/>
            </Box>
        </>)}

        <Button type='button' sx={{m: "0.5rem", bg: "secondary"}} onClick={() => setCount(count + 1)}>Add Person</Button>
        <Button type='button' sx={{m: "0.5rem", bg: "secondary"}} onClick={() => setCount(Math.max(1,count - 1))}>Remove Last Person</Button>
        <Button sx={{float: "right", mt: "1rem", mx: "0.5rem"}}> Submit </Button>
    </Box>
    </>)
}
cold(MediationRequestionForm)

export default MediationRequestionForm