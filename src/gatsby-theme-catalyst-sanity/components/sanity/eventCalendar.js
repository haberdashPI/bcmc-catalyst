import { jsx } from "theme-ui"
import React, { useState } from 'react'
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import listMonth from "@fullcalendar/list"
import req from "superagent";
import "./eventStyles.css"
import { format, isSameDay, differenceInHours } from 'date-fns'
import { cloneDeep } from 'lodash'
import {
    Box,
    Close,
    Button
} from 'theme-ui'
import { navigate } from "gatsby-link";
import { alpha } from "@theme-ui/color";

let eventCache = {}

function eventReqStr(info){
    return ":start:"+info.startStr+":end:"+info.endStr+":timeZone:"+info.timeZone
}

const readCalendarEventsFn = node => info => {
    const infoStr = eventReqStr(info)
    // cache retrieved events (very simple-minded!!) to avoid unncessary function calls
    // TODO: make the cache stale after a given number of minutes or something
    // to allow for new events to refresh at some point
    if(eventCache[infoStr]){
        return Promise.resolve(cloneDeep(eventCache[infoStr].value))
    }else {
        return req.post('/.netlify/functions/events')
            .send({
                id: node.calendar,
                startStr: info.startStr,
                endStr: info.endStr,
                timeZone: info.timeZone,
            })
            .set('Accept', 'application/json')
            .then(response => {
                if(response.body.error) throw Exception(response.body.error)
                eventCache[infoStr] = {value: cloneDeep(response.body.events)}
                return response.body.events
            })
    }
}

const DelList = ({items}) => {
    return (<dl>
        {(items.map(item => (<>
            <dt style={{
                float: "left",
                width: "3em",
                overflow: "hidden",
                clear: "left",
                textAlign: "left",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontWeight: "bold"
             }}>
                 {item.name}
            </dt>
            <dd style={{marginLeft: "4em"}}>{item.value}</dd>
        </>)))}
    </dl>)
}

function allDayTimes(start, end){
    return (isSameDay(start, end) ||
        (differenceInHours(end, start) == 24 && start.getHours() === 0))
}
function eventLabels(event){
    const start = !event.off && new Date(event.start)
    const end = !event.off && new Date(event.end)
    let labels = []

    if(event.allDay){
        if(allDayTimes(start, end)){
            labels.push({name: "Date", value: format(start, "MMMM do")})
        }else{
            labels.push({name: "Dates", value: (<>{format(start, "MMMM do")}&ndash;
                {format(end, "MMMM do")}</>)})
        }
    }else{
        labels.push({name: "Date", value: format(start, "MMMM do")})
        labels.push({name: "Time", value: (<>{format(start, "h:mm bbb")}&ndash;
            {format(end,   "h:mm bbb")}</>)})
    }
    event.location && labels.push({name: "Location", value: event.location})

    return labels
}

const EventDialog = ({event, eventDismiss}) => {
    return !event.off && (<Box sx={{
        position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh",
        zIndex: 1000, bg: alpha("background", 0.5),
        backdropFilter: "blur(20px)"
    }}
        onClick={eventDismiss}
    >
        <Box sx={{bg: "background", zIndex: 1010,
            display: "flex", backdropFilter: "none",
            transparency: 0,
            left: "50%", top: "50%", transform: "translate(-50%, -50%)" ,
            p: "2rem", borderRadius: "0.5rem", opacity: 1,
            justifyContent: "left", alignContent: "top",
            position: "fixed",
            flexDirection: "column",
            boxShadow: "2px 2px 6px black",
        }}>
            <Close sx={{m: "0", top: "0", right: "0",
                fontSize: 1,
                position: "absolute",
                p: "0.2em", m: "1em" }}
                onClick={eventDismiss}/>
            <h2>{event.title}</h2>
            <DelList items={eventLabels(event)}/>
            <Box sx={{
                width: "min(calc(100vw - 6em), 40em)", height: "min(calc(50vh - 6em), 15em)",
                overflowY: "scroll"
            }}>
                <span dangerouslySetInnerHTML={{ __html: event.extendedProps.description}}/>
            </Box>
            <Button sx={{m: "1rem", justifySelf: "center", alignSelf: "end"}}
                    type='button' variant="primary"
                    onClick={() => window.open(event.url,'_newtab')}>
                Open in Google Calendar
            </Button>
        </Box>
    </Box>)
}

const EventCalendar = ({node}) => {
    const [eventContent, setEventContent] = useState({off: true})

    return (<>
        <EventDialog event={eventContent}
            eventDismiss={() => setEventContent({off: true})}/>
        <FullCalendar plugins = {[ dayGridPlugin, listMonth ]}
            initialView="dayGridMonth"
            headerToolbar={{start: 'title', center: 'listMonth, dayGridMonth, dayGridWeek', end: 'today prev,next'}}
            events={readCalendarEventsFn(node)}
            eventClick={info => {
                info.jsEvent.preventDefault()
                setEventContent(info.event)
            }}/>
    </>)
}

export default EventCalendar