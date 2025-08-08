import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface QuestionProgressProps {
  current: number;
  total: number;
  timeLeft: number;
  competency: string;
}

export const QuestionProgress = ({
  current,
  total,
  timeLeft,
  competency,
}: QuestionProgressProps) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between text-sm mb-2">
        <span className="font-medium text-gray-700">
          Question {current} of {total}
        </span>
        <span className="text-blue-600 font-medium">{competency}</span>
      </div>
      <Progress value={(current / total) * 100} className="h-2" />
      <div className="flex items-center gap-2 bg-blue-700 px-3 py-1 rounded-full text-white mt-2 w-fit ml-auto">
        <Clock className="h-4 w-4" />
        <span className="font-mono">{timeLeft}s</span>
      </div>
    </div>
  );
};
