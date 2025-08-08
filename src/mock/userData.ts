import type { User } from "@/types/user";

export const mockUser: User = {
  id: "1",
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  role: "student",
  department: "computer-science",
  profilePicture: "https://example.com/profile.jpg",
  bio: "Passionate about technology and innovation.",
  skills: ["JavaScript", "React", "Node.js", "TypeScript"],
  experience: [
    {
      id: "1",
      title: "Software Developer Intern",
      company: "Tech Solutions Inc.",
      startDate: "2023-06-01",
      endDate: "2023-08-31",
      description: "Worked on frontend development using React and TypeScript.",
    },
  ],
  education: [
    {
      id: "1",
      degree: "Bachelor of Science in Computer Science",
      institution: "University of Technology",
      startDate: "2020-09-01",
      endDate: "2024-05-31",
      gpa: 3.8,
    },
  ],
};
