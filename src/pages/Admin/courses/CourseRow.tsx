import { TableRow, TableCell } from "@/components/ui/table";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React from "react";
import type { ICourse } from "@/types/course";

type Faculty = { id: string; firstName: string; lastName: string };
type CourseFaculties = { faculties?: Faculty[] };

type Props = {
  course: ICourse;
  onEdit: () => void;
  onDelete: () => void;
  onManageFaculty: () => void;
  courseFaculties?: CourseFaculties;
  handleStatusChange: (courseId: string, isActive: boolean) => void;
};

const CourseRow: React.FC<Props> = ({
  course,
  onEdit,
  onDelete,
  onManageFaculty,
  courseFaculties,
  handleStatusChange,
}) => {
  return (
    <TableRow key={course._id}>
      <TableCell>{course.title}</TableCell>
      <TableCell>{course.code}</TableCell>
      <TableCell>{course.prefix}</TableCell>
      <TableCell>{course.credits}</TableCell>
      <TableCell>
        {course?.preRequisiteCourses?.length > 0 ? (
          <div className="flex items-center gap-1">
            <Info className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {course.preRequisiteCourses
                .map((prereq) => prereq.course)
                .join(", ")}
            </span>
          </div>
        ) : (
          "None"
        )}
      </TableCell>
      <TableCell>{courseFaculties?.faculties?.length || 0} assigned</TableCell>
      <TableCell>
        <Badge
          variant={course.isActive ? "default" : "secondary"}
          className="cursor-pointer"
          onClick={() => handleStatusChange(course._id, !course.isActive)}
        >
          {course.isActive ? "Active" : "Inactive"}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onManageFaculty}>
            Manage Faculty
          </Button>
          <Button variant="destructive" size="sm" onClick={onDelete}>
            Delete
          </Button>
          <Button variant="default" size="sm" onClick={onEdit}>
            Edit
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
};

export default CourseRow;
