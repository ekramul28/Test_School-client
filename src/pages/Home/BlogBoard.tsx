import SectionHeader from "@/components/resuable/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import {
  useGetAllBlogsQuery,
  useVoteBlogMutation,
} from "@/redux/features/blog/blogApi";
import { useAppSelector } from "@/redux/hooks";
import { CheckCircle, ThumbsUp } from "lucide-react";
import type { FC } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const formatDate = (dateStr: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return new Date(dateStr).toLocaleDateString(undefined, options);
};

const BlogBoard: FC = () => {
  const { data: blogs, isLoading } = useGetAllBlogsQuery();
  const [voteBlog] = useVoteBlogMutation();
  const { user } = useAppSelector((state) => state.auth);
  const { toast } = useToast();
  const [votedBlogIds, setVotedBlogIds] = useState<string[]>([]);
  const navigate = useNavigate();

  const handleVote = async (blogId: string) => {
    try {
      await voteBlog(blogId).unwrap();
      setVotedBlogIds((prev) => [...prev, blogId]);
      toast({
        title: "Vote Successful!",
        description: "Thanks for voting this blog.",
      });
    } catch {
      toast({
        title: "Vote Failed",
        description: "You might have already voted or an error occurred.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-11/12 mx-auto py-8">
      <div className="flex flex-col items-center text-center mb-10">
        <SectionHeader
          title="Informative Blogs"
          subtitle="  Stay updated with the latest articles, tutorials, and insights shared
          by fellow developers, students, and educators."
        />
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="p-6 space-y-6 animate-pulse rounded-lg shadow-md dark:shadow-gray-800"
              >
                <Skeleton className="h-44 w-full rounded-xl" />
                <div className="flex items-center justify-between">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-5 w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-6 w-28 rounded-md" />
                  <Skeleton className="h-6 w-32 rounded-md" />
                </div>
              </Card>
            ))
          : blogs?.slice(0, 6).map((blog) => {
              const hasVoted =
                votedBlogIds.includes(blog._id!) ||
                blog.votedBy?.includes(user?._id);

              return (
                <Card
                  key={blog._id}
                  className="overflow-hidden border rounded-lg shadow-lg dark:border-gray-700 dark:shadow-gray-800 hover:shadow-xl dark:hover:shadow-gray-700 transition-shadow duration-300 bg-white dark:bg-gray-900"
                >
                  {blog.bannerImage && (
                    <img
                      src={blog.bannerImage}
                      alt="Blog Banner"
                      className="w-full h-44 sm:h-52 md:h-56 object-cover"
                    />
                  )}

                  <CardContent className="px-6 py-5 space-y-5">
                    <div className="flex items-center justify-between">
                      <img
                        src={blog.profileImage}
                        alt="Author"
                        className="w-12 h-12 rounded-full object-cover border border-gray-300 dark:border-gray-600"
                      />
                      <Badge variant="outline" className="text-sm">
                        {blog.category}
                      </Badge>
                    </div>

                    <CardTitle className="text-xl font-semibold line-clamp-2 text-gray-900 dark:text-gray-100">
                      {blog.title}
                    </CardTitle>

                    <p className="text-base text-muted-foreground dark:text-gray-300 line-clamp-3">
                      {blog.description}
                    </p>

                    <div className="flex justify-between items-center pt-4">
                      {blog.link && (
                        <a
                          href={blog.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-primary underline transition-colors hover:text-primary/80"
                        >
                          Read full article
                        </a>
                      )}

                      <span className="text-sm text-muted-foreground dark:text-gray-400 whitespace-nowrap">
                        {blog.createdAt
                          ? formatDate(blog.createdAt)
                          : "No date"}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        if (!hasVoted && blog._id) handleVote(blog._id);
                      }}
                      disabled={hasVoted}
                      aria-label={
                        hasVoted ? "You have voted" : "Vote this blog"
                      }
                      className={`
                        mt-4 w-full flex items-center justify-center gap-3 rounded-lg border px-5 py-2 text-sm font-semibold shadow-sm transition-colors duration-300
                        ${
                          hasVoted
                            ? "bg-gray-900 text-white border-gray-900 cursor-not-allowed"
                            : "bg-white text-gray-900 border-gray-900 hover:bg-gray-100 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
                        }
                      `}
                    >
                      {hasVoted ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <ThumbsUp className="w-5 h-5 text-gray-900 dark:text-gray-200" />
                      )}
                      {hasVoted ? "Voted" : `Vote (${blog.votes ?? 0})`}
                    </button>
                  </CardContent>
                </Card>
              );
            })}
      </section>

      <div className="text-center">
        <Button onClick={() => navigate("/blogs")} variant="secondary">
          View All Blogs
        </Button>
      </div>
    </div>
  );
};

export default BlogBoard;
