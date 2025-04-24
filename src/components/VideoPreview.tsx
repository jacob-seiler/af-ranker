import { Video } from "../App";

const Badge = ({ rank }: { rank: number }) => {
  const colours = ["bg-yellow-400", "bg-gray-400", "bg-yellow-600"];

  return (
    <div
      className={`${
        colours[rank - 1] ?? "bg-gray-700"
      } w-15 h-15 rounded-full text-center absolute top-1 left-1 text-white font-extrabold leading-14 text-4xl`}
    >
      {rank}
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
  return (
    <div
      className="hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
      style={{ width: 300 }}
    >
      <button className="group cursor-pointer" onClick={onClick}>
        <div className="relative">
          {(rank && rank > 0) ? <Badge rank={rank} /> : null}
          <img width={300} src={video.thumbnailUrl} className="rounded-md group-[:hover:not(:has(a:hover))]:brightness-50" />
          <p className="hidden group-[:hover:not(:has(a:hover))]:block absolute top-1/2 left-1/2 -translate-1/2 text-white mx-auto font-bold uppercase">Click to {rank === -1 ? "Vote For" : rank ? "Re-Rank" : "Rank"} Video</p>
        </div>
        <div className="p-2">
          <p className="font-bold dark:text-white">{video.title}</p>
          <p className="text-zinc-700 dark:text-zinc-300">
            {video.publishedAtString}
          </p>
          <a
            href={video.videoUrl}
            onClick={(e) => e.stopPropagation()}
            target="_blank"
            className="font-bold underline text-blue-700 dark:text-blue-300"
          >
            Video link
          </a>
        </div>
      </button>
    </div>
  );
};

export default VideoPreview;
