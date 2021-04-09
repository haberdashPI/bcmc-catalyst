export default {
    name: "newsletter",
    title: "Mailchimp Newsletter",
    type: "object",
    description: "Display mailchimp messages",
    fields: [
        {
            title: "Filter",
            name: "filter",
            type: "string",
            description: "If left blank, include all mailchimp messages ('Campaigns' as mailchimp calls them). You can add text here and only messages that include this text in the subject line will be displayed."
        },
    ]
}