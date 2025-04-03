import { Progress } from "@/components/ui/progress";

type LoadingOverlayProps = {
  isLoading: boolean;
  progress: number;
  message: string;
};

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  progress,
  message,
}) => {
  if (!isLoading) return null;

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-neutral-500 bg-opacity-55 backdrop-blur-sm flex items-center justify-center z-[1000]">
      <div className="w-full max-w-xl bg-neutral-300 p-4 rounded-lg shadow-lg">
        <Progress value={progress} max={100} />
        <div className="text-neutral-700 text-xl mt-4 text-center">
          {message} {progress}%
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;
