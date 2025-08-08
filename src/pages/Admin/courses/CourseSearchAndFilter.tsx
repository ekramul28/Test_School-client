import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

type Props = {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
};

const CourseSearchAndFilter: React.FC<Props> = ({
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <Input
        placeholder="Search courses..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="max-w-sm"
      />
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CourseSearchAndFilter;
