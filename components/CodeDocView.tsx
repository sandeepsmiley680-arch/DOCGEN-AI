
import React from 'react';
import { FileContent } from '../types';
import { 
  Terminal, 
  BookOpen, 
  Sparkles, 
  Loader2, 
  Download, 
  AlertTriangle, 
  ShieldCheck, 
  Lightbulb,
  Maximize2,
  Copy
} from 'lucide-react';

interface Props {
  file: FileContent;
  onAnalyze: () => void;
  onExport: (content: string) => void;
}

export default function CodeDocView({ file, onAnalyze, onExport }: Props) {
  const [tab, setTab] = React.useState<'combined' | 'docs' | 'analysis'>('combined');

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
      {/* ToolBar */}
      <div className="h-14 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-emerald-400"><FileCode className="w-4 h-4" /></span>
            <span className="text-sm font-medium text-white">{file.path}</span>
          </div>
          <div className="h-4 w-[1px] bg-slate-800" />
          <div className="flex gap-1">
            {['combined', 'docs', 'analysis'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t as any)}
                className={`px-3 py-1 text-xs rounded-md transition-all font-medium capitalize ${
                  tab === t ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {file.documentation && (
            <button 
              onClick={() => onExport(file.documentation!)}
              className="flex items-center gap-2 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 px-3 rounded-lg border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Export Markdown
            </button>
          )}
          <button
            onClick={onAnalyze}
            disabled={file.isProcessing}
            className="flex items-center gap-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 px-4 rounded-lg font-bold shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            {file.isProcessing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Thinking...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                {file.documentation ? 'Re-Generate' : 'Analyze & Docify'}
              </>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Side: Source Code */}
        {(tab === 'combined' || tab === 'docs') && (
          <div className={`flex-1 flex flex-col border-r border-slate-800 transition-all ${tab === 'docs' ? 'hidden' : ''}`}>
            <div className="p-2 border-b border-slate-800 bg-slate-900/30 flex justify-between">
              <span className="text-[10px] text-slate-500 font-mono uppercase px-2 py-1">Source Code</span>
            </div>
            <pre className="flex-1 overflow-auto p-6 code-font text-sm leading-relaxed text-slate-300 selection:bg-emerald-500/30">
              <code>{file.content}</code>
            </pre>
          </div>
        )}

        {/* Right Side: Docs / Analysis */}
        <div className={`flex-1 flex flex-col bg-slate-900/10 transition-all ${tab === 'analysis' ? 'max-w-2xl mx-auto border-x border-slate-800' : ''}`}>
          {!file.documentation && !file.isProcessing ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl">
                <BookOpen className="w-8 h-8 text-slate-600" />
              </div>
              <h4 className="text-xl font-semibold text-white">Documentation is missing</h4>
              <p className="text-slate-500 max-w-sm">
                This file hasn't been analyzed yet. Run DocuGenie to extract insights and generate industry-standard comments.
              </p>
              <button 
                onClick={onAnalyze}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-medium flex items-center gap-2"
              >
                Start analysis now <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : file.isProcessing ? (
            <div className="flex-1 flex flex-col items-center justify-center p-12">
              <div className="relative">
                <div className="absolute inset-0 bg-emerald-500 blur-2xl opacity-20 animate-pulse"></div>
                <Loader2 className="w-12 h-12 text-emerald-500 animate-spin relative" />
              </div>
              <p className="mt-8 text-slate-300 font-medium">Parsing AST & Synthesizing Docs...</p>
              <p className="mt-2 text-slate-500 text-sm italic">"Reviewing semantics of ${file.name}"</p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col overflow-hidden">
              {tab === 'analysis' ? (
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-blue-400" />
                      Code Health
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-xs text-slate-500 mb-1">Complexity</div>
                        <div className={`text-lg font-bold ${file.analysis?.complexity === 'High' ? 'text-red-400' : 'text-emerald-400'}`}>
                          {file.analysis?.complexity}
                        </div>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
                        <div className="text-xs text-slate-500 mb-1">Structural Depth</div>
                        <div className="text-lg font-bold text-white">
                          {(file.analysis?.functions.length || 0) + (file.analysis?.classes.length || 0)} Units
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Warnings
                    </h4>
                    <div className="space-y-2">
                      {file.analysis?.warnings.map((w, idx) => (
                        <div key={idx} className="flex gap-3 text-sm p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg text-amber-200">
                          <span className="shrink-0">•</span>
                          {w}
                        </div>
                      ))}
                      {file.analysis?.warnings.length === 0 && <p className="text-sm text-slate-600 italic px-4">No critical warnings found.</p>}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-emerald-400" />
                      Suggestions
                    </h4>
                    <ul className="space-y-2">
                      {file.analysis?.suggestions.map((s, idx) => (
                        <li key={idx} className="flex gap-3 text-sm text-slate-400 leading-relaxed px-2">
                          <span className="text-emerald-500 shrink-0 font-bold">{idx + 1}.</span>
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="p-2 border-b border-slate-800 bg-slate-900/30 flex justify-between items-center">
                    <span className="text-[10px] text-slate-500 font-mono uppercase px-2 py-1">Standardized Docs</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(file.documentation!)}
                      className="p-1 hover:text-emerald-400 transition-colors text-slate-600"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="flex-1 overflow-auto p-6 prose prose-invert prose-emerald prose-sm max-w-none">
                    <Markdown content={file.documentation || ''} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Simple Markdown Parser (Render MD as styled text)
const Markdown = ({ content }: { content: string }) => {
  return (
    <div className="space-y-4 whitespace-pre-wrap font-sans">
      {content.split('\n').map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-bold text-white border-b border-slate-800 pb-2 mb-4">{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-bold text-white pt-4 mb-2">{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-bold text-emerald-400 pt-2 mb-1">{line.slice(4)}</h3>;
        if (line.startsWith('```')) return null;
        if (line.startsWith('* ') || line.startsWith('- ')) return <div key={i} className="flex gap-2 pl-2 text-slate-400"><span className="text-emerald-500">•</span>{line.slice(2)}</div>;
        return <p key={i} className="text-slate-400 leading-relaxed">{line}</p>;
      })}
    </div>
  );
};

import { FileCode, ChevronRight } from 'lucide-react';
