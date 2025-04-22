import { Video } from "../App";

const InnerVideoPreview = ({
  video,
  rank,
}: {
  video: Video;
  rank?: number;
}) => {
  return (
    <div className="relative">
      {rank && <div className="bg-red-500 w-14 h-14 rounded-full text-center absolute top-1 left-1 text-white font-extrabold leading-14 text-4xl">{rank}</div>}
      <img width={300} src={video.thumbnailUrl} className="rounded-md" />
      <div className="p-2">
        <p className="font-bold">{video.title}</p>
        <p className="text-zinc-700">{video.publishedAtString}</p>
      </div>
    </div>
  );
};

const VideoPreview = ({
  video,
  onClick,
  rank,
}: {
  video: Video;
  onClick?: () => void;
  rank?: number;
}) => {
  const innerVideoPreview = <InnerVideoPreview video={video} rank={rank} />;

  return (
    <div className="hover:bg-zinc-100 rounded-md" style={{ width: 300 }}>
      {onClick ? (
        <button className="btn" onClick={onClick}>
          {innerVideoPreview}
        </button>
      ) : (
        <a href={video.videoUrl} target="_blank">
          {innerVideoPreview}
        </a>
      )}
    </div>
  );
};

export default VideoPreview;
