import { useCallback, useEffect, useMemo, useState } from "react";
import Rankings from "./components/Rankings";
import videosJSON from "../videos.json";
import VideoGrid from "./components/VideoGrid";
import { formatDistanceToNow } from "date-fns";
import Ranker from "./components/Ranker";
import ResetButton from "./components/ResetButton";
import DownloadButton from "./components/DownloadButton";
import ShareButton, { ShareModal } from "./components/ShareButton";

export interface Video {
  id: string;
  title: string;
  publishedAt: Date;
  publishedAtString: string;
  videoUrl: string;
  thumbnailUrl: string;
  shareId: number;
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

  const [shareModalOpen, setShareModalOpen] = useState(false);

  const searchParams = new URLSearchParams(window.location.search);
  const code = searchParams.get("code");
  const name = searchParams.get("name") ?? "Somebody";

  // Load data from code if present
  useEffect(() => {
    // Ignore if there is no code
    if (!code) {
      return;
    }

    try {
      const base64 = code.replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(base64);
      const codeRanked: number[] = JSON.parse(json);

      const newRanked = codeRanked.map((si) =>
        videos.find((v) => v.shareId === si)
      );

      // Check if failed to load
      if (!newRanked.every((i) => i !== undefined)) {
        console.error("Invalid data in share code, clearing.", newRanked);
        window.location.search = "";
        return;
      }

      const newUnranked = structuredClone(
        videos.filter((v) => newRanked.every((rv) => rv.id !== v.id))
      );

      const newCurrent =
        newRanked.length === videos.length
          ? null
          : ([...newUnranked].sort(() => 0.5 - Math.random()).pop() as Video);

      setRanked(newRanked);
      setCurrent(newCurrent);
      setUnranked(
        newUnranked.filter(
          (v) => newCurrent === null || v.id !== newCurrent!.id
        )
      );
    } catch (e) {
      console.error("Could not decode share code", e);
      window.location.search = "";
    }
  }, [code, videos]);

  // Load data from localStorage if present
  useEffect(() => {
    // Ignore if loading from code
    if (code) return;
    const localRanked = localStorage.getItem("ranked");

    // If data is missing from local storage, return
    if (!localRanked) {
      return;
    }

    const rankedParsed: string[] = JSON.parse(localRanked);
    const newRanked = rankedParsed.map((id) => videos.find((v) => v.id === id));

    // Check if failed to load
    if (!newRanked.every((i) => i !== undefined)) {
      console.error("Invalid data in localStorage, clearing.", rankedParsed);
      localStorage.removeItem("ranked");
      return;
    }

    const newUnranked = structuredClone(
      videos.filter((v) => newRanked.every((rv) => rv.id !== v.id))
    );
    const newCurrent =
      newRanked.length === videos.length
        ? null
        : ([...newUnranked].sort(() => 0.5 - Math.random()).pop() as Video);

    // Load values
    setRanked(newRanked);
    setCurrent(newCurrent);
    setUnranked(
      newUnranked.filter((v) => newCurrent === null || v.id !== newCurrent!.id)
    );
  }, [videos, code]);

  // Set initial data if missing
  useEffect(() => {
    // Ignore if loading from code
    if (code) return;

    const localRanked = localStorage.getItem("ranked");

    // If data is missing from local storage, save initial values
    if (!localRanked) {
      localStorage.setItem("ranked", JSON.stringify(ranked.map((v) => v.id)));
      return;
    }
  }, [current, ranked, code]);

  const handleRanked = (ranking: number) => {
    // Update ranked videos list
    setRanked((prev) => {
      const newRanked = [...prev];
      newRanked.splice(ranking, 0, structuredClone(current!));

      // Update local storage
      localStorage.setItem(
        "ranked",
        JSON.stringify(newRanked.map((v) => v.id))
      );

      return newRanked;
    });

    // Get new random video to rank
    const randomVideo = getRandomUnrankedVideo();

    // Check if there are more videos to rank
    if (randomVideo === undefined) {
      setCurrent(null);

      // Remove code if present
      if (code) {
        window.location.search = "";
      }
      return;
    }

    setCurrent(randomVideo);
    setUnranked((prev) => prev.filter((v) => v.id !== randomVideo.id));

    // Remove code if present
    if (code) {
      window.location.search = "";
    }
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

    // Update local storage
    localStorage.setItem("ranked", JSON.stringify([randomVideos[1].id]));

    // Remove any share data
    window.location.search = "";
  };

  const handleDownload = () => {
    // Create CSV
    let csv = "Title,Url,Ranking\n";

    ranked.forEach((video, rank) => {
      csv += [video.title, video.videoUrl, rank + 1].join(",") + "\n";
    });

    // Download the file
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "af_rankings.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main>
      <ShareModal
        ranked={ranked}
        visible={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
      />
      <div className="container mx-auto text-center p-4">
        <h1 className="text-4xl font-extrabold mb-6">
          {`Almost Friday Sketch Ranker${code ? ` - ${name}'s Results` : ""}`}
        </h1>

        {current !== null ? (
          <Ranker current={current} ranked={ranked} onRanked={handleRanked} />
        ) : (
          <>
            {!code && <p>You have ranked every video!</p>}
            <div>
              {!code && <ShareButton onClick={() => setShareModalOpen(true)} />}
              <DownloadButton onClick={handleDownload} />
              <ResetButton onClick={handleReset} />
            </div>
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

        <div className="mt-8 mb-2">
          {!code && <ShareButton onClick={() => setShareModalOpen(true)} />}
          <DownloadButton onClick={handleDownload} />
          <ResetButton onClick={handleReset} />
        </div>

        <p className="text-sm text-gray-600">Made by Jacob Seiler</p>
      </div>
    </main>
  );
};

export default App;
