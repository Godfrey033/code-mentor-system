import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bell, 
  X, 
  AlertTriangle, 
  CheckCircle, 
  Info, 
  MessageCircle,
  Users,
  Code,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: number;
  type: 'alert' | 'info' | 'help-request' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  studentName?: string;
}

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      type: 'help-request',
      title: 'Help Request',
      message: 'Alice Johnson is struggling with Python loops and needs assistance',
      timestamp: new Date(),
      priority: 'high',
      read: false,
      studentName: 'Alice Johnson'
    },
    {
      id: 2,
      type: 'alert',
      title: 'Multiple Errors Detected',
      message: 'Bob Smith has encountered 8 compilation errors in the last 10 minutes',
      timestamp: new Date(Date.now() - 300000),
      priority: 'medium',
      read: false,
      studentName: 'Bob Smith'
    },
    {
      id: 3,
      type: 'info',
      title: 'Session Started',
      message: 'Carol Wilson has started a new Java programming session',
      timestamp: new Date(Date.now() - 600000),
      priority: 'low',
      read: true,
      studentName: 'Carol Wilson'
    },
    {
      id: 4,
      type: 'system',
      title: 'System Update',
      message: 'Code compilation servers have been updated with improved performance',
      timestamp: new Date(Date.now() - 1200000),
      priority: 'low',
      read: false
    }
  ]);

  const { toast } = useToast();

  // Simulate real-time notifications
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const newNotification: Notification = {
          id: Date.now(),
          type: Math.random() > 0.5 ? 'help-request' : 'alert',
          title: Math.random() > 0.5 ? 'New Help Request' : 'Error Detected',
          message: Math.random() > 0.5 
            ? 'A student needs assistance with their code'
            : 'Multiple compilation errors detected',
          timestamp: new Date(),
          priority: Math.random() > 0.7 ? 'high' : 'medium',
          read: false,
          studentName: ['John Doe', 'Jane Smith', 'Mike Wilson'][Math.floor(Math.random() * 3)]
        };
        setNotifications(prev => [newNotification, ...prev]);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'help-request':
        return <MessageCircle className="h-4 w-4 text-warning" />;
      case 'alert':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'info':
        return <Info className="h-4 w-4 text-primary" />;
      case 'system':
        return <CheckCircle className="h-4 w-4 text-secondary" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-destructive text-destructive-foreground';
      case 'medium':
        return 'bg-warning text-warning-foreground';
      case 'low':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "All notifications marked as read",
      description: `${unreadCount} notifications updated`,
    });
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleAssist = (studentName: string) => {
    toast({
      title: "Connecting to Student",
      description: `Initiating assistance session with ${studentName}`,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5" />
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up!'}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[500px] pr-4">
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border transition-all ${
                      !notification.read 
                        ? 'bg-primary/5 border-primary/20' 
                        : 'bg-muted/30 border-muted'
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {getNotificationIcon(notification.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <p className="text-sm font-medium">{notification.title}</p>
                            <Badge 
                              className={`text-xs ${getPriorityColor(notification.priority)}`}
                            >
                              {notification.priority}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          
                          {notification.studentName && (
                            <div className="flex items-center space-x-2 mb-2">
                              <Users className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {notification.studentName}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{notification.timestamp.toLocaleTimeString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-1 ml-4">
                        {notification.studentName && notification.type === 'help-request' && (
                          <Button
                            size="sm"
                            variant="default"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAssist(notification.studentName!);
                            }}
                          >
                            Assist
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                        >
                          <X className="h-3 w-3" />
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
    </div>
  );
}