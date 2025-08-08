import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import type { ICourse } from "@/types/course";
import CourseRow from "./CourseRow";

type Faculty = { id: string; firstName: string; lastName: string };
type CourseFaculties = { faculties?: Faculty[] };

type Props = {
  courses?: ICourse[];
  filteredCourses?: ICourse[];
  setSelectedCourse: (course: ICourse) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setFacultyDialogOpen: (open: boolean) => void;
  setCourseFormDialogOpen: (open: boolean) => void;
  courseFaculties?: CourseFaculties;
  handleStatusChange: (courseId: string, isActive: boolean) => void;
};

const CourseTable: React.FC<Props> = ({
  courses,
  filteredCourses,
  setSelectedCourse,
  setDeleteDialogOpen,
  setFacultyDialogOpen,
  setCourseFormDialogOpen,
  courseFaculties,
  handleStatusChange,
}) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Code</TableHead>
            <TableHead>Prefix</TableHead>
            <TableHead>Credits</TableHead>
            <TableHead>Prerequisites</TableHead>
            <TableHead>Faculties</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCourses?.map((course: ICourse) => (
            <CourseRow
              key={course._id}
              course={course}
              courseFaculties={courseFaculties}
              handleStatusChange={handleStatusChange}
              onEdit={() => {
                setSelectedCourse(course);
                setCourseFormDialogOpen(true);
              }}
              onDelete={() => {
                setSelectedCourse(course);
                setDeleteDialogOpen(true);
              }}
              onManageFaculty={() => {
                setSelectedCourse(course);
                setFacultyDialogOpen(true);
              }}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CourseTable;
