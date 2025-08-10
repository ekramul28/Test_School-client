import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface Question {
  _id?: string;
  questionText?: string;
  options: string[];
  correctAnswer: string | number | null;
  level?: string;
  competency?: string;
  durationInSeconds?: number;
}

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string) => void;
  onNext: () => void;
  timeLeft: number;
  step: number;
}

const QuestionCard = ({
  question,
  index,
  total,
  selectedAnswer,
  onSelectAnswer,
  onNext,
  timeLeft,
  step,
}: QuestionCardProps) => {
  const percentage = ((index + 1) / total) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <Card className="border-none shadow-lg rounded-lg">
        <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
          <div>
            <CardTitle className="text-xl font-semibold">
              Step {step} | Question {index + 1} of {total}
            </CardTitle>
            {question.competency && (
              <p className="text-sm text-muted-foreground mt-1">
                Competency:{" "}
                <span className="font-medium">{question.competency}</span>
              </p>
            )}
            {question.level && (
              <p className="text-sm text-muted-foreground">
                Level: <span className="font-medium">{question.level}</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground font-mono">
            <Clock className="h-5 w-5" />
            <span>{timeLeft}s</span>
          </div>
        </CardHeader>

        <Progress value={percentage} className="rounded-none" />

        <CardContent className="space-y-6 pt-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {question.questionText}
          </h2>

          <div className="grid gap-4">
            {question.options.map((option) => {
              const isSelected = selectedAnswer === option;
              return (
                <Button
                  key={option}
                  variant={isSelected ? "default" : "outline"}
                  className={`w-full text-left py-4 rounded-md transition-colors
                      ${
                        isSelected
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "hover:bg-gray-100"
                      }
                    `}
                  onClick={() => onSelectAnswer(option)}
                  disabled={!!selectedAnswer}
                >
                  {option}
                </Button>
              );
            })}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end pt-4">
          <Button
            onClick={onNext}
            disabled={!selectedAnswer}
            className="gap-2 px-6 py-3"
          >
            {index + 1 === total ? "Submit" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuestionCard;
