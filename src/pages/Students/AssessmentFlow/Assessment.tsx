import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Award,
  ChevronRight,
  Download,
  Mail,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetAllQuestionsQuery } from "@/redux/features/admin/question.api";

const AssessmentFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [result, setResult] = useState<{
    level: string;
    passed: boolean;
    canProceed: boolean;
  } | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const levelMap = {
    1: ["A1", "A2"],
    2: ["B1", "B2"],
    3: ["C1", "C2"],
  };

  // Using Redux query to fetch questions
  const {
    data: questionsResponse,
    isLoading,
    isError,
    error,
  } = useGetAllQuestionsQuery([
    { name: "level", value: levelMap[currentStep].join(",") },
    { name: "isDeleted", value: "false" },
  ]);

  const questions = questionsResponse?.data || [];

  // Initialize timer when questions load
  useEffect(() => {
    if (questions && questions.length > 0) {
      setTimeLeft(questions[currentQuestionIndex]?.durationInSeconds || 60);
    }
  }, [questions, currentQuestionIndex]);

  // Timer effect
  useEffect(() => {
    if (isLoading || isCompleted || questions.length === 0 || hasSubmitted)
      return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion();
          return questions[currentQuestionIndex + 1]?.durationInSeconds || 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, isCompleted, isLoading, questions, hasSubmitted]);

  const handleAnswerSelect = (answer: string) => {
    if (!hasSubmitted) {
      setSelectedAnswer(answer);
    }
  };

  const handleNextQuestion = () => {
    if (questions.length === 0 || hasSubmitted) return;

    // Check if answer was correct
    if (selectedAnswer === questions[currentQuestionIndex]?.correctAnswer) {
      setScore(score + 1);
    }

    // Move to next question or finish
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimeLeft(questions[currentQuestionIndex + 1]?.durationInSeconds || 60);
    } else {
      calculateResult();
      setIsCompleted(true);
      setHasSubmitted(true);
    }
  };

  const calculateResult = () => {
    if (questions.length === 0) return;

    const percentage = (score / questions.length) * 100;
    let levelResult;

    if (currentStep === 1) {
      if (percentage < 25) {
        levelResult = { level: "Failed", passed: false, canProceed: false };
      } else if (percentage >= 25 && percentage < 50) {
        levelResult = { level: "A1", passed: true, canProceed: false };
      } else if (percentage >= 50 && percentage < 75) {
        levelResult = { level: "A2", passed: true, canProceed: false };
      } else {
        levelResult = { level: "A2", passed: true, canProceed: true };
      }
    } else if (currentStep === 2) {
      if (percentage < 25) {
        levelResult = { level: "A2", passed: false, canProceed: false };
      } else if (percentage >= 25 && percentage < 50) {
        levelResult = { level: "B1", passed: true, canProceed: false };
      } else if (percentage >= 50 && percentage < 75) {
        levelResult = { level: "B2", passed: true, canProceed: false };
      } else {
        levelResult = { level: "B2", passed: true, canProceed: true };
      }
    } else {
      if (percentage < 25) {
        levelResult = { level: "B2", passed: false, canProceed: false };
      } else if (percentage >= 25 && percentage < 50) {
        levelResult = { level: "C1", passed: true, canProceed: false };
      } else {
        levelResult = { level: "C2", passed: true, canProceed: false };
      }
    }

    setResult(levelResult);
  };

  const proceedToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((currentStep + 1) as 1 | 2 | 3);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsCompleted(false);
      setResult(null);
      setHasSubmitted(false);
    }
  };

  const handleRestart = () => {
    window.location.reload();
  };

  const handleDownloadCertificate = () => {
    // In a real implementation, this would call an API endpoint
    alert("Certificate download would be implemented here");
  };

  const handleEmailCertificate = () => {
    // In a real implementation, this would call an API endpoint
    alert("Email certificate functionality would be implemented here");
  };

  const handleReturnToDashboard = () => {
    navigate("/dashboard");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                Error Loading Assessment
              </CardTitle>
              <AlertCircle className="h-8 w-8" />
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <Alert variant="destructive" className="border-l-4 border-red-500">
              <AlertTitle>Failed to load questions</AlertTitle>
              <AlertDescription>
                {error
                  ? (error as any).data?.message || "An error occurred"
                  : "An unknown error occurred"}
              </AlertDescription>
            </Alert>
            <Button className="mt-6" onClick={handleRestart}>
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">
              No Questions Available
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Alert>
              <AlertTitle>Assessment not ready</AlertTitle>
              <AlertDescription>
                There are no questions available for this level yet. Please
                check back later.
              </AlertDescription>
            </Alert>
            <Button className="mt-4" onClick={handleReturnToDashboard}>
              Return to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isCompleted && result) {
    const percentage = (score / questions.length) * 100;
    const currentLevels = levelMap[currentStep].join(" & ");

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="max-w-4xl mx-auto p-6"
      >
        <Card className="border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">
                  Assessment Results
                </CardTitle>
                <p className="text-blue-100 mt-1">
                  {currentLevels} Level Certification
                </p>
              </div>
              <Award className="h-8 w-8" />
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {!result.passed ? (
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="space-y-6"
              >
                <Alert
                  variant="destructive"
                  className="border-l-4 border-red-500"
                >
                  <AlertTitle className="font-semibold">
                    Assessment Not Passed
                  </AlertTitle>
                  <AlertDescription>
                    {currentStep === 1
                      ? "You scored less than 25%. No retakes are allowed at this level."
                      : `You'll remain at ${levelMap[currentStep][0]} level.`}
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
                    {score} correct out of {questions.length} questions
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="space-y-8"
              >
                <div className="flex flex-col items-center text-center">
                  <Badge className="px-4 py-2 text-lg mb-4 bg-green-600 hover:bg-green-700 text-white">
                    LEVEL {result.level} CERTIFIED
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
                    {score} out of {questions.length} questions correct
                  </p>
                </div>

                {result.canProceed && (
                  <Alert className="border-l-4 border-blue-500">
                    <AlertTitle className="font-semibold">
                      Congratulations!
                    </AlertTitle>
                    <AlertDescription>
                      Your score qualifies you for the next level assessment.
                    </AlertDescription>
                  </Alert>
                )}

                <Separator className="my-6" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div whileHover={{ y: -2 }}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Download className="h-5 w-5 text-blue-600" />
                          Download Certificate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">
                          Get your official digital certificate in PDF format.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleDownloadCertificate}
                        >
                          Download PDF
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>

                  <motion.div whileHover={{ y: -2 }}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <Mail className="h-5 w-5 text-blue-600" />
                          Email Certificate
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">
                          Have your certificate sent directly to your email.
                        </p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={handleEmailCertificate}
                        >
                          Send to Email
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </CardContent>

          <CardFooter className="bg-gray-50 rounded-b-lg p-6 flex justify-between">
            <Button variant="ghost" onClick={handleReturnToDashboard}>
              Return to Dashboard
            </Button>
            {result.canProceed ? (
              <Button className="gap-2" onClick={proceedToNextStep}>
                Proceed to Step {currentStep + 1}{" "}
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : result.passed ? (
              <Button variant="secondary">View Learning Resources</Button>
            ) : null}
          </CardFooter>
        </Card>
      </motion.div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <motion.div
      key={`step-${currentStep}-question-${currentQuestionIndex}`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="max-w-4xl mx-auto p-6"
    >
      <Card className="border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold">
                Digital Skills Assessment
              </CardTitle>
              <p className="text-blue-100 mt-1">
                Step {currentStep} of 3 • {levelMap[currentStep].join(" & ")}{" "}
                Levels
              </p>
            </div>
            <div className="flex items-center gap-2 bg-blue-700 px-3 py-1 rounded-full">
              <Clock className="h-5 w-5" />
              <span className="font-mono">{timeLeft}s</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="font-medium text-gray-700">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <span className="text-blue-600 font-medium">
                {currentQuestion.competency}
              </span>
            </div>
            <Progress
              value={((currentQuestionIndex + 1) / questions.length) * 100}
              className="h-2"
            />
          </div>

          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-800">
              {currentQuestion.questionText}
            </h3>

            <div className="grid grid-cols-1 gap-3">
              <AnimatePresence>
                {currentQuestion.options.map((option, index) => (
                  <motion.div
                    key={option}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Button
                      variant={
                        selectedAnswer === option ? "default" : "outline"
                      }
                      className={`w-full justify-start py-6 text-left h-auto transition-colors ${
                        selectedAnswer === option
                          ? "bg-blue-600 hover:bg-blue-700 text-white"
                          : "hover:bg-gray-50"
                      }`}
                      onClick={() => handleAnswerSelect(option)}
                      disabled={hasSubmitted}
                    >
                      <span className="whitespace-normal text-left">
                        {option}
                      </span>
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </CardContent>

        <CardFooter className="bg-gray-50 rounded-b-lg p-6 flex justify-end">
          <Button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null || hasSubmitted}
            className="gap-2 px-6 py-3"
          >
            {currentQuestionIndex === questions.length - 1
              ? "Submit Assessment"
              : "Next Question"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>
          This assessment is timed. You have {currentQuestion.durationInSeconds}{" "}
          seconds per question.
        </p>
        <p className="mt-1">All answers are final once submitted.</p>
      </div>
    </motion.div>
  );
};

export default AssessmentFlow;
