import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { X } from "lucide-react";

type Faculty = { id: string; firstName: string; lastName: string };
type CourseFaculties = { faculties?: Faculty[] };

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCourse: { title?: string } | null;
  faculties?: Faculty[];
  selectedFaculty: string;
  setSelectedFaculty: (id: string) => void;
  handleAssignFaculty: () => void;
  courseFaculties?: CourseFaculties;
  handleRemoveFaculty: (facultyId: string) => void;
};

const FacultyManagementDialog: React.FC<Props> = ({
  open,
  onOpenChange,
  selectedCourse,
  faculties,
  selectedFaculty,
  setSelectedFaculty,
  handleAssignFaculty,
  courseFaculties,
  handleRemoveFaculty,
}) => {
  console.log("facultiesDialog", faculties);
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-2xl">
        <AlertDialogHeader>
          <AlertDialogTitle>Manage Faculty</AlertDialogTitle>
          <AlertDialogDescription>
            Assign or remove faculty members for {selectedCourse?.title}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4 space-y-4">
          <div className="flex gap-4">
            <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select faculty to assign" />
              </SelectTrigger>
              <SelectContent>
                {faculties?.map((faculty: any) => (
                  <SelectItem key={faculty._id} value={faculty._id}>
                    {faculty?.fullName} {faculty?.academicDepartment?.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAssignFaculty} disabled={!selectedFaculty}>
              Assign
            </Button>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Assigned Faculties</h4>
            <div className="space-y-2">
              {courseFaculties?.faculties?.map((faculty) => (
                <div
                  key={faculty.id}
                  className="flex items-center justify-between p-2 border rounded"
                >
                  <span>
                    {faculty.firstName} {faculty.lastName}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFaculty(faculty.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {!courseFaculties?.faculties?.length && (
                <p className="text-sm text-muted-foreground">
                  No faculties assigned
                </p>
              )}
            </div>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default FacultyManagementDialog;
