import React from 'react';
import { X, FileText, Globe, Lightbulb, ExternalLink, Copy, Check } from 'lucide-react';
import { Source } from '../../types';

interface SourceModalProps {
  source: Source | null;
  onClose: () => void;
}

export const SourceModal: React.FC<SourceModalProps> = ({ source, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!source) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(source.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isPdf = source.type === 'pdf';
  const isUrl = source.type === 'url';
  const Icon = isPdf ? FileText : isUrl ? Globe : Lightbulb;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-panel-elevated w-full max-w-2xl rounded-2xl border border-white/20 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 flex items-start justify-between bg-navy-950/80">
          <div className="flex items-start space-x-3">
            <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 mt-0.5">
              <Icon className="w-5 h-5 text-electric-cyan" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10">
                  {source.type}
                </span>
                <span className="text-[11px] font-mono text-electric-cyan">
                  {source.tokenCount.toLocaleString()} parsed tokens
                </span>
              </div>
              <h3 className="text-base font-bold text-white mt-1 leading-snug">
                {source.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-2 border-b border-white/5">
            <span>Grounding Document Content</span>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 text-purple-400 hover:text-purple-300 transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-navy-950/80 border border-white/5 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
            {source.content}
          </div>

          {source.tags && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {source.tags.map(tag => (
                <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-navy-950 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Ingested on {new Date(source.createdAt).toLocaleDateString()}
          </span>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold border border-white/10 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
