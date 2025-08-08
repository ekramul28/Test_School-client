import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  useCreateOfferedCourseMutation,
  useUpdateOfferedCourseMutation,
} from "@/redux/features/course/offerCourseApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import type { Days } from "@/types/offeredCourse";
import { useGetAllAcademicFacultiesQuery } from "@/redux/features/academic/academicFacultyApi";
import { useGetAllCoursesQuery } from "@/redux/features/course/courseApi";
import { useGetAllFacultiesQuery } from "@/redux/features/faculty/facultyApi";
import { useGetAllAcademicDepartmentsQuery } from "@/redux/features/academic/academicDepartmentApi";
import { useGetAllSemesterRegistrationsQuery } from "@/redux/features/semesterRegistration/semesterRegistrationApi";

// Validation Schema
const timeStringSchema = z.string().refine(
  (time) => {
    const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(time);
  },
  {
    message: 'Invalid time format, expected "HH:MM" in 24 hours format',
  }
);

const createOfferedCourseValidationSchema = z
  .object({
    semesterRegistration: z
      .string()
      .min(1, "Semester registration is required"),
    academicFaculty: z.string().min(1, "Academic faculty is required"),
    academicDepartment: z.string().min(1, "Academic department is required"),
    course: z.string().min(1, "Course is required"),
    faculty: z.string().min(1, "Faculty is required"),
    section: z.number().min(1, "Section is required"),
    maxCapacity: z.number().min(1, "Max capacity is required"),
    image: z.string().url().optional(),
    days: z.array(z.enum(["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"])),
    startTime: timeStringSchema,
    endTime: timeStringSchema,
  })
  .refine(
    (data) => {
      const start = new Date(`1970-01-01T${data.startTime}:00`);
      const end = new Date(`1970-01-01T${data.endTime}:00`);
      return end > start;
    },
    {
      message: "Start time should be before End time!",
      path: ["endTime"],
    }
  );

type TOfferedCourseFormValues = z.infer<
  typeof createOfferedCourseValidationSchema
>;

interface OfferedCourseFormProps {
  offeredCourse?: {
    id: string;
    semesterRegistration: string;
    academicFaculty: string;
    academicDepartment: string;
    course: string;
    faculty: string;
    section: number;
    maxCapacity: number;
    image?: string;
    days: Days[];
    startTime: string;
    endTime: string;
  };
  onSuccess?: () => void;
}

const OfferedCourseForm = ({
  offeredCourse,
  onSuccess,
}: OfferedCourseFormProps) => {
  const { toast } = useToast();
  const [createOfferedCourse] = useCreateOfferedCourseMutation();
  const [updateOfferedCourse] = useUpdateOfferedCourseMutation();

  // Fetch data for select inputs
  const { data: semesterRegistrations } = useGetAllSemesterRegistrationsQuery(
    []
  );
  const { data: academicFaculties } = useGetAllAcademicFacultiesQuery([]);
  const { data: academicDepartments } = useGetAllAcademicDepartmentsQuery([]);

  const { data: courses } = useGetAllCoursesQuery([]);
  const { data: faculties } = useGetAllFacultiesQuery([]);

  const form = useForm<TOfferedCourseFormValues>({
    resolver: zodResolver(createOfferedCourseValidationSchema),
    defaultValues: {
      semesterRegistration: offeredCourse?.semesterRegistration || "",
      academicFaculty: offeredCourse?.academicFaculty || "",
      academicDepartment: offeredCourse?.academicDepartment || "",
      course: offeredCourse?.course || "",
      faculty: offeredCourse?.faculty || "",
      section: offeredCourse?.section || 1,
      maxCapacity: offeredCourse?.maxCapacity || 30,
      image: offeredCourse?.image || "",
      days: offeredCourse?.days || [],
      startTime: offeredCourse?.startTime || "",
      endTime: offeredCourse?.endTime || "",
    },
  });

  const onSubmit = async (data: TOfferedCourseFormValues) => {
    try {
      if (offeredCourse) {
        await updateOfferedCourse({
          id: offeredCourse.id,
          data,
        }).unwrap();
        toast({
          title: "Success",
          description: "Offered course updated successfully",
        });
      } else {
        await createOfferedCourse(data).unwrap();
        toast({
          title: "Success",
          description: "Offered course created successfully",
        });
      }

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {offeredCourse ? "Edit Offered Course" : "Add New Offered Course"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="semesterRegistration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Semester Registration{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select semester registration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {semesterRegistrations?.data
                          ?.filter(
                            (semester: any) =>
                              semester && semester.academicSemester
                          )
                          .map((semester: any) => (
                            <SelectItem key={semester._id} value={semester._id}>
                              {semester.academicSemester.name}
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
                name="academicFaculty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Academic Faculty <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select academic faculty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {/* If academicFaculties or academicFaculties.data is not available, show a message */}
                        {!academicFaculties?.data ? (
                          <div className="px-2 py-1 text-sm text-muted-foreground">
                            No faculty data found.
                          </div>
                        ) : (
                          academicFaculties.data
                            .filter((faculty: any) => faculty && faculty.name)
                            .map((faculty: any) => (
                              <SelectItem key={faculty._id} value={faculty._id}>
                                {faculty.name}
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="academicDepartment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Academic Department{" "}
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select academic department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {academicDepartments?.data
                          ?.filter(
                            (department: any) => department && department.name
                          )
                          .map((department: any) => (
                            <SelectItem
                              key={department._id}
                              value={department._id}
                            >
                              {department.name}
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
                name="course"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Course <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select course" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {courses
                          ?.filter((course: any) => course && course.title)
                          .map((course: any) => (
                            <SelectItem key={course._id} value={course._id}>
                              {course.title} ({course.code})
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="faculty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Faculty <span className="text-red-500">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select faculty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {faculties?.data
                          ?.filter(
                            (faculty: any) => faculty && faculty.fullName
                          )
                          .map((faculty: any) => (
                            <SelectItem key={faculty._id} value={faculty._id}>
                              {faculty.fullName}
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
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Section <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter section"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="maxCapacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Max Capacity <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter max capacity"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter image URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Start Time <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      End Time <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="days"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Days <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="grid grid-cols-4 gap-2">
                    {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                      (day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            checked={field.value?.includes(day as Days)}
                            onCheckedChange={(checked) => {
                              const currentDays = field.value || [];
                              if (checked) {
                                field.onChange([...currentDays, day as Days]);
                              } else {
                                field.onChange(
                                  currentDays.filter((d) => d !== day)
                                );
                              }
                            }}
                          />
                          <label className="text-sm">{day}</label>
                        </div>
                      )
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {offeredCourse
                ? "Update Offered Course"
                : "Create Offered Course"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default OfferedCourseForm;
