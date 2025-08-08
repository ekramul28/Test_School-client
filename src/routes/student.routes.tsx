import MyBlogSection from "@/pages/blogs/MyBlogSection";
import JobManagement from "@/pages/Jobs/JobManagement";
import AcademicCourseShow from "@/pages/share/facultyAndStudent/academicCourseShow";
import AcademicDepartmentShow from "@/pages/share/facultyAndStudent/academicDepartmentShow";
import AcademicFacultyShow from "@/pages/share/facultyAndStudent/academicfacultyShow";
import AcademicInstructorShow from "@/pages/share/facultyAndStudent/academicInstructorShow";
import AcademicSemesterShow from "@/pages/share/facultyAndStudent/AcademickSemesterShow";
import AcademicOfferedCourseShow from "@/pages/share/facultyAndStudent/academicOfferedCourseShow";
import MyCourses from "@/pages/Students/courses/MyCourses";
import StudentGradesPage from "@/pages/Students/StudentGrades/StudentGradesPage";
import StudentProfile from "@/pages/Students/StudentProfile";
import {
  Award,
  Blocks,
  BookOpen,
  Building2,
  CalendarDays,
  User,
  Users,
} from "lucide-react";

export const studentPaths = [
  // {
  //   name: "Dashboard",
  //   path: "dashboard",
  //   element: <StudentDashboard />,
  //   icon: <LayoutDashboard className="w-5 h-5" />,
  // },
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

  // {
  //   name: "Academic Faculty",
  //   path: "academic-faculty",
  //   element: <AcademicFacultyShow />,
  //   icon: <Users className="w-5 h-5" />,
  // },
  // {
  //   name: "Academic Department",
  //   path: "academic-department",
  //   element: <AcademicDepartmentShow />,
  //   icon: <Building2 className="w-5 h-5" />,
  // },
  // {
  //   name: "Academic Semester",
  //   path: "academic-semester",
  //   element: <AcademicSemesterShow />,
  //   icon: <CalendarDays className="w-5 h-5" />,
  // },

  // {
  //   name: "Faculty ",
  //   path: "faculty",
  //   element: <AcademicInstructorShow />,
  //   icon: <BookOpen className="w-5 h-5" />,
  // },

  // {
  //   name: "Course ",
  //   path: "course",
  //   element: <AcademicCourseShow />,
  //   icon: <BookOpen className="w-5 h-5" />,
  // },

  // {
  //   name: "OfferCourse ",
  //   path: "offered-course",
  //   element: <AcademicOfferedCourseShow />,
  //   icon: <BookOpen className="w-5 h-5" />,
  // },
  {
    name: "My Blog",
    path: "my-blog",
    element: <MyBlogSection />,
    icon: <Blocks className="w-5 h-5" />,
  },
  {
    name: "My Job",
    path: "my-job",
    element: <JobManagement />,
    icon: <Blocks className="w-5 h-5" />,
  },
];
