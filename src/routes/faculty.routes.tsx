import AnnouncementManagement from "@/pages/Admin/AnnouncementManagement";
import FacultyProfile from "@/pages/facultys/FacultyProfile";
import GradesPage from "@/pages/facultys/Grades/GradesPage";
import AcademicCourseShow from "@/pages/share/facultyAndStudent/academicCourseShow";
import AcademicInstructorShow from "@/pages/share/facultyAndStudent/academicInstructorShow";
import AcademicOfferedCourseShow from "@/pages/share/facultyAndStudent/academicOfferedCourseShow";
import { BookOpen, Megaphone, User } from "lucide-react";

export const facultyPaths = [
  ,
  {
    name: "Profile",
    path: "profile",
    element: <FacultyProfile />,
    icon: <User className="w-5 h-5" />,
  },

  {
    name: "Faculty ",
    path: "faculty",
    element: <AcademicInstructorShow />,
    icon: <BookOpen className="w-5 h-5" />,
  },

  {
    name: "Course ",
    path: "course",
    element: <AcademicCourseShow />,
    icon: <BookOpen className="w-5 h-5" />,
  },

  {
    name: "OfferCourse ",
    path: "offered-course",
    element: <AcademicOfferedCourseShow />,
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    name: "Grades",
    path: "grades",
    element: <GradesPage />,
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    name: "Announce Management",
    path: "announcement-management",
    element: <AnnouncementManagement />,
    icon: <Megaphone className="w-5 h-5" />,
  },
];
