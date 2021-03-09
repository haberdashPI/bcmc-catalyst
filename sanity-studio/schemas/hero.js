export default {
    name: "hero",
    title: "Hero Section",
    type: "object",
    description: "A hero section is a large, highly visible region of text and (usually an image), usually appearing at the top of a home page.",
    fields: [
        {
        title: "Title",
        name: "title",
        description: "The title of the hero section",
        type: "string",
        },
        {
            title: "Content",
            name: "content",
            type: "text"
        },
        {
            title: "Background Images",
            name: "images",
            type: "array",
            of: [{type: "image"}]
        }
    ],
    preview: {
        select: {
          title: 'title',
          images: 'images',
        },
        prepare(value) {
          const images = (value.images || [])
          return {
            title: value.title,
            media: images[0]
          }
        }
      }
}