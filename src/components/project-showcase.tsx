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
  if (slug === "mark_me") return "bookmark";
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
interface BookmarkItem {
  id: string;
  title: string;
  url: string;
  domain: string;
  description: string;
  tags: string[];
  aiSummary: string;
  addedAt: string;
  bgGradient: string;
}

const INITIAL_BOOKMARKS: BookmarkItem[] = [
  {
    id: "bm-1",
    title: "Tailwind CSS v4.0 — The CSS-first utility library",
    url: "https://tailwindcss.com",
    domain: "tailwindcss.com",
    description: "Tailwind CSS is a utility-first CSS framework for rapid UI development. Version 4.0 introduces an all-new Rust compiler, CSS-first configuration, and native cascading support.",
    tags: ["Design", "CSS", "Frontend"],
    aiSummary: "Version 4.0 is rebuilt from the ground up to be ultra-fast using a custom Rust compiler. It replaces JavaScript-based configuration files with pure CSS variables, simplifying themes and imports.",
    addedAt: "2 hours ago",
    bgGradient: "from-cyan-500/10 to-blue-500/10"
  },
  {
    id: "bm-2",
    title: "tRPC — Move fast and break nothing with end-to-end typesafety",
    url: "https://trpc.io",
    domain: "trpc.io",
    description: "tRPC allows you to build & consume fully typesafe APIs, without schemas or code generation. It shares TypeScript types directly between server and client components.",
    tags: ["TypeScript", "API", "Backend"],
    aiSummary: "tRPC enforces compile-time safety across the network boundary by linking server routers directly to client queries, preventing runtime mismatches when endpoints are updated.",
    addedAt: "1 day ago",
    bgGradient: "from-indigo-500/10 to-purple-500/10"
  },
  {
    id: "bm-3",
    title: "Serwist — Robust offline-first PWA integrations for Next.js 15",
    url: "https://serwist.dev",
    domain: "serwist.dev",
    description: "Serwist is a library for building PWAs with Next.js, supporting service workers, workbox-style caching policies, and reliable background synchronization.",
    tags: ["PWA", "Offline", "Next.js"],
    aiSummary: "A modern fork of Workbox updated for React 19 and Next.js 15, Serwist enables seamless offline fallback caching, background syncing via IndexedDB, and customizable service worker logic.",
    addedAt: "3 days ago",
    bgGradient: "from-emerald-500/10 to-teal-500/10"
  }
];

const PRESETS = [
  {
    title: "Neon Serverless Postgres — Cloud Database with Branching",
    url: "https://neon.tech",
    domain: "neon.tech",
    description: "Neon is a serverless open-source alternative to AWS Aurora Postgres. It separates compute and storage to enable database branching, autoscaling, and cold starts.",
    tags: ["Databases", "PostgreSQL", "Cloud"],
    aiSummary: "Neon decouples database storage from compute nodes, allowing developer workflows to instantly create copy-on-write branches of databases for preview environments, and scale compute to zero when idle.",
    bgGradient: "from-green-500/10 to-emerald-600/10"
  },
  {
    title: "OpenRouter — Unified API Interface for leading LLMs",
    url: "https://openrouter.ai",
    domain: "openrouter.ai",
    description: "OpenRouter provides a single unified API to access leading large language models (GPT-4, Claude 3, Llama 3) with dynamic routing, fallback models, and transparent pricing.",
    tags: ["AI", "API", "Integration"],
    aiSummary: "OpenRouter simplifies multi-LLM integrations by presenting a standardized OpenAI-compatible payload format while handling API key routing, user-facing cost optimization, and automatic model fallbacks.",
    bgGradient: "from-orange-500/10 to-red-500/10"
  },
  {
    title: "Drizzle ORM — TypeScript SQL ORM that feels like raw SQL",
    url: "https://orm.drizzle.team",
    domain: "orm.drizzle.team",
    description: "Drizzle ORM is a lightweight TypeScript ORM. It provides query builders, auto-generated migrations, and full typesafety while staying close to traditional SQL syntax.",
    tags: ["TypeScript", "Databases", "ORM"],
    aiSummary: "Unlike heavy ORMs, Drizzle acts as a thin typesafe wrapper over raw SQL queries, generating highly optimized queries and offering precise type inference for database schemas.",
    bgGradient: "from-yellow-500/10 to-amber-500/10"
  }
];

const MOCK_AI_RESPONSES: Record<string, Record<string, string>> = {
  "bm-1": {
    "config": "Tailwind CSS v4.0 removes JavaScript configurations (tailwind.config.js) and replaces them with pure CSS variables. This speeds up build times and makes configuring custom utilities, classes, and overrides as simple as writing native CSS variables under the `@theme` directive.",
    "performance": "v4.0 features an all-new Rust compiler that is up to 10x faster than the previous v3 engine, with incremental rebuilds taking as little as 0.1ms.",
    "rust": "The core parsing and compilation is written in Rust, replacing the JavaScript-based PostCSS pipeline to deliver blazing-fast styling compilation.",
    "default": "Tailwind CSS v4.0 is a CSS-first engine featuring a Rust compiler, dynamic cascading themes, and automatic browser prefixing. It's designed to be modern, lightweight, and incredibly fast."
  },
  "bm-2": {
    "types": "tRPC works by sharing your server's TypeScript types (the AppRouter type definition) directly with your frontend client. Because it only shares the type signature and not the actual implementation code, your frontend remains secure and lightweight.",
    "rsc": "tRPC fully supports Next.js App Router and React Server Components (RSC). You can query procedures directly in server components using normal async calls without fetching over HTTP locally.",
    "codegen": "Unlike GraphQL or OpenAPI, tRPC doesn't require any code generation steps. You write your backend resolvers, and the client-side types are immediately resolved in real-time.",
    "default": "tRPC is an excellent utility that provides end-to-end typesafety for Next.js applications, sharing backend routers with the frontend client seamlessly without manual API schemas."
  },
  "bm-3": {
    "pwa": "Serwist is an offline-first PWA library built as a modern replacement for Workbox. It handles caching, precaching, background synchronization, and push notifications in Next.js 15 apps.",
    "offline": "Offline caching is handled using service workers that intercept browser requests, serving precached assets from cache storage first, and syncing back-channel requests once network connectivity is restored.",
    "workbox": "Serwist is a modern fork of Workbox, redesigned specifically for TypeScript integration and modern React 19/Next.js 15 environments.",
    "default": "Serwist provides Next.js 15 applications with robust offline-first service worker integrations, supporting precaching assets, API caching, and background synchronization."
  },
  "neon": {
    "branching": "Neon database branching lets you instantly clone your database, including both schema and data, in under a second. It uses copy-on-write storage technology, meaning branches share underlying data blocks until changes are made. This is perfect for preview environments and CI/CD pipelines.",
    "autoscaling": "Neon compute nodes can autoscale up to meet high traffic demand, and automatically scale down to zero when the application becomes idle, saving significant hosting costs.",
    "serverless": "Neon separates storage and compute. Compute runs on lightweight VM instances while storage is built on a custom distributed storage engine, making PostgreSQL serverless and cloud-native.",
    "default": "Neon serverless Postgres is an outstanding database for modern applications, offering database branching, autoscaling, and perfect integration with Vercel and Netlify previews."
  },
  "openrouter": {
    "api": "OpenRouter provides a standardized OpenAI-compatible API format. You can call any supported model (like Claude 3, GPT-4, Llama 3) by simply changing the `model` parameter in your HTTP request body.",
    "models": "OpenRouter supports over 100 open and closed-source language models, including models from OpenAI, Anthropic, Google, Meta, Mistral, and Cohere.",
    "cost": "OpenRouter acts as an aggregator, providing competitive, raw-token pricing and routing queries to the cheapest and fastest provider for each model.",
    "default": "OpenRouter acts as an intelligent API routing gateway to easily query any major LLM from a single endpoint with zero configuration hassles."
  },
  "drizzle": {
    "orm": "Drizzle is a TypeScript-first ORM that lets you write queries using SQL-like syntax. It is extremely lightweight, has zero dependencies, and doesn't hide SQL query execution, ensuring optimal database performance.",
    "migrations": "Drizzle offers an automated CLI (`drizzle-kit`) to generate database migration SQL files based on schema changes. You can run migrations safely across any Postgres database.",
    "prisma": "Compared to Prisma, Drizzle is much faster and does not require a custom engine binary. It uses standard SQL queries, making it perfect for serverless edge execution with low cold starts.",
    "default": "Drizzle ORM is a lightweight TypeScript ORM that offers type-safe, SQL-like query builders and automated database migrations, perfectly optimized for serverless environments."
  }
};

function getPresetQuestionsForBookmark(id: string): string[] {
  if (id === "bm-1") return ["How does configuration work in v4?", "Tell me about the Rust compiler performance.", "Is it written in Rust?"];
  if (id === "bm-2") return ["Does it work with React Server Components?", "How does typesafety work without codegen?", "What is the core benefit?"];
  if (id === "bm-3") return ["How does offline-first sync work?", "Is Serwist related to Workbox?", "How to cache API requests?"];
  if (id.includes("neon")) return ["What is database branching?", "How does autoscaling work?", "Why separate compute and storage?"];
  if (id.includes("openrouter")) return ["How does model routing work?", "What models are supported?", "How is it priced?"];
  if (id.includes("drizzle")) return ["Why use Drizzle instead of Prisma?", "How does migrations tooling work?", "Is it fast?"];
  return ["Tell me more about this link.", "What are the tags used for?", "How can AI help summarize?"];
}

function BookmarkShowcase() {
  const [activeTab, setActiveTab] = useState<"dashboard" | "extension">("dashboard");
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(INITIAL_BOOKMARKS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");
  
  // Link adder states
  const [customUrl, setCustomUrl] = useState("");
  const [selectedPresetIdx, setSelectedPresetIdx] = useState<number | "custom">("custom");
  const [isAdding, setIsAdding] = useState(false);
  const [addProgress, setAddProgress] = useState(0);
  const [addProgressText, setAddProgressText] = useState("");
  
  // Extension states
  const [extSaved, setExtSaved] = useState(false);
  const [extLoading, setExtLoading] = useState(false);
  const [extProgress, setExtProgress] = useState(0);
  
  // AI assistant drawer states
  const [activeBookmark, setActiveBookmark] = useState<BookmarkItem | null>(null);
  const [chatHistory, setChatHistory] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatResponding, setIsChatResponding] = useState(false);
  
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-close AI drawer or scroll Chat when active bookmark changes
  useEffect(() => {
    if (activeBookmark) {
      setChatHistory([
        {
          sender: "ai",
          text: `Hi! I have parsed & analyzed the bookmark for "${activeBookmark.title}". Ask me anything about its features, architectural stack, or implementation!`
        }
      ]);
    }
  }, [activeBookmark]);

  // Aggregate all tags dynamically
  const allTags = ["All", ...Array.from(new Set(bookmarks.flatMap(b => b.tags)))];

  const handleAddBookmark = (presetIdx: number | "custom", directUrl?: string) => {
    setIsAdding(true);
    setAddProgress(0);
    
    let presetItem = presetIdx !== "custom" ? PRESETS[presetIdx] : null;
    let urlToUse = directUrl || customUrl;
    
    if (presetItem) {
      urlToUse = presetItem.url;
    } else if (!urlToUse.trim()) {
      setIsAdding(false);
      return;
    }
    
    // Construct new bookmark metadata dynamically
    const id = "neon-" + Math.floor(Math.random() * 1000);
    const domain = urlToUse.replace(/https?:\/\/(www\.)?/, "").split("/")[0];
    const newBookmark: BookmarkItem = {
      id: presetItem ? `preset-${presetIdx}` : id,
      title: presetItem?.title || `Resource Page from ${domain}`,
      url: urlToUse,
      domain,
      description: presetItem?.description || "Visual bookmark captured from custom URL parser, generating automated previews and page metadata.",
      tags: presetItem?.tags || ["Custom", "Imported"],
      aiSummary: presetItem?.aiSummary || `Automatically extracted summary of ${domain}. Analyzed elements show it is a utility focusing on developer workspace organization and visual link cataloging.`,
      addedAt: "Just now",
      bgGradient: presetItem?.bgGradient || "from-pink-500/10 to-rose-500/10"
    };

    // Progression texts
    const steps = [
      { p: 15, t: "Connecting to address & checking headers..." },
      { p: 40, t: "Parsing HTML metadata and favicon link..." },
      { p: 70, t: "Extracting semantic description via OpenRouter AI..." },
      { p: 90, t: "Generating visual layout preview cards..." },
      { p: 100, t: "Success! Saved to index." }
    ];

    let currentStep = 0;
    progressTimerRef.current = setInterval(() => {
      if (currentStep < steps.length) {
        setAddProgress(steps[currentStep].p);
        setAddProgressText(steps[currentStep].t);
        currentStep++;
      } else {
        if (progressTimerRef.current) clearInterval(progressTimerRef.current);
        setBookmarks(prev => [newBookmark, ...prev]);
        setIsAdding(false);
        setCustomUrl("");
        setSelectedPresetIdx("custom");
      }
    }, 400);
  };

  const handleSaveFromExtension = () => {
    setExtLoading(true);
    setExtProgress(0);
    
    const steps = [20, 50, 80, 100];
    let stepIdx = 0;
    
    const timer = setInterval(() => {
      if (stepIdx < steps.length) {
        setExtProgress(steps[stepIdx]);
        stepIdx++;
      } else {
        clearInterval(timer);
        setExtSaved(true);
        setExtLoading(false);
        
        // Add OpenRouter bookmark if not already there
        const alreadyExists = bookmarks.some(b => b.domain === "openrouter.ai");
        if (!alreadyExists) {
          const neonPreset = PRESETS[1]; // OpenRouter
          const newBookmark: BookmarkItem = {
            id: "preset-1",
            title: neonPreset.title,
            url: neonPreset.url,
            domain: neonPreset.domain,
            description: neonPreset.description,
            tags: neonPreset.tags,
            aiSummary: neonPreset.aiSummary,
            addedAt: "Added via Extension",
            bgGradient: neonPreset.bgGradient
          };
          setBookmarks(prev => [newBookmark, ...prev]);
        }
      }
    }, 300);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setBookmarks(prev => prev.filter(b => b.id !== id));
    if (activeBookmark?.id === id) {
      setActiveBookmark(null);
    }
  };

  const handleSendChat = (questionText?: string) => {
    const textToSend = questionText || chatInput;
    if (!textToSend.trim() || !activeBookmark) return;
    
    const userMsg = { sender: "user" as const, text: textToSend };
    setChatHistory(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatResponding(true);
    
    // Simulate AI thinking and retrieving response from keyword map
    setTimeout(() => {
      const bMarkKey = activeBookmark.id.startsWith("preset-") 
        ? activeBookmark.id.replace("preset-", "")
        : activeBookmark.id;
      
      let bookmarkGroup = "default";
      if (bMarkKey === "0") bookmarkGroup = "neon";
      else if (bMarkKey === "1") bookmarkGroup = "openrouter";
      else if (bMarkKey === "2") bookmarkGroup = "drizzle";
      else bookmarkGroup = bMarkKey;
      
      const responses = MOCK_AI_RESPONSES[bookmarkGroup] || {};
      
      // Match keywords in user question
      const queryLower = textToSend.toLowerCase();
      let matchedResponse = responses["default"] || "I am analyzing this bookmark. Could you clarify your question? You can ask about its architecture, performance, configuration, or benefits.";
      
      for (const [key, value] of Object.entries(responses)) {
        if (key !== "default" && queryLower.includes(key)) {
          matchedResponse = value;
          break;
        }
      }

      setChatHistory(prev => [...prev, { sender: "ai" as const, text: matchedResponse }]);
      setIsChatResponding(false);
    }, 1000);
  };

  // Filtered bookmarks list
  const filteredBookmarks = bookmarks.filter(b => {
    const matchesSearch = b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = selectedTag === "All" || b.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  return (
    <div className="flex flex-col gap-6 border border-ink/10 bg-panel p-4 sm:p-6 rounded font-sans text-body-s">
      
      {/* Header and Pill Toggle */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-ink/5 pb-4">
        <div>
          <h4 className="text-body-s font-semibold uppercase tracking-wider text-ink flex items-center gap-2">
            <Bookmark size={18} weight="fill" className="text-accent" /> mark_me Visual Playground
          </h4>
          <p className="text-body-xs text-ink/60 mt-0.5">
            Visual bookmark manager featuring Next.js 15, Drizzle ORM, and automated OpenRouter AI summaries.
          </p>
        </div>

        {/* View Switcher Pill */}
        <div className="inline-flex self-start border border-ink/10 p-0.5 rounded font-mono text-body-xs bg-cream/40">
          <button
            type="button"
            onClick={() => { setActiveTab("dashboard"); setExtSaved(false); }}
            className={`px-3 py-1.5 transition-colors rounded-sm flex items-center gap-1.5 cursor-pointer ${
              activeTab === "dashboard"
                ? "bg-ink text-cream font-semibold"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            <Browsers size={14} /> Web App Dashboard
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("extension")}
            className={`px-3 py-1.5 transition-colors rounded-sm flex items-center gap-1.5 cursor-pointer ${
              activeTab === "extension"
                ? "bg-ink text-cream font-semibold"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            <PuzzlePiece size={14} /> Chrome Extension
          </button>
        </div>
      </div>

      {activeTab === "dashboard" ? (
        <div className="flex flex-col gap-5">
          
          {/* Top Panel: Add link & Presets */}
          <div className="flex flex-col md:flex-row gap-3 bg-cream/60 border border-ink/5 p-4 rounded-lg">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-body-xs font-semibold uppercase text-ink/50 tracking-wider">
                Mark a New Bookmark
              </label>
              <div className="flex">
                <input
                  type="url"
                  placeholder="https://example.com/some-resource"
                  value={selectedPresetIdx === "custom" ? customUrl : PRESETS[selectedPresetIdx].url}
                  onChange={(e) => {
                    setCustomUrl(e.target.value);
                    setSelectedPresetIdx("custom");
                  }}
                  disabled={isAdding}
                  className="flex-1 border-2 border-r-0 border-ink bg-cream px-3 py-2 text-body-s text-ink placeholder:text-ink/30 focus:outline-none rounded-l-md font-mono"
                />
                <button
                  type="button"
                  onClick={() => handleAddBookmark(selectedPresetIdx)}
                  disabled={isAdding || (selectedPresetIdx === "custom" && !customUrl.trim())}
                  className="bg-accent border-2 border-ink border-l-0 text-cream px-4 py-2 hover:bg-ink font-bold shadow-[2px_2px_0px_0px_var(--color-ink)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[0px] active:translate-y-[0px] transition-all rounded-r-md cursor-pointer flex items-center gap-1 shrink-0 disabled:opacity-40"
                >
                  <Plus size={16} weight="bold" /> Mark
                </button>
              </div>
            </div>

            <div className="md:w-64 flex flex-col gap-1.5">
              <label className="text-body-xs font-semibold uppercase text-ink/50 tracking-wider">
                Test with Preset Links
              </label>
              <select
                value={selectedPresetIdx}
                disabled={isAdding}
                onChange={(e) => setSelectedPresetIdx(e.target.value === "custom" ? "custom" : Number(e.target.value))}
                className="w-full bg-cream border-2 border-ink text-body-s py-2 px-3 text-ink focus:outline-none rounded-md font-sans"
              >
                <option value="custom">-- Custom Input URL --</option>
                {PRESETS.map((p, idx) => (
                  <option key={idx} value={idx}>
                    {p.domain} ({p.tags[0]})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Ingesting Progress Bar */}
          {isAdding && (
            <div className="border-2 border-ink bg-cream p-4 rounded-md shadow-[4px_4px_0px_0px_var(--color-ink)] animate-fade-in-up">
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-body-xs font-semibold text-accent flex items-center gap-1.5">
                  <Spinner className="animate-spin" size={14} /> AI metadata ingestion pipeline active
                </span>
                <span className="font-mono text-body-xs font-semibold">{addProgress}%</span>
              </div>
              <div className="h-2 w-full bg-ink/10 rounded-full overflow-hidden border border-ink/20">
                <div
                  className="h-full bg-accent transition-all duration-300"
                  style={{ width: `${addProgress}%` }}
                />
              </div>
              <p className="text-body-xs text-ink/65 italic font-mono mt-2 pl-1">
                {addProgressText}
              </p>
            </div>
          )}

          {/* Search, Filter Tag Pills, Grid & AI Panel container */}
          <div className="flex flex-col gap-4">
            
            {/* Search Bar & Tag Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              {/* Tag Filters */}
              <div className="flex flex-wrap gap-1.5 order-2 sm:order-1">
                {allTags.map((tag) => {
                  const count = tag === "All" 
                    ? bookmarks.length 
                    : bookmarks.filter(b => b.tags.includes(tag)).length;
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setSelectedTag(tag)}
                      className={`px-2.5 py-1 text-body-xs font-mono rounded transition-colors cursor-pointer border ${
                        selectedTag === tag
                          ? "bg-ink border-ink text-cream font-medium"
                          : "bg-cream/40 border-ink/10 text-ink/60 hover:border-ink hover:text-ink"
                      }`}
                    >
                      {tag} <span className="opacity-50 text-[10px]">({count})</span>
                    </button>
                  );
                })}
              </div>

              {/* Search Bar */}
              <div className="relative order-1 sm:order-2">
                <MagnifyingGlass size={16} className="absolute left-3 top-2.5 text-ink/40" />
                <input
                  type="text"
                  placeholder="Search bookmarks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-56 bg-cream border border-ink/15 rounded pl-9 pr-3 py-1.5 text-body-s placeholder:text-ink/30 focus:outline-none focus:border-accent text-ink"
                />
              </div>
            </div>

            {/* Split layout: Grid on left/full, AI chat on right if open */}
            <div className="flex flex-col lg:flex-row gap-5 items-start w-full">
              
              {/* Bookmarks grid layout */}
              <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredBookmarks.length === 0 ? (
                  <div className="col-span-2 border border-dashed border-ink/20 py-12 text-center text-ink/40 italic bg-cream/20 rounded">
                    No bookmarks found matching the filters.
                  </div>
                ) : (
                  filteredBookmarks.map((b) => (
                    <div
                      key={b.id}
                      onClick={() => setActiveBookmark(b)}
                      className={`group border-2 border-ink bg-cream rounded-md p-4 flex flex-col gap-3 shadow-[4px_4px_0px_0px_var(--color-ink)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_var(--color-ink)] transition-all cursor-pointer ${
                        activeBookmark?.id === b.id ? "ring-2 ring-accent" : ""
                      }`}
                    >
                      {/* Visual Header */}
                      <div className={`relative h-24 rounded border border-ink/10 bg-gradient-to-tr ${b.bgGradient} overflow-hidden flex items-center justify-center p-3`}>
                        <div className="flex items-center gap-1.5 bg-cream/90 backdrop-blur-sm border border-ink/15 px-2.5 py-1 rounded text-body-xs font-mono text-ink max-w-[90%] shadow-sm">
                          <Globe size={12} className="text-ink/65 shrink-0" />
                          <span className="truncate">{b.domain}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col gap-1">
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-body-s text-ink leading-snug line-clamp-1 group-hover:text-accent transition-colors">
                            {b.title}
                          </h5>
                          <a
                            href={b.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-ink/45 hover:text-accent transition-colors mt-0.5 shrink-0"
                            title="Visit website"
                          >
                            <ArrowSquareOut size={14} />
                          </a>
                        </div>
                        <p className="text-body-xs text-ink/65 line-clamp-2 mt-0.5">
                          {b.description}
                        </p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {b.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-ink/5 border border-ink/5 text-[10px] font-mono uppercase px-1.5 py-0.5 text-ink/70 rounded"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between border-t border-ink/5 pt-3 mt-1 text-body-xs font-mono">
                        <span
                          className="flex items-center gap-1 text-accent font-semibold hover:text-ink transition-colors"
                        >
                          <Sparkle size={12} weight="fill" /> AI Assistant
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-ink/40 text-[11px]">{b.addedAt}</span>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(b.id, e)}
                            className="text-ink/40 hover:text-red-600 transition-colors p-1"
                            title="Delete bookmark"
                          >
                            <Trash size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Side AI Summary Drawer */}
              {activeBookmark && (
                <div className="w-full lg:w-80 shrink-0 border-2 border-ink bg-cream rounded-md p-4 shadow-[4px_4px_0px_0px_var(--color-ink)] flex flex-col gap-4 animate-fade-in-up">
                  <div className="flex items-center justify-between border-b border-ink/10 pb-3">
                    <div className="flex items-center gap-1.5">
                      <Sparkle size={16} weight="fill" className="text-accent" />
                      <span className="font-bold text-ink">AI Assistant Reader</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveBookmark(null)}
                      className="text-ink/50 hover:text-ink cursor-pointer"
                    >
                      <X size={16} weight="bold" />
                    </button>
                  </div>

                  {/* bookmark mini details */}
                  <div className="bg-ink/[0.02] border border-ink/5 p-3 rounded">
                    <span className="text-[10px] font-mono uppercase text-ink/40 block">Currently reading</span>
                    <span className="text-body-xs font-semibold text-ink line-clamp-1 mt-0.5">{activeBookmark.title}</span>
                  </div>

                  {/* Summary Block */}
                  <div className="flex flex-col gap-2">
                    <span className="text-body-xs font-semibold text-ink/50 uppercase tracking-wider font-mono">
                      OpenRouter Summary
                    </span>
                    <p className="text-body-xs text-ink/80 leading-relaxed bg-accent/5 border border-accent/15 p-3 rounded italic">
                      &ldquo;{activeBookmark.aiSummary}&rdquo;
                    </p>
                  </div>

                  {/* Interactive Chat interface */}
                  <div className="flex flex-col gap-2 border-t border-ink/10 pt-3">
                    <span className="text-body-xs font-semibold text-ink/50 uppercase tracking-wider font-mono">
                      Ask AI about this Link
                    </span>
                    
                    {/* Chat Logs */}
                    <div className="h-44 overflow-y-auto border border-ink/10 bg-cream/40 rounded p-2.5 flex flex-col gap-2 leading-relaxed">
                      {chatHistory.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex flex-col ${
                            msg.sender === "user" ? "items-end" : "items-start"
                          }`}
                        >
                          <span className={`text-[10px] font-mono uppercase text-ink/40 mb-0.5`}>
                            {msg.sender === "user" ? "You" : "mark_me AI"}
                          </span>
                          <span
                            className={`text-body-xs px-2.5 py-1.5 rounded max-w-[90%] ${
                              msg.sender === "user"
                                ? "bg-ink text-cream rounded-tr-none"
                                : "bg-panel text-ink border border-ink/10 rounded-tl-none"
                            }`}
                          >
                            {msg.text}
                          </span>
                        </div>
                      ))}
                      {isChatResponding && (
                        <div className="flex items-center gap-1.5 text-ink/55 text-body-xs italic font-mono pl-1">
                          <Spinner className="animate-spin text-accent" size={12} />
                          <span>AI is parsing content...</span>
                        </div>
                      )}
                    </div>

                    {/* Predefined Questions Pills */}
                    <div className="flex flex-wrap gap-1 mt-1">
                      {getPresetQuestionsForBookmark(activeBookmark.id).map((q, idx) => (
                        <button
                          key={idx}
                          type="button"
                          disabled={isChatResponding}
                          onClick={() => handleSendChat(q)}
                          className="text-[10px] font-mono border border-ink/10 bg-cream text-ink/70 hover:border-ink hover:text-ink px-2 py-1 rounded transition-colors cursor-pointer text-left line-clamp-1 disabled:opacity-40"
                        >
                          {q}
                        </button>
                      ))}
                    </div>

                    {/* Input send bar */}
                    <div className="flex gap-1.5 mt-1">
                      <input
                        type="text"
                        placeholder="Ask: what is the stack?"
                        value={chatInput}
                        disabled={isChatResponding}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSendChat();
                        }}
                        className="flex-1 bg-cream border border-ink/15 rounded px-2.5 py-1 text-body-xs focus:outline-none focus:border-accent text-ink"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendChat()}
                        disabled={isChatResponding || !chatInput.trim()}
                        className="bg-ink hover:bg-accent text-cream border border-ink rounded px-2.5 flex items-center justify-center cursor-pointer transition-colors disabled:opacity-40"
                      >
                        <PaperPlaneRight size={12} />
                      </button>
                    </div>
                  </div>
                  
                </div>
              )}

            </div>
          </div>
        </div>
      ) : (
        /* Chrome Extension Simulator */
        <div className="flex flex-col md:flex-row gap-5 items-stretch w-full animate-fade-in-up">
          
          {/* Mock Web Browser Window (Page we are browsing) */}
          <div className="flex-1 border-2 border-ink rounded-lg bg-cream flex flex-col overflow-hidden shadow-[4px_4px_0px_0px_var(--color-ink)]">
            
            {/* Browser top-bar */}
            <div className="bg-panel border-b border-ink/15 px-3 py-2 flex items-center gap-2 font-mono text-body-xs">
              <div className="flex gap-1">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400 block" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400 block" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400 block" />
              </div>
              <div className="bg-cream border border-ink/10 rounded px-3 py-1 flex items-center gap-1.5 text-ink/65 flex-1 max-w-sm truncate ml-2">
                <Globe size={10} />
                <span>https://openrouter.ai/docs</span>
              </div>
            </div>

            {/* Browser web page viewport */}
            <div className="p-6 flex-1 flex flex-col gap-4 font-sans bg-cream min-h-[300px]">
              <div className="inline-flex bg-orange-100 text-orange-800 border border-orange-200 px-2 py-0.5 rounded text-[10px] font-semibold w-fit uppercase font-mono">
                API Docs Portal
              </div>
              <h2 className="text-h2 font-normal text-ink font-display">
                OpenRouter API Documentation
              </h2>
              <p className="text-body-s text-ink/75 leading-relaxed">
                OpenRouter provides a unified interface for connecting to any language model (LLM). 
                Instead of managing separate keys and API structures for OpenAI, Anthropic, Gemini, 
                and Meta, you connect to a single endpoint.
              </p>
              
              <div className="border border-ink/10 bg-panel/30 p-4 rounded font-mono text-body-xs flex flex-col gap-2 mt-2 leading-relaxed">
                <span className="text-ink/50 uppercase font-semibold">Standard Endpoint</span>
                <pre className="text-accent overflow-x-auto whitespace-pre-wrap">
                  POST https://openrouter.ai/api/v1/chat/completions
                </pre>
              </div>
              
              <p className="text-body-xs text-ink/55 italic">
                *Note: You are currently browsing this page in an active browser tab. Click "Mark Tab" in the extension popup on the right to save it!
              </p>
            </div>
          </div>

          {/* Mock Chrome Extension Popup window container */}
          <div className="w-full md:w-72 shrink-0 flex flex-col justify-center items-center">
            
            {/* The Extension Container */}
            <div className="border-2 border-ink bg-panel rounded-lg w-full flex flex-col overflow-hidden shadow-[6px_6px_0px_0px_var(--color-ink)]">
              
              {/* Popup Titlebar */}
              <div className="bg-ink text-cream p-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-body-s">
                  <Bookmark size={14} weight="fill" className="text-accent" />
                  <span>mark_me extension</span>
                </div>
                <span className="bg-accent text-cream px-1.5 py-0.5 rounded text-[9px] font-mono">
                  v1.2.0 (MV3)
                </span>
              </div>

              {/* Popup Content */}
              <div className="p-4 flex flex-col gap-4 bg-panel">
                
                {extSaved ? (
                  <div className="text-center py-6 flex flex-col items-center gap-3 animate-fade-in-up">
                    <CheckCircle weight="fill" className="text-accent animate-bounce" size={44} />
                    <div>
                      <h6 className="font-bold text-body-m text-ink">Tab Bookmarked!</h6>
                      <p className="text-body-xs text-ink/65 mt-1 leading-relaxed">
                        Metadata parsed and AI summary queued successfully.
                      </p>
                    </div>
                    <div className="bg-cream/60 border border-ink/10 p-2.5 rounded text-left w-full text-body-xs font-mono mt-2">
                      <span className="block text-ink/50 uppercase text-[9px]">Tags Added:</span>
                      <span className="block text-ink mt-0.5">#AI, #API, #Integration</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => { setExtSaved(false); setExtProgress(0); }}
                      className="border border-ink/20 hover:border-ink text-ink font-semibold py-1.5 px-4 text-body-xs rounded cursor-pointer transition-colors w-full mt-2 bg-cream"
                    >
                      Bookmark Another Page
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono uppercase text-ink/40 font-semibold">Active Tab URL</span>
                      <div className="bg-cream border border-ink/15 rounded px-2.5 py-1.5 text-body-xs font-mono text-ink truncate">
                        https://openrouter.ai/docs
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-mono uppercase text-ink/40 font-semibold">Auto-detected Title</span>
                      <div className="bg-cream border border-ink/15 rounded px-2.5 py-1.5 text-body-xs font-mono text-ink font-medium truncate">
                        OpenRouter AI API Documentation
                      </div>
                    </div>

                    {extLoading ? (
                      <div className="flex flex-col gap-2 py-3">
                        <div className="flex justify-between items-center text-body-xs font-mono text-accent">
                          <span className="flex items-center gap-1.5">
                            <Spinner className="animate-spin" size={12} /> Syncing database...
                          </span>
                          <span>{extProgress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-ink/10 rounded-full overflow-hidden border border-ink/20">
                          <div
                            className="h-full bg-accent transition-all duration-300"
                            style={{ width: `${extProgress}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSaveFromExtension}
                        className="bg-accent hover:bg-ink text-cream border border-ink py-2.5 px-4 text-body-s font-bold shadow-[2px_2px_0px_0px_var(--color-ink)] hover:translate-x-[-1px] hover:translate-y-[-1px] active:translate-x-[0px] active:translate-y-[0px] transition-all rounded cursor-pointer flex items-center justify-center gap-1.5 mt-2"
                      >
                        <Bookmark size={14} weight="fill" /> Mark Current Tab
                      </button>
                    )}

                    <div className="border-t border-ink/10 pt-3 text-[10px] font-mono text-ink/40 text-center leading-relaxed">
                      This extension syncs with your Neon Postgres DB and handles offline queue buffers when offline.
                    </div>
                  </div>
                )}
                
              </div>
            </div>
            
            {/* Helper tooltip */}
            <span className="text-body-xs font-mono text-ink/40 italic text-center mt-3 leading-relaxed">
              *Try clicking the button to see the sync in real-time, then switch back to the Web App Dashboard view!
            </span>
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
