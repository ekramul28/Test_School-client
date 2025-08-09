import AssessmentFlow from "@/pages/Students/AssessmentFlow/Assessment";
import StudentProfile from "@/pages/Students/StudentProfile";
import { GraduationCap, User } from "lucide-react";

export const studentPaths = [
  {
    name: "Profile",
    path: "profile",
    element: <StudentProfile />,
    icon: <User className="w-5 h-5" />,
  },
  {
    name: "assessmentFlow",
    path: "assessmentFlow",
    element: <AssessmentFlow />,
    icon: <GraduationCap className="w-5 h-5" />,
  },
];
