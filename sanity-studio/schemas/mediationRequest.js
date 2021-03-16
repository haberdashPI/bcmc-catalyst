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
            description: "Additional questions to include in the form.",
            name: "info_questions",
            type: "array",
            of: [{type: "question"}]
        },
        {
            title: "Additional Participant Questions",
            description: "Additional quesitons you would like asked for each additional participant.",
            name: "part_questions",
            type: "array",
            of: [{type: "question"}]
        }
    ]
}