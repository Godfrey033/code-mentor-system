import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sun, Moon, Monitor } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ThemeToggleProps {
  onClose: () => void;
}

export function ThemeToggle({ onClose }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const { toast } = useToast();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' || 'system';
    setTheme(savedTheme);
    applyTheme(savedTheme);
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark' | 'system') => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (newTheme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(newTheme);
    }
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
    
    toast({
      title: "Theme Updated",
      description: `Switched to ${newTheme} theme`,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Theme Settings</CardTitle>
        <CardDescription>
          Choose your preferred display theme
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3">
          <Button
            variant={theme === 'light' ? 'default' : 'outline'}
            onClick={() => handleThemeChange('light')}
            className="justify-start"
          >
            <Sun className="h-4 w-4 mr-2" />
            Light Mode
          </Button>
          
          <Button
            variant={theme === 'dark' ? 'default' : 'outline'}
            onClick={() => handleThemeChange('dark')}
            className="justify-start"
          >
            <Moon className="h-4 w-4 mr-2" />
            Dark Mode
          </Button>
          
          <Button
            variant={theme === 'system' ? 'default' : 'outline'}
            onClick={() => handleThemeChange('system')}
            className="justify-start"
          >
            <Monitor className="h-4 w-4 mr-2" />
            System Default
          </Button>
        </div>
        
        <Button onClick={onClose} className="w-full mt-4">
          Done
        </Button>
      </CardContent>
    </Card>
  );
}