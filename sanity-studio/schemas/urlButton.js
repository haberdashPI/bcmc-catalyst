export default {
    name: "urlButton",
    title: "Button to URL",
    type: "object",
    description: "A button linking to an external url.",
    fields: [
        {
            title: "Text",
            name: "text",
            type: "string"
        },
        {
            title: "Button Type",
            name: "type",
            description: "What the button should look like",
            type: "string",
            options: {
                list: [
                    { title: "Primary Color", value: "primary" },
                    { title: "Secondary Color", value: "secondary" },
                    { title: "Tertiary Color", value: "tertiary" },
                ],
                layout: 'radio'
            }
        },
        {
            title: "URL",
            name: "link",
            type: "url",
            validation: Rule => Rule.uri({
                scheme: ['http', 'https', 'mailto', 'tel']
            })
        }
    ],
}