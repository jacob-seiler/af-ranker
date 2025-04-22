import Button from "./Button";

const ResetButton = ({ onClick }: { onClick: () => void }) => {
  return <Button onClick={onClick}>Reset Rankings</Button>;
};

export default ResetButton;
