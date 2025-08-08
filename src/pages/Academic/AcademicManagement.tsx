import { useState } from "react";
import {
  useGetAcademicYearsQuery,
  useGetProgramsQuery,
  useGetAcademicStatsQuery,
} from "@/redux/features/academic/academicApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";

import { useGetAllAcademicSemestersQuery } from "@/redux/features/academic/academicSemesterApi";
import { useGetAllAcademicDepartmentsQuery } from "@/redux/features/academic/academicDepartmentApi";

const AcademicManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: academicYears, isLoading: isLoadingYears } =
    useGetAcademicYearsQuery([]);
  const { data: semesters, isLoading: isLoadingSemesters } =
    useGetAllAcademicSemestersQuery([]);
  const { data: departments, isLoading: isLoadingDepartments } =
    useGetAllAcademicDepartmentsQuery([]);
  const { data: programs, isLoading: isLoadingPrograms } = useGetProgramsQuery(
    []
  );
  const { data: stats, isLoading: isLoadingStats } = useGetAcademicStatsQuery(
    []
  );

  const isLoading =
    isLoadingYears ||
    isLoadingSemesters ||
    isLoadingDepartments ||
    isLoadingPrograms ||
    isLoadingStats;

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Academic Management</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.data?.totalStudents || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Instructors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.data?.totalInstructors || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.data?.totalCourses || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Semesters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.data?.activeSemesters || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="years" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="years">Academic Years</TabsTrigger>
            <TabsTrigger value="semesters">Semesters</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="programs">Programs</TabsTrigger>
          </TabsList>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        <TabsContent value="years" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {academicYears?.data?.map((year) => (
              <Card key={year.id}>
                <CardHeader>
                  <CardTitle>Academic Year {year.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>Start Month: {year.startMonth}</p>
                    <p>End Month: {year.endMonth}</p>
                    <p>Status: {year.status}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="semesters" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {semesters?.data?.map((semester) => (
              <Card key={semester.id}>
                <CardHeader>
                  <CardTitle>{semester.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>Year: {semester.year}</p>
                    <p>Code: {semester.code}</p>
                    <p>Start Month: {semester.startMonth}</p>
                    <p>End Month: {semester.endMonth}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments?.data?.map((department) => (
              <Card key={department.id}>
                <CardHeader>
                  <CardTitle>{department.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>Code: {department.code}</p>
                    {department.description && (
                      <p>Description: {department.description}</p>
                    )}
                    {department.headOfDepartment && (
                      <p>Head: {department.headOfDepartment}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {programs?.data?.map((program) => (
              <Card key={program.id}>
                <CardHeader>
                  <CardTitle>{program.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p>Code: {program.code}</p>
                    {program.description && (
                      <p>Description: {program.description}</p>
                    )}
                    <p>Duration: {program.duration} years</p>
                    <p>Total Credits: {program.totalCredits}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AcademicManagement;
