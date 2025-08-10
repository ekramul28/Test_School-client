import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import {
  HelpCircle,
  Mail,
  MessageSquare,
  Clock,
  Lock,
  Award,
} from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "How does the 3-step assessment work?",
    answer:
      "Our assessment has three progressive steps: Step 1 evaluates A1-A2 levels, Step 2 covers B1-B2, and Step 3 assesses C1-C2. You must score ≥75% to proceed to the next step.",
  },
  {
    id: 2,
    question: "What happens if I fail Step 1?",
    answer:
      "If you score below 25% in Step 1, you cannot retake the test immediately. We recommend studying our preparation materials before attempting again after the cooldown period.",
  },
  {
    id: 3,
    question: "How are certifications awarded?",
    answer:
      "Certificates are automatically generated based on your highest achieved level. Scores between 25-49.99% certify you at the lower level (A1/B1/C1), while 50%+ certifies at the higher level (A2/B2/C2).",
  },
  {
    id: 4,
    question: "What security measures are in place?",
    answer:
      "We use Safe Exam Browser integration to prevent cheating, with restricted navigation, input controls, and test environment lockdown during assessments.",
  },
  {
    id: 5,
    question: "How long does each assessment take?",
    answer:
      "Each question has a default 1-minute timer (configurable). Step 1 has 44 questions (≈44 min), Step 2 has 44 questions (≈44 min), and Step 3 has 44 questions (≈44 min).",
  },
];

const Contact = () => {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 bg-white dark:bg-[#020817] transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="grid gap-12 md:grid-cols-2">
          {/* Support Section */}
          <div>
            <Card className="dark:bg-[#020817] dark:border-gray-700 transition-all rounded-xl p-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                  Assessment Support
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      Live Chat
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Available 9AM-5PM (GMT+6) for test-taker support
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      Email Support
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      support@testschool.org (response within 24 hours)
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      Technical Requirements
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Safe Exam Browser configuration guide available
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Assessment FAQs
            </h2>
            <div className="space-y-4">
              {faqs.map((faq) => {
                const isOpen = openId === faq.id;
                return (
                  <Card
                    key={faq.id}
                    className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#020817] rounded-lg transition-shadow duration-300 hover:shadow-md cursor-pointer"
                    onClick={() => toggleFaq(faq.id)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleFaq(faq.id);
                      }
                    }}
                  >
                    <CardHeader className="flex justify-between items-center pb-2">
                      <CardTitle className="text-base font-semibold text-gray-800 dark:text-white">
                        {faq.question}
                      </CardTitle>
                      <span
                        className={`transform transition-transform duration-300 text-gray-600 dark:text-gray-300 ${
                          isOpen ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        ▼
                      </span>
                    </CardHeader>
                    <CardContent
                      id={`faq-answer-${faq.id}`}
                      className={`text-sm text-gray-600 dark:text-gray-300 leading-relaxed overflow-hidden transition-all duration-300 ${
                        isOpen
                          ? "max-h-96 opacity-100 pt-2"
                          : "max-h-0 opacity-0 p-0"
                      }`}
                      aria-hidden={!isOpen}
                    >
                      {faq.answer}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
