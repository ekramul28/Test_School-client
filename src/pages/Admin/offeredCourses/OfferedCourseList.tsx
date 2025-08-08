import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  useGetAllOfferedCoursesQuery,
  useDeleteOfferedCourseMutation,
} from "@/redux/features/course/offerCourseApi";
import type { IOfferedCourse } from "@/types/offeredCourse";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import OfferedCourseForm from "@/components/form/offerCourses/OfferedCourseForm";
import type { TQueryParam } from "@/types/global";
import { useDebounce } from "@/hooks/useDebounce";

interface Faculty {
  _id: string;
  fullName: string;
  designation: string;
  email: string;
  contactNo: string;
  academicDepartment: {
    _id: string;
    name: string;
  };
  academicFaculty: {
    _id: string;
    name: string;
  };
}

interface Course {
  _id: string;
  title: string;
  code: string;
}

interface Department {
  _id: string;
  name: string;
}

interface OfferedCourse {
  _id: string;
  course: Course;
  faculty: Faculty;
  academicDepartment: Department;
  section: string;
  maxCapacity: number;
  days: string[];
  startTime: string;
  endTime: string;
}

const OfferedCourseList = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<IOfferedCourse | null>(
    null
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [queryParams, setQueryParams] = useState<TQueryParam[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const { data, isLoading, isError } =
    useGetAllOfferedCoursesQuery(queryParams);
  const [deleteOfferedCourse] = useDeleteOfferedCourseMutation();

  useEffect(() => {
    if (debouncedSearchQuery) {
      setQueryParams([
        {
          name: "searchTerm",
          value: debouncedSearchQuery,
        },
      ]);
    } else {
      setQueryParams([]);
    }
  }, [debouncedSearchQuery]);

  const handleDelete = async () => {
    if (selectedCourse) {
      try {
        await deleteOfferedCourse(selectedCourse._id).unwrap();
        toast({
          title: "Success",
          description: "Offered course deleted successfully",
        });
        setDeleteDialogOpen(false);
        setSelectedCourse(null);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete offered course",
          variant: "destructive",
        });
      }
    }
  };

  const renderFacultyInfo = (
    faculty: IOfferedCourse["faculty"] | null | undefined
  ) => {
    if (!faculty) return "Not Assigned";
    return faculty.fullName || "No Name";
  };

  const renderDepartmentInfo = (
    department: IOfferedCourse["academicDepartment"] | null | undefined
  ) => {
    if (!department) return "Not Assigned";
    return department.name || "No Department";
  };

  const renderCourseInfo = (
    course: IOfferedCourse["course"] | null | undefined
  ) => {
    if (!course) return "Not Assigned";
    return (
      <div>
        <p className="font-medium">{course.title || "No Title"}</p>
        <p className="text-sm text-gray-500">{course.code || "No Code"}</p>
      </div>
    );
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">
          Failed to load courses. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Offered Course Management</CardTitle>
          <Button onClick={() => setFormDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Offered Course
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Faculty</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Section</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Days</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : data?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No offered courses found
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.data?.map((course) => (
                    <TableRow key={course._id}>
                      <TableCell>{renderCourseInfo(course.course)}</TableCell>
                      <TableCell>{renderFacultyInfo(course.faculty)}</TableCell>
                      <TableCell>
                        {renderDepartmentInfo(course.academicDepartment)}
                      </TableCell>
                      <TableCell>{course.section || "N/A"}</TableCell>
                      <TableCell>{course.maxCapacity || "N/A"}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {course.days?.map((day) => (
                            <Badge key={day} variant="secondary">
                              {day}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        {course.startTime && course.endTime
                          ? `${course.startTime} - ${course.endTime}`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedCourse(course);
                              setFormDialogOpen(true);
                            }}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setSelectedCourse(course);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
              Are you sure you want to delete this offered course? This action
              cannot be undone.
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

      <AlertDialog open={formDialogOpen} onOpenChange={setFormDialogOpen}>
        <AlertDialogContent className="max-w-4xl">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedCourse
                ? "Edit Offered Course"
                : "Add New Offered Course"}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <div className="py-4">
            <OfferedCourseForm
              offeredCourse={
                selectedCourse
                  ? {
                      id: selectedCourse._id,
                      semesterRegistration:
                        selectedCourse.academicSemester?._id || "",
                      academicFaculty:
                        selectedCourse.academicFaculty?._id || "",
                      academicDepartment:
                        selectedCourse.academicDepartment?._id || "",
                      course: selectedCourse.course?._id || "",
                      faculty: selectedCourse.faculty?._id || "",
                      section: Number(selectedCourse.section) || 0,
                      maxCapacity: selectedCourse.maxCapacity || 0,
                      image: selectedCourse.image,
                      days: selectedCourse.days || [],
                      startTime: selectedCourse.startTime || "",
                      endTime: selectedCourse.endTime || "",
                    }
                  : undefined
              }
              onSuccess={() => {
                setFormDialogOpen(false);
                setSelectedCourse(null);
              }}
            />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </motion.div>
  );
};

export default OfferedCourseList;
