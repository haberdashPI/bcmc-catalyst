import { jsx } from "theme-ui"
import React from 'react'
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"

// TODO: we need to create a lambda function to retriev
// calendar events

const EventCalendar = ({node}) => {
    return (<FullCalendar plugins = {[ dayGridPlugin ]}
        initialView="dayGridMonth"
    />)
}

export default EventCalendar