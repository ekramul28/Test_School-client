import type { Instructor } from "@/types/instructor";

export const mockInstructors: Instructor[] = [
  {
    id: "1",
    firstName: "Robert",
    lastName: "Chen",
    email: "robert.chen@example.com",
    department: "computer-science",
    specialization: "Artificial Intelligence",
    assignedSubjects: [
      {
        id: "CS101",
        name: "Introduction to Programming",
        code: "CS101",
        semester: 1,
        students: [
          {
            studentId: "CS2023001",
            name: "John Doe",
            grade: "A",
            attendance: 95,
          },
          {
            studentId: "CS2023005",
            name: "David Brown",
            grade: "B+",
            attendance: 88,
          },
        ],
        gradingHistory: [
          {
            date: "2024-01-15",
            studentId: "CS2023001",
            grade: "A",
            semester: 1,
          },
          {
            date: "2024-01-15",
            studentId: "CS2023005",
            grade: "B+",
            semester: 1,
          },
        ],
      },
    ],
  },
  {
    id: "2",
    firstName: "Maria",
    lastName: "Garcia",
    email: "maria.garcia@example.com",
    department: "engineering",
    specialization: "Mechanical Engineering",
    assignedSubjects: [
      {
        id: "ME201",
        name: "Thermodynamics",
        code: "ME201",
        semester: 3,
        students: [
          {
            studentId: "EN2023002",
            name: "Jane Smith",
            grade: "A-",
            attendance: 92,
          },
        ],
        gradingHistory: [
          {
            date: "2024-01-20",
            studentId: "EN2023002",
            grade: "A-",
            semester: 3,
          },
        ],
      },
    ],
  },
  {
    id: "3",
    firstName: "James",
    lastName: "Wilson",
    email: "james.wilson@example.com",
    department: "business",
    specialization: "Finance",
    assignedSubjects: [
      {
        id: "BUS301",
        name: "Financial Management",
        code: "BUS301",
        semester: 5,
        students: [
          {
            studentId: "BS2023003",
            name: "Michael Johnson",
            grade: "A+",
            attendance: 98,
          },
        ],
        gradingHistory: [
          {
            date: "2024-01-25",
            studentId: "BS2023003",
            grade: "A+",
            semester: 5,
          },
        ],
      },
    ],
  },
  {
    id: "4",
    firstName: "Sarah",
    lastName: "Thompson",
    email: "sarah.thompson@example.com",
    department: "arts",
    specialization: "Fine Arts",
    assignedSubjects: [
      {
        id: "ART101",
        name: "Introduction to Drawing",
        code: "ART101",
        semester: 1,
        students: [
          {
            studentId: "AR2023004",
            name: "Sarah Williams",
            grade: "A",
            attendance: 96,
          },
        ],
        gradingHistory: [
          {
            date: "2024-01-30",
            studentId: "AR2023004",
            grade: "A",
            semester: 1,
          },
        ],
      },
    ],
  },
];
