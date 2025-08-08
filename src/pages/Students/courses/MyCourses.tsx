import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Clock,
  Users,
  CalendarDays,
  BookOpen,
  GraduationCap,
  ChevronRight,
} from "lucide-react";
import { useGetMyEnrolledCoursesQuery } from "@/redux/features/enrollmentCourse/enrollmentCourseApi";
import { useDebounce } from "@/hooks/useDebounce";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const MyCourses = () => {
  // const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data, isLoading, isError } = useGetMyEnrolledCoursesQuery(undefined);

  const enrolledCourses = data?.data || [];

  const filteredCourses = enrolledCourses.filter((course: any) => {
    const title = String(course.course?.title ?? "").toLowerCase();
    const code = String(course.course?.code ?? "").toLowerCase();
    const query = debouncedSearchQuery.toLowerCase();

    return title.includes(query) || code.includes(query);
  });

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case "A":
        return "bg-green-100 text-green-700";
      case "B":
        return "bg-blue-100 text-blue-700";
      case "C":
        return "bg-yellow-100 text-yellow-700";
      case "D":
        return "bg-orange-100 text-orange-700";
      case "F":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center min-h-[400px] gap-4"
      >
        <div className="bg-red-100 p-6 rounded-full">
          <BookOpen className="h-10 w-10 text-red-500" />
        </div>
        <p className="text-red-500 text-center max-w-md text-lg">
          Failed to load courses. Please refresh the page or try again later.
        </p>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-7xl mx-auto px-4"
    >
      <div className="flex flex-col gap-6">
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            My Courses
          </h2>
          <p className="text-muted-foreground text-lg">
            Track your enrolled courses and academic progress
          </p>
        </motion.div>

        <motion.div
          className="relative max-w-md mx-auto w-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by course name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-6 rounded-xl shadow-sm border-border/50 focus:border-primary/50 transition-colors"
          />
        </motion.div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden border-border/50">
              <Skeleton className="h-48 w-full rounded-t-lg" />
              <CardContent className="space-y-4 pt-6">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="space-y-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 gap-4"
        >
          <div className="bg-blue-100 p-8 rounded-full">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <p className="text-center text-lg text-muted-foreground max-w-md">
            {searchQuery
              ? "No courses found matching your search. Try different keywords."
              : "You haven't enrolled in any courses yet."}
          </p>
          {!searchQuery && (
            <Button
              onClick={() => navigate("/student/courses")}
              className="mt-4"
            >
              Browse Available Courses
            </Button>
          )}
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={debouncedSearchQuery}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredCourses.map((course: any) => (
              <motion.div
                key={course._id}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Card className="hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/30 overflow-hidden group h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-semibold line-clamp-2">
                          {course.course?.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {course.course?.code}
                        </p>
                      </div>
                      {course.grade && (
                        <Badge
                          className={`${getGradeColor(
                            course.grade
                          )} font-semibold`}
                        >
                          {course.grade}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="text-sm">
                          <span className="font-medium">Faculty:</span>{" "}
                          {course.faculty?.fullName || "Not Assigned"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm">
                          <span className="font-medium">Department:</span>{" "}
                          {course.academicDepartment?.name || "Not Assigned"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm">
                          <span className="font-medium">Time:</span>{" "}
                          {course.offeredCourse?.startTime &&
                          course.offeredCourse?.endTime
                            ? `${course.offeredCourse.startTime} - ${course.offeredCourse.endTime}`
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-primary" />
                        <div className="flex flex-wrap gap-1">
                          {course.offeredCourse?.days?.map((day: any) => (
                            <Badge
                              key={day}
                              variant="secondary"
                              className="text-xs bg-primary/10 text-primary hover:bg-primary/20"
                            >
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {course.marks && (
                      <div className="space-y-2 pt-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span className="font-medium">
                            {Math.round(
                              ((course.marks.classTest1 +
                                course.marks.midTerm +
                                course.marks.classTest2 +
                                course.marks.finalTerm) /
                                400) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <Progress
                          value={
                            ((course.marks.classTest1 +
                              course.marks.midTerm +
                              course.marks.classTest2 +
                              course.marks.finalTerm) /
                              400) *
                            100
                          }
                          className="h-2"
                        />
                      </div>
                    )}

                    <Button
                      variant="outline"
                      className="w-full mt-4 group-hover:border-primary/50"
                      onClick={() =>
                        navigate(`/student/courses/${course.course._id}`)
                      }
                    >
                      View Details
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default MyCourses;
