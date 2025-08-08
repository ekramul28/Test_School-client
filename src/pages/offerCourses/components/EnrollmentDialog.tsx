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
import type { IOfferedCourse } from "@/types/offeredCourse";

type EnrollmentDialogProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  course: IOfferedCourse | null;
  onConfirm: () => void;
};

const EnrollmentDialog = ({
  isOpen,
  onOpenChange,
  course,
  onConfirm,
}: EnrollmentDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Enrollment</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to enroll in {course?.course?.title}? This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Enroll</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EnrollmentDialog;
