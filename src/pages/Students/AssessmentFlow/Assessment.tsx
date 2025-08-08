import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

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

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [result, setResult] = useState<null | {
    level: string;
    passed: boolean;
    canProceed: boolean;
  }>(null);

  const {
    data: questionsResponse,
    isLoading,
    isError,
    error,
  } = useGetAllQuestionsQuery([]);

  const stepLevelsMap = {
    1: ["A1", "A2"],
    2: ["B1", "B2"],
    3: ["C1", "C2"],
  };

  const currentStepLevels = stepLevelsMap[currentStep];

  // Filter questions based on current step levels
  const stepQuestions = useMemo(() => {
    if (!questionsResponse?.data) return [];
    return questionsResponse.data.filter((q: TQuestion) =>
      currentStepLevels.includes(q.level)
    );
  }, [questionsResponse, currentStep]);

  const questions = stepQuestions;

  const { data: existingExam } = useGetExamByUserAndStepQuery(
    { userId: user?.userId || "", step: currentStep },
    { skip: !user?.userId }
  );

  const [createCertificate] = useCreateCertificateMutation();
  const [createExam] = useCreateExamMutation();
  const [updateExam] = useUpdateExamMutation();

  // Timer logic: reset timer on question change
  useEffect(() => {
    if (!questions.length || isCompleted || hasSubmitted) return;
    setTimeLeft(questions[currentQuestionIndex]?.durationInSeconds || 60);
  }, [questions, currentQuestionIndex, isCompleted, hasSubmitted]);

  // Countdown timer
  useEffect(() => {
    if (isCompleted || hasSubmitted || !questions.length) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNext();
          // Reset timer for next question or default 60
          return questions[currentQuestionIndex + 1]?.durationInSeconds || 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentQuestionIndex, questions, isCompleted, hasSubmitted]);

  const handleAnswerSelect = (answer: string) => {
    if (!hasSubmitted) setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (hasSubmitted || !questions.length) return;

    if (selectedAnswer === questions[currentQuestionIndex]?.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
    } else {
      setIsCompleted(true);
      setHasSubmitted(true);
      calculateResult();
    }
  };

  const calculateResult = async () => {
    const percentage = (score / questions.length) * 100;

    let levelResult = {
      level: "A1",
      passed: false,
      canProceed: false,
    };

    // Step 1 → Levels A1 & A2
    if (currentStep === 1) {
      if (percentage < 25) {
        levelResult = { level: "A1", passed: false, canProceed: false };
      } else if (percentage < 50) {
        levelResult = { level: "A1", passed: true, canProceed: false };
      } else if (percentage < 75) {
        levelResult = { level: "A2", passed: true, canProceed: false };
      } else {
        levelResult = { level: "A2", passed: true, canProceed: true }; // ≥75% certified + proceed to Step 2
      }
    }
    // Step 2 → Levels B1 & B2
    else if (currentStep === 2) {
      if (percentage < 25) {
        levelResult = { level: "A2", passed: false, canProceed: false };
      } else if (percentage < 50) {
        levelResult = { level: "B1", passed: true, canProceed: false };
      } else if (percentage < 75) {
        levelResult = { level: "B2", passed: true, canProceed: false };
      } else {
        levelResult = { level: "B2", passed: true, canProceed: true }; // ≥75% certified + proceed to Step 3
      }
    }
    // Step 3 → Levels C1 & C2
    else if (currentStep === 3) {
      if (percentage < 50) {
        levelResult = { level: "B2", passed: false, canProceed: false };
      } else if (percentage < 75) {
        levelResult = { level: "C1", passed: true, canProceed: false };
      } else {
        levelResult = { level: "C2", passed: true, canProceed: false }; // ≥50% certified (no next step)
      }
    }

    setResult(levelResult);

    try {
      const payload = {
        userId: user?.userId,
        step: currentStep,
        score,
        totalQuestions: questions.length,
        percentage,
        level: levelResult.level,
        passed: levelResult.passed,
      };

      if (!existingExam?.data) {
        await createExam(payload).unwrap();
      } else {
        await updateExam({
          id: existingExam.data._id,
          data: payload,
        }).unwrap();
      }

      if (levelResult.passed) {
        await createCertificate({
          userId: user?.userId,
          level: levelResult.level,
        }).unwrap();
      }
    } catch (err) {
      console.error("Error in saving result:", err);
    }
  };

  const handleRestart = () => window.location.reload();

  const handleProceed = () => {
    setCurrentStep((s) => (s + 1) as 1 | 2 | 3);
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsCompleted(false);
    setHasSubmitted(false);
    setResult(null);
  };

  const handleReturn = () => navigate("/dashboard");

  if (isLoading) return <LoadingScreen />;
  if (isError) return <ErrorCard error={error} onRetry={handleRestart} />;
  if (!questions.length) return <EmptyCard onReturn={handleReturn} />;
  if (isCompleted && result)
    return (
      <ResultCard
        result={result}
        score={score}
        total={questions.length}
        currentStep={currentStep}
        onProceed={handleProceed}
        onReturn={handleReturn}
      />
    );

  return (
    <QuestionCard
      question={questions[currentQuestionIndex]}
      index={currentQuestionIndex}
      total={questions.length}
      selectedAnswer={selectedAnswer}
      onSelectAnswer={handleAnswerSelect}
      onNext={handleNext}
      timeLeft={timeLeft}
      step={currentStep}
    />
  );
};

export default AssessmentFlow;
