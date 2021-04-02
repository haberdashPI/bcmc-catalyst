export default {
    name: "eventCalendar",
    title: "Event Calendar",
    type: "object",
    description: "Create a list of events from a google clanedar.",
    fields: [
        {
            title: "Calendar ID",
            name: "sendto",
            type: "string",
            description: "In your google calendar, open settings (the gear), click on a calendar, and scroll down, to find this ID (under the heading 'Integrate Calendar'). The calendar needs to be made public for it to be visible on the website."
        },
        {
            title: "Default View",
            name: "default_view",
            type: "string",
            options: {
                list: [
                    { title: "List", value: "list" },
                    { title: "Month", value: "month" },
                    { title: "Week", value: "week" },
                ]
            }
        }
    ]
}