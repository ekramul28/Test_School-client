import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useCreateJobMutation } from "@/redux/features/job/jobApi";
import { useAppSelector } from "@/redux/hooks";
import { useEffect, useState } from "react";

type WorkMode = "remote" | "onsite" | "hybrid";

interface CreateJobModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateJobModal = ({ open, onClose, onCreated }: CreateJobModalProps) => {
  const { toast } = useToast();
  const { user } = useAppSelector((state) => state.auth);
  const [createJob, { isLoading, isSuccess }] = useCreateJobMutation();

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    bannerImage: "",
    profileImage: "",
    minPrice: "",
    maxPrice: "",
    deadline: "",
    vacancy: "",
    workMode: "remote" as WorkMode,
  });

  const resetForm = () => {
    setForm({
      title: "",
      category: "",
      description: "",
      bannerImage: "",
      profileImage: "",
      minPrice: "",
      maxPrice: "",
      deadline: "",
      vacancy: "",
      workMode: "remote",
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const {
      title,
      category,
      description,
      minPrice,
      maxPrice,
      deadline,
      vacancy,
      workMode,
      bannerImage,
      profileImage,
    } = form;

    if (
      !title ||
      !category ||
      !description ||
      !minPrice ||
      !maxPrice ||
      !deadline ||
      !vacancy
    ) {
      toast({
        title: "Missing Fields",
        description: "Please fill all required fields.",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = {
        title,
        category,
        description,
        bannerImage: bannerImage || undefined,
        profileImage: profileImage || undefined,
        minPrice: Number(minPrice),
        maxPrice: Number(maxPrice),
        deadline,
        vacancy: Number(vacancy),
        workMode,
        // author: user?._id,
      };

      if (
        isNaN(payload.minPrice) ||
        isNaN(payload.maxPrice) ||
        isNaN(payload.vacancy)
      ) {
        throw new Error("Price and vacancy must be valid numbers.");
      }

      await createJob(payload).unwrap();
    } catch (err: any) {
      console.error("Create job error:", err);
      toast({
        title: "Creation Failed",
        description:
          err?.data?.message ||
          err?.error ||
          err?.message ||
          "Failed to post job, please try again.",
        variant: "destructive",
      });
    }
  };

  // ✅ Handle success: show toast, close modal, reset form
  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Job Created",
        description: "Job posted successfully.",
      });

      onCreated?.(); // if exists
      resetForm();
      onClose?.(); // safely call onClose
    }
  }, [isSuccess]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-4 max-w-md max-h-[80vh] overflow-y-auto p-4">
        <DialogTitle>Create a New Job</DialogTitle>
        <DialogDescription>
          Fill out the form below to post a job opportunity.
        </DialogDescription>

        <Input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Job Title"
          required
        />
        <Input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />
        <Input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Job Description"
          required
        />
        <Input
          name="bannerImage"
          value={form.bannerImage}
          onChange={handleChange}
          placeholder="Banner Image URL"
        />
        <Input
          name="profileImage"
          value={form.profileImage}
          onChange={handleChange}
          placeholder="Company Logo URL"
        />
        <Input
          name="minPrice"
          value={form.minPrice}
          onChange={handleChange}
          type="number"
          placeholder="Min Budget"
          required
        />
        <Input
          name="maxPrice"
          value={form.maxPrice}
          onChange={handleChange}
          type="number"
          placeholder="Max Budget"
          required
        />
        <Input
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          type="date"
          required
        />
        <Input
          name="vacancy"
          value={form.vacancy}
          onChange={handleChange}
          type="number"
          placeholder="Vacancy Count"
          required
        />
        <select
          name="workMode"
          value={form.workMode}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2 text-sm"
        >
          <option value="remote">Remote</option>
          <option value="onsite">Onsite</option>
          <option value="hybrid">Hybrid</option>
        </select>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Posting..." : "Post Job"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateJobModal;
