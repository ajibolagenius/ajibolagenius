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
  const [duration] = useState(24); // mock duration
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
    <div className="flex flex-col gap-4 border border-ink/10 bg-panel dark:bg-neutral-900/40 dark:border-neutral-800 p-6 rounded-lg shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-ink/5 dark:border-neutral-800/80 pb-4">
        <div>
          <h4 className="text-body-s font-semibold uppercase tracking-wider text-ink dark:text-cream">
            📻 Audio Briefing Concept
          </h4>
          <p className="text-body-xs text-ink/50 dark:text-cream/40">
            Interactive demo of speech synthesis in localized dialects
          </p>
        </div>
        
        {/* Toggle Pill */}
        <div className="inline-flex self-start border border-ink/10 dark:border-neutral-800 p-0.5 rounded font-mono text-body-xs bg-cream/30 dark:bg-neutral-950/20">
          <button
            type="button"
            onClick={() => handleVoiceChange("chidi")}
            className={`px-3 py-1 transition-colors rounded-sm ${
              voice === "chidi"
                ? "bg-ink text-cream dark:bg-cream dark:text-ink font-semibold"
                : "text-ink/60 dark:text-cream/50 hover:text-ink dark:hover:text-cream"
            }`}
          >
            English (Chidi)
          </button>
          <button
            type="button"
            onClick={() => handleVoiceChange("blessing")}
            className={`px-3 py-1 transition-colors rounded-sm ${
              voice === "blessing"
                ? "bg-ink text-cream dark:bg-cream dark:text-ink font-semibold"
                : "text-ink/60 dark:text-cream/50 hover:text-ink dark:hover:text-cream"
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
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent text-cream shadow-md transition-transform hover:scale-105 active:scale-95"
            aria-label={isPlaying ? "Pause briefing" : "Play briefing"}
          >
            {isPlaying ? (
              <Pause weight="fill" size={20} />
            ) : (
              <Play weight="fill" size={20} className="ml-1" />
            )}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="relative h-1.5 w-full bg-ink/10 dark:bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full bg-accent transition-all duration-1000"
                style={{ width: `${(progress / duration) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-body-xs font-mono text-ink/50 dark:text-cream/40 mt-2">
              <span>{formatTime(progress)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        {/* Responsive, centered visual audio wave */}
        <div className="flex items-end justify-between gap-0.5 sm:gap-1 h-12 bg-ink/[0.02] dark:bg-neutral-950/20 border border-ink/5 dark:border-neutral-800/55 px-4 py-2 rounded">
          {Array.from({ length: 32 }).map((_, i) => {
            const h = isPlaying
              ? Math.max(15, Math.sin(progress * 1.8 + i * 0.4) * 35 + 45)
              : 8;
            return (
              <div
                key={i}
                className={`w-1 transition-all duration-300 rounded-t-sm ${
                  isPlaying ? "bg-accent" : "bg-ink/20 dark:bg-neutral-700"
                }`}
                style={{ height: `${h}%` }}
              />
            );
          })}
        </div>

        <div className="border border-ink/10 dark:border-neutral-800 bg-cream/40 dark:bg-neutral-900/50 p-4 rounded text-body-s italic leading-relaxed text-ink/80 dark:text-cream/80">
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
    <div className="flex flex-col gap-4 border border-ink/10 bg-panel dark:bg-neutral-900/40 dark:border-neutral-800 p-6 rounded-lg shadow-sm font-mono text-body-s">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-ink/5 dark:border-neutral-800/80 pb-4">
        <div>
          <h4 className="font-semibold uppercase tracking-wider text-ink dark:text-cream flex items-center gap-2">
            <Terminal size={16} /> API Sandbox Playground
          </h4>
          <p className="text-body-xs font-sans text-ink/50 dark:text-cream/40">
            Interactive developer console simulation to query API endpoints
          </p>
        </div>
        
        <select
          value={route}
          onChange={(e: any) => {
            setRoute(e.target.value);
            setResult(null);
          }}
          className="bg-cream dark:bg-neutral-950 border border-ink/15 dark:border-neutral-800 text-body-xs font-mono py-1.5 px-3 text-ink dark:text-cream focus:outline-none focus:border-accent rounded"
        >
          <option value="ingest">POST /v1/ingest</option>
          <option value="enrich">POST /v1/enrich</option>
          <option value="provenance">GET /v1/provenance</option>
        </select>
      </div>

      {/* Side-by-side flex layout on desktop, stacked on mobile */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch">
        <div className="flex-1 flex flex-col gap-2 min-w-0">
          <span className="text-body-xs uppercase text-ink/50 dark:text-cream/40 font-semibold font-sans">
            Request payload
          </span>
          <pre className="flex-1 bg-cream/40 dark:bg-neutral-950/40 border border-ink/5 dark:border-neutral-800/40 p-4 text-body-xs text-ink/80 dark:text-cream/70 overflow-x-auto min-h-[140px] rounded leading-relaxed">
            {selected.body}
          </pre>
          <button
            type="button"
            onClick={handleSend}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 bg-ink text-cream hover:bg-accent disabled:bg-ink/40 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-accent dark:hover:text-cream py-2.5 transition-colors font-semibold rounded"
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
          <span className="text-body-xs uppercase text-ink/50 dark:text-cream/40 font-semibold font-sans">
            Response JSON
          </span>
          <div className="flex-1 bg-ink dark:bg-neutral-950 p-4 text-body-xs rounded min-h-[200px] flex items-center justify-center border border-ink/5 dark:border-neutral-800">
            {isLoading && (
              <div className="flex flex-col items-center gap-2 text-cream/50">
                <Spinner className="animate-spin text-accent" size={24} />
                <span className="font-sans">Awaiting endpoint response...</span>
              </div>
            )}
            {!isLoading && !result && (
              <span className="text-cream/35 italic font-sans">
                Click &ldquo;Send Request&rdquo; to execute.
              </span>
            )}
            {!isLoading && result && (
              <pre className="w-full text-left font-mono leading-relaxed text-cream/90 overflow-x-auto">
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
    <div className="flex flex-col gap-4 border border-ink/10 bg-panel dark:bg-neutral-900/40 dark:border-neutral-800 p-6 rounded-lg shadow-sm font-sans">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-ink/5 dark:border-neutral-800/80 pb-4">
        <div>
          <h4 className="text-body-s font-semibold uppercase tracking-wider text-ink dark:text-cream flex items-center gap-2">
            <Brain size={16} className="text-accent" /> Sphinx ML Duel Arena
          </h4>
          <p className="text-body-xs text-ink/50 dark:text-cream/40">
            Compare forecasts against Heka's historical neural net model
          </p>
        </div>
        
        <select
          value={matchIdx}
          onChange={(e: any) => {
            setMatchIdx(Number(e.target.value));
            reset();
          }}
          className="bg-cream dark:bg-neutral-950 border border-ink/15 dark:border-neutral-800 text-body-xs py-1.5 px-3 text-ink dark:text-cream focus:outline-none focus:border-accent rounded"
        >
          {MATCHES.map((m, idx) => (
            <option key={idx} value={idx}>
              {m.teams}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-cream/40 dark:bg-neutral-950/20 p-5 border border-ink/5 dark:border-neutral-800/50 rounded-lg flex flex-col gap-4">
        {/* Teams presentation */}
        <div className="flex justify-between items-center text-center py-2 px-4 bg-cream dark:bg-neutral-900 border border-ink/5 dark:border-neutral-800 rounded">
          <span className="text-body-s font-bold text-ink dark:text-cream">{currentMatch.teams.split(" vs ")[0]}</span>
          <span className="text-body-xs bg-ink/10 text-ink/50 dark:bg-neutral-800 dark:text-cream/40 px-2.5 py-1 rounded font-mono font-semibold">VS</span>
          <span className="text-body-s font-bold text-ink dark:text-cream">{currentMatch.teams.split(" vs ")[1]}</span>
        </div>

        {duelState === "idle" && (
          <div className="flex flex-col gap-3">
            <p className="text-body-xs font-semibold uppercase tracking-wider text-ink/50 dark:text-cream/40 text-center">
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
                      ? "bg-ink text-cream border-ink dark:bg-cream dark:text-ink dark:border-cream"
                      : "border-ink/10 text-ink/70 hover:border-ink hover:text-ink dark:border-neutral-800 dark:text-cream/70 dark:hover:border-neutral-600 dark:hover:text-cream"
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
              className="mt-2 bg-accent text-cream hover:bg-ink dark:hover:bg-cream dark:hover:text-ink disabled:bg-ink/10 dark:disabled:bg-neutral-800 disabled:text-ink/30 dark:disabled:text-cream/20 py-2.5 transition-colors font-medium rounded flex items-center justify-center gap-2 shadow-sm"
            >
              Challenge Sphinx ML
            </button>
          </div>
        )}

        {duelState === "loading" && (
          <div className="py-8 flex flex-col items-center gap-3">
            <Spinner className="animate-spin text-accent" size={32} />
            <span className="text-body-s text-ink/60 dark:text-cream/50 italic font-mono">
              Sphinx neural parser computing match matrix...
            </span>
          </div>
        )}

        {duelState === "result" && (
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 border border-ink/10 dark:border-neutral-800 bg-cream dark:bg-neutral-900 rounded">
                <span className="text-body-xs text-ink/50 dark:text-cream/40 uppercase block mb-1 font-mono">Your Pick</span>
                <span className="text-body-m font-bold uppercase font-mono text-ink dark:text-cream">{userPick}</span>
              </div>
              <div className="p-4 border border-accent/20 bg-accent/5 rounded">
                <span className="text-body-xs text-accent/70 uppercase block mb-1 font-mono">Sphinx Pick</span>
                <span className="text-body-m font-bold uppercase font-mono text-accent">{sphinxPick}</span>
              </div>
            </div>
            
            <div className="border border-ink/5 dark:border-neutral-800 bg-cream/70 dark:bg-neutral-900/60 p-3 rounded text-body-s font-medium text-ink/80 dark:text-cream/80 text-center leading-relaxed">
              {verdict}
            </div>
            
            <button
              type="button"
              onClick={reset}
              className="border border-ink/20 hover:border-ink dark:border-neutral-700 dark:hover:border-neutral-500 text-ink dark:text-cream py-2 text-body-s font-medium transition-colors rounded"
            >
              Reset Duel
            </button>
          </div>
        )}
      </div>
      <p className="text-body-xs font-mono text-ink/40 dark:text-cream/30 leading-relaxed italic text-center">
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
    <div className="flex flex-col gap-4 border border-ink/10 bg-panel dark:bg-neutral-900/40 dark:border-neutral-800 p-6 rounded-lg shadow-sm font-sans">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-ink/5 dark:border-neutral-800/80 pb-4">
        <div>
          <h4 className="text-body-s font-semibold uppercase tracking-wider text-ink dark:text-cream flex items-center gap-2">
            <Smiley size={16} className="text-accent" /> Anonymous Rant Sandbox
          </h4>
          <p className="text-body-xs text-ink/50 dark:text-cream/40">
            Simulate posting an encrypted anonymous thought with automatic mood analysis
          </p>
        </div>
        <span className="text-body-xs font-mono text-ink/40 dark:text-cream/30 self-start sm:self-center">
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
              className="w-full min-h-[90px] p-3 text-body-s border border-ink/10 dark:border-neutral-800 bg-cream dark:bg-neutral-950 text-ink dark:text-cream focus:border-accent focus:outline-none placeholder:text-ink/30 dark:placeholder:text-cream/20 rounded"
              maxLength={200}
            />
            <div className="flex justify-between items-center text-body-xs text-ink/40 dark:text-cream/35 font-mono">
              <span>Mood selected: {MOODS[selectedMood].emoji} {MOODS[selectedMood].name}</span>
              <span>{rantText.length}/200</span>
            </div>
            
            <div className="grid grid-cols-6 gap-1 bg-ink/[0.02] dark:bg-neutral-950/20 border border-ink/5 dark:border-neutral-850 p-1.5 rounded">
              {MOODS.map((m, idx) => (
                <button
                  key={idx}
                  type="button"
                  title={m.name}
                  onClick={() => setSelectedMood(idx)}
                  className={`py-1.5 text-center border rounded transition-all text-body-m ${
                    selectedMood === idx
                      ? "border-accent bg-accent/5 scale-105"
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
              className="bg-ink hover:bg-accent text-cream dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-accent dark:hover:text-cream font-medium py-2.5 transition-colors disabled:bg-ink/10 dark:disabled:bg-neutral-850 dark:disabled:text-cream/20 rounded shadow-sm"
            >
              Post Anonymously
            </button>
          </>
        )}

        {isAnalyzing && (
          <div className="py-8 flex flex-col items-center gap-3 border border-ink/5 dark:border-neutral-800 bg-cream/40 dark:bg-neutral-950/20 rounded">
            <Spinner className="animate-spin text-accent" size={32} />
            <span className="text-body-s text-ink/60 dark:text-cream/55 italic font-mono">
              Executing lexical polarity and mood density metrics...
            </span>
          </div>
        )}

        {analysis && (
          <div className="flex flex-col gap-4 border border-accent/20 bg-accent/5 dark:bg-accent/[0.02] p-5 rounded-lg">
            <div className="flex justify-between items-start border-b border-accent/10 pb-3">
              <div>
                <span className="text-body-xs text-ink/50 dark:text-cream/40 uppercase block font-mono">Posted by</span>
                <span className="text-body-s font-semibold text-ink dark:text-cream">{analysis.name}</span>
              </div>
              <div className="text-right">
                <span className="text-body-xs text-ink/50 dark:text-cream/40 uppercase block font-mono">Intensity index</span>
                <span className="text-body-s font-semibold text-accent">{MOODS[selectedMood].emoji} {analysis.score}%</span>
              </div>
            </div>
            
            <div className="text-body-s italic text-ink/75 dark:text-cream/70 leading-relaxed bg-cream dark:bg-neutral-950 border border-ink/5 dark:border-neutral-800 p-4 rounded shadow-inner">
              &ldquo;{rantText}&rdquo;
            </div>

            <div className="flex justify-between items-center text-body-xs text-ink/50 dark:text-cream/40 font-mono mt-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle weight="fill" className="text-accent" /> {analysis.sentiment}
              </span>
              <span>{analysis.postedAt}</span>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="border border-ink/20 hover:border-ink dark:border-neutral-700 dark:hover:border-neutral-500 text-ink dark:text-cream py-2 text-body-s font-medium transition-colors rounded mt-2"
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
// 5. MAIN SHOWCASE WRAPPER (FALLBACK & DATABASE DRIVEN)
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
      <h3 className="text-h3 font-normal text-ink dark:text-cream">Showcase Concept</h3>
      {type === "audio" && <AudioShowcase />}
      {type === "api" && <ApiShowcase />}
      {type === "duel" && <DuelShowcase />}
      {type === "mood" && <RantShowcase />}
    </section>
  );
}
