import { zodResolver } from "@hookform/resolvers/zod";
// import { useAddSemesterRegistrationMutation } from "@/redux/features/SemesterRegistrations/SemesterRegistrationApi";
import { useForm } from "react-hook-form";
// import { useGetAllAcademicSemestersQuery } from "@/redux/features/academicSemester/academicSemesterApi";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useGetAllAcademicSemestersQuery } from "@/redux/features/academic/academicSemesterApi";
import {
  useCreateSemesterRegistrationMutation,
  useDeleteSemesterRegistrationMutation,
  useGetAllSemesterRegistrationsQuery,
  useUpdateSemesterRegistrationMutation,
} from "@/redux/features/semesterRegistration/semesterRegistrationApi";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const semesterRegistrationSchema = z
  .object({
    academicSemester: z.string().min(1, "Academic Semester is required"),
    status: z.enum(["UPCOMING", "ONGOING", "ENDED"]),
    startDate: z
      .string()
      .min(1, "Start Date is required")
      .refine((date) => {
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
      }, "Invalid start date"),
    endDate: z
      .string()
      .min(1, "End Date is required")
      .refine((date) => {
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
      }, "Invalid end date")
      .refine((data: any) => {
        const startDate = data?.startDate;
        if (!startDate) return true;
        return new Date(data?.endDate) > new Date(startDate);
      }, "End date must be after start date"),
    minCredit: z.number().min(0, "Min Credit must be a positive number"),

    maxCredit: z.number().min(0, "Max Credit must be a positive number"),
  })
  .refine((data) => data.maxCredit >= data.minCredit, {
    message: "Max credit must be greater than or equal to min credit",
    path: ["maxCredit"],
  });

type TSemesterRegistration = z.infer<typeof semesterRegistrationSchema>;

interface SemesterRegistrationFromProps {
  initialStatus?: "UPCOMING" | "ONGOING" | "ENDED";
}

const SemesterRegistrationFrom = ({
  initialStatus,
}: SemesterRegistrationFromProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [createSemesterRegistration] = useCreateSemesterRegistrationMutation();
  const [updateSemesterRegistration] = useUpdateSemesterRegistrationMutation();
  const [deleteSemesterRegistration] = useDeleteSemesterRegistrationMutation();
  // const { data: academicSemesters } = useGetAllAcademicSemestersQuery([]);
  const { data: academicSemesters } = useGetAllAcademicSemestersQuery([]);
  const { data: semesterRegistrations, isLoading } =
    useGetAllSemesterRegistrationsQuery([]);

  const form = useForm<TSemesterRegistration>({
    resolver: zodResolver(semesterRegistrationSchema),
    defaultValues: {
      academicSemester: "",
      status: "UPCOMING",
      startDate: "",
      endDate: "",
      minCredit: 0,
      maxCredit: 0,
    },
  });

  const onSubmit = async (data: TSemesterRegistration) => {
    try {
      // Format dates to ISO string
      const formattedData = {
        ...data,
        startDate: new Date(data.startDate).toISOString(),
        endDate: new Date(data.endDate).toISOString(),
      };

      if (selectedId) {
        const res = await updateSemesterRegistration({
          id: selectedId,
          data: formattedData,
        }).unwrap();
        if (res?.success) {
          toast.success("Semester Registration updated successfully!");
          setIsOpen(false);
          form.reset();
          setSelectedId(null);
        }
      } else {
        const res = await createSemesterRegistration(formattedData).unwrap();
        if (res?.success) {
          toast.success("Semester Registration created successfully!");
          setIsOpen(false);
          form.reset();
        }
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Something went wrong!");
      console.log(err.data);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await deleteSemesterRegistration(id).unwrap();
      if (res?.success) {
        toast.success("Semester Registration deleted successfully!");
      }
    } catch (err: any) {
      toast.error(err.data?.message || "Something went wrong!");
    }
  };

  const handleEdit = (registration: any) => {
    setSelectedId(registration._id);
    form.reset({
      academicSemester: registration.academicSemester._id,
      status: registration.status,
      startDate: new Date(registration.startDate).toISOString().split("T")[0],
      endDate: new Date(registration.endDate).toISOString().split("T")[0],
      minCredit: registration.minCredit,
      maxCredit: registration.maxCredit,
    });
    setIsOpen(true);
  };

  // Fix: Ensure academicSemesters is loaded and has data, and handle possible API response shape
  const academicSemesterOptions =
    academicSemesters && Array.isArray(academicSemesters.data)
      ? academicSemesters.data
          .filter(
            (semester: any) =>
              semester &&
              (semester.name || semester.name === "") &&
              (semester.year || semester.year === "" || semester.academicYear)
          )
          .map((semester: any) => ({
            value: semester._id,
            // Try to show both name and year/academicYear for clarity
            label: `${semester.name || ""} ${
              semester.year || semester.academicYear || ""
            }`.trim(),
          }))
      : [];

  console.log("academicSemesterOptions", academicSemesters?.data);
  console.log("academicSeme", academicSemesterOptions);
  const statusOptions = [
    { value: "UPCOMING", label: "Upcoming" },
    { value: "ONGOING", label: "Ongoing" },
    { value: "ENDED", label: "Ended" },
  ];

  const filteredRegistrations = semesterRegistrations?.data?.filter(
    (registration: any) =>
      registration &&
      registration.academicSemester &&
      (!initialStatus || registration.status === initialStatus)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {initialStatus
            ? `${
                initialStatus.charAt(0) + initialStatus.slice(1).toLowerCase()
              } Registrations`
            : "Semester Registration Management"}
        </h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setSelectedId(null);
                form.reset({
                  ...form.getValues(),
                  status: initialStatus || "UPCOMING",
                });
              }}
            >
              Add New Registration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>
                {selectedId
                  ? "Edit Semester Registration"
                  : "Create Semester Registration"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="academicSemester"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Academic Semester</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select semester" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {academicSemesterOptions?.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
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
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {statusOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
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
                    name="startDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Start Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            min={new Date().toISOString().split("T")[0]}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>End Date</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            min={
                              form.watch("startDate") ||
                              new Date().toISOString().split("T")[0]
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="minCredit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Min Credit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="maxCredit"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Max Credit</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  {selectedId ? "Update Registration" : "Create Registration"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Academic Semester</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Min Credit</TableHead>
              <TableHead>Max Credit</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filteredRegistrations?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No semester registrations found
                </TableCell>
              </TableRow>
            ) : (
              filteredRegistrations?.map((registration: any) => (
                <TableRow key={registration._id}>
                  <TableCell>
                    {registration.academicSemester.name}{" "}
                    {registration.academicSemester.year}
                  </TableCell>
                  <TableCell>{registration.status}</TableCell>
                  <TableCell>
                    {new Date(registration.startDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {new Date(registration.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{registration.minCredit}</TableCell>
                  <TableCell>{registration.maxCredit}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(registration)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(registration._id)}
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
    </div>
  );
};

export default SemesterRegistrationFrom;
