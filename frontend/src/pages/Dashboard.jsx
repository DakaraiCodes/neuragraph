import {
  Activity,
  ArrowRight,
  Braces,
  Database,
  GitBranch,
  Network,
  RadioTower,
  ScanSearch,
  ServerCog,
  Workflow,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const metrics = [
  { label: "Pipeline", value: "Live", icon: Activity, accent: "text-emerald-300" },
  { label: "Entity classes", value: "6+", icon: ScanSearch, accent: "text-cyan-300" },
  { label: "Relations", value: "Semantic", icon: GitBranch, accent: "text-violet-300" },
  { label: "Explorer", value: "React Flow", icon: Network, accent: "text-sky-300" },
];

const queue = [
  { step: "ingest", detail: "Raw text accepted through analysis workspace", state: "armed" },
  { step: "extract", detail: "spaCy entity stream normalized into graph nodes", state: "ready" },
  { step: "connect", detail: "Rule-based relationships with fallback edge creation", state: "ready" },
  { step: "project", detail: "Visual graph endpoint hydrates React Flow canvas", state: "online" },
];

const events = [
  "[core] /ingest/build-graph registered",
  "[nlp] PERSON ORG GPE LOC EVENT DATE classifiers available",
  "[graph] /graph/visual projection endpoint online",
  "[ui] node inspector and minimap controls synchronized",
];

function Dashboard() {
  return (
    <div className="grid gap-4 xl:grid-cols-[260px_minmax(0,1fr)_320px]">
      <StatusRail />

      <section className="console-panel overflow-hidden">
        <div className="relative border-b border-slate-800 px-5 py-4">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
                <RadioTower className="h-3.5 w-3.5" />
                Graph Intelligence Command Center
              </div>
              <h1 className="max-w-4xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Monitor extraction, relationship mapping, and graph projection from one operations surface.
              </h1>
            </div>

            <div className="flex gap-2">
              <Link
                to="/ingest"
                className="inline-flex items-center justify-center gap-2 bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-200"
              >
                Build Graph
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/graph"
                className="inline-flex items-center justify-center gap-2 border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:border-violet-400/50"
              >
                Open Explorer
                <Network className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        <div className="relative grid gap-0 lg:grid-cols-[minmax(0,1fr)_260px]">
          <TopologyMap />
          <div className="border-t border-slate-800 bg-slate-950/50 p-4 lg:border-l lg:border-t-0">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
              Pipeline Queue
            </p>
            <div className="space-y-3">
              {queue.map((item, index) => (
                <QueueItem key={item.step} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <ActivityRail />

      <section className="grid gap-3 xl:col-span-3 md:grid-cols-4">
        {metrics.map((metric) => (
          <MetricStrip key={metric.label} {...metric} />
        ))}
      </section>

      <section className="console-panel xl:col-span-3">
        <div className="relative grid gap-0 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="border-b border-slate-800 p-5 lg:border-b-0 lg:border-r">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Runtime Architecture
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Text-to-graph execution path
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              A compact app surface routes text into FastAPI, generates NLP
              entities and edges, persists the graph, then projects it into a
              visual explorer.
            </p>
          </div>
          <div className="grid gap-3 p-5 md:grid-cols-5">
            <ArchitectureBox icon={Braces} title="React UI" subtitle="workspace + explorer" />
            <ArchitectureBridge />
            <ArchitectureBox icon={ServerCog} title="FastAPI" subtitle="/ingest /graph" />
            <ArchitectureBridge />
            <ArchitectureBox icon={Database} title="Graph Store" subtitle="spaCy + SQLite" />
          </div>
        </div>
      </section>
    </div>
  );
}

function StatusRail() {
  return (
    <aside className="console-panel p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        System
      </p>
      <div className="mt-5 space-y-4">
        {[
          ["API Gateway", "127.0.0.1:8000", "online"],
          ["NLP Core", "spaCy extractor", "ready"],
          ["Graph DB", "SQLite local", "synced"],
        ].map(([label, value, state]) => (
          <div key={label} className="border-l border-cyan-400/30 pl-3">
            <div className="flex items-center gap-2">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-300" />
              <p className="text-sm font-semibold text-white">{label}</p>
            </div>
            <p className="mt-1 text-xs text-slate-500">{value}</p>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-300">
              {state}
            </p>
          </div>
        ))}
      </div>
    </aside>
  );
}

function TopologyMap() {
  const nodes = [
    { label: "Text", x: "8%", y: "48%", color: "cyan" },
    { label: "NLP", x: "30%", y: "22%", color: "violet" },
    { label: "Entities", x: "50%", y: "56%", color: "emerald" },
    { label: "Edges", x: "68%", y: "30%", color: "violet" },
    { label: "Explorer", x: "82%", y: "64%", color: "cyan" },
  ];

  return (
    <div className="relative min-h-[480px] overflow-hidden p-4">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 820 480" aria-hidden="true">
        <path d="M96 244 C210 80 302 92 410 154 S558 348 690 142" fill="none" stroke="rgba(34,211,238,.44)" strokeWidth="2" />
        <path d="M104 252 C242 370 346 396 480 280 S596 184 704 312" fill="none" stroke="rgba(167,139,250,.36)" strokeWidth="2" strokeDasharray="9 12" />
        <path d="M252 106 C330 188 372 238 506 278 C574 298 626 260 690 312" fill="none" stroke="rgba(52,211,153,.36)" strokeWidth="2" />
        <circle cx="410" cy="154" r="96" fill="none" stroke="rgba(34,211,238,.08)" />
        <circle cx="506" cy="278" r="132" fill="none" stroke="rgba(167,139,250,.07)" />
      </svg>

      <div className="relative flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Live Topology
        </p>
        <span className="data-chip px-2 py-1 text-xs text-emerald-300">signal stable</span>
      </div>

      {nodes.map((node) => (
        <div
          key={node.label}
          className={`absolute border bg-slate-950/95 px-3 py-2 text-sm font-semibold text-white ${
            node.color === "violet"
              ? "border-violet-400/40"
              : node.color === "emerald"
                ? "border-emerald-400/40"
                : "border-cyan-400/40"
          }`}
          style={{ left: node.x, top: node.y }}
        >
          <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-current align-middle" />
          {node.label}
        </div>
      ))}

      <div className="absolute bottom-4 left-4 right-4 grid gap-2 md:grid-cols-4">
        {["parse", "classify", "link", "render"].map((step, index) => (
          <div key={step} className="border border-slate-800 bg-slate-950/80 p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              stage 0{index + 1}
            </p>
            <p className="mt-1 text-sm font-semibold text-slate-200">{step}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function QueueItem({ item, index }) {
  return (
    <div className="border border-slate-800 bg-slate-950/70 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
          0{index + 1} {item.step}
        </p>
        <span className="text-[10px] uppercase tracking-[0.16em] text-emerald-300">
          {item.state}
        </span>
      </div>
      <p className="mt-2 text-sm leading-5 text-slate-400">{item.detail}</p>
    </div>
  );
}

function ActivityRail() {
  return (
    <aside className="console-panel p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Extraction Log
        </p>
        <Workflow className="h-4 w-4 text-cyan-300" />
      </div>
      <div className="space-y-2 font-mono text-xs leading-5 text-slate-400">
        {events.map((event) => (
          <div key={event} className="border border-slate-800 bg-black/30 px-3 py-2">
            <span className="text-emerald-300">&gt;</span> {event}
          </div>
        ))}
      </div>
      <div className="mt-4 border border-slate-800 bg-slate-950/60 p-3">
        <Zap className="mb-3 h-4 w-4 text-emerald-300" />
        <p className="text-sm font-semibold text-white">Ready for analysis</p>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Paste source material, extract entities, then inspect the graph topology.
        </p>
      </div>
    </aside>
  );
}

function MetricStrip({ label, value, icon: Icon, accent }) {
  return (
    <div className="console-panel p-4">
      <div className="relative flex items-center justify-between gap-3">
        <Icon className={`h-5 w-5 ${accent}`} />
        <span className="h-px flex-1 bg-gradient-to-r from-slate-700 to-transparent" />
        <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-cyan-300" />
      </div>
      <p className="relative mt-4 text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="relative mt-1 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function ArchitectureBox({ icon: Icon, title, subtitle }) {
  return (
    <div className="border border-slate-800 bg-slate-950/75 p-4">
      <Icon className="mb-4 h-5 w-5 text-cyan-300" />
      <p className="font-semibold text-white">{title}</p>
      <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

function ArchitectureBridge() {
  return (
    <div className="hidden items-center justify-center md:flex">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
    </div>
  );
}

export default Dashboard;
