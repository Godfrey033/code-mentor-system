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
  Activity
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FacilitatorDashboardProps {
  onLogout: () => void;
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

export function FacilitatorDashboard({ onLogout }: FacilitatorDashboardProps) {
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
  const { toast } = useToast();

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
    toast({
      title: "Connecting to Student",
      description: `Initiating assistance session with ${student.name}`,
    });
  };

  const handleDismissAlert = (alertId: number) => {
    setAlerts(alerts.filter(alert => alert.id !== alertId));
  };

  const handleViewScreen = (student: Student) => {
    toast({
      title: "Screen View Requested",
      description: `Requesting screen access from ${student.name}`,
    });
  };

  const handleRemoteCode = (student: Student) => {
    toast({
      title: "Remote Code Access",
      description: `Accessing ${student.name}'s code editor`,
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
            <Button variant="outline" size="sm">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button variant="outline" size="sm">
              <User className="h-4 w-4 mr-2" />
              Profile
            </Button>
            <Button variant="outline" size="sm">
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

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="students">
              <Users className="h-4 w-4 mr-2" />
              Students
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
                          onClick={() => handleAssistStudent(student)}
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
                              <Button size="sm" variant="default">
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
    </div>
  );
}