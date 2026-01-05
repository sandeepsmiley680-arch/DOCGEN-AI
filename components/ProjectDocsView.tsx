
import React from 'react';
import { ProjectDoc } from '../types';
import { Loader2, Book, Download, Sparkles, Files, Github } from 'lucide-react';

interface Props {
  docs: ProjectDoc | null;
  loading: boolean;
  onExport: (content: string) => void;
}

export default function ProjectDocsView({ docs, loading, onExport }: Props) {
  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 bg-slate-950">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 animate-pulse"></div>
          <Sparkles className="w-16 h-16 text-emerald-500 animate-bounce relative" />
        </div>
        <h3 className="mt-8 text-2xl font-bold text-white">Generating Project Overview</h3>
        <p className="mt-2 text-slate-400 text-center max-w-md">
          Our AI is scanning all uploaded files to understand architecture, installation requirements, and feature sets...
        </p>
        <div className="mt-8 w-64 bg-slate-900 h-2 rounded-full overflow-hidden">
          <div className="bg-emerald-500 h-full animate-[progress_2s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
        </div>
        <style>{`
          @keyframes progress {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(250%); }
          }
        `}</style>
      </div>
    );
  }

  if (!docs) return null;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
      <div className="h-14 border-b border-slate-800 bg-slate-900/50 flex items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Book className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">Project Documentation</h2>
        </div>
        <button 
          onClick={() => onExport(docs.readme)}
          className="flex items-center gap-2 text-xs bg-emerald-600 hover:bg-emerald-500 text-white py-1.5 px-4 rounded-lg font-bold shadow-lg transition-all"
        >
          <Download className="w-4 h-4" />
          Export README.md
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-slate-800 bg-slate-800/30 flex items-center gap-3">
              <Files className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">README.md</span>
            </div>
            <div className="p-10 prose prose-invert prose-emerald prose-lg max-w-none">
              <Markdown content={docs.readme} />
            </div>
          </div>
          
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex items-center justify-between group">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Github className="w-8 h-8 text-white" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-white">Ready for production?</h4>
                <p className="text-slate-400">Copy this README into your repository and push to GitHub.</p>
              </div>
            </div>
            <button 
               onClick={() => navigator.clipboard.writeText(docs.readme)}
               className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-xl font-medium transition-colors border border-slate-700"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Markdown Parser (Duplicate for component isolation or move to shared utils)
const Markdown = ({ content }: { content: string }) => {
  return (
    <div className="space-y-4 whitespace-pre-wrap font-sans">
      {content.split('\n').map((line, i) => {
        if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-black text-white border-b border-slate-800 pb-4 mb-6">{line.slice(2)}</h1>;
        if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-bold text-white pt-6 mb-4">{line.slice(3)}</h2>;
        if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-bold text-emerald-400 pt-4 mb-2">{line.slice(4)}</h3>;
        if (line.startsWith('* ') || line.startsWith('- ')) return <div key={i} className="flex gap-3 pl-4 text-slate-300"><span className="text-emerald-500 font-bold">•</span>{line.slice(2)}</div>;
        if (line.trim() === '') return <div key={i} className="h-4" />;
        return <p key={i} className="text-slate-400 leading-relaxed">{line}</p>;
      })}
    </div>
  );
};
