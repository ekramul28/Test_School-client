import React, { useState } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  useGetAllCoursesQuery,
  useDeleteCourseMutation,
  useUpdateCourseMutation,
  useAssignFacultiesMutation,
  useGetFacultiesWithCourseQuery,
  useRemoveFacultiesMutation,
} from "@/redux/features/course/courseApi";
import { useGetAllFacultiesQuery } from "@/redux/features/faculty/facultyApi";
import type { ICourse } from "@/types/course";
import CourseSearchAndFilter from "./CourseSearchAndFilter";
import CourseTable from "./CourseTable";
// import FacultyManagementDialog from "./FacultyManagementDialog";
import DeleteCourseDialog from "./DeleteCourseDialog";
import CourseFormDialog from "./CourseFormDialog";
import FacultyManagementDialog from "./FacultyManagementDialog";

const AdminCourseList = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [facultyDialogOpen, setFacultyDialogOpen] = useState(false);
  const [courseFormDialogOpen, setCourseFormDialogOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState("");

  const {
    data: courses,
    isLoading,
    isError,
  } = useGetAllCoursesQuery([], {
    refetchOnMountOrArgChange: true,
  });
  const { data: faculties } = useGetAllFacultiesQuery([], {
    refetchOnMountOrArgChange: true,
  });
  const [deleteCourse] = useDeleteCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const [assignFaculties] = useAssignFacultiesMutation();
  const [removeFaculties] = useRemoveFacultiesMutation();
  const { data: courseFaculties } = useGetFacultiesWithCourseQuery(
    selectedCourse?.id || ""
  );

  console.log("courses", courses);
  console.log("faculties", faculties);

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

  const handleAssignFaculty = async () => {
    console.log("selectedCourse", selectedCourse);
    console.log("selectedFaculty", selectedFaculty);

    if (selectedCourse && selectedFaculty) {
      try {
        await assignFaculties({
          courseId: selectedCourse.id,
          faculties: [selectedFaculty],
        }).unwrap();
        toast({
          title: "Success",
          description: "Faculty assigned successfully",
        });
        setSelectedFaculty("");
      } catch (error) {
        console.log("error", error);
        toast({
          title: "Error",
          description: "Failed to assign faculty",
          variant: "destructive",
        });
      }
    }
  };

  const handleRemoveFaculty = async (facultyId: string) => {
    if (selectedCourse) {
      try {
        await removeFaculties({
          courseId: selectedCourse.id,
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
    }
  };

  const handleStatusChange = async (courseId: string, isActive: boolean) => {
    try {
      await updateCourse({
        id: courseId,
        data: { isActive },
      }).unwrap();
      toast({
        title: "Success",
        description: `Course ${
          isActive ? "activated" : "deactivated"
        } successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update course status",
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Course Management</CardTitle>
          <Button onClick={() => setCourseFormDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </CardHeader>
        <CardContent>
          <CourseSearchAndFilter
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <CourseTable
            courses={courses}
            filteredCourses={filteredCourses}
            setSelectedCourse={setSelectedCourse}
            setDeleteDialogOpen={setDeleteDialogOpen}
            setFacultyDialogOpen={setFacultyDialogOpen}
            setCourseFormDialogOpen={setCourseFormDialogOpen}
            courseFaculties={courseFaculties}
            handleStatusChange={handleStatusChange}
          />
        </CardContent>
      </Card>
      <DeleteCourseDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedCourse={selectedCourse}
        handleDelete={handleDelete}
      />
      <FacultyManagementDialog
        open={facultyDialogOpen}
        onOpenChange={setFacultyDialogOpen}
        selectedCourse={selectedCourse}
        faculties={faculties?.data || []}
        selectedFaculty={selectedFaculty}
        setSelectedFaculty={setSelectedFaculty}
        handleAssignFaculty={handleAssignFaculty}
        courseFaculties={courseFaculties}
        handleRemoveFaculty={handleRemoveFaculty}
      />
      <CourseFormDialog
        open={courseFormDialogOpen}
        onOpenChange={setCourseFormDialogOpen}
        selectedCourse={selectedCourse}
        setSelectedCourse={setSelectedCourse}
      />
    </motion.div>
  );
};

export default AdminCourseList;
