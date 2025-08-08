import SectionHeader from "@/components/resuable/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { useGetOfferedCoursesBySemesterQuery } from "@/redux/features/course/offerCourseApi";
import {
  useCreateEnrolledCourseMutation,
  useGetMyEnrolledCoursesQuery,
} from "@/redux/features/enrollmentCourse/enrollmentCourseApi";
import {
  useGetMeQuery,
  useGetMyStudentProfileQuery,
} from "@/redux/features/student/studentApi";
import type { TQueryParam } from "@/types/global";
import type {
  IOfferedCourse,
  TCourse as TBaseCourse,
} from "@/types/offeredCourse";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, GraduationCap, Search } from "lucide-react";
import { useEffect, useState } from "react";
import CourseCard from "./components/CourseCard";
import EnrollmentDialog from "./components/EnrollmentDialog";
import SubjectSelectionDialog from "./components/SubjectSelectionDialog";

// Extend types to include new fields for subject selection
type TExtendedCourse = TBaseCourse & {
  subjectsToSelect?: number;
  optionalSubjects?: { name: string; credits: number }[];
};

type TExtendedOfferedCourse = Omit<IOfferedCourse, "course"> & {
  course: TExtendedCourse;
};

const OfferedCourseSection = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [queryParams, setQueryParams] = useState<TQueryParam[]>([]);
  const [selectedCourse, setSelectedCourse] =
    useState<TExtendedOfferedCourse | null>(null);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);
  const [subjectSelectDialogOpen, setSubjectSelectDialogOpen] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  // Get student profile to access admission semester
  const { data: studentProfile, isLoading: studentLoading } =
    useGetMeQuery(undefined);

  // Extract admission semester ID from student profile
  const admissionSemesterId = studentProfile?.admissionSemester;

  // Get offered courses for the student's admission semester
  const { data, isLoading, isError } =
    useGetOfferedCoursesBySemesterQuery(admissionSemesterId);

  // Get enrolled courses to check enrollment status
  const { data: enrolledCoursesData } = useGetMyEnrolledCoursesQuery(undefined);
  const [createEnrolledCourse] = useCreateEnrolledCourseMutation();
  const enrolledCourses = enrolledCoursesData?.data || [];

  useEffect(() => {
    const newQueryParams = debouncedSearchQuery
      ? [{ name: "searchTerm", value: debouncedSearchQuery }]
      : [];
    setQueryParams(newQueryParams);
  }, [debouncedSearchQuery]);

  const isAlreadyEnrolled = (courseId: string) => {
    return enrolledCourses.some(
      (enrollment: any) => enrollment?.offeredCourse?._id === courseId
    );
  };

  const handleEnrollClick = (course: TExtendedOfferedCourse) => {
    setSelectedCourse(course);
    if (
      course.course.optionalSubjects &&
      course.course.optionalSubjects.length > 0
    ) {
      setSubjectSelectDialogOpen(true);
    } else {
      setEnrollDialogOpen(true);
    }
  };

  const handleEnrollConfirm = async (selectedSubjects: string[] = []) => {
    if (!selectedCourse) return;

    try {
      await createEnrolledCourse({
        offeredCourse: selectedCourse._id,
        selectedSubjects:
          selectedSubjects.length > 0 ? selectedSubjects : undefined,
      }).unwrap();

      toast({
        title: "🎉 Enrollment Successful",
        description: "You've been successfully enrolled in the course",
        className: "bg-green-50 border-green-200",
      });
    } catch (error) {
      toast({
        title: "⚠️ Enrollment Failed",
        description: "Failed to enroll in the course. Please try again.",
        variant: "destructive",
      });
      console.log(error);
    } finally {
      setEnrollDialogOpen(false);
      setSubjectSelectDialogOpen(false);
      setSelectedCourse(null);
    }
  };

  // Show loading state while fetching student profile
  if (studentLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Skeleton key={index} className="h-[450px] w-full rounded-lg" />
        ))}
      </div>
    );
  }

  // Show error state
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
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <SectionHeader
            title="Subjects You Can Explore"
            subtitle="Discover a curated selection of academic and skill-based subjects tailored to your goals. Choose the right subject and take a step closer to your career aspirations."
          />
        </motion.div>

        <motion.div
          className="relative max-w-md mx-auto w-full"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by course name, code, or faculty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-6 rounded-xl shadow-sm border-border/50 focus:border-primary/50 transition-colors"
          />
        </motion.div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Skeleton key={index} className="h-[450px] w-full rounded-lg" />
          ))}
        </div>
      ) : data?.data?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-16 gap-4"
        >
          <div className="bg-blue-100 p-8 rounded-full">
            <GraduationCap className="h-12 w-12 text-blue-600" />
          </div>
          <p className="text-center text-lg text-muted-foreground max-w-md">
            No courses found matching your search. Try different keywords or
            check back later.
          </p>
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
            {data?.data?.map((course: IOfferedCourse) => (
              <CourseCard
                key={course._id}
                course={course}
                isEnrolled={isAlreadyEnrolled(course._id)}
                onEnroll={() =>
                  handleEnrollClick(course as TExtendedOfferedCourse)
                }
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      <EnrollmentDialog
        isOpen={enrollDialogOpen}
        onOpenChange={setEnrollDialogOpen}
        course={selectedCourse}
        onConfirm={() => handleEnrollConfirm()}
      />
      <SubjectSelectionDialog
        isOpen={subjectSelectDialogOpen}
        onOpenChange={setSubjectSelectDialogOpen}
        course={selectedCourse}
        onConfirm={handleEnrollConfirm}
      />
    </motion.div>
  );
};

export default OfferedCourseSection;
