import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useCreateBlogMutation } from "@/redux/features/blog/blogApi";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateBlogModal = ({ open, onClose }: Props) => {
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const [createBlog] = useCreateBlogMutation();

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    link: "",
    bannerImage: "",
    profileImage: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { title, category, description } = form;

    if (!title || !category || !description) {
      toast({
        title: "Missing Fields",
        description: "Title, category, and description are required.",
        variant: "destructive",
      });
      return;
    }

    if (user?._id) {
      toast({
        title: "Unauthorized",
        description: "Please log in to create a blog.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createBlog({
        ...form,
        createdBy: user._id,
      }).unwrap();

      toast({
        title: "Blog Created",
        description: "Your blog has been successfully posted.",
      });

      onClose();
      setForm({
        title: "",
        description: "",
        category: "",
        link: "",
        bannerImage: "",
        profileImage: "",
      });
    } catch (err) {
      toast({
        title: "Creation Failed",
        description: "Something went wrong while creating the blog.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <DialogTitle>Create New Blog</DialogTitle>
        <DialogDescription>
          Fill in the fields below to share your blog with others.
        </DialogDescription>

        <Input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Blog Title"
        />
        <Input
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
        />
        <Textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Short Description"
        />
        <Input
          name="link"
          value={form.link}
          onChange={handleChange}
          placeholder="External Blog Link (optional)"
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
          placeholder="Author Profile Image URL"
        />

        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Create Blog</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBlogModal;
