import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search, Award, Clock, ShieldCheck, BarChart2 } from "lucide-react";

const testimonials = [
  {
    top: "10%",
    left: "5%",
    size: "text-xs",
    delay: 0,
    text: "Accurate Assessment",
    img: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    top: "15%",
    right: "5%",
    size: "text-xs",
    delay: 0.5,
    text: "Great Certification",
    img: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    top: "28%",
    left: "8%",
    size: "text-xs",
    delay: 0.8,
    text: "Clear Levels",
    img: "https://randomuser.me/api/portraits/men/13.jpg",
  },
  {
    top: "35%",
    right: "8%",
    size: "text-xs",
    delay: 0.6,
    text: "Secure Platform",
    img: "https://randomuser.me/api/portraits/women/14.jpg",
  },
  {
    bottom: "32%",
    left: "6%",
    size: "text-xs",
    delay: 1.1,
    text: "Fair Evaluation",
    img: "https://randomuser.me/api/portraits/men/15.jpg",
  },
  {
    bottom: "25%",
    right: "6%",
    size: "text-xs",
    delay: 1.3,
    text: "Progressive Steps",
    img: "https://randomuser.me/api/portraits/women/16.jpg",
  },
  {
    bottom: "15%",
    left: "10%",
    size: "text-xs",
    delay: 0.9,
    text: "Detailed Feedback",
    img: "https://randomuser.me/api/portraits/men/17.jpg",
  },
  {
    bottom: "10%",
    right: "10%",
    size: "text-xs",
    delay: 1.4,
    text: "Trusted Results",
    img: "https://randomuser.me/api/portraits/women/18.jpg",
  },
  {
    top: "55%",
    left: "5%",
    size: "text-xs",
    delay: 0.7,
    text: "A1 to C2 Path",
    img: "https://randomuser.me/api/portraits/men/19.jpg",
  },
  {
    top: "60%",
    right: "5%",
    size: "text-xs",
    delay: 1.5,
    text: "Industry Standard",
    img: "https://randomuser.me/api/portraits/women/20.jpg",
  },
];

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden h-[100vh] bg-background font-roboto py-20 transition-colors">
      {/* Floating Testimonials */}
      {testimonials.map((testimonial, index) => (
        <motion.div
          key={index}
          className={`absolute select-none rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md px-3 py-1 flex items-center gap-2 ${testimonial.size} font-semibold text-gray-800 dark:text-gray-200`}
          style={{
            top: testimonial.top,
            left: testimonial.left,
            right: testimonial.right,
            bottom: testimonial.bottom,
            userSelect: "none",
            pointerEvents: "none",
            whiteSpace: "nowrap",
          }}
          initial={{ y: 0, opacity: 0.3 }}
          animate={{ y: -10, opacity: 0.7 }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: testimonial.delay,
          }}
        >
          <img
            src={testimonial.img}
            alt="User"
            className="w-6 h-6 rounded-full object-cover border border-gray-300 dark:border-gray-600"
            loading="lazy"
          />
          {testimonial.text}
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.h1 className="text-3xl md:text-5xl font-extrabold text-card-foreground mb-6">
          Assess Your Digital Competency <br />
          From <span className="text-blue-600">A1 to C2</span> Levels
        </motion.h1>

        <motion.p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
          Certified 3-step evaluation process with secure browser technology and
          automatic certification based on your performance.
        </motion.p>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-card p-4 rounded-lg shadow-sm border">
            <Award className="mx-auto mb-2 text-blue-600" size={24} />
            <p className="text-sm font-medium">3-Step Certification</p>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-sm border">
            <Clock className="mx-auto mb-2 text-blue-600" size={24} />
            <p className="text-sm font-medium">Timed Assessments</p>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-sm border">
            <ShieldCheck className="mx-auto mb-2 text-blue-600" size={24} />
            <p className="text-sm font-medium">Secure Testing</p>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-sm border">
            <BarChart2 className="mx-auto mb-2 text-blue-600" size={24} />
            <p className="text-sm font-medium">Detailed Analytics</p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex items-center justify-center gap-4 flex-wrap"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button className="rounded-full px-8 py-6 text-md font-medium">
            Start Assessment
          </Button>
          <Button
            variant="outline"
            className="rounded-full px-8 py-6 text-md font-medium"
          >
            Learn About Levels
          </Button>
        </motion.div>
      </div>

      {/* Bottom Illustration */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg
          className="w-full h-32 md:h-60"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
        >
          <path
            d="M0,224L60,208C120,192,240,160,360,138.7C480,117,600,107,720,122.7C840,139,960,181,1080,181.3C1200,181,1320,139,1380,117.3L1440,96L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
            className="fill-[#e5e5f7] dark:fill-[#111827]"
          />
        </svg>
      </div>
    </section>
  );
}
