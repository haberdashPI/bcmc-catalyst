/** @jsx jsx */
import { jsx, Themed, Link, Button } from "theme-ui"
import { useStaticQuery, graphql, Link as GatsbyLink, navigate } from "gatsby"
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
            <Button key={"button"+i}
                {...(b._type === "urlButton" ? {
                    as: b._type === "urlButton" ? Themed.a : GatsbyLink,
                    href: b.link,
                    target: "_blank",
                } : {
                    as: GatsbyLink,
                    to: b.link && slugs[b.link._ref]
                })}
                variant={(b.type || "primary")}
                sx={{
                    // bg: (b.type || "primary")
                }}>
                    {b.text}
            </Button>)}
        </div>
    </div>)
}

export default ButtonRow