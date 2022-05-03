export default {
    name: "volunteerForm",
    title: "Volunteer Form",
    type: "object",
    description: "By default, requests contact information. Additional questions can be added below.",
    fields: [
        {
            title: "Submit message",
            name: "submit",
            description: "Message to display on a succesful submission.",
            type: "string",
        },
        {
            title: "Additional Questions",
            description: "Additional questions to include in the form.",
            name: "questions",
            type: "array",
            of: [{type: "question"}]
        }
    ]
}