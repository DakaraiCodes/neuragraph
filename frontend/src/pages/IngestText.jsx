import { useMemo, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  Building2,
  FileText,
  GitBranch,
  Loader2,
  Network,
  RadioTower,
  Sparkles,
  UserRound,
} from "lucide-react";
import { buildGraphFromText } from "../api/api";

const examples = [
  {
    label: "Tech Company",
    icon: Building2,
    text: "OpenAI was founded in San Francisco by Sam Altman, Greg Brockman, Ilya Sutskever, John Schulman, and Wojciech Zaremba. Microsoft invested in OpenAI and partnered with the organization to deploy AI systems through Azure.",
  },
  {
    label: "Historical Figure",
    icon: UserRound,
    text: "Ada Lovelace worked with Charles Babbage on the Analytical Engine in London. In 1843, Lovelace wrote notes that described an algorithm for the machine, making her an important figure in computing history.",
  },
  {
    label: "Startup Summary",
    icon: Sparkles,
    text: "NeuraGraph is a startup based in New York that builds AI tools for research teams. The company analyzes documents, extracts entities, and creates knowledge graphs for analysts and enterprise data teams.",
  },
  {
    label: "Research Notes",
    icon: FileText,
    text: "Marie Curie studied radioactivity in Paris and won the Nobel Prize in Physics in 1903. Curie later founded research institutes in France and Poland focused on chemistry, physics, and medical applications.",
  },
];

function IngestText() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const counts = useMemo(() => {
    const trimmed = text.trim();
    return {
      words: trimmed ? trimmed.split(/\s+/).length : 0,
      characters: text.length,
    };
  }, [text]);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setResult(null);

    if (!text.trim()) {
      setError("Please enter some text first.");
      return;
    }

    try {
      setIsLoading(true);

      const data = await buildGraphFromText(text);
      setResult(data);
      setText("");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while building the graph.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[220px_minmax(0,1fr)_420px]">
      <aside className="console-panel p-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Samples
        </p>
        <div className="mt-4 space-y-2">
          {examples.map((example) => (
            <ExampleButton
              key={example.label}
              example={example}
              onClick={() => {
                setText(example.text);
                setError("");
              }}
            />
          ))}
        </div>

        <div className="mt-5 border border-slate-800 bg-black/30 p-3">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
            Input Stats
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <MiniStat label="Words" value={counts.words} />
            <MiniStat label="Chars" value={counts.characters} />
          </div>
        </div>
      </aside>

      <section className="console-panel overflow-hidden">
        <div className="relative border-b border-slate-800 px-5 py-4">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
                AI Analysis Workspace
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                Ingest Text
              </h1>
            </div>
            <div className="data-chip flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-emerald-300">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-300" />
              POST /ingest/build-graph
            </div>
          </div>
        </div>

        <div className="relative p-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="overflow-hidden border border-slate-800 bg-slate-950/80">
              <div className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <BrainCircuit className="h-4 w-4 text-cyan-300" />
                  Source corpus
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span>{counts.words} words</span>
                  <span>{counts.characters} chars</span>
                </div>
              </div>

              <textarea
                value={text}
                onChange={(event) => setText(event.target.value)}
                placeholder="Paste a biography, company summary, research note, or news paragraph. NeuraGraph will extract entities and relationships from the text."
                className="min-h-[460px] w-full resize-y border-0 bg-transparent p-4 font-mono text-sm leading-7 text-slate-100 outline-none placeholder:text-slate-600 focus:ring-0"
              />
            </div>

            {error && (
              <p className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {error}
              </p>
            )}

            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-sm text-slate-500">
                Entity graph output is persisted by the backend and reflected in Graph View.
              </p>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.16)] transition hover:bg-cyan-200 disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Building Graph
                  </>
                ) : (
                  <>
                    Build Knowledge Graph
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      <div className="space-y-4">
        <ExtractionLog isLoading={isLoading} result={result} error={error} />
        <ResultsPanel result={result} isLoading={isLoading} />
      </div>
    </div>
  );
}

function ExampleButton({ example, onClick }) {
  const Icon = example.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 border border-slate-800 bg-slate-950/70 px-3 py-3 text-left transition hover:border-cyan-400/35 hover:bg-slate-900"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-cyan-400/20 bg-cyan-400/10">
        <Icon className="h-4 w-4 text-cyan-300" />
      </span>
      <span className="text-sm font-semibold text-slate-200">{example.label}</span>
    </button>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="border border-slate-800 bg-slate-950/70 p-2">
      <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function ExtractionLog({ isLoading, result, error }) {
  const lines = [
    { label: "source buffer", state: "waiting" },
    { label: "entity classifier", state: isLoading || result ? "complete" : "idle" },
    { label: "relationship mapper", state: result ? "complete" : isLoading ? "running" : "idle" },
    { label: "graph persistence", state: error ? "error" : result ? "synced" : "idle" },
  ];

  return (
    <section className="console-panel p-4">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Extraction Log
        </p>
        <RadioTower className="h-4 w-4 text-cyan-300" />
      </div>
      <div className="space-y-2 font-mono text-xs">
        {lines.map((line, index) => (
          <div key={line.label} className="flex items-center justify-between border border-slate-800 bg-black/30 px-3 py-2">
            <span className="text-slate-400">
              <span className="text-cyan-300">0{index + 1}</span> {line.label}
            </span>
            <span className={line.state === "error" ? "text-red-300" : line.state === "idle" ? "text-slate-600" : "text-emerald-300"}>
              {line.state}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ResultsPanel({ result, isLoading }) {
  const nodes = result?.nodes || [];
  const edges = result?.edges || [];

  return (
    <section className="console-panel">
      <div className="border-b border-slate-800 px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
              Output
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-white">
              Latest Result
            </h2>
          </div>
          <Network className="h-5 w-5 text-cyan-300" />
        </div>
      </div>

      <div className="relative p-5">
        {isLoading ? (
          <LoadingState />
        ) : !result ? (
          <EmptyState />
        ) : (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <ResultStat label="Nodes" value={result.node_count} icon={Network} />
              <ResultStat label="Edges" value={result.edge_count} icon={GitBranch} />
            </div>

            <EntityList title="Extracted Nodes" items={nodes} type="node" />
            <EntityList title="Extracted Edges" items={edges} type="edge" />
          </div>
        )}
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <div className="border border-cyan-400/20 bg-cyan-400/10 p-5">
      <div className="mb-4 flex items-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
        <p className="font-semibold text-white">Running extraction pipeline</p>
      </div>
      <div className="space-y-3">
        {["Classifying entities", "Mapping relationships", "Persisting graph"].map((item) => (
          <div key={item} className="h-10 animate-pulse bg-slate-800/70" />
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-slate-700 bg-slate-950/55 p-6 text-center">
      <BrainCircuit className="mx-auto mb-3 h-8 w-8 text-slate-500" />
      <p className="font-semibold text-slate-200">No analysis output yet</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">
        Submit source text and the extracted nodes and relationships will appear here.
      </p>
    </div>
  );
}

function ResultStat({ label, value, icon: Icon }) {
  return (
    <div className="border border-slate-800 bg-slate-950/70 p-4">
      <Icon className="mb-3 h-4 w-4 text-cyan-300" />
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value ?? 0}</p>
    </div>
  );
}

function EntityList({ title, items, type }) {
  return (
    <div>
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
        {title}
      </h3>
      <div className="max-h-64 space-y-2 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="border border-slate-800 bg-slate-950/60 px-4 py-3 text-sm text-slate-500">
            No {type === "node" ? "nodes" : "edges"} returned.
          </p>
        ) : (
          items.map((item) =>
            type === "node" ? (
              <NodeResult key={item.id ?? item.label} node={item} />
            ) : (
              <EdgeResult key={item.id ?? `${item.source_node_id}-${item.target_node_id}`} edge={item} />
            )
          )
        )}
      </div>
    </div>
  );
}

function NodeResult({ node }) {
  return (
    <div className="border border-slate-800 bg-slate-950/70 px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <p className="font-medium text-white">{node.label || "Unknown node"}</p>
        <span className="border border-cyan-400/25 bg-cyan-400/10 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300">
          {node.type || "CONCEPT"}
        </span>
      </div>
    </div>
  );
}

function EdgeResult({ edge }) {
  return (
    <div className="border border-slate-800 bg-slate-950/70 px-4 py-3">
      <p className="text-sm font-medium text-white">
        {edge.relationship || edge.label || "related to"}
      </p>
      <p className="mt-1 text-xs text-slate-500">
        {edge.source_node_id ?? edge.source ?? "?"} {"->"} {edge.target_node_id ?? edge.target ?? "?"}
      </p>
    </div>
  );
}

export default IngestText;
