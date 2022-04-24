/** @jsx jsx */
import { jsx, useThemeUI, Grid, Button, Themed } from "theme-ui"
import { Input } from "../../gatsby-theme-catalyst-sanity/components/sanity/formUtils"
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

  const footerData = useStaticQuery(graphql`
    query SanityFooterContent {
      sanityFooterPage(_id: {eq: "footerDocument"}) {
        id
        _rawBody
      }
    }
  `)

  // TODO: somewhere right about here, I need to insert the email subscription footer 
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

        <div id="mc_embed_signup" sx={{maxWidth: "maxContentWidth", mx: "auto", px: "1rem", bg: "background", borderRadius: "0.5rem"}}>
        <form action="https://communitymediation.us9.list-manage.com/subscribe/post?u=d98b0ee539e9411ceaea0d5b6&amp;id=0bd94d5a67" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>
          <Grid gap={4} sx={{mb: "1rem"}} columns={'2fr 1fr'}>
            <Input type="email" noFooter={true} name="EMAIL" placeholder="email address" id="mce-EMAIL"/>
            <Button type="submit" variant="primary" name="subscribe" id="mc-embedded-subscribe">Subscribe to Newsletter</Button>
          </Grid>
          <div id="mce-responses" class="clear">
            <div class="response" id="mce-error-response" style={{display: "none"}}></div>
            <div class="response" id="mce-success-response" style={{display: "none"}}></div>
          </div>    
            <div style={{position: "absolute", left: "-5000px"}} aria-hidden="true">
              <input type="text" name="b_d98b0ee539e9411ceaea0d5b6_0bd94d5a67" tabindex="-1" value=""/>
            </div>
        </form>
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
