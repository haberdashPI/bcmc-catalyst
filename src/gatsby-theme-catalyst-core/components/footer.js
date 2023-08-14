/** @jsx jsx */ import { jsx, useThemeUI, Grid, Button, Themed } from "theme-ui"
import { Input } from "../../gatsby-theme-catalyst-sanity/components/sanity/formUtils"
import {
  useSiteMetadata,
  useCatalystConfig,
  SocialFooter,
} from "gatsby-theme-catalyst-core"
import { useStaticQuery, graphql } from "gatsby"
import { SanityContent } from "gatsby-theme-catalyst-sanity"
import { IconContext } from "react-icons"

  function ml_webform_success_7006652() {
    var $ = ml_jQuery || jQuery
    $(".ml-subscribe-form-7006652 .row-success").show()
    $(".ml-subscribe-form-7006652 .row-form").hide()
  }

const SiteFooter = () => {
  const { title } = useSiteMetadata()
  const { footerContentLocation } = useCatalystConfig()
  const { theme } = useThemeUI()
  const isLeft = footerContentLocation === "left"
  const isRight = footerContentLocation === "right"
  const isCenter = footerContentLocation === "center"

  const footerData = useStaticQuery(graphql`
    query SanityFooterContent {
      sanityFooterPage(_id: {eq: "footerDocument"}) {
        id
        _rawBody
      }
    }
  `)

  return (<div>
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
        <Formik onSubmit={v => {
          // TODO: setAlertMessage (alal `formUtils.js`)
          if(values.honeypot){
            return
          }
          let message = req.post('')
            .set('Authorization', `Bearer ${process.env.MAILER_LITE_API_KEY}`)
            .send()
        }}
          <Grid gap={4} sx={{mb: "1rem"}} columns={'2fr 1fr'}>
            <Input
              type="email"
              noFooter={true}
              name="fields[email]"
              placeholder="email address"
              data-inputmask=""
              autocomplete="email"
            />
            <Button onClick={onClickNewsletter} type="submit" variant="primary" name="subscribe">
              Subscribe to Newsletter
            </Button>

            </Grid>
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
