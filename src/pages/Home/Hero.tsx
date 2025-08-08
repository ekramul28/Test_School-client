import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Search } from "lucide-react";

const reviews = [
  {
    top: "10%",
    left: "5%",
    size: "text-xs",
    delay: 0,
    text: "Time Saver",
    img: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    top: "15%",
    right: "5%",
    size: "text-xs",
    delay: 0.5,
    text: "Well Organized",
    img: "https://randomuser.me/api/portraits/women/12.jpg",
  },
  {
    top: "28%",
    left: "8%",
    size: "text-xs",
    delay: 0.8,
    text: "Great UI",
    img: "https://randomuser.me/api/portraits/men/13.jpg",
  },
  {
    top: "35%",
    right: "8%",
    size: "text-xs",
    delay: 0.6,
    text: "Super Fast",
    img: "https://randomuser.me/api/portraits/women/14.jpg",
  },
  {
    bottom: "32%",
    left: "6%",
    size: "text-xs",
    delay: 1.1,
    text: "Easy Access",
    img: "https://randomuser.me/api/portraits/men/15.jpg",
  },
  {
    bottom: "25%",
    right: "6%",
    size: "text-xs",
    delay: 1.3,
    text: "Best Support",
    img: "https://randomuser.me/api/portraits/women/16.jpg",
  },
  {
    bottom: "15%",
    left: "10%",
    size: "text-xs",
    delay: 0.9,
    text: "Bug Free",
    img: "https://randomuser.me/api/portraits/men/17.jpg",
  },
  {
    bottom: "10%",
    right: "10%",
    size: "text-xs",
    delay: 1.4,
    text: "Efficient",
    img: "https://randomuser.me/api/portraits/women/18.jpg",
  },
  {
    top: "55%",
    left: "5%",
    size: "text-xs",
    delay: 0.7,
    text: "CSE Friendly",
    img: "https://randomuser.me/api/portraits/men/19.jpg",
  },
  {
    top: "60%",
    right: "5%",
    size: "text-xs",
    delay: 1.5,
    text: "Highly Recommended",
    img: "https://randomuser.me/api/portraits/women/20.jpg",
  },
];

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden h-[100vh] bg-background font-roboto py-20 transition-colors">
      {/* Floating Reviews with profile image and English text */}
      {reviews.map((review, index) => (
        <motion.div
          key={index}
          className={`absolute select-none rounded-full bg-white/90 dark:bg-gray-800/90 shadow-md px-3 py-1 flex items-center gap-2 ${review.size} font-semibold text-gray-800 dark:text-gray-200`}
          style={{
            top: review.top,
            left: review.left,
            right: review.right,
            bottom: review.bottom,
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
            delay: review.delay,
          }}
        >
          <img
            src={review.img}
            alt="Student"
            className="w-6 h-6 rounded-full object-cover border border-gray-300 dark:border-gray-600"
            loading="lazy"
          />
          {review.text}
        </motion.div>
      ))}

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.h1 className="text-xl md:text-3xl font-extrabold text-card-foreground mb-4">
          Streamline Academic Management <br /> with Confidence
        </motion.h1>

        <motion.p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
          Simplify course administration, monitor student progress, and enhance
          collaboration — all in one powerful platform.
        </motion.p>

        {/* Email Input + Button */}
        <motion.div
          className="flex items-center justify-center gap-2 flex-wrap sm:flex-nowrap max-w-xl mx-auto"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="flex items-center w-full sm:w-auto bg-card px-4 py-3 rounded-full shadow-md border text-foreground">
            <Search className="text-muted-foreground mr-2" size={20} />
            <input
              type="search"
              placeholder="Find your dreams!"
              className="outline-none text-sm bg-transparent w-full placeholder:text-muted-foreground text-foreground"
            />
          </div>
          <Button className="rounded-full px-6 font-medium mt-4 md:-mt-0">
            Explore
          </Button>
        </motion.div>
      </div>

      {/* Bottom Illustration and Curve */}
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
