import AdminManagement from "@/pages/Admin/AdminManagement";
import AdminProfile from "@/pages/Admin/AdminProfile";
import QuestionManagement from "@/pages/Admin/questions/QuestionManagement";
import StudentManagement from "@/pages/Admin/StudentManagement";
import AssessmentFlow from "@/pages/Students/AssessmentFlow/Assessment";
import { FileQuestion, GraduationCap, User } from "lucide-react";

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
  {
    name: "Admin Management",
    path: "adminmanagement",
    element: <AdminManagement />,
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    name: "assessmentFlow",
    path: "assessmentFlow",
    element: <AssessmentFlow />,
    icon: <GraduationCap className="w-5 h-5" />,
  },

  {
    name: "QuestionManagement",
    path: "questionmanagement",
    element: <QuestionManagement />,
    icon: <FileQuestion className="w-5 h-5" />,
  },
];
