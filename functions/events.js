const {google} = require('googleapis')
const {}

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

    calendar.events.list({
        calendarId: 'david.frank.little@gmail.com' ,
        timeMin: (new Date()).toISOString(),
        maxResults: 10,
        singleEvents: true,
        orderBy: 'startTime',
    }, (err, res) => {
        if (err) return console.log('The API returned an error: ' + err);
        const events = res.data.items;
        if (events.length) {
            console.log('Upcoming 10 events:');
            events.map((event, i) => {
            const start = event.start.dateTime || event.start.date;
            const loc = event.location || '(none)';
            console.log(`${start} - ${event.summary} Location: ${loc}`);
            });
        } else {
            console.log('No upcoming events found.');
        }
    });
}