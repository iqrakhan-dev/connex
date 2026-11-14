export type SourceType = 'pdf' | 'url' | 'topic';

export interface Source {
  id: string;
  type: SourceType;
  title: string;
  snippet: string;
  content: string;
  tokenCount: number;
  url?: string;
  fileName?: string;
  fileSize?: string;
  isActive: boolean;
  createdAt: string;
  tags?: string[];
}

export type NodeCategory = 'core' | 'architecture' | 'mechanism' | 'application' | 'foundation';

export interface KnowledgeNode {
  id: string;
  label: string;
  category: NodeCategory;
  summary: string;
  details: string;
  citations: string[];
  x: number;
  y: number;
  vx?: number;
  vy?: number;
  radius?: number;
}

export interface KnowledgeLink {
  source: string;
  target: string;
  relation: string;
  strength?: number;
}

export interface KnowledgeGraphData {
  nodes: KnowledgeNode[];
  links: KnowledgeLink[];
}

export interface TechnicalSection {
  title: string;
  content: string;
  keyPoints?: string[];
  codeBlock?: string;
}

export interface MathFormulation {
  title: string;
  equation: string;
  plainEnglish: string;
  variables: { symbol: string; description: string }[];
}

export interface DeepExplanation {
  topic: string;
  overview: string;
  eli5: string;
  executiveSummary: string[];
  technicalBreakdown: TechnicalSection[];
  mathematicalFoundations: MathFormulation[];
  analogies: { headline: string; story: string }[];
  keyTakeaways: string[];
}

export interface DialogueSegment {
  id: string;
  speaker: 'Alex' | 'Taylor';
  speakerRole: string;
  timeSec: number;
  durationSec: number;
  text: string;
}

export interface AudioOverview {
  title: string;
  topic: string;
  duration: number; // total duration in seconds
  episodesCount: number;
  segments: DialogueSegment[];
}

export interface QuizQuestion {
  id: string;
  type: 'mcq' | 'flashcard' | 'recall';
  question: string;
  options?: string[];
  correctAnswer?: number;
  userAnswer?: number;
  front?: string;
  back?: string;
  explanation: string;
  sourceRef: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

export interface SimulationState {
  type: 'transformer' | 'neural-network' | 'bloch-sphere';
  name: string;
  description: string;
}

export interface AppSettings {
  supabaseUrl: string;
  supabaseAnonKey: string;
  isSupabaseConfigured: boolean;
  botpressBotId: string;
  botpressClientId: string;
  isBotpressConfigured: boolean;
  elevenLabsApiKey: string;
  elevenLabsVoiceHost: string;
  elevenLabsVoiceGuest: string;
  isElevenLabsConfigured: boolean;
}

export type ActiveTab = 'graph' | 'explanations' | 'lab' | 'tutor' | 'audio' | 'quizzes';
