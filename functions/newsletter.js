const MailerLite = require('@mailerlite/mailerlite-nodejs').default;
const dateFormat = require('date-fns')
const GROUP_ID = '96428432853828661'; // Group Id for 'Newsletter Subscribers'

// TODO: use `node` CLI to get group ID
exports.process = async function(reqest){
    let mailerlite = new MailerLite({
        api_key: process.env.MAILER_LITE_API_KEY
    });
    try{
        let subscriber = await mailerlite.createOrUpdate({
            email: request.email,
            groups: [ GROUP_ID ],
        });

        return {
            statusCode: 200,
            header: { 'Contet-Type': 'application/json' },
            body: JSON.stringify({message: "SUCCESS", subscriber})
        }
    }catch(e){
        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({error: e.message})
        }
    } 
}

exports.handler = async function(event, context){
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

