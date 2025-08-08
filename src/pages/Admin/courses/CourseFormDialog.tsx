import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import CourseForm from "@/components/form/courses/CourseForm";
import type { ICourse } from "@/types/course";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCourse: ICourse | null;
  setSelectedCourse: (course: ICourse | null) => void;
};

const CourseFormDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  selectedCourse,
  setSelectedCourse,
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-4xl">
        <AlertDialogHeader className="flex flex-row items-center justify-between">
          <AlertDialogTitle>
            {selectedCourse ? "Edit Course" : "Add New Course"}
          </AlertDialogTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              onOpenChange(false);
              setSelectedCourse(null);
            }}
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDialogHeader>
        <div className="py-4">
          <CourseForm
            course={selectedCourse || undefined}
            onSuccess={() => {
              onOpenChange(false);
              setSelectedCourse(null);
            }}
          />
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CourseFormDialog;
