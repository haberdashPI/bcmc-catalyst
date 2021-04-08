const { endOfYesterday } = require('date-fns')
const {google} = require('googleapis')

const creds = JSON.parse(process.env.GCP_CREDENTIALS)

exports.handler = async function(event, context) {
    const auth = new google.auth.GoogleAuth({
        credentials: creds,
        scopes: ['https://www.googleapis.com/auth/calendar']
    })

    const calendar = google.calendar({
        version: 'v3',
        auth: auth
    })

    return await Promise.resolve(event.body).
        then(JSON.parse).
        then(request => calendar.events.list({
            calendarId: 'david.frank.little@gmail.com' ,
            timeMin: request.startStr,
            timeMax: request.endStr,
            maxResults: 999,
            singleEvents: true,
            orderBy: 'startTime',
            timeZone: request.timeZone == 'local' ? undefined : request.timeZone
        })).then(events => events.map(event => ({
            url: event.htmlLink,
            id: event.id,
            title: event.summary,
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date,
            allDay: event.endTimeUnspecified,
            location: item.location,
            description: item.description,
            attachments: item.attachments || [],
            extendedProps: (item.extendedProperties || {}).shared || {}
        }))).then(events => ({
            statusCode: 200,
            body: JSON.stringify(events)
        })).catch(err => ({
            statusCode: 400,
            body: JSON.stringify({error: err})
        }))
}