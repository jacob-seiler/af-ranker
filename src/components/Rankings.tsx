import { Video } from "../App";
import VideoPreview from "./VideoPreview";

const Rankings = ({ videos }: { videos: Video[] }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 justify-items-center">
            {videos.map((video, i) => <VideoPreview key={video.id} video={video} rank={i + 1} />)}
        </div>
    );
}

export default Rankings;
