/** @jsx jsx */
import { jsx, useThemeUI } from "theme-ui"
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

  return (
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
        <p sx={{ m: 0 }}>
          © {new Date().getFullYear()} {title}<br/>
          <a href="https://baltimore-community-mediation.sanity.studio/">Edit this website</a>
        </p>
      </div>
    </footer>
  )
}

export default SiteFooter
