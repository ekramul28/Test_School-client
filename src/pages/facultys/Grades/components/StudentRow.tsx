import { Button } from "@/components/ui/button";
import { useUpdateEnrolledCourseMarksMutation } from "@/redux/features/enrollmentCourse/enrollmentCourseApi";
import type { TEnrolledCourse } from "@/types/enrolledCourse";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { type FC } from "react";
import { toast } from "sonner";
import { SubjectMarksTable, type TStudentMarks } from "./SubjectMarksTable";

/**
 * @description Calculates the best 3 class test marks from 4 class tests
 * @param {number} ct1 - Class Test 1 marks
 * @param {number} ct2 - Class Test 2 marks
 * @param {number} ct3 - Class Test 3 marks
 * @param {number} ct4 - Class Test 4 marks
 * @returns {number} Sum of best 3 class test marks (max 60)
 */
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

/**
 * @description Calculates the final total marks with the new grading system
 * @param {number} ct1 - Class Test 1 marks
 * @param {number} ct2 - Class Test 2 marks
 * @param {number} ct3 - Class Test 3 marks
 * @param {number} ct4 - Class Test 4 marks
 * @param {number} finalExam - Final Exam marks
 * @returns {number} Final total marks (capped at 210)
 */
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

export const StudentRow: FC<{
  enrollment: TEnrolledCourse;
  isExpanded: boolean;
  onToggle: (studentId: string) => void;
  studentMarks: TStudentMarks;
  handleMarkChange: (
    studentId: string,
    subjectName: string,
    field: keyof TEnrolledCourse["courseMarks"],
    value: string
  ) => void;
  calculateGrade: (total: number) => string;
  getResultStatus: (total: number) => string;
}> = ({
  enrollment,
  isExpanded,
  onToggle,
  studentMarks,
  handleMarkChange,
  calculateGrade,
  getResultStatus,
}) => {
  const studentFullName = `${enrollment.student?.name?.firstName} ${
    enrollment.student?.name?.middleName || ""
  } ${enrollment.student?.name?.lastName}`;

  const [updateEnrolledCourseMarks, { isLoading: isSubmitting }] =
    useUpdateEnrolledCourseMarksMutation();

  const handleAssignGrades = async () => {
    const toastId = toast.loading("Submitting grades...");
    try {
      const studentId = enrollment.student.id;
      const marksBySubject = studentMarks[studentId];

      if (!marksBySubject || !enrollment.selectedSubjects) {
        toast.error("No marks to submit", { id: toastId });
        return;
      }

      // Collect all subjects and their marks
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

      console.log("gradeData", gradeData);

      await updateEnrolledCourseMarks(gradeData).unwrap();

      toast.success("Grades submitted successfully!", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit grades. Please try again.", {
        id: toastId,
      });
    }
  };

  return (
    <>
      <tr
        className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
        onClick={() => onToggle(enrollment.student.id)}
      >
        <td className="px-4 py-2 border text-center">
          <ChevronDown
            className={`w-5 h-5 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </td>
        <td className="px-4 py-2 border font-semibold">
          {studentFullName} ({enrollment?.student?.id})
        </td>
        <td className="px-4 py-2 border">{enrollment.course.title}</td>
        <td className="px-4 py-2 border text-center">
          {enrollment.selectedSubjects?.length || 0}
        </td>
        <td className="px-4 py-2 border text-center">
          {enrollment.subjectMarks &&
          enrollment.subjectMarks.length > 0 &&
          enrollment.grade !== "NA" ? (
            <span className="text-green-600 font-medium">✓ Submitted</span>
          ) : (
            <span className="text-yellow-600 font-medium">⚠ Pending</span>
          )}
        </td>
      </tr>
      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan={5} className="p-0 border-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden bg-gray-50 dark:bg-gray-900/50"
              >
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <h4 className="font-semibold mb-2 text-base">
                      Subject Marks for {studentFullName}
                    </h4>
                    <div className="flex justify-end mb-2">
                      {enrollment.subjectMarks &&
                      enrollment.subjectMarks.length > 0 &&
                      enrollment.grade !== "NA" ? (
                        <span className="text-green-600 font-medium">
                          ✓ Grades Submitted
                        </span>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-yellow-600 font-medium">
                            ⚠ Pending Submission
                          </span>
                          <Button
                            onClick={handleAssignGrades}
                            disabled={isSubmitting}
                            size="sm"
                          >
                            {isSubmitting ? "Saving..." : "Save Grades"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  <SubjectMarksTable
                    enrollment={enrollment}
                    studentId={enrollment.student?.id}
                    studentMarks={studentMarks}
                    handleMarkChange={handleMarkChange}
                    calculateGrade={calculateGrade}
                    getResultStatus={getResultStatus}
                  />
                </div>
              </motion.div>
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};
