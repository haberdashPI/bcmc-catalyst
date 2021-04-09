import { jsx } from "theme-ui"
import React from 'react'
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import req from "superagent";
import "./eventStyles.css"

// TODO: we need to create a lambda function to retriev
// calendar events

const readCalendarEventsFn = node => info => {
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
            console.dir(response.body.events)
            return response.body.events
        })
}

const EventCalendar = ({node}) => {
    return (<FullCalendar plugins = {[ dayGridPlugin ]}
        initialView="dayGridMonth"
        events={readCalendarEventsFn(node)}
    />)
}

export default EventCalendar