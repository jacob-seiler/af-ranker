import { useCallback, useMemo, useState } from "react";
import Rankings from "./components/Rankings";
import videosJSON from "../videos.json";
import VideoGrid from "./components/VideoGrid";
import { formatDistanceToNow } from "date-fns";
import Ranker from "./components/Ranker";
import ResetButton from "./components/ResetButton";
import DownloadButton from "./components/DownloadButton";

export interface Video {
  id: string;
  title: string;
  publishedAt: Date;
  publishedAtString: string;
  videoUrl: string;
  thumbnailUrl: string;
}

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

  const handleDownload = () => {
    // Create CSV
    let csv = 'Title,Url,Ranking\n';

    ranked.forEach((video, rank) => {
      csv += [video.title, video.videoUrl, rank + 1].join(',') + '\n';
    });

    // Download the file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'af_rankings.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

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
          <DownloadButton onClick={handleDownload} />
        </div>
      </div>
    </main>
  );
};

export default App;
