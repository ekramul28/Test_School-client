import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
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
  useCreateCourseMutation,
  useGetAllCoursesQuery,
  useUpdateCourseMutation,
} from "@/redux/features/course/courseApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Types
export type TPreRequisiteCourses = {
  course: string; // ObjectId as string in form
  isDeleted: boolean;
};

export type TSubject = {
  name: string;
  credits: number;
  isDeleted?: boolean;
  isDefault?: boolean; // New field to distinguish default vs optional subjects
};

export type TCourse = {
  title: string;
  prefix: string;
  code: number;
  credits: number;
  isDeleted?: boolean;
  preRequisiteCourses: TPreRequisiteCourses[];
  subjectType: "Theory" | "Lab" | "Project";
  note?: string;
  defaultSubjects?: TSubject[]; // 4 default subjects
  optionalSubjects?: TSubject[]; // 3 optional subjects
  subjectsToSelect?: number; // How many optional subjects to select (default: 2)
};

// Validation Schema
const PreRequisiteCourseValidationSchema = z.object({
  course: z.string(),
  isDeleted: z.boolean().optional(),
});

const SubjectValidationSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  credits: z.coerce.number().min(1, "Credits required"),
  isDeleted: z.boolean().optional(),
});

const createCourseValidationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  prefix: z.string().min(1, "Prefix is required"),
  code: z.string().min(1, "Code is required"),
  credits: z.string().min(1, "Credits is required"),
  preRequisiteCourses: z.array(PreRequisiteCourseValidationSchema).optional(),
  isDeleted: z.boolean().optional(),
  subjectType: z.enum(["Theory", "Lab", "Project"]),
  note: z.string().optional(),
  defaultSubjects: z.array(SubjectValidationSchema).optional(),
  optionalSubjects: z.array(SubjectValidationSchema).optional(),
  subjectsToSelect: z.string().optional(),
});

type TCourseFormValues = z.infer<typeof createCourseValidationSchema>;

interface CourseFormProps {
  course?: {
    id: string;
    title: string;
    prefix: string;
    code: number;
    credits: number;
    preRequisiteCourses?: TPreRequisiteCourses[];
    isDeleted?: boolean;
    subjectType?: "Theory" | "Lab" | "Project";
    note?: string;
    defaultSubjects?: TSubject[];
    optionalSubjects?: TSubject[];
    subjectsToSelect?: number;
  };
  onSuccess?: () => void;
}

const CourseForm = ({ course, onSuccess }: CourseFormProps) => {
  const { toast } = useToast();
  const [createCourse] = useCreateCourseMutation();
  const [updateCourse] = useUpdateCourseMutation();
  const { data: availableCourses } = useGetAllCoursesQuery([], {
    refetchOnMountOrArgChange: true,
  });

  const form = useForm<TCourseFormValues>({
    resolver: zodResolver(createCourseValidationSchema),
    defaultValues: {
      title: course?.title || "",
      prefix: course?.prefix || "",
      code: typeof course?.code === "number" ? String(course.code) : "",
      credits:
        typeof course?.credits === "number" ? String(course.credits) : "",
      preRequisiteCourses: course?.preRequisiteCourses || [],
      isDeleted: course?.isDeleted || false,
      subjectType: course?.subjectType || "Theory",
      note: course?.note || "",
      defaultSubjects: course?.defaultSubjects || [],
      optionalSubjects: course?.optionalSubjects || [],
      subjectsToSelect:
        typeof course?.subjectsToSelect === "number"
          ? String(course.subjectsToSelect)
          : "0",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const formattedData = {
        ...data,
        defaultSubjects: Array.isArray(data.defaultSubjects)
          ? data.defaultSubjects
          : [],
        optionalSubjects: Array.isArray(data.optionalSubjects)
          ? data.optionalSubjects
          : [],
        preRequisiteCourses: Array.isArray(data.preRequisiteCourses)
          ? data.preRequisiteCourses
          : [],
      };
      if (course) {
        await updateCourse({
          id: course.id,
          data: formattedData,
        }).unwrap();
        toast({
          title: "Success",
          description: "Course updated successfully",
        });
      } else {
        await createCourse(formattedData).unwrap();
        toast({
          title: "Success",
          description: "Course created successfully",
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
    <Card className="w-full overflow-auto h-[80vh]">
      <CardHeader>
        <CardTitle>{course ? "Edit Course" : "Add New Course"}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Enter course title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="prefix"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Prefix <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter course prefix" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Code <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter course code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="credits"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Credits <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter course credits"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subjectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject Type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Theory">Theory</SelectItem>
                        <SelectItem value="Lab">Lab</SelectItem>
                        <SelectItem value="Project">Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter note (optional)" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subjectsToSelect"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Optional Subjects to Select</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter number of optional subjects to select (default: 2)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Prerequisite Courses */}
            <FormField
              control={form.control}
              name="preRequisiteCourses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prerequisite Courses</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(value) => {
                        const currentPrereqs = field.value || [];
                        if (
                          !currentPrereqs.some(
                            (prereq) => prereq.course === value
                          )
                        ) {
                          field.onChange([
                            ...currentPrereqs,
                            { course: value, isDeleted: false },
                          ]);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select prerequisite course" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableCourses?.map((course) => (
                          <SelectItem key={course._id} value={course._id}>
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <div className="mt-2 space-y-2">
                    {(field.value || []).map((prereq, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <span>
                          {
                            availableCourses?.find(
                              (course) => course._id === prereq.course
                            )?.title
                          }
                        </span>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            const newPrereqs = (field.value || []).filter(
                              (_, i) => i !== index
                            );
                            field.onChange(newPrereqs);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Default Subjects (4 subjects) */}
            <FormField
              control={form.control}
              name="defaultSubjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Default Subjects (4 subjects - automatically included)
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {(field.value || []).map(
                        (subject: TSubject, idx: number) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <Input
                              placeholder="Subject Name"
                              value={subject.name}
                              onChange={(e) => {
                                const updated = [...(field.value || [])];
                                updated[idx].name = e.target.value;
                                field.onChange(updated);
                              }}
                            />
                            <Input
                              type="number"
                              placeholder="Credits"
                              value={subject.credits}
                              onChange={(e) => {
                                const updated = [...(field.value || [])];
                                updated[idx].credits = Number(e.target.value);
                                field.onChange(updated);
                              }}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const updated = (field.value || []).filter(
                                  (_: any, i: number) => i !== idx
                                );
                                field.onChange(updated);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        )
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          field.onChange([
                            ...(field.value || []),
                            { name: "", credits: 0, isDefault: true },
                          ]);
                        }}
                      >
                        Add Default Subject
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Optional Subjects (3 subjects) */}
            <FormField
              control={form.control}
              name="optionalSubjects"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Optional Subjects (3 subjects - students select 2)
                  </FormLabel>
                  <FormControl>
                    <div className="space-y-2">
                      {(field.value || []).map(
                        (subject: TSubject, idx: number) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <Input
                              placeholder="Subject Name"
                              value={subject.name}
                              onChange={(e) => {
                                const updated = [...(field.value || [])];
                                updated[idx].name = e.target.value;
                                field.onChange(updated);
                              }}
                            />
                            <Input
                              type="number"
                              placeholder="Credits"
                              value={subject.credits}
                              onChange={(e) => {
                                const updated = [...(field.value || [])];
                                updated[idx].credits = Number(e.target.value);
                                field.onChange(updated);
                              }}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                const updated = (field.value || []).filter(
                                  (_: any, i: number) => i !== idx
                                );
                                field.onChange(updated);
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        )
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          field.onChange([
                            ...(field.value || []),
                            { name: "", credits: 0, isDefault: false },
                          ]);
                        }}
                      >
                        Add Optional Subject
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isDeleted"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Mark as Deleted</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              {course ? "Update Course" : "Create Course"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CourseForm;
