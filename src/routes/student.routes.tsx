import StudentProfile from "@/pages/Students/StudentProfile";
import { Award, BookOpen, User } from "lucide-react";

export const studentPaths = [
  {
    name: "Profile",
    path: "profile",
    element: <StudentProfile />,
    icon: <User className="w-5 h-5" />,
  },
];
