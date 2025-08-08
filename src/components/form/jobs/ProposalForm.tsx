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
import { Textarea } from "@/components/ui/textarea";
import { useDispatch } from "react-redux";
import { submitProposal } from "@/redux/features/jobSlice";
import type { ProposalFormData } from "@/types/job";

const proposalFormSchema = z.object({
  jobId: z.string(),
  coverLetter: z
    .string()
    .min(100, "Cover letter must be at least 100 characters"),
  bid: z.number().min(0, "Bid must be positive"),
  estimatedDuration: z.string().min(1, "Estimated duration is required"),
});

interface ProposalFormProps {
  jobId: string;
  onSuccess: () => void;
}

const ProposalForm = ({ jobId, onSuccess }: ProposalFormProps) => {
  const dispatch = useDispatch();
  const form = useForm<ProposalFormData>({
    resolver: zodResolver(proposalFormSchema),
    defaultValues: {
      jobId,
      coverLetter: "",
      bid: 0,
      estimatedDuration: "",
    },
  });

  const onSubmit = async (data: ProposalFormData) => {
    try {
      await dispatch(submitProposal(data));
      form.reset();
      onSuccess();
    } catch (error) {
      console.error("Error submitting proposal:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="coverLetter"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cover Letter</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Explain why you're the best fit for this job..."
                  className="min-h-[200px]"
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
            name="bid"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Bid</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter your bid amount"
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
            name="estimatedDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Duration</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 2 weeks" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          Submit Proposal
        </Button>
      </form>
    </Form>
  );
};

export default ProposalForm;
