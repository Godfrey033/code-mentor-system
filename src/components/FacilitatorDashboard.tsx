import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Monitor, 
  MessageCircle, 
  AlertTriangle, 
  CheckCircle,
  BarChart3,
  Settings,
  Bell,
  User,
  LogOut,
  Code,
  Eye,
  Play,
  Pause,
  HelpCircle,
  TrendingUp,
  Clock,
  Activity,
  Save,
  Share2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { CodeEditor } from "./CodeEditor";
import { ChatInterface } from "./ChatInterface";
import { ScreenShare } from "./ScreenShare";
import { NotificationPanel } from "./NotificationPanel";
import { ProfileModal } from "./ProfileModal";
import { ThemeToggle } from "./ThemeToggle";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import * as React from "react";

interface FacilitatorDashboardProps {
  onLogout: () => void;
  username: string;
}

interface Student {
  id: number;
  name: string;
  status: 'active' | 'idle' | 'offline' | 'needs-help';
  currentLanguage: string;
  sessionTime: string;
  progress: number;
  lastActivity: string;
  screenSharing: boolean;
  errorCount: number;
}

export function FacilitatorDashboard({ onLogout, username }: FacilitatorDashboardProps) {
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: "Alice Johnson",
      status: 'active',
      currentLanguage: 'python',
      sessionTime: '45m',
      progress: 78,
      lastActivity: '2 minutes ago',
      screenSharing: false,
      errorCount: 3
    },
    {
      id: 2,
      name: "Bob Smith",
      status: 'needs-help',
      currentLanguage: 'java',
      sessionTime: '32m',
      progress: 45,
      lastActivity: 'Just now',
      screenSharing: true,
      errorCount: 8
    },
    {
      id: 3,
      name: "Carol Wilson",
      status: 'idle',
      currentLanguage: 'c',
      sessionTime: '67m',
      progress: 92,
      lastActivity: '15 minutes ago',
      screenSharing: false,
      errorCount: 1
    },
    {
      id: 4,
      name: "David Brown",
      status: 'active',
      currentLanguage: 'cpp',
      sessionTime: '23m',
      progress: 34,
      lastActivity: '1 minute ago',
      screenSharing: false,
      errorCount: 5
    }
  ]);

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      studentName: "Bob Smith",
      type: "help-request",
      message: "Student is struggling with Java loops",
      timestamp: new Date(),
      priority: "high"
    },
    {
      id: 2,
      studentName: "Alice Johnson",
      type: "error-spike",
      message: "Multiple compilation errors in the last 10 minutes",
      timestamp: new Date(Date.now() - 300000),
      priority: "medium"
    }
  ]);

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showThemeSettings, setShowThemeSettings] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("python");
  const [code, setCode] = useState("");
  const [compilationResult, setCompilationResult] = useState("");
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [notificationCount, setNotificationCount] = useState(3);
  const [activeTab, setActiveTab] = useState("students");
  const [globalMessages, setGlobalMessages] = useState<any[]>([]);
  const { toast } = useToast();

  const languages = [
    { value: "python", label: "Python 3", ext: ".py" },
    { value: "java", label: "Java", ext: ".java" },
    { value: "c", label: "C", ext: ".c" },
    { value: "cpp", label: "C++", ext: ".cpp" },
  ];

  const defaultCode = {
    python: `print("Hello from Facilitator!")`,
    java: `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello from Facilitator!");
    }
}`,
    c: `#include <stdio.h>

int main() {
    printf("Hello from Facilitator!\\n");
    return 0;
}`,
    cpp: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello from Facilitator!" << endl;
    return 0;
}`
  };

  // Real-time updates simulation
  React.useEffect(() => {
    const interval = setInterval(() => {
      // Update student data
      setStudents(prev => prev.map(student => ({
        ...student,
        progress: Math.min(100, Math.max(0, student.progress + Math.floor(Math.random() * 3) - 1)),
        errorCount: Math.max(0, student.errorCount + Math.floor(Math.random() * 2) - 1),
        sessionTime: updateSessionTime(student.sessionTime)
      })));
      
      // Occasionally add new notifications
      if (Math.random() > 0.8) {
        setNotificationCount(prev => prev + 1);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    setCode(defaultCode[selectedLanguage as keyof typeof defaultCode]);
  }, [selectedLanguage]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-status-online text-white';
      case 'needs-help': return 'bg-destructive text-destructive-foreground';
      case 'idle': return 'bg-status-idle text-black';
      case 'offline': return 'bg-status-offline text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getLanguageColor = (language: string) => {
    switch (language) {
      case 'python': return 'bg-blue-100 text-blue-800';
      case 'java': return 'bg-orange-100 text-orange-800';
      case 'c': return 'bg-gray-100 text-gray-800';
      case 'cpp': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAssistStudent = (student: Student) => {
    setSelectedStudent(student);
    const assistMessage = {
      id: Date.now(),
      type: 'system',
      content: `Facilitator is providing assistance to ${student.name}`,
      timestamp: new Date(),
      sender: 'facilitator'
    };
    setGlobalMessages(prev => [...prev, assistMessage]);
    setNotificationCount(prev => prev + 1);
    
    toast({
      title: "Assistance Notification Sent",
      description: `${student.name} has been notified that help is on the way`,
    });
  };

  const handleDismissAlert = (alertId: number) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const handleViewScreen = (student: Student) => {
    setSelectedStudent(student);
    setActiveTab("monitoring");
    toast({
      title: "Viewing Student Problem",
      description: `Now viewing ${student.name}'s current challenges and code issues`,
    });
  };

  const handleRemoteCode = (student: Student) => {
    setSelectedStudent(student);
    setActiveTab("code");
    setCode(`// Accessing ${student.name}'s code
print("Hello from ${student.name}'s workspace!")
# Student is working on loops
for i in range(5):
    print(f"Iteration {i}")
`);
    toast({
      title: "Remote Code Access",
      description: `Now editing ${student.name}'s code remotely`,
    });
  };

  const updateSessionTime = (currentTime: string): string => {
    const minutes = parseInt(currentTime.replace('m', '')) + 1;
    return `${minutes}m`;
  };

  const handleCompileAndRun = async () => {
    toast({
      title: "Compiling...",
      description: `Running ${selectedLanguage} code`,
    });

    setTimeout(() => {
      setCompilationResult(`Hello from Facilitator!

Process finished with exit code 0
Time: 0.32s
Memory: 8.2MB`);
      
      toast({
        title: "Success!",
        description: "Code compiled and executed successfully",
      });
    }, 1500);
  };

  const handleSaveCode = () => {
    toast({
      title: "Code Saved",
      description: "Your code has been saved successfully",
    });
  };

  const handleScreenShare = () => {
    toast({
      title: "Screen Share Initiated",
      description: "You can now view student screens",
    });
  };

  const handleProfileUpdate = (profile: any) => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved",
    });
  };

  const studentsNeedingHelp = students.filter(s => s.status === 'needs-help').length;
  const totalActiveStudents = students.filter(s => s.status === 'active' || s.status === 'needs-help').length;
  const averageProgress = Math.round(students.reduce((acc, s) => acc + s.progress, 0) / students.length);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-soft">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-secondary rounded-full p-2">
                <Users className="h-5 w-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-secondary">Smart Learning Assistant</h1>
                <p className="text-sm text-muted-foreground">Facilitator Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="default">
                {totalActiveStudents} Active Students
              </Badge>
              {studentsNeedingHelp > 0 && (
                <Badge variant="destructive" className="animate-pulse">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {studentsNeedingHelp} Need Help
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-muted-foreground">Welcome, {username}</span>
            <Button variant="outline" size="sm" onClick={() => setShowNotifications(true)} className="relative">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
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

      <div className="p-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-primary">{students.length}</p>
                </div>
                <Users className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Need Assistance</p>
                  <p className="text-2xl font-bold text-destructive">{studentsNeedingHelp}</p>
                </div>
                <HelpCircle className="h-8 w-8 text-destructive" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Progress</p>
                  <p className="text-2xl font-bold text-secondary">{averageProgress}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                  <p className="text-2xl font-bold text-accent">{totalActiveStudents}</p>
                </div>
                <Activity className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="students">
              <Users className="h-4 w-4 mr-2" />
              Students
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code className="h-4 w-4 mr-2" />
              Code Editor
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="alerts">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Alerts ({alerts.length})
            </TabsTrigger>
            <TabsTrigger value="monitoring">
              <Monitor className="h-4 w-4 mr-2" />
              Live Monitoring
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="students">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {students.map((student) => (
                <Card key={student.id} className="relative">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarFallback>
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{student.name}</CardTitle>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge className={getStatusColor(student.status)}>
                            {student.status.replace('-', ' ').toUpperCase()}
                          </Badge>
                          <Badge className={getLanguageColor(student.currentLanguage)}>
                            {student.currentLanguage.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {student.screenSharing && (
                      <Badge variant="outline" className="text-primary border-primary">
                        <Monitor className="h-3 w-3 mr-1" />
                        Screen Shared
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Progress:</span>
                        <span className="font-medium">{student.progress}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-secondary h-2 rounded-full transition-all duration-300" 
                          style={{ width: `${student.progress}%` }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Session Time:</span>
                          <p className="font-medium">{student.sessionTime}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Errors:</span>
                          <p className={`font-medium ${student.errorCount > 5 ? 'text-destructive' : 'text-muted-foreground'}`}>
                            {student.errorCount}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-xs text-muted-foreground">
                        Last activity: {student.lastActivity}
                      </div>

                      <div className="flex space-x-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => {
                            handleAssistStudent(student);
                            setActiveTab("chat");
                          }}
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Chat
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewScreen(student)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleRemoteCode(student)}
                        >
                          <Code className="h-4 w-4 mr-1" />
                          Code
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Code Editor Tab */}
          <TabsContent value="code" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Code Editor Panel */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <div>
                      <CardTitle>Remote Code Editor</CardTitle>
                      <CardDescription>
                        Write and execute code remotely
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
                      <Button variant="outline" onClick={handleScreenShare}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Screen
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
              messages={globalMessages}
              onSendMessage={(message) => {
                const newMessage = {
                  id: Date.now(),
                  type: 'facilitator',
                  content: message,
                  timestamp: new Date(),
                  sender: 'facilitator'
                };
                setGlobalMessages(prev => [...prev, newMessage]);
              }}
              role="facilitator"
              onScreenShare={handleScreenShare}
            />
          </TabsContent>

          {/* Alerts Tab */}
          <TabsContent value="alerts">
            <Card>
              <CardHeader>
                <CardTitle>System Alerts</CardTitle>
                <CardDescription>Real-time notifications about student challenges</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-4">
                    {alerts.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CheckCircle className="h-12 w-12 mx-auto mb-4 text-secondary" />
                        <p>No active alerts</p>
                        <p className="text-sm">All students are progressing well</p>
                      </div>
                    ) : (
                      alerts.map((alert) => (
                        <div 
                          key={alert.id} 
                          className={`p-4 rounded-lg border-l-4 ${
                            alert.priority === 'high' 
                              ? 'border-l-destructive bg-destructive/5' 
                              : 'border-l-warning bg-warning/5'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <AlertTriangle className={`h-4 w-4 ${
                                  alert.priority === 'high' ? 'text-destructive' : 'text-warning'
                                }`} />
                                <span className="font-medium">{alert.studentName}</span>
                                <Badge variant={alert.priority === 'high' ? 'destructive' : 'default'}>
                                  {alert.priority} priority
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{alert.message}</p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {alert.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => {
                                  const student = students.find(s => s.name === alert.studentName);
                                  if (student) handleAssistStudent(student);
                                }}
                              >
                                Assist
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleDismissAlert(alert.id)}
                              >
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Monitoring Tab */}
          <TabsContent value="monitoring">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Real-time Activity Feed</CardTitle>
                  <CardDescription>Live updates from all student sessions</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded">
                        <div className="w-2 h-2 bg-secondary rounded-full" />
                        <span className="font-medium">Alice Johnson</span>
                        <span className="text-muted-foreground">completed Python exercise</span>
                        <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-destructive/10 rounded">
                        <div className="w-2 h-2 bg-destructive rounded-full" />
                        <span className="font-medium">Bob Smith</span>
                        <span className="text-muted-foreground">encountered compilation error</span>
                        <span className="text-xs text-muted-foreground ml-auto">3m ago</span>
                      </div>
                      <div className="flex items-center space-x-2 p-2 bg-muted/50 rounded">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="font-medium">Carol Wilson</span>
                        <span className="text-muted-foreground">started new C project</span>
                        <span className="text-xs text-muted-foreground ml-auto">5m ago</span>
                      </div>
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Performance</CardTitle>
                  <CardDescription>Monitoring system health and usage</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Server Load</span>
                      <span className="text-sm text-secondary">45%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-secondary h-2 rounded-full w-[45%]" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Compiler Queue</span>
                      <span className="text-sm text-primary">3 jobs</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-[30%]" />
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Network Usage</span>
                      <span className="text-sm text-accent">78%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-accent h-2 rounded-full w-[78%]" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Session Statistics</CardTitle>
                  <CardDescription>Student performance metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Average Session Duration</span>
                      <span className="text-sm font-bold">42 minutes</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Success Rate</span>
                      <span className="text-sm font-bold text-secondary">73%</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Help Requests Today</span>
                      <span className="text-sm font-bold">12</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm font-medium">Most Common Error</span>
                      <span className="text-sm font-bold">Syntax Error</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Language Distribution</CardTitle>
                  <CardDescription>Student language preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center">
                        <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
                        Python
                      </span>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center">
                        <div className="w-3 h-3 bg-orange-500 rounded mr-2" />
                        Java
                      </span>
                      <span className="text-sm font-medium">30%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center">
                        <div className="w-3 h-3 bg-gray-500 rounded mr-2" />
                        C
                      </span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm flex items-center">
                        <div className="w-3 h-3 bg-purple-500 rounded mr-2" />
                        C++
                      </span>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      {showNotifications && (
        <NotificationPanel onClose={() => {
          setShowNotifications(false);
          setNotificationCount(0);
        }} />
      )}

      {showProfileModal && (
        <ProfileModal
          username={username}
          role="facilitator"
          onClose={() => setShowProfileModal(false)}
          onUpdateProfile={handleProfileUpdate}
        />
      )}

      {showThemeSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <ThemeToggle onClose={() => setShowThemeSettings(false)} />
        </div>
      )}
    </div>
  );
}