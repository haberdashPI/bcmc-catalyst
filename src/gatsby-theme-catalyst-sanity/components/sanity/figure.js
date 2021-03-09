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

  const colorHash = node.asset._ref.replace('image-','').slice(0, 4)
  const colorNum = parseInt(colorHash, 16) % 3
  const defaultColor = ["primary", "secondary", "tertiary"][colorNum]

  const posHash = node.asset._ref.replace('image-','').slice(4, 8)
  const positionNum = parseInt(posHash, 16) % 2
  const defaultPosition = ["left", "right"][positionNum]
  const position = node.position ? node.position : defaultPosition

  return (
    <figure
      sx={{
        marginLeft: position === "right" ? "2.5em": "0em",
        marginRight: position === "right" ? "0em": "-0.5em",
        float: position === "right" ? "right" : "left",
        width: "50%",
        position: "relative",
      }}
    >
        <div sx={node.border === "none" ? {} : {
          position: "absolute",
          top: "0%",
          left: "-5%",
          width: "90%",
          height: node.caption ? "85%" : "100%",
          transform: position === "right" ? "rotate(-5deg)" : "rotate(5deg)",
          zIndex: 0,
          backgroundColor: node.border === "primary" ? "primary" :
            node.border === "secondary" ? "secondary" :
            node.border === "tertiary" ? "tertiary" :
            defaultColor,
        }}></div>
        <Img
          sx={{
            minHeight: ["300px", "auto", null, null, null],
            variant: "variants.sanityFigure",
            ...(node.border === "none" ? {} : {
              paddingLeft: position === "right" ? "0%" : "5%",
              paddingRight: position === "right" ? "5%" : "0%",
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
