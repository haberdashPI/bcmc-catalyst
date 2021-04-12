const { endOfYesterday } = require('date-fns')
const {google} = require('googleapis')

const creds = JSON.parse(process.env.GCP_CREDENTIALS)

exports.process = async function(request){
    const auth = new google.auth.GoogleAuth({
        credentials: creds,
        scopes: ['https://www.googleapis.com/auth/calendar']
    })

    const calendar = google.calendar({
        version: 'v3',
        auth: auth
    })

    let rawEvents
    try{
        rawEvents = await calendar.events.list({
            calendarId: request.id ,
            timeMin: request.startStr,
            timeMax: request.endStr,
            maxResults: 999,
            singleEvents: true,
            orderBy: 'startTime',
            timeZone: request.timeZone == 'local' ? undefined : request.timeZone
        })
    }catch(e){
        return {
            statusCode: 502,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({error: e.message})
        }
    }

    let parsedEvents
    try {
        parsedEvents = rawEvents.data.items.map(event => ({
            url: event.htmlLink,
            id: event.id,
            title: event.summary,
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date,
            allDay: event.endTimeUnspecified,
            location: event.location,
            extendedProps: {description: event.description}
        }))
        console.dir(parsedEvents)
    }catch(e){
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({error: e.message})
        }
    }

    return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({events: parsedEvents})
    }
}

exports.handler = async function(event, context) {
    let request
    try{
        request = JSON.parse(event.body)
    }catch(e){
        return {
            statusCode: 400,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({error: e.message})
        }
    }

    return await exports.process(request)
}