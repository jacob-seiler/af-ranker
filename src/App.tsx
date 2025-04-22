import { useCallback, useMemo, useState } from "react";
import Rankings from "./components/Rankings";
import videosJSON from "../videos.json";
import VideoGrid from "./components/VideoGrid";
import { formatDistanceToNow } from "date-fns";
import Ranker from "./components/Ranker";

export interface Video {
  id: string;
  title: string;
  publishedAt: Date;
  publishedAtString: string;
  videoUrl: string;
  thumbnailUrl: string;
}

const ResetButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 m-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
    >
      Reset Rankings
    </button>
  );
};

const App = () => {
  const videos: Video[] = useMemo(() => {
    return videosJSON.map((video) => ({
      ...video,
      publishedAt: new Date(video.publishedAt),
      publishedAtString: formatDistanceToNow(new Date(video.publishedAt), {
        addSuffix: true,
      }),
    }));
  }, []);

  const getRandomVideos = useCallback(
    (amount: number) => {
      const shuffled = [...videos].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, amount);
    },
    [videos]
  );

  const initialVideos = useMemo(() => getRandomVideos(2), [getRandomVideos]);

  const getRandomUnrankedVideo = () => {
    if (unranked.length === 0) return undefined;

    const shuffled = [...unranked].sort(() => 0.5 - Math.random());
    return shuffled.pop();
  };

  const [current, setCurrent] = useState<Video | null>(initialVideos[0]);
  const [ranked, setRanked] = useState<Video[]>([initialVideos[1]]);
  const [unranked, setUnranked] = useState<Video[]>(
    structuredClone(
      videos.filter(
        (v) => v.id !== initialVideos[0].id && v.id !== initialVideos[1].id
      )
    )
  );

  const handleRanked = (ranking: number) => {
    // Update ranked videos list
    setRanked((prev) => {
      const newRanked = [...prev];
      newRanked.splice(ranking, 0, structuredClone(current!));
      return newRanked;
    });

    // Get new random video to rank
    const randomVideo = getRandomUnrankedVideo();

    // Check if there are more videos to rank
    if (randomVideo === undefined) {
      setCurrent(null);
      return;
    }

    setCurrent(randomVideo);
    setUnranked((prev) => prev.filter((v) => v.id !== randomVideo.id));
  };

  const handleReset = () => {
    const randomVideos = getRandomVideos(2);
    setCurrent(randomVideos[0]);
    setRanked([randomVideos[1]]);
    setUnranked(
      videos.filter(
        (v) => v.id !== randomVideos[0].id && v.id !== randomVideos[1].id
      )
    );
  };

  return (
    <main>
      <div className="container mx-auto text-center p-4">
        <h1 className="text-4xl font-extrabold mb-6">
          Almost Friday Sketch Ranker
        </h1>

        {current !== null ? (
          <Ranker current={current} ranked={ranked} onRanked={handleRanked} />
        ) : (
          <>
            <p>You have ranked every video!</p>
            <ResetButton onClick={handleReset} />
          </>
        )}

        {ranked.length > 1 && (
          <>
            <h2 className="text-3xl font-bold mb-2 mt-6">
              Rankings ({ranked.length}/{videos.length})
            </h2>
            <Rankings videos={ranked} />
          </>
        )}

        {unranked.length > 0 && (
          <>
            <h2 className="text-3xl font-bold mb-2 mt-6">Unranked Videos</h2>
            <VideoGrid videos={unranked} />
          </>
        )}

        <div className="mt-8">
          <ResetButton onClick={handleReset} />
        </div>
      </div>
    </main>
  );
};

export default App;
