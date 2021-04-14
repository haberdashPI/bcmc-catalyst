export default {
    widgets: [
      {
        name: "netlify",
        options: {
          title: "Website Deployment",
          sites: [
            {
              title: 'Preview of unpublished content',
              apiId: "92f86693-171a-4eae-b32b-925bed1030d6",
              buildHookId: "606e093a5f7042292bd931ff",
              name: 'sanity-preview',
              url: 'https://compassionate-swartz-da6171.netlify.app/',
            },
            {
              title: 'Published Website',
              apiId: "4a637246-0035-4966-9f57-83dd090eb52f",
              buildHookId: "60674707f6b18dba1434ef23",
              name: 'sanity-production',
              url: 'https://fervent-ritchie-c19b24.netlify.app/',
            }

          ]
        }
      },
    ],
  };