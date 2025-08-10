import SectionHeader from "@/components/resuable/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Tahmina Akter",
    level: "Achieved C2 Certification",
    text: "The 3-step assessment perfectly evaluated my digital skills. The automatic certification saved me so much time compared to traditional exams!",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: 2,
    name: "Rahim Khan",
    level: "B2 Certified Developer",
    text: "The secure browser and timer system made the test feel professional. I appreciated the clear progression from A1 to C2 levels.",
    image: "https://randomuser.me/api/portraits/men/47.jpg",
  },
  {
    id: 3,
    name: "Nusrat Jahan",
    level: "A2 to B1 Progress",
    text: "After failing Step 1 initially, the system clearly showed where I needed improvement. Six months later I passed with B1 certification!",
    image: "https://randomuser.me/api/portraits/women/48.jpg",
  },
  {
    id: 4,
    name: "Arif Mahmood",
    level: "C1 Certified Professional",
    text: "The question pool covered all 22 competencies thoroughly. My certificate helped me land a digital marketing manager position.",
    image: "https://randomuser.me/api/portraits/men/49.jpg",
  },
  {
    id: 5,
    name: "Samina Chowdhury",
    level: "A1 Certification",
    text: "As a beginner, the A1 assessment was perfectly challenging. The instant results and certification motivated me to continue learning.",
    image: "https://randomuser.me/api/portraits/women/46.jpg",
  },
  {
    id: 6,
    name: "Jamal Uddin",
    level: "B2 to C1 Upgrade",
    text: "The detailed feedback after each step showed exactly which competencies I needed to work on. The retake policy is fair and prevents cheating.",
    image: "https://randomuser.me/api/portraits/men/50.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-white dark:bg-[#020817] transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <SectionHeader
            title="Certification Success Stories"
            subtitle="Hear from learners who have improved their digital competencies and advanced through our assessment levels"
          />
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Card className="h-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl hover:shadow-md transition-all duration-300">
                <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <CardTitle className="text-base font-semibold text-gray-900 dark:text-white mb-0">
                      {testimonial.name}
                    </CardTitle>
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {testimonial.level}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 dark:text-gray-300 italic text-sm leading-relaxed">
                    "{testimonial.text}"
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
