export default {
    name: "form",
    title: "Form",
    type: "object",
    description: "By default, requests contact information. Additional questions can be added below.",
    initialValue: {
        sendto: "info"
    },
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
        },
        {
            title: "Send to",
            name: "sendto",
            description: "Who should be notified of this form submission",
            type: "string",
            options: {
                list: [
                    {title: "Director", value: "director"},
                    {title: "Volunteer Coordinator", value: "volunteer"},
                    {title: "Mdiation Coordinator", value: "mediation"},
                    {title: "General Information", value: "info"}
                ],
                layout: 'dropdown'
            }
        }
    ]
}