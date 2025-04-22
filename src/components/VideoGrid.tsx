import { Video } from "../App";
import VideoPreview from "./VideoPreview";

const VideoGrid = ({ videos }: { videos: Video[] }) => {
    return (
        <div className="grid grid-cols-5 gap-4">
            {videos.map(video => <VideoPreview key={video.id} video={video} />)}
        </div>
    );
}

export default VideoGrid;
