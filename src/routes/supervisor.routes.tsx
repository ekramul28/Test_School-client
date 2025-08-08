import SupervisorManagement from "@/pages/Admin/supervisorManagement";
import SupervisorProfile from "@/pages/Supervisor/supervisorProfile";
import { User } from "lucide-react";

export const supervisorPaths = [
  {
    name: "Profile",
    path: "profile",
    element: <SupervisorProfile />,
    icon: <User className="w-5 h-5" />,
  },
  {
    name: "Profile",
    path: "profile",
    element: <SupervisorManagement />,
    icon: <User className="w-5 h-5" />,
  },
];
