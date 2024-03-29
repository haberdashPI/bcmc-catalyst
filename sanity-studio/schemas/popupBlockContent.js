export default {
    title: "Popup Block Content",
    name: "popupBlockContent",
    type: "array",
    of: [
        {
            type: "figure",
            title: "Figure"
        },
        {
            type: "videoClip",
            title: "Video Clip"
        },
        {
            type: "buttonRow",
            title: "Buttons",
        },
        {
            title: "Block",
            type: "block",
            // Styles let you set what your user can mark up blocks with. These
            // corrensponds with HTML tags, but you can set any title or value
            // you want and decide how you want to deal with it where you want to
            // use your content.
            styles: [
                { title: "Normal", value: "normal" },
                // { title: "H1", value: "h1" },
                // { title: "H2", value: "h2" },
                // { title: "H3", value: "h3" },
                // { title: "H4", value: "h4" },
                { title: "Quote", value: "blockquote" },
            ],
            lists: [
                { title: "Bullet", value: "bullet" },
                { title: "Numbered", value: "number" },
            ],
            // Marks let you mark up inline text in the block editor.
            marks: {
                // Decorators usually describe a single property – e.g. a typographic
                // preference or highlighting by editors.
                decorators: [
                    { title: "Strong", value: "strong" },
                    { title: "Emphasis", value: "em" },
                    { title: "Inline Code", value: "code" },
                ],
                // Annotations can be any object structure – e.g. a link or a footnote.
                annotations: [
                    {
                        title: "URL",
                        name: "link",
                        type: "object",
                        fields: [
                            {
                                title: "URL",
                                name: "href",
                                type: "url",
                                validation: (Rule) =>
                                    Rule.uri({
                                        allowRelative: true,
                                        scheme: ["https", "http", "mailto", "tel"],
                                    }),
                            },
                            {
                                title: "Open in new tab?",
                                name: "blank",
                                description: "Read https://css-tricks.com/use-target_blank/",
                                type: "boolean",
                            },
                        ],
                    },
                ],
            },
        }
    ]
}