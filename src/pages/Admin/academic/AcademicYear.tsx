import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Calendar, Plus, Pencil, Search, Circle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
  useCreateAcademicYearMutation,
  useGetAllAcademicYearsQuery,
  useUpdateAcademicYearMutation,
} from "@/redux/features/academic/academicYearApi";

const academicYearSchema = z.object({
  name: z.string().min(1, "Academic year name is required"),
});

type AcademicYearFormData = z.infer<typeof academicYearSchema>;

const AcademicYear = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const [addYear] = useCreateAcademicYearMutation();
  const [updateYear] = useUpdateAcademicYearMutation();

  const {
    data: academicYears,
    isLoading,
    isError,
  } = useGetAllAcademicYearsQuery([]);
  console.log("academick", isError);

  const form = useForm<AcademicYearFormData>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      name: "",
    },
  });

  // Reset to first page on search
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const filteredYears = academicYears?.data?.filter((year: any) =>
    year.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const total = filteredYears?.length || 0;
  const totalPages = Math.ceil(total / itemsPerPage);
  const paginatedYears = filteredYears?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const onSubmit = async (data: AcademicYearFormData) => {
    try {
      if (selectedYear) {
        await updateYear({
          id: selectedYear._id,
          data,
        }).unwrap();
        toast({
          title: "Success",
          description: "Academic year updated successfully",
        });
      } else {
        await addYear(data).unwrap();
        toast({
          title: "Success",
          description: "Academic year added successfully",
        });
      }
      setIsDialogOpen(false);
      form.reset();
      setSelectedYear(null);
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error?.data?.message || "Failed to save academic year data",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (year: any) => {
    setSelectedYear(year);
    form.reset({
      name: year.name || "",
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
                Academic Years
              </CardTitle>
              <p className="text-muted-foreground">
                Manage academic years and their active status
              </p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => {
                    setSelectedYear(null);
                    form.reset();
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Academic Year
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {selectedYear
                      ? "Edit Academic Year"
                      : "Add New Academic Year"}
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
                          <FormLabel>Academic Year Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2024-2025" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full">
                      {selectedYear
                        ? "Update Academic Year"
                        : "Add Academic Year"}
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
          <div className="relative max-w-md mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search academic years..."
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
                {paginatedYears?.map((year: any) => (
                  <motion.div
                    key={year._id}
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
                              {year.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                <Circle className="w-3 h-3 mr-1" />
                                Active
                              </Badge>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(year)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>

                            <div className="bg-primary/10 p-2 rounded-lg">
                              <Calendar className="h-6 w-6 text-primary" />
                            </div>
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

          {!isLoading && filteredYears?.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12 gap-4"
            >
              <div className="bg-blue-100 p-6 rounded-full">
                <Calendar className="h-10 w-10 text-blue-600" />
              </div>
              <p className="text-center text-lg text-muted-foreground">
                No academic years found matching your search.
              </p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AcademicYear;
