export default {
    name: "imageListItem",
    title: "Item",
    type: "object",
    description: "One item with an image.",
    fields: [
        {
            title: "Title",
            name: "title",
            type: "string"
        },
        {
            title: "Content",
            name: "content",
            type: "text",
        },
        {
            title: "Buttons",
            name: "buttons",
            type: "buttonRow"
        },
        {
            title: "Image",
            name: "image",
            type: "figure",
        }
    ],
}