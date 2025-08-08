import SectionHeader from "@/components/resuable/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAllAnnouncementsQuery } from "@/redux/features/announcement/announcement.api";
import { motion } from "framer-motion";
import { Megaphone } from "lucide-react";

const typeToVariant = (type: string) => {
  switch (type) {
    case "enrollment":
      return "default";
    case "academic":
      return "secondary";
    case "job":
      return "outline";
    case "general":
      return "destructive";
    default:
      return "default";
  }
};

const priorityToColor = (priority: string) => {
  switch (priority) {
    case "high":
      return "text-red-600 dark:text-red-400";
    case "medium":
      return "text-yellow-600 dark:text-yellow-400";
    case "low":
      return "text-green-600 dark:text-green-400";
    default:
      return "text-gray-600 dark:text-gray-400";
  }
};

const Announcements = () => {
  const { data, isLoading, isError } = useGetAllAnnouncementsQuery([
    { name: "isActive", value: "true" },
    { name: "limit", value: "8" },
  ]);

  const announcements = data?.data || [];

  if (isLoading) {
    return (
      <section className="py-20 dark:bg-[#020817] transition-colors duration-500">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Latest Announcements"
            subtitle="Stay updated with the most recent academic and career-related information"
          />
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10">
            {[...Array(8)].map((_, index) => (
              <Skeleton key={index} className="h-32 w-full rounded-xl" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-20 dark:bg-[#020817] transition-colors duration-500">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Latest Announcements"
            subtitle="Stay updated with the most recent academic and career-related information"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 gap-4"
          >
            <div className="bg-red-100 p-8 rounded-full">
              <Megaphone className="h-12 w-12 text-red-600" />
            </div>
            <p className="text-center text-lg text-muted-foreground max-w-md">
              Failed to load announcements. Please try again later.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  if (announcements.length === 0) {
    return (
      <section className="py-20 dark:bg-[#020817] transition-colors duration-500">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Latest Announcements"
            subtitle="Stay updated with the most recent academic and career-related information"
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-16 gap-4"
          >
            <div className="bg-blue-100 p-8 rounded-full">
              <Megaphone className="h-12 w-12 text-blue-600" />
            </div>
            <p className="text-center text-lg text-muted-foreground max-w-md">
              No announcements available at the moment. Check back later for
              updates.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 dark:bg-[#020817] transition-colors duration-500">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Latest Announcements"
          subtitle="Stay updated with the most recent academic and career-related information"
        />
        <motion.div
          className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {announcements.map((announcement, index) => (
            <motion.div
              key={announcement._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-lg hover:scale-[1.015]">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="flex flex-col gap-2">
                    <Badge
                      variant={typeToVariant(announcement.type)}
                      className="text-xs px-3 py-1 capitalize w-fit"
                    >
                      {announcement.type}
                    </Badge>
                    <span
                      className={`text-xs font-medium ${priorityToColor(
                        announcement.priority
                      )}`}
                    >
                      {announcement.priority} priority
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(announcement.startDate).toLocaleDateString()}
                  </span>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-base font-medium text-gray-800 dark:text-white leading-snug line-clamp-2">
                    {announcement.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
                    {announcement.content}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Announcements;
