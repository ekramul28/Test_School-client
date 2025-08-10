import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import {
  useGetExamByUserAndStepQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
} from "@/redux/features/exam/exam.api";
import { useCreateCertificateMutation } from "@/redux/features/certificate/certificateApi";
import { useAppSelector } from "@/redux/hooks";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

import QuestionCard from "./QuestionView";
import ResultCard from "./ResultView";
import LoadingScreen from "./LoadingView";
import ErrorCard from "./ErrorView";
import EmptyCard from "./EmptyCard";

import { useGetAllQuestionsQuery } from "@/redux/features/admin/question.api";
import type { TQuestion } from "@/types/question";

const AssessmentFlow = () => {
  const user = useAppSelector(selectCurrentUser);
  const navigate = useNavigate();

  // States
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState<any>(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [result, setResult] = useState<null | {
    level: string;
    passed: boolean;
    canProceed: boolean;
  }>(null);

  // Mapping of steps to levels
  const stepLevelsMap = {
    1: ["A1", "A2"],
    2: ["B1", "B2"],
    3: ["C1", "C2"],
  };

  // Prepare query params for API
  let queryParams = stepLevelsMap[currentStep].map((level) => ({
    name: "level",
    value: level,
  }));
  queryParams.push({ name: "limit", value: "4" });

  // Fetch filtered questions from backend
  const {
    data: questionsResponse,
    isLoading,
    isError,
    error,
  } = useGetAllQuestionsQuery(queryParams);

  // Client-side filter for questions
  const stepQuestions = useMemo(() => {
    if (!questionsResponse?.data) return [];
    return questionsResponse.data.filter((q: TQuestion) =>
      stepLevelsMap[currentStep].includes(q.level)
    );
  }, [questionsResponse, currentStep]);

  // Get existing exam for user & step
  const { data: existingExam } = useGetExamByUserAndStepQuery(
    { userId: user?._id || "", step: currentStep },
    { skip: !user?._id }
  );

  // Mutations
  const [createCertificate] = useCreateCertificateMutation();
  const [createExam] = useCreateExamMutation();
  const [updateExam] = useUpdateExamMutation();

  // Timer reset on question change
  useEffect(() => {
    if (!stepQuestions.length || isCompleted || hasSubmitted) return;
    setTimeLeft(stepQuestions[currentQuestionIndex]?.durationInSeconds || 60);
  }, [stepQuestions, currentQuestionIndex, isCompleted, hasSubmitted]);

  // Countdown timer logic
  useEffect(() => {
    if (isCompleted || hasSubmitted || !stepQuestions.length) return;

    const interval = setInterval(() => {
      setTimeLeft((prev: any) => {
        if (prev <= 1) {
          handleNext();
          return (
            stepQuestions[currentQuestionIndex + 1]?.durationInSeconds || 60
          );
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentQuestionIndex, stepQuestions, isCompleted, hasSubmitted]);

  // Select answer handler
  const handleAnswerSelect = (answer: string) => {
    if (!hasSubmitted) setSelectedAnswer(answer);
  };

  // Next question or finish handler
  const handleNext = () => {
    if (hasSubmitted || !stepQuestions.length) return;

    if (selectedAnswer === stepQuestions[currentQuestionIndex]?.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex < stepQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setIsCompleted(true);
      setHasSubmitted(true);
      calculateResult();
    }
  };

  // Result calculation logic
  const calculateResult = async () => {
    const percentage = (score / stepQuestions.length) * 100;
    let levelResult = {
      level: "A1",
      passed: false,
      canProceed: false,
    };

    // Step 1 → Levels A1 & A2
    if (currentStep === 1) {
      if (percentage < 25) {
        levelResult = { level: "A1", passed: false, canProceed: false }; // Fail, no retake allowed
      } else if (percentage < 50) {
        levelResult = { level: "A1", passed: true, canProceed: false }; // A1 certified
      } else if (percentage < 75) {
        levelResult = { level: "A2", passed: true, canProceed: false }; // A2 certified
      } else {
        levelResult = { level: "A2", passed: true, canProceed: true }; // A2 certified + Proceed to Step 2
      }
    }
    // Step 2 → Levels B1 & B2
    else if (currentStep === 2) {
      if (percentage < 25) {
        levelResult = { level: "A2", passed: false, canProceed: false }; // Remain at A2
      } else if (percentage < 50) {
        levelResult = { level: "B1", passed: true, canProceed: false }; // B1 certified
      } else if (percentage < 75) {
        levelResult = { level: "B2", passed: true, canProceed: false }; // B2 certified
      } else {
        levelResult = { level: "B2", passed: true, canProceed: true }; // B2 certified + Proceed to Step 3
      }
    }
    // Step 3 → Levels C1 & C2
    else if (currentStep === 3) {
      if (percentage < 25) {
        levelResult = { level: "B2", passed: false, canProceed: false }; // Remain at B2
      } else if (percentage < 50) {
        levelResult = { level: "C1", passed: true, canProceed: false }; // C1 certified
      } else {
        levelResult = { level: "C2", passed: true, canProceed: false }; // C2 certified
      }
    }

    setResult(levelResult);

    if (!user?._id) {
      console.error("User ID is missing.");
      return;
    }

    const payload = {
      user: user._id,
      step: currentStep,
      score: {
        correctAnswers: score,
        totalQuestions: stepQuestions.length,
      },
      certificationLevel: levelResult.level,
      completed: levelResult.passed,
    };

    try {
      if (!existingExam?.data) {
        await createExam(payload).unwrap();
      } else {
        await updateExam({
          id: existingExam?.data?._id,
          data: payload,
        }).unwrap();
      }

      if (levelResult.passed) {
        await createCertificate({
          userId: user._id,
          certificationLevel: levelResult.level,
          examStep: currentStep,
        }).unwrap();
      }
    } catch (err) {
      console.error("Error saving result:", err);
    }
  };

  // Restart quiz
  const handleRestart = () => window.location.reload();

  // Proceed to next step
  const handleProceed = () => {
    setCurrentStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s));
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCompleted(false);
    setHasSubmitted(false);
    setResult(null);
  };

  // Return to dashboard
  const handleReturn = () => navigate("/dashboard");

  if (isLoading) return <LoadingScreen />;
  if (isError) return <ErrorCard error={error} onRetry={handleRestart} />;
  if (!stepQuestions.length) return <EmptyCard onReturn={handleReturn} />;
  if (isCompleted && result)
    return (
      <ResultCard
        userId={user?._id}
        result={result}
        score={score}
        total={stepQuestions.length}
        currentStep={currentStep}
        onProceed={handleProceed}
        onReturn={handleReturn}
      />
    );

  return (
    <QuestionCard
      question={stepQuestions[currentQuestionIndex]}
      index={currentQuestionIndex}
      total={stepQuestions.length}
      selectedAnswer={selectedAnswer}
      onSelectAnswer={handleAnswerSelect}
      onNext={handleNext}
      timeLeft={timeLeft}
      step={currentStep}
    />
  );
};

export default AssessmentFlow;
