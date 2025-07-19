import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Code, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Target,
  Award,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from "lucide-react";

interface ProgressTrackerProps {
  progress?: number;
}

export function ProgressTracker({ progress = 78 }: ProgressTrackerProps) {
  const [timeRange, setTimeRange] = useState("week");

  const progressData = {
    overall: progress,
    languages: {
      python: { completed: 85, total: 100, errors: 12 },
      java: { completed: 60, total: 80, errors: 18 },
      c: { completed: 45, total: 60, errors: 8 },
      cpp: { completed: 30, total: 40, errors: 15 }
    },
    weeklyStats: {
      sessionsCompleted: 12,
      totalTime: "8h 45m",
      problemsSolved: 23,
      helpRequests: 5
    },
    recentActivity: [
      { 
        id: 1, 
        type: "success", 
        title: "Completed Python Assignment 5", 
        time: "2 hours ago",
        language: "python"
      },
      { 
        id: 2, 
        type: "help", 
        title: "Requested help with Java loops", 
        time: "4 hours ago",
        language: "java"
      },
      { 
        id: 3, 
        type: "error", 
        title: "Compilation error in C program", 
        time: "6 hours ago",
        language: "c"
      },
      { 
        id: 4, 
        type: "success", 
        title: "Submitted C++ project", 
        time: "1 day ago",
        language: "cpp"
      }
    ],
    challenges: [
      { type: "syntax_errors", count: 15, trend: "down" },
      { type: "logic_errors", count: 8, trend: "up" },
      { type: "runtime_errors", count: 5, trend: "down" },
      { type: "compilation_errors", count: 12, trend: "stable" }
    ]
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

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-secondary" />;
      case 'error': return <XCircle className="h-4 w-4 text-destructive" />;
      case 'help': return <AlertTriangle className="h-4 w-4 text-warning" />;
      default: return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-destructive" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-secondary" />;
      default: return <BarChart3 className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold text-primary">{progressData.overall}%</p>
              </div>
              <Target className="h-8 w-8 text-primary" />
            </div>
            <Progress value={progressData.overall} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sessions This Week</p>
                <p className="text-2xl font-bold text-secondary">{progressData.weeklyStats.sessionsCompleted}</p>
              </div>
              <Clock className="h-8 w-8 text-secondary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Problems Solved</p>
                <p className="text-2xl font-bold text-accent">{progressData.weeklyStats.problemsSolved}</p>
              </div>
              <Award className="h-8 w-8 text-accent" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Time</p>
                <p className="text-2xl font-bold text-primary">{progressData.weeklyStats.totalTime}</p>
              </div>
              <Calendar className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="languages" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="languages">
            <Code className="h-4 w-4 mr-2" />
            Languages
          </TabsTrigger>
          <TabsTrigger value="activity">
            <Activity className="h-4 w-4 mr-2" />
            Activity
          </TabsTrigger>
          <TabsTrigger value="challenges">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Languages Progress */}
        <TabsContent value="languages">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(progressData.languages).map(([language, data]) => (
              <Card key={language}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium capitalize">
                    {language} Progress
                  </CardTitle>
                  <Badge className={getLanguageColor(language)}>
                    {language.toUpperCase()}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Completed:</span>
                      <span className="font-medium">{data.completed}/{data.total}</span>
                    </div>
                    <Progress value={(data.completed / data.total) * 100} />
                    <div className="flex justify-between text-sm">
                      <span>Completion Rate:</span>
                      <span className="font-medium text-secondary">
                        {Math.round((data.completed / data.total) * 100)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Errors:</span>
                      <span className="font-medium text-destructive">{data.errors}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recent Activity */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest programming activities and milestones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {progressData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg border">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                    <Badge className={getLanguageColor(activity.language)}>
                      {activity.language.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Challenge Tracking */}
        <TabsContent value="challenges">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Error Types</CardTitle>
                <CardDescription>Common challenges you're facing</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {progressData.challenges.map((challenge, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center space-x-3">
                        {getTrendIcon(challenge.trend)}
                        <span className="text-sm font-medium capitalize">
                          {challenge.type.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold">{challenge.count}</span>
                        <Badge variant={challenge.trend === 'down' ? 'default' : 'destructive'}>
                          {challenge.trend}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Goals</CardTitle>
                <CardDescription>Your progress towards learning objectives</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Master Python Basics</span>
                      <span className="font-medium">85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Understand OOP Concepts</span>
                      <span className="font-medium">60%</span>
                    </div>
                    <Progress value={60} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Data Structures & Algorithms</span>
                      <span className="font-medium">40%</span>
                    </div>
                    <Progress value={40} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Debug Complex Programs</span>
                      <span className="font-medium">30%</span>
                    </div>
                    <Progress value={30} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Your coding performance over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Average Session Time</span>
                    <span className="text-sm font-bold">42 minutes</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Code Quality Score</span>
                    <span className="text-sm font-bold text-secondary">B+</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Help Request Rate</span>
                    <span className="text-sm font-bold">0.4/session</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm font-medium">Success Rate</span>
                    <span className="text-sm font-bold text-secondary">78%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Learning Insights</CardTitle>
                <CardDescription>AI-powered recommendations for improvement</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 border border-primary/20 bg-primary/5 rounded-lg">
                    <p className="text-sm font-medium text-primary">💡 Recommendation</p>
                    <p className="text-sm mt-1">Focus on debugging skills - you're requesting help frequently for syntax errors.</p>
                  </div>
                  <div className="p-3 border border-secondary/20 bg-secondary/5 rounded-lg">
                    <p className="text-sm font-medium text-secondary">🎯 Strength</p>
                    <p className="text-sm mt-1">Excellent progress in Python! Consider advancing to intermediate topics.</p>
                  </div>
                  <div className="p-3 border border-warning/20 bg-warning/5 rounded-lg">
                    <p className="text-sm font-medium text-warning">⚠️ Attention</p>
                    <p className="text-sm mt-1">Java concepts need more practice. Schedule additional sessions this week.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}