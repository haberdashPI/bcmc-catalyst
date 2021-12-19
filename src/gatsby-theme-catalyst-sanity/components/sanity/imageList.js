/** @jsx jsx */
import { jsx, Themed, Button } from "theme-ui"
import { useStaticQuery, graphql, Link } from "gatsby"
import ButtonRow from './buttonRow'
import Figure from './figure'
import React from "react"
import { SanityContent } from "gatsby-theme-catalyst-sanity"

const ImageList = ({ node }) => {

    return (<React.Fragment>
        <Themed.h3 sx={{fontVariant: "small-caps"}}>{node.title}</Themed.h3>
    <div sx={{
        marginTop: "1rem",
        display: "grid",
        alignItems: "baseline",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gridGap: "1rem"
    }}>
        {node.items.map((item, i) => <div key={"item"+i}>
            {item.title && <Themed.h5 sx={{variant: "imageListTitle", fontFamily: "body", fontWeight: "bold"}}>
                {item.title}
            </Themed.h5>}
            {item.image && <Figure node={item.image}/>}
            <SanityContent data={item.content}/>
            {/* <pre>{JSON.stringify(item.content)}</pre> */}
            {item.buttons && <ButtonRow node={item.buttons}/>}
        </div>)}
    </div>
    </React.Fragment>)
}

export default ImageList