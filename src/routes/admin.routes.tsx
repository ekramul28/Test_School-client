import AdminProfile from "@/pages/Admin/AdminProfile";

import StudentManagement from "@/pages/Students/StudentManagement";
import { GraduationCap, Megaphone, User } from "lucide-react";

export const adminPaths = [
  {
    name: "Profile",
    path: "profile",
    element: <AdminProfile />,
    icon: <User className="w-5 h-5" />,
  },

  {
    name: "Student Management",
    path: "studentmanagement",
    element: <StudentManagement />,
    icon: <GraduationCap className="w-5 h-5" />,
  },
];
