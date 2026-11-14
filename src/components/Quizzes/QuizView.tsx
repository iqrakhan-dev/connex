import React, { useState } from 'react';
import { 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  RotateCcw, 
  ArrowRight, 
  Layers, 
  Award, 
  Check, 
  X, 
  BookOpen, 
  BrainCircuit,
  Eye,
  Trophy
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion } from '../../types';

interface QuizViewProps {
  questions: QuizQuestion[];
  topic: string;
}

export const QuizView: React.FC<QuizViewProps> = ({ questions, topic }) => {
  const [activeMode, setActiveMode] = useState<'mcq' | 'flashcards' | 'recall'>('mcq');

  // MCQ State
  const mcqQuestions = questions.filter(q => q.type === 'mcq');
  const [mcqAnswers, setMcqAnswers] = useState<{ [qId: string]: number }>({});
  const [mcqSubmitted, setMcqSubmitted] = useState<boolean>(false);

  // Flashcards State
  const flashcardQuestions = questions.filter(q => q.type === 'flashcard');
  const [flashcardIndex, setFlashcardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [masteredCards, setMasteredCards] = useState<string[]>([]);

  // Active Recall State
  const recallQuestions = questions.filter(q => q.type === 'recall');
  const [userRecallNotes, setUserRecallNotes] = useState<{ [qId: string]: string }>({});
  const [revealedAnswers, setRevealedAnswers] = useState<{ [qId: string]: boolean }>({});

  const handleSelectOption = (qId: string, optIdx: number) => {
    if (mcqSubmitted) return;
    setMcqAnswers(prev => ({ ...prev, [qId]: optIdx }));
  };

  const handleGradeQuiz = () => {
    setMcqSubmitted(true);
    // Calculate score
    let correct = 0;
    mcqQuestions.forEach(q => {
      if (mcqAnswers[q.id] === q.correctAnswer) {
        correct++;
      }
    });

    if (correct >= mcqQuestions.length * 0.7) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleResetQuiz = () => {
    setMcqAnswers({});
    setMcqSubmitted(false);
  };

  const currentFlashcard = flashcardQuestions[flashcardIndex];

  const handleRateFlashcard = (status: 'easy' | 'good' | 'hard') => {
    if (status === 'easy' && currentFlashcard && !masteredCards.includes(currentFlashcard.id)) {
      setMasteredCards(prev => [...prev, currentFlashcard.id]);
    }
    setIsFlipped(false);
    if (flashcardIndex < flashcardQuestions.length - 1) {
      setFlashcardIndex(prev => prev + 1);
    } else {
      setFlashcardIndex(0);
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  const totalAnswered = Object.keys(mcqAnswers).length;
  const correctCount = mcqQuestions.filter(q => mcqAnswers[q.id] === q.correctAnswer).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Quiz Banner */}
      <div className="glass-panel-elevated p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        <div className="orb-purple w-80 h-80 -bottom-20 -right-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Cognitive Retention Engine
              </span>
              <span className="text-xs text-slate-400 font-mono">Spaced Retrieval Practice</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Assess & Solidify: {topic}
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Verify your mental models through diagnostic questions, active recall flashcards, and conceptual self-evaluations.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1.5 p-1 bg-navy-950/80 rounded-xl border border-white/10 self-start md:self-center">
            <button
              onClick={() => setActiveMode('mcq')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                activeMode === 'mcq'
                  ? 'bg-purple-600 text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Diagnostic Quiz</span>
            </button>

            <button
              onClick={() => setActiveMode('flashcards')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                activeMode === 'flashcards'
                  ? 'bg-purple-600 text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Flashcards</span>
            </button>

            <button
              onClick={() => setActiveMode('recall')}
              className={`px-3 py-2 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
                activeMode === 'recall'
                  ? 'bg-purple-600 text-white shadow-glow-purple'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BrainCircuit className="w-3.5 h-3.5" />
              <span>Active Recall</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODE 1: Diagnostic Quiz (MCQ) */}
      {activeMode === 'mcq' && (
        <div className="space-y-6">
          {/* Progress / Score Bar */}
          <div className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono text-slate-400">
                Answered: <strong className="text-white">{totalAnswered}/{mcqQuestions.length}</strong>
              </span>
              {mcqSubmitted && (
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Score: {correctCount}/{mcqQuestions.length} ({Math.round((correctCount / mcqQuestions.length) * 100)}%)
                </span>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {!mcqSubmitted ? (
                <button
                  onClick={handleGradeQuiz}
                  disabled={totalAnswered === 0}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-electric-cyan text-white text-xs font-bold shadow-glow-purple border border-white/20 transition disabled:opacity-40"
                >
                  Grade Diagnostic Quiz
                </button>
              ) : (
                <button
                  onClick={handleResetQuiz}
                  className="px-3 py-1.5 rounded-xl bg-navy-900 text-slate-300 hover:text-white text-xs font-semibold border border-white/10 transition flex items-center space-x-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Quiz</span>
                </button>
              )}
            </div>
          </div>

          {/* Question Cards */}
          <div className="space-y-4">
            {mcqQuestions.map((q, idx) => {
              const selectedOpt = mcqAnswers[q.id];
              const isCorrect = mcqSubmitted && selectedOpt === q.correctAnswer;
              const isWrong = mcqSubmitted && selectedOpt !== undefined && selectedOpt !== q.correctAnswer;

              return (
                <div
                  key={q.id}
                  className={`glass-panel p-6 rounded-2xl border transition-all duration-200 ${
                    isCorrect
                      ? 'border-emerald-500/40 bg-emerald-950/20'
                      : isWrong
                      ? 'border-red-500/40 bg-red-950/20'
                      : 'border-white/10'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Question {idx + 1} • {q.difficulty}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500 truncate">
                      Source: {q.sourceRef}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white mb-4 leading-relaxed">
                    {q.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-2">
                    {q.options?.map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      const isOptionCorrect = mcqSubmitted && optIdx === q.correctAnswer;

                      return (
                        <button
                          key={optIdx}
                          disabled={mcqSubmitted}
                          onClick={() => handleSelectOption(q.id, optIdx)}
                          className={`w-full p-3.5 rounded-xl border text-left text-xs sm:text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                            isOptionCorrect
                              ? 'bg-emerald-900/60 border-emerald-400 text-emerald-100 shadow-sm'
                              : isOptionSelected && isWrong
                              ? 'bg-red-900/60 border-red-400 text-red-100'
                              : isOptionSelected
                              ? 'bg-purple-600/30 border-purple-400 text-purple-100 shadow-glow-purple'
                              : 'bg-navy-900/60 hover:bg-navy-800/80 border-white/5 text-slate-300'
                          }`}
                        >
                          <span>{opt}</span>
                          {isOptionCorrect && <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 ml-2" />}
                          {isOptionSelected && isWrong && <X className="w-4 h-4 text-red-400 flex-shrink-0 ml-2" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Rationale & Source link upon submission */}
                  {mcqSubmitted && (
                    <div className="mt-4 pt-4 border-t border-white/10 text-xs text-slate-300 space-y-1">
                      <strong className="text-electric-cyan block font-mono">
                        {isCorrect ? '✓ Correct Rationale:' : '✗ Correction & Mechanism:'}
                      </strong>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODE 2: Interactive 3D Flip Flashcards */}
      {activeMode === 'flashcards' && (
        <div className="space-y-6">
          <div className="glass-panel p-4 rounded-xl border border-white/10 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>
              Card <strong className="text-white">{flashcardIndex + 1}</strong> of {flashcardQuestions.length}
            </span>
            <span className="text-electric-cyan">
              Mastered: {masteredCards.length}
            </span>
          </div>

          {currentFlashcard && (
            <div className="max-w-xl mx-auto space-y-4">
              <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`min-h-[260px] p-8 rounded-2xl glass-panel-elevated border cursor-pointer select-none transition-all duration-300 flex flex-col justify-between text-center relative group ${
                  isFlipped
                    ? 'border-electric-cyan/60 bg-gradient-to-br from-navy-900 to-purple-950/60 shadow-glow-cyan'
                    : 'border-purple-400/30 hover:border-purple-400 shadow-glow-purple'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="uppercase text-purple-300">{isFlipped ? 'Answer & Mechanism' : 'Prompt Question'}</span>
                  <span>Click card to flip ↺</span>
                </div>

                <div className="my-auto py-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
                    {isFlipped ? currentFlashcard.back : currentFlashcard.front}
                  </h3>
                  {isFlipped && (
                    <p className="text-xs text-slate-300 mt-4 font-mono bg-navy-950/60 p-3 rounded-xl border border-white/5">
                      {currentFlashcard.explanation}
                    </p>
                  )}
                </div>

                <span className="text-[10px] text-slate-500 font-mono">
                  Difficulty: {currentFlashcard.difficulty} • Source: {currentFlashcard.sourceRef}
                </span>
              </div>

              {/* Leitner Rating Controls */}
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => handleRateFlashcard('hard')}
                  className="py-2.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 text-xs font-bold transition"
                >
                  Hard (Repeat)
                </button>

                <button
                  onClick={() => handleRateFlashcard('good')}
                  className="py-2.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/60 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition"
                >
                  Good
                </button>

                <button
                  onClick={() => handleRateFlashcard('easy')}
                  className="py-2.5 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 text-xs font-bold transition"
                >
                  Easy (Mastered)
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: Active Recall Challenge */}
      {activeMode === 'recall' && (
        <div className="space-y-6">
          <div className="glass-panel p-4 rounded-xl border border-white/10 text-xs text-slate-300">
            Active recall forces your brain to retrieve knowledge without multiple-choice cues, solidifying long-term synaptic connections.
          </div>

          <div className="space-y-4">
            {recallQuestions.map((q, idx) => {
              const isRevealed = revealedAnswers[q.id];

              return (
                <div key={q.id} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                      Challenge {idx + 1}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      Ref: {q.sourceRef}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white">
                    {q.question}
                  </h3>

                  <textarea
                    rows={3}
                    placeholder="Type your hypothesis or formula from memory..."
                    value={userRecallNotes[q.id] || ''}
                    onChange={(e) => setUserRecallNotes(prev => ({ ...prev, [q.id]: e.target.value }))}
                    className="w-full p-3 rounded-xl bg-navy-950 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono transition"
                  />

                  <div className="flex items-center justify-between pt-2">
                    <button
                      onClick={() => setRevealedAnswers(prev => ({ ...prev, [q.id]: !prev[q.id] }))}
                      className="text-xs px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-electric-cyan border border-white/10 font-mono transition flex items-center space-x-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isRevealed ? 'Hide Benchmark Answer' : 'Show Benchmark Answer'}</span>
                    </button>
                  </div>

                  {isRevealed && (
                    <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 text-xs text-slate-200 animate-in fade-in duration-200">
                      <strong className="text-purple-300 block font-mono mb-1">
                        Ideal Benchmark Formulation:
                      </strong>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
