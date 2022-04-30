import React from 'react'
import getYouTubeId from 'get-youtube-id'
import YouTube from 'react-youtube'

const Preview = ({value}) => {
    const id = getYouTubeId(value.url)
    return (<YouTube videoId={id} />)
}

export default {
    name: "videoClip",
    title: "Video Clip",
    type: "object",
    description: "Insert an embedded video",
    fields: [
        {
            name: 'url',
            type: 'url',
            title: "YouTube Link",
            description: "Click 'Share' on the video you want from YouTube, copy the link and paste it here."
        },
        {
            name: 'alt',
            type: 'string',
            title: "Alternative Text ",
            description: "Describe the video for those without the ability to view it (e.g. slow connection, those who are blind).",
            validation: Rule =>
                Rule.error("You have to fill out the alternative text.").required(),
            
        },
    ],
    preview: {
        select: {
            url: 'url'
        },
        component: Preview
    }
}