import CreateJobModal from "@/components/modal/CreateJobModal";
import EditJobModal from "@/components/modal/EditJobModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import {
  useDeleteJobMutation,
  useGetAllJobsQuery,
} from "@/redux/features/job/jobApi";
import { useAppSelector } from "@/redux/hooks";
import type { IJob } from "@/types/job";
import { Pencil, PlusCircle, Trash2 } from "lucide-react";
import { useState } from "react";

const DEFAULT_PROFILE_IMAGE =
  "https://i.postimg.cc/FKG12h3z/My-profile-pic.jpg";
const DEFAULT_BANNER_IMAGE =
  "https://i.postimg.cc/9MZ38R1Z/post-a-job-jobs-in-Portugal.webp";

const JobCardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(3)].map((_, i) => (
      <Skeleton key={i} className="aspect-[4/3] w-full rounded-lg" />
    ))}
  </div>
);

const JobManagement = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: jobs, isLoading, refetch } = useGetAllJobsQuery();
  const [deleteJob] = useDeleteJobMutation();
  const [editJobData, setEditJobData] = useState<IJob | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  const handleDelete = async (id: string) => {
    try {
      await deleteJob(id).unwrap();
      toast({
        title: "Deleted",
        description: "Job deleted successfully.",
        variant: "success",
      });
      refetch();
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete job.",
      });
    }
  };

  if (isLoading) return <JobCardSkeleton />;

  const myJobs = jobs?.filter((job) => job.author?._id === user?._id) ?? [];

  return (
    <div className="w-11/12 mx-auto">
      <div className="flex justify-end mb-4">
        <Button onClick={() => setOpenCreateModal(true)}>
          <PlusCircle className="w-4 h-4 mr-2" />
          Create New Job
        </Button>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {myJobs.length === 0 ? (
          <p className="text-center col-span-full text-gray-500">
            No jobs found. Create one!
          </p>
        ) : (
          myJobs.map((job) => (
            <Card
              key={job._id}
              className="flex flex-col rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <div className="w-full h-40 relative overflow-hidden">
                <img
                  src={job.bannerImage || DEFAULT_BANNER_IMAGE}
                  alt={job.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <CardContent className="flex flex-col flex-1 p-4">
                <div className="flex items-center gap-4 mb-3">
                  <img
                    src={job.author?.profileImage || DEFAULT_PROFILE_IMAGE}
                    alt="creator"
                    className="h-12 w-12 rounded-full object-cover border border-gray-300"
                  />
                  <div className="flex flex-col flex-1 min-w-0">
                    <CardTitle className="text-lg font-semibold line-clamp-1">
                      {job.title}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="mt-1 px-2 py-1 text-xs uppercase font-semibold"
                    >
                      {job.category}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Pencil
                      onClick={() => setEditJobData(job)}
                      className="w-4 h-4 cursor-pointer text-blue-500"
                    />
                    <Trash2
                      onClick={() => handleDelete(job._id)}
                      className="w-4 h-4 cursor-pointer text-red-500"
                    />
                  </div>
                </div>

                <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                  {job.description}
                </p>

                <div className="mt-auto flex flex-wrap gap-3 text-xs text-gray-600 font-medium mb-4">
                  <Badge variant="outline" className="px-3 py-1">
                    💰 {job.minPrice} - {job.maxPrice} BDT
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    📅 {new Date(job.deadline).toLocaleDateString()}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1 capitalize">
                    📍 {job.workMode}
                  </Badge>
                  <Badge variant="outline" className="px-3 py-1">
                    👥 {job.vacancy} Vacancy
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </section>

      {editJobData && (
        <EditJobModal
          job={editJobData}
          onClose={() => setEditJobData(null)}
          onUpdated={refetch}
        />
      )}

      {openCreateModal && (
        <CreateJobModal
          open={openCreateModal}
          setOpen={setOpenCreateModal}
          onCreated={refetch}
        />
      )}
    </div>
  );
};

export default JobManagement;
