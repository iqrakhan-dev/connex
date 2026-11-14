# CONNEX — Next-Gen AI Interactive Learning OS

> Inspired by NotebookLM, engineered with deep interactive multimodal learning experiences.

CONNEX transforms educational PDFs, website URLs, and topic curricula into an integrated, interactive learning studio featuring:

1. **Interactive Knowledge Graph**: Dynamic visual topology with category clustering, organic physics simulation, node drag/zoom/pan, and deep concept dossiers.
2. **Deep Learning Explanations**: 5-tier cognitive hierarchy:
   - 👶 **ELI5 / Intuition** (everyday metaphors & analogies)
   - 📋 **Executive Summary** (strategic synthesis & takeaways)
   - ⚙️ **Technical Deep-Dive** (architectural specifications, code implementations & mechanics)
   - 📐 **Mathematical Formulations** (formal equations, variable tables, plain English translations)
   - 💡 **Conceptual Metaphors** (mental model stories)
3. **Visual Lab**: Parametric real-time sandboxes:
   - *Transformer Self-Attention Matrix Visualizer* (Query-Key dot products, 1/√d_k variance scaling, Softmax temperature)
   - *Neural Forward Pass & Synapse Activation Sandbox* (Inputs, weights, bias, and ReLU / Sigmoid / Tanh / GELU activations)
   - *Bloch Sphere Quantum Qubit Simulator* (Polar θ / Azimuthal φ angles, Hadamard & Pauli-X gates, and probabilistic wavefunction collapse)
4. **AI Tutor**: Socratic conversational agent unified inside the platform:
   - Embedded support for official **Botpress Webchat v2** via Cloud Bot ID
   - Context-grounded fallback assistant with multi-source citations and voice read-aloud
5. **Audio Learning**: NotebookLM-style dual-speaker podcast ("The Deep Dive" with Alex and Dr. Taylor):
   - Dynamic pulsing audio waveform visualizer
   - Interactive synchronized karaoke transcript that seeks and auto-scrolls
   - Direct integration hook for **ElevenLabs API** (`/v1/text-to-speech`) with customizable voice IDs
   - High-fidelity Web Speech API synthesizer fallback
6. **AI-Generated Quizzes**:
   - Diagnostic Multi-Choice Questions (MCQs) with instant rationales and source citations
   - 3D Interactive Flip Flashcards with Leitner spaced repetition
   - Active Recall free-response challenges with benchmark answers and confetti celebration

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **UI & Icons**: Lucide React, Canvas Confetti
- **Audio & Speech**: ElevenLabs REST API + Web Speech / Web Audio Synthesis
- **AI Tutor**: Botpress Cloud Webchat v2 Embed + Context-Grounded Socratic Engine
- **Backend / DB**: Supabase Client SDK (`@supabase/supabase-js`) + LocalStorage Studio Mode

---

## 🚀 Getting Started

### 1. Development Server
To launch the development server locally:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Production Build
```bash
npm run build
npm run preview
```

### 3. API Integrations (Optional)
Click the **Settings** icon in the top navigation bar to configure:
- **Supabase**: `SUPABASE_URL` and `SUPABASE_ANON_KEY` (features live ping connection test)
- **Botpress**: `BOTPRESS_BOT_ID` and `BOTPRESS_CLIENT_ID`
- **ElevenLabs**: `ELEVENLABS_API_KEY` and custom voice selections (Alex & Dr. Taylor)

If unconfigured, CONNEX runs automatically in **Local Studio Mode**, with zero mock claims and fully interactive local models.
