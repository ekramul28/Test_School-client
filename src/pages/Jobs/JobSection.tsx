import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import {
  useApplyJobMutation,
  useGetAllJobsQuery,
} from "@/redux/features/job/jobApi";
import { useAppSelector } from "@/redux/hooks";
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

const JobSection = () => {
  const { data: jobs, isLoading, refetch } = useGetAllJobsQuery();
  const [applyJob, { isLoading: applying }] = useApplyJobMutation();
  const { user } = useAppSelector((state) => state.auth);
  const [loadingJobs, setLoadingJobs] = useState<Set<string>>(new Set());

  const handleApply = async (jobId: string) => {
    if (loadingJobs.has(jobId)) return;

    setLoadingJobs((prev) => new Set(prev).add(jobId));
    try {
      await applyJob({ jobId }).unwrap();

      toast({
        title: "Success",
        description: "You have successfully applied for the job.",
      });
      await refetch();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to apply",
        description:
          error?.data?.message || error?.error || "Please try again later.",
      });
    } finally {
      setLoadingJobs((prev) => {
        const updated = new Set(prev);
        updated.delete(jobId);
        return updated;
      });
    }
  };

  if (isLoading) return <JobCardSkeleton />;

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-9/12 mx-auto">
      {jobs?.map((job) => {
        const isApplied = job.appliedBy?.some(
          (id: any) =>
            id === user?.userId ||
            id?._id === user?.userId ||
            id === String(user?.userId)
        );
        const isApplying = loadingJobs.has(job._id);

        return (
          <Card
            key={job._id}
            className="flex flex-col rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <div className="w-full h-40 sm:h-48 md:h-52 lg:h-44 xl:h-52 relative overflow-hidden">
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
              </div>

              <p className="text-gray-700 text-sm line-clamp-3 mb-4">
                {job.description}
              </p>

              <div className="mt-auto flex flex-wrap gap-3 text-xs text-gray-600 font-medium mb-4">
                <Badge variant="outline" className="px-3 py-1">
                  💰 {job.minPrice} - {job.maxPrice} BDT
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  📅 Deadline: {new Date(job.deadline).toLocaleDateString()}
                </Badge>
                <Badge variant="outline" className="px-3 py-1 capitalize">
                  📍 {job.workMode}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  👥 {job.vacancy} Vacancy
                </Badge>
              </div>

              <Button
                disabled={isApplied || isApplying}
                variant={isApplied ? "outline" : "default"}
                onClick={() => handleApply(job._id)}
                className="w-full"
              >
                {isApplying
                  ? "Applying..."
                  : isApplied
                  ? "Applied"
                  : "Apply Now"}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
};

export default JobSection;
