const sgMail = require('@sendgrid/mail')

const emailEndpoints = {
    volunteer: process.env.VOLUNTEER_EMAIL,
    mediation: process.env.MEDIATION_EMAIL
}

exports.process = async function(request){
    message = {
        to: emailEndpoints[request.formType],
        from: process.env.FROM_EMAIL,
        replyTo: request.replyTo,
        subject: request.subject,
        html: request.content
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    try {
        await sgMail.send(message)
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({message: "SUCCESS"})
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
