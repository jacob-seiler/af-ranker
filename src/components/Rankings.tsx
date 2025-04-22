import { Video } from "../App";
import VideoPreview from "./VideoPreview";

const Rankings = ({ videos }: { videos: Video[] }) => {
    return (
        <div className="grid grid-cols-5 gap-4">
            {videos.map((video, i) => <VideoPreview key={video.id} video={video} rank={i + 1} />)}
        </div>
    );
}

export default Rankings;
