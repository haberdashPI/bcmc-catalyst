export default {
    name: "question",
    title: "Question",
    type: "object",
    fields: [
        {
            title: "Question",
            name: "text",
            type: "string"
        },
        {
            title: "Answer Length",
            name: "length",
            type: "string",
            description: "How long of an answer are you looker for?",
            options: {
                list: [
                    { title: "Short", value: "short" },
                    { title: "Long", value: "long" }
                ]
            }
        },
        {
            title: "Identifier",
            name: "id",
            type: "string",
            description: "A unique id for this question, should only contain letters, numbers and '_' (no spaces!).",
            validation: (Rule) => Rule.required().error("You must specify an identifier").regex(/[a-z0-9_]+/).error("Identifier has invalid characters")
        }
    ],
}