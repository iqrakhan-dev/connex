import React, { useState } from 'react';
import { 
  FileText, 
  Globe, 
  Lightbulb, 
  Plus, 
  Trash2, 
  Check, 
  ExternalLink, 
  Upload, 
  Sparkles, 
  Layers, 
  BookMarked,
  X,
  FileCheck2,
  ChevronRight
} from 'lucide-react';
import { Source, SourceType } from '../../types';

interface SourceSidebarProps {
  sources: Source[];
  onToggleSource: (id: string) => void;
  onDeleteSource: (id: string) => void;
  onAddSource: (source: Omit<Source, 'id' | 'createdAt'>) => void;
  onSelectTopicPreset: (topicName: string) => void;
  onViewSource: (source: Source) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const SourceSidebar: React.FC<SourceSidebarProps> = ({
  sources,
  onToggleSource,
  onDeleteSource,
  onAddSource,
  onSelectTopicPreset,
  onViewSource,
  isOpen,
  onClose,
}) => {
  const [activeIngestMode, setActiveIngestMode] = useState<SourceType>('topic');
  const [topicInput, setTopicInput] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const presets = [
    { title: 'Transformer & Self-Attention', category: 'Deep Learning' },
    { title: 'Quantum Computing & Qubit Gates', category: 'Physics' },
    { title: 'CRISPR-Cas9 Precision Editing', category: 'Genetics' },
    { title: 'Neuroscience of Memory Consolidation', category: 'Biology' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string || '';
      setFileContent(text);
    };
    reader.readAsText(file);
  };

  const handleIngestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      if (activeIngestMode === 'topic' && topicInput.trim()) {
        onAddSource({
          type: 'topic',
          title: topicInput.trim(),
          snippet: `Core principles, taxonomy, and mathematical formulations for ${topicInput.trim()}.`,
          content: `In-depth research dossier on ${topicInput.trim()}. Synthesized from academic literature, textbooks, and interactive visual models.`,
          tokenCount: Math.floor(Math.random() * 3000) + 2500,
          isActive: true,
          tags: ['Topic Analysis', 'AI Generated']
        });
        setTopicInput('');
      } else if (activeIngestMode === 'url' && urlInput.trim()) {
        try {
          const parsed = new URL(urlInput);
          const domain = parsed.hostname.replace('www.', '');
          onAddSource({
            type: 'url',
            title: `Web Extract: ${domain} — ${parsed.pathname.split('/').filter(Boolean).pop() || 'Resource'}`,
            snippet: `Extracted educational article from ${urlInput}. Key definitions, architecture diagrams, and theoretical overview.`,
            content: `Scraped content from ${urlInput}. Explores system architecture, formal definitions, and empirical case studies.`,
            url: urlInput,
            tokenCount: Math.floor(Math.random() * 4000) + 3000,
            isActive: true,
            tags: ['Web Resource', domain]
          });
          setUrlInput('');
        } catch {
          alert('Please enter a valid educational URL (e.g., https://arxiv.org/abs/...)');
        }
      } else if (activeIngestMode === 'pdf' && (fileName || fileContent)) {
        onAddSource({
          type: 'pdf',
          title: fileName || 'Uploaded Document.pdf',
          fileName: fileName || 'Document.pdf',
          fileSize: `${((fileContent.length || 2048) / 1024).toFixed(1)} KB`,
          snippet: fileContent.slice(0, 180) || 'Academic paper extract containing formal proofs, system diagrams, and methodology.',
          content: fileContent || 'Extracted document text. Full parsed token stream loaded into CONNEX notebook context.',
          tokenCount: Math.floor(fileContent.length / 4) || 3500,
          isActive: true,
          tags: ['PDF Ingestion', 'User Document']
        });
        setFileName('');
        setFileContent('');
      }
      setIsProcessing(false);
    }, 600);
  };

  const activeCount = sources.filter(s => s.isActive).length;
  const totalTokens = sources.filter(s => s.isActive).reduce((acc, s) => acc + s.tokenCount, 0);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside className={`fixed lg:static top-16 bottom-0 left-0 w-80 xl:w-96 glass-panel border-r border-white/10 bg-navy-950/95 z-40 transform transition-transform duration-300 ease-in-out overflow-y-auto flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        
        {/* Top Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookMarked className="w-5 h-5 text-purple-400" />
            <h2 className="text-sm font-bold text-white tracking-wide uppercase font-mono">
              Learning Materials
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
              {activeCount}/{sources.length} Active
            </span>
            <button 
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Ingestion Box */}
        <div className="p-4 border-b border-white/10 bg-navy-900/40">
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center justify-between">
            <span>Ingest Source</span>
            <span className="text-[10px] text-electric-cyan font-mono">Multimodal</span>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-navy-950/70 rounded-lg border border-white/5 mb-3">
            <button
              onClick={() => setActiveIngestMode('topic')}
              className={`flex items-center justify-center space-x-1 py-1.5 rounded-md text-xs font-medium transition ${
                activeIngestMode === 'topic'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Topic</span>
            </button>

            <button
              onClick={() => setActiveIngestMode('pdf')}
              className={`flex items-center justify-center space-x-1 py-1.5 rounded-md text-xs font-medium transition ${
                activeIngestMode === 'pdf'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>PDF</span>
            </button>

            <button
              onClick={() => setActiveIngestMode('url')}
              className={`flex items-center justify-center space-x-1 py-1.5 rounded-md text-xs font-medium transition ${
                activeIngestMode === 'url'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>URL</span>
            </button>
          </div>

          {/* Ingestion Form */}
          <form onSubmit={handleIngestSubmit} className="space-y-2.5">
            {activeIngestMode === 'topic' && (
              <div>
                <input
                  type="text"
                  placeholder="e.g. Quantum Entanglement & Bell State"
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-950/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition"
                />
              </div>
            )}

            {activeIngestMode === 'pdf' && (
              <div>
                <label className="flex flex-col items-center justify-center px-3 py-4 border-2 border-dashed border-white/10 hover:border-purple-400/50 rounded-lg cursor-pointer bg-navy-950/40 hover:bg-navy-900/60 transition group">
                  <Upload className="w-5 h-5 text-purple-400 group-hover:scale-110 transition" />
                  <span className="text-xs text-slate-300 mt-1 font-medium">
                    {fileName ? fileName : 'Upload PDF Document'}
                  </span>
                  <span className="text-[10px] text-slate-500">Supports .pdf, .txt, .md</span>
                  <input
                    type="file"
                    accept=".pdf,.txt,.md"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {activeIngestMode === 'url' && (
              <div>
                <input
                  type="url"
                  placeholder="https://arxiv.org/abs/1706.03762"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-navy-950/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-purple border border-purple-400/30 transition flex items-center justify-center space-x-1.5"
            >
              {isProcessing ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing Material...</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Process & Transform</span>
                </>
              )}
            </button>
          </form>

          {/* Preset Topics */}
          <div className="mt-3 pt-3 border-t border-white/5">
            <span className="text-[11px] font-medium text-slate-400 mb-1.5 block">
              Quick Curricula:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset.title}
                  onClick={() => onSelectTopicPreset(preset.title)}
                  className="text-[10px] px-2 py-1 rounded-md bg-white/5 hover:bg-purple-600/20 text-slate-300 hover:text-purple-300 border border-white/5 hover:border-purple-400/30 transition text-left truncate max-w-full"
                >
                  ⚡ {preset.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Source List */}
        <div className="flex-1 p-3 space-y-2 overflow-y-auto">
          <div className="flex items-center justify-between px-1 text-xs text-slate-400">
            <span>Grounding Documents</span>
            <span className="font-mono text-[10px] text-electric-cyan">~{totalTokens.toLocaleString()} tokens</span>
          </div>

          {sources.length === 0 ? (
            <div className="p-6 text-center text-slate-500 text-xs">
              No sources uploaded yet. Enter a topic or upload a PDF above to begin.
            </div>
          ) : (
            sources.map((source) => {
              const isPdf = source.type === 'pdf';
              const isUrl = source.type === 'url';
              const Icon = isPdf ? FileText : isUrl ? Globe : Lightbulb;

              return (
                <div
                  key={source.id}
                  className={`p-3 rounded-xl border transition-all duration-200 group relative ${
                    source.isActive
                      ? 'bg-navy-900/70 border-purple-500/30 shadow-sm'
                      : 'bg-navy-950/40 border-white/5 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between space-x-2">
                    <div className="flex items-start space-x-2.5 flex-1 min-w-0">
                      <button
                        onClick={() => onToggleSource(source.id)}
                        className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center transition border ${
                          source.isActive
                            ? 'bg-purple-600 border-purple-400 text-white'
                            : 'border-slate-600 hover:border-purple-400'
                        }`}
                        title={source.isActive ? 'Active in AI context' : 'Inactive'}
                      >
                        {source.isActive && <Check className="w-3 h-3 stroke-[3]" />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1.5">
                          <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${
                            isPdf ? 'text-red-400' : isUrl ? 'text-blue-400' : 'text-amber-400'
                          }`} />
                          <h4 
                            onClick={() => onViewSource(source)}
                            className="text-xs font-semibold text-slate-200 hover:text-electric-cyan cursor-pointer truncate"
                            title={source.title}
                          >
                            {source.title}
                          </h4>
                        </div>

                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                          {source.snippet}
                        </p>

                        <div className="flex items-center space-x-2 mt-2 text-[10px] text-slate-500 font-mono">
                          <span>{source.tokenCount.toLocaleString()} tokens</span>
                          {source.fileSize && <span>• {source.fileSize}</span>}
                          {source.url && (
                            <a 
                              href={source.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-purple-400 hover:text-purple-300 flex items-center space-x-0.5"
                            >
                              <span>link</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => onViewSource(source)}
                        className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/5"
                        title="Inspect Document"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteSource(source.id)}
                        className="p-1 rounded text-slate-400 hover:text-red-400 hover:bg-white/5"
                        title="Remove source"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Grounding Footer */}
        <div className="p-3 border-t border-white/10 bg-navy-950/80 text-[11px] text-slate-400 flex items-center justify-between font-mono">
          <div className="flex items-center space-x-1.5">
            <Layers className="w-3.5 h-3.5 text-electric-cyan" />
            <span>Multi-Source Grounding</span>
          </div>
          <span className="text-emerald-400 font-semibold">Active</span>
        </div>
      </aside>
    </>
  );
};
