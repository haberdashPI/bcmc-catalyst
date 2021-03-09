export default {
    name: "pageButton",
    title: "Button to Page",
    type: "object",
    description: "A button linking to page on this website.",
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
            title: "Page",
            name: "link",
            type: "reference",
            to: [{type: "page"}]
        }
    ],
}