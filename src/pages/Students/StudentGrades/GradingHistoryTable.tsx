import type { TEnrolledCourse } from "@/types/enrolledCourse";
import type { FC } from "react";

interface GradingHistoryTableProps {
  history: TEnrolledCourse[];
  calculateGrade: (total: number) => string;
  getResultStatus: (total: number) => string;
}

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

const getStudentFullName = (student: TEnrolledCourse["student"]) => {
  const { firstName, middleName, lastName } = student.name;
  return [firstName, middleName, lastName].filter(Boolean).join(" ");
};

const GradingHistoryTable: FC<GradingHistoryTableProps> = ({
  history,
  calculateGrade,
  getResultStatus,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm text-left border rounded-lg">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 font-medium">Student</th>
            <th className="px-4 py-3 font-medium">Course</th>
            <th className="px-4 py-3 font-medium">Subject</th>
            <th className="px-4 py-3 font-medium">CT 1 (20)</th>
            <th className="px-4 py-3 font-medium">CT 2 (20)</th>
            <th className="px-4 py-3 font-medium">CT 3 (20)</th>
            <th className="px-4 py-3 font-medium">CT 4 (20)</th>
            <th className="px-4 py-3 font-medium">Best 3 CT</th>
            <th className="px-4 py-3 font-medium">Final Exam (210)</th>
            <th className="px-4 py-3 font-medium">Total (210)</th>
            <th className="px-4 py-3 font-medium">Grade</th>
            <th className="px-4 py-3 font-medium">Result</th>
          </tr>
        </thead>
        <tbody>
          {history.length > 0 ? (
            history.flatMap((enrollment) =>
              enrollment.subjectMarks && enrollment.subjectMarks.length > 0
                ? [
                    // Course group row
                    <tr
                      key={`${enrollment.student.id}-${enrollment.course.title}-group`}
                    >
                      <td
                        colSpan={12}
                        className="bg-gray-200 font-bold px-4 py-2"
                      >
                        Course: {enrollment.course.title}
                      </td>
                    </tr>,
                    // Subject rows
                    ...enrollment.subjectMarks.map((subjectMark, idx) => {
                      const bestThreeCT = calculateBestThreeCT(
                        subjectMark.marks.classTest1 ?? 0,
                        subjectMark.marks.classTest2 ?? 0,
                        subjectMark.marks.classTest3 ?? 0,
                        subjectMark.marks.classTest4 ?? 0
                      );
                      const total = calculateFinalTotal(
                        subjectMark.marks.classTest1 ?? 0,
                        subjectMark.marks.classTest2 ?? 0,
                        subjectMark.marks.classTest3 ?? 0,
                        subjectMark.marks.classTest4 ?? 0,
                        subjectMark.marks.finalExam ?? 0
                      );
                      const grade = calculateGrade(total);
                      const result = getResultStatus(total);
                      return (
                        <tr
                          key={`${enrollment.student.id}-${subjectMark.subjectName}-${idx}`}
                        >
                          <td className="px-4 py-2 border">
                            {getStudentFullName(enrollment.student)} (
                            {enrollment.student.id})
                          </td>
                          <td className="px-4 py-2 border">
                            {enrollment.course.title}
                          </td>
                          <td className="px-4 py-2 border font-semibold">
                            {subjectMark.subjectName}
                          </td>
                          <td className="px-4 py-2 border">
                            {subjectMark.marks.classTest1 ?? 0}
                          </td>
                          <td className="px-4 py-2 border">
                            {subjectMark.marks.classTest2 ?? 0}
                          </td>
                          <td className="px-4 py-2 border">
                            {subjectMark.marks.classTest3 ?? 0}
                          </td>
                          <td className="px-4 py-2 border">
                            {subjectMark.marks.classTest4 ?? 0}
                          </td>
                          <td className="px-4 py-2 border font-semibold text-center bg-blue-50">
                            {bestThreeCT}
                          </td>
                          <td className="px-4 py-2 border">
                            {subjectMark.marks.finalExam ?? 0}
                          </td>
                          <td className="px-4 py-2 border font-semibold text-center bg-green-50">
                            {total}
                          </td>
                          <td className="px-4 py-2 border font-semibold">
                            {grade}
                          </td>
                          <td className="px-4 py-2 border font-semibold">
                            {result}
                          </td>
                        </tr>
                      );
                    }),
                  ]
                : []
            )
          ) : (
            <tr>
              <td className="px-4 py-2 border text-center" colSpan={12}>
                No grading history found for this course.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GradingHistoryTable;
