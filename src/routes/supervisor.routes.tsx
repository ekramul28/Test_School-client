import StudentProfile from "@/pages/Students/StudentProfile";
import { User } from "lucide-react";

export const supervisorPaths = [
  {
    name: "Profile",
    path: "profile",
    element: <StudentProfile />,
    icon: <User className="w-5 h-5" />,
  },
];
