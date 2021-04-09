import { jsx } from "theme-ui"
import React from 'react'

// TODO: we need to create a lambda function to retriev
// calendar events

const Events = ({node}) => {
    const eventData = useStaticQuery(graphql`
    query EventData {
        allMailchimpCampaign( filter: {
            status: { eq: "sent" },
            settings: {
            title: { ne: "" }
        }}){
            edges {
                node {
                    settings {
                        preview_text
                        subject_line
                        title
                    }
                    campaignId
                    send_time(formatString: "MMMM DD, YYYY")
                    status
                }
            }
        }
    }
    `)
    const campaigns = data.allMailchimpCampaign.edges
        .filter(hasKeywordsFn(node.filter))
        .sort((a,b) => new Date(a.node.send_time) < new Date(b.node.send_time))

    return (<>{campaigns.map(c => {
        <div key={c.node.send_time}>
            <small>{c.node.send_time}</small>
            <h3>
                <Link href={`/events/${c.node.campaignId}`}>
                    {c.node.settings.title}
                </Link>
            </h3>
            {node.settings.preview_text && <p>
                {node.settings.preview_text}
            </p>}
        </div>
    })}</>)
}

export default Events