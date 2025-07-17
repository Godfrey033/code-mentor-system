import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  Download, 
  Upload, 
  Maximize2, 
  Minimize2,
  RotateCcw,
  Settings
} from "lucide-react";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
}

export function CodeEditor({ value, onChange, language }: CodeEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getLanguageColor = () => {
    switch (language) {
      case 'python': return 'bg-blue-100 text-blue-800';
      case 'java': return 'bg-orange-100 text-orange-800';
      case 'c': return 'bg-gray-100 text-gray-800';
      case 'cpp': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(value);
  };

  const handleDownloadCode = () => {
    const extensions = { python: '.py', java: '.java', c: '.c', cpp: '.cpp' };
    const filename = `code${extensions[language as keyof typeof extensions]}`;
    const blob = new Blob([value], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onChange(content);
      };
      reader.readAsText(file);
    }
  };

  const lines = value.split('\n');

  return (
    <div className={`border rounded-lg overflow-hidden bg-card ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 border-b bg-muted/50">
        <div className="flex items-center space-x-3">
          <Badge className={getLanguageColor()}>
            {language.toUpperCase()}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {lines.length} lines
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" onClick={handleCopyCode}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownloadCode}>
            <Download className="h-4 w-4" />
          </Button>
          <label className="cursor-pointer">
            <Button variant="ghost" size="sm" asChild>
              <span>
                <Upload className="h-4 w-4" />
              </span>
            </Button>
            <input
              type="file"
              className="hidden"
              accept=".py,.java,.c,.cpp,.txt"
              onChange={handleFileUpload}
            />
          </label>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative">
        <div className="flex">
          {/* Line Numbers */}
          {lineNumbers && (
            <div className="bg-muted/30 px-3 py-4 text-sm text-muted-foreground font-mono border-r">
              {lines.map((_, index) => (
                <div key={index + 1} className="leading-6">
                  {index + 1}
                </div>
              ))}
            </div>
          )}
          
          {/* Code Area */}
          <div className="flex-1 relative">
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="min-h-[400px] border-0 font-mono resize-none focus:ring-0 bg-transparent"
              style={{ fontSize: `${fontSize}px` }}
              placeholder={`Start coding in ${language}...`}
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      {/* Editor Footer */}
      <div className="flex items-center justify-between p-2 border-t bg-muted/50 text-sm text-muted-foreground">
        <div className="flex items-center space-x-4">
          <span>UTF-8</span>
          <span>Ln {value.split('\n').length}, Col 1</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLineNumbers(!lineNumbers)}
          >
            Line Numbers: {lineNumbers ? 'On' : 'Off'}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setFontSize(fontSize === 14 ? 16 : 14)}
          >
            Font: {fontSize}px
          </Button>
        </div>
      </div>
    </div>
  );
}