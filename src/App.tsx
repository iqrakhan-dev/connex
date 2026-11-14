import React, { useState, useEffect } from 'react';
import { 
  Source, 
  ActiveTab, 
  AppSettings, 
  KnowledgeGraphData, 
  DeepExplanation, 
  AudioOverview, 
  QuizQuestion 
} from './types';
import { 
  INITIAL_SOURCES, 
  INITIAL_KNOWLEDGE_GRAPH, 
  INITIAL_EXPLANATION, 
  INITIAL_AUDIO_OVERVIEW, 
  INITIAL_QUIZ,
  synthesizeNotebookFromTopic 
} from './data/mockData';
import { Navbar } from './components/Header/Navbar';
import { SourceSidebar } from './components/Sidebar/SourceSidebar';
import { KnowledgeGraphView } from './components/KnowledgeGraph/KnowledgeGraphView';
import { DeepExplanationView } from './components/Explanations/DeepExplanationView';
import { VisualLabView } from './components/VisualLab/VisualLabView';
import { AITutorView } from './components/Tutor/AITutorView';
import { AudioLearningView } from './components/Audio/AudioLearningView';
import { QuizView } from './components/Quizzes/QuizView';
import { SettingsModal } from './components/Modals/SettingsModal';
import { SourceModal } from './components/Modals/SourceModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('graph');
  const [activeTopic, setActiveTopic] = useState<string>('Transformer & Self-Attention');
  const [sources, setSources] = useState<Source[]>(INITIAL_SOURCES);
  const [graphData, setGraphData] = useState<KnowledgeGraphData>(INITIAL_KNOWLEDGE_GRAPH);
  const [explanation, setExplanation] = useState<DeepExplanation>(INITIAL_EXPLANATION);
  const [audioOverview, setAudioOverview] = useState<AudioOverview>(INITIAL_AUDIO_OVERVIEW);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(INITIAL_QUIZ);

  // UI state
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState<boolean>(false);
  const [viewingSource, setViewingSource] = useState<Source | null>(null);
  const [tutorPrefill, setTutorPrefill] = useState<string | undefined>(undefined);

  // Settings State with LocalStorage Persistence
  const [settings, setSettings] = useState<AppSettings>(() => {
    const supabaseUrl = localStorage.getItem('connex_supabase_url') || '';
    const supabaseAnonKey = localStorage.getItem('connex_supabase_key') || '';
    const botpressBotId = localStorage.getItem('connex_botpress_bot_id') || '';
    const botpressClientId = localStorage.getItem('connex_botpress_client_id') || '';
    const elevenLabsApiKey = localStorage.getItem('connex_elevenlabs_key') || '';
    const elevenLabsVoiceHost = localStorage.getItem('connex_elevenlabs_host_voice') || '21m00Tcm4TlvDq8ikWAM';
    const elevenLabsVoiceGuest = localStorage.getItem('connex_elevenlabs_guest_voice') || 'AZnzlk1XvdvUeBnXmlld';

    return {
      supabaseUrl,
      supabaseAnonKey,
      isSupabaseConfigured: Boolean(supabaseUrl && supabaseAnonKey),
      botpressBotId,
      botpressClientId,
      isBotpressConfigured: Boolean(botpressBotId),
      elevenLabsApiKey,
      elevenLabsVoiceHost,
      elevenLabsVoiceGuest,
      isElevenLabsConfigured: Boolean(elevenLabsApiKey),
    };
  });

  // Source Actions
  const handleToggleSource = (id: string) => {
    setSources(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));
  };

  const handleDeleteSource = (id: string) => {
    setSources(prev => prev.filter(s => s.id !== id));
  };

  const handleAddSource = (newSourceData: Omit<Source, 'id' | 'createdAt'>) => {
    const synthesized = synthesizeNotebookFromTopic(newSourceData.title);
    const newSource: Source = {
      ...newSourceData,
      id: `src-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setSources(prev => [newSource, ...prev]);
    setActiveTopic(newSource.title);
    setGraphData(synthesized.graph);
    setExplanation(synthesized.explanation);
    setAudioOverview(synthesized.audio);
    setQuizQuestions(synthesized.quiz);
  };

  const handleSelectTopicPreset = (presetTopic: string) => {
    if (presetTopic === 'Transformer & Self-Attention') {
      setActiveTopic('Transformer & Self-Attention');
      setGraphData(INITIAL_KNOWLEDGE_GRAPH);
      setExplanation(INITIAL_EXPLANATION);
      setAudioOverview(INITIAL_AUDIO_OVERVIEW);
      setQuizQuestions(INITIAL_QUIZ);
    } else {
      const synthesized = synthesizeNotebookFromTopic(presetTopic);
      setActiveTopic(presetTopic);
      setSources(prev => [synthesized.source, ...prev.filter(s => s.id !== synthesized.source.id)]);
      setGraphData(synthesized.graph);
      setExplanation(synthesized.explanation);
      setAudioOverview(synthesized.audio);
      setQuizQuestions(synthesized.quiz);
    }
  };

  const handleSelectConceptForTutor = (concept: string) => {
    setTutorPrefill(`Explain the mechanism of "${concept}" in detail.`);
    setActiveTab('tutor');
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600/30 selection:text-electric-cyan">
      
      {/* Top Universal Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeTopic={activeTopic}
        onOpenSettings={() => setSettingsModalOpen(true)}
        onOpenIngest={() => setSidebarOpen(true)}
        settings={settings}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Multimodal Source Management Sidebar */}
        <SourceSidebar
          sources={sources}
          onToggleSource={handleToggleSource}
          onDeleteSource={handleDeleteSource}
          onAddSource={handleAddSource}
          onSelectTopicPreset={handleSelectTopicPreset}
          onViewSource={(source) => setViewingSource(source)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Studio Content Work Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          
          {activeTab === 'graph' && (
            <KnowledgeGraphView
              data={graphData}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onSelectConceptForTutor={handleSelectConceptForTutor}
            />
          )}

          {activeTab === 'explanations' && (
            <DeepExplanationView
              explanation={explanation}
            />
          )}

          {activeTab === 'lab' && (
            <VisualLabView />
          )}

          {activeTab === 'tutor' && (
            <AITutorView
              settings={settings}
              onOpenSettings={() => setSettingsModalOpen(true)}
              activeTopic={activeTopic}
              sources={sources}
              prefilledPrompt={tutorPrefill}
            />
          )}

          {activeTab === 'audio' && (
            <AudioLearningView
              overview={audioOverview}
              settings={settings}
              onOpenSettings={() => setSettingsModalOpen(true)}
            />
          )}

          {activeTab === 'quizzes' && (
            <QuizView
              questions={quizQuestions}
              topic={activeTopic}
            />
          )}
        </main>
      </div>

      {/* Settings & Configuration Modal */}
      <SettingsModal
        isOpen={settingsModalOpen}
        onClose={() => setSettingsModalOpen(false)}
        settings={settings}
        onSaveSettings={(newSettings) => setSettings(newSettings)}
      />

      {/* Document Inspector Modal */}
      <SourceModal
        source={viewingSource}
        onClose={() => setViewingSource(null)}
      />
    </div>
  );
};
