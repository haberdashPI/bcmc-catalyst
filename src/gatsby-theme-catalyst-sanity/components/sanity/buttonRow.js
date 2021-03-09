/** @jsx jsx */
import { jsx, Styled } from "theme-ui"

// TODO: create a static query that list of all available page slugs
// and use that to resolve the reference

export default ({ node }) => {
    return (<div>
        {node.buttons.map(b =>
            b._type === "urlButton" ? (
                <Styled.a sx={{variant: "button-"+(b.type || "primary")}}
                    href={b.link}>
                    {b.text}
                </Styled.a>
            ) : (
                <Styled.a sx={{variant: "button-"+(b.type || "primary")}}
                    href={"/"+b.link._ref}>
                    {b.text}
                </Styled.a>
            )
        )}
    </div>)
}