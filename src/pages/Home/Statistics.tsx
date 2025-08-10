import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Award, Clock, UserCheck, BarChart2 } from "lucide-react";

const stats = [
  {
    id: 1,
    label: "Certifications Awarded",
    value: "10,000+",
    icon: <Award className="w-10 h-10 text-blue-600 dark:text-blue-400" />,
    description: "Digital competency certificates from A1 to C2 levels",
  },
  {
    id: 2,
    label: "Assessment Steps Completed",
    value: "35,000+",
    icon: <Clock className="w-10 h-10 text-blue-600 dark:text-blue-400" />,
    description: "Timed evaluations with auto-submit functionality",
  },
  {
    id: 3,
    label: "Active Test Takers",
    value: "5,200+",
    icon: <UserCheck className="w-10 h-10 text-blue-600 dark:text-blue-400" />,
    description: "Users progressing through our 3-step assessment",
  },
  {
    id: 4,
    label: "Questions in Pool",
    value: "132",
    icon: <BarChart2 className="w-10 h-10 text-blue-600 dark:text-blue-400" />,
    description: "Covering 22 competencies across 6 proficiency levels",
  },
];

const Statistics = () => {
  return (
    <section className="relative py-16 overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      {/* Blurred abstract background blobs */}
      <div className="absolute top-[-100px] left-[-80px] w-[300px] h-[300px] bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-60px] w-[250px] h-[250px] bg-blue-100 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse" />

      <div className="container mx-auto px-4 z-10 relative">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
          Assessment Platform Metrics
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, idx) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-md border border-white/30 dark:border-gray-700/40 shadow-md hover:shadow-xl transition-all text-center">
                <CardHeader className="flex flex-col items-center">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-4">
                    {stat.icon}
                  </div>
                  <CardTitle className="text-3xl font-extrabold mb-1 text-gray-900 dark:text-white">
                    {stat.value}
                  </CardTitle>
                  <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                    {stat.label}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.description}
                  </p>
                </CardHeader>
                <CardContent />
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Statistics;
