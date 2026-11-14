import { Source, KnowledgeGraphData, DeepExplanation, AudioOverview, QuizQuestion } from '../types';

export const INITIAL_SOURCES: Source[] = [
  {
    id: 'src-1',
    type: 'pdf',
    title: 'Attention Is All You Need — Vaswani et al. (2017)',
    fileName: 'attention_is_all_you_need.pdf',
    fileSize: '2.4 MB',
    tokenCount: 8420,
    snippet: 'The dominant sequence transduction models are based on complex recurrent or convolutional neural networks. We propose the Transformer, based solely on attention mechanisms...',
    content: `The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely.

Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.

Scaled Dot-Product Attention:
We compute the attention function on a set of queries simultaneously, packed together into a matrix Q. The keys and values are also packed into matrices K and V. The matrix of outputs is computed as:
Attention(Q, K, V) = softmax(Q * K^T / sqrt(d_k)) * V

Multi-Head Attention allows the model to jointly attend to information from different representation subspaces at different positions.`,
    isActive: true,
    createdAt: '2026-11-14T10:00:00Z',
    tags: ['Machine Learning', 'NLP', 'Transformers']
  },
  {
    id: 'src-2',
    type: 'url',
    title: 'The Illustrated Transformer — Visualizing Self-Attention',
    url: 'https://jalammar.github.io/illustrated-transformer/',
    tokenCount: 4650,
    snippet: 'A visual walkthrough of the Transformer architecture: how tokens pass through encoders, self-attention calculation matrices, multi-head projection vectors, and residual streams.',
    content: `In this post, we look at the Transformer — a model that uses attention to boost the speed with which these models can be trained. The Transformer outperforms the Google Neural Machine Translation model in specific tasks. The biggest benefit, however, comes from how the Transformer lends itself to parallelization.

High-Level Architecture:
The encoding component is a stack of encoders (six encoders stacked on top of each other). The decoding component is a stack of decoders of the same number. Each encoder contains two sub-layers: Self-Attention and a Feed Forward Neural Network.

Self-Attention at a granular level:
The first step in calculating self-attention is to create three vectors from each of the encoder's input vectors (in this case, the embedding of each word). For each word, we create a Query vector, a Key vector, and a Value vector. These vectors are created by multiplying the embedding by three matrices that we trained during the training process.`,
    isActive: true,
    createdAt: '2026-11-14T10:15:00Z',
    tags: ['Visual Learning', 'Deep Learning', 'Attention']
  },
  {
    id: 'src-3',
    type: 'topic',
    title: 'Theoretical Foundations: Why Recurrent Nets Failed at Scale',
    tokenCount: 3120,
    snippet: 'Analysis of vanishing gradients in LSTM/RNN backpropagation-through-time (BPTT), memory bottleneck in sequential hidden states, and the O(1) path length advantage of self-attention.',
    content: `Recurrent models typically factor computation along the symbol positions of the input and output sequences. Aligning positions to steps in computation time, they generate a sequence of hidden states h_t, as a function of the previous hidden state h_{t-1} and the input for position t.

This inherently sequential nature precludes parallelization within training examples, which becomes critical at longer sequence lengths, as memory constraints limit batching across examples.

In contrast, self-attention connects all pairs of input positions in a single operation, reducing the maximum path length between any two tokens to O(1), directly eliminating the catastrophic forgetting and vanishing gradient bottlenecks observed in deep sequential architectures.`,
    isActive: true,
    createdAt: '2026-11-14T10:30:00Z',
    tags: ['Theory', 'Optimization', 'Parallel Computing']
  }
];

export const INITIAL_KNOWLEDGE_GRAPH: KnowledgeGraphData = {
  nodes: [
    {
      id: 'transformer',
      label: 'Transformer Model',
      category: 'core',
      summary: 'Pure attention-based sequence transduction architecture that eliminated recurrence.',
      details: 'Introduced by Vaswani et al. in 2017. Replaced recurrence with multi-head self-attention, enabling unprecedented parallel training on high-performance accelerators.',
      citations: ['Attention Is All You Need (Vaswani et al., 2017)'],
      x: 350,
      y: 260,
      radius: 36
    },
    {
      id: 'self-attention',
      label: 'Self-Attention',
      category: 'mechanism',
      summary: 'Relates different positions of a single sequence to compute a contextual representation.',
      details: 'Calculates dynamic relevance scores between every token pair in the sequence using scaled dot-product attention.',
      citations: ['Attention Is All You Need, Section 3.2'],
      x: 200,
      y: 150,
      radius: 28
    },
    {
      id: 'multi-head',
      label: 'Multi-Head Attention',
      category: 'architecture',
      summary: 'Projects Queries, Keys, and Values h times into parallel learned linear subspaces.',
      details: 'Allows the model to jointly attend to information from different representation subspaces (e.g. syntactic, semantic, coreference) at different positions simultaneously.',
      citations: ['Attention Is All You Need, Section 3.2.2'],
      x: 520,
      y: 150,
      radius: 30
    },
    {
      id: 'qkv',
      label: 'Query, Key & Value (Q, K, V)',
      category: 'mechanism',
      summary: 'Vector projections mapping tokens into lookup, identifier, and content spaces.',
      details: 'Analogous to database retrieval: Query seeks information, Keys match the search criteria, and Values deliver the contextual representation.',
      citations: ['The Illustrated Transformer (J. Alammar)'],
      x: 120,
      y: 300,
      radius: 26
    },
    {
      id: 'scaling-factor',
      label: 'Scaling Factor (1/√d_k)',
      category: 'foundation',
      summary: 'Counteracts extreme dot product magnitudes to prevent vanishing Softmax gradients.',
      details: 'For large values of d_k, the dot products grow large in magnitude, pushing the softmax function into regions where it has extremely small gradients. Dividing by √d_k stabilizes training.',
      citations: ['Attention Is All You Need, Section 3.2.1'],
      x: 180,
      y: 440,
      radius: 24
    },
    {
      id: 'positional-encoding',
      label: 'Positional Encoding',
      category: 'architecture',
      summary: 'Injects sequence order into permutation-invariant self-attention matrices.',
      details: 'Uses sinusoidal functions of varying frequencies (PE(pos, 2i) = sin(pos/10000^(2i/d_model))) so relative positions can be learned linearly.',
      citations: ['Attention Is All You Need, Section 3.5'],
      x: 350,
      y: 440,
      radius: 26
    },
    {
      id: 'residual-connections',
      label: 'Residual & LayerNorm',
      category: 'foundation',
      summary: 'Add & Norm streams that facilitate smooth gradient flow across deep transformer layers.',
      details: 'Each sub-layer (Self-Attention, FFN) produces LayerNorm(x + Sublayer(x)), ensuring gradient highways that prevent signal degradation across 100+ layer architectures.',
      citations: ['Attention Is All You Need, Section 3.1'],
      x: 530,
      y: 340,
      radius: 24
    },
    {
      id: 'llm-applications',
      label: 'Modern LLM Scaling (GPT/Claude)',
      category: 'application',
      summary: 'Decoder-only and encoder-decoder autoregressive engines powering modern generative AI.',
      details: 'Foundation of modern frontier AI models. Demonstrates empirical power-law scaling across compute, dataset size, and parameter counts.',
      citations: ['Scaling Laws for Neural Language Models (Kaplan et al.)'],
      x: 520,
      y: 460,
      radius: 28
    }
  ],
  links: [
    { source: 'transformer', target: 'self-attention', relation: 'relies on', strength: 2 },
    { source: 'transformer', target: 'multi-head', relation: 'stacks into', strength: 2 },
    { source: 'transformer', target: 'positional-encoding', relation: 'injects order via', strength: 1.5 },
    { source: 'transformer', target: 'residual-connections', relation: 'stabilized by', strength: 1.5 },
    { source: 'self-attention', target: 'qkv', relation: 'computes via', strength: 2 },
    { source: 'self-attention', target: 'scaling-factor', relation: 'normalizes with', strength: 1.5 },
    { source: 'multi-head', target: 'transformer', relation: 'powers feed', strength: 1 },
    { source: 'multi-head', target: 'llm-applications', relation: 'scaled up into', strength: 2 },
    { source: 'qkv', target: 'scaling-factor', relation: 'prevents gradient saturation', strength: 1.2 },
    { source: 'positional-encoding', target: 'llm-applications', relation: 'extended by RoPE', strength: 1 }
  ]
};

export const INITIAL_EXPLANATION: DeepExplanation = {
  topic: 'Self-Attention & Transformer Architecture',
  overview: 'The Transformer represents a paradigm shift in artificial intelligence, abandoning sequential recurrence in favor of parallelized pairwise dot-product attention across all tokens.',
  eli5: `Imagine being in a bustling room where everyone is speaking at once. In old AI models (like RNNs), the computer listened to people one word at a time, like reading a ticker tape, and by word 50, it had already forgotten what word 3 was. 

The Transformer is like a brilliant researcher wearing smart headphones. Instead of listening in a line, it photographs the entire room at once. When it sees the word "bank", it immediately checks which other words in the sentence give it meaning: if it sees "river", "water", and "mud", it knows it's a riverbank. If it sees "money", "loan", and "interest", it knows it's a financial institution. That instantaneous, multi-directional spotlight is Self-Attention!`,
  executiveSummary: [
    'Elimination of Recurrence: Enabled 100x training parallelization on modern GPU/TPU clusters by removing step-by-step sequential dependencies.',
    'O(1) Maximum Path Length: Every token directly attends to every other token in a single layer, eradicating catastrophic forgetting and vanishing gradients.',
    'Multi-Head Subspaces: Breaks the embedding dimension into parallel heads (typically 8 to 128), allowing the network to simultaneously track syntactic agreement, semantics, and reference.',
    'Empirical Foundation of Frontier AI: Direct architecture behind GPT-4, Claude, Gemini, LLaMA, and AlphaFold 3.'
  ],
  technicalBreakdown: [
    {
      title: '1. Linear Projections into Q, K, V Subspaces',
      content: 'For an input sequence embedded into matrix X ∈ ℝ^(N×d_model), we compute three distinct learned linear projections using projection matrices W_Q, W_K, W_V ∈ ℝ^(d_model×d_k):',
      keyPoints: [
        'Query (Q = X · W_Q): Represents what the current token is seeking.',
        'Key (K = X · W_K): Represents the indexable identity or properties of each token.',
        'Value (V = X · W_V): Holds the actual contextual semantic payload to be weighted and aggregated.'
      ],
      codeBlock: `# PyTorch Vectorized Self-Attention Implementation
import torch
import torch.nn as nn
import math

class ScaledDotProductAttention(nn.Module):
    def __init__(self, d_k: int):
        super().__init__()
        self.scale = 1.0 / math.sqrt(d_k)

    def forward(self, Q, K, V, mask=None):
        # Q, K, V shape: [batch_size, num_heads, seq_len, d_k]
        scores = torch.matmul(Q, K.transpose(-2, -1)) * self.scale
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        attn_weights = torch.softmax(scores, dim=-1)
        output = torch.matmul(attn_weights, V)
        return output, attn_weights`
    },
    {
      title: '2. The Scaled Dot-Product Operator',
      content: 'Attention scores are computed via the matrix multiplication of Q with the transpose of K. Softmax normalizes these scores into a valid probability distribution over all sequence positions.',
      keyPoints: [
        'Unscaled dot products have expected variance proportional to d_k.',
        'As d_k grows large, dot products push Softmax outputs toward 0 or 1, where local derivatives vanish.',
        'The division by √d_k enforces variance = 1, ensuring stable gradient backpropagation.'
      ]
    },
    {
      title: '3. Multi-Head Attention Mechanism',
      content: 'Instead of performing a single attention function with d_model-dimensional keys, values, and queries, it is beneficial to linearly project the queries, keys, and values h times with different, learned linear projections to d_k, d_k, and d_v dimensions, respectively.',
      keyPoints: [
        'MultiHead(Q,K,V) = Concat(head_1, ..., head_h) · W_O',
        'Each head operates in a reduced subspace (d_k = d_model / h), so total computational cost is identical to single-head attention with full dimensionality.'
      ]
    }
  ],
  mathematicalFoundations: [
    {
      title: 'Scaled Dot-Product Attention Equation',
      equation: '\\text{Attention}(Q, K, V) = \\text{softmax}\\left( \\frac{Q K^T}{\\sqrt{d_k}} \\right) V',
      plainEnglish: 'Multiply queries by keys to measure relevance, divide by the square root of the key dimension to stabilize variance, normalize with softmax to get probabilities, and calculate the weighted average of values.',
      variables: [
        { symbol: 'Q ∈ ℝ^(N×d_k)', description: 'Matrix of queries across N sequence tokens' },
        { symbol: 'K ∈ ℝ^(N×d_k)', description: 'Matrix of keys across N sequence tokens' },
        { symbol: 'V ∈ ℝ^(N×d_v)', description: 'Matrix of values containing semantic content' },
        { symbol: 'd_k', description: 'Dimensionality of the key vectors (e.g., 64)' }
      ]
    },
    {
      title: 'Positional Encoding Formulation',
      equation: 'PE_{(pos, 2i)} = \\sin\\left(\\frac{pos}{10000^{2i / d_{model}}}\\right), \\quad PE_{(pos, 2i+1)} = \\cos\\left(\\frac{pos}{10000^{2i / d_{model}}}\\right)',
      plainEnglish: 'Because self-attention contains no inherent sense of word order, fixed geometric sinusoidal waves of varying wavelengths are added directly to the input embeddings so the model can distinguish sequence position.',
      variables: [
        { symbol: 'pos', description: 'Index position of the token within the sequence (0, 1, ..., N)' },
        { symbol: 'i', description: 'Dimension index within the embedding space' },
        { symbol: 'd_model', description: 'Total hidden embedding dimension of the network' }
      ]
    }
  ],
  analogies: [
    {
      headline: 'The Global Research Library',
      story: 'Imagine walking into the Library of Congress. Your question is the Query. The catalog card metadata tags on every drawer are the Keys. When your query matches a key card, you open the drawer and retrieve the actual book contents (the Values). In the Transformer, this entire library search happens for thousands of tokens simultaneously in parallel nanoseconds.'
    },
    {
      headline: 'The Dynamic Prism',
      story: 'White light entering a prism splits into distinct frequencies. Multi-head attention is an algorithmic prism: it takes a single sentence and splits it into 8 or 16 color bands. One band tracks grammatical syntax, another tracks who pronoun "it" refers to, another tracks numerical relationships, and another detects emotional tone.'
    }
  ],
  keyTakeaways: [
    'Self-attention connects all token pairs in O(1) sequential operations, shattering RNN memory bottlenecks.',
    'Scaling factor 1/√d_k is mathematically essential to avoid vanishing Softmax gradients.',
    'Multi-head projections enable simultaneous attending to distinct contextual subspaces.',
    'Positional encodings provide permutation-awareness to an otherwise set-invariant dot product.'
  ]
};

export const INITIAL_AUDIO_OVERVIEW: AudioOverview = {
  title: 'The Deep Dive: How Attention Shattered the AI Memory Wall',
  topic: 'Transformer Architecture & Self-Attention',
  duration: 184, // ~3 minutes interactive podcast
  episodesCount: 1,
  segments: [
    {
      id: 'seg-1',
      speaker: 'Alex',
      speakerRole: 'Lead AI Explainer',
      timeSec: 0,
      durationSec: 14,
      text: "Welcome back to The Deep Dive on CONNEX! Today, Taylor and I are unpacking what is arguably the single most important paper in modern AI: 'Attention Is All You Need' from 2017."
    },
    {
      id: 'seg-2',
      speaker: 'Taylor',
      speakerRole: 'Cognitive Computing Scientist',
      timeSec: 14,
      durationSec: 18,
      text: "It really cannot be overstated, Alex. Before this paper, if you wanted a neural network to process text, you were essentially forced to use recurrent neural networks—LSTMs, GRUs. And they had a massive bottleneck."
    },
    {
      id: 'seg-3',
      speaker: 'Alex',
      speakerRole: 'Lead AI Explainer',
      timeSec: 32,
      durationSec: 15,
      text: "Right! The sequential bottleneck. Word two couldn't be processed until word one was finished. Word 100 had to wait for 99 sequential matrix multiplications. You couldn't parallelize it across thousands of GPU cores!"
    },
    {
      id: 'seg-4',
      speaker: 'Taylor',
      speakerRole: 'Cognitive Computing Scientist',
      timeSec: 47,
      durationSec: 22,
      text: "Exactly. And worse: the memory wall. By the time an LSTM reached word 200, the gradients from word 5 had vanished into mathematical oblivion. The Vaswani team asked a radical question: What if we throw away recurrence completely?"
    },
    {
      id: 'seg-5',
      speaker: 'Alex',
      speakerRole: 'Lead AI Explainer',
      timeSec: 69,
      durationSec: 19,
      text: "And that's where Query, Key, and Value come in! I love the database analogy here: you have a Query—what you're looking for—matching against Keys, which pulls out the Values. Tell us why the square root of d_k matters so much."
    },
    {
      id: 'seg-6',
      speaker: 'Taylor',
      speakerRole: 'Cognitive Computing Scientist',
      timeSec: 88,
      durationSec: 25,
      text: "That little square root of d_k is pure mathematical elegance. If your vector dimension is large—say, 64 or 128—dot products can become gigantic numbers like 80 or 100. Plug 80 into a Softmax function, and your gradient becomes practically zero. The network stops learning! Dividing by root d_k keeps the variance at one."
    },
    {
      id: 'seg-7',
      speaker: 'Alex',
      speakerRole: 'Lead AI Explainer',
      timeSec: 113,
      durationSec: 20,
      text: "And then Multi-Head Attention splits the embedding into multiple perspectives. So Head 1 might notice that 'The animal didn't cross the street because IT was too tired'—Head 1 connects 'IT' to 'animal', while another head connects 'tired' to 'animal'!"
    },
    {
      id: 'seg-8',
      speaker: 'Taylor',
      speakerRole: 'Cognitive Computing Scientist',
      timeSec: 133,
      durationSec: 24,
      text: "Precisely! That's coreference resolution right there. The result is that every single modern frontier model—GPT-4, Gemini, Claude, and even image models like ViT—are all direct descendants of this exact 15-page document."
    },
    {
      id: 'seg-9',
      speaker: 'Alex',
      speakerRole: 'Lead AI Explainer',
      timeSec: 157,
      durationSec: 27,
      text: "Incredible stuff. If you're exploring this in CONNEX right now, try hopping over to the Visual Lab to see the attention matrix sliders live, or test your retention on the diagnostic quiz. Catch you on the next deep dive!"
    }
  ]
};

export const INITIAL_QUIZ: QuizQuestion[] = [
  {
    id: 'q-1',
    type: 'mcq',
    question: 'Why does the Scaled Dot-Product Attention formula divide by √d_k before applying the Softmax function?',
    options: [
      'To prevent the attention weights from summing to more than 1.0',
      'To scale down large dot products that would otherwise push Softmax into vanishing gradient regions',
      'To ensure that the Query and Key matrices have compatible linear dimensions',
      'To convert Euclidean distance metrics into cosine similarity scores'
    ],
    correctAnswer: 1,
    explanation: 'For large values of d_k, dot products grow substantially in magnitude. Large inputs into Softmax result in output probabilities close to 1 or 0, where the derivative (gradient) approaches zero, stalling backpropagation.',
    sourceRef: 'Attention Is All You Need — Section 3.2.1',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-2',
    type: 'mcq',
    question: 'What is the primary computational advantage of Self-Attention over traditional Recurrent Neural Networks (LSTMs)?',
    options: [
      'Self-attention requires fewer total trainable parameters',
      'Self-attention allows O(1) path length between tokens and full parallelization across the sequence length',
      'Self-attention completely eliminates the need for matrix multiplications',
      'Self-attention can only process English language vocabularies'
    ],
    correctAnswer: 1,
    explanation: 'Recurrent models must process tokens sequentially (t depends on t-1), prohibiting parallelization. In contrast, self-attention computes all token pairwise interactions simultaneously, yielding O(1) maximum path length and seamless GPU parallelization.',
    sourceRef: 'Why Recurrent Nets Failed at Scale — Section 2',
    difficulty: 'Beginner'
  },
  {
    id: 'q-3',
    type: 'flashcard',
    question: 'What is the purpose of Positional Encodings in a Transformer?',
    front: 'Why does the Transformer require Positional Encodings?',
    back: 'Because standard self-attention is permutation-invariant (order-agnostic). If you shuffled the words in a sentence, the pairwise dot products would yield the exact same values without positional encodings.',
    explanation: 'Positional encodings inject sinusoidal signals into the token embeddings, preserving token sequence order.',
    sourceRef: 'Attention Is All You Need — Section 3.5',
    difficulty: 'Intermediate'
  },
  {
    id: 'q-4',
    type: 'flashcard',
    question: 'Explain the distinct roles of Query (Q), Key (K), and Value (V).',
    front: 'What are Query, Key, and Value in Self-Attention?',
    back: 'Query (Q) is what the current token seeks; Key (K) describes what each token offers; Value (V) is the actual contextual information payload that gets weighted and aggregated.',
    explanation: 'This database-inspired abstraction decouples the criteria for attention (Q·K^T) from the semantic information transmitted (V).',
    sourceRef: 'The Illustrated Transformer',
    difficulty: 'Beginner'
  },
  {
    id: 'q-5',
    type: 'recall',
    question: 'Active Recall Challenge: State the mathematical formula for Scaled Dot-Product Attention from memory.',
    explanation: 'Expected Formula: Attention(Q, K, V) = softmax((Q · K^T) / √d_k) · V. Key criteria: Q times transpose of K, divided by square root of key dimension d_k, followed by softmax, then multiplied by V.',
    sourceRef: 'Attention Is All You Need — Equation 1',
    difficulty: 'Advanced'
  }
];

// Dynamic Generator for Custom User Ingestions
export function synthesizeNotebookFromTopic(topicName: string): {
  source: Source;
  graph: KnowledgeGraphData;
  explanation: DeepExplanation;
  audio: AudioOverview;
  quiz: QuizQuestion[];
} {
  const cleanName = topicName.trim() || 'Emergent Neural Phenomena';
  
  const source: Source = {
    id: `src-gen-${Date.now()}`,
    type: 'topic',
    title: `Grounded Synthesis: ${cleanName}`,
    tokenCount: 4200,
    snippet: `Comprehensive curriculum analysis, theoretical foundations, and systemic mechanisms for ${cleanName}.`,
    content: `Overview of ${cleanName}: Synthesized from multi-disciplinary academic archives. Explores core mechanisms, architecture, formal mathematical proofs, and active open problems in the field.`,
    isActive: true,
    createdAt: new Date().toISOString(),
    tags: [cleanName, 'Synthesis', 'AI Analysis']
  };

  const graph: KnowledgeGraphData = {
    nodes: [
      {
        id: 'node-root',
        label: cleanName,
        category: 'core',
        summary: `The central theoretical and practical foundation of ${cleanName}.`,
        details: `Core domain model encompassing all foundational axioms, operational paradigms, and key architectures for ${cleanName}.`,
        citations: [`Foundations of ${cleanName}`],
        x: 350,
        y: 250,
        radius: 36
      },
      {
        id: 'node-mech',
        label: `${cleanName} Mechanisms`,
        category: 'mechanism',
        summary: 'Primary operational interactions and processing steps.',
        details: 'The internal state transformations and dynamic operational rules driving system behavior.',
        citations: [`Mechanisms in ${cleanName}`],
        x: 180,
        y: 160,
        radius: 28
      },
      {
        id: 'node-arch',
        label: 'Architectural Framework',
        category: 'architecture',
        summary: 'Structural topology, layers, and systemic dependencies.',
        details: 'How functional subcomponents connect and transmit information across the pipeline.',
        citations: [`System Architecture for ${cleanName}`],
        x: 520,
        y: 160,
        radius: 28
      },
      {
        id: 'node-math',
        label: 'Mathematical Formulation',
        category: 'foundation',
        summary: 'Governing equations, objective functions, and optimization bounds.',
        details: 'Formal mathematical formulation describing state evolution and stability criteria.',
        citations: [`Mathematical Analysis`],
        x: 200,
        y: 420,
        radius: 26
      },
      {
        id: 'node-app',
        label: 'Applied Systems & Frontier',
        category: 'application',
        summary: 'Real-world deployment, scaling characteristics, and future horizons.',
        details: 'Practical computational implementations, benchmark evaluations, and open research questions.',
        citations: [`Applications in Industry`],
        x: 500,
        y: 420,
        radius: 28
      }
    ],
    links: [
      { source: 'node-root', target: 'node-mech', relation: 'governed by', strength: 2 },
      { source: 'node-root', target: 'node-arch', relation: 'structured via', strength: 2 },
      { source: 'node-root', target: 'node-math', relation: 'formulated through', strength: 1.5 },
      { source: 'node-root', target: 'node-app', relation: 'deployed in', strength: 1.8 },
      { source: 'node-mech', target: 'node-math', relation: 'quantified by', strength: 1.2 },
      { source: 'node-arch', target: 'node-app', relation: 'powers', strength: 1.5 }
    ]
  };

  const explanation: DeepExplanation = {
    topic: cleanName,
    overview: `An advanced synthesis of ${cleanName}, examining its theoretical principles, mechanical flow, and architectural implications.`,
    eli5: `Think of ${cleanName} like an orchestra. Rather than a single musician trying to play every instrument one after another, each specialist focuses on their unique harmony while listening to the collective tempo of the entire hall. The result is rich, synchronized symphony without losing rhythm or clarity.`,
    executiveSummary: [
      `Foundational Principle: Establishes a modular approach to understanding and solving complex challenges in ${cleanName}.`,
      `Scalability: Demonstrates robust computational scaling when applied across large-scale state distributions.`,
      `Efficiency: Reduces systemic friction and maximizes information throughput across all functional boundaries.`,
      `Practical Impact: Currently revolutionizing real-world applications and interdisciplinary research.`
    ],
    technicalBreakdown: [
      {
        title: `1. Core Operational Dynamics of ${cleanName}`,
        content: `The system processes incoming signal inputs through dedicated transformation operators, decoupling invariant features from transient noise:`,
        keyPoints: [
          `State Vectorization: Maps non-structured input sequences into continuous latent spaces.`,
          `Orthogonal Decoupling: Isolates independent variables to optimize gradient convergence.`,
          `Feedback Normalization: Employs dynamic regularization to prevent saturation.`
        ]
      },
      {
        title: `2. Systemic Integration & Optimization`,
        content: `By unifying theoretical constraints with computational throughput, ${cleanName} achieves predictable convergence and robust empirical performance.`,
        keyPoints: [
          `Information flow maintains O(1) direct paths across submodules.`,
          `Loss formulation balances expressivity against generalization.`
        ]
      }
    ],
    mathematicalFoundations: [
      {
        title: `Governing State Equation for ${cleanName}`,
        equation: `\\mathcal{L}_{\\text{total}}(\\theta) = \\mathbb{E}_{x \\sim \\mathcal{D}}\\left[ -\\log p_\\theta(x) \\right] + \\lambda \\mathcal{R}(\\theta)`,
        plainEnglish: `The objective function minimizes prediction entropy across empirical distribution D while penalizing model complexity through regularization parameter lambda.`,
        variables: [
          { symbol: '\\theta', description: 'Trainable system parameters and projection weights' },
          { symbol: '\\mathcal{D}', description: 'Empirical data manifold and state distribution' },
          { symbol: '\\lambda', description: 'Regularization scaling constant balancing fit vs complexity' }
        ]
      }
    ],
    analogies: [
      {
        headline: 'The Navigational Constellation',
        story: `Sailors in open water don't look at one wave at a time; they map their position against a fixed constellation of distant stars. In ${cleanName}, every complex observation is anchored to stable reference coordinates, allowing perfect navigation through chaotic data.`
      }
    ],
    keyTakeaways: [
      `Modular architecture guarantees high fault tolerance and parallel execution.`,
      `Mathematical bounds confirm stable asymptotic convergence.`,
      `Directly adaptable across diverse domain verticals.`
    ]
  };

  const audio: AudioOverview = {
    title: `The Deep Dive: Exploring ${cleanName}`,
    topic: cleanName,
    duration: 120,
    episodesCount: 1,
    segments: [
      {
        id: 'seg-dyn-1',
        speaker: 'Alex',
        speakerRole: 'Lead AI Explainer',
        timeSec: 0,
        durationSec: 15,
        text: `Welcome to this special edition of The Deep Dive on CONNEX! Today, Taylor and I are breaking down the newly ingested topic: ${cleanName}.`
      },
      {
        id: 'seg-dyn-2',
        speaker: 'Taylor',
        speakerRole: 'Cognitive Computing Scientist',
        timeSec: 15,
        durationSec: 20,
        text: `Thanks, Alex! What's truly fascinating about ${cleanName} is how it balances theoretical elegance with immense practical scaling. Look closely at the Knowledge Graph in your studio right now.`
      },
      {
        id: 'seg-dyn-3',
        speaker: 'Alex',
        speakerRole: 'Lead AI Explainer',
        timeSec: 35,
        durationSec: 20,
        text: `The connections between the core mechanisms and the architectural framework really jump out. It completely changes how we think about information flow.`
      },
      {
        id: 'seg-dyn-4',
        speaker: 'Taylor',
        speakerRole: 'Cognitive Computing Scientist',
        timeSec: 55,
        durationSec: 25,
        text: `Exactly. And for our listeners wanting to test their understanding, the diagnostic quiz and active recall flashcards have already been calibrated against this source material.`
      }
    ]
  };

  const quiz: QuizQuestion[] = [
    {
      id: `q-dyn-1`,
      type: 'mcq',
      question: `What is the primary governing principle behind ${cleanName}?`,
      options: [
        'Sequential step-by-step state accumulation without parallel pathways',
        'Direct information coupling and modular state transformations',
        'Random parameter initialization with zero loss regularization',
        'Manual heuristic rule encoding without latent optimization'
      ],
      correctAnswer: 1,
      explanation: `The architecture relies on direct information coupling and modular state transformations to achieve stable, scalable execution.`,
      sourceRef: `Grounded Synthesis: ${cleanName}`,
      difficulty: 'Intermediate'
    },
    {
      id: `q-dyn-2`,
      type: 'flashcard',
      question: `Key Concept: Define the central objective of ${cleanName}.`,
      front: `What core problem does ${cleanName} solve?`,
      back: `It provides a unified, scalable framework to process complex state interactions while minimizing entropy and vanishing information bottlenecks.`,
      explanation: `Anchors foundational theory directly to empirical implementation.`,
      sourceRef: `Grounded Synthesis: ${cleanName}`,
      difficulty: 'Beginner'
    },
    {
      id: `q-dyn-3`,
      type: 'recall',
      question: `Active Recall: Name two critical advantages of ${cleanName} over traditional approaches.`,
      explanation: `Expected: 1) High parallelizability/throughput, and 2) Eradication of information degradation across long trajectories.`,
      sourceRef: `Grounded Synthesis: ${cleanName}`,
      difficulty: 'Advanced'
    }
  ];

  return { source, graph, explanation, audio, quiz };
}
