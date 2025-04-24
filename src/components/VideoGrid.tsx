import { Video } from "../App";
import VideoPreview from "./VideoPreview";

const VideoGrid = ({
  videos,
  onClick,
}: {
  videos: Video[];
  onClick: (id: string) => void;
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 justify-items-center">
      {videos.map((video) => (
        <VideoPreview
          key={video.id}
          video={video}
          onClick={() => onClick(video.id)}
        />
      ))}
    </div>
  );
};

export default VideoGrid;
