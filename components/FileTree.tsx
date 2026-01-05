
import React from 'react';
import { FileContent } from '../types';
import { FileCode, FileType, CheckCircle2, Loader2, FileText } from 'lucide-react';

interface Props {
  files: FileContent[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function FileTree({ files, selectedId, onSelect }: Props) {
  return (
    <div className="space-y-1">
      {files.map((file) => (
        <button
          key={file.id}
          onClick={() => onSelect(file.id)}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all group ${
            selectedId === file.id 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-lg shadow-emerald-500/5' 
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-transparent'
          }`}
        >
          {file.isProcessing ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
          ) : file.documentation ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <FileCode className={`w-4 h-4 ${selectedId === file.id ? 'text-emerald-400' : 'text-slate-500'}`} />
          )}
          <span className="truncate flex-1 text-left">{file.name}</span>
          <span className="text-[10px] opacity-40 uppercase font-bold tracking-widest hidden group-hover:block">
            {file.language === 'unknown' ? 'raw' : file.language}
          </span>
        </button>
      ))}
    </div>
  );
}
