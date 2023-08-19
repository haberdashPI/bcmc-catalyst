/** @jsx jsx */ import { jsx, useThemeUI, Grid, Button, Themed } from "theme-ui"
import * as yup from 'yup'
import { set, isEmpty } from 'lodash'
import { Input, useAlert, FormikContext, yupValidate } from "../../gatsby-theme-catalyst-sanity/components/sanity/formUtils"
import debounce from 'debounce-promise'
import React from 'react'
import { Formik } from "formik"
import req from "superagent";
import {
  useSiteMetadata,
  useCatalystConfig,
  SocialFooter,
} from "gatsby-theme-catalyst-core"
import { useStaticQuery, graphql } from "gatsby"
import { SanityContent } from "gatsby-theme-catalyst-sanity"
import { IconContext } from "react-icons"

const SiteFooter = () => {
  const { title } = useSiteMetadata()
  const { footerContentLocation } = useCatalystConfig()
  const { theme } = useThemeUI()
  const isLeft = footerContentLocation === "left"
  const isRight = footerContentLocation === "right"
  const isCenter = footerContentLocation === "center"

  const [Alert, setAlertLoading, showAlert, setAlertOff] = useAlert(false);

  const footerData = useStaticQuery(graphql`
    query SanityFooterContent {
      sanityFooterPage(_id: {eq: "footerDocument"}) {
        id
        _rawBody
      }
    }
  `)

  async function submitNewsEmail(values) {
    if(values.honeypot){
      return
    }
    if(true){
      try{
        let resp = await (req.post('/.netlify/functions/newsletter')
          .send(values)
          .set('Accept', 'application/json'))
        // NOTE: I don't know why `superagent` is failing to parse the JSON body but it is
        let body = resp.body == null ? JSON.parse(resp.text) : resp.body
        console.dir(body)
        if(body.error){
          showAlert(body.error)
        }else if(body.message == "SUCCESS"){
          showAlert( "You've been added to the newsletter! Please search your email for a"+
            " confirmation message from volunteer@communitymediation.org. It may be in "+
            "your spam folder.")
        }else{
          throw Exception("Unexpected response: "+JSON.stringify(resp))
        }
      } catch (e) {
        console.log("Response exception: ")
        console.dir(e)
        showAlert("Internal error: "+e.message, true)
      }
    } else {
      alert(JSON.stringify(values))
      showAlert("You've been added to the newsletter!")
    }
  }

  const emailval = yup.string().required("Required").email();
  function validateEmail(values){ yupValidate(emailval, values.email) }

  // TEST BLANK email
  return (<div>
      <Alert/>
          <div 
        sx={{
          display: "grid",
          alignContent: "center",
          backgroundColor: "secondary",
          padding: "1rem",
          width: "100%",
          mx: "auto",
        }}>

      <div sx={{maxWidth: "maxContentWidth", mx: "auto", px: "1rem", bg: "background", borderRadius: "0.5rem"}}>
        <Formik onSubmit={submitNewsEmail}
          initialValues={{email: '', honeypot: ''}}
          validate = {debounce(validateEmail, 250)}
          >
          {formik => (<>
            <FormikContext.Provider value={formik}>
              <Grid as='form' onSubmit={formik.handleSubmit} gap={4} sx={{ mb: "1rem" }} 
                    columns={'2fr 1fr'}>
                <Input
                  type="email"
                  name="email"
                  placeholder="email address"
                  autocomplete="email"
                />
                <Button onClick={Formik.submitForm} type="submit" variant="primary"
                  disabled={!formik.isValid || formik.isSubmitting}
                  name="subscribe">
                  Subscribe to Newsletter
                </Button>
              </Grid>
              <Input name="honeypot" style={{display: "none", height: 0}}></Input>
            </FormikContext.Provider>
          </>)}
        </Formik>
      </div>
      </div>

    <footer
      sx={{
        color: "footer.text",
        backgroundColor: "footer.background",
        textAlign:
          (isLeft && "left") || (isRight && "right") || (isCenter && "center"),
        px: 3,
        py: 3,
        gridArea: "footer",
        a: {
          color: "footer.links",
        },
        variant: "variants.footer",
      }}
    >
      <div
        sx={{
          display: "grid",
          alignContent: "center",
          justifyContent:
            (isLeft && "start") || (isRight && "end") || (isCenter && "center"),
          width: "100%",
          maxWidth: "maxPageWidth",
          mx: "auto",
          my: 0,
        }}
      >
        <div
          sx={{
            a: {
              color: "footer.icons",
              mr: 3,
            },
            "a:last-of-type": {
              mr: 0,
            },
            "a:hover": {
              color: "primary",
            },
          }}
        >
          <IconContext.Provider value={{ size: theme.sizes.iconsFooter }}>
            <SocialFooter />
          </IconContext.Provider>
        </div>
        {/* {JSON.stringify(footerData.sanityFooterPage._rawBody)} */}
        <SanityContent data={footerData.sanityFooterPage._rawBody}/>
        <p sx={{ m: 0 }}> © {new Date().getFullYear()} {title} </p>
        <p sx={{ mb: 0 }}> <a href="https://baltimore-community-mediation.sanity.studio/" target="_blank">Edit this website</a></p>
      </div>
    </footer>
  </div>
  )
}

export default SiteFooter
