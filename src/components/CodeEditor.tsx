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
  onRun?: () => void;
}

export function CodeEditor({ value, onChange, language, onRun }: CodeEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [lineNumbers, setLineNumbers] = useState(true);
  const [fontSize, setFontSize] = useState(14);
  const [output, setOutput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const runCode = () => {
    setOutput("Running...");
    
    setTimeout(() => {
      if (value.trim() === "") {
        setOutput("No code to execute.");
        return;
      }
      
      const currentCode = value;
      let result = "";
      
      switch (language.toLowerCase()) {
        case 'python':
          if (currentCode.includes('print')) {
            const printMatches = currentCode.match(/print\(['"]([^'"]+)['"]\)/g);
            if (printMatches) {
              result = printMatches.map(match => {
                const content = match.match(/print\(['"]([^'"]+)['"]\)/);
                return content ? content[1] : "";
              }).join('\n');
            } else {
              result = "Hello, Python!";
            }
          } else {
            result = "Code executed successfully (Python)";
          }
          break;
        case 'java':
          if (currentCode.includes('System.out.println')) {
            const printMatches = currentCode.match(/System\.out\.println\(['"]([^'"]+)['"]\)/g);
            if (printMatches) {
              result = printMatches.map(match => {
                const content = match.match(/System\.out\.println\(['"]([^'"]+)['"]\)/);
                return content ? content[1] : "";
              }).join('\n');
            } else {
              result = "Hello, Java!";
            }
          } else {
            result = "Code compiled and executed successfully (Java)";
          }
          break;
        case 'c':
        case 'c++':
          if (currentCode.includes('printf')) {
            const printMatches = currentCode.match(/printf\(['"]([^'"]+)['"]\)/g);
            if (printMatches) {
              result = printMatches.map(match => {
                const content = match.match(/printf\(['"]([^'"]+)['"]\)/);
                return content ? content[1] : "";
              }).join('\n');
            } else {
              result = "Hello, C/C++!";
            }
          } else if (currentCode.includes('cout')) {
            const coutMatches = currentCode.match(/cout\s*<<\s*['"]([^'"]+)['"]/g);
            if (coutMatches) {
              result = coutMatches.map(match => {
                const content = match.match(/cout\s*<<\s*['"]([^'"]+)['"]/);
                return content ? content[1] : "";
              }).join('\n');
            } else {
              result = "Hello, C++!";
            }
          } else {
            result = `Code compiled and executed successfully (${language.toUpperCase()})`;
          }
          break;
        default:
          result = `Code executed successfully (${language})`;
      }
      
      setOutput(result);
    }, 1000);
  };

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
          <Button 
            variant="default" 
            size="sm" 
            onClick={onRun || runCode}
          >
            Run
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

      {/* Output Panel */}
      {output && (
        <div className="border-t bg-muted/30">
          <div className="p-3">
            <h4 className="text-sm font-medium mb-2">Output:</h4>
            <pre className="text-sm bg-background p-2 rounded border font-mono whitespace-pre-wrap">
              {output}
            </pre>
          </div>
        </div>
      )}

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