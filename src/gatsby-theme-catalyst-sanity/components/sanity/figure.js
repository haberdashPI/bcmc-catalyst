/** @jsx jsx */
import { jsx } from "theme-ui"
import Img from "gatsby-image"
import { getFluidGatsbyImage, getFixedGatsbyImage } from "gatsby-source-sanity"
import { useSanityConfig } from "gatsby-theme-catalyst-sanity"

export default ({ node }) => {
  if (!node.asset) {
    return null
  }

  const { sanityProjectId, sanityDataset } = useSanityConfig()
  const sanityConfig = { projectId: sanityProjectId, dataset: sanityDataset }

  const circleWidth = 200
  const imgProps = node.shape !== "circle" ? getFluidGatsbyImage(
    node.asset._ref,
    { maxWidth: 900 },
    sanityConfig
  ) : getFixedGatsbyImage(
    node.asset._ref,
    { width: circleWidth, height: circleWidth },
    sanityConfig
  )

  const colorHash = node.asset._ref.replace('image-','').slice(0, 4)
  const colorNum = parseInt(colorHash, 16) % 3
  const defaultColor = ["primary", "secondary", "tertiary"][colorNum]

  const posHash = node.asset._ref.replace('image-','').slice(4, 8)
  const positionNum = parseInt(posHash, 16) % 2
  const defaultPosition = ["left", "right"][positionNum]
  const position = node.position ? node.position : defaultPosition

  const rightsx = {
    float: "right",
    position: "relative",
    ...(node.shape === "circle" ? { shapeOutside: "circle(50%)" } : {
      marginLeft: "2.5em",
      marginRight: "0em",
      marginBottom: "1em",
    }),
    width: node.shape === "circle" ? circleWidth+"px" : ["100%", null, "50%", null, null]
  }

  const leftsx = {
      ...(node.shape === "circle" ? { shapeOutside: "circle(50%)" } : {
      marginLeft: "0em",
      marginRight: "-0.5em",
      marginBottom: "1em",
    }),
    float: "left",
    position: "relative",
    width: node.shape === "circle" ? circleWidth+"px" : ["100%", null, "50%", null, null],
  }

  const centersx = {
    ...(node.shape === "circle" ? { shapeOutside: "circle(50%)" } : {
      marginLeft: "auto",
      marginRight: "auto",
      marginBottom: "1em",
    }),
    // float: "left",
    position: "relative",
    width: node.shape === "circle" ? circleWidth+"px" : ["100%", null, "75%", null, null],
  }

  return (
    <figure sx={
      position === "right" ? rightsx :
      position === "left" ? leftsx :
      position === "center" ? centersx :
      rightsx
    }>
        <div sx={node.border === "none" ? {} : {
          position: "absolute",
          top: node.shape === "circle" ? "-12px" : "0%",
          left: node.shape === "circle" ? "-12px" : "-5%",
          width: node.shape === "circle" ? "100%" : "90%",
          height: node.caption ? "calc(100% - 4rem)" : "100%",
          transform: position === "right" ? "rotate(-5deg)" : "rotate(5deg)",
          zIndex: 0,
          ...(node.shape === "circle" ? {} : {boxShadow: "1px 1px 2px"}),
          clipPath: node.shape === "circle" ? "circle()" : "none",
          backgroundColor: node.border === "primary" ? "primary" :
            node.border === "secondary" ? "secondary" :
            node.border === "tertiary" ? "tertiary" :
            defaultColor,
        }}></div>
        <div sx={node.shape === "circle" ?
          {filter: "drop-shadow(2px 2px 2px)"} :
          {}}>
        <Img
          sx={{
            minHeight: ["300px", "auto", null, null, null],
            variant: "variants.sanityFigure",
            ...(node.shape === "circle" ? {} : {boxShadow: "2px 2px 2px"}),
            ...(node.border === "none" ? {} : {
              paddingLeft: position === "right" ? "0%" : "5%",
              paddingRight: position === "right" ? "5%" : "0%",
              width: "80%",
              height: "80%",
              zIndex: 1,
              clipPath: node.shape === "circle" ? "circle()" : "none"
            }),
            // ...(position !== "center" ? {} : {
            //   height: "300px"
            // })
          }}
          alt={node.alt}
          {...(node.shape !== "circle" ? {fluid: imgProps} : {fixed: imgProps})}
        />
        </div>
        <div sx={{zIndex: 3}}>
        {node.caption && (
          <figcaption
            sx={{
              color: "grey",
              fontSize: "small",
              textAlign: "left",
              zIndex: 3,
              mt: "2rem",
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
