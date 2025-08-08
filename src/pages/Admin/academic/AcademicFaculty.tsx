import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Building2,
  Users,
  GraduationCap,
  Plus,
  Pencil,
  Search,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  useCreateAcademicFacultyMutation,
  useGetAllAcademicFacultiesQuery,
  useUpdateAcademicFacultyMutation,
} from "@/redux/features/academic/academicFacultyApi";
import { useGetAllAcademicYearsQuery } from "@/redux/features/academic/academicYearApi";

const facultySchema = z.object({
  name: z.string().min(1, "Faculty name is required"),
  academicYear: z.string().min(1, "Academic year is required"),
  description: z.string().optional(),
});

type FacultyFormData = z.infer<typeof facultySchema>;

const AcademicFaculty = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [addFaculty] = useCreateAcademicFacultyMutation();
  const [updateFaculty] = useUpdateAcademicFacultyMutation();

  const {
    data: faculties,
    isLoading,
    isError,
  } = useGetAllAcademicFacultiesQuery([]);
  console.log("faculties", faculties);
  const { data: academicYears } = useGetAllAcademicYearsQuery([]);

  const form = useForm<FacultyFormData>({
    resolver: zodResolver(facultySchema),
    defaultValues: {
      name: "",
      academicYear: "",
      description: "",
    },
  });

  // Reset to first page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredFaculties = faculties?.data?.filter((faculty: any) =>
    faculty.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const total = filteredFaculties?.length || 0;
  const totalPages = Math.ceil(total / itemsPerPage);
  const paginatedFaculties = filteredFaculties?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const onSubmit = async (data: FacultyFormData) => {
    try {
      if (selectedFaculty) {
        await updateFaculty({
          id: selectedFaculty._id,
          data,
        }).unwrap();
        toast({
          title: "Success",
          description: "Faculty updated successfully",
        });
      } else {
        await addFaculty(data).unwrap();
        console.log("ok");
        toast({
          title: "Success",
          description: "Faculty added successfully",
        });
      }
      setIsDialogOpen(false);
      form.reset();
      setSelectedFaculty(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Failed to save faculty data",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (faculty: any) => {
    setSelectedFaculty(faculty);
    form.reset({
      name: faculty.name || "",
      academicYear: faculty.academicYear?._id || faculty.academicYear || "",
      description: faculty.description || "",
    });
    setIsDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 max-w-7xl mx-auto"
    >
      <Card className="border-border/50">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex flex-col gap-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                Academic Faculties
              </CardTitle>
              <p className="text-muted-foreground">
                Manage academic faculties and their departments
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setSelectedFaculty(null);
                    form.reset();
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Faculty
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {selectedFaculty ? "Edit Faculty" : "Add New Faculty"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Faculty Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter faculty name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="academicYear"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Academic Year</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select academic year" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {academicYears?.data?.map((year: any) => (
                                <SelectItem key={year._id} value={year._id}>
                                  {year.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter faculty description"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full">
                      {selectedFaculty ? "Update Faculty" : "Add Faculty"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative max-w-md mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search faculties..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedFaculties?.map((faculty: any) => (
                  <motion.div
                    key={faculty._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <Card className="h-full hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/30">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1">
                            <h3 className="text-xl font-semibold">
                              {faculty.name}
                            </h3>
                            {faculty.academicYear && (
                              <p className="text-sm text-primary">
                                {typeof faculty.academicYear === "string"
                                  ? faculty.academicYear
                                  : faculty.academicYear.name}
                              </p>
                            )}
                            <p className="text-sm text-muted-foreground">
                              {faculty.description}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(faculty)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <div className="bg-primary/10 p-2 rounded-lg">
                              <Building2 className="h-6 w-6 text-primary" />
                            </div>
                          </div>
                        </div>
                        <div className="space-y-3 pt-2">
                          <div className="flex flex-wrap gap-2">
                            {faculty.totalDepartments > 0 && (
                              <Badge
                                variant="secondary"
                                className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                              >
                                <Users className="w-3 h-3 mr-1" />
                                {faculty.totalDepartments} Departments
                              </Badge>
                            )}
                            {faculty.totalStudents > 0 && (
                              <Badge
                                variant="secondary"
                                className="bg-green-50 text-green-700 hover:bg-green-100"
                              >
                                <GraduationCap className="w-3 h-3 mr-1" />
                                {faculty.totalStudents} Students
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Pagination */}
              {total > itemsPerPage && (
                <div className="flex justify-center mt-6 gap-2 items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-muted-foreground text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          {!isLoading && filteredFaculties?.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 gap-4"
            >
              <div className="bg-blue-100 p-6 rounded-full">
                <Building2 className="h-10 w-10 text-blue-600" />
              </div>
              <p className="text-center text-lg text-muted-foreground">
                No faculties found matching your search.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AcademicFaculty;
