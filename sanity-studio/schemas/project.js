export default {
  name: "project",
  title: "Services",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Service Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    },
    {
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "This defines the services link on your website relative to the service path set in theme options via Gatsby. For example a slug of 'wicked-awesome' would end up at mysite.com/services/wicked-awesome' by default.",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: "body",
      title: "Service Description",
      type: "blockContent",
    },
  ],
}
