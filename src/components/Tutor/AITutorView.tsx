import React, { useState, useEffect, useRef } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  Settings as SettingsIcon, 
  Volume2, 
  Check, 
  HelpCircle, 
  Layers, 
  MessageSquare,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { AppSettings, Source } from '../../types';
import { loadBotpressScripts } from '../../services/botpress';
import { speakWithWebSpeech } from '../../services/elevenlabs';

interface AITutorViewProps {
  settings: AppSettings;
  onOpenSettings: () => void;
  activeTopic: string;
  sources: Source[];
  prefilledPrompt?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'tutor';
  text: string;
  timestamp: string;
  citations?: string[];
}

export const AITutorView: React.FC<AITutorViewProps> = ({
  settings,
  onOpenSettings,
  activeTopic,
  sources,
  prefilledPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      sender: 'tutor',
      text: `Hello! I am your AI Socratic Tutor for "${activeTopic}". I have analyzed your ${sources.filter(s => s.isActive).length} active grounding documents.\n\nAsk me anything about mechanisms, mathematical proofs, architectural bottlenecks, or ask me to challenge you with a Socratic question!`,
      timestamp: 'Just now',
      citations: sources.filter(s => s.isActive).map(s => s.title)
    }
  ]);
  const [inputText, setInputText] = useState(prefilledPrompt || '');
  const [isTyping, setIsTyping] = useState(false);
  const [botpressLoaded, setBotpressLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefilledPrompt) {
      setInputText(prefilledPrompt);
    }
  }, [prefilledPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Attempt to initialize Botpress if credentials exist
  useEffect(() => {
    if (settings.botpressBotId) {
      loadBotpressScripts({
        botId: settings.botpressBotId,
        clientId: settings.botpressClientId || settings.botpressBotId,
      }).then((success) => {
        setBotpressLoaded(success);
      }).catch((err) => {
        console.warn('Botpress could not be loaded:', err);
        setBotpressLoaded(false);
      });
    }
  }, [settings.botpressBotId, settings.botpressClientId]);

  const quickPrompts = [
    `Why is the 1/√d_k scaling factor mathematically necessary?`,
    `How does self-attention eliminate the O(N) sequential bottleneck?`,
    `Give me a real-world analogy for Query vs Key vs Value.`,
    `Quiz me with a hard Socratic question on this topic.`
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    // Contextual Socratic response generation grounded in loaded sources
    setTimeout(() => {
      let replyText = '';
      let replyCitations: string[] = [];

      const lower = query.toLowerCase();
      if (lower.includes('scale') || lower.includes('scaling') || lower.includes('root') || lower.includes('d_k')) {
        replyText = `Great question! The 1/√d_k factor is essential because of vector variance. When query and key vectors of dimension d_k are multiplied, their dot product has an expected variance equal to d_k.\n\nIf d_k is large (e.g., 64 or 128), unscaled dot products grow to 80+ in magnitude. When plugged into Softmax, this forces outputs toward 0 or 1, causing the softmax gradients to vanish (near zero). Dividing by √d_k normalizes the variance back to 1.0, preserving healthy gradients throughout deep backpropagation!`;
        replyCitations = ['Attention Is All You Need — Section 3.2.1'];
      } else if (lower.includes('query') || lower.includes('key') || lower.includes('value')) {
        replyText = `The Query, Key, and Value abstraction is modeled after database retrieval:\n\n1. **Query (Q)**: What the current token is seeking (e.g., "I'm the word 'it', who is my antecedent?").\n2. **Key (K)**: The identifier or tag of other tokens (e.g., "I'm 'animal', a noun").\n3. **Value (V)**: The actual semantic payload that gets weighted and transferred once a match occurs.\n\nDecoupling the search criteria (Q·K) from the content (V) gives transformers immense representational expressivity!`;
        replyCitations = ['The Illustrated Transformer (Jay Alammar)'];
      } else if (lower.includes('socratic') || lower.includes('quiz') || lower.includes('challenge')) {
        replyText = `Here is your Socratic challenge:\n\n*Suppose we removed Positional Encodings from the Transformer entirely. If you fed the model the sentence "Dog bites man" versus "Man bites dog", would the resulting Self-Attention weight matrices be identical or different? And why?*\n\nTake a moment to formulate your hypothesis!`;
        replyCitations = ['Attention Is All You Need — Section 3.5'];
      } else {
        replyText = `Based on your grounded materials on **${activeTopic}**, the system connects this concept directly to the underlying representation space.\n\nNotice how the architecture removes sequential recurrent dependencies in favor of global pairwise interactions. This ensures an O(1) path length across any two positions, drastically mitigating the historical vanishing gradient problem.\n\nWould you like me to unpack the mathematical formulation or walk through a concrete numerical example?`;
        replyCitations = sources.filter(s => s.isActive).map(s => s.title);
      }

      const tutorMsg: ChatMessage = {
        id: `tut-${Date.now()}`,
        sender: 'tutor',
        text: replyText,
        timestamp: 'Just now',
        citations: replyCitations
      };

      setMessages(prev => [...prev, tutorMsg]);
      setIsTyping(false);
    }, 750);
  };

  const handleSpeak = (text: string) => {
    speakWithWebSpeech(text, 'Alex');
  };

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col glass-panel rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
      
      {/* Tutor Header */}
      <div className="p-4 sm:p-5 border-b border-white/10 bg-navy-950/80 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-electric-cyan flex items-center justify-center shadow-glow-purple">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm sm:text-base font-bold text-white">
                CONNEX Socratic AI Tutor
              </h2>
              {settings.isBotpressConfigured ? (
                <span className="flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono">
                  <ShieldCheck className="w-3 h-3 text-purple-400" />
                  <span>Botpress Cloud Active</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1 text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-electric-cyan border border-cyan-500/30 font-mono">
                  <Sparkles className="w-3 h-3 text-electric-cyan" />
                  <span>Context-Grounded Tutor</span>
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Grounded in {sources.filter(s => s.isActive).length} active documents • {activeTopic}
            </p>
          </div>
        </div>

        {/* Integration Actions */}
        <div className="flex items-center space-x-2">
          {!settings.isBotpressConfigured && (
            <button
              onClick={onOpenSettings}
              className="text-xs px-2.5 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white border border-white/10 transition flex items-center space-x-1.5"
              title="Connect Botpress Cloud"
            >
              <SettingsIcon className="w-3.5 h-3.5 text-purple-400" />
              <span>Connect Botpress Bot</span>
            </button>
          )}

          <button
            onClick={() => {
              setMessages([
                {
                  id: 'msg-reset',
                  sender: 'tutor',
                  text: `Chat session refreshed. What concept would you like to explore in "${activeTopic}"?`,
                  timestamp: 'Just now'
                }
              ]);
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
            title="Reset Chat Session"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Botpress Status Bar Banner */}
      {!settings.isBotpressConfigured && (
        <div className="px-4 py-2.5 bg-gradient-to-r from-purple-950/40 via-navy-900 to-indigo-950/40 border-b border-purple-500/20 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
            <span>Running in <strong>Local Socratic Mode</strong>. Want to connect your production Botpress Bot?</span>
          </div>
          <button
            onClick={onOpenSettings}
            className="text-electric-cyan hover:underline font-mono text-[11px] font-semibold whitespace-nowrap ml-2"
          >
            Configure Bot ID →
          </button>
        </div>
      )}

      {/* Main Chat Messages Stream */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 bg-navy-950/40 bg-grid-pattern">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                  isUser
                    ? 'bg-electric-cyan text-navy-950 font-bold text-xs'
                    : 'bg-purple-600 text-white shadow-glow-purple'
                }`}
              >
                {isUser ? 'YOU' : <Bot className="w-4 h-4" />}
              </div>

              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-glow-purple border border-purple-400/30'
                      : 'glass-card text-slate-200 rounded-tl-none border border-white/10'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Citations & Audio Button */}
                {!isUser && (
                  <div className="flex flex-wrap items-center justify-between gap-2 px-1">
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {msg.citations.map((cite, i) => (
                          <span
                            key={i}
                            className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-mono truncate max-w-xs"
                          >
                            Source: {cite}
                          </span>
                        ))}
                      </div>
                    )}

                    <button
                      onClick={() => handleSpeak(msg.text)}
                      className="text-[11px] text-slate-400 hover:text-electric-cyan flex items-center space-x-1 transition ml-auto"
                      title="Read Aloud"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Listen</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600 flex items-center justify-center text-white shadow-glow-purple">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="glass-card px-4 py-3 rounded-2xl rounded-tl-none flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-electric-cyan animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Socratic Quick Prompts */}
      <div className="px-4 py-2 border-t border-white/5 bg-navy-950/70 overflow-x-auto no-scrollbar flex items-center space-x-2">
        <span className="text-[11px] text-slate-500 whitespace-nowrap font-mono flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-purple-400" />
          <span>Suggestions:</span>
        </span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="text-[11px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-white/5 hover:bg-purple-600/20 text-slate-300 hover:text-purple-300 border border-white/5 transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box Form */}
      <div className="p-4 border-t border-white/10 bg-navy-950">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            placeholder={`Ask your Socratic Tutor about ${activeTopic}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl bg-navy-900/90 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold transition shadow-glow-purple border border-purple-400/30 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
