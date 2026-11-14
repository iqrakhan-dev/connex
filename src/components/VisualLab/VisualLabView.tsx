import React, { useState } from 'react';
import { 
  Atom, 
  Cpu, 
  Play, 
  RotateCcw, 
  Sliders, 
  Sparkles, 
  HelpCircle,
  Zap,
  Activity,
  Layers,
  Check
} from 'lucide-react';

export const VisualLabView: React.FC = () => {
  const [activeSimulation, setActiveSimulation] = useState<'attention' | 'neural' | 'quantum'>('attention');

  // Simulation 1: Transformer Self-Attention State
  const sentenceTokens = ['The', 'animal', "didn't", 'cross', 'the', 'street', 'because', 'it', 'was', 'too', 'tired'];
  const [selectedTokenIdx, setSelectedTokenIdx] = useState<number>(7); // 'it'
  const [dimensionDk, setDimensionDk] = useState<number>(64);
  const [useScalingFactor, setUseScalingFactor] = useState<boolean>(true);
  const [temperature, setTemperature] = useState<number>(1.0);

  // Raw unscaled dot-product heuristics based on linguistic context
  const getRawScore = (sourceIdx: number, targetIdx: number) => {
    const s = sentenceTokens[sourceIdx];
    const t = sentenceTokens[targetIdx];

    if (s === 'it') {
      if (t === 'animal') return 8.2;
      if (t === 'tired') return 6.8;
      if (t === 'street') return 1.4;
      if (t === 'cross') return 2.1;
      if (t === 'it') return 4.0;
      return 0.5;
    }
    if (s === 'animal') {
      if (t === 'tired') return 5.5;
      if (t === 'cross') return 4.2;
      if (t === 'animal') return 7.0;
      return 1.0;
    }
    if (sourceIdx === targetIdx) return 6.0;
    return Math.max(0.2, 5.0 - Math.abs(sourceIdx - targetIdx) * 0.8);
  };

  // Compute scaled dot-product and softmax
  const rawScores = sentenceTokens.map((_, idx) => getRawScore(selectedTokenIdx, idx));
  const scale = useScalingFactor ? Math.sqrt(dimensionDk) : 1.0;
  const scaledScores = rawScores.map(score => (score * (Math.sqrt(dimensionDk) / 4)) / (scale * temperature));
  
  // Softmax computation
  const maxScaled = Math.max(...scaledScores);
  const expScores = scaledScores.map(s => Math.exp(s - maxScaled));
  const sumExp = expScores.reduce((a, b) => a + b, 0);
  const attentionWeights = expScores.map(e => e / sumExp);

  // Simulation 2: Neural Forward Pass State
  const [inputX1, setInputX1] = useState<number>(1.5);
  const [inputX2, setInputX2] = useState<number>(-0.8);
  const [weightMultiplier, setWeightMultiplier] = useState<number>(1.2);
  const [bias, setBias] = useState<number>(0.2);
  const [activationFn, setActivationFn] = useState<'relu' | 'sigmoid' | 'tanh' | 'gelu'>('relu');

  const applyActivation = (val: number) => {
    switch (activationFn) {
      case 'relu': return Math.max(0, val);
      case 'sigmoid': return 1 / (1 + Math.exp(-val));
      case 'tanh': return Math.tanh(val);
      case 'gelu': return 0.5 * val * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (val + 0.044715 * Math.pow(val, 3))));
      default: return val;
    }
  };

  const hiddenZ = [
    inputX1 * 0.8 * weightMultiplier + inputX2 * -0.5 * weightMultiplier + bias,
    inputX1 * -1.2 * weightMultiplier + inputX2 * 1.4 * weightMultiplier + bias,
    inputX1 * 0.6 * weightMultiplier + inputX2 * 0.9 * weightMultiplier + bias,
  ];
  const hiddenA = hiddenZ.map(applyActivation);
  const outputZ = hiddenA[0] * 1.1 + hiddenA[1] * -0.9 + hiddenA[2] * 1.3 + bias;
  const outputA = applyActivation(outputZ);

  // Simulation 3: Quantum Bloch Sphere State
  const [theta, setTheta] = useState<number>(Math.PI / 3); // Polar angle
  const [phi, setPhi] = useState<number>(Math.PI / 4); // Azimuthal angle
  const [measurementResult, setMeasurementResult] = useState<string | null>(null);

  const prob0 = Math.pow(Math.cos(theta / 2), 2);
  const prob1 = Math.pow(Math.sin(theta / 2), 2);

  const handleMeasureQubit = () => {
    const rand = Math.random();
    const result = rand < prob0 ? '|0⟩ State' : '|1⟩ State';
    setMeasurementResult(result);
  };

  const applyHadamard = () => {
    setTheta(Math.PI / 2);
    setPhi(0);
    setMeasurementResult(null);
  };

  const applyPauliX = () => {
    setTheta(prev => Math.PI - prev);
    setMeasurementResult(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Visual Lab Navigation Banner */}
      <div className="glass-panel-elevated p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        <div className="orb-cyan w-80 h-80 -top-20 -right-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-electric-cyan border border-cyan-500/30">
                Visual Interactive Lab
              </span>
              <span className="text-xs text-slate-400 font-mono">Dynamic Parametric Sandboxes</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              Simulate & Manipulate Cognitive Systems
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Explore mathematical behaviors through real-time interactive parameters, attention weights, vector projections, and state collapses.
            </p>
          </div>

          {/* Module Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveSimulation('attention')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition border ${
                activeSimulation === 'attention'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/40 shadow-glow-purple'
                  : 'bg-navy-900/80 text-slate-400 hover:text-white border-white/5'
              }`}
            >
              <Cpu className="w-4 h-4" />
              <span>Self-Attention Matrix</span>
            </button>

            <button
              onClick={() => setActiveSimulation('neural')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition border ${
                activeSimulation === 'neural'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/40 shadow-glow-purple'
                  : 'bg-navy-900/80 text-slate-400 hover:text-white border-white/5'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Neural Forward Pass</span>
            </button>

            <button
              onClick={() => setActiveSimulation('quantum')}
              className={`flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition border ${
                activeSimulation === 'quantum'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400/40 shadow-glow-purple'
                  : 'bg-navy-900/80 text-slate-400 hover:text-white border-white/5'
              }`}
            >
              <Atom className="w-4 h-4" />
              <span>Bloch Sphere Qubit</span>
            </button>
          </div>
        </div>
      </div>

      {/* SIMULATION 1: Transformer Self-Attention Matrix */}
      {activeSimulation === 'attention' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span className="text-electric-cyan">Multi-Head Scaled Dot-Product Attention Simulator</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Click any token to see which other tokens it attends to. Observe how dividing by √d_k prevents vanishing gradients.
              </p>
            </div>
            <div className="flex items-center space-x-2 font-mono text-xs">
              <span className="text-slate-400">Target Token:</span>
              <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">
                "{sentenceTokens[selectedTokenIdx]}"
              </span>
            </div>
          </div>

          {/* Interactive Token Sentence Bar */}
          <div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
              Select Query Token:
            </span>
            <div className="flex flex-wrap gap-2">
              {sentenceTokens.map((token, idx) => {
                const isSelected = selectedTokenIdx === idx;
                const weight = attentionWeights[idx];
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedTokenIdx(idx)}
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 border relative ${
                      isSelected
                        ? 'bg-electric-cyan text-navy-950 border-electric-cyan shadow-glow-cyan scale-105'
                        : 'bg-navy-900/80 hover:bg-navy-800 text-slate-300 border-white/10'
                    }`}
                  >
                    <span>{token}</span>
                    <span
                      className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                      style={{
                        backgroundColor: `rgba(0, 240, 255, ${Math.max(0.1, weight)})`,
                        boxShadow: weight > 0.2 ? '0 0 8px #00F0FF' : 'none'
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Parameter Sliders Panel */}
          <div className="grid sm:grid-cols-3 gap-4 bg-navy-900/60 p-4 rounded-xl border border-white/5">
            <div>
              <div className="flex justify-between text-xs text-slate-300 font-mono mb-1">
                <span>Vector Dimension (d_k)</span>
                <span className="text-purple-300 font-bold">{dimensionDk}</span>
              </div>
              <input
                type="range"
                min="16"
                max="256"
                step="16"
                value={dimensionDk}
                onChange={(e) => setDimensionDk(Number(e.target.value))}
                className="w-full accent-purple-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">√d_k = {Math.sqrt(dimensionDk).toFixed(2)}</span>
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-mono mb-1">
                <span>Softmax Temperature</span>
                <span className="text-cyan-300 font-bold">{temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="2.5"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <span className="text-[10px] text-slate-500">Higher = diffuse; Lower = sharp</span>
            </div>

            <div className="flex flex-col justify-center">
              <span className="text-xs text-slate-300 font-mono mb-1.5">Scaling Factor (1/√d_k)</span>
              <button
                onClick={() => setUseScalingFactor(!useScalingFactor)}
                className={`py-1.5 px-3 rounded-lg text-xs font-bold transition border ${
                  useScalingFactor
                    ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/40'
                    : 'bg-red-950/40 text-red-300 border-red-500/40'
                }`}
              >
                {useScalingFactor ? '✓ Active (Variance = 1.0)' : '✗ Disabled (Vanishing Gradients!)'}
              </button>
            </div>
          </div>

          {/* Real-time Attention Distribution Heatmap & Bars */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
              Attention Weight Distribution for "{sentenceTokens[selectedTokenIdx]}"
            </h3>

            <div className="space-y-2">
              {sentenceTokens.map((token, idx) => {
                const weight = attentionWeights[idx];
                const percentage = (weight * 100).toFixed(1);
                const isSelected = selectedTokenIdx === idx;

                return (
                  <div key={idx} className="flex items-center space-x-3 text-xs">
                    <span className={`w-16 text-right font-mono font-medium truncate ${
                      isSelected ? 'text-electric-cyan font-bold' : 'text-slate-400'
                    }`}>
                      {token}
                    </span>

                    <div className="flex-1 h-6 bg-navy-950 rounded-lg overflow-hidden border border-white/5 relative flex items-center">
                      <div
                        className="h-full bg-gradient-to-r from-purple-600 to-electric-cyan transition-all duration-300 rounded-lg"
                        style={{ width: `${Math.max(2, weight * 100)}%` }}
                      />
                      <span className="absolute right-2 text-[10px] font-mono text-slate-300">
                        {percentage}%
                      </span>
                    </div>

                    <span className="w-16 font-mono text-[10px] text-slate-500">
                      score: {rawScores[idx].toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Insight Callout */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 text-xs text-slate-300 flex items-start space-x-3">
            <Sparkles className="w-4 h-4 text-electric-cyan flex-shrink-0 mt-0.5" />
            <p>
              Notice how the pronoun <strong className="text-electric-cyan">"it"</strong> directs its highest attention weights to <strong className="text-purple-300">"animal"</strong> and <strong className="text-purple-300">"tired"</strong>! This proves how self-attention autonomously discovers coreference resolution without human syntax trees.
            </p>
          </div>
        </div>
      )}

      {/* SIMULATION 2: Neural Network Forward Pass */}
      {activeSimulation === 'neural' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span className="text-electric-cyan">Interactive Neural Layer & Synaptic Activation Lab</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Tweak inputs, weights, biases, and switch non-linear activation functions to inspect forward propagation in real time.
              </p>
            </div>
            <div className="flex items-center space-x-1.5">
              {(['relu', 'sigmoid', 'tanh', 'gelu'] as const).map(fn => (
                <button
                  key={fn}
                  onClick={() => setActivationFn(fn)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono uppercase transition ${
                    activationFn === fn
                      ? 'bg-purple-600 text-white font-bold'
                      : 'bg-navy-900 text-slate-400 hover:text-white'
                  }`}
                >
                  {fn}
                </button>
              ))}
            </div>
          </div>

          {/* Visual Synapse Graph */}
          <div className="grid md:grid-cols-3 gap-6 items-center p-6 bg-navy-950/60 rounded-2xl border border-white/5 relative">
            
            {/* Input Layer */}
            <div className="space-y-4">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block text-center">
                Input Layer (X)
              </span>

              <div className="glass-card p-4 rounded-xl space-y-2 border-l-4 border-l-purple-500">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Node x₁</span>
                  <span className="text-purple-300 font-bold">{inputX1.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={inputX1}
                  onChange={(e) => setInputX1(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>

              <div className="glass-card p-4 rounded-xl space-y-2 border-l-4 border-l-purple-500">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-300">Node x₂</span>
                  <span className="text-purple-300 font-bold">{inputX2.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="-3"
                  max="3"
                  step="0.1"
                  value={inputX2}
                  onChange={(e) => setInputX2(Number(e.target.value))}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>

            {/* Hidden Layer */}
            <div className="space-y-3">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block text-center">
                Hidden Layer ({activationFn.toUpperCase()})
              </span>

              {hiddenA.map((act, i) => (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-navy-900 border border-white/10 flex items-center justify-between text-xs font-mono"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="text-slate-300">h_{i + 1}</span>
                  </div>
                  <span className="text-electric-cyan font-bold">{act.toFixed(3)}</span>
                </div>
              ))}
            </div>

            {/* Output Layer */}
            <div className="space-y-4">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block text-center">
                Network Output (ŷ)
              </span>

              <div className="glass-panel-elevated p-6 rounded-2xl text-center space-y-3 border border-purple-500/30">
                <span className="text-xs text-slate-400 font-mono">Activated Output</span>
                <div className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-electric-cyan font-mono">
                  {outputA.toFixed(4)}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Raw Sum z = {outputZ.toFixed(3)}
                </div>
              </div>
            </div>
          </div>

          {/* Parameter Sliders */}
          <div className="grid sm:grid-cols-2 gap-4 bg-navy-900/60 p-4 rounded-xl border border-white/5">
            <div>
              <div className="flex justify-between text-xs text-slate-300 font-mono mb-1">
                <span>Synaptic Weight Scale</span>
                <span className="text-purple-300 font-bold">{weightMultiplier.toFixed(2)}x</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="3.0"
                step="0.1"
                value={weightMultiplier}
                onChange={(e) => setWeightMultiplier(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-mono mb-1">
                <span>Layer Bias (b)</span>
                <span className="text-cyan-300 font-bold">{bias.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-2"
                max="2"
                step="0.1"
                value={bias}
                onChange={(e) => setBias(Number(e.target.value))}
                className="w-full accent-cyan-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* SIMULATION 3: Quantum Bloch Sphere */}
      {activeSimulation === 'quantum' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/10 gap-2">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <span className="text-electric-cyan">Quantum Bloch Sphere Qubit Visualizer</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Manipulate quantum superposition angles θ and φ, apply unitary quantum gates, and measure probabilistic state collapse.
              </p>
            </div>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={applyHadamard}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-indigo-600/40 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600/60 transition"
              >
                Hadamard (H)
              </button>
              <button
                onClick={applyPauliX}
                className="px-3 py-1.5 rounded-lg text-xs font-mono font-bold bg-purple-600/40 text-purple-300 border border-purple-500/40 hover:bg-purple-600/60 transition"
              >
                Pauli-X (NOT)
              </button>
            </div>
          </div>

          {/* Bloch Sphere Visual & Probability Gauges */}
          <div className="grid md:grid-cols-2 gap-6 items-center">
            
            {/* SVG 2D/3D Bloch Sphere Projection */}
            <div className="relative aspect-square max-w-[340px] mx-auto w-full flex items-center justify-center p-4 bg-navy-950/70 rounded-2xl border border-white/5 shadow-inner">
              <svg viewBox="0 0 300 300" className="w-full h-full">
                {/* Outer Sphere circle */}
                <circle cx="150" cy="150" r="110" fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="2" />
                {/* Equator Ellipse */}
                <ellipse cx="150" cy="150" rx="110" ry="32" fill="none" stroke="rgba(6, 182, 212, 0.25)" strokeDasharray="4,4" />
                {/* Z Axis */}
                <line x1="150" y1="20" x2="150" y2="280" stroke="#64748B" strokeWidth="1.5" />
                <text x="150" y="16" fill="#00F0FF" fontSize="12" textAnchor="middle" className="font-mono font-bold">|0⟩ (+Z)</text>
                <text x="150" y="295" fill="#A855F7" fontSize="12" textAnchor="middle" className="font-mono font-bold">|1⟩ (-Z)</text>
                {/* X Axis */}
                <line x1="30" y1="180" x2="270" y2="120" stroke="#475569" strokeWidth="1" strokeDasharray="3,3" />

                {/* State Vector |ψ⟩ */}
                {(() => {
                  const x = 150 + 110 * Math.sin(theta) * Math.cos(phi);
                  const y = 150 - 110 * Math.cos(theta) + (110 * Math.sin(theta) * Math.sin(phi) * 0.25);
                  return (
                    <g>
                      <line x1="150" y1="150" x2={x} y2={y} stroke="#00F0FF" strokeWidth="3" markerEnd="url(#arrow)" />
                      <circle cx={x} cy={y} r="6" fill="#00F0FF" className="shadow-glow-cyan animate-pulse" />
                      <text x={x + 10} y={y - 8} fill="#FFFFFF" fontSize="12" className="font-mono font-bold">|ψ⟩</text>
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Probabilities & Collapse Actions */}
            <div className="space-y-4">
              <div className="glass-card p-5 rounded-2xl space-y-3">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  Quantum State Formulation:
                </span>
                <div className="p-3 bg-navy-950 rounded-xl font-mono text-sm text-cyan-300 border border-white/5">
                  |ψ⟩ = {(Math.cos(theta/2)).toFixed(2)}|0⟩ + {(Math.sin(theta/2)).toFixed(2)}e^(i{(phi/Math.PI).toFixed(2)}π)|1⟩
                </div>
              </div>

              {/* State Probabilities */}
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>P(|0⟩) Probability:</span>
                    <span className="text-cyan-300 font-bold">{(prob0 * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-navy-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-electric-cyan rounded-full transition-all duration-200" style={{ width: `${prob0 * 100}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1">
                    <span>P(|1⟩) Probability:</span>
                    <span className="text-purple-300 font-bold">{(prob1 * 100).toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-navy-950 rounded-full overflow-hidden border border-white/5">
                    <div className="h-full bg-purple-500 rounded-full transition-all duration-200" style={{ width: `${prob1 * 100}%` }} />
                  </div>
                </div>
              </div>

              {/* Measurement Button & Output */}
              <div className="pt-2">
                <button
                  onClick={handleMeasureQubit}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-electric-cyan text-white text-xs font-bold shadow-glow-purple border border-white/20 transition flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Measure Qubit State (Wavefunction Collapse)</span>
                </button>

                {measurementResult && (
                  <div className="mt-3 p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 text-center animate-in zoom-in-95 duration-200">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block">Measurement Collapse Result:</span>
                    <span className="text-lg font-extrabold text-electric-cyan font-mono">
                      {measurementResult}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Angle Sliders */}
          <div className="grid sm:grid-cols-2 gap-4 bg-navy-900/60 p-4 rounded-xl border border-white/5">
            <div>
              <div className="flex justify-between text-xs text-slate-300 font-mono mb-1">
                <span>Polar Angle (θ)</span>
                <span className="text-cyan-300 font-bold">{(theta / Math.PI).toFixed(2)}π rad</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.PI}
                step="0.05"
                value={theta}
                onChange={(e) => {
                  setTheta(Number(e.target.value));
                  setMeasurementResult(null);
                }}
                className="w-full accent-cyan-500"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs text-slate-300 font-mono mb-1">
                <span>Azimuthal Phase (φ)</span>
                <span className="text-purple-300 font-bold">{(phi / Math.PI).toFixed(2)}π rad</span>
              </div>
              <input
                type="range"
                min="0"
                max={2 * Math.PI}
                step="0.05"
                value={phi}
                onChange={(e) => {
                  setPhi(Number(e.target.value));
                  setMeasurementResult(null);
                }}
                className="w-full accent-purple-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
