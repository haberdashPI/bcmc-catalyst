/** @jsx jsx */
import { jsx, Styled } from "theme-ui"
import Figure from "./figure"
import FigureWide from "gatsby-theme-catalyst-sanity/src/components/sanity/figure-wide"
import Code from "gatsby-theme-catalyst-sanity/src/components/sanity/code"
import Hero from "./hero"
import ButtonRow from "./buttonRow.js"
import ImageList from "./imageList.js"

const headerId = (id) => {
  return id
    .toString()
    .toLowerCase()
    .replace(/(^\s+|[^a-zA-Z0-9 ]+|\s+$)/g, "")
    .replace(/\s+/g, "-")
}

const serializers = {
  types: {
    code: Code,
    figure: Figure,
    figureWide: FigureWide,
    hero: Hero,
    buttonRow: ButtonRow,
    imageList: ImageList,
    block(props) {
      switch (props.node.style) {
        case "h1":
          return (
            <Styled.h1 sx={{fontVariant: "small-caps"}} id={headerId(props.children)}>
              {props.children}
            </Styled.h1>
          )
        case "h2":
          return (
            <Styled.h2 sx={{fontVariant: "small-caps"}} id={headerId(props.children)}>
              {props.children}
            </Styled.h2>
          )
        case "h3":
          return (
            <Styled.h3  sx={{fontVariant: "small-caps"}} id={headerId(props.children)}>
              {props.children}
            </Styled.h3>
          )
        case "h4":
          return (
            <Styled.h4  sx={{fontVariant: "small-caps"}} id={headerId(props.children)}>
              {props.children}
            </Styled.h4>
          )
        case "h5":
          return (
            <Styled.h5  sx={{fontVariant: "small-caps"}} id={headerId(props.children)}>
              {props.children}
            </Styled.h5>
          )
        case "h6":
          return (
            <Styled.h6  sx={{fontVariant: "small-caps"}} id={headerId(props.children)}>
              {props.children}
            </Styled.h6>
          )
        case "small":
          return <Styled.p sx={{ fontSize: 1 }}>{props.children}</Styled.p>
        case "smallest":
          return <Styled.p sx={{ fontSize: 0 }}>{props.children}</Styled.p>
        case "blockquote":
          return <Styled.blockquote>{props.children}</Styled.blockquote>
        default:
          return <Styled.p>{props.children}</Styled.p>
      }
    },
  },
  marks: {
    sup: ({ children }) => <sup>{children}</sup>,
    code: ({ children }) => <Styled.inlineCode>{children}</Styled.inlineCode>,
    link: ({ children, mark }) =>
      mark.blank ? (
        <Styled.a href={mark.href} target="_blank" rel="noopener noreferer">
          {children}
        </Styled.a>
      ) : (
        <Styled.a href={mark.href}>{children}</Styled.a>
      ),
  },
}

export default serializers
