export default {
    name: "mediationRequest",
    title: "Mediation Request Form",
    type: "object",
    description: "By default the form includes fields for each person's phone, email and address, and it asks how the person would prefer to be contacted (which defaults to a phone call).",
    fields: [
        {
            title: "Email form to: ",
            name: "sendto",
            type: "string",
            description: "Form results will be sent to this email address."
        },
        {
            title: "Additional Questions",
            description: "Additional questions to include in the form can be specified here.",
            type: "array",
            of: [{type: "shortQuestion"}, {type: "longQuestion"}]
        },
        {
            title: "Additional Participant Questions",
            description: "Additional quesitons you would like asked about each additional participant included in the form can be specified here.",
            type: "array",
            of: [{type: "shortQuestion"}, {type: "longQuestion"}]
        }
    ]
}