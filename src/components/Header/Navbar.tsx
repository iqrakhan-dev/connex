import React from 'react';
import { 
  Network, 
  BookOpen, 
  Atom, 
  Bot, 
  Headphones, 
  CheckCircle2, 
  Settings as SettingsIcon, 
  PlusCircle, 
  Sparkles,
  Database,
  Radio,
  SlidersHorizontal,
  ChevronDown
} from 'lucide-react';
import { ActiveTab, AppSettings } from '../../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  activeTopic: string;
  onOpenSettings: () => void;
  onOpenIngest: () => void;
  settings: AppSettings;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeTopic,
  onOpenSettings,
  onOpenIngest,
  settings,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const navTabs = [
    { id: 'graph' as ActiveTab, label: 'Knowledge Graph', icon: Network, badge: null },
    { id: 'explanations' as ActiveTab, label: 'Deep Learning', icon: BookOpen, badge: 'Multi-Level' },
    { id: 'lab' as ActiveTab, label: 'Visual Lab', icon: Atom, badge: 'Interactive' },
    { id: 'tutor' as ActiveTab, label: 'AI Tutor', icon: Bot, badge: settings.isBotpressConfigured ? 'Botpress' : 'Socratic' },
    { id: 'audio' as ActiveTab, label: 'Audio Learning', icon: Headphones, badge: 'Deep Dive' },
    { id: 'quizzes' as ActiveTab, label: 'Quizzes', icon: CheckCircle2, badge: null },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 bg-navy-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Brand & Topic Info */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
              title="Toggle Sources"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-electric-cyan shadow-glow-purple">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-cyan opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-electric-cyan"></span>
                </span>
              </div>
              
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-extrabold tracking-wider text-white font-mono">
                    CONN<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-electric-cyan">EX</span>
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono border border-purple-500/30">
                    STUDIO OS
                  </span>
                </div>
                <p className="text-xs text-slate-400 flex items-center space-x-1 truncate max-w-[200px] sm:max-w-xs">
                  <span>Topic:</span>
                  <span className="text-slate-200 font-medium truncate">{activeTopic}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Center: Interactive Studio Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-navy-900/60 p-1.5 rounded-xl border border-white/5">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-white bg-gradient-to-r from-purple-600/90 to-indigo-600/90 shadow-glow-purple border border-purple-400/40'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-electric-cyan' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive 
                        ? 'bg-purple-900/80 text-purple-200 border border-purple-400/30' 
                        : 'bg-white/5 text-slate-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: Actions & Integration Badges */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Live Integration Badges */}
            <div className="hidden xl:flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-navy-900/60 border border-white/5 text-[11px] font-mono">
              <span 
                onClick={onOpenSettings}
                className="cursor-pointer flex items-center space-x-1 text-slate-400 hover:text-slate-200"
                title="Supabase Backend Status"
              >
                <Database className={`w-3 h-3 ${settings.isSupabaseConfigured ? 'text-emerald-400' : 'text-slate-500'}`} />
                <span>{settings.isSupabaseConfigured ? 'Supabase' : 'Local'}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span 
                onClick={onOpenSettings}
                className="cursor-pointer flex items-center space-x-1 text-slate-400 hover:text-slate-200"
                title="Botpress AI Tutor Status"
              >
                <Bot className={`w-3 h-3 ${settings.isBotpressConfigured ? 'text-purple-400' : 'text-slate-500'}`} />
                <span>{settings.isBotpressConfigured ? 'Botpress' : 'Local AI'}</span>
              </span>
              <span className="text-slate-600">•</span>
              <span 
                onClick={onOpenSettings}
                className="cursor-pointer flex items-center space-x-1 text-slate-400 hover:text-slate-200"
                title="ElevenLabs Audio Engine Status"
              >
                <Radio className={`w-3 h-3 ${settings.isElevenLabsConfigured ? 'text-electric-cyan' : 'text-slate-500'}`} />
                <span>{settings.isElevenLabsConfigured ? 'ElevenLabs' : 'WebAudio'}</span>
              </span>
            </div>

            {/* Ingest / Add Material Button */}
            <button
              onClick={onOpenIngest}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-glow-purple border border-purple-400/30 transition transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4 text-electric-cyan" />
              <span className="hidden sm:inline">Add Material</span>
              <span className="sm:hidden">Add</span>
            </button>

            {/* Settings Trigger */}
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 border border-white/5 transition"
              title="Platform Settings & API Configurations"
            >
              <SettingsIcon className="w-4 h-4 text-slate-300 hover:text-purple-400 transition" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden overflow-x-auto py-2 space-x-2 border-t border-white/5 no-scrollbar">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs whitespace-nowrap transition ${
                  isActive
                    ? 'text-white bg-purple-600/80 border border-purple-400/30'
                    : 'text-slate-400 hover:text-slate-200 bg-white/5'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
