import {  useState } from "react";
import { Video } from "../App";
import VideoPreview from "./VideoPreview";

const Ranker = ({ current, ranked, onRanked }: { current: Video, ranked: Video[], onRanked: (ranking: number) => void }) => {
    const [start, setStart] = useState(0);
    const [end, setEnd] = useState(ranked.length - 1);
    const [mid, setMid] = useState(Math.floor((ranked.length - 1) / 2));
    const [count, setCount] = useState(0);

    const handleChoice = (choseCurrent: boolean) => {
        const newStart = choseCurrent ? start : mid + 1;
        const newEnd = choseCurrent ? mid - 1 : end;
        const newMid = Math.floor((newStart + newEnd) / 2);

        if (newStart > newEnd) {
            onRanked(choseCurrent ? mid : mid + 1);
            setStart(0);
            setEnd(ranked.length);
            setMid(Math.floor(ranked.length / 2));
            setCount(0);
            return;
        }

        setStart(newStart);
        setEnd(newEnd);
        setMid(newMid);
        setCount(prev => prev + 1);
    }

    const maxComparisons = ranked.length === 1
        ? 1
        : ranked.length === 2
            ? 2
            : Math.ceil(Math.log2(ranked.length));

    return (
        <div>
            <div className="flex justify-center">
                <VideoPreview video={current} onClick={() => handleChoice(true)} />
                <p className="my-16 mx-4">OR</p>
                <VideoPreview video={ranked[mid]} onClick={() => handleChoice(false)} />
            </div>
            <p>{count + 1} of up to {maxComparisons} matchups for current video</p>
        </div>
    );
}

export default Ranker;
