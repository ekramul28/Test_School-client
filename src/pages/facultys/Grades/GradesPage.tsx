import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useGetAllEnrolledCoursesQuery,
  useUpdateEnrolledCourseMarksMutation,
} from "@/redux/features/enrollmentCourse/enrollmentCourseApi";
import type { TEnrolledCourse } from "@/types/enrolledCourse";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import * as XLSX from "xlsx";
import GradeEntryTable from "./components/GradeEntryTable";
import type { TStudentMarks } from "./components/SubjectMarksTable";

const calculateBestThreeCT = (
  ct1: number,
  ct2: number,
  ct3: number,
  ct4: number
): number => {
  const marks = [ct1, ct2, ct3, ct4].map((mark) => Math.min(mark, 20)); // Cap each CT at 20
  marks.sort((a, b) => b - a); // Sort in descending order
  return marks.slice(0, 3).reduce((sum, mark) => sum + mark, 0); // Sum of best 3
};

const calculateFinalTotal = (
  ct1: number,
  ct2: number,
  ct3: number,
  ct4: number,
  finalExam: number
): number => {
  const bestThreeCT = calculateBestThreeCT(ct1, ct2, ct3, ct4);
  const finalExamCapped = Math.min(finalExam, 210); // Cap final exam at 210
  const total = bestThreeCT + finalExamCapped;
  return Math.min(total, 210); // Cap total at 210
};

function calculateGrade(marks: number) {
  // Convert marks to percentage (210 is 100%)
  const percentage = (marks / 210) * 100;

  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B";
  if (percentage >= 60) return "C";
  if (percentage >= 50) return "D";
  return "F";
}

function getResultStatus(marks: number) {
  // Convert marks to percentage (210 is 100%)
  const percentage = (marks / 210) * 100;
  return percentage >= 50 ? "PASS" : " FAIL";
}

export default function GradesPage() {
  const {
    data: facultyCoursesData,
    refetch,
    isLoading,
  } = useGetAllEnrolledCoursesQuery(undefined);
  const enrolledCourses: TEnrolledCourse[] = facultyCoursesData?.data || [];
  console.log("enrolledCourses", enrolledCourses);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  const courseOptions = useMemo(() => {
    const courses = new Map<
      string,
      { _id: string; title: string; isGraded?: boolean; studentCount?: number }
    >();

    enrolledCourses.forEach((c) => {
      if (c.course && c.course._id) {
        const existingCourse = courses.get(c.course._id);
        // Check if grades have been submitted by looking at subjectMarks or grade
        const hasGrades =
          c.subjectMarks && c.subjectMarks.length > 0 && c.grade !== "NA";

        if (existingCourse) {
          // Update existing course with grading status
          existingCourse.isGraded = existingCourse.isGraded || hasGrades;
          existingCourse.studentCount = (existingCourse.studentCount || 0) + 1;
        } else {
          courses.set(c.course._id, {
            _id: c.course._id,
            title: c.course.title as unknown as string,
            isGraded: hasGrades,
            studentCount: 1,
          });
        }
      }
    });
    return Array.from(courses.values());
  }, [enrolledCourses]);

  const studentsForCourse = useMemo(() => {
    if (!selectedCourseId) return [];
    return enrolledCourses.filter((c) => c.course._id === selectedCourseId);
  }, [enrolledCourses, selectedCourseId]);

  const [studentMarks, setStudentMarks] = useState<TStudentMarks>({});

  const [updateEnrolledCourseMarks, { isLoading: isSubmitting }] =
    useUpdateEnrolledCourseMarksMutation();

  // Get grading status for selected course
  const selectedCourseStatus = useMemo(() => {
    if (!selectedCourseId) return null;

    const studentsInCourse = enrolledCourses.filter(
      (c) => c.course._id === selectedCourseId
    );

    const gradedStudents = studentsInCourse.filter(
      (c) => c.subjectMarks && c.subjectMarks.length > 0 && c.grade !== "NA"
    );

    return {
      totalStudents: studentsInCourse.length,
      gradedStudents: gradedStudents.length,
      isFullyGraded:
        studentsInCourse.length > 0 &&
        studentsInCourse.length === gradedStudents.length,
      isPartiallyGraded:
        gradedStudents.length > 0 &&
        gradedStudents.length < studentsInCourse.length,
    };
  }, [enrolledCourses, selectedCourseId]);

  useEffect(() => {
    if (selectedCourseId) {
      const initialMarks: TStudentMarks = {};
      const studentsInCourse = enrolledCourses.filter(
        (c) => c.course._id === selectedCourseId
      );

      studentsInCourse.forEach((enrollment) => {
        initialMarks[enrollment.student?.id] = {};
        enrollment.selectedSubjects?.forEach((subject) => {
          const subjectMarks = enrollment.subjectMarks?.find(
            (sm) => sm.subjectName === subject
          );
          initialMarks[enrollment.student?.id][subject] = {
            classTest1: subjectMarks?.marks.classTest1 || 0,
            classTest2: subjectMarks?.marks.classTest2 || 0,
            classTest3: subjectMarks?.marks.classTest3 || 0,
            classTest4: subjectMarks?.marks.classTest4 || 0,
            finalExam: subjectMarks?.marks.finalExam || 0,
          };
        });
      });
      setStudentMarks(initialMarks);
    } else {
      setStudentMarks({});
    }
  }, [selectedCourseId, enrolledCourses]);

  const handleMarkChange = (
    studentId: string,
    subjectName: string,
    field: keyof TEnrolledCourse["courseMarks"],
    value: string
  ) => {
    setStudentMarks((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [subjectName]: {
          ...prev[studentId]?.[subjectName],
          [field]: Number(value) || 0,
        },
      },
    }));
  };

  const handleAssignGrades = async () => {
    const toastId = toast.loading("Submitting grades for all students...");
    try {
      // Get all students for the selected course
      const studentsInCourse = enrolledCourses.filter(
        (c) => c.course._id === selectedCourseId
      );

      if (studentsInCourse.length === 0) {
        toast.error("No students found for this course", { id: toastId });
        return;
      }

      // Prepare all grade data for all students in this course
      const allGradePromises = studentsInCourse
        .map((enrollment) => {
          const studentId = enrollment.student.id;
          const marksBySubject = studentMarks[studentId];

          if (!marksBySubject || !enrollment.selectedSubjects) {
            return null; // Skip students without marks
          }

          // Collect all subjects and their marks for this student
          const allSubjectMarks = [];
          let totalCourseMarks = {
            classTest1: 0,
            classTest2: 0,
            classTest3: 0,
            classTest4: 0,
            finalExam: 0,
          };
          let totalMarks = 0;
          let subjectCount = 0;

          for (const subjectName of enrollment.selectedSubjects) {
            const marks = marksBySubject[subjectName];
            if (marks) {
              const subjectTotal = calculateFinalTotal(
                marks.classTest1 ?? 0,
                marks.classTest2 ?? 0,
                marks.classTest3 ?? 0,
                marks.classTest4 ?? 0,
                marks.finalExam ?? 0
              );

              // Add to subject marks array
              allSubjectMarks.push({
                subjectName,
                marks,
              });

              // Accumulate course totals
              totalCourseMarks.classTest1 += marks.classTest1 ?? 0;
              totalCourseMarks.classTest2 += marks.classTest2 ?? 0;
              totalCourseMarks.classTest3 += marks.classTest3 ?? 0;
              totalCourseMarks.classTest4 += marks.classTest4 ?? 0;
              totalCourseMarks.finalExam += marks.finalExam ?? 0;
              totalMarks += subjectTotal;
              subjectCount++;
            }
          }

          // Calculate average course grade
          const averageMarks = subjectCount > 0 ? totalMarks / subjectCount : 0;
          const courseGrade = calculateGrade(averageMarks);
          const isPassed = getResultStatus(averageMarks) === "PASS";

          const gradeData = {
            studentId,
            courseId: enrollment.course._id,
            courseMarks: totalCourseMarks,
            subjectMarks: allSubjectMarks,
            grade: courseGrade,
            isPassed,
            isMarkSubmitted: true,
          };

          return updateEnrolledCourseMarks(gradeData).unwrap();
        })
        .filter((promise) => promise !== null);

      // Execute all grade updates
      await Promise.all(allGradePromises);

      toast.success(
        `Grades submitted successfully for ${allGradePromises.length} students!`,
        { id: toastId }
      );
      refetch();
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit grades. Please try again.", {
        id: toastId,
      });
    }
  };

  const exportToExcel = () => {
    const dataToExport = studentsForCourse.flatMap((enrollment: any) => {
      const studentFullName = `${enrollment.student.name.firstName} ${
        enrollment.student.name.middleName || ""
      } ${enrollment.student.name.lastName}`;

      if (
        !enrollment.selectedSubjects ||
        enrollment.selectedSubjects.length === 0
      ) {
        return [
          {
            StudentName: studentFullName,
            StudentId: enrollment.student.id,
            Course: enrollment.course.title,
            Subject: "N/A",
            ClassTest1: "N/A",
            ClassTest2: "N/A",
            ClassTest3: "N/A",
            ClassTest4: "N/A",
            Best3CT: "N/A",
            FinalExam: "N/A",
            Total: "N/A",
            Grade: "N/A",
            Result: "N/A",
          },
        ];
      }

      return enrollment.selectedSubjects.map((subject: any) => {
        const marksObj = studentMarks[enrollment.student.id]?.[subject] || {
          classTest1: 0,
          classTest2: 0,
          classTest3: 0,
          classTest4: 0,
          finalExam: 0,
        };

        const bestThreeCT = calculateBestThreeCT(
          marksObj.classTest1 ?? 0,
          marksObj.classTest2 ?? 0,
          marksObj.classTest3 ?? 0,
          marksObj.classTest4 ?? 0
        );

        const total = calculateFinalTotal(
          marksObj.classTest1 ?? 0,
          marksObj.classTest2 ?? 0,
          marksObj.classTest3 ?? 0,
          marksObj.classTest4 ?? 0,
          marksObj.finalExam ?? 0
        );

        const grade = calculateGrade(total);
        const result = getResultStatus(total);

        return {
          StudentName: studentFullName,
          StudentId: enrollment.student.id,
          Course: enrollment.course.title,
          Subject: subject,
          ClassTest1: marksObj.classTest1,
          ClassTest2: marksObj.classTest2,
          ClassTest3: marksObj.classTest3,
          ClassTest4: marksObj.classTest4,
          Best3CT: bestThreeCT,
          FinalExam: marksObj.finalExam,
          Total: total,
          Grade: grade,
          Result: result,
        };
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");
    XLSX.writeFile(
      workbook,
      `grading_sheet_${
        courseOptions.find((c) => c._id === selectedCourseId)?.title || "course"
      }.xlsx`
    );
  };

  return (
    <motion.div
      className="p-6 max-w-7xl mx-auto space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Grading Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Grading Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Total Courses</h3>
              <p className="text-2xl font-bold text-blue-700">
                {courseOptions.length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Graded Courses</h3>
              <p className="text-2xl font-bold text-green-700">
                {courseOptions.filter((c) => c.isGraded).length}
              </p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h3 className="font-semibold text-yellow-900">Pending Courses</h3>
              <p className="text-2xl font-bold text-yellow-700">
                {courseOptions.filter((c) => !c.isGraded).length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assign or Update Grades</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4 flex-wrap items-center">
            <Select
              value={selectedCourseId}
              onValueChange={setSelectedCourseId}
              disabled={isLoading}
            >
              <SelectTrigger className="w-[400px]">
                <SelectValue placeholder="Select Course" />
              </SelectTrigger>
              <SelectContent>
                {courseOptions.map((course) => (
                  <SelectItem key={course._id} value={course._id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{course?.title}</span>
                      <div className="flex items-center gap-2 ml-2">
                        <span className="text-xs text-gray-500">
                          {course.studentCount} students
                        </span>
                        {course.isGraded && (
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            Graded
                          </span>
                        )}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleAssignGrades}
              disabled={
                !selectedCourseId ||
                studentsForCourse.length === 0 ||
                isSubmitting
              }
            >
              {isSubmitting ? "Submitting..." : "Save All Grades"}
            </Button>
            <Button
              variant="secondary"
              onClick={exportToExcel}
              disabled={
                !selectedCourseId ||
                studentsForCourse.length === 0 ||
                isSubmitting
              }
            >
              Export to Excel
            </Button>
          </div>

          {/* Course Status Information */}
          {selectedCourseStatus && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">
                Course Grading Status:
              </h3>
              <div className="text-sm text-blue-800 space-y-1">
                <p>
                  <strong>Course:</strong>{" "}
                  {courseOptions.find((c) => c._id === selectedCourseId)?.title}
                </p>
                <p>
                  <strong>Total Students:</strong>{" "}
                  {selectedCourseStatus.totalStudents}
                </p>
                <p>
                  <strong>Graded Students:</strong>{" "}
                  {selectedCourseStatus.gradedStudents}
                </p>
                <p>
                  <strong>Status:</strong>
                  {selectedCourseStatus.isFullyGraded ? (
                    <span className="text-green-600 font-medium">
                      {" "}
                      ✓ Fully Graded
                    </span>
                  ) : selectedCourseStatus.isPartiallyGraded ? (
                    <span className="text-yellow-600 font-medium">
                      {" "}
                      ⚠ Partially Graded
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">
                      {" "}
                      ✗ Not Graded
                    </span>
                  )}
                </p>
                {selectedCourseStatus.isPartiallyGraded && (
                  <p className="text-yellow-700">
                    <strong>Note:</strong> Some students have been graded. Click
                    "Save All Grades" to update all remaining students.
                  </p>
                )}
              </div>
            </div>
          )}

          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <GradeEntryTable
              studentsForCourse={studentsForCourse}
              studentMarks={studentMarks}
              handleMarkChange={handleMarkChange}
              calculateGrade={calculateGrade}
              getResultStatus={getResultStatus}
              selectedCourseId={selectedCourseId}
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
