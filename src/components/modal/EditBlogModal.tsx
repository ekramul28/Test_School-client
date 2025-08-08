import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useUpdateBlogMutation } from "@/redux/features/blog/blogApi";
import type { IBlog } from "@/types/blog";
import { useEffect, useState } from "react";

const EditBlogModal = ({
  blog,
  onClose,
}: {
  blog: IBlog | null;
  onClose: () => void;
}) => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "",
    link: "",
    bannerImage: "",
    profileImage: "",
  });

  const [updateBlog] = useUpdateBlogMutation();
  const { toast } = useToast();

  useEffect(() => {
    if (blog) {
      setForm({
        title: blog.title || "",
        description: blog.description || "",
        category: blog.category || "",
        link: blog.link || "",
        bannerImage: blog.bannerImage || "",
        profileImage: blog.profileImage || "",
      });
    }
  }, [blog]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      await updateBlog({ id: blog!._id!, data: form }).unwrap();
      toast({
        title: "Blog Updated",
        description: "Changes saved successfully.",
      });
      onClose();
    } catch {
      toast({
        title: "Update Failed",
        description: "Something went wrong.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={!!blog} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
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
        <Input
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
          <Button onClick={handleSubmit}>Update Blog</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditBlogModal;
