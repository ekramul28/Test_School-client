import { useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export function GradeHistory() {
  const grades = useSelector((state: any) => state.academicPerformance.grades);
  const [filterBatch, setFilterBatch] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredGrades = grades.filter((grade: any) => {
    const matchesBatch = !filterBatch || grade.batch === filterBatch;
    const matchesSubject = !filterSubject || grade.subjectId === filterSubject;
    const matchesSearch =
      !searchTerm ||
      grade.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.grade.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesBatch && matchesSubject && matchesSearch;
  });

  const uniqueBatches = [...new Set(grades.map((grade: any) => grade.batch))];
  const uniqueSubjects = [
    ...new Set(grades.map((grade: any) => grade.subjectId)),
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grading History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium">Filter by Batch</label>
            <Select onValueChange={setFilterBatch}>
              <SelectTrigger>
                <SelectValue placeholder="All Batches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Batches</SelectItem>
                {uniqueBatches.map((batch) => (
                  <SelectItem key={batch} value={batch}>
                    {batch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Filter by Subject</label>
            <Select onValueChange={setFilterSubject}>
              <SelectTrigger>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Subjects</SelectItem>
                {uniqueSubjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium">Search</label>
            <Input
              placeholder="Search by student ID or grade"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Grade</TableHead>
              <TableHead>Marks</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Assigned By</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredGrades.map((grade: any) => (
              <TableRow key={grade.id}>
                <TableCell>{grade.studentId}</TableCell>
                <TableCell>{grade.subjectId}</TableCell>
                <TableCell>{grade.grade}</TableCell>
                <TableCell>{grade.marks}</TableCell>
                <TableCell>{grade.batch}</TableCell>
                <TableCell>{grade.assignedBy}</TableCell>
                <TableCell>
                  {new Date(grade.assignedAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
