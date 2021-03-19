export default {
    name: "volunteerForm",
    title: "Volunteer Form",
    type: "object",
    description: "By default, requests contact information. Additional questions can be added below.",
    fields: [
        {
            title: "Access key: ",
            name: "sendto",
            type: "string",
            description: "Go to https://www.staticforms.xyz/ to create an acess key, and type it in here."
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