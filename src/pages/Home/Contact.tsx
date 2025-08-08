import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "How do I register for subjects?",
    answer:
      "Go to your dashboard, then open 'Course Registration'. Select your CSE subjects and confirm.",
  },
  {
    id: 2,
    question: "How does the grading system work?",
    answer:
      "We follow the university’s standard GPA system based on assignments, exams, and project performance.",
  },
  {
    id: 3,
    question: "How can I apply for freelance jobs?",
    answer:
      "Visit the 'Marketplace' tab, explore gigs, and apply directly with your student portfolio.",
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
            <Card className=" dark:bg-[#020817]  dark:border-gray-700  transition-all rounded-xl p-6">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
                  Need Help?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="text-3xl">💬</span>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      Live Chat Support
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      Our team is available 24/7 to assist CSE students like
                      you.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📧</span>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      Email Support
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      support@academicmanagement.com
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-3xl">📧</span>
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-white">
                      WhatsApp
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      +880 1889 123123
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
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
