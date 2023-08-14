/** @jsx jsx */
import { jsx, Box } from "theme-ui"
import { SanityContent } from "gatsby-theme-catalyst-sanity"
import { React, Fragment, useState } from "react"
import useCookie from 'react-use-cookie'

function sameDay(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
}

const Popup = ({node}) => {
    const [lastPopupDate, setLastPopupDate] = useCookie(`bcmc-popup-${node.id}`, 
                                                        new Date('1970-01-01'))
    const now = new Date()
    const [alertMessage, setAlertMessage] = useState({on: !sameDay(new Date(lastPopupDate), now)})
    const alertClick = (e) => {
        setAlertMessage({on: false})
        setLastPopupDate(new Date())
    }
    
    return (<Fragment>
        <Box sx={{
            position: "absolute",
            display: alertMessage.on ? "block" : "none",
            zIndex: 1001, top: "0", left: "0"
        }}>
            <Box sx={{
                position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh",
                zIndex: 1001, bg: "rgba(1,1,1,0.5)",
                backdropFilter: "blur(10px)"
            }} onClick={alertClick}>
                <Box sx={{
                    bg: "background", zIndex: 1002,
                    left: "50%", top: "50%", transform: "translate(-50%, -50%)",
                    width: "min(100vw, 40em)", height: "min(100vh, 20em)",
                    py: "2rem", 
                    px: "2rem", borderRadius: "0.5rem", opacity: 1, 
                    position: "fixed", boxShadow: "2px 2px 6px black",
                }}>
                    <Box sx={{position: "fixed", right: "0", top: "0", mx: "2rem", 
                              cursor: "pointer", 
                              my: "0.5rem", fontSize: "2rem"}} onClick={alertClick}>
                        ×
                    </Box>
                    <SanityContent data={node.content}/>
                </Box>
            </Box>
        </Box>
    </Fragment>)
}

export default Popup
