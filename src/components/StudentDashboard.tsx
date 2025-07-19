import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CodeEditor } from "./CodeEditor";
import { ChatInterface } from "./ChatInterface";
import { ScreenShare } from "./ScreenShare";
import { ProgressTracker } from "./ProgressTracker";
import { 
  Play, 
  Save, 
  Share2, 
  MessageCircle, 
  Monitor, 
  Code, 
  BarChart3,
  Settings,
  HelpCircle,
  User,
  LogOut
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "./ThemeToggle";
import { ProfileModal } from "./ProfileModal";
import * as React from "react";

interface StudentDashboardProps {
  onLogout: () => void;
  username: string;
}

export function StudentDashboard({ onLogout, username }: StudentDashboardProps) {
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [isOnline, setIsOnline] = useState(true);
  const [compilationResult, setCompilationResult] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [onlineUsersCount, setOnlineUsersCount] = useState(3);
  const [progress, setProgress] = useState(45);
  const { toast } = useToast();

  const languages = [
    { value: "python", label: "Python 3", ext: ".py" },
    { value: "java", label: "Java", ext: ".java" },
    { value: "c", label: "C", ext: ".c" },
    { value: "cpp", label: "C++", ext: ".cpp" },
  ];

  const defaultCode = {
    python: `print("Hello, Smart Learning Assistant!")`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Smart Learning Assistant!");
    }
}`,
    c: `#include <stdio.h>

int main() {
    printf("Hello, Smart Learning Assistant!\\n");
    return 0;
}`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, Smart Learning Assistant!" << endl;
    return 0;
}`
  };

  useEffect(() => {
    setCode(defaultCode[selectedLanguage as keyof typeof defaultCode]);
  }, [selectedLanguage]);

  const handleCompileAndRun = async () => {
    toast({
      title: "Compiling...",
      description: `Running ${selectedLanguage} code`,
    });

    // Simulate compilation
    setTimeout(() => {
      setCompilationResult(`Hello, Smart Learning Assistant!

Process finished with exit code 0
Time: 0.45s
Memory: 12.5MB`);
      
      toast({
        title: "Success!",
        description: "Code compiled and executed successfully",
      });
    }, 2000);
  };

  const handleSaveCode = () => {
    toast({
      title: "Code Saved",
      description: "Your code has been saved successfully",
    });
  };

  const handleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
    toast({
      title: isScreenSharing ? "Screen sharing stopped" : "Screen sharing started",
      description: isScreenSharing ? "Your screen is no longer visible to facilitators" : "Facilitators can now see your screen",
    });
  };

  const handleHelpRequest = () => {
    const newMessage = {
      id: Date.now(),
      type: 'help-request',
      content: 'Student is requesting assistance with their current code',
      timestamp: new Date(),
      sender: 'system'
    };
    setChatMessages(prev => [...prev, newMessage]);
    
    toast({
      title: "Help Request Sent",
      description: "A facilitator will assist you shortly",
    });
  };

  const handleVoiceCall = () => {
    toast({
      title: "Voice Call Initiated",
      description: "Connecting to facilitator...",
    });
  };

  const handleVideoCall = () => {
    toast({
      title: "Video Call Initiated", 
      description: "Starting video session with facilitator...",
    });
  };

  const handleProfileUpdate = (profile: any) => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved",
    });
  };

  // Simulate real-time updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setOnlineUsersCount(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1));
      setProgress(prev => Math.min(100, Math.max(0, prev + Math.floor(Math.random() * 5) - 2)));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-primary rounded-full p-2">
                <Code className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-primary">Smart Learning Assistant</h1>
                <p className="text-sm text-muted-foreground">Student Dashboard</p>
              </div>
            </div>
            
            <Badge variant={isOnline ? "default" : "destructive"} className="ml-4">
              <div className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-status-online' : 'bg-status-offline'}`} />
              {isOnline ? "Online" : "Offline"}
            </Badge>
            <Badge variant="outline" className="ml-2">
              {onlineUsersCount} Online Users
            </Badge>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">Welcome, {username}</span>
            <Button variant="outline" size="sm" onClick={() => setShowProfileModal(true)}>
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" size="sm" onClick={() => setShowThemeSettings(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6">
          <Tabs defaultValue="code" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="code">
                <Code className="h-4 w-4 mr-2" />
                Code Editor
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageCircle className="h-4 w-4 mr-2" />
                Chat
              </TabsTrigger>
              <TabsTrigger value="share">
                <Monitor className="h-4 w-4 mr-2" />
                Screen Share
              </TabsTrigger>
              <TabsTrigger value="progress">
                <BarChart3 className="h-4 w-4 mr-2" />
                Progress
              </TabsTrigger>
            </TabsList>

            {/* Code Editor Tab */}
            <TabsContent value="code" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Code Editor Panel */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                      <div>
                        <CardTitle>Code Editor</CardTitle>
                        <CardDescription>
                          Write and execute your programming assignments
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {languages.map((lang) => (
                              <SelectItem key={lang.value} value={lang.value}>
                                {lang.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button variant="success" size="sm" onClick={handleSaveCode}>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CodeEditor
                        value={code}
                        onChange={setCode}
                        language={selectedLanguage}
                      />
                      <div className="flex items-center justify-between mt-4">
                        <Button variant="compile" onClick={handleCompileAndRun}>
                          <Play className="h-4 w-4 mr-2" />
                          Compile & Run
                        </Button>
                        <Button variant="warning" onClick={handleHelpRequest}>
                          <HelpCircle className="h-4 w-4 mr-2" />
                          Request Help
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Output Panel */}
                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Output Console</CardTitle>
                      <CardDescription>
                        Compilation results and program output
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-code-bg text-code-foreground p-4 rounded-md font-mono text-sm min-h-[300px] overflow-auto">
                        {compilationResult || "Ready to run your code..."}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat">
              <ChatInterface 
                messages={chatMessages}
                onSendMessage={(message) => {
                  const newMessage = {
                    id: Date.now(),
                    type: 'student',
                    content: message,
                    timestamp: new Date(),
                    sender: 'student'
                  };
                  setChatMessages(prev => [...prev, newMessage]);
                }}
                onVoiceCall={handleVoiceCall}
                onVideoCall={handleVideoCall}
              />
            </TabsContent>

            {/* Screen Share Tab */}
            <TabsContent value="share">
              <ScreenShare 
                isSharing={isScreenSharing}
                onToggleShare={handleScreenShare}
                role="student"
              />
            </TabsContent>

            {/* Progress Tab */}
            <TabsContent value="progress">
              <ProgressTracker progress={progress} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Modals */}
      {showThemeSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <ThemeToggle onClose={() => setShowThemeSettings(false)} />
        </div>
      )}

      {showProfileModal && (
        <ProfileModal
          username={username}
          role="student"
          onClose={() => setShowProfileModal(false)}
          onUpdateProfile={handleProfileUpdate}
        />
      )}
    </div>
  );
}