import SectionHeader from "@/components/resuable/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    name: "Tanisha Rahman",
    year: "3rd Year, CSE",
    text: "Tracking lab submissions and getting reminders for project deadlines really helped me stay on top during my semester at BUET.",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
  },
  {
    id: 2,
    name: "Zayed Karim",
    year: "Final Year, CSE",
    text: "I landed a freelance frontend gig through the job board and managed it alongside my final year thesis at IUT.",
    image: "https://randomuser.me/api/portraits/men/47.jpg",
  },
  {
    id: 3,
    name: "Maliha Noor",
    year: "2nd Year, CSE",
    text: "The UI is super clean, and having all my class schedules, CGPA, and assignments in one place felt like a digital routine diary!",
    image: "https://randomuser.me/api/portraits/women/48.jpg",
  },
  {
    id: 4,
    name: "Asif Mahmud",
    year: "4th Year, CSE",
    text: "From tracking software engineering project deadlines to finding remote internships—it’s my everyday companion at SUST.",
    image: "https://randomuser.me/api/portraits/men/49.jpg",
  },
  {
    id: 5,
    name: "Shahrin Alam",
    year: "1st Year, CSE",
    text: "As a fresher at RUET, this platform guided me through my very first semester with clarity and less stress.",
    image: "https://randomuser.me/api/portraits/women/46.jpg",
  },
  {
    id: 6,
    name: "Fahim Uddin",
    year: "3rd Year, CSE",
    text: "It’s not just a dashboard—it feels like a CSE-specific productivity tool built for Bangladeshi students.",
    image: "https://randomuser.me/api/portraits/men/50.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-white dark:bg-[#020817] transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <SectionHeader
            title="   Student Success Stories"
            subtitle="  Real voices from university students across Bangladesh who are
            thriving academically and professionally."
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
                    <span className="text-sm text-muted-foreground">
                      {testimonial.year}
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
