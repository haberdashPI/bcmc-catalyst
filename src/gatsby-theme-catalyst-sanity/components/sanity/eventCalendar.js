import { jsx, Themed } from "theme-ui"
import React, { useEffect, useState } from 'react'
import { /* MonthlyDay, MonthlyBody, */ MonthlyNav, DefaultMonthlyEventItem, MonthlyCalendar } from '@zach.codes/react-calendar'
import { MonthlyBody, MonthlyDay } from './calendarBody'
import { subHours, format, isSameDay, differenceInHours, endOfMonth, startOfMonth, startOfDay, endOfDay, isBefore, isAfter, differenceInDays } from 'date-fns'
import { cloneDeep, range } from 'lodash'
import {
    Box,
    Close,
    Button,
    Spinner
} from 'theme-ui'
import { navigate } from "gatsby-link";
import { alpha } from "@theme-ui/color";
import request from "superagent"
import theme from "gatsby-theme-catalyst-core/src/gatsby-plugin-theme-ui"
import '@zach.codes/react-calendar/dist/calendar-tailwind.css';

let eventCache = {}

function eventReqStr(info){
    return ":start:"+info.startStr+":end:"+info.endStr+":timeZone:"+info.timeZone
}

function cleanupEventRange(range){
    if(range instanceof Array){
        const min = range.reduce((curmin, val) => isBefore(val, curmin) ? val : curmin)
        const max = range.reduce((curmax, val) => isAfter(val, curmax) ? val : curmax)
        return {
            startStr: startOfDay(min).toISOString(),
            endStr: endOfDay(max).toISOString()
        }
    }else{
        return {
            startStr: range.start.toISOString(),
            endStr: range.end.toISOString()
        }
    }
}

function readCalendarEvents(node, info){
    info = cleanupEventRange(info)
    // TODO: convert to endStr and startStr values (arrays need
    // to be converted to a range)
    if(!node.calendar){ return Promise.resolve([]) }
    const infoStr = eventReqStr(info)
    // cache retrieved events (very simple-minded!!) to avoid unncessary function calls
    // TODO: make the cache stale after a given number of minutes or something
    // to allow for new events to refresh at some point
    if(eventCache[infoStr] &&
        differenceInHours(eventCache[infoStr].stored, new Date(Date.now())) < 1){
        return Promise.resolve(cloneDeep(eventCache[infoStr].value))
    }else {
        return request.post('/.netlify/functions/events')
            .send({
                id: node.calendar,
                startStr: info.startStr,
                endStr: info.endStr,
                // timeZone: info.timeZone,
            })
            .set('Accept', 'application/json')
            .then(response => {
                if(response.body.error) throw Exception(response.body.error)
                const events = response.body.events.map(x => ({
                    ...x,
                    start: new Date(x.start),
                    end: new Date(x.end)
                }))
                eventCache[infoStr] = {
                    value: cloneDeep(events),
                    stored: new Date(Date.now())
                }
                return events
            })
    }
}

const DelList = ({items}) => {
    return (<dl>
        {(items.map((item,i) => (<span key={"item"+i+"_span"}>
            <dt key={"item_"+i} style={{
                float: "left",
                width: "5.5em",
                overflow: "hidden",
                clear: "left",
                textAlign: "left",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                fontWeight: "bold"
             }}>
                 {item.name}
            </dt>
            <dd key={"item_"+i+"_value"} style={{marginLeft: "6em"}}>{item.value}</dd>
        </span>)))}
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

function extractLabel(str, entry, labels){
    str = str.replace(/(<br>|<br\/>)/g, "\n")
    const regexstr = "^\\s*"+entry.name+(entry.value || ":(.*)$")
    const regex = new RegExp(regexstr, "m")
    const match = str.match(regex)
    const value = match ? match[1].replace(/^\s+/,"") : ""
    if(match && (entry.store === undefined || entry.store)){
        labels.push({name: entry.name, value: value})
    }
    const newstr = str.replace(RegExp(regexstr, "mg"), "")

    return [newstr, labels, value]
}


function extractDescription(raw){
    if(!raw) return {labels: [], zoomLink: "", raw}
    raw = raw.replace(/^Time:.*$/, "")
    let labels = []

    let zoomLink = ""
    let value = ""
    for(let label of [
        {name: "Topic", store: false},
        {name: "Meeting ID"},
        {name: "Passcode"},
        {name: "Time", store: false},
        {name: "Join Zoom Meeting", value: "\\n.*(https://[^\n<]+).*\n", store: false}]){

        [raw, labels, value] = extractLabel(raw, label, labels)
        if(label.name === "Join Zoom Meeting"){
            zoomLink = value
        }
    }

    return {labels, zoomLink, description: raw.
        replace(/\n{3,}/g, '\n\n').
        replace(/^\n+/,"").
        replace(/\n+$/,"").
        replaceAll("\n", "<br/>")}
}

const EventDialog = ({event, eventDismiss}) => {
    if(event.off) return null;
    let {labels, description, zoomLink} = extractDescription(event.extendedProps.description)
    return !event.off && (<Box sx={{
        position: "fixed", top: "0", left: "0", width: "100vw", height: "100vh",
        zIndex: 1000, bg: 'rgba(1,1,1,0.5)', //alpha("background", 0.5),
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
        }}
            onClick={e => e.preventDefault()}
        >
            <Close sx={{m: "0", top: "0", right: "0",
                fontSize: 1,
                position: "absolute",
                p: "0.2em", m: "1em" }}
                onClick={eventDismiss}/>
            <Themed.h3 sx={{mb: "0.1em", fontVariant: "small-caps"}}>{event.title}</Themed.h3>
            <Box>
                <Box sx={{
                    width: "min(calc(100vw - 6em), 40em)", height: "min(calc(50vh - 6em), 15em)",
                    overflowY: "scroll"
                }}>
                <DelList items={[...eventLabels(event), ...labels]}/>
                    <span dangerouslySetInnerHTML={{ __html: description }}/>
                </Box>
                <Button sx={{m: "1rem", justifySelf: "center", alignSelf: "end"}}
                        type='button' variant="primary"
                        onClick={() => window.open(event.url,'_newtab')}>
                    Open in Google
                </Button>
                {zoomLink && <Button sx={{m: "1rem", justifySelf: "center", alignSelf: "end"}}
                        type='button' variant="secondary"
                        onClick={() => window.open(zoomLink,'_blank')}>
                    Goto Zoom Meeting
                </Button>}
            </Box>
        </Box>
    </Box>)
}

const viewIds = {
    "list": "agenda",
    "month": "month",
    "week": "week"
}

const EventCalendar = ({node}) => {
    const [eventContent, setEventContent] = useState({off: true})
    const html = document.querySelector('html')
    useEffect(() => {
        !eventContent.off ? (html.style.overflow = 'hidden') : (html.style.overflow = 'visible')
    }, [eventContent.off])

    const [eventList, setEventList] = useState({
        items: [],
        month: startOfMonth(new Date()),
        request: false,
        loaded: false
    })
    if(!eventList.request){ requestMonth(eventList.month) }

    function requestMonth(month){
        setEventList({items: [], request: true, loaded: false, month: month})
        readCalendarEvents(node, {
            start: month,
            end: endOfMonth(month)
        }).then(events => setEventList({
            items: events,
            request: true,
            loaded: true,
            month: month,
        }))
    }

    let events = eventList.items.map(e => {
        const days = differenceInDays(e.end, e.start) > 1
        if(days > 1){
            return range(0, days).map(d => ({
                title: e.title, date: addDays(startOfDay(e.start), d)
            }))
        }else{
            return [{title: e.title, date: startOfDay(e.start)}]
        }
    }).flat()

    let [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()));

    return (<>
        <EventDialog event={eventContent}
            eventDismiss={() => setEventContent({off: true})}/>
        <Box sx={{
            m: "1em",
            position: "relative",
            width: ["100vw", null, null, "85vw", "80vw"],
            left: "50%",
            right: "50%",
            marginLeft: ["-50vw", null, null, "-42.5vw", "-40vw"],
            marginRight: ["-50vw", null, null, "-42.5vw", "-40vw"],
        }}>
            {eventList.request && !eventList.loaded && <Box sx={{
                position: "absolute",
                left: "50%", bottom: "50%", transform: "translate(-50%, -50%)",
                zIndex: 100,
            }}>
                <Spinner/>
            </Box>}
            <MonthlyCalendar currentMonth={eventList.month}
                onCurrentMonthChange={date => requestMonth(startOfMonth(date))}>

                <MonthlyNav/>
                <MonthlyBody events={eventList.items.map((e, eid) => {
                    const days = differenceInDays(e.end, e.start) > 1
                    if(days > 1){
                        return range(0, days).map(d => ({
                            allday: true,
                            eventId: eid,
                            title: e.title, date: addDays(startOfDay(e.start), d)
                        }))
                    }else{
                        return [{title: e.title, date: e.start, eventId: eid}]
                    }
                }).flat()}>
                <MonthlyDay
                    renderDay={ data => data.map((item, i) =>
                        <DefaultMonthlyEventItem
                            key={i}
                            title={
                                // TODO: revise the style
                                <Themed.a onClick={
                                e => setEventContent(eventList.items[item.eventId])}>
                                    {item.title}
                                </Themed.a>}
                            date={!item.allday && format(item.date, 'hh:mm')}/>
                    ) }/>
                </MonthlyBody>
            </MonthlyCalendar>
        </Box>
    </>)
}

export default EventCalendar