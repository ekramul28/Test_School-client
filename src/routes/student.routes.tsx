import MyCourses from "@/pages/Students/courses/MyCourses";
import StudentGradesPage from "@/pages/Students/StudentGrades/StudentGradesPage";
import StudentProfile from "@/pages/Students/StudentProfile";
import { Award, BookOpen, User } from "lucide-react";

export const studentPaths = [
  {
    name: "Profile",
    path: "profile",
    element: <StudentProfile />,
    icon: <User className="w-5 h-5" />,
  },
  {
    name: "My Courses",
    path: "my-courses",
    element: <MyCourses />,
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    name: "Grades",
    path: "grades",
    element: <StudentGradesPage />,
    icon: <Award className="w-5 h-5" />,
  },
];
