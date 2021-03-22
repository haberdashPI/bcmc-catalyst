/** @jsx jsx */
import { jsx, Styled, Button } from "theme-ui"
import { useStaticQuery, graphql, Link } from "gatsby"
import { useSlugIndex } from "./util"

const ButtonRow = ({ node }) => {
    const slugs = useSlugIndex()

    return (
        <div sx={{display: "block", minHeight: "2.5em"}}>
    <div sx={
        node.align === "left" ? {display: "block", float: "left"} :
        node.align === "right" ? {display: "block", float: "right"} :
        node.align === "center" ? {
            display: "flex",
            justifyContent: "center",
        } : {float: "left"}}>
        {node.buttons && node.buttons.map((b, i) =>
            <Button key={"button"+i} sx={{px: "1em", my: "0.5em", mx: "0.5em", bg: (b.type || "primary")}}>
            {b._type === "urlButton" ? (
                <Styled.a sx={{variant: "buttonLink."+(b.type || "primary"), textDecoration: "none", ":hover": {textDecoration: "none"}}}
                    href={b.link}>
                    {b.text}
                </Styled.a>
            ) : (
                <Link sx={{variant: "buttonLink."+(b.type || "primary"), textDecoration: "none"}}
                    to={b.link && slugs[b.link._ref]}>
                    {b.text}
                </Link>
            )}
            </Button>
        )}
        </div>
    </div>)
}

export default ButtonRow