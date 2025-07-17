import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Send, 
  Paperclip, 
  Smile, 
  Phone, 
  Video,
  MoreVertical,
  AlertTriangle,
  CheckCircle,
  User,
  Users
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  type: 'student' | 'facilitator' | 'system' | 'help-request';
  content: string;
  timestamp: Date;
  sender: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
}

export function ChatInterface({ messages, onSendMessage }: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([
    { id: 1, name: "Dr. Smith", role: "facilitator", status: "online" },
    { id: 2, name: "John Doe", role: "student", status: "online" },
    { id: 3, name: "Jane Wilson", role: "student", status: "idle" },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      onSendMessage(inputMessage);
      setInputMessage("");
      
      // Simulate facilitator response
      setTimeout(() => {
        const responses = [
          "I see you're working on that problem. Let me help you debug that code.",
          "Great progress! Try adding a null check before accessing that variable.",
          "That's a common error. Let me share my screen to show you the solution.",
          "Good question! The issue is with your loop condition.",
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        // This would be handled by the parent component in a real implementation
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'help-request':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      case 'system':
        return <CheckCircle className="h-4 w-4 text-secondary" />;
      case 'facilitator':
        return <Users className="h-4 w-4 text-primary" />;
      default:
        return <User className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getMessageBadgeColor = (type: string) => {
    switch (type) {
      case 'help-request':
        return 'bg-warning text-warning-foreground';
      case 'system':
        return 'bg-secondary text-secondary-foreground';
      case 'facilitator':
        return 'bg-primary text-primary-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Main Chat Area */}
      <div className="lg:col-span-3">
        <Card className="h-[600px] flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle>Learning Support Chat</CardTitle>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Voice Call
              </Button>
              <Button variant="outline" size="sm">
                <Video className="h-4 w-4 mr-2" />
                Video Call
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Messages Area */}
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>Start a conversation with your facilitator</p>
                    <p className="text-sm">Ask questions, request help, or share your progress</p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex items-start space-x-3 ${
                        message.sender === 'student' ? 'flex-row-reverse space-x-reverse' : ''
                      }`}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">
                          {message.sender === 'student' ? 'ST' : 
                           message.sender === 'facilitator' ? 'FC' : 'SY'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className={`flex-1 max-w-[80%] ${
                        message.sender === 'student' ? 'text-right' : ''
                      }`}>
                        <div className="flex items-center space-x-2 mb-1">
                          <Badge className={`text-xs ${getMessageBadgeColor(message.type)}`}>
                            {getMessageIcon(message.type)}
                            <span className="ml-1 capitalize">{message.sender}</span>
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <div className={`p-3 rounded-lg ${
                          message.sender === 'student' 
                            ? 'bg-primary text-primary-foreground' 
                            : message.type === 'help-request'
                            ? 'bg-warning/10 border border-warning'
                            : 'bg-muted'
                        }`}>
                          <p className="text-sm">{message.content}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Typing Indicator */}
            {isTyping && (
              <div className="py-2 text-sm text-muted-foreground">
                <span className="animate-pulse">Facilitator is typing...</span>
              </div>
            )}

            {/* Message Input */}
            <div className="flex items-center space-x-2 pt-4 border-t">
              <Button variant="ghost" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Smile className="h-4 w-4" />
              </Button>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!inputMessage.trim()}
                variant="default"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Online Users Panel */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Online Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {onlineUsers.map((user) => (
                <div key={user.id} className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                      user.status === 'online' ? 'bg-status-online' : 
                      user.status === 'idle' ? 'bg-status-idle' : 'bg-status-offline'
                    }`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              variant="warning" 
              size="sm" 
              className="w-full"
              onClick={() => {
                onSendMessage("🚨 I need immediate help with my code!");
                toast({
                  title: "Emergency Help Requested",
                  description: "A facilitator will assist you immediately",
                });
              }}
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Help
            </Button>
            <Button variant="outline" size="sm" className="w-full">
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark as Resolved
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}