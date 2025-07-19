import { useState } from "react";
import { RoleSelection } from "@/components/RoleSelection";
import { StudentDashboard } from "@/components/StudentDashboard";
import { FacilitatorDashboard } from "@/components/FacilitatorDashboard";

const Index = () => {
  const [currentRole, setCurrentRole] = useState<'student' | 'facilitator' | null>(null);
  const [username, setUsername] = useState("");

  const handleRoleSelect = (role: 'student' | 'facilitator', selectedUsername: string) => {
    setCurrentRole(role);
    setUsername(selectedUsername);
  };

  const handleLogout = () => {
    setCurrentRole(null);
    setUsername("");
  };

  if (currentRole === 'student') {
    return <StudentDashboard onLogout={handleLogout} username={username} />;
  }

  if (currentRole === 'facilitator') {
    return <FacilitatorDashboard onLogout={handleLogout} username={username} />;
  }

  return <RoleSelection onRoleSelect={handleRoleSelect} />;
};

export default Index;
