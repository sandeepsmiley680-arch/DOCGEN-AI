
import React, { useState } from 'react';
import { Upload, Terminal, FileCode, CheckCircle2, Zap, ArrowRight, BookOpen, PlusCircle } from 'lucide-react';

interface Props {
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPaste: (code: string) => void;
}

export default function WelcomeScreen({ onUpload, onPaste }: Props) {
  const [pastedCode, setPastedCode] = useState('');

  return (
    <div className="flex-1 overflow-y-auto p-8 flex flex-col items-center justify-center space-y-12">
      <div className="max-w-3xl w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1 rounded-full text-sm font-medium border border-emerald-500/20">
          <Zap className="w-4 h-4" />
          Powered by Gemini 3 Pro
        </div>
        <h2 className="text-5xl font-extrabold text-white tracking-tight">
          Automate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Documentation</span>
        </h2>
        <p className="text-lg text-slate-400 leading-relaxed">
          The ultimate AI-powered documentation tool. Upload your repository, analyze complex logic, 
          and generate standardized documentation in seconds.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-emerald-500/30 transition-all group flex flex-col justify-between">
          <div className="space-y-4">
            <div className="bg-emerald-500/20 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Upload className="text-emerald-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Upload Codebase</h3>
            <p className="text-slate-400">Drag and drop your files, folders, or selection of source files to begin the analysis.</p>
          </div>
          <label className="mt-8 flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 transition-colors text-white py-3 px-6 rounded-xl cursor-pointer">
            <PlusCircle className="w-5 h-5" />
            <span>Choose Files</span>
            <input type="file" multiple className="hidden" onChange={onUpload} />
          </label>
        </div>

        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-2xl hover:border-cyan-500/30 transition-all group flex flex-col justify-between">
          <div className="space-y-4">
            <div className="bg-cyan-500/20 w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Terminal className="text-cyan-400 w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Paste Snippet</h3>
            <p className="text-slate-400">Have a single function or file? Paste it directly into our editor for an instant documentation boost.</p>
          </div>
          <div className="mt-8 space-y-4">
            <textarea 
              placeholder="Paste your code here..." 
              className="w-full h-24 bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs code-font text-slate-300 focus:outline-none focus:border-cyan-500/50 resize-none"
              value={pastedCode}
              onChange={(e) => setPastedCode(e.target.value)}
            />
            <button 
              onClick={() => pastedCode && onPaste(pastedCode)}
              className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 transition-colors text-white py-2 px-6 rounded-xl font-medium"
            >
              Docify Snippet
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-8 pt-8">
        {[
          { icon: <CheckCircle2 className="w-5 h-5" />, label: "Python PEP 257" },
          { icon: <CheckCircle2 className="w-5 h-5" />, label: "JSDoc / TSDoc" },
          { icon: <CheckCircle2 className="w-5 h-5" />, label: "JavaDoc" },
          { icon: <CheckCircle2 className="w-5 h-5" />, label: "GoDoc" }
        ].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2 text-slate-500 text-sm">
            <span className="text-emerald-500">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
