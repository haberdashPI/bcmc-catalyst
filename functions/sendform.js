const sgMail = require('@sendgrid/mail')

const emailEndpoints = {
    volunteer: process.env.VOLUNTEER_EMAIL,
    mediation: process.env.MEDIATION_EMAIL
}

exports.process = async function(request){
    message = {
        to: emailEndpoints[request.formType],
        from: process.env.FROM_EMAIL,
        replyTo: request.replyTo || process.env.FROM_EMAIL,
        subject: request.subject,
        html: request.content
    }
    if(process.env.DEBUG_FORM_FUNCTION === "true"){
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({message: "SUCCESS", toSend: message})
        }
    }
    sgMail.setApiKey(process.env.SENDGRID_API_KEY)
    try {
        let result = await sgMail.send(message)
        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({message: "SUCCESS", sendGridResponse: result})
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
