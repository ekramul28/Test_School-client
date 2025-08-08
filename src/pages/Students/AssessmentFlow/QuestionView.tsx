import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string | number | null;
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
      <Card className="border-none shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg">
            Step {step} | Question {index + 1} of {total}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Time Left: {timeLeft}s
          </p>
          <Progress value={percentage} />
        </CardHeader>
        <CardContent className="space-y-4">
          <h2 className="text-xl font-semibold">{question.question}</h2>
          <div className="grid gap-3">
            {question.options.map((option) => (
              <Button
                key={option}
                variant={selectedAnswer === option ? "default" : "outline"}
                className="w-full text-left"
                onClick={() => onSelectAnswer(option)}
                disabled={!!selectedAnswer}
              >
                {option}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={onNext} disabled={!selectedAnswer}>
            {index + 1 === total ? "Submit" : "Next"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuestionCard;
