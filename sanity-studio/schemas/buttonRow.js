export default {
    name: "buttonRow",
    title: "Button Row",
    type: "object",
    description: "A list of buttons, each with a link to a pages or url.",
    fields: [
        {
            title: "Buttons",
            name: "buttons",
            type: "array",
            of: [{type: "pageButton"}, {type: "urlButton"}]
        },
        {
            title: "Alignment",
            name: "align",
            description: "How buttons should be oriented",
            type: "string",
            options: {
                list: [
                    { title: "Left", value: "left" },
                    { title: "Center", value: "center" },
                    { title: "Right", value: "right" },
                ],
                layout: 'radio'
            }
        },
    ],
    preview: {
        select: {
          buttons: 'buttons',
        },
        prepare(value) {
          const buttons = (value.buttons || [])
          return {
            title: value.buttons ? value.buttons.
                map(child => child.text).join(', ') : 'no buttons'
          }
        }
      }
}