import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { addGrade, setGrades } from "@/redux/features/academicPerformanceSlice";
import * as XLSX from "xlsx";

interface GradeManagementProps {
  facultyId: string;
}

export function GradeManagement({ facultyId }: GradeManagementProps) {
  const dispatch = useDispatch();
  const [selectedBatch, setSelectedBatch] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [grades, setGrades] = useState<
    Array<{ studentId: string; grade: string; marks: number }>
  >([]);

  const handleBatchSelect = (batch: string) => {
    setSelectedBatch(batch);
    // Here you would typically fetch students for the selected batch
  };

  const handleGradeSubmit = () => {
    grades.forEach((grade) => {
      dispatch(
        addGrade({
          id: Math.random().toString(36).substr(2, 9),
          studentId: grade.studentId,
          subjectId: selectedSubject,
          grade: grade.grade,
          marks: grade.marks,
          batch: selectedBatch,
          semester: "1", // This should be dynamic based on your requirements
          assignedBy: facultyId,
          assignedAt: new Date().toISOString(),
        })
      );
    });
  };

  const exportToExcel = () => {
    const grades = useSelector(
      (state: any) => state.academicPerformance.grades
    );
    const worksheet = XLSX.utils.json_to_sheet(grades);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Grades");
    XLSX.writeFile(workbook, "academic_performance.xlsx");
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Grade Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium">Select Batch</label>
              <Select onValueChange={handleBatchSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Select batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSE19">CSE 19th Batch</SelectItem>
                  <SelectItem value="CSE20">CSE 20th Batch</SelectItem>
                  {/* Add more batches as needed */}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Select Subject</label>
              <Select onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CS101">
                    Introduction to Programming
                  </SelectItem>
                  <SelectItem value="CS102">Data Structures</SelectItem>
                  {/* Add more subjects as needed */}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student ID</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Marks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* This would be populated with actual student data */}
              <TableRow>
                <TableCell>
                  <Input placeholder="Student ID" />
                </TableCell>
                <TableCell>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input type="number" placeholder="Marks" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

          <div className="flex justify-end space-x-4 mt-6">
            <Button onClick={handleGradeSubmit}>Submit Grades</Button>
            <Button onClick={exportToExcel}>Export to Excel</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
