import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { FormFields } from "@/components/ui/form-field";
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
  useCreateAcademicSemesterMutation,
  useGetAllAcademicSemestersQuery,
  useUpdateAcademicSemesterMutation,
} from "@/redux/features/academic/academicSemesterApi";
import { useGetAllAcademicYearsQuery } from "@/redux/features/academic/academicYearApi";
import {
  type CreateSemesterDto,
  Months,
  type Semester,
} from "@/types/academic";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export type TAcademicSemesterName =
  | "1st Semester"
  | "2nd Semester"
  | "3rd Semester"
  | "4th Semester"
  | "5th Semester"
  | "6th Semester"
  | "7th Semester"
  | "8th Semester";
export type TAcademicSemesterCode =
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08";

const semesterSchema = z.object({
  name: z.enum(
    [
      "1st Semester",
      "2nd Semester",
      "3rd Semester",
      "4th Semester",
      "5th Semester",
      "6th Semester",
      "7th Semester",
      "8th Semester",
    ],
    { required_error: "Semester name is required" }
  ),
  // year: z.string().min(1, "Year is required"),
  code: z.enum(["01", "02", "03", "04", "05", "06", "07", "08"], {
    required_error: "Semester code is required",
  }),
  startMonth: z.nativeEnum(Months, {
    required_error: "Start month is required",
  }),
  endMonth: z.nativeEnum(Months, { required_error: "End month is required" }),
  academicYear: z.string().min(1, "Academic Year is required"),
});

type SemesterFormData = z.infer<typeof semesterSchema>;

const AdmissionSemester = () => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(
    null
  );

  const { data: semesters, isLoading } = useGetAllAcademicSemestersQuery([]);
  const [addSemester] = useCreateAcademicSemesterMutation();
  const [updateSemester] = useUpdateAcademicSemesterMutation();
  const { data: academicYears } = useGetAllAcademicYearsQuery([]);

  const semesterNameToCode: Record<string, string> = {
    "1st Semester": "01",
    "2nd Semester": "02",
    "3rd Semester": "03",
    "4th Semester": "04",
    "5th Semester": "05",
    "6th Semester": "06",
    "7th Semester": "07",
    "8th Semester": "08",
  };

  const form = useForm<SemesterFormData>({
    resolver: zodResolver(semesterSchema),
    defaultValues: {
      name: "1st Semester",
      // year: "",
      code: "01",
      startMonth: Months.JANUARY,
      endMonth: Months.DECEMBER,
      academicYear: "",
    },
  });

  // Automatically update code when name changes
  useEffect(() => {
    const subscription = form.watch((value, { name: changedField }) => {
      if (changedField === "name" && value.name) {
        // Ensure the value is a valid key of semesterNameToCode
        const code =
          semesterNameToCode[value.name as keyof typeof semesterNameToCode];
        if (code) {
          form.setValue("code", code as SemesterFormData["code"]);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: SemesterFormData) => {
    try {
      if (selectedSemester) {
        const updateData = {
          id: selectedSemester._id,
          data: {
            name: data.name,
            // year: data.year,
            code: data.code,
            startMonth: data.startMonth,
            endMonth: data.endMonth,
            academicYear: data.academicYear,
          },
        };
        await updateSemester(updateData).unwrap();
        toast({
          title: "Success",
          description: "Semester updated successfully",
        });
      } else {
        const createData: CreateSemesterDto = {
          name: data.name as CreateSemesterDto["name"],
          // year: data.year,
          code: data.code as CreateSemesterDto["code"],
          startMonth: data.startMonth,
          endMonth: data.endMonth,
          academicYear: data.academicYear,
        };
        await addSemester(createData).unwrap();
        toast({
          title: "Success",
          description: "Semester added successfully",
        });
      }
      setIsOpen(false);
      form.reset();
      setSelectedSemester(null);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Failed to save semester",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (semester: Semester) => {
    setSelectedSemester(semester);
    form.reset({
      name: semester.name,
      // year: semester.year,
      code: semester.code,
      startMonth: semester.startMonth,
      endMonth: semester.endMonth,
      academicYear:
        typeof semester.academicYear === "object" &&
        semester.academicYear !== null
          ? semester.academicYear._id
          : semester.academicYear,
    });
    setIsOpen(true);
  };

  // Convert union values to select options format
  const semesterNameOptions = [
    "1st Semester",
    "2nd Semester",
    "3rd Semester",
    "4th Semester",
    "5th Semester",
    "6th Semester",
    "7th Semester",
    "8th Semester",
  ].map((value) => ({ label: value, value }));

  const semesterCodeOptions = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
  ].map((value) => ({ label: value, value }));

  const monthOptions = Object.values(Months).map((value) => ({
    label: value,
    value: value,
  }));

  const academicYearOptions = academicYears?.data?.map((year: any) => ({
    label: year.name,
    value: year._id,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Academic Semesters</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Add New Semester</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedSemester ? "Edit Semester" : "Add New Semester"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormFields.Select
                  form={form}
                  name="name"
                  label="Semester Name"
                  options={semesterNameOptions || []}
                  required
                />
                <FormFields.Select
                  form={form}
                  name="code"
                  label="Semester Code"
                  options={semesterCodeOptions || []}
                  required
                  disabled
                />

                <FormFields.Select
                  form={form}
                  name="academicYear"
                  label="Academic Year"
                  options={academicYearOptions || []}
                  required
                />

                <FormFields.Select
                  form={form}
                  name="startMonth"
                  label="Start Month"
                  options={monthOptions}
                  required
                />
                <FormFields.Select
                  form={form}
                  name="endMonth"
                  label="End Month"
                  options={monthOptions}
                  required
                />
                <Button type="submit" className="w-full">
                  {selectedSemester ? "Update Semester" : "Add Semester"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Semester Name</TableHead>
              <TableHead>Academic Year</TableHead>
              {/* <TableHead>Year</TableHead> */}
              <TableHead>Code</TableHead>
              <TableHead>Start Month</TableHead>
              <TableHead>End Month</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {semesters?.data?.map((semester: any) => (
              <TableRow key={semester.id}>
                <TableCell>{semester.name}</TableCell>
                <TableCell>
                  {typeof semester.academicYear === "object" &&
                  semester.academicYear !== null
                    ? semester.academicYear.name
                    : semester.academicYear || "N/A"}
                </TableCell>

                {/* <TableCell>{semester.year}</TableCell> */}
                <TableCell>{semester.code}</TableCell>
                <TableCell>{semester.startMonth}</TableCell>
                <TableCell>{semester.endMonth}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(semester)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </motion.div>
  );
};

export default AdmissionSemester;
