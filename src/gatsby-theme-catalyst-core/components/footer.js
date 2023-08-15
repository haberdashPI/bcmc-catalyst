/** @jsx jsx */ import { jsx, useThemeUI, Grid, Button, Themed } from "theme-ui"
import { Input, useAlert, FormikContext } from "../../gatsby-theme-catalyst-sanity/components/sanity/formUtils"
import React from 'react'
import { Formik } from "formik"
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

  // const [Alert, setAlertLoading, setAlertMessage, setAlertOff] = useAlert();

  const footerData = useStaticQuery(graphql`
    query SanityFooterContent {
      sanityFooterPage(_id: {eq: "footerDocument"}) {
        id
        _rawBody
      }
    }
  `)

  function submitNewsEmail(values) {
    console.dir(values)
    if(values.honeypot){
      return
    }
    if(process.env.FORM_SUBMISSION !== "debug"){
      try{
        let resp = req.post('/.netlify/functions/newsletter')
          .send(values)
          .set('Accept', 'application/json')
        if(resp.body.error){
          showAlert(resp.body.error)
        }else if(resp.body.message == "SUCCESS"){
          showAlert("You've be added to the newsletter!")
        }else{
          throw Exception("Unexpected response: "+JSON.stringify(resp))
        }
      } catch (e) {
        console.dir(e)
        showAlert("Internal error: "+e.message, true)
      }
    } else {
      alert(JSON.stringify(values))
      showAlert("You've been added to the newsletter!")
    }
  }

  return (<div>
      {/* <Alert/> */}
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
          // TODO: validation?
          >
          {formik => (<>
            <FormikContext.Provider value={formik}>
              <Grid as='form' onSubmit={formik.handleSubmit} gap={4} sx={{ mb: "1rem" }} 
                    columns={'2fr 1fr'}>
                <Input
                  type="email"
                  noFooter={true}
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
            </FormikContext.Provider>
            <Input name="honeypot" style={{display: "none", height: 0}}></Input>
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
