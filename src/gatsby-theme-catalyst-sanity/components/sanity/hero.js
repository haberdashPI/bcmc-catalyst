/** @jsx jsx */
import { jsx, Styled } from "theme-ui"
import Img from "gatsby-image"
import { getFluidGatsbyImage } from "gatsby-source-sanity"
import { useSanityConfig } from "gatsby-theme-catalyst-sanity/src/components/sanity/use-sanity-config"

// TODO: create the hero component
export default ({ node }) => {
//   if (!node.asset) {
//     return null
//   }

  const { sanityProjectId, sanityDataset } = useSanityConfig()
  const sanityConfig = { projectId: sanityProjectId, dataset: sanityDataset }

  const fluidProps = getFluidGatsbyImage(
    node.images[0].asset._ref,

    { maxWidth: 1440 },
    sanityConfig
  )

  return (
    <div sx={{
        p: "1rem",
        paddingBottom: "3rem",
        position: "relative",
        width: "100vw",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        left: "50%",
        right: "50%",
        background: "#000",
        overflow: "hidden",
    }}>
        <div sx={{
                maxWidth: "900px",
                position: "absolute",
                top: "0px",
                marginLeft: "-450px",
                marginRight: "-450px",
                left: "50%",
                right: "50%",
                zIndex: 0,
            }}>
            <Img fluid={fluidProps}/>
        </div>
        <div sx={{
                position: "absolute",
                top: "0px",
                marginLeft: "-50vw",
                marginRight: "-50vw",
                left: "50%",
                right: "50%",
                zIndex: 1,
                height: "100%",
                background: "radial-gradient(circle at 50%, rgba(50,50,50,0.5), rgba(50,50,50,1) 400px)"
        }}>
        </div>
        <div
        sx={{
            maxWidth: "maxContentWidth",
            position: "relative",
            marginLeft: "auto",
            marginRight: "auto",
            zIndex: 2,
        }}>
            <Styled.h1 sx={{textShadow: "2px 2px 8px black", paddingBottom: "2rem", variant: "variants.heroTitle"}}>{node.title}</Styled.h1>
            <p sx={{textShadow: "1px 1px 3px black", color: "#eee", variant: "variants.heroContent"}}>{node.content}</p>
        </div>
    </div>
  )
}
