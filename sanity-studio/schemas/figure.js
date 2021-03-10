export default {
  name: "figure",
  title: "Image",
  type: "image",
  options: {
    hotspot: true,
  },
  fields: [
    {
      title: "Caption",
      name: "caption",
      description: "Leave blank if you do not want a caption",
      type: "string",
      options: {
        isHighlighted: true,
      },
    },
    {
      name: "alt",
      type: "string",
      title: "Alternative text",
      validation: Rule =>
        Rule.error("You have to fill out the alternative text.").required(),
      description: "Important for SEO and accessiblity.",
      options: {
        isHighlighted: true,
      },
    },
    {
      name: "position",
      type: "string",
      title: "Image Position",
      options: {
        isHighlighted: true,
        list: [
          { title: "Left", value: "left" },
          { title: "Right", value: "right" },
          { title: "Center", value: "center" }
        ]
      }
    },
    {
      name: "border",
      type: "string",
      title: "Image Border",
      options: {
        isHighlighted: true,
        list: [
          { title: "Normal", value: "normal" },
          { title: "None", value: "none" },
          { title: "Primary", value: "primary" },
          { title: "Secondary", value: "secondary" },
          { title: "Tertiary", value: "tertiary" }
        ]
      }
    },
    {
      name: "shape",
      type: "string",
      title: "Shape",
      options: {
        isHighlighted: true,
        list: [
          { title: "Square", value: "square" },
          { title: "Circle", value: "circle" }
        ]
      }
    }
  ],
  preview: {
    select: {
      imageUrl: "asset.url",
      title: "alt",
      media: "media",
    },
  },
}
