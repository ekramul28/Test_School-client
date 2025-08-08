import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import type {
  IOfferedCourse,
  TCourse as TBaseCourse,
} from "@/types/offeredCourse";
import { useState } from "react";

// Extend the base TCourse type to include the new fields
type TExtendedCourse = TBaseCourse & {
  subjectsToSelect?: number;
  availableSubjects?: {
    name: string;
    credits: number;
  }[];
};

type TExtendedOfferedCourse = Omit<IOfferedCourse, "course"> & {
  course: TExtendedCourse;
};

type SubjectSelectionDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  course: TExtendedOfferedCourse | null;
  onConfirm: (selectedSubjects: string[]) => void;
};

const SubjectSelectionDialog = ({
  isOpen,
  onOpenChange,
  course,
  onConfirm,
}: SubjectSelectionDialogProps) => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const subjectsToSelect = course?.course?.subjectsToSelect || 0;

  const handleSubjectToggle = (subjectName: string) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(subjectName)) {
        return prev.filter((s) => s !== subjectName);
      }
      if (prev.length < subjectsToSelect) {
        return [...prev, subjectName];
      }
      return prev; // Limit selection
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Select Subjects</AlertDialogTitle>
          <AlertDialogDescription>
            You need to select {subjectsToSelect} subjects for the course:{" "}
            {course?.course?.title}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          {course?.course?.optionalSubjects?.map((subject) => (
            <div key={subject.name} className="flex items-center space-x-2">
              <Checkbox
                id={subject.name}
                checked={selectedSubjects.includes(subject.name)}
                onCheckedChange={() => handleSubjectToggle(subject.name)}
                disabled={
                  !selectedSubjects.includes(subject.name) &&
                  selectedSubjects.length >= subjectsToSelect
                }
              />
              <label
                htmlFor={subject.name}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {subject.name} ({subject.credits} credits)
              </label>
            </div>
          ))}
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => onConfirm(selectedSubjects)}
            disabled={selectedSubjects.length !== subjectsToSelect}
          >
            Confirm Enrollment
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SubjectSelectionDialog;
