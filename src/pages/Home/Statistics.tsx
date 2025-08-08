import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const stats = [
  { id: 1, label: "Students Enrolled", value: "5,000+", icon: "👨‍🎓" },
  { id: 2, label: "Active Instructors", value: "120+", icon: "👨‍🏫" },
  { id: 3, label: "Jobs Posted", value: "300+", icon: "💼" },
  { id: 4, label: "Courses Offered", value: "100+", icon: "📚" },
];

const Statistics = () => {
  return (
    <section className="relative py-16 overflow-hidden   dark:to-gray-800">
      {/* Blurred abstract background blobs */}
      <div className="absolute top-[-100px] left-[-80px] w-[300px] h-[300px] bg-purple-300 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-[-120px] right-[-60px] w-[250px] h-[250px] bg-pink-300 dark:bg-pink-700 rounded-full mix-blend-multiply filter blur-2xl opacity-40 animate-pulse" />

      <div className="container mx-auto px-4 z-10 relative">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 dark:text-white mb-12">
          Platform Impact at a Glance
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
              <Card className="bg-white/70 dark:bg-gray-800/50 backdrop-blur-md border border-white/30 dark:border-gray-700/40 shadow-md hover:shadow-xl transition-all text-center text-gray-900 dark:text-white">
                <CardHeader className="flex flex-col items-center">
                  <span className="text-5xl mb-3">{stat.icon}</span>
                  <CardTitle className="text-3xl font-extrabold mb-1">
                    {stat.value}
                  </CardTitle>
                  <p className="text-base text-gray-600 dark:text-gray-300">
                    {stat.label}
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
