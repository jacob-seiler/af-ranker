import Button from "./Button";

const DownloadButton = ({ onClick }: { onClick: () => void }) => {
  return <Button onClick={onClick}>Download Rankings</Button>;
};

export default DownloadButton;
