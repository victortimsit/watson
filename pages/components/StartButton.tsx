import { ArrowPathIcon, PlayIcon } from "@heroicons/react/24/outline";
interface StartButtonProps {
  className?: string;
  onStart: () => void;
  onRestart: () => void;
  started: boolean;
}

const StartButton = (props: StartButtonProps) => {
  return (
    <button
      onClick={props.started ? props.onRestart : props.onStart}
      className={`${props.className} p-4 rounded-full bg-white/20`}
    >
      {props.started ? (
        <ArrowPathIcon className="w-4 h-4" />
      ) : (
        <PlayIcon className="w-4 h-4" />
      )}
    </button>
  );
};

export default StartButton;
