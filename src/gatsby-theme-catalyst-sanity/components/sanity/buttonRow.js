/** @jsx jsx */
import { jsx, Styled } from "theme-ui"

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
                    href={"/"+b.link.slug}>
                    {b.text}
                </Styled.a>
            )
        )}
    </div>)
}