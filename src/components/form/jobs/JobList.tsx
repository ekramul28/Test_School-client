import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Info, Briefcase, MapPin, DollarSign, Clock } from "lucide-react";
import {
  fetchJobs,
  setJobFilters,
  clearJobFilters,
  setSelectedJob,
} from "@/redux/features/jobSlice";
import type { RootState } from "@/redux/store";
import type { JobListing } from "@/types/job";
import { useState } from "react";
import JobForm from "./JobForm";
import ProposalForm from "./ProposalForm";

const JobList = () => {
  const dispatch = useDispatch();
  const { jobs, loading, error, jobFilters } = useSelector(
    (state: RootState) => state.jobs
  );
  const [isJobFormOpen, setIsJobFormOpen] = useState(false);
  const [isProposalFormOpen, setIsProposalFormOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);

  useEffect(() => {
    dispatch(fetchJobs(jobFilters));
  }, [dispatch, jobFilters]);

  const handleSearch = (value: string) => {
    dispatch(setJobFilters({ search: value }));
  };

  const handleCategoryChange = (value: string) => {
    dispatch(setJobFilters({ category: value }));
  };

  const handleTypeChange = (value: string) => {
    dispatch(setJobFilters({ type: value as JobListing["type"] }));
  };

  const handleLocationChange = (value: string) => {
    dispatch(
      setJobFilters({
        location: value as JobListing["location"]["type"],
      })
    );
  };

  const handleClearFilters = () => {
    dispatch(clearJobFilters());
  };

  const handleViewJob = (job: JobListing) => {
    setSelectedJob(job);
    dispatch(setSelectedJob(job));
  };

  const handleApply = (job: JobListing) => {
    setSelectedJob(job);
    setIsProposalFormOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        Error: {error}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Job Listings</CardTitle>
          <Dialog open={isJobFormOpen} onOpenChange={setIsJobFormOpen}>
            <DialogTrigger asChild>
              <Button>
                <Briefcase className="mr-2 h-4 w-4" />
                Post a Job
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Post a New Job</DialogTitle>
              </DialogHeader>
              <JobForm onSuccess={() => setIsJobFormOpen(false)} />
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <Input
                placeholder="Search jobs..."
                value={jobFilters.search || ""}
                onChange={(e) => handleSearch(e.target.value)}
                className="max-w-sm"
              />
              <Select
                value={jobFilters.category}
                onValueChange={handleCategoryChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="design">Design</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="writing">Writing</SelectItem>
                </SelectContent>
              </Select>
              <Select value={jobFilters.type} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="full-time">Full Time</SelectItem>
                  <SelectItem value="part-time">Part Time</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                  <SelectItem value="freelance">Freelance</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={jobFilters.location}
                onValueChange={handleLocationChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="remote">Remote</SelectItem>
                  <SelectItem value="onsite">On-site</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={handleClearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job Title</TableHead>
                  <TableHead>Employer</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {job.category}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{job.employer.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {job.employer.type}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{job.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{job.location.type}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span>
                          {job.budget.min} - {job.budget.max}{" "}
                          {job.budget.currency}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{job.duration}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          job.status === "open"
                            ? "default"
                            : job.status === "in-progress"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewJob(job)}
                        >
                          <Info className="h-4 w-4" />
                        </Button>
                        {job.status === "open" && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleApply(job)}
                          >
                            Apply
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isProposalFormOpen} onOpenChange={setIsProposalFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Submit Proposal</DialogTitle>
          </DialogHeader>
          {selectedJob && (
            <ProposalForm
              jobId={selectedJob.id}
              onSuccess={() => setIsProposalFormOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default JobList;
