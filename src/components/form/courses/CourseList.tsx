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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useUpdateCourseMutation,
  useAssignFacultiesMutation,
  useGetFacultiesWithCourseQuery,
  useRemoveFacultiesMutation,
} from "@/redux/features/course/courseApi";
import type { ICourse } from "@/types/course";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useState } from "react";
import CourseForm from "@/components/form/courses/CourseForm";

const CourseList = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { data: courses, isLoading, isError } = useGetAllCoursesQuery();
  const [deleteCourse] = useDeleteCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [assignFaculties] = useAssignFacultiesMutation();
  const [removeFaculties] = useRemoveFacultiesMutation();
  const { data: courseFaculties } = useGetFacultiesWithCourseQuery(
    selectedCourse?.id || ""
  );

  const filteredCourses = courses?.filter((course: ICourse) => {
    const title = String(course?.title ?? "").toLowerCase();
    const prefix = String(course?.prefix ?? "").toLowerCase();
    const code = String(course?.code ?? "").toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      title.includes(query) || prefix.includes(query) || code.includes(query)
    );
  });

  const handleDelete = async () => {
    if (selectedCourse) {
      try {
        await deleteCourse(selectedCourse.id).unwrap();
        toast({
          title: "Success",
          description: "Course deleted successfully",
        });
        setDeleteDialogOpen(false);
        setSelectedCourse(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete course",
          variant: "destructive",
        });
      }
    }
  };

  const handleAssignFaculty = async (courseId: string, facultyId: string) => {
    try {
      await assignFaculties({
        courseId,
        faculties: [facultyId],
      }).unwrap();
      toast({
        title: "Success",
        description: "Faculty assigned successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to assign faculty",
        variant: "destructive",
      });
    }
  };

  const handleRemoveFaculty = async (courseId: string, facultyId: string) => {
    try {
      await removeFaculties({
        courseId,
        faculties: [facultyId],
      }).unwrap();
      toast({
        title: "Success",
        description: "Faculty removed successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove faculty",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Error loading courses
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Course Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
            </div>
          </div>

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
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses?.map((course: ICourse) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.title}</TableCell>
                    <TableCell>{course.code}</TableCell>
                    <TableCell>{course.prefix}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>
                      {course?.preRequisiteCourses?.length > 0 ? (
                        <div className="flex items-center gap-1">
                          <Info className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">
                            {course?.preRequisiteCourses
                              .map((prereq) => prereq.course)
                              .join(", ")}
                          </span>
                        </div>
                      ) : (
                        "None"
                      )}
                    </TableCell>
                    <TableCell>
                      {courseFaculties?.faculties?.length || 0} assigned
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course);
                            setDeleteDialogOpen(true);
                          }}
                        >
                          Delete
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedCourse(course)}
                        >
                          Manage
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedCourse?.title}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CourseForm
        course={selectedCourse}
        onSuccess={() => {
          // Handle success
        }}
      />
    </motion.div>
  );
};

export default CourseList;
