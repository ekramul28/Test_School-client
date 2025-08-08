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
  useEnrollInCourseMutation,
  useGetAllCoursesQuery,
  useGetEnrolledCoursesQuery,
} from "@/redux/features/course/courseApi";
import type { ICourse } from "@/types/course";
import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useState } from "react";

const StudentCourseList = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [enrollDialogOpen, setEnrollDialogOpen] = useState(false);

  const { data: courses, isLoading, isError } = useGetAllCoursesQuery([]);
  const { data: enrolledCourses } = useGetEnrolledCoursesQuery();
  const [enrollInCourse] = useEnrollInCourseMutation();

  const filteredCourses = courses?.filter((course: ICourse) => {
    const title = String(course?.title ?? "").toLowerCase();
    const prefix = String(course?.prefix ?? "").toLowerCase();
    const code = String(course?.code ?? "").toLowerCase();
    const query = searchQuery.toLowerCase();

    return (
      title.includes(query) || prefix.includes(query) || code.includes(query)
    );
  });

  const isEnrolled = (courseId: string) => {
    return enrolledCourses?.some(
      (enrollment: any) => enrollment.courseId === courseId
    );
  };

  const handleEnroll = async () => {
    if (selectedCourse) {
      try {
        await enrollInCourse(selectedCourse.id).unwrap();
        toast({
          title: "Success",
          description: "Successfully enrolled in the course",
        });
        setEnrollDialogOpen(false);
        setSelectedCourse(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to enroll in the course",
          variant: "destructive",
        });
      }
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
          <CardTitle>Available Courses</CardTitle>
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
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semester 1</SelectItem>
                  <SelectItem value="2">Semester 2</SelectItem>
                  <SelectItem value="3">Semester 3</SelectItem>
                  <SelectItem value="4">Semester 4</SelectItem>
                </SelectContent>
              </Select>
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
                  <TableHead>Instructor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses?.map((course: any) => (
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
                            {course.preRequisiteCourses
                              .map((prereq: any) => prereq.course)
                              .join(", ")}
                          </span>
                        </div>
                      ) : (
                        "None"
                      )}
                    </TableCell>
                    <TableCell>
                      {course.faculty?.firstName} {course.faculty?.lastName}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={course.isActive ? "default" : "secondary"}
                      >
                        {course.isActive ? "Available" : "Unavailable"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {isEnrolled(course.id) ? (
                        <Badge variant="secondary">Enrolled</Badge>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setSelectedCourse(course);
                            setEnrollDialogOpen(true);
                          }}
                          disabled={!course.isActive}
                        >
                          Enroll
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={enrollDialogOpen} onOpenChange={setEnrollDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Enrollment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to enroll in {selectedCourse?.title}? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleEnroll}>Enroll</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default StudentCourseList;
