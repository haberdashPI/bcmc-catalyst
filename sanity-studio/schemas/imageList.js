export default {
    name: "imageList",
    title: "Image List",
    type: "object",
    description: "A list of items (displayed in a grid), with images for each item",
    fields: [
        {
            title: "Title",
            name: "title",
            type: "string",
        },
        {
            title: "Items",
            name: "items",
            type: "array",
            of: [{type: "imageListItem"}]
        },
    ],
    preview: {
        select: {
          buttons: 'items',
          title: 'title'
        },
        prepare(value) {
          const items = (value.items || [])
          return {
            media: value.items ? value.items.map(child => child.image) : 'no buttons',
            title: value.title
          }
        }
      }
}