import { useState } from "react";
import { RoleSelection } from "@/components/RoleSelection";
import { StudentDashboard } from "@/components/StudentDashboard";
import { FacilitatorDashboard } from "@/components/FacilitatorDashboard";

const Index = () => {
  const [currentRole, setCurrentRole] = useState<'student' | 'facilitator' | null>(null);

  const handleRoleSelect = (role: 'student' | 'facilitator') => {
    setCurrentRole(role);
  };

  const handleLogout = () => {
    setCurrentRole(null);
  };

  if (currentRole === 'student') {
    return <StudentDashboard onLogout={handleLogout} />;
  }

  if (currentRole === 'facilitator') {
    return <FacilitatorDashboard onLogout={handleLogout} />;
  }

  return <RoleSelection onRoleSelect={handleRoleSelect} />;
};

export default Index;
