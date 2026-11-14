import React, { useState, useRef, useEffect } from 'react';
import { 
  Network, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Filter, 
  Search, 
  ExternalLink, 
  BookOpen, 
  Bot, 
  Sparkles,
  Info,
  X
} from 'lucide-react';
import { KnowledgeGraphData, KnowledgeNode, NodeCategory, ActiveTab } from '../../types';

interface KnowledgeGraphViewProps {
  data: KnowledgeGraphData;
  onNavigateToTab: (tab: ActiveTab) => void;
  onSelectConceptForTutor?: (concept: string) => void;
}

export const KnowledgeGraphView: React.FC<KnowledgeGraphViewProps> = ({
  data,
  onNavigateToTab,
  onSelectConceptForTutor,
}) => {
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(data.nodes[0] || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<{ [id: string]: { x: number; y: number } }>({});

  const containerRef = useRef<HTMLDivElement>(null);

  // Initialize or update node positions when data changes
  useEffect(() => {
    const initialPos: { [id: string]: { x: number; y: number } } = {};
    data.nodes.forEach((n, idx) => {
      // Circular/organic layout if coordinates are not pre-set
      const angle = (idx / data.nodes.length) * 2 * Math.PI;
      const radius = idx === 0 ? 0 : 200 + (idx % 2) * 50;
      initialPos[n.id] = {
        x: n.x || 400 + Math.cos(angle) * radius,
        y: n.y || 300 + Math.sin(angle) * radius,
      };
    });
    setNodePositions(initialPos);
    if (data.nodes.length > 0 && !selectedNode) {
      setSelectedNode(data.nodes[0]);
    }
  }, [data]);

  const categoryColors: Record<NodeCategory, { bg: string; border: string; glow: string; text: string }> = {
    core: { bg: 'bg-purple-600', border: 'border-purple-400', glow: 'rgba(168, 85, 247, 0.5)', text: 'text-purple-300' },
    architecture: { bg: 'bg-indigo-600', border: 'border-indigo-400', glow: 'rgba(99, 102, 241, 0.5)', text: 'text-indigo-300' },
    mechanism: { bg: 'bg-cyan-600', border: 'border-cyan-400', glow: 'rgba(6, 182, 212, 0.5)', text: 'text-cyan-300' },
    foundation: { bg: 'bg-emerald-600', border: 'border-emerald-400', glow: 'rgba(16, 185, 129, 0.5)', text: 'text-emerald-300' },
    application: { bg: 'bg-amber-600', border: 'border-amber-400', glow: 'rgba(245, 158, 11, 0.5)', text: 'text-amber-300' },
  };

  const filteredNodes = data.nodes.filter((node) => {
    const matchesSearch = node.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          node.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || node.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Canvas Mouse Navigation
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsDraggingCanvas(true);
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDraggingCanvas) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else if (draggingNodeId && nodePositions[draggingNodeId]) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = (e.clientX - rect.left - panOffset.x) / zoomLevel;
        const mouseY = (e.clientY - rect.top - panOffset.y) / zoomLevel;
        setNodePositions((prev) => ({
          ...prev,
          [draggingNodeId]: { x: mouseX, y: mouseY },
        }));
      }
    }
  };

  const handleMouseUp = () => {
    setIsDraggingCanvas(false);
    setDraggingNodeId(null);
  };

  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
    e.stopPropagation();
    setDraggingNodeId(nodeId);
    const node = data.nodes.find((n) => n.id === nodeId);
    if (node) setSelectedNode(node);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div className="relative w-full h-[calc(100vh-8rem)] flex flex-col overflow-hidden rounded-2xl glass-panel border border-white/10 shadow-2xl">
      
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Search & Category Filter */}
        <div className="flex items-center space-x-2 pointer-events-auto bg-navy-950/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-lg">
          <div className="relative flex items-center">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg bg-navy-900/80 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 w-36 sm:w-48 transition"
            />
          </div>

          <div className="flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs bg-navy-900/80 border border-white/10 text-slate-300 rounded-lg px-2 py-1.5 focus:outline-none focus:border-purple-400"
            >
              <option value="all">All Subspaces</option>
              <option value="core">Core</option>
              <option value="architecture">Architecture</option>
              <option value="mechanism">Mechanism</option>
              <option value="foundation">Foundations</option>
              <option value="application">Applications</option>
            </select>
          </div>
        </div>

        {/* View Controls: Zoom & Reset */}
        <div className="flex items-center space-x-1.5 pointer-events-auto bg-navy-950/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-lg">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 2.2))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-slate-400 px-1">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.4))}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-white/10 mx-0.5" />
          <button
            onClick={resetView}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition"
            title="Reset Canvas View"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Area */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="w-full h-full relative cursor-grab active:cursor-grabbing bg-navy-950 bg-grid-pattern overflow-hidden select-none"
      >
        {/* Ambient Decorative Glow Orbs */}
        <div className="orb-purple w-96 h-96 top-1/4 left-1/4" />
        <div className="orb-cyan w-96 h-96 bottom-1/4 right-1/4" />

        <svg
          className="w-full h-full absolute inset-0"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
            transformOrigin: '0 0',
          }}
        >
          <defs>
            <linearGradient id="linkGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.4" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Render Connections / Links */}
          {data.links.map((link, idx) => {
            const sourcePos = nodePositions[link.source];
            const targetPos = nodePositions[link.target];
            if (!sourcePos || !targetPos) return null;

            const isRelated = selectedNode && (selectedNode.id === link.source || selectedNode.id === link.target);

            return (
              <g key={`link-${idx}`}>
                <line
                  x1={sourcePos.x}
                  y1={sourcePos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke={isRelated ? '#00F0FF' : 'rgba(139, 92, 246, 0.25)'}
                  strokeWidth={isRelated ? 2.5 : 1.2}
                  strokeDasharray={isRelated ? 'none' : '4,4'}
                  className="transition-colors duration-300"
                />
                {/* Midpoint relation tag */}
                {isRelated && (
                  <text
                    x={(sourcePos.x + targetPos.x) / 2}
                    y={(sourcePos.y + targetPos.y) / 2 - 6}
                    fill="#00F0FF"
                    fontSize="10"
                    textAnchor="middle"
                    className="font-mono bg-navy-950 px-1 font-semibold select-none"
                  >
                    {link.relation}
                  </text>
                )}
              </g>
            );
          })}

          {/* Render Interactive Nodes */}
          {filteredNodes.map((node) => {
            const pos = nodePositions[node.id];
            if (!pos) return null;

            const isSelected = selectedNode?.id === node.id;
            const categoryMeta = categoryColors[node.category] || categoryColors.core;
            const radius = node.radius || (node.category === 'core' ? 36 : 28);

            return (
              <g
                key={node.id}
                transform={`translate(${pos.x}, ${pos.y})`}
                onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                className="cursor-pointer group"
              >
                {/* Selected Pulse Ring */}
                {isSelected && (
                  <circle
                    r={radius + 12}
                    fill="none"
                    stroke="#00F0FF"
                    strokeWidth="1.5"
                    strokeDasharray="6,4"
                    className="animate-spin"
                    style={{ transformOrigin: 'center' }}
                  />
                )}

                {/* Node Outer Halo Glow */}
                <circle
                  r={radius + 6}
                  fill={categoryMeta.glow}
                  opacity={isSelected ? 0.8 : 0.3}
                  className="transition-opacity duration-300 group-hover:opacity-75"
                />

                {/* Main Node Circle */}
                <circle
                  r={radius}
                  fill="#0D1127"
                  stroke={isSelected ? '#00F0FF' : categoryMeta.border.replace('border-', '')}
                  strokeWidth={isSelected ? 3 : 2}
                  className="transition-transform duration-200 group-hover:scale-105"
                />

                {/* Center Core Dot */}
                <circle
                  r={radius * 0.4}
                  fill={isSelected ? '#00F0FF' : '#8B5CF6'}
                  opacity={0.8}
                />

                {/* Node Label Text */}
                <text
                  y={radius + 18}
                  fill={isSelected ? '#00F0FF' : '#E2E8F0'}
                  fontSize={node.category === 'core' ? '12' : '11'}
                  fontWeight={isSelected ? 'bold' : '500'}
                  textAnchor="middle"
                  className="pointer-events-none select-none font-sans drop-shadow-md"
                >
                  {node.label}
                </text>

                {/* Category Pill Tag */}
                <text
                  y={radius + 30}
                  fill="#94A3B8"
                  fontSize="8.5"
                  textAnchor="middle"
                  className="pointer-events-none select-none uppercase tracking-wider font-mono"
                >
                  {node.category}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 z-20 hidden md:flex items-center space-x-3 bg-navy-950/80 backdrop-blur-md px-3 py-2 rounded-xl border border-white/10 text-[11px] font-mono">
          <span className="text-slate-400">Legend:</span>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-glow-purple" />
            <span className="text-slate-300">Core</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
            <span className="text-slate-300">Architecture</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
            <span className="text-slate-300">Mechanism</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-slate-300">Foundation</span>
          </div>
        </div>
      </div>

      {/* Selected Concept Inspector Drawer */}
      {selectedNode && (
        <div className="absolute top-16 right-4 bottom-4 w-80 sm:w-96 z-30 glass-panel-elevated p-5 rounded-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-300">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  {selectedNode.category} Concept
                </span>
                <h3 className="text-lg font-bold text-white mt-1.5 flex items-center space-x-1.5">
                  <span>{selectedNode.label}</span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 mt-3 font-medium leading-relaxed bg-navy-900/60 p-3 rounded-xl border border-white/5">
              {selectedNode.summary}
            </p>

            <div className="mt-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Systemic Mechanism & Details
              </h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                {selectedNode.details}
              </p>
            </div>

            {selectedNode.citations.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono mb-1.5">
                  Citations & Sources
                </h4>
                <div className="space-y-1">
                  {selectedNode.citations.map((cite, i) => (
                    <div
                      key={i}
                      className="text-[11px] text-purple-300 bg-purple-950/40 border border-purple-500/20 rounded-lg p-2 flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-electric-cyan flex-shrink-0" />
                      <span className="truncate">{cite}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Deep Link Actions */}
          <div className="pt-4 border-t border-white/10 mt-4 space-y-2">
            <button
              onClick={() => onNavigateToTab('explanations')}
              className="w-full py-2 px-3 rounded-xl bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-semibold flex items-center justify-center space-x-2 transition border border-purple-400/30 shadow-glow-purple"
            >
              <BookOpen className="w-3.5 h-3.5 text-electric-cyan" />
              <span>Deep Dive Explanation</span>
            </button>

            <button
              onClick={() => {
                if (onSelectConceptForTutor) onSelectConceptForTutor(selectedNode.label);
                onNavigateToTab('tutor');
              }}
              className="w-full py-2 px-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-200 text-xs font-semibold flex items-center justify-center space-x-2 transition border border-white/10"
            >
              <Bot className="w-3.5 h-3.5 text-purple-400" />
              <span>Ask AI Tutor about {selectedNode.label}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
