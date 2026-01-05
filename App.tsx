
import React, { useState, useCallback, useEffect } from 'react';
import { 
  FileCode, 
  Upload, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Terminal,
  Zap,
  Download,
  PlusCircle,
  FolderOpen,
  Settings,
  ArrowRight
} from 'lucide-react';
import { FileContent, AppView, AnalysisResult, ProjectDoc } from './types';
import { detectLanguage } from './constants';
import { GeminiService } from './services/geminiService';
import WelcomeScreen from './components/WelcomeScreen';
import FileTree from './components/FileTree';
import CodeDocView from './components/CodeDocView';
import ProjectDocsView from './components/ProjectDocsView';

const gemini = new GeminiService();

export default function App() {
  const [view, setView] = useState<AppView>(AppView.WELCOME);
  const [files, setFiles] = useState<FileContent[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [projectDocs, setProjectDocs] = useState<ProjectDoc | null>(null);
  const [isGeneratingProject, setIsGeneratingProject] = useState(false);

  const selectedFile = files.find(f => f.id === selectedFileId);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (!uploadedFiles) return;

    const newFiles: FileContent[] = [];
    // Fixed: Explicitly type 'file' as any to resolve 'unknown' property access errors and support non-standard webkitRelativePath
    const promises = Array.from(uploadedFiles).map((file: any) => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          newFiles.push({
            id: Math.random().toString(36).substr(2, 9),
            name: file.name,
            path: file.webkitRelativePath || file.name,
            content,
            language: detectLanguage(file.name),
            isProcessing: false
          });
          resolve();
        };
        reader.readAsText(file);
      });
    });

    Promise.all(promises).then(() => {
      setFiles(prev => [...prev, ...newFiles]);
      if (newFiles.length > 0) {
        setSelectedFileId(newFiles[0].id);
        setView(AppView.EDITOR);
      }
    });
  };

  const handlePasteCode = (content: string, name: string = "unnamed_script") => {
    const newFile: FileContent = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      path: name,
      content,
      language: detectLanguage(name),
      isProcessing: false
    };
    setFiles(prev => [...prev, newFile]);
    setSelectedFileId(newFile.id);
    setView(AppView.EDITOR);
  };

  const generateDocsForFile = async (fileId: string) => {
    const fileIndex = files.findIndex(f => f.id === fileId);
    if (fileIndex === -1) return;

    setFiles(prev => {
      const updated = [...prev];
      updated[fileIndex] = { ...updated[fileIndex], isProcessing: true };
      return updated;
    });

    try {
      const { analysis, documentation } = await gemini.analyzeFile(files[fileIndex]);
      setFiles(prev => {
        const updated = [...prev];
        updated[fileIndex] = { 
          ...updated[fileIndex], 
          analysis, 
          documentation, 
          isProcessing: false 
        };
        return updated;
      });
    } catch (error) {
      console.error("Error analyzing file:", error);
      setFiles(prev => {
        const updated = [...prev];
        updated[fileIndex] = { ...updated[fileIndex], isProcessing: false };
        return updated;
      });
    }
  };

  const generateProjectDocs = async () => {
    if (files.length === 0) return;
    setIsGeneratingProject(true);
    setView(AppView.PROJECT_DOCS);
    try {
      const readme = await gemini.generateProjectREADME(files);
      setProjectDocs({ readme, changelog: "Initial automated documentation generated." });
    } catch (error) {
      console.error("Error generating project docs:", error);
    } finally {
      setIsGeneratingProject(false);
    }
  };

  const exportMarkdown = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-800 flex flex-col bg-slate-900/50 backdrop-blur-sm">
        <div className="p-4 border-b border-slate-800 flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-lg">
            <Zap className="text-emerald-400 w-5 h-5" />
          </div>
          <h1 className="font-bold text-xl tracking-tight text-white">DocuGenie</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-4 space-y-4">
          <div>
            <div className="flex items-center justify-between px-2 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
              Files
              <label className="cursor-pointer hover:text-emerald-400 transition-colors">
                <PlusCircle className="w-4 h-4" />
                <input type="file" multiple className="hidden" onChange={handleFileUpload} />
              </label>
            </div>
            {files.length === 0 ? (
              <p className="px-2 text-sm text-slate-600 italic">No files uploaded</p>
            ) : (
              <FileTree 
                files={files} 
                selectedId={selectedFileId} 
                onSelect={(id) => {
                  setSelectedFileId(id);
                  setView(AppView.EDITOR);
                }} 
              />
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-800 space-y-2">
          <button 
            onClick={generateProjectDocs}
            disabled={files.length === 0 || isGeneratingProject}
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 transition-all text-white py-2 px-4 rounded-lg text-sm font-medium shadow-lg shadow-emerald-500/10"
          >
            <BookOpen className="w-4 h-4" />
            Generate README
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {view === AppView.WELCOME && (
          <WelcomeScreen onUpload={handleFileUpload} onPaste={handlePasteCode} />
        )}
        
        {view === AppView.EDITOR && selectedFile && (
          <CodeDocView 
            file={selectedFile} 
            onAnalyze={() => generateDocsForFile(selectedFile.id)}
            onExport={(content) => exportMarkdown(content, `${selectedFile.name}.md`)}
          />
        )}

        {view === AppView.PROJECT_DOCS && (
          <ProjectDocsView 
            docs={projectDocs} 
            loading={isGeneratingProject} 
            onExport={(content) => exportMarkdown(content, 'README.md')}
          />
        )}
      </main>
    </div>
  );
}
