import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Clock, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// interface Question {
//   _id?: string;
//   questionText?: string;
//   options: string[];
//   correctAnswer: string | number | null;
//   level?: string;
//   competency?: string;
//   durationInSeconds?: number;
// }

interface QuestionCardProps {
  question: any;
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
  const [pulse, setPulse] = useState(false);
  const [answered, setAnswered] = useState(false);

  const stepLevelsMap = {
    1: ["A1", "A2"],
    2: ["B1", "B2"],
    3: ["C1", "C2"],
  };

  // Animation for time warning
  useEffect(() => {
    if (timeLeft <= 10) {
      setPulse(true);
      const timer = setTimeout(() => setPulse(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  // Animation for answer selection
  useEffect(() => {
    if (selectedAnswer) {
      setAnswered(true);
    } else {
      setAnswered(false);
    }
  }, [selectedAnswer]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn",
      },
    },
  };

  const optionVariants = {
    initial: { scale: 1, y: 0 },
    selected: {
      scale: 1.02,
      y: -2,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 15,
      },
    },
    hover: { scale: 1.01, y: -1 },
  };

  const timerVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      backgroundColor: ["#fff", "#fee2e2", "#fff"],
      color: ["#374151", "#dc2626", "#374151"],
      transition: {
        duration: 1,
        repeat: Infinity,
      },
    },
    normal: {
      scale: 1,
      backgroundColor: "#fff",
      color: "#374151",
    },
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={`question-${index}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
        >
          <Card className="border border-gray-100 shadow-sm rounded-xl overflow-hidden">
            {/* Header with progress and timer */}
            <CardHeader className="bg-gray-50 p-4 border-b border-gray-100">
              <div className="flex justify-between items-center w-full">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-medium text-gray-800">
                    Question {index + 1} of {total}
                  </CardTitle>
                  <div className="flex gap-4">
                    <span className="text-sm text-gray-600">
                      Step {step} •{" "}
                      {stepLevelsMap[step as keyof typeof stepLevelsMap]?.join(
                        "/"
                      )}
                    </span>
                    {question.competency && (
                      <span className="text-sm text-gray-600">
                        {question.competency}
                      </span>
                    )}
                  </div>
                </div>
                <motion.div
                  className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-gray-200"
                  variants={timerVariants}
                  animate={timeLeft <= 10 ? "pulse" : "normal"}
                >
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium">{timeLeft}s</span>
                </motion.div>
              </div>
              <Progress
                value={percentage}
                className="h-2 bg-gray-100 mt-2"
                // indicatorClassName="bg-blue-500"
              />
            </CardHeader>

            {/* Question content */}
            <CardContent className="p-6 space-y-6">
              <motion.h2
                className="text-xl font-medium text-gray-900 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                {question?.questionText}
              </motion.h2>

              <div className="grid gap-3">
                {question.options.map((option: any, i: any) => {
                  const isSelected = selectedAnswer === option;
                  return (
                    <motion.button
                      key={option}
                      className={`w-full text-left p-4 rounded-lg border transition-all
                        ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                        }
                        ${!!selectedAnswer && !isSelected ? "opacity-70" : ""}
                      `}
                      onClick={() => onSelectAnswer(option)}
                      disabled={!!selectedAnswer}
                      variants={optionVariants}
                      initial="initial"
                      whileHover={!selectedAnswer ? "hover" : {}}
                      animate={isSelected ? "selected" : "initial"}
                      transition={{ type: "spring", stiffness: 500 }}
                      custom={i}
                    >
                      <div className="flex items-center">
                        <div
                          className={`flex-shrink-0 h-5 w-5 rounded-full border flex items-center justify-center mr-3
                          ${
                            isSelected
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }
                        `}
                        >
                          {isSelected && (
                            <motion.div
                              className="h-2 w-2 rounded-full bg-white"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500 }}
                            />
                          )}
                        </div>
                        <span>{option}</span>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </CardContent>

            {/* Footer with next button */}
            <CardFooter className="p-4 border-t border-gray-100 bg-gray-50">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  onClick={onNext}
                  disabled={!selectedAnswer}
                  className="ml-auto gap-1 px-5 py-2 rounded-lg"
                  size="sm"
                >
                  {index + 1 === total ? "Submit Assessment" : "Next Question"}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </motion.div>
            </CardFooter>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default QuestionCard;
