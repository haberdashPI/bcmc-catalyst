/** @jsx jsx */
import { jsx, Styled } from "theme-ui"
import Img from "gatsby-image"
import { getFluidGatsbyImage } from "gatsby-source-sanity"
import { useSanityConfig } from "gatsby-theme-catalyst-sanity/src/components/sanity/use-sanity-config"
import Slider from "react-slick"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/* Randomize array in-place using Durstenfeld shuffle algorithm */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
  return array
}

// TODO: create the hero component
export default ({ node }) => {
//   if (!node.asset) {
//     return null
//   }

  const { sanityProjectId, sanityDataset } = useSanityConfig()
  const sanityConfig = { projectId: sanityProjectId, dataset: sanityDataset }

  const fluidProps = node.images && shuffleArray(node.images).map(image => getFluidGatsbyImage(
    image.asset._ref,
    { maxWidth: 900 },
    sanityConfig
  ))

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
        marginBottom: "3rem",
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
          {fluidProps &&
          <Slider dots={false} infinite={true} lazyLoad={'ondemand'} fade={true} cssEase="ease-in" speed={2000} arrows={false} autoplay={true} autoplaySpeed={6000}>
            {fluidProps.map((props, i) => <Img key={"image"+i} fluid={props}/>)}
          </Slider>}
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
