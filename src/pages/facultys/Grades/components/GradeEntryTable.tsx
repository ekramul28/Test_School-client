import type { TEnrolledCourse } from "@/types/enrolledCourse";
import { useState, type FC } from "react";
import { StudentRow } from "./StudentRow";
import { type TStudentMarks } from "./SubjectMarksTable";

interface GradeEntryTableProps {
  studentsForCourse: TEnrolledCourse[];
  studentMarks: TStudentMarks;
  handleMarkChange: (
    studentId: string,
    subjectName: string,
    field: keyof TEnrolledCourse["courseMarks"],
    value: string
  ) => void;
  calculateGrade: (total: number) => string;
  getResultStatus: (total: number) => string;
  selectedCourseId: string;
}

const GradeEntryTable: FC<GradeEntryTableProps> = ({
  studentsForCourse,
  studentMarks,
  handleMarkChange,
  calculateGrade,
  getResultStatus,
  selectedCourseId,
}) => {
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  const toggleStudentExpansion = (studentId: string) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full text-sm text-left border rounded-lg">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-4 py-3 font-medium w-12"></th>
            <th className="px-4 py-3 font-medium">Student</th>
            <th className="px-4 py-3 font-medium">Course</th>
            <th className="px-4 py-3 font-medium text-center">
              Subjects Enrolled
            </th>
            <th className="px-4 py-3 font-medium text-center">
              Grading Status
            </th>
          </tr>
        </thead>
        <tbody>
          {studentsForCourse.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-4">
                {selectedCourseId
                  ? "No students found for this course."
                  : "Please select a course."}
              </td>
            </tr>
          ) : (
            studentsForCourse.map((enrollment) => (
              <StudentRow
                key={enrollment.student?.id}
                enrollment={enrollment}
                isExpanded={expandedStudent === enrollment.student?.id}
                onToggle={toggleStudentExpansion}
                studentMarks={studentMarks}
                handleMarkChange={handleMarkChange}
                calculateGrade={calculateGrade}
                getResultStatus={getResultStatus}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GradeEntryTable;
