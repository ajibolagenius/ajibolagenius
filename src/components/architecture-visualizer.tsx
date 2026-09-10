"use client";

import { useState, useEffect, useRef } from "react";
import { sound } from "@/lib/sound";
import {
  DeviceMobile,
  Database,
  Lock,
  CreditCard,
  CloudArrowUp,
  Lightning,
  ArrowRight,
  Play,
  ArrowClockwise,
  Graph,
  ShieldCheck,
  CheckCircle,
  Code,
  Cpu,
  HardDrives,
} from "@phosphor-icons/react/dist/ssr";

// ============================================================================
// 1. ZORA MARKET ARCHITECTURE SHOWCASE
// ============================================================================

type ZoraFlowKey = "ota" | "checkout" | "offline";

interface ArchitectureNode {
  id: string;
  name: string;
  category: string;
  icon: typeof DeviceMobile;
  protocol: string;
  summary: string;
  details: string[];
}

const ZORA_NODES: Record<string, ArchitectureNode> = {
  client: {
    id: "client",
    name: "Expo Native Client",
    category: "Client Layer",
    icon: DeviceMobile,
    protocol: "React Native 0.83 · Expo SDK 55",
    summary: "Single codebase shipping to both Apple App Store (v1.0.14) & Google Play.",
    details: [
      "Targeting iOS 15.1+ and Android 10+ with 127 verified device profiles.",
      "Local state caching backed by high-speed MMKV memory-mapped storage.",
      "Hardware biometrics via expo-local-authentication (Face ID / Touch ID / Fingerprint).",
      "Native push notification listener via expo-notifications.",
    ],
  },
  eas: {
    id: "eas",
    name: "EAS OTA Delivery",
    category: "Release Pipeline",
    icon: CloudArrowUp,
    protocol: "Expo Application Services (EAS)",
    summary: "Runtime bundle delivery bypassing full App Store re-review for non-native changes.",
    details: [
      "Deterministic release channels: preview, staging, and production.",
      "Asset hash fingerprinting ensures zero partial-update crashes.",
      "Immediate rollback capability if bundle runtime error rates cross threshold.",
      "Turborepo monorepo coordinates shared types between web and mobile builds.",
    ],
  },
  api: {
    id: "api",
    name: "Turborepo API Gateway",
    category: "Edge & Middleware",
    icon: Cpu,
    protocol: "Next.js App Router / Edge Functions",
    summary: "Shared TypeScript client with end-to-end Zod contract validation.",
    details: [
      "Unified RPC & REST endpoints consumed by both the web platform and mobile app.",
      "Rate-limited edge proxy protects inventory, pricing, and checkout mutations.",
      "Geographical routing for diaspora shoppers and Nigerian local fulfillment.",
      "Structured error boundaries with client-facing localized messages.",
    ],
  },
  auth: {
    id: "auth",
    name: "Supabase & Postgres RLS",
    category: "Data & Security",
    icon: Database,
    protocol: "PostgreSQL · Row Level Security",
    summary: "Tenant-isolated multi-vendor database with atomic transactions.",
    details: [
      "Strict PostgreSQL Row Level Security (RLS) policies per vendor and customer.",
      "JWT-based session authentication with refresh rotation in secure storage.",
      "Database functions handle real-time inventory decrement on order placement.",
      "Real-time postgres replication triggers vendor dispatch notifications.",
    ],
  },
  stripe: {
    id: "stripe",
    name: "Stripe Native & Escrow",
    category: "Financial Layer",
    icon: CreditCard,
    protocol: "Stripe React Native · Apple Pay / Google Pay",
    summary: "Native sheet checkout with multi-vendor automated split and payout escrow.",
    details: [
      "Native Apple Pay & Google Pay bottom sheets with one-touch biometrics.",
      "PaymentIntent lifecycle with webhooks verifying payment before inventory locks.",
      "Configured for multi-vendor regional escrow to protect African diaspora trade.",
      "Zero cardholder data touches custom servers — strict PCI-DSS scope reduction.",
    ],
  },
};

const ZORA_FLOWS: Record<
  ZoraFlowKey,
  {
    title: string;
    description: string;
    steps: {
      from: string;
      to: string;
      label: string;
      latency: string;
      payload: string;
    }[];
  }
> = {
  ota: {
    title: "App Launch & EAS OTA Runtime Sync",
    description:
      "Cold-start verification of embedded bundle fingerprint against EAS release channel, followed by Face ID biometric token unlock.",
    steps: [
      {
        from: "client",
        to: "eas",
        label: "Query Channel Fingerprint",
        latency: "42ms",
        payload: "EAS-Fingerprint: sha256:7f8a... (v1.0.14)",
      },
      {
        from: "eas",
        to: "client",
        label: "Deliver Verified JS Bundle",
        latency: "88ms",
        payload: "200 OK · Incremental OTA Patch (142 KB)",
      },
      {
        from: "client",
        to: "auth",
        label: "Biometric Key Unlock",
        latency: "15ms",
        payload: "FaceID -> SecureStore Decrypt -> Session JWT",
      },
    ],
  },
  checkout: {
    title: "Multi-Vendor Checkout & Native Stripe Flow",
    description:
      "End-to-end checkout with shared TypeScript monorepo validation, Stripe native sheet initialization, and atomic Postgres RLS inventory locks.",
    steps: [
      {
        from: "client",
        to: "api",
        label: "Submit Cart Mutation",
        latency: "28ms",
        payload: "POST /api/v1/orders/prepare · Zod Schema Validated",
      },
      {
        from: "api",
        to: "stripe",
        label: "Create PaymentIntent",
        latency: "74ms",
        payload: "Stripe Connect Split (Vendor Payout + Escrow Fee)",
      },
      {
        from: "stripe",
        to: "client",
        label: "Present Native Sheet",
        latency: "18ms",
        payload: "Apple Pay / Google Pay Native UI Sheet",
      },
      {
        from: "api",
        to: "auth",
        label: "Atomic Inventory Lock",
        latency: "32ms",
        payload: "Postgres RLS Transaction: Decrement Stock & Audit Log",
      },
    ],
  },
  offline: {
    title: "Low-Bandwidth 3G Resiliency & Local Cache",
    description:
      "Fallback behavior when spotty 3G/4G connectivity is detected: client intercepts queries, serves MMKV cache, and queues background mutations.",
    steps: [
      {
        from: "client",
        to: "api",
        label: "Health Ping (3G Timeout)",
        latency: "timeout > 2000ms",
        payload: "Network drop detected -> switch to Offline Mode",
      },
      {
        from: "client",
        to: "client",
        label: "Read MMKV & SQLite Cache",
        latency: "< 2ms",
        payload: "Indexed product catalogue served from local storage",
      },
      {
        from: "client",
        to: "api",
        label: "Replay Sync on Reconnect",
        latency: "55ms",
        payload: "Background sync worker flushes queued actions",
      },
    ],
  },
};

export function ZoraArchitectureShowcase() {
  const [activeFlow, setActiveFlow] = useState<ZoraFlowKey>("ota");
  const [activeStep, setActiveStep] = useState<number>(-1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string>("client");
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const flow = ZORA_FLOWS[activeFlow];
  const selectedNode = ZORA_NODES[selectedNodeId] || ZORA_NODES.client;

  // Simulation runner
  const startSimulation = () => {
    sound.playTap();
    setIsSimulating(true);
    setActiveStep(0);
  };

  useEffect(() => {
    if (!isSimulating) return;

    if (activeStep >= 0 && activeStep < flow.steps.length) {
      sound.playStep(activeStep);
    }

    if (activeStep < flow.steps.length - 1) {
      timerRef.current = setTimeout(() => {
        setActiveStep((prev) => prev + 1);
      }, 1200);
    } else {
      timerRef.current = setTimeout(() => {
        setIsSimulating(false);
        sound.playMatch();
      }, 1600);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isSimulating, activeStep, flow.steps.length]);

  const handleFlowSelect = (k: ZoraFlowKey) => {
    sound.playTap();
    setActiveFlow(k);
    setIsSimulating(false);
    setActiveStep(-1);
  };

  return (
    <div className="flex flex-col gap-5 border border-ink/10 bg-panel p-5 sm:p-6 rounded font-sans">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-ink/8 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase font-semibold tracking-wider text-accent">
              Architecture Simulator
            </span>
            <span className="rounded bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-bold text-accent">
              Live Pipeline
            </span>
          </div>
          <h4 className="mt-1 text-body-m font-medium text-ink">
            Zora Market — Mobile & Monorepo Systems Flow
          </h4>
          <p className="text-body-xs text-ink/60 max-w-xl">
            {flow.description}
          </p>
        </div>

        {/* Flow selector pills */}
        <div className="flex flex-wrap gap-1 p-0.5 border border-ink/10 rounded font-mono text-body-xs bg-cream/40">
          <button
            type="button"
            onClick={() => handleFlowSelect("ota")}
            className={`px-2.5 py-1 rounded transition-colors text-[11px] ${
              activeFlow === "ota"
                ? "bg-ink text-cream font-medium"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            OTA & Biometrics
          </button>
          <button
            type="button"
            onClick={() => handleFlowSelect("checkout")}
            className={`px-2.5 py-1 rounded transition-colors text-[11px] ${
              activeFlow === "checkout"
                ? "bg-ink text-cream font-medium"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            Monorepo Checkout
          </button>
          <button
            type="button"
            onClick={() => handleFlowSelect("offline")}
            className={`px-2.5 py-1 rounded transition-colors text-[11px] ${
              activeFlow === "offline"
                ? "bg-ink text-cream font-medium"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            3G Resiliency
          </button>
        </div>
      </div>

      {/* Nodes Map Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {Object.values(ZORA_NODES).map((node) => {
          const isSelected = selectedNodeId === node.id;
          const isStepActive =
            activeStep >= 0 &&
            (flow.steps[activeStep]?.from === node.id ||
              flow.steps[activeStep]?.to === node.id);

          const IconComponent = node.icon;

          return (
            <button
              key={node.id}
              type="button"
              onClick={() => {
                sound.playTap();
                setSelectedNodeId(node.id);
              }}
              className={`relative flex flex-col items-start gap-1.5 rounded-lg border p-3 text-left transition-all ${
                isSelected
                  ? "border-accent bg-accent/5 ring-1 ring-accent"
                  : isStepActive
                  ? "border-emerald-500/70 bg-emerald-500/10 shadow-xs scale-[1.02]"
                  : "border-ink/10 bg-cream/30 hover:border-ink/25"
              }`}
            >
              {isStepActive && (
                <span
                  aria-hidden
                  className="absolute top-2 right-2 flex h-2 w-2"
                >
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                </span>
              )}
              <div className="rounded p-1.5 bg-ink/5 text-ink">
                <IconComponent size={18} weight="duotone" />
              </div>
              <div>
                <span className="block font-mono text-[9px] uppercase tracking-wider text-ink/40">
                  {node.category}
                </span>
                <span className="block text-body-xs font-semibold text-ink line-clamp-1">
                  {node.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive Simulation Console */}
      <div className="flex flex-col gap-3 rounded-lg border border-ink/8 bg-ink/3 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-semibold uppercase text-ink/70">
              Pipeline Trace
            </span>
            <span className="font-mono text-[10px] text-ink/40">
              Step {activeStep >= 0 ? activeStep + 1 : 0} of {flow.steps.length}
            </span>
          </div>

          <button
            type="button"
            onClick={startSimulation}
            disabled={isSimulating}
            className="inline-flex items-center gap-1.5 rounded bg-ink px-3 py-1 font-mono text-[11px] font-medium text-cream transition-all hover:bg-accent disabled:opacity-50"
          >
            {isSimulating ? (
              <>
                <ArrowClockwise size={12} className="animate-spin" />
                <span>Simulating...</span>
              </>
            ) : (
              <>
                <Play size={12} weight="fill" />
                <span>Simulate Flow</span>
              </>
            )}
          </button>
        </div>

        {/* Step-by-step progress cards */}
        <div className="flex flex-col gap-2">
          {flow.steps.map((st, idx) => {
            const isCurrent = activeStep === idx;
            const isCompleted = activeStep > idx;

            return (
              <div
                key={idx}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded border px-3 py-2 text-body-xs transition-all ${
                  isCurrent
                    ? "border-emerald-500/80 bg-emerald-500/10 shadow-xs"
                    : isCompleted
                    ? "border-ink/10 bg-cream/70 text-ink/70"
                    : "border-ink/5 bg-panel text-ink/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-ink/50">
                    0{idx + 1}
                  </span>
                  <div className="flex items-center gap-1 font-mono text-[11px] font-semibold text-ink">
                    <span>{ZORA_NODES[st.from]?.name}</span>
                    <ArrowRight size={10} className="text-accent" />
                    <span>{ZORA_NODES[st.to]?.name}</span>
                  </div>
                  <span className="text-body-xs text-ink/80">— {st.label}</span>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-auto font-mono text-[10px]">
                  <span className="rounded bg-ink/5 px-1.5 py-0.5 text-ink/60 truncate max-w-[200px] sm:max-w-xs">
                    {st.payload}
                  </span>
                  <span
                    className={`font-semibold ${
                      isCurrent ? "text-emerald-600 dark:text-emerald-400" : "text-ink/40"
                    }`}
                  >
                    {st.latency}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Technical Dossier */}
      <div className="flex flex-col gap-2.5 rounded-lg border border-ink/8 bg-panel p-4">
        <div className="flex items-center justify-between border-b border-ink/8 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase font-semibold tracking-wider text-accent">
              Inspecting Node
            </span>
            <h5 className="text-body-s font-semibold text-ink">
              {selectedNode.name}
            </h5>
          </div>
          <span className="rounded bg-ink/5 px-2 py-0.5 font-mono text-[10px] text-ink/60">
            {selectedNode.protocol}
          </span>
        </div>

        <p className="text-body-xs text-ink/70">{selectedNode.summary}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono text-[11px]">
          {selectedNode.details.map((d, i) => (
            <div
              key={i}
              className="flex items-start gap-1.5 rounded bg-cream/40 p-2 text-ink/80 border border-ink/5"
            >
              <CheckCircle
                size={13}
                className="text-accent shrink-0 mt-0.5"
                weight="bold"
              />
              <span>{d}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 2. AFROGRAPH ARCHITECTURE SHOWCASE
// ============================================================================

type AfroGraphFlowKey = "shortest-path" | "lineage" | "security";

const AFROGRAPH_FLOWS: Record<
  AfroGraphFlowKey,
  {
    title: string;
    cypher: string;
    description: string;
    runtimeMetrics: string;
    nodes: string[];
  }
> = {
  "shortest-path": {
    title: "Six Degrees of African Music (BFS Traversal)",
    cypher: `MATCH (a:Artist {name: 'Fela Kuti'}), (b:Artist {name: 'Burna Boy'})\nMATCH p = shortestPath((a)-[:COLLABORATED_WITH|INFLUENCED*..6]-(b))\nRETURN p, length(p) AS separation;`,
    description:
      "Bidirectional Breadth-First Search (BFS) over Bolt protocol exploring musical lineage, shared production credits, and sample interpolations in under 20ms.",
    runtimeMetrics: "14ms execution · O(V + E) BFS complexity · Bolt Protocol via neo4j-driver",
    nodes: ["Next.js 16 UI", "Bolt Protocol Driver", "CognoDB Cloud Engine", "D3.js Force Simulation"],
  },
  lineage: {
    title: "Talent Incubation Blast-Radius Tree",
    cypher: `MATCH (hub:RecordLabel {name: 'MoHits'})<-[:SIGNED_TO]-(p:Producer)\nMATCH (p)-[:PRODUCED]->(track:Song)-[:SAMPLED_BY*1..3]->(derivative:Song)\nRETURN hub, p, count(DISTINCT derivative) AS totalReach\nORDER BY totalReach DESC LIMIT 10;`,
    description:
      "Deep recursive tree traversal evaluating how an individual producer hub's sound cascaded across three generations of Afrobeats tracks.",
    runtimeMetrics: "38ms execution · Indexed multi-hop traversal · Centrality clustering",
    nodes: ["Cypher Query Studio", "AST Query Planner", "Memory-Mapped Node Index", "SVG Blast Canvas"],
  },
  security: {
    title: "Defensive Cypher Tokenizer & Sanitization",
    cypher: `// AST Tokenizer blocks destructive clauses before transmission\nVALIDATE_CYPHER(rawQuery) {\n  DENY_CLAUSES: ['DELETE', 'DROP', 'SET', 'CREATE', 'MERGE', 'DETACH']\n  TIMEOUT_BUDGET: 2000ms\n  MODE: 'READ_ONLY_TRANSACTION'\n}`,
    description:
      "Public-facing Cypher Query Studio sanitizes arbitrary visitor queries using client-side AST inspection, preventing graph mutation or denial-of-service query loops.",
    runtimeMetrics: "0.4ms parse latency · Zero-mutation guarantee · Memory-budgeted limits",
    nodes: ["User Input Terminal", "AST Security Lexer", "Sanitized Query Session", "Read-Only Bolt Pipe"],
  },
};

export function AfroGraphArchitectureShowcase() {
  const [activeFlow, setActiveFlow] = useState<AfroGraphFlowKey>("shortest-path");
  const [copied, setCopied] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const flow = AFROGRAPH_FLOWS[activeFlow];

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(flow.cypher);
      sound.playTap();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSimulate = () => {
    sound.playTap();
    setSimulating(true);
    setSimStep(0);
    sound.playStep(0);
    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      if (currentStep >= flow.nodes.length) {
        clearInterval(interval);
        setSimulating(false);
        sound.playMatch();
      } else {
        setSimStep(currentStep);
        sound.playStep(currentStep);
      }
    }, 600);
  };

  return (
    <div className="flex flex-col gap-5 border border-ink/10 bg-panel p-5 sm:p-6 rounded font-sans">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between border-b border-ink/8 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] uppercase font-semibold tracking-wider text-accent">
              Graph Engine Pipeline
            </span>
            <span className="rounded bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-bold text-accent">
              openCypher
            </span>
          </div>
          <h4 className="mt-1 text-body-m font-medium text-ink">
            AfroGraph — Knowledge Graph & Cypher Execution Engine
          </h4>
          <p className="text-body-xs text-ink/60 max-w-xl">
            {flow.description}
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex flex-wrap gap-1 p-0.5 border border-ink/10 rounded font-mono text-body-xs bg-cream/40">
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveFlow("shortest-path");
              setSimStep(0);
            }}
            className={`px-2.5 py-1 rounded transition-colors text-[11px] ${
              activeFlow === "shortest-path"
                ? "bg-ink text-cream font-medium"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            Shortest Path
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveFlow("lineage");
              setSimStep(0);
            }}
            className={`px-2.5 py-1 rounded transition-colors text-[11px] ${
              activeFlow === "lineage"
                ? "bg-ink text-cream font-medium"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            Blast Radius
          </button>
          <button
            type="button"
            onClick={() => {
              sound.playTap();
              setActiveFlow("security");
              setSimStep(0);
            }}
            className={`px-2.5 py-1 rounded transition-colors text-[11px] ${
              activeFlow === "security"
                ? "bg-ink text-cream font-medium"
                : "text-ink/60 hover:text-ink"
            }`}
          >
            AST Security
          </button>
        </div>
      </div>

      {/* Live Pipeline Flow Graphic */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 rounded-lg border border-ink/8 bg-ink/3 p-4">
        {flow.nodes.map((nodeName, idx) => {
          const isActive = simulating && simStep === idx;
          const isDone = !simulating || simStep > idx;

          return (
            <div key={idx} className="flex items-center gap-2 w-full sm:w-auto">
              <div
                className={`flex-1 sm:flex-initial flex items-center gap-2 rounded-lg border px-3 py-2 text-body-xs transition-all ${
                  isActive
                    ? "border-accent bg-accent/15 ring-2 ring-accent scale-105"
                    : isDone
                    ? "border-ink/15 bg-panel text-ink font-medium"
                    : "border-ink/5 bg-cream/40 text-ink/40"
                }`}
              >
                <div className="h-2 w-2 rounded-full bg-accent" />
                <span className="font-mono text-[11px]">{nodeName}</span>
              </div>
              {idx < flow.nodes.length - 1 && (
                <ArrowRight
                  size={12}
                  className="hidden sm:block text-ink/30 shrink-0"
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Cypher Code Box */}
      <div className="flex flex-col rounded-lg border border-ink/10 bg-[#121214] text-[#ececed] font-mono text-[12px] overflow-hidden shadow-xs">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 bg-white/5">
          <div className="flex items-center gap-2">
            <Code size={14} className="text-accent" />
            <span className="text-[11px] text-white/70">
              Cypher Query · Bolt Execution
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-white/40">
              {flow.runtimeMetrics}
            </span>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded bg-white/10 px-2 py-0.5 text-[10px] hover:bg-white/20 transition-colors"
            >
              {copied ? "Copied" : "Copy Query"}
            </button>
            <button
              type="button"
              onClick={handleSimulate}
              disabled={simulating}
              className="rounded bg-accent px-2 py-0.5 text-[10px] font-bold text-cream hover:bg-accent/90 transition-colors disabled:opacity-50"
            >
              {simulating ? "Traversing..." : "Run Query"}
            </button>
          </div>
        </div>

        <pre className="p-4 overflow-x-auto text-[11px] leading-relaxed">
          <code>{flow.cypher}</code>
        </pre>
      </div>
    </div>
  );
}
