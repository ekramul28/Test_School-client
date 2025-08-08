"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import {
  useGetAllAcademicDepartmentsQuery,
  useCreateAcademicDepartmentMutation,
  useUpdateAcademicDepartmentMutation,
  useDeleteAcademicDepartmentMutation,
} from "@/redux/features/academic/academicDepartmentApi";
import { FormFields } from "@/components/ui/form-field";
import { Pencil, Trash2, Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useGetAllAcademicFacultiesQuery } from "@/redux/features/academic/academicFacultyApi";
import { Input } from "@/components/ui/input";
import { useGetAllAcademicYearsQuery } from "@/redux/features/academic/academicYearApi";

const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  academicFaculty: z.string().min(1, "Academic faculty is required"),
  description: z.string().optional(),
  headOfDepartment: z.string().optional(),
  academicYear: z.string().min(1, "Academic year is required"),
});

type DepartmentFormData = z.infer<typeof departmentSchema>;

const AcademicDepartment = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const { data: departments, isLoading } = useGetAllAcademicDepartmentsQuery(
    []
  );
  const {
    data: academicYears,
    isLoading: isLoadingYears,
    isError: isErrorYears,
  } = useGetAllAcademicYearsQuery([]);
  console.log("academicYears", academicYears);
  console.log("departments", departments);
  // Reset to first page on search
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const filteredDepartments = departments?.data?.filter((department: any) =>
    department.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const total = filteredDepartments?.length || 0;
  const totalPages = Math.ceil(total / limit);
  const paginatedDepartments = filteredDepartments?.slice(
    (page - 1) * limit,
    page * limit
  );

  const { data: faculties } = useGetAllAcademicFacultiesQuery([]);
  const [addDepartment] = useCreateAcademicDepartmentMutation();
  const [updateDepartment] = useUpdateAcademicDepartmentMutation();

  const form = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: "",
      academicFaculty: "",
      academicYear: "",
    },
  });

  const onSubmit = async (data: DepartmentFormData) => {
    try {
      if (selectedDepartment) {
        await updateDepartment({
          id: selectedDepartment._id,
          data: {
            ...data,
          },
        }).unwrap();
        toast({
          title: "Success",
          description: "Department updated successfully",
        });
      } else {
        await addDepartment({
          ...data,
        }).unwrap();
        toast({
          title: "Success",
          description: "Department added successfully",
        });
      }
      setIsOpen(false);
      form.reset();
      setSelectedDepartment(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save department",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (department: any) => {
    setSelectedDepartment(department);
    form.reset({
      name: department.name,
      academicFaculty: department.academicFaculty._id,
      academicYear: department.academicYear._id,
    });
    setIsOpen(true);
  };

  const totalPage = Math.ceil((departments?.meta?.total || 0) / limit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Academic Departments
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Manage academic departments and their details
            </p>
          </div>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Department
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedDepartment
                    ? "Edit Department"
                    : "Add New Department"}
                </DialogTitle>
                <DialogDescription>
                  {selectedDepartment
                    ? "Update the department information below."
                    : "Fill in the department information below."}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormFields.TextWithIcon
                    form={form}
                    name="name"
                    label="Department Name"
                    placeholder="e.g., Computer Science"
                    required
                  />
                  <FormFields.Select
                    form={form}
                    name="academicYear"
                    label="Academic Year"
                    placeholder="Select academic year"
                    options={
                      academicYears?.data?.map((year: any) => ({
                        label: year.name,
                        value: year._id,
                      })) || []
                    }
                    required
                  />
                  <FormFields.Select
                    form={form}
                    name="academicFaculty"
                    label="Academic Faculty"
                    placeholder="Select academic faculty"
                    options={
                      faculties?.data?.map((faculty: any) => ({
                        label: faculty.name,
                        value: faculty._id,
                      })) || []
                    }
                    required
                  />

                  <DialogFooter>
                    <Button type="submit" className="w-full">
                      {selectedDepartment
                        ? "Update Department"
                        : "Add Department"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="relative w-full max-w-sm mb-4">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search departments..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-8"
            />
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Department Name</TableHead>
                  <TableHead>Academic Faculty</TableHead>

                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDepartments?.map((department: any) => (
                  <TableRow key={department._id}>
                    <TableCell className="font-medium">
                      {department?.name}
                    </TableCell>
                    <TableCell>{department?.academicFaculty?.name}</TableCell>

                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(department)}
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {!isLoading && paginatedDepartments?.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No departments found matching your search.
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPage}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPage}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AcademicDepartment;
