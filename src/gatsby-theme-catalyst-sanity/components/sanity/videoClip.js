/** @jsx jsx */
import { jsx, Box } from "theme-ui"
import YouTube from 'react-youtube'
import getYouTubeId from 'get-youtube-id'

const VideoClip = ({node}) => {
    const id = getYouTubeId(node.url)
    return (<Box sx={{m: "1rem", display: "flex", justifyContent: "center"}}>
        <YouTube videoId={id}/>
    </Box>)
}
export default VideoClip