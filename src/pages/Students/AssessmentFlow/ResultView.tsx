import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { motion } from "framer-motion";
import { CertificateActions } from "./CertificateActions";
import { Button } from "@/components/ui/button";

interface ResultViewProps {
  score: number;
  totalQuestions: number;
  level: string;
  passed: boolean;
  canProceed: boolean;
  currentStep: number;
  onNextStep: () => void;
  onReturn: () => void;
}

export const ResultView = ({
  score,
  totalQuestions,
  level,
  passed,
  canProceed,
  currentStep,
  onNextStep,
  onReturn,
}: ResultViewProps) => {
  const percentage = (score / totalQuestions) * 100;

  if (!passed) {
    return (
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="space-y-6"
      >
        <Alert variant="destructive" className="border-l-4 border-red-500">
          <AlertTitle className="font-semibold">
            Assessment Not Passed
          </AlertTitle>
          <AlertDescription>
            {currentStep === 1
              ? "You scored less than 25%. No retakes are allowed at this level."
              : `You'll remain at ${level} level.`}
          </AlertDescription>
        </Alert>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="font-medium text-lg mb-2">Your Score</h3>
          <Progress value={percentage} className="h-3" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>0%</span>
            <span>25% (Minimum to pass)</span>
            <span>100%</span>
          </div>
          <p className="mt-4 text-center text-2xl font-bold text-red-600">
            {percentage.toFixed(0)}%
          </p>
          <p className="text-center text-gray-600 mt-2">
            {score} correct out of {totalQuestions} questions
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex flex-col items-center text-center">
        <Badge className="px-4 py-2 text-lg mb-4 bg-green-600 hover:bg-green-700 text-white">
          LEVEL {level} CERTIFIED
        </Badge>

        <div className="w-full max-w-xs mx-auto">
          <Progress value={percentage} className="h-2" />
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <p className="mt-6 text-4xl font-bold text-blue-700">
          {percentage.toFixed(0)}%
        </p>

        <p className="mt-2 text-gray-600">
          {score} out of {totalQuestions} questions correct
        </p>
      </div>

      {canProceed && (
        <Alert className="border-l-4 border-blue-500">
          <AlertTitle className="font-semibold">Congratulations!</AlertTitle>
          <AlertDescription>
            Your score qualifies you for the next level assessment.
          </AlertDescription>
        </Alert>
      )}

      <Separator className="my-6" />

      <CertificateActions />

      <div className="flex justify-between">
        <Button variant="ghost" onClick={onReturn}>
          Return to Dashboard
        </Button>
        {canProceed ? (
          <Button className="gap-2" onClick={onNextStep}>
            Proceed to Step {currentStep + 1}
          </Button>
        ) : (
          <Button variant="secondary">View Learning Resources</Button>
        )}
      </div>
    </motion.div>
  );
};
