import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { IOfferedCourse } from "@/types/offeredCourse";
import { motion } from "framer-motion";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock,
  Users,
} from "lucide-react";

type CourseCardProps = {
  course: IOfferedCourse;
  isEnrolled: boolean;
  onEnroll: (course: IOfferedCourse) => void;
};

const CourseCard = ({ course, isEnrolled, onEnroll }: CourseCardProps) => {
  const isCourseFull =
    (course.enrolledStudents?.length || 0) >= (course.maxCapacity || 0);

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      className="h-full"
    >
      <Card className="hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/30 overflow-hidden group h-full flex flex-col">
        {course.image && (
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src={course.image}
              alt={course.course?.title || "Course Image"}
              className="w-full h-full object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300"
              initial={{ opacity: 0.9 }}
              whileHover={{ opacity: 1 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <Badge className="absolute top-3 right-3 bg-white/90 text-foreground hover:bg-white shadow-sm">
              {course.academicSemester?.name}
            </Badge>
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-lg font-semibold line-clamp-2">
            {course.course?.title} {course.course?.code}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm flex-grow">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <span>
                <span className="font-medium">Faculty:</span>{" "}
                {course.faculty?.fullName || "Not Assigned"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-primary" />
              <span>
                <span className="font-medium">Department:</span>{" "}
                {course.academicDepartment?.name || "Not Assigned"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>
                <span className="font-medium">Time:</span>{" "}
                {course.startTime && course.endTime
                  ? `${course.startTime} - ${course.endTime}`
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <div className="flex flex-wrap gap-1">
                {course.days?.map((day) => (
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
        </CardContent>
        <CardFooter className="flex flex-col gap-3 pt-4">
          <div className="w-full flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              Capacity: {course.enrolledStudents?.length || 0}/
              {course.maxCapacity || 0}
            </span>
            <div className="h-2 w-1/2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(
                    100,
                    ((course.enrolledStudents?.length || 0) /
                      (course.maxCapacity || 1)) *
                      100
                  )}%`,
                }}
                transition={{ duration: 0.8 }}
              />
            </div>
          </div>
          {isEnrolled ? (
            <Button
              className="w-full mt-2 bg-[#E5E5F7] text-[#06061a] hover:bg-green-200 transition-colors"
              size="sm"
              disabled
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Enrolled
            </Button>
          ) : (
            <Button
              className="w-full mt-2 bg-primary hover:bg-primary/90 transition-colors"
              onClick={() => onEnroll(course)}
              size="sm"
              disabled={isCourseFull}
            >
              {isCourseFull ? "Course Full" : "Enroll Now"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CourseCard;
