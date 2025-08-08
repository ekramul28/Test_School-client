import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, GraduationCap, Users } from "lucide-react";
import SemesterRegistrationFrom from "@/components/form/SemesterRegistration/SemesterRegistrationFrom";
import { useGetAllSemesterRegistrationsQuery } from "@/redux/features/semesterRegistration/semesterRegistrationApi";

const SemesterRegistrationPage = () => {
  const { data: semesterRegistrations } =
    useGetAllSemesterRegistrationsQuery(undefined);

  const upcomingRegistrations = semesterRegistrations?.data?.filter(
    (registration) => registration.status === "UPCOMING"
  );
  const ongoingRegistrations = semesterRegistrations?.data?.filter(
    (registration) => registration.status === "ONGOING"
  );
  const endedRegistrations = semesterRegistrations?.data?.filter(
    (registration) => registration.status === "ENDED"
  );

  return (
    <div className="p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Registrations
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {semesterRegistrations?.data?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {upcomingRegistrations?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ongoing</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {ongoingRegistrations?.length || 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ended</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {endedRegistrations?.length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Registrations</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
          <TabsTrigger value="ended">Ended</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <SemesterRegistrationFrom />
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          <SemesterRegistrationFrom initialStatus="UPCOMING" />
        </TabsContent>
        <TabsContent value="ongoing" className="space-y-4">
          <SemesterRegistrationFrom initialStatus="ONGOING" />
        </TabsContent>
        <TabsContent value="ended" className="space-y-4">
          <SemesterRegistrationFrom initialStatus="ENDED" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SemesterRegistrationPage;
