import SectionHeader from "@/components/resuable/SectionHeader";
import { motion } from "framer-motion";
import {
  Award,
  Clock,
  ShieldCheck,
  BarChart2,
  Layers,
  Lock,
  BookOpenCheck,
} from "lucide-react";

const features = [
  {
    icon: Layers,
    title: "3-Step Assessment",
    description:
      "Progressive evaluation from A1 to C2 levels with automatic certification based on your performance.",
  },
  {
    icon: Clock,
    title: "Timed Tests",
    description:
      "Configurable timer system with auto-submit functionality (default: 1 minute per question).",
  },
  {
    icon: ShieldCheck,
    title: "Secure Testing",
    description:
      "Safe Exam Browser integration prevents cheating with restricted navigation and input methods.",
  },
  {
    icon: Award,
    title: "Instant Certification",
    description:
      "Automatically generated digital certificates upon completion of each assessment level.",
  },
  {
    icon: BookOpenCheck,
    title: "132 Question Pool",
    description:
      "Comprehensive coverage of 22 competencies across 6 levels (A1 through C2).",
  },
  {
    icon: Lock,
    title: "Test Integrity",
    description:
      "Strict retake policies and secure browser controls to maintain assessment validity.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function Features() {
  return (
    <section className="my-5">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Digital Competency Assessment Features"
          subtitle="Comprehensive evaluation system designed to accurately measure and certify your digital skills from A1 to C2 levels."
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -6 }}
              className="relative group p-6 my-5 rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl hover:border-blue-500 shadow-[inset_0px_30px_40px_0px_rgba(255,255,255,0.1),inset_0px_0px_20px_0px_rgba(0,0,0,0.1),0px_-5px_10px_0px_rgba(63,63,63,0.2)]"
            >
              <motion.div className="flex items-center justify-center w-14 h-14 rounded-xl dark:from-blue-600/20 dark:to-blue-500/20 mb-5 transition-transform duration-500 group-hover:rotate-6">
                <feature.icon className="w-6 h-6 text-gray-600 dark:text-blue-400 transition-colors duration-300" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed transition-colors duration-300">
                {feature.description}
              </p>
              <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-blue-500 transition-all duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
