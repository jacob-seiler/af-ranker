import { useState } from "react";
import Button from "./Button";
import { Video } from "../App";

const generateCode = (videos: Video[]): string => {
    const json = JSON.stringify(videos.map(v => v.shareId));
    const base64 = btoa(json); // Browser-safe Base64 encode
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); // URL-safe
};

export const ShareModal = ({
  ranked,
  visible,
  onClose,
}: {
  ranked: Video[];
  visible: boolean;
  onClose: () => void;
}) => {
  const [name, setName] = useState<string>("");
  const [clicked, setClicked] = useState<boolean>(false);

  const url = new URL(window.location.href);
  const searchParams = new URLSearchParams();
  searchParams.set("code", generateCode(ranked));

  if (name) searchParams.set("name", name);

  url.search = searchParams.toString();

  if (!visible) {
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(url.toString());
    setClicked(true);
  };

  const handleClose = () => {
    setClicked(false);
    onClose();
  };

  return (
    <div
      tabIndex={-1}
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full h-full md:inset-0 max-h-full"
      style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      onClick={handleClose}
    >
      <div
        className="relative p-4 w-full max-w-2xl max-h-full mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* <!-- Modal content --> */}
        <div className="relative bg-white rounded-lg shadow-sm dark:bg-gray-700">
          {/* <!-- Modal header --> */}
          <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600 border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Share Sketch Rankings
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              onClick={handleClose}
            >
              <svg
                className="w-3 h-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 14 14"
              >
                <path
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
          </div>
          {/* <!-- Modal body --> */}
          <div className="p-4 md:p-5 space-y-4">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Your sharable link is:
            </p>
            <textarea className="w-full border border-gray-400 rounded-sm p-2 dark:text-white" value={url.toString()} />
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              Optionally, you may add a name to be included with your shared
              results:
            </p>
            <input
              type="text"
              className="h-8 border border-gray-400 rounded-sm p-2 dark:placeholder:text-gray-300"
              placeholder="Nickname"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setClicked(false);
              }}
            />
          </div>
          {/* <!-- Modal footer --> */}
          <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
            <button
              onClick={handleCopy}
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              {clicked ? "Copied!" : "Copy Link"}
            </button>
            <button
              onClick={handleClose}
              type="button"
              className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ShareButton = ({ onClick }: { onClick: () => void }) => {
  return <Button onClick={onClick}>Share Results</Button>;
};

export default ShareButton;
