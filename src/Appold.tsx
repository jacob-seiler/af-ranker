import { useEffect, useState } from 'react';

interface Video {
  title: string;
  thumbnail: string;
  publishedAt: string;
}

const App = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [ranking, setRanking] = useState<Map<number, number>>(new Map());  // Map of video index to points (higher points = better rank)
  const [progress, setProgress] = useState(0);
  const [currentPair, setCurrentPair] = useState<[Video, Video] | null>(null);
  const [visitedPairs, setVisitedPairs] = useState<Set<string>>(new Set()); // Track visited pairs

  useEffect(() => {
    // Simulate fetching data
    fetch('/videos.json')
      .then((response) => response.json())
      .then((data) => {
        setVideos(data);
        // Initialize with the first pair of videos
        setCurrentPair([data[0], data[1]]);
      });
  }, []);

  // Helper function to get a unique key for a pair of videos
  const getPairKey = (videoA: Video, videoB: Video): string => {
    return [videoA.title, videoB.title].sort().join('-');
  };

  const handleChoice = (winner: Video) => {
    const winnerId = videos.indexOf(winner); // Get the index of the selected video
    const loserId = winnerId === videos.indexOf(currentPair![0]) ? videos.indexOf(currentPair![1]) : videos.indexOf(currentPair![0]);

    // Update ranking (give winner more points, loser fewer points)
    setRanking((prevRanking) => {
      const updatedRanking = new Map(prevRanking);
      updatedRanking.set(winnerId, (updatedRanking.get(winnerId) || 0) + 1);
      updatedRanking.set(loserId, (updatedRanking.get(loserId) || 0));
      return updatedRanking;
    });

    setProgress((prev) => Math.round(((prev + 1) / (videos.length / 2)) * 100));

    // Track the visited pair
    const pairKey = getPairKey(currentPair![0], currentPair![1]);
    setVisitedPairs(new Set(visitedPairs.add(pairKey)));

    // Logic to select the next pair of videos for ranking
    const remainingVideos = videos.filter((_, index) => !ranking.has(index));

    if (remainingVideos.length > 1) {
      // Find a new pair that hasn't been visited
      const newPair = getNewPair(remainingVideos);
      setCurrentPair(newPair ? newPair : null); // Set the new pair or null if done
    } else {
      // End of ranking
      setCurrentPair(null);
    }
  };

  // Function to get a new pair of videos
  const getNewPair = (remainingVideos: Video[]): [Video, Video] | null => {
    for (let i = 0; i < remainingVideos.length; i++) {
      for (let j = i + 1; j < remainingVideos.length; j++) {
        const videoA = remainingVideos[i];
        const videoB = remainingVideos[j];
        const pairKey = getPairKey(videoA, videoB);
        if (!visitedPairs.has(pairKey)) {
          return [videoA, videoB];
        }
      }
    }
    return null; // No more valid pairs
  };

  const getSortedRanking = () => {
    // Sort videos by their points (higher points = better rank)
    return [...ranking.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([videoId]) => videos[videoId]);
  };

  return (
    <div className="App">
      <h1>YouTube Video Rankings</h1>
      {currentPair ? (
        <div>
          <h2>Choose your favorite</h2>
          <div>
            <div>
              <img src={currentPair[0].thumbnail} alt={currentPair[0].title} />
              <button onClick={() => handleChoice(currentPair[0])}>
                {currentPair[0].title}
              </button>
            </div>
            <div>
              <img src={currentPair[1].thumbnail} alt={currentPair[1].title} />
              <button onClick={() => handleChoice(currentPair[1])}>
                {currentPair[1].title}
              </button>
            </div>
          </div>
          <ProgressBar progress={progress} />
        </div>
      ) : (
        <Results ranking={getSortedRanking()} />
      )}
    </div>
  );
};

const ProgressBar = ({ progress }: { progress: number }) => {
  return <div style={{ width: `${progress}%`, backgroundColor: 'blue', height: '20px' }} />;
};

const Results = ({ ranking }: { ranking: Video[] }) => {
  return (
    <div>
      <h2>Your Rankings</h2>
      <ul>
        {ranking.map((video, index) => (
          <li key={index}>
            {video.title} (Rank {index + 1})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;