import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  MonitorSpeaker, 
  Square, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  Settings,
  Users,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Circle,
  StopCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ScreenShareProps {
  isSharing: boolean;
  onToggleShare: () => void;
  role: 'student' | 'facilitator';
}

export function ScreenShare({ isSharing, onToggleShare, role }: ScreenShareProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [viewers, setViewers] = useState([
    { id: 1, name: "Dr. Smith", role: "facilitator", connected: true },
    { id: 2, name: "Teaching Assistant", role: "facilitator", connected: false },
  ]);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [quality, setQuality] = useState("HD");
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isSharing && videoRef.current) {
      // Simulate screen capture
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({ 
          video: true, 
          audio: audioEnabled 
        })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.error("Error accessing display media:", err);
          toast({
            title: "Screen Share Error",
            description: "Unable to access screen sharing. Please check permissions.",
            variant: "destructive"
          });
        });
      }
    }
  }, [isSharing, audioEnabled]);

  const handleStartShare = () => {
    onToggleShare();
    if (!isSharing) {
      toast({
        title: "Screen Sharing Started",
        description: role === 'student' 
          ? "Your screen is now visible to facilitators" 
          : "You are now viewing the student's screen",
      });
    }
  };

  const handleStopShare = () => {
    onToggleShare();
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    toast({
      title: "Screen Sharing Stopped",
      description: "Screen sharing session has ended",
    });
  };

  const handleToggleRecording = () => {
    setIsRecording(!isRecording);
    toast({
      title: isRecording ? "Recording Stopped" : "Recording Started",
      description: isRecording 
        ? "Session recording has been saved" 
        : "Session is now being recorded for review",
    });
  };

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Screen Sharing Control</CardTitle>
              <CardDescription>
                {role === 'student' 
                  ? "Share your screen with facilitators for assistance" 
                  : "View and assist student in real-time"}
              </CardDescription>
            </div>
            <Badge variant={isSharing ? "default" : "secondary"}>
              <Monitor className="h-4 w-4 mr-2" />
              {isSharing ? "Sharing Active" : "Not Sharing"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {!isSharing ? (
                <Button variant="learning" onClick={handleStartShare}>
                  <Play className="h-4 w-4 mr-2" />
                  Start Screen Share
                </Button>
              ) : (
                <Button variant="destructive" onClick={handleStopShare}>
                  <Square className="h-4 w-4 mr-2" />
                  Stop Sharing
                </Button>
              )}
              
              {isSharing && (
                <>
                  <Button 
                    variant={audioEnabled ? "default" : "outline"} 
                    size="sm"
                    onClick={() => setAudioEnabled(!audioEnabled)}
                  >
                    {audioEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                  
                  <Button 
                    variant={isRecording ? "destructive" : "outline"} 
                    size="sm"
                    onClick={handleToggleRecording}
                  >
                    {isRecording ? <StopCircle className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
                  </Button>
                </>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Badge variant="outline">
                Quality: {quality}
              </Badge>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Screen Share Display */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Screen Display */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MonitorSpeaker className="h-5 w-5 mr-2" />
                {role === 'student' ? 'Your Screen' : "Student's Screen"}
                {isRecording && (
                  <Badge variant="destructive" className="ml-2 animate-pulse">
                    <Circle className="h-3 w-3 mr-1" />
                    REC
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isSharing ? (
                <div className="relative bg-gray-900 rounded-lg overflow-hidden">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    className="w-full h-[400px] object-contain"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <Button variant="secondary" size="sm">
                      <Maximize2 className="h-4 w-4" />
                    </Button>
                    <Button variant="secondary" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  {/* Sharing indicator */}
                  <div className="absolute bottom-4 left-4">
                    <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm flex items-center">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
                      Live
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-[400px] bg-muted rounded-lg flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Monitor className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg font-medium">Screen sharing not active</p>
                    <p className="text-sm">
                      {role === 'student' 
                        ? "Start sharing to get help from facilitators" 
                        : "Waiting for student to share their screen"}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Viewers Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Users className="h-4 w-4 mr-2" />
                Viewers ({viewers.filter(v => v.connected).length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {viewers.map((viewer) => (
                  <div key={viewer.id} className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      viewer.connected ? 'bg-status-online' : 'bg-status-offline'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{viewer.name}</p>
                      <p className="text-xs text-muted-foreground">{viewer.role}</p>
                    </div>
                    {viewer.connected && (
                      <Eye className="h-4 w-4 text-primary" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Session Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Session Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Status:</span>
                <span className={isSharing ? 'text-secondary' : 'text-muted-foreground'}>
                  {isSharing ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Quality:</span>
                <span>{quality}</span>
              </div>
              <div className="flex justify-between">
                <span>Audio:</span>
                <span>{audioEnabled ? 'Enabled' : 'Disabled'}</span>
              </div>
              {isSharing && (
                <div className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-mono">05:23</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {role === 'facilitator' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Remote Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Remote Control
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Monitor className="h-4 w-4 mr-2" />
                  Annotation
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}