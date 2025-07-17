import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Users, Monitor, BookOpen } from "lucide-react";

interface RoleSelectionProps {
  onRoleSelect: (role: 'student' | 'facilitator') => void;
}

export function RoleSelection({ onRoleSelect }: RoleSelectionProps) {
  const [selectedRole, setSelectedRole] = useState<'student' | 'facilitator' | null>(null);

  const handleRoleSelect = (role: 'student' | 'facilitator') => {
    setSelectedRole(role);
    setTimeout(() => onRoleSelect(role), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-learning flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 mr-4">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Smart Learning Assistant
              </h1>
              <p className="text-white/90 text-lg">
                Real-time monitoring and support for software programming education
              </p>
            </div>
          </div>
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Student Role */}
          <Card 
            className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-strong ${
              selectedRole === 'student' ? 'ring-4 ring-white scale-105' : ''
            }`}
            onClick={() => handleRoleSelect('student')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-gradient-primary rounded-full p-6 w-20 h-20 flex items-center justify-center mb-4">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-primary">Student Portal</CardTitle>
              <CardDescription className="text-lg">
                Access your learning environment with real-time assistance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Monitor className="h-5 w-5 text-primary" />
                <span>Multi-language code editor</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-primary" />
                <span>Real-time facilitator interaction</span>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <span>Progress tracking & analytics</span>
              </div>
              <Button variant="learning" size="lg" className="w-full mt-6">
                Enter as Student
              </Button>
            </CardContent>
          </Card>

          {/* Facilitator Role */}
          <Card 
            className={`cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-strong ${
              selectedRole === 'facilitator' ? 'ring-4 ring-white scale-105' : ''
            }`}
            onClick={() => handleRoleSelect('facilitator')}
          >
            <CardHeader className="text-center pb-4">
              <div className="mx-auto bg-gradient-secondary rounded-full p-6 w-20 h-20 flex items-center justify-center mb-4">
                <Users className="h-10 w-10 text-white" />
              </div>
              <CardTitle className="text-2xl text-secondary">Facilitator Dashboard</CardTitle>
              <CardDescription className="text-lg">
                Monitor and assist students in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Monitor className="h-5 w-5 text-secondary" />
                <span>Student activity monitoring</span>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-secondary" />
                <span>Multi-student management</span>
              </div>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-5 w-5 text-secondary" />
                <span>Comprehensive analytics</span>
              </div>
              <Button variant="success" size="lg" className="w-full mt-6">
                Enter as Facilitator
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Features Overview */}
        <div className="mt-16 text-center text-white/80">
          <h2 className="text-2xl font-semibold mb-4">System Capabilities</h2>
          <div className="grid md:grid-cols-4 gap-6 text-sm">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Real-time Monitoring</h3>
              <p>Track student progress and detect challenges instantly</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Multi-language Support</h3>
              <p>Python, Java, C, C++ compilation and execution</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Screen Sharing</h3>
              <p>Share screens for collaborative problem-solving</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Analytics</h3>
              <p>Comprehensive learning analytics and insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}