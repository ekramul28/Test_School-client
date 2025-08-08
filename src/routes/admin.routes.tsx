import AcademicManagement from "@/pages/Academic/AcademicManagement";
import AcademicDepartment from "@/pages/Admin/academic/AcademicDepartment";
import AcademicFacultyPage from "@/pages/Admin/academic/AcademicFaculty";
import AcademicYear from "@/pages/Admin/academic/AcademicYear";
import AcademicSemester from "@/pages/Admin/academic/AdmissionSemester";
import AdminManagement from "@/pages/Admin/AdminManagement";
import AdminProfile from "@/pages/Admin/AdminProfile";
import AnnouncementManagement from "@/pages/Admin/AnnouncementManagement";
import AdminCourseList from "@/pages/Admin/courses/AdminCourseList";
import AdminOfferedCourseSection from "@/pages/Admin/offeredCourses/AdminOfferedCourseSection";

import SemesterRegistrationPage from "@/pages/Admin/SemesterRegistration/SemesterRegistrationPage";

import InstructorManagement from "@/pages/facultys/facultyManagement";
import JobManagement from "@/pages/Jobs/JobManagement";
import StudentManagement from "@/pages/Students/StudentManagement";
import {
  BookOpen,
  Briefcase,
  Building2,
  Calendar,
  CalendarDays,
  GraduationCap,
  Megaphone,
  User,
  Users,
} from "lucide-react";

export const adminPaths = [
  {
    name: "Academic Management",
    path: "academic-management",
    element: <AcademicManagement />,
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    name: "Academic Year",
    path: "academic-year",
    element: <AcademicYear />,
    icon: <CalendarDays className="w-5 h-5" />,
  },
  {
    name: "Profile",
    path: "profile",
    element: <AdminProfile />,
    icon: <User className="w-5 h-5" />,
  },
  {
    name: "Academic Faculty",
    path: "academic-faculty",
    element: <AcademicFacultyPage />,
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: "Academic Department",
    path: "academic-department",
    element: <AcademicDepartment />,
    icon: <Building2 className="w-5 h-5" />,
  },

  {
    name: "Academic Semester",
    path: "academic-semester",
    element: <AcademicSemester />,
    icon: <CalendarDays className="w-5 h-5" />,
  },
  {
    name: "Admin Management",
    path: "adminmanagement",
    element: <AdminManagement />,
    icon: <Users className="w-5 h-5" />,
  },
  {
    name: "Student Management",
    path: "studentmanagement",
    element: <StudentManagement />,
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    name: "Faculty Management",
    path: "instructorsmanagement",
    element: <InstructorManagement />,
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    name: "Job Management",
    path: "jobsmanagement",
    element: <JobManagement />,
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    name: "Course Management",
    path: "course-management",
    element: <AdminCourseList />,
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    name: "Semester Registration",
    path: "semester-registration",
    element: <SemesterRegistrationPage />,
    icon: <Calendar className="w-5 h-5" />,
  },
  {
    name: "OfferCourse Management",
    path: "offered-course-management",
    element: <AdminOfferedCourseSection />,
    icon: <BookOpen className="w-5 h-5" />,
  },
  {
    name: "Announce Management",
    path: "announcement-management",
    element: <AnnouncementManagement />,
    icon: <Megaphone className="w-5 h-5" />,
  },
];
