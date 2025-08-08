import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { createJob } from "@/redux/features/jobSlice";
import type { JobFormData } from "@/types/job";

const jobFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  requirements: z
    .string()
    .min(20, "Requirements must be at least 20 characters"),
  budget: z.object({
    min: z.number().min(0, "Minimum budget must be positive"),
    max: z.number().min(0, "Maximum budget must be positive"),
    currency: z.string(),
  }),
  duration: z.string().min(1, "Duration is required"),
  type: z.enum(["full-time", "part-time", "contract", "freelance"]),
  category: z.enum(["development", "design", "marketing", "writing"]),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  location: z.object({
    type: z.enum(["remote", "onsite", "hybrid"]),
    address: z.string().optional(),
  }),
  deadline: z.string().min(1, "Deadline is required"),
});

interface JobFormProps {
  onSuccess: () => void;
}

const JobForm = ({ onSuccess }: JobFormProps) => {
  const dispatch = useDispatch();
  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      budget: {
        min: 0,
        max: 0,
        currency: "USD",
      },
      duration: "",
      type: "full-time",
      category: "development",
      skills: [],
      location: {
        type: "remote",
      },
      deadline: "",
    },
  });

  const onSubmit = async (data: JobFormData) => {
    try {
      await dispatch(createJob(data));
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error creating job:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Job Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter job title" {...field} />
              </FormControl>
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
                <Textarea
                  placeholder="Enter job description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter job requirements"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="budget.min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum Budget</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter minimum budget"
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
            name="budget.max"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum Budget</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter maximum budget"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duration</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 3 months" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Job Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="full-time">Full Time</SelectItem>
                    <SelectItem value="part-time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="development">Development</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location.type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Application Deadline</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Post Job
        </Button>
      </form>
    </Form>
  );
};

export default JobForm;
