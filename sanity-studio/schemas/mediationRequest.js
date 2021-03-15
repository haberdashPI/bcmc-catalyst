export default {
    name: "mediationRequest",
    title: "Mediation Request Form",
    type: "object",
    fields: [
        {
            title: "Email form to: ",
            name: "sendto",
            type: "string",
            description: "Form results will be sent to the given email address."
        }
        // TODO: allow additional questions to be inserted into the form here
        // TODO: allow additional field sfor each particiapnt to be inserted into the form
        // here
    ]
}