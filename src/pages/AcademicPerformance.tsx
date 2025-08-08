import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GradeManagement } from "@/components/form/academic/GradeManagement";
import { GradeHistory } from "@/components/form/academic/GradeHistory";

export function AcademicPerformance() {
  // In a real application, this would come from your auth system
  const facultyId = "FAC001";

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">
        Academic Performance Management
      </h1>

      <Tabs defaultValue="grade-management" className="space-y-4">
        <TabsList>
          <TabsTrigger value="grade-management">Grade Management</TabsTrigger>
          <TabsTrigger value="grade-history">Grade History</TabsTrigger>
        </TabsList>

        <TabsContent value="grade-management">
          <GradeManagement facultyId={facultyId} />
        </TabsContent>

        <TabsContent value="grade-history">
          <GradeHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
