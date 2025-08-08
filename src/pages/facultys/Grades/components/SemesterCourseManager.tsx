import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetAllAcademicSemestersQuery } from "@/redux/features/academic/academicSemesterApi";
import { useGetAllEnrolledCoursesQuery } from "@/redux/features/enrollmentCourse/enrollmentCourseApi";
import type { TAcademicSemester } from "@/types/academicManagement.type";
import type { TEnrolledCourse } from "@/types/enrolledCourse";
import { motion } from "framer-motion";
import { BookOpen, Users, GraduationCap, Calendar } from "lucide-react";

interface SemesterCourseManagerProps {
  onSemesterSelect: (semesterId: string) => void;
  onSectionSelect: (section: string) => void;
  onCourseSelect: (courseId: string) => void;
  selectedSemesterId: string;
  selectedSection: string;
  selectedCourseId: string;
}

export default function SemesterCourseManager({
  onSemesterSelect,
  onSectionSelect,
  onCourseSelect,
  selectedSemesterId,

  selectedCourseId,
}: SemesterCourseManagerProps) {
  const { data: academicSemestersData } =
    useGetAllAcademicSemestersQuery(undefined);
  const academicSemesters: TAcademicSemester[] =
    academicSemestersData?.data || [];

  const { data: facultyCoursesData } = useGetAllEnrolledCoursesQuery(undefined);
  const enrolledCourses: TEnrolledCourse[] = facultyCoursesData?.data || [];

  // Group courses by semester
  const coursesBySemester = enrolledCourses.reduce((acc, course) => {
    const semesterId = course.academicSemester;
    if (!acc[semesterId]) {
      acc[semesterId] = [];
    }
    acc[semesterId].push(course);
    return acc;
  }, {} as Record<string, TEnrolledCourse[]>);

  // Get sections for a semester
  const getSectionsForSemester = (semesterId: string) => {
    const courses = coursesBySemester[semesterId] || [];
    const sections = new Set<string>();

    courses.forEach((course) => {
      const sectionMatch = course.course?.title?.match(/Section\s*(\w+)/i);
      const courseSection = course.course?.section?.toString();
      if (sectionMatch) {
        sections.add(sectionMatch[1]);
      }
      if (courseSection) {
        sections.add(courseSection);
      }
    });

    return Array.from(sections).sort();
  };

  // Get courses for a semester and section
  const getCoursesForSemesterAndSection = (
    semesterId: string,
    section: string
  ) => {
    const courses = coursesBySemester[semesterId] || [];
    return courses.filter((course) => {
      const sectionMatch = course.course?.title?.match(/Section\s*(\w+)/i);
      const courseSection = course.course?.section?.toString();
      return (
        (sectionMatch && sectionMatch[1] === section) ||
        (courseSection && courseSection === section)
      );
    });
  };

  // Get unique students for a course
  const getStudentsForCourse = (courseId: string) => {
    return enrolledCourses.filter((c) => c.course._id === courseId);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Semester Course Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={selectedSemesterId}
          onValueChange={onSemesterSelect}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-8">
            {academicSemesters.map((semester) => (
              <TabsTrigger
                key={semester._id}
                value={semester._id}
                className="text-xs"
              >
                {semester.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {academicSemesters.map((semester) => (
            <TabsContent
              key={semester._id}
              value={semester._id}
              className="mt-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    {semester.name} - {semester.year}
                  </h3>
                  <Badge variant="outline">
                    {coursesBySemester[semester._id]?.length || 0} Courses
                  </Badge>
                </div>

                {coursesBySemester[semester._id]?.length > 0 ? (
                  <div className="grid gap-4">
                    {getSectionsForSemester(semester._id).map((section) => {
                      const sectionCourses = getCoursesForSemesterAndSection(
                        semester._id,
                        section
                      );
                      const totalStudents = sectionCourses.reduce(
                        (sum, course) => {
                          return (
                            sum + getStudentsForCourse(course.course._id).length
                          );
                        },
                        0
                      );

                      return (
                        <motion.div
                          key={section}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-medium text-blue-600">
                              Section {section}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                {sectionCourses.length} Courses
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {totalStudents} Students
                              </span>
                            </div>
                          </div>

                          <div className="grid gap-2">
                            {sectionCourses.map((course) => {
                              const students = getStudentsForCourse(
                                course.course._id
                              );
                              const isSelected =
                                selectedCourseId === course.course._id;

                              return (
                                <div
                                  key={course.course._id}
                                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                                    isSelected
                                      ? "border-blue-500 bg-blue-50"
                                      : "border-gray-200 hover:border-gray-300"
                                  }`}
                                  onClick={() => {
                                    onSemesterSelect(semester._id);
                                    onSectionSelect(section);
                                    onCourseSelect(course.course._id);
                                  }}
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h5 className="font-medium text-gray-900">
                                        {course.course.title}
                                      </h5>
                                      <p className="text-sm text-gray-600">
                                        {course.course.prefix}{" "}
                                        {course.course.code} •{" "}
                                        {course.course.credits} credits
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="secondary">
                                        {students.length} Students
                                      </Badge>
                                      {isSelected && (
                                        <Badge variant="default">
                                          Selected
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No courses assigned to this semester yet.</p>
                    <p className="text-sm">
                      Contact your administrator to assign courses.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
