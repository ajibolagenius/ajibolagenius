"use client";

import { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  ArrowRight,
  Terminal,
  Brain,
  Smiley,
  CheckCircle,
  Spinner,
  ArrowSquareOut,
  Bookmark,
  Browsers,
  Chat,
  Globe,
  MagnifyingGlass,
  PaperPlaneRight,
  Plus,
  PuzzlePiece,
  Sparkle,
  Tag,
  Trash,
  X,
} from "@phosphor-icons/react/dist/ssr";
import type { Project } from "@/types/project";

// ----------------------------------------------------
// FALLBACK UTILITY BY SLUG
// ----------------------------------------------------
function getShowcaseTypeBySlug(slug: string): string | null {
  if (slug === "narvo_news" || slug === "narvo_intelligence") return "audio";
  if (slug === "narvo_platform") return "api";
  if (slug === "hekaiq") return "duel";
  if (slug === "gorant") return "mood";
  return null;
}

// ----------------------------------------------------
// 1. AUDIO PLAYER SHOWCASE (Narvo News / Intelligence)
// ----------------------------------------------------
const AUDIO_SCRIPTS = {
  chidi: {
    voice: "Chidi (Lagos, English)",
    script: "Good morning. Here is your Narvo daily briefing. Tech investments across West Africa reached a record high this quarter, led by infrastructure developments in Lagos, Nairobi, and Accra. Meanwhile, local payment solutions are seeing a 40 percent surge in cross-border transactions.",
  },
  blessing: {
    voice: "Blessing (Port Harcourt, Pidgin)",
    script: "How far? Dis na your Narvo daily update. Today, inside tech world, money don flow enter West Africa well-well for dis quarter. Lagos, Nairobi and Accra na dem carry the matter for head. Plus cross-border payments don dey blow up by 40 percent as we dey talk.",
  },
};

function AudioShowcase() {
  const [voice, setVoice] = useState<"chidi" | "blessing">("chidi");
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration] = useState(24);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const selected = AUDIO_SCRIPTS[voice];

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            if (timerRef.current) clearInterval(timerRef.current);
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVoiceChange = (v: "chidi" | "blessing") => {
    setVoice(v);
    setIsPlaying(false);
    setProgress(0);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <div className="flex flex-col gap-4 border border-ink/10 bg-panel p-6 rounded font-sans">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-ink/5 pb-4">
        <div>
          <h4 className="text-body-s font-semibold uppercase tracking-wider text-ink">
            📻 Audio Briefing Concept
          </h4>
          <p className="text-body-xs text-ink/60">
            Interactive demo of speech synthesis in localized dialects
          </p>
        </div>
        
        {/* Toggle Pill */}
        <div className="inline-flex self-start border border-ink/10 p-0.5 rounded font-mono text-body-xs bg-cream/40">
          <button
            type="button"
            onClick={() => handleVoiceChange("chidi")}
            className={`px-3 py-1 transition-colors rounded-sm ${
              voice === "chidi"
                ? "bg-ink text-cream font-semibold"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            English (Chidi)
          </button>
          <button
            type="button"
            onClick={() => handleVoiceChange("blessing")}
            className={`px-3 py-1 transition-colors rounded-sm ${
              voice === "blessing"
                ? "bg-ink text-cream font-semibold"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            Pidgin (Blessing)
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={togglePlay}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-cream transition-transform hover:scale-105 active:scale-95"
            aria-label={isPlaying ? "Pause briefing" : "Play briefing"}
          >
            {isPlaying ? (
              <Pause weight="fill" size={20} />
            ) : (
              <Play weight="fill" size={20} className="ml-1" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="relative h-1.5 w-full bg-ink/10 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-accent transition-all duration-1000"
                style={{ width: `${(progress / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-body-xs font-mono text-ink/50 mt-2">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Audio Wave Visuals */}
        <div className="flex items-end justify-between gap-0.5 sm:gap-1 h-12 bg-cream/30 border border-ink/5 px-4 py-2 rounded">
          {Array.from({ length: 32 }).map((_, i) => {
            const h = isPlaying
              ? Math.max(15, Math.sin(progress * 1.8 + i * 0.4) * 35 + 45)
              : 8;
            return (
              <div
                key={i}
                className={`w-1 transition-all duration-300 rounded-t-sm ${
                  isPlaying ? "bg-accent" : "bg-ink/20"
                }`}
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>

        <div className="border border-ink/10 bg-cream/60 p-4 rounded text-body-s italic leading-relaxed text-ink/80">
          &ldquo;{selected.script}&rdquo;
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. API PLAYGROUND SHOWCASE (Narvo Platform)
// ----------------------------------------------------
const API_ROUTES = {
  ingest: {
    method: "POST",
    path: "/v1/ingest",
    body: JSON.stringify(
      {
        url: "https://punchng.com/news/tech-ecosystem-growth",
        publisher: "The Punch",
        language: "en",
      },
      null,
      2
    ),
    response: {
      status: "success",
      id: "ing_928dfa3841",
      ingested_at: "2026-07-17T13:42:01Z",
      articles_queued: 1,
      source_aligned: true,
    },
  },
  enrich: {
    method: "POST",
    path: "/v1/enrich",
    body: JSON.stringify(
      {
        article_id: "ing_928dfa3841",
        target_languages: ["pcm", "yo"],
        enable_summarization: true,
      },
      null,
      2
    ),
    response: {
      status: "completed",
      article_id: "ing_928dfa3841",
      translations: {
        pcm: "Dis na mock Pidgin translation...",
        yo: "Eyi ni itumọ Yoruba...",
      },
      summary: "Tech ecosystem shows rapid adoption of digital payment solutions in West Africa.",
      tokens_processed: 412,
    },
  },
  provenance: {
    method: "GET",
    path: "/v1/provenance?article_id=ing_928dfa3841",
    body: "null (GET Request)",
    response: {
      consensus_score: 0.94,
      evidence_density: "high",
      cross_references: [
        { source: "Africa Check", status: "verified" },
        { source: "Dubawa", status: "verified" },
      ],
      factcheck_match: false,
    },
  },
};

function ApiShowcase() {
  const [route, setRoute] = useState<"ingest" | "enrich" | "provenance">("ingest");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const selected = API_ROUTES[route];

  const handleSend = () => {
    setIsLoading(true);
    setResult(null);
    setTimeout(() => {
      setIsLoading(false);
      setResult(selected.response);
    }, 1200);
  };

  return (
    <div className="flex flex-col gap-4 border border-ink/10 bg-panel p-6 rounded font-mono text-body-s">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-ink/5 pb-4">
        <div>
          <h4 className="font-semibold uppercase tracking-wider text-ink flex items-center gap-2">
            <Terminal size={16} /> API Sandbox Playground
          </h4>
          <p className="text-body-xs font-sans text-ink/60">
            Interactive developer console simulation to query API endpoints
          </p>
        </div>
        
        <select
          value={route}
          onChange={(e: any) => {
            setRoute(e.target.value);
            setResult(null);
          }}
          className="bg-cream border border-ink/15 text-body-xs font-mono py-1.5 px-3 text-ink focus:outline-none focus:border-accent rounded"
        >
          <option value="ingest">POST /v1/ingest</option>
          <option value="enrich">POST /v1/enrich</option>
          <option value="provenance">GET /v1/provenance</option>
        </select>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-stretch font-mono">
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <span className="text-body-xs uppercase text-ink/50 font-semibold font-sans">
            Request payload
          </span>
          <pre className="flex-1 bg-cream/60 border border-ink/10 p-4 text-body-xs text-ink/85 overflow-x-auto min-h-[140px] rounded leading-relaxed">
            {selected.body}
          </pre>
          <button
            type="button"
            onClick={handleSend}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-ink text-cream hover:bg-accent disabled:bg-ink/40 py-2.5 transition-colors font-semibold rounded cursor-pointer"
          >
            {isLoading ? (
              <>
                <Spinner className="animate-spin" size={14} /> Processing...
              </>
            ) : (
              <>
                Send Request <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>

        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <span className="text-body-xs uppercase text-ink/50 font-semibold font-sans">
            Response JSON
          </span>
          <div className="flex-1 bg-cream/30 border border-ink/10 p-4 text-body-xs rounded min-h-[200px] flex items-center justify-center leading-relaxed text-ink/80 overflow-x-auto">
            {isLoading && (
              <div className="flex flex-col items-center gap-2 text-ink/50 font-sans">
                <Spinner className="animate-spin text-accent" size={24} />
                <span>Awaiting endpoint response...</span>
              </div>
            )}
            {!isLoading && !result && (
              <span className="text-ink/40 italic font-sans">
                Click &ldquo;Send Request&rdquo; to execute.
              </span>
            )}
            {!isLoading && result && (
              <pre className="w-full text-left overflow-x-auto leading-relaxed">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. SPHINX ML DUEL SHOWCASE (Heka IQ)
// ----------------------------------------------------
const MATCHES = [
  { teams: "Arsenal vs Chelsea", sphinxHint: "Sphinx tips: Under 2.5 goals. Defensive lock." },
  { teams: "Super Eagles vs Bafana Bafana", sphinxHint: "Sphinx tips: Nigeria Home Win (84% confidence)." },
  { teams: "Manchester City vs Liverpool", sphinxHint: "Sphinx tips: Draw. Open attacking flow." },
];

function DuelShowcase() {
  const [matchIdx, setMatchIdx] = useState(0);
  const [userPick, setUserPick] = useState<"home" | "draw" | "away" | null>(null);
  const [duelState, setDuelState] = useState<"idle" | "loading" | "result">("idle");
  const [sphinxPick, setSphinxPick] = useState("");
  const [verdict, setVerdict] = useState("");

  const currentMatch = MATCHES[matchIdx];

  const handleDuel = () => {
    if (!userPick) return;
    setDuelState("loading");
    setTimeout(() => {
      let sphinxChoice = "home";
      if (matchIdx === 0) sphinxChoice = "draw";
      else if (matchIdx === 2) sphinxChoice = "home";

      setSphinxPick(sphinxChoice);
      setDuelState("result");

      if (userPick === sphinxChoice) {
        setVerdict("TENSE ALIGNMENT: You and Sphinx hold identical tactical predictions!");
      } else {
        setVerdict("TACTICAL DUEL COMMENCED: You have challenged the Sphinx's ML prediction!");
      }
    }, 1500);
  };

  const reset = () => {
    setUserPick(null);
    setDuelState("idle");
  };

  return (
    <div className="flex flex-col gap-4 border border-ink/10 bg-panel p-6 rounded font-sans">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-ink/5 pb-4">
        <div>
          <h4 className="text-body-s font-semibold uppercase tracking-wider text-ink flex items-center gap-2">
            <Brain size={16} className="text-accent" /> Sphinx ML Duel Arena
          </h4>
          <p className="text-body-xs text-ink/60">
            Compare forecasts against Heka's historical neural net model
          </p>
        </div>
        
        <select
          value={matchIdx}
          onChange={(e: any) => {
            setMatchIdx(Number(e.target.value));
            reset();
          }}
          className="bg-cream border border-ink/15 text-body-xs py-1.5 px-3 text-ink focus:outline-none focus:border-accent rounded"
        >
          {MATCHES.map((m, idx) => (
            <option key={idx} value={idx}>
              {m.teams}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-cream/40 p-5 border border-ink/5 rounded flex flex-col gap-4">
        {/* Teams presentation */}
        <div className="flex justify-between items-center text-center py-2.5 px-4 bg-cream border border-ink/5 rounded">
          <span className="text-body-s font-bold text-ink">{currentMatch.teams.split(" vs ")[0]}</span>
          <span className="text-body-xs bg-ink/10 text-ink/65 px-2.5 py-1 rounded font-mono font-semibold">VS</span>
          <span className="text-body-s font-bold text-ink">{currentMatch.teams.split(" vs ")[1]}</span>
        </div>

        {duelState === "idle" && (
          <div className="flex flex-col gap-3">
            <p className="text-body-xs font-semibold uppercase tracking-wider text-ink/50 text-center">
              Pick your forecast
            </p>
            <div className="grid grid-cols-3 gap-2">
              {(["home", "draw", "away"] as const).map((pick) => (
                <button
                  key={pick}
                  type="button"
                  onClick={() => setUserPick(pick)}
                  className={`py-2 text-body-s uppercase font-semibold font-mono border rounded transition-colors ${
                    userPick === pick
                      ? "bg-ink text-cream border-ink font-semibold"
                      : "bg-cream/40 border-ink/10 text-ink/75 hover:border-ink hover:text-ink"
                  }`}
                >
                  {pick}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={handleDuel}
              disabled={!userPick}
              className="mt-2 bg-accent text-cream hover:bg-ink disabled:bg-ink/10 disabled:text-ink/30 py-2.5 transition-colors font-medium rounded flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              Challenge Sphinx ML
            </button>
          </div>
        )}

        {duelState === "loading" && (
          <div className="py-8 flex flex-col items-center gap-3">
            <Spinner className="animate-spin text-accent" size={32} />
            <span className="text-body-s text-ink/60 italic font-mono">
              Sphinx neural parser computing match matrix...
            </span>
          </div>
        )}

        {duelState === "result" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 border border-ink/10 bg-cream rounded">
                <span className="text-body-xs text-ink/50 uppercase block mb-1 font-mono">Your Pick</span>
                <span className="text-body-m font-bold uppercase font-mono text-ink">{userPick}</span>
              </div>
              <div className="p-4 border border-accent/20 bg-accent/5 rounded">
                <span className="text-body-xs text-accent/70 uppercase block mb-1 font-mono">Sphinx Pick</span>
                <span className="text-body-m font-bold uppercase font-mono text-accent">{sphinxPick}</span>
              </div>
            </div>
            
            <div className="border border-ink/5 bg-cream/70 p-3 rounded text-body-s font-medium text-ink/80 text-center leading-relaxed">
              {verdict}
            </div>
            
            <button
              type="button"
              onClick={reset}
              className="border border-ink/20 hover:border-ink text-ink py-2 text-body-s font-medium transition-colors rounded cursor-pointer"
            >
              Reset Duel
            </button>
          </div>
        )}
      </div>
      <p className="text-body-xs font-mono text-ink/40 leading-relaxed italic text-center">
        {currentMatch.sphinxHint}
      </p>
    </div>
  );
}

// ----------------------------------------------------
// 4. ANONYMOUS MOOD/SENTIMENT SHOWCASE (Rant / gorant)
// ----------------------------------------------------
const MOODS = [
  { name: "Angry", emoji: "😡" },
  { name: "Sad", emoji: "😔" },
  { name: "Frustrated", emoji: "😤" },
  { name: "Happy", emoji: "🎉" },
  { name: "Tired", emoji: "😴" },
  { name: "Anxious", emoji: "😰" },
];

const ANONYMOUS_NAMES = [
  "Anonymous Hippo",
  "Friendly Koala",
  "Ranting Badger",
  "Mysterious Otter",
  "Moody Owl",
  "Tactical Sloth",
];

function RantShowcase() {
  const [rantText, setRantText] = useState("");
  const [selectedMood, setSelectedMood] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handlePost = () => {
    if (!rantText.trim()) return;
    setIsAnalyzing(true);
    setAnalysis(null);
    setTimeout(() => {
      const score = Math.floor(Math.random() * 40) + 60;
      const sentiment = rantText.length > 50 ? "Heavy cathartic release" : "Moderate release";
      const randomName = ANONYMOUS_NAMES[Math.floor(Math.random() * ANONYMOUS_NAMES.length)];
      
      setAnalysis({
        name: randomName,
        score,
        sentiment,
        postedAt: "Just now",
      });
      setIsAnalyzing(false);
    }, 1200);
  };

  const handleReset = () => {
    setRantText("");
    setAnalysis(null);
  };

  return (
    <div className="flex flex-col gap-4 border border-ink/10 bg-panel p-6 rounded font-sans">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-ink/5 pb-4">
        <div>
          <h4 className="text-body-s font-semibold uppercase tracking-wider text-ink flex items-center gap-2">
            <Smiley size={16} className="text-accent" /> Anonymous Rant Sandbox
          </h4>
          <p className="text-body-xs text-ink/60">
            Simulate posting an encrypted anonymous thought with automatic mood analysis
          </p>
        </div>
        <span className="text-body-xs font-mono text-ink/40 self-start sm:self-center">
          12 categories configured
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {!analysis && !isAnalyzing && (
          <>
            <textarea
              value={rantText}
              onChange={(e) => setRantText(e.target.value)}
              placeholder="What is on your mind? Write a raw rant..."
              className="w-full min-h-[90px] p-3 text-body-s border border-ink/10 bg-cream text-ink focus:border-accent focus:outline-none placeholder:text-ink/30 rounded"
              maxLength={200}
            />
            <div className="flex justify-between items-center text-body-xs text-ink/40 font-mono">
              <span>Mood selected: {MOODS[selectedMood].emoji} {MOODS[selectedMood].name}</span>
              <span>{rantText.length}/200</span>
            </div>
            
            <div className="grid grid-cols-6 gap-1 bg-ink/[0.02] border border-ink/5 p-1.5 rounded">
              {MOODS.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  title={m.name}
                  onClick={() => setSelectedMood(idx)}
                  className={`py-1.5 text-center border rounded transition-all text-body-m cursor-pointer ${
                    selectedMood === idx
                      ? "border-accent bg-accent/5 scale-105 opacity-100"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  {m.emoji}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handlePost}
              disabled={!rantText.trim()}
              className="bg-ink hover:bg-accent text-cream font-medium py-2.5 transition-colors disabled:bg-ink/10 disabled:text-ink/30 rounded shadow-sm cursor-pointer"
            >
              Post Anonymously
            </button>
          </>
        )}

        {isAnalyzing && (
          <div className="py-8 flex flex-col items-center gap-3 border border-ink/5 bg-cream/40 rounded">
            <Spinner className="animate-spin text-accent" size={32} />
            <span className="text-body-s text-ink/60 italic font-mono">
              Executing lexical polarity and mood density metrics...
            </span>
          </div>
        )}

        {analysis && (
          <div className="flex flex-col gap-4 border border-accent/20 bg-accent/5 p-5 rounded-lg">
            <div className="flex justify-between items-start border-b border-accent/10 pb-3">
              <div>
                <span className="text-body-xs text-ink/50 uppercase block font-mono">Posted by</span>
                <span className="text-body-s font-semibold text-ink">{analysis.name}</span>
              </div>
              <div className="text-right">
                <span className="text-body-xs text-ink/50 uppercase block font-mono">Intensity index</span>
                <span className="text-body-s font-semibold text-accent">{MOODS[selectedMood].emoji} {analysis.score}%</span>
              </div>
            </div>
            
            <div className="text-body-s italic text-ink/75 leading-relaxed bg-cream border border-ink/5 p-4 rounded shadow-inner">
              &ldquo;{rantText}&rdquo;
            </div>

            <div className="flex justify-between items-center text-body-xs text-ink/50 font-mono mt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle weight="fill" className="text-accent" /> {analysis.sentiment}
              </span>
              <span>{analysis.postedAt}</span>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="border border-ink/20 hover:border-ink text-ink py-2 text-body-s font-medium transition-colors rounded mt-2 cursor-pointer"
            >
              Reset Post Editor
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 5. VISUAL BOOKMARK MANAGER SHOWCASE (Mark_me)
// ----------------------------------------------------
function BookmarkShowcase() {
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [stepText, setStepText] = useState("");
  const [bookmark, setBookmark] = useState<any>(null);
  const [showAi, setShowAi] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);

  const PRESETS = [
    {
      title: "Neon Serverless Postgres — Cloud Database with Branching",
      url: "https://neon.tech",
      domain: "neon.tech",
      description: "Neon is a serverless open-source alternative to AWS Aurora Postgres. It separates compute and storage to enable database branching, autoscaling, and cold starts.",
      tags: ["Databases", "Postgres", "Serverless"],
      summary: "Neon decouples database storage from compute nodes, allowing developer workflows to instantly create copy-on-write branches of databases for preview environments, and scale compute to zero when idle.",
      qa: {
        "What is database branching?": "Neon's database branching works similarly to git branching. It utilizes copy-on-write storage technology to instantly clone your database schema and data in seconds, without copying the underlying storage blocks, making it perfect for staging or preview environments.",
        "How does autoscaling work?": "Neon compute nodes can autoscale up to meet high traffic demand, and automatically scale down to zero when the application becomes idle, saving significant hosting costs."
      },
      bg: "from-emerald-500/10 to-teal-500/10"
    },
    {
      title: "OpenRouter — Unified API Interface for leading LLMs",
      url: "https://openrouter.ai",
      domain: "openrouter.ai",
      description: "OpenRouter provides a single unified API to access leading large language models (GPT-4, Claude 3, Llama 3) with dynamic routing, fallback models, and transparent pricing.",
      tags: ["AI", "API", "LLM"],
      summary: "OpenRouter simplifies multi-LLM integrations by presenting a standardized OpenAI-compatible payload format while handling API key routing, user-facing cost optimization, and automatic model fallbacks.",
      qa: {
        "How does model routing work?": "OpenRouter provides a standardized OpenAI-compatible API format. You can call any supported model (like Claude 3, GPT-4, Llama 3) by simply changing the `model` parameter in your HTTP request body.",
        "What models are supported?": "OpenRouter supports over 100 open and closed-source language models, including models from OpenAI, Anthropic, Google, Meta, Mistral, and Cohere."
      },
      bg: "from-orange-500/10 to-red-500/10"
    },
    {
      title: "Drizzle ORM — TypeScript SQL ORM that feels like raw SQL",
      url: "https://orm.drizzle.team",
      domain: "orm.drizzle.team",
      description: "Drizzle ORM is a lightweight TypeScript ORM. It provides query builders, auto-generated migrations, and full typesafety while staying close to traditional SQL syntax.",
      tags: ["TypeScript", "Databases", "ORM"],
      summary: "Unlike heavy ORMs, Drizzle acts as a thin typesafe wrapper over raw SQL queries, generating highly optimized queries and offering precise type inference for database schemas.",
      qa: {
        "Why use Drizzle instead of Prisma?": "Compared to Prisma, Drizzle is much faster and does not require a custom engine binary. It uses standard SQL queries, making it perfect for serverless edge execution with low cold starts.",
        "How do migrations work?": "Drizzle offers an automated CLI (`drizzle-kit`) to generate database migration SQL files based on schema changes. You can run migrations safely across any Postgres database."
      },
      bg: "from-yellow-500/10 to-amber-500/10"
    }
  ];

  const handleMark = (idx: number) => {
    setSelectedPresetIdx(idx);
    setStatus("loading");
    setBookmark(null);
    setShowAi(false);
    setSelectedQuestion(null);
    
    const steps = [
      "Scraping page metadata...",
      "Analyzing visual previews...",
      "Generating OpenRouter AI summary...",
      "Bookmark ready!"
    ];

    let current = 0;
    setStepText(steps[current]);
    
    const interval = setInterval(() => {
      current++;
      if (current < steps.length) {
        setStepText(steps[current]);
      } else {
        clearInterval(interval);
        setStatus("success");
        setBookmark(PRESETS[idx]);
      }
    }, 400);
  };

  return (
    <div className="flex flex-col gap-4 border border-ink/10 bg-panel p-6 rounded font-sans text-body-s max-w-xl mx-auto">
      <div>
        <h4 className="text-body-s font-semibold uppercase tracking-wider text-ink flex items-center gap-2">
          <Bookmark size={18} weight="fill" className="text-accent" /> mark_me Sandbox Concept
        </h4>
        <p className="text-body-xs text-ink/65 mt-0.5">
          Simulate bookmarking a webpage and parsing its contents with OpenRouter AI.
        </p>
      </div>

      {/* Preset Buttons Grid */}
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-mono uppercase text-ink/50 tracking-wider font-semibold">
          Select a page to bookmark:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {PRESETS.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleMark(idx)}
              disabled={status === "loading"}
              className={`py-2 px-3 border border-ink/15 text-body-xs font-mono rounded text-left transition-all flex items-center justify-between cursor-pointer ${
                selectedPresetIdx === idx && status === "success"
                  ? "bg-ink text-cream border-ink font-semibold"
                  : "bg-cream/40 text-ink hover:border-ink hover:bg-cream"
              }`}
            >
              <span>{p.domain}</span>
              <Plus size={10} />
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {status === "loading" && (
        <div className="border border-ink/10 bg-cream/40 p-6 rounded text-center flex flex-col items-center gap-3">
          <Spinner className="animate-spin text-accent" size={24} />
          <span className="font-mono text-body-xs text-ink/60 italic">{stepText}</span>
        </div>
      )}

      {/* Resulting Bookmarked Card */}
      {status === "success" && bookmark && (
        <div className="border border-ink/15 bg-cream rounded shadow-sm overflow-hidden animate-fade-in-up flex flex-col">
          {/* Card Header (Simulated Webpage Screenshot / Theme Header) */}
          <div className={`h-16 bg-gradient-to-r ${bookmark.bg} flex items-center px-4 border-b border-ink/5`}>
            <div className="flex items-center gap-1.5 bg-cream/90 backdrop-blur border border-ink/10 px-2 py-0.5 rounded text-body-xs font-mono text-ink/75">
              <Globe size={12} />
              <span>{bookmark.domain}</span>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4 flex flex-col gap-3">
            <div className="flex flex-col gap-1">
              <h5 className="font-bold text-body-s text-ink leading-tight">
                {bookmark.title}
              </h5>
              <p className="text-body-xs text-ink/60 leading-normal">
                {bookmark.description}
              </p>
            </div>

            {/* Tag Pills */}
            <div className="flex flex-wrap gap-1.5">
              {bookmark.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-ink/5 border border-ink/5 text-[9px] font-mono uppercase px-1.5 py-0.5 text-ink/75 rounded"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* AI Summarizer Expandable trigger */}
            <div className="border-t border-ink/5 pt-3 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowAi(!showAi)}
                className="flex items-center gap-1.5 text-body-xs font-semibold text-accent hover:text-ink transition-colors cursor-pointer"
              >
                <Sparkle size={12} weight="fill" />
                {showAi ? "Hide AI Summary" : "Ask OpenRouter AI"}
              </button>
              <span className="text-[10px] font-mono text-ink/40">Saved just now</span>
            </div>

            {/* AI Drawer Block */}
            {showAi && (
              <div className="mt-3 pt-3 border-t border-ink/5 flex flex-col gap-3 animate-fade-in-up">
                <div className="bg-accent/5 border border-accent/10 p-3 rounded text-body-xs text-ink/80 italic leading-relaxed">
                  <span className="font-bold uppercase text-[9px] text-accent block font-mono not-italic mb-1">
                    AI Summary Preview
                  </span>
                  &ldquo;{bookmark.summary}&rdquo;
                </div>

                {/* Pre-set questions block */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-mono uppercase text-ink/40 font-semibold">
                    Ask a question about this resource:
                  </span>
                  <div className="flex flex-col gap-1.5">
                    {Object.keys(bookmark.qa).map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setSelectedQuestion(selectedQuestion === q ? null : q)}
                        className={`text-left text-body-xs font-mono border p-2 rounded transition-colors cursor-pointer ${
                          selectedQuestion === q
                            ? "bg-ink border-ink text-cream"
                            : "bg-cream/20 border-ink/10 text-ink/75 hover:border-ink hover:text-ink"
                        }`}
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Answer speech bubble */}
                {selectedQuestion && (
                  <div className="bg-panel border border-ink/10 p-3 rounded text-body-xs text-ink/80 leading-relaxed rounded-tl-none animate-fade-in-up">
                    <span className="font-bold text-[9px] uppercase block text-ink/50 font-mono mb-1">
                      mark_me AI Answer
                    </span>
                    {bookmark.qa[selectedQuestion]}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

// ----------------------------------------------------
// 6. MAIN SHOWCASE WRAPPER (FALLBACK & DATABASE DRIVEN)
// ----------------------------------------------------
export function ProjectShowcase({ project }: { project: Project }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Graceful degradation: Check showcase_type first, fallback to checking the slug
  const type = project.showcase_type || getShowcaseTypeBySlug(project.slug);

  if (!mounted || !type) return null;

  return (
    <section className="flex flex-col gap-3 mt-6 print:hidden">
      <h3 className="text-h3 font-normal text-ink">Showcase Concept</h3>
      {type === "audio" && <AudioShowcase />}
      {type === "api" && <ApiShowcase />}
      {type === "duel" && <DuelShowcase />}
      {type === "mood" && <RantShowcase />}
      {type === "bookmark" && <BookmarkShowcase />}
    </section>
  );
}
