import React, { useState } from 'react';
import { 
  BookOpen, 
  Baby, 
  Briefcase, 
  Cpu, 
  Calculator, 
  Lightbulb, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  Sparkles, 
  ChevronRight,
  ArrowRight,
  Bookmark
} from 'lucide-react';
import { DeepExplanation } from '../../types';
import { speakWithWebSpeech, stopWebSpeech } from '../../services/elevenlabs';

interface DeepExplanationViewProps {
  explanation: DeepExplanation;
}

export const DeepExplanationView: React.FC<DeepExplanationViewProps> = ({ explanation }) => {
  const [activeTier, setActiveTier] = useState<'eli5' | 'executive' | 'technical' | 'math' | 'analogies'>('eli5');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      stopWebSpeech();
      setIsSpeaking(false);
    } else {
      let textToSpeak = '';
      if (activeTier === 'eli5') textToSpeak = explanation.eli5;
      else if (activeTier === 'executive') textToSpeak = explanation.executiveSummary.join('. ');
      else if (activeTier === 'technical') textToSpeak = explanation.technicalBreakdown.map(t => `${t.title}. ${t.content}`).join('. ');
      else if (activeTier === 'math') textToSpeak = explanation.mathematicalFoundations.map(m => `${m.title}. ${m.plainEnglish}`).join('. ');
      else textToSpeak = explanation.analogies.map(a => `${a.headline}. ${a.story}`).join('. ');

      setIsSpeaking(true);
      speakWithWebSpeech(textToSpeak, 'Alex', () => setIsSpeaking(false));
    }
  };

  const handleCopy = () => {
    let contentToCopy = `${explanation.topic}\n\n${explanation.overview}\n\n`;
    if (activeTier === 'eli5') contentToCopy += `[ELI5 Explanation]\n${explanation.eli5}`;
    else if (activeTier === 'executive') contentToCopy += `[Executive Summary]\n${explanation.executiveSummary.join('\n')}`;
    else if (activeTier === 'technical') contentToCopy += `[Technical Breakdown]\n${explanation.technicalBreakdown.map(t => `${t.title}\n${t.content}`).join('\n\n')}`;
    else if (activeTier === 'math') contentToCopy += `[Mathematical Formulations]\n${explanation.mathematicalFoundations.map(m => `${m.title}\n${m.equation}\n${m.plainEnglish}`).join('\n\n')}`;
    else contentToCopy += `[Conceptual Analogies]\n${explanation.analogies.map(a => `${a.headline}\n${a.story}`).join('\n\n')}`;

    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tiers = [
    { id: 'eli5', label: 'ELI5 Intuition', icon: Baby, description: 'Metaphorical, everyday language' },
    { id: 'executive', label: 'Executive Summary', icon: Briefcase, description: 'High-level synthesis & impacts' },
    { id: 'technical', label: 'Technical Deep-Dive', icon: Cpu, description: 'Architecture, steps & code' },
    { id: 'math', label: 'Mathematical Formulations', icon: Calculator, description: 'Equations, proofs & bounds' },
    { id: 'analogies', label: 'Deep Analogies', icon: Lightbulb, description: 'Mental models & paradigms' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Header Banner */}
      <div className="glass-panel-elevated p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        <div className="orb-purple w-72 h-72 -top-20 -right-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Cognitive Multi-Tier Analysis
              </span>
              <span className="text-xs text-slate-400 font-mono">Grounded Source Synthesis</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              {explanation.topic}
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              {explanation.overview}
            </p>
          </div>

          {/* Quick Action Tools */}
          <div className="flex items-center space-x-2 self-start md:self-center">
            <button
              onClick={handleToggleSpeech}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition border ${
                isSpeaking
                  ? 'bg-electric-cyan text-navy-950 border-electric-cyan animate-pulse'
                  : 'bg-navy-900/80 hover:bg-navy-800 text-slate-200 border-white/10'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-purple-400" />}
              <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-navy-900/80 hover:bg-navy-800 text-slate-200 border border-white/10 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cognitive Tier Switcher Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          const isActive = activeTier === tier.id;
          return (
            <button
              key={tier.id}
              onClick={() => {
                setActiveTier(tier.id as any);
                if (isSpeaking) {
                  stopWebSpeech();
                  setIsSpeaking(false);
                }
              }}
              className={`p-3 rounded-xl border text-left transition-all duration-200 relative overflow-hidden group ${
                isActive
                  ? 'bg-gradient-to-br from-purple-900/80 to-navy-900 border-purple-400/60 shadow-glow-purple'
                  : 'glass-card hover:border-white/20'
              }`}
            >
              <div className="flex items-center space-x-2">
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-purple-600 text-white' : 'bg-white/5 text-slate-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-slate-300'}`}>
                  {tier.label}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-1">
                {tier.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* Active Tier Content Section */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
        
        {/* Tier 1: ELI5 */}
        {activeTier === 'eli5' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-semibold uppercase tracking-wider">
              <Baby className="w-4 h-4" />
              <span>Intuitive Mental Model (Explain Like I'm 5)</span>
            </div>

            <div className="prose prose-invert max-w-none text-slate-200 text-base leading-relaxed whitespace-pre-line bg-purple-950/20 p-6 rounded-2xl border border-purple-500/20">
              {explanation.eli5}
            </div>

            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <div className="glass-card p-4 rounded-xl border-l-4 border-l-purple-500">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Why this intuition works
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Human cognition relies on situational grounding. Instead of reading each token as isolated symbols, self-attention builds relational webs similar to how our visual cortex groups scenes.
                </p>
              </div>

              <div className="glass-card p-4 rounded-xl border-l-4 border-l-electric-cyan">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Key Takeaway
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Attention allows the computer to dynamically focus its cognitive spotlight on the most relevant parts of the sentence at any given millisecond.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tier 2: Executive Summary */}
        {activeTier === 'executive' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center space-x-2 text-indigo-400 font-mono text-xs font-semibold uppercase tracking-wider">
              <Briefcase className="w-4 h-4" />
              <span>Executive Briefing & Strategic Synthesis</span>
            </div>

            <div className="grid gap-3">
              {explanation.executiveSummary.map((item, idx) => (
                <div
                  key={idx}
                  className="glass-card p-4 rounded-xl flex items-start space-x-3 border-l-2 border-l-indigo-400"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold font-mono">
                    {idx + 1}
                  </span>
                  <p className="text-sm text-slate-200 font-medium leading-relaxed">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tier 3: Technical Deep-Dive */}
        {activeTier === 'technical' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-semibold uppercase tracking-wider">
              <Cpu className="w-4 h-4" />
              <span>Architectural Specifications & Algorithmic Mechanics</span>
            </div>

            <div className="space-y-6">
              {explanation.technicalBreakdown.map((sec, idx) => (
                <div key={idx} className="glass-card p-6 rounded-2xl space-y-4">
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <span className="text-electric-cyan">{sec.title}</span>
                  </h3>
                  
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {sec.content}
                  </p>

                  {sec.keyPoints && (
                    <div className="space-y-2 pt-2">
                      {sec.keyPoints.map((kp, kidx) => (
                        <div key={kidx} className="flex items-start space-x-2 text-xs text-slate-300">
                          <ArrowRight className="w-3.5 h-3.5 text-purple-400 flex-shrink-0 mt-0.5" />
                          <span>{kp}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {sec.codeBlock && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-white/10 bg-navy-950 font-mono text-xs">
                      <div className="bg-navy-900/90 px-4 py-2 border-b border-white/10 flex items-center justify-between text-slate-400">
                        <span>Implementation Specification</span>
                        <span>Python / PyTorch</span>
                      </div>
                      <pre className="p-4 text-emerald-300 overflow-x-auto leading-relaxed">
                        {sec.codeBlock}
                      </pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tier 4: Mathematical Formulations */}
        {activeTier === 'math' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex items-center space-x-2 text-emerald-400 font-mono text-xs font-semibold uppercase tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>Rigorous Mathematical Formulations & Proofs</span>
            </div>

            <div className="space-y-6">
              {explanation.mathematicalFoundations.map((math, idx) => (
                <div key={idx} className="glass-card p-6 rounded-2xl space-y-4 border-l-4 border-l-emerald-500">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">
                      {math.title}
                    </h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Formal Equation
                    </span>
                  </div>

                  {/* Formula Box */}
                  <div className="p-5 rounded-xl bg-navy-950 border border-white/10 flex items-center justify-center font-mono text-base sm:text-lg text-emerald-300 shadow-inner overflow-x-auto">
                    <code>{math.equation}</code>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    <strong className="text-slate-100">Plain English Translation: </strong>
                    {math.plainEnglish}
                  </p>

                  {/* Variables Table */}
                  <div className="pt-2">
                    <span className="text-[11px] font-mono uppercase text-slate-400 block mb-2">
                      Symbol Definitions & Dimensionality:
                    </span>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {math.variables.map((v, vidx) => (
                        <div
                          key={vidx}
                          className="bg-navy-900/60 p-2.5 rounded-lg border border-white/5 flex items-start space-x-2 text-xs"
                        >
                          <code className="text-purple-300 font-bold font-mono flex-shrink-0">
                            {v.symbol}
                          </code>
                          <span className="text-slate-400">{v.description}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tier 5: Analogies */}
        {activeTier === 'analogies' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center space-x-2 text-amber-400 font-mono text-xs font-semibold uppercase tracking-wider">
              <Lightbulb className="w-4 h-4" />
              <span>Conceptual Metaphors & Intuition Builders</span>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {explanation.analogies.map((analogy, idx) => (
                <div key={idx} className="glass-card p-6 rounded-2xl space-y-3 border-t-2 border-t-amber-400">
                  <h3 className="text-base font-bold text-white flex items-center space-x-2">
                    <span className="text-amber-300">💡 {analogy.headline}</span>
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {analogy.story}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Universal Key Takeaways Footer */}
        <div className="pt-6 border-t border-white/10 mt-8">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono mb-3 flex items-center space-x-2">
            <Bookmark className="w-4 h-4 text-purple-400" />
            <span>Mastery Takeaways</span>
          </h4>
          <div className="grid sm:grid-cols-2 gap-2.5">
            {explanation.keyTakeaways.map((takeaway, i) => (
              <div
                key={i}
                className="bg-navy-900/60 p-3 rounded-xl border border-white/5 flex items-start space-x-2.5 text-xs text-slate-300"
              >
                <Check className="w-4 h-4 text-electric-cyan flex-shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
