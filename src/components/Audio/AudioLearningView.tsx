import React, { useState, useEffect, useRef } from 'react';
import { 
  Headphones, 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Rewind, 
  Volume2, 
  Radio, 
  Sparkles, 
  Settings as SettingsIcon,
  Download,
  Share2,
  Check,
  Zap,
  Mic,
  Sliders
} from 'lucide-react';
import { AudioOverview, AppSettings, DialogueSegment } from '../../types';
import { speakWithWebSpeech, stopWebSpeech, generateSpeechElevenLabs } from '../../services/elevenlabs';

interface AudioLearningViewProps {
  overview: AudioOverview;
  settings: AppSettings;
  onOpenSettings: () => void;
}

export const AudioLearningView: React.FC<AudioLearningViewProps> = ({
  overview,
  settings,
  onOpenSettings,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isGeneratingElevenLabs, setIsGeneratingElevenLabs] = useState(false);
  const [elevenLabsAudioUrl, setElevenLabsAudioUrl] = useState<string | null>(null);
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  const activeSegmentRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<any>(null);

  // Determine current active dialogue segment based on currentTime
  const currentSegment = overview.segments.find((seg) => {
    return currentTime >= seg.timeSec && currentTime < (seg.timeSec + seg.durationSec);
  }) || overview.segments[0];

  // Playback timer ticker
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= overview.duration) {
            setIsPlaying(false);
            stopWebSpeech();
            return 0;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, overview.duration]);

  // Sync Web Speech whenever the dialogue segment changes during play
  useEffect(() => {
    if (isPlaying && !elevenLabsAudioUrl) {
      if (currentSegment) {
        speakWithWebSpeech(currentSegment.text, currentSegment.speaker);
      }
    }
  }, [currentSegment?.id, isPlaying, elevenLabsAudioUrl]);

  // Clean up speech on unmount
  useEffect(() => {
    return () => {
      stopWebSpeech();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopWebSpeech();
    } else {
      setIsPlaying(true);
      if (currentSegment && !elevenLabsAudioUrl) {
        speakWithWebSpeech(currentSegment.text, currentSegment.speaker);
      }
    }
  };

  const handleSeek = (newTime: number) => {
    stopWebSpeech();
    setCurrentTime(newTime);
    if (isPlaying && !elevenLabsAudioUrl) {
      const seg = overview.segments.find(s => newTime >= s.timeSec && newTime < (s.timeSec + s.durationSec));
      if (seg) speakWithWebSpeech(seg.text, seg.speaker);
    }
  };

  const handleSkip = (seconds: number) => {
    const nextTime = Math.max(0, Math.min(overview.duration, currentTime + seconds));
    handleSeek(nextTime);
  };

  // Trigger real ElevenLabs API generation
  const handleGenerateWithElevenLabs = async () => {
    if (!settings.elevenLabsApiKey) {
      onOpenSettings();
      return;
    }

    setIsGeneratingElevenLabs(true);
    setApiErrorMessage(null);

    try {
      // Synthesize first segment or dialogue summary via ElevenLabs REST API
      const textToSynthesize = currentSegment?.text || overview.segments[0].text;
      const voiceId = currentSegment?.speaker === 'Taylor' 
        ? (settings.elevenLabsVoiceGuest || 'AZnzlk1XvdvUeBnXmlld')
        : (settings.elevenLabsVoiceHost || '21m00Tcm4TlvDq8ikWAM');

      const audioUrl = await generateSpeechElevenLabs(
        textToSynthesize,
        voiceId,
        settings.elevenLabsApiKey
      );

      setElevenLabsAudioUrl(audioUrl);
      const audio = new Audio(audioUrl);
      audio.playbackRate = playbackSpeed;
      audio.play();
      setIsPlaying(true);
    } catch (err: any) {
      setApiErrorMessage(err?.message || 'ElevenLabs API call failed. Verify your API key.');
    } finally {
      setIsGeneratingElevenLabs(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Audio Studio Banner */}
      <div className="glass-panel-elevated p-6 sm:p-8 rounded-2xl relative overflow-hidden">
        <div className="orb-purple w-96 h-96 -top-20 -left-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                NotebookLM-Style Deep Dive
              </span>
              <span className="text-xs text-slate-400 font-mono">Dual-Host Audio Synthesis</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              {overview.title}
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Listen to Alex and Dr. Taylor break down the core intuition, mathematical boundaries, and historical turning points in this interactive audio podcast.
            </p>
          </div>

          {/* Engine Status & ElevenLabs Generator */}
          <div className="flex flex-col items-start md:items-end space-y-2">
            <div className="flex items-center space-x-2">
              {settings.isElevenLabsConfigured ? (
                <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-emerald-400" />
                  <span>ElevenLabs Active</span>
                </span>
              ) : (
                <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono flex items-center space-x-1.5">
                  <Radio className="w-3.5 h-3.5 text-electric-cyan" />
                  <span>Web Audio Engine (Demo)</span>
                </span>
              )}

              <button
                onClick={onOpenSettings}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition"
                title="Configure ElevenLabs API Key"
              >
                <SettingsIcon className="w-4 h-4 text-purple-400" />
              </button>
            </div>

            <button
              onClick={handleGenerateWithElevenLabs}
              disabled={isGeneratingElevenLabs}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-electric-cyan hover:from-purple-500 hover:to-cyan-400 text-white text-xs font-bold shadow-glow-purple border border-white/20 transition flex items-center space-x-1.5"
            >
              {isGeneratingElevenLabs ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>Generating ElevenLabs Voice...</span>
                </>
              ) : (
                <>
                  <Mic className="w-4 h-4 text-white" />
                  <span>{settings.isElevenLabsConfigured ? 'Synthesize with ElevenLabs' : 'Connect ElevenLabs API'}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {apiErrorMessage && (
          <div className="mt-4 p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-xs text-red-200">
            {apiErrorMessage}
          </div>
        )}
      </div>

      {/* Main Audio Player Card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-6">
        
        {/* Dynamic Waveform Visualizer */}
        <div className="h-20 bg-navy-950 rounded-xl border border-white/5 p-4 flex items-center justify-center space-x-1 sm:space-x-1.5 overflow-hidden relative">
          <div className="absolute top-2 left-3 flex items-center space-x-1 text-[10px] font-mono text-slate-500">
            <Radio className={`w-3 h-3 ${isPlaying ? 'text-electric-cyan animate-pulse' : 'text-slate-600'}`} />
            <span>{isPlaying ? 'ACTIVE AUDIO STREAM' : 'STANDBY'}</span>
          </div>

          {Array.from({ length: 48 }).map((_, i) => {
            const heightPercent = isPlaying
              ? Math.sin(i * 0.4 + currentTime * 2) * 35 + 45
              : 15;
            return (
              <div
                key={i}
                className="w-1.5 rounded-full transition-all duration-150"
                style={{
                  height: `${heightPercent}%`,
                  background: isPlaying
                    ? 'linear-gradient(to top, #8B5CF6, #00F0FF)'
                    : 'rgba(255, 255, 255, 0.1)',
                }}
              />
            );
          })}
        </div>

        {/* Scrubber / Progress Bar */}
        <div className="space-y-1.5">
          <input
            type="range"
            min="0"
            max={overview.duration}
            value={currentTime}
            onChange={(e) => handleSeek(Number(e.target.value))}
            className="w-full h-1.5 bg-navy-950 rounded-lg appearance-none cursor-pointer accent-electric-cyan"
          />
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(overview.duration)}</span>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-white/5">
          
          {/* Left: Speaker Identity */}
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs ${
              currentSegment?.speaker === 'Taylor'
                ? 'bg-purple-600 text-white shadow-glow-purple'
                : 'bg-electric-cyan text-navy-950 shadow-glow-cyan'
            }`}>
              {currentSegment?.speaker === 'Taylor' ? 'DR. T' : 'ALEX'}
            </div>
            <div>
              <span className="text-xs font-bold text-white block">
                {currentSegment?.speaker === 'Taylor' ? 'Dr. Taylor' : 'Alex'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {currentSegment?.speakerRole}
              </span>
            </div>
          </div>

          {/* Center: Play / Pause / Skip Controls */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => handleSkip(-15)}
              className="p-2.5 rounded-xl bg-navy-900/80 hover:bg-navy-800 text-slate-300 hover:text-white border border-white/5 transition"
              title="Rewind 15 seconds"
            >
              <Rewind className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-electric-cyan hover:scale-105 active:scale-95 text-white flex items-center justify-center shadow-glow-purple transition"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-6 h-6 fill-current text-white" />
              ) : (
                <Play className="w-6 h-6 fill-current text-white translate-x-0.5" />
              )}
            </button>

            <button
              onClick={() => handleSkip(15)}
              className="p-2.5 rounded-xl bg-navy-900/80 hover:bg-navy-800 text-slate-300 hover:text-white border border-white/5 transition"
              title="Fast forward 15 seconds"
            >
              <FastForward className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Playback Speed Selector */}
          <div className="flex items-center space-x-1.5 bg-navy-950 p-1 rounded-xl border border-white/5">
            {[0.75, 1.0, 1.25, 1.5, 2.0].map((speed) => (
              <button
                key={speed}
                onClick={() => setPlaybackSpeed(speed)}
                className={`px-2 py-1 rounded-lg text-xs font-mono font-semibold transition ${
                  playbackSpeed === speed
                    ? 'bg-purple-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {speed}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Real-time Synchronized Karaoke Transcript */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center space-x-2">
              <Headphones className="w-4 h-4 text-electric-cyan" />
              <span>Interactive Synchronized Transcript</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Click any dialogue segment to jump directly to that point in the audio conversation.
            </p>
          </div>
          <span className="text-xs text-purple-300 font-mono">
            {overview.segments.length} dialogue turns
          </span>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {overview.segments.map((seg) => {
            const isActive = currentSegment?.id === seg.id;
            const isTaylor = seg.speaker === 'Taylor';

            return (
              <div
                key={seg.id}
                ref={isActive ? activeSegmentRef : null}
                onClick={() => handleSeek(seg.timeSec)}
                className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-950/80 to-navy-900 border-electric-cyan shadow-glow-cyan scale-[1.01]'
                    : 'glass-card hover:border-white/20 opacity-80'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2 h-2 rounded-full ${isTaylor ? 'bg-purple-400' : 'bg-electric-cyan'}`} />
                    <span className={`text-xs font-bold font-mono ${isTaylor ? 'text-purple-300' : 'text-cyan-300'}`}>
                      {seg.speaker} ({seg.speakerRole})
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {formatTime(seg.timeSec)}
                  </span>
                </div>

                <p className={`text-xs sm:text-sm leading-relaxed ${
                  isActive ? 'text-white font-medium' : 'text-slate-300'
                }`}>
                  {seg.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
