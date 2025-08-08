import type { TEnrolledCourse } from "@/types/enrolledCourse";
// import type { TStudentMarks } from "@/types/studentMarks";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";
import type { FC } from "react";

export type TStudentMarks = Record<
  string, // studentId
  Record<
    string, // subjectName
    {
      classTest1: number;
      classTest2: number;
      classTest3: number;
      classTest4: number;
      finalExam: number;
    }
  >
>;

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

export const SubjectMarksTable: FC<{
  enrollment: TEnrolledCourse;
  studentId: string;
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
  studentId,
  studentMarks,
  handleMarkChange,
  calculateGrade,
  getResultStatus,
}) => {
  return (
    <table className="min-w-full text-sm text-left border rounded-lg bg-white dark:bg-gray-800">
      <thead className="bg-gray-100 dark:bg-gray-700">
        <tr>
          <th className="px-3 py-2 font-medium">Subject</th>
          <th className="px-3 py-2 font-medium">CT 1 (20)</th>
          <th className="px-3 py-2 font-medium">CT 2 (20)</th>
          <th className="px-3 py-2 font-medium">CT 3 (20)</th>
          <th className="px-3 py-2 font-medium">CT 4 (20)</th>
          <th className="px-3 py-2 font-medium">Best 3 CT</th>
          <th className="px-3 py-2 font-medium">Final Exam (210)</th>
          <th className="px-3 py-2 font-medium">Total (210)</th>
          <th className="px-3 py-2 font-medium">Grade</th>
          <th className="px-3 py-2 font-medium">Result</th>
          <th className="px-3 py-2 font-medium">Status</th>
        </tr>
      </thead>
      <tbody>
        {(() => {
          // Combine default subjects and selected subjects
          const defaultSubjects = enrollment.defaultSubjects || [];
          const selectedSubjects = enrollment.selectedSubjects || [];

          // Get all subject names from both arrays
          const allSubjects = [
            ...defaultSubjects.map((subject: { name: string }) => subject.name),
            ...selectedSubjects,
          ];

          return allSubjects.map((subject: string) => {
            const marksObj = studentMarks[studentId]?.[subject] || {
              classTest1: 0,
              classTest2: 0,
              classTest3: 0,
              classTest4: 0,
              finalExam: 0,
            };

            const bestThreeCT = calculateBestThreeCT(
              marksObj.classTest1,
              marksObj.classTest2,
              marksObj.classTest3,
              marksObj.classTest4
            );

            const total = calculateFinalTotal(
              marksObj.classTest1,
              marksObj.classTest2,
              marksObj.classTest3,
              marksObj.classTest4,
              marksObj.finalExam
            );

            const grade = calculateGrade(total);
            const result = getResultStatus(total);

            const subjectGradeInfo = enrollment.subjectMarks?.find(
              (sm) => sm.subjectName === subject
            );
            const isGraded = !!subjectGradeInfo;

            // Check if this is a default subject
            const isDefaultSubject = defaultSubjects.some(
              (ds: { name: string }) => ds.name === subject
            );

            return (
              <tr key={subject} className={isGraded ? "bg-green-50" : ""}>
                <td className="px-3 py-2 border font-medium">
                  {subject}
                  {isDefaultSubject && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      Default
                    </span>
                  )}
                </td>
                <td className="px-3 py-2 border">
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    value={
                      isGraded
                        ? subjectGradeInfo.marks.classTest1
                        : marksObj.classTest1
                    }
                    onChange={(e) =>
                      handleMarkChange(
                        studentId,
                        subject,
                        "classTest1",
                        e.target.value
                      )
                    }
                    className="w-20"
                    disabled={isGraded}
                  />
                </td>
                <td className="px-3 py-2 border">
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    value={
                      isGraded
                        ? subjectGradeInfo.marks.classTest2
                        : marksObj.classTest2
                    }
                    onChange={(e) =>
                      handleMarkChange(
                        studentId,
                        subject,
                        "classTest2",
                        e.target.value
                      )
                    }
                    className="w-20"
                    disabled={isGraded}
                  />
                </td>
                <td className="px-3 py-2 border">
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    value={
                      isGraded
                        ? subjectGradeInfo.marks.classTest3
                        : marksObj.classTest3
                    }
                    onChange={(e) =>
                      handleMarkChange(
                        studentId,
                        subject,
                        "classTest3",
                        e.target.value
                      )
                    }
                    className="w-20"
                    disabled={isGraded}
                  />
                </td>
                <td className="px-3 py-2 border">
                  <Input
                    type="number"
                    min={0}
                    max={20}
                    value={
                      isGraded
                        ? subjectGradeInfo.marks.classTest4
                        : marksObj.classTest4
                    }
                    onChange={(e) =>
                      handleMarkChange(
                        studentId,
                        subject,
                        "classTest4",
                        e.target.value
                      )
                    }
                    className="w-20"
                    disabled={isGraded}
                  />
                </td>
                <td className="px-3 py-2 border font-semibold text-center bg-blue-50">
                  {bestThreeCT}
                </td>
                <td className="px-3 py-2 border">
                  <Input
                    type="number"
                    min={0}
                    max={210}
                    value={
                      isGraded
                        ? subjectGradeInfo.marks.finalExam
                        : marksObj.finalExam
                    }
                    onChange={(e) =>
                      handleMarkChange(
                        studentId,
                        subject,
                        "finalExam",
                        e.target.value
                      )
                    }
                    className="w-24"
                    disabled={isGraded}
                  />
                </td>
                <td className="px-3 py-2 border font-semibold text-center bg-green-50">
                  {total}
                </td>
                <td className="px-3 py-2 border font-semibold">{grade}</td>
                <td className="px-3 py-2 border font-semibold">{result}</td>
                <td className="px-4 py-2 border">
                  {isGraded ? (
                    <span className="flex items-center gap-1 text-green-600">
                      <CheckCircle2 size={16} />
                      Graded
                    </span>
                  ) : (
                    <span className="text-yellow-600">Pending</span>
                  )}
                </td>
              </tr>
            );
          });
        })()}
      </tbody>
    </table>
  );
};
