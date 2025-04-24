import { Video } from "../App";

const Badge = ({ rank }: { rank: number }) => {
  const colours = ["bg-yellow-400", "bg-gray-400", "bg-yellow-600"];

  return (
    <div className={`${colours[rank - 1] ?? "bg-gray-700"} w-15 h-15 rounded-full text-center absolute top-1 left-1 text-white font-extrabold leading-14 text-4xl`}>
      {rank}
    </div>
  );
};

const InnerVideoPreview = ({
  video,
  rank,
  link,
}: {
  video: Video;
  rank?: number;
  link: boolean;
}) => {
  return (
    <div className="relative">
      {rank && <Badge rank={rank} />}
      <img width={300} src={video.thumbnailUrl} className="rounded-md" />
      <div className="p-2">
        <p className="font-bold dark:text-white">{video.title}</p>
        <p className="text-zinc-700 dark:text-zinc-300">{video.publishedAtString}</p>
        {link && (
          <a
            href={video.videoUrl}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            className="font-bold underline text-blue-700 dark:text-blue-300"
          >
            Video link
          </a>
        )}
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
  const innerVideoPreview = (
    <InnerVideoPreview
      video={video}
      rank={rank}
      link={onClick ? true : false}
    />
  );

  return (
    <div className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md" style={{ width: 300 }}>
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
