/** @jsx jsx */
import { jsx, Styled, Button } from "theme-ui"
import { useStaticQuery, graphql, Link } from "gatsby"
import ButtonRow from './buttonRow'
import Figure from './figure'
import React from "react"

const ImageList = ({ node }) => {

    return (<React.Fragment>
        <Styled.h3 sx={{fontVariant: "small-caps"}}>{node.title}</Styled.h3>
    <div sx={{
        marginTop: "1rem",
        display: "grid",
        alignItems: "baseline",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gridGap: "1rem"
    }}>
        {node.items.map(item => <div>
            {item.image && <Figure node={item.image}/>}
            {item.title && <Styled.h5 sx={{variant: "imageListTitle", fontFamily: "body", fontWeight: "bold"}}>
                {item.title}
            </Styled.h5>}
            <p>{item.content}</p>
            {item.buttons && <ButtonRow node={item.buttons}/>}
        </div>)}
    </div>
    </React.Fragment>)
}

export default ImageList