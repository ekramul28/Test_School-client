import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface QuestionViewProps {
  questionText: string;
  options: string[];
  selectedAnswer: string | null;
  onSelect: (answer: string) => void;
  disabled?: boolean;
}

export const QuestionView = ({
  questionText,
  options,
  selectedAnswer,
  onSelect,
  disabled = false,
}: QuestionViewProps) => {
  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold text-gray-800">{questionText}</h3>
      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence>
          {options.map((option, index) => (
            <motion.div
              key={option}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Button
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`w-full justify-start py-6 text-left h-auto transition-colors ${
                  selectedAnswer === option
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onSelect(option)}
                disabled={disabled}
              >
                <span className="whitespace-normal text-left">{option}</span>
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
