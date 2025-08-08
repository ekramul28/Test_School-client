import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { useUpdateJobMutation } from "@/redux/features/job/jobApi";
import { useState } from "react";

const EditJobModal = ({ job, onClose }: { job: any; onClose: () => void }) => {
  const [formData, setFormData] = useState({
    title: job.title || "",
    category: job.category || "",
    description: job.description || "",
    minPrice: job.minPrice || 0,
    maxPrice: job.maxPrice || 0,
    vacancy: job.vacancy || 1,
    workMode: job.workMode || "remote",
    deadline: job.deadline?.slice(0, 10) || "",
  });

  const [updateJob, { isLoading }] = useUpdateJobMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      await updateJob({ id: job._id, data: formData }).unwrap();
      toast({ title: "Job updated successfully!" });
      onClose();
    } catch (error) {
      toast({ title: "Failed to update job", variant: "destructive" });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>
        </DialogHeader>

        <div className="grid gap-3">
          <Input
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
          />
          <Input
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleChange}
          />
          <Input
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
          <Input
            name="minPrice"
            type="number"
            placeholder="Min Price"
            value={formData.minPrice}
            onChange={handleChange}
          />
          <Input
            name="maxPrice"
            type="number"
            placeholder="Max Price"
            value={formData.maxPrice}
            onChange={handleChange}
          />
          <Input
            name="vacancy"
            type="number"
            placeholder="Vacancy"
            value={formData.vacancy}
            onChange={handleChange}
          />
          <Input
            name="workMode"
            placeholder="Work Mode (remote/onsite/hybrid)"
            value={formData.workMode}
            onChange={handleChange}
          />
          <Input
            name="deadline"
            type="date"
            value={formData.deadline}
            onChange={handleChange}
          />
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="w-full mt-3"
          >
            {isLoading ? "Updating..." : "Update Job"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditJobModal;
