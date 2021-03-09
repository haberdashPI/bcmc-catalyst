/** @jsx jsx */
import { jsx, Styled, Button } from "theme-ui"
import { useStaticQuery, graphql, Link } from "gatsby"

const ButtonRow = ({ node }) => {
    const result = useStaticQuery(graphql`
        query PageSlugQuery {
            allSanityPage {
                nodes {
                    _rawSlug
                    _id
                }
            }
        }
    `)
    var slugs = {}

    result.allSanityPage.nodes.forEach(node => {
        slugs[node._id] = node._rawSlug.current.replace(/^\/*/, `/`)
    })

    return (
        <div sx={{display: "block", minHeight: "2.5em"}}>
    <div sx={
        node.align === "left" ? {display: "block", float: "left"} :
        node.align === "right" ? {display: "block", float: "right"} :
        node.align === "center" ? {
            display: "block",
            marginLeft: "auto",
            marginRight: "auto",
        } : {float: "left"}}>
        {node.buttons.map(b =>
            <Button sx={{px: "1em", my: "0.25em", mx: "0.5em", bg: b.type || "primary"}}>
            {b._type === "urlButton" ? (
                <Styled.a sx={{color: "white", textDecoration: "none", variant: "buttonLink", ":hover": {textDecoration: "none"}}}
                    href={b.link}>
                    {b.text}
                </Styled.a>
            ) : (
                <Link sx={{color: "white", textDecoration: "none", variant: "buttonLink"}}
                    to={slugs[b.link._ref]}>
                    {b.text}
                </Link>
            )}
            </Button>
        )}
        </div>
    </div>)
}

export default ButtonRow