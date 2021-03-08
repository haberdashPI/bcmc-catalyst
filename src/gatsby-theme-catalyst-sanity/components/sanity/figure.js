/** @jsx jsx */
import { jsx } from "theme-ui"
import Img from "gatsby-image"
import { getFluidGatsbyImage } from "gatsby-source-sanity"
import { useSanityConfig } from "gatsby-theme-catalyst-sanity"

export default ({ node }) => {
  if (!node.asset) {
    return null
  }

  const { sanityProjectId, sanityDataset } = useSanityConfig()
  const sanityConfig = { projectId: sanityProjectId, dataset: sanityDataset }

  const fluidProps = getFluidGatsbyImage(
    node.asset._ref,
    { maxWidth: 1440 },
    sanityConfig
  )

  return (
    <figure
      sx={{
        marginLeft: node.position === "right" ? "2.5em": "0em",
        marginRight: node.position === "right" ? "0em": "1em",
        float: node.position === "right" ? "right" : "left",
        width: "50%",
        position: "relative",
      }}
    >
        <div sx={node.border === "none" ? {} : {
          position: "absolute",
          top: "0%",
          left: "-5%",
          width: "90%",
          height: "85%",
          transform: node.position === "right" ? "rotate(-5deg)" : "rotate(5deg)",
          zIndex: 0,
          backgroundColor: node.border === "primary" ? "primary" :
            node.border === "secondary" ? "secondary" :
            node.border === "tertiary" ? "tertiary" :
            "primary",
        }}></div>
        <Img
          sx={{
            minHeight: ["300px", "auto", null, null, null],
            variant: "variants.sanityFigure",
            ...(node.border === "none" ? {} : {
              paddingLeft: node.position === "right" ? "0%" : "5%",
              paddingRight: node.position === "right" ? "5%" : "0%",
              width: "80%",
              height: "80%",
              zIndex: 1
            })
          }}
          fluid={fluidProps}
          alt={node.alt}
        />
        <div sx={{zIndex: 3}}>
        {node.caption && (
          <figcaption
            sx={{
              color: "grey",
              fontSize: "small",
              textAlign: "center",
              zIndex: 3,
              mt: "5%",
              pr: "15%",
            }}
          >
            {node.caption}
          </figcaption>
        )}
        </div>
    </figure>
  )
}
