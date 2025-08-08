import SectionHeader from "@/components/resuable/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useApplyJobMutation,
  useGetAllJobsQuery,
} from "@/redux/features/job/jobApi";
import { useAppSelector } from "@/redux/hooks";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const DEFAULT_PROFILE_IMAGE =
  "https://i.postimg.cc/FKG12h3z/My-profile-pic.jpg";
const DEFAULT_BANNER_IMAGE =
  "https://i.postimg.cc/9MZ38R1Z/post-a-job-jobs-in-Portugal.webp";

const JobCardSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Skeleton key={i} className="aspect-[4/3] w-full rounded-lg" />
    ))}
  </div>
);

const JobBoard = () => {
  const navigate = useNavigate();
  const { data: jobs, isLoading, refetch } = useGetAllJobsQuery();
  const [applyJob, { isLoading: applying }] = useApplyJobMutation();
  const { user } = useAppSelector((state) => state.auth);
  const [loadingJobs, setLoadingJobs] = useState<Set<string>>(new Set());

  const handleApply = async (jobId: string) => {
    // ... unchanged
  };

  if (isLoading) return <JobCardSkeleton />;

  return (
    <>
      {/*  Full-width banner */}
      <div
        className="w-full h-60  sm:h-72 md:h-80 lg:h-96 bg-cover bg-center flex items-center justify-center relative"
        style={{
          backgroundImage:
            "url('https://i.postimg.cc/9MZ38R1Z/post-a-job-jobs-in-Portugal.webp')",
        }}
      >
        <div className="absolute inset-0 bg-black/60 "></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">
            Discover Jobs That Match You
          </h1>
          <p className="text-sm md:text-lg max-w-2xl mx-auto">
            Apply to your dream freelance or onsite opportunities from top tech
            companies and startups.
          </p>
        </div>
      </div>

      {/*  Job listings section */}
      <div className="w-11/12 mx-auto py-8">
        <SectionHeader
          title="Available Job Listings"
          subtitle="Explore top freelance and onsite opportunities curated for students and professionals in tech, design, and beyond"
        />
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {jobs?.slice(0, 6).map((job) => {
            const isApplied = job.appliedBy?.some(
              (id: { _id: any }) => id === user?._id || id?._id === user?._id
            );
            const isApplying = loadingJobs.has(job._id);

            return (
              <Card
                key={job._id}
                className="flex flex-col rounded-lg border border-gray-200 shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <div className="w-full h-44 relative overflow-hidden">
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
                      📅 {new Date(job.deadline).toLocaleDateString()}
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

        <div className="text-center">
          <Button onClick={() => navigate("/jobs")} variant="secondary">
            View All Jobs
          </Button>
        </div>
      </div>
    </>
  );
};

export default JobBoard;
