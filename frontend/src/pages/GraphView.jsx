import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BrainCircuit,
  GitBranch,
  LocateFixed,
  Network,
  RefreshCw,
  ScanSearch,
} from "lucide-react";

import { getVisualGraph } from "../api/api";
import GraphCanvas from "../components/GraphCanvas.jsx";

function GraphView() {
  const [graph, setGraph] = useState({
    nodes: [],
    edges: [],
  });
  const [selectedNode, setSelectedNode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const typeCounts = useMemo(() => {
    return graph.nodes.reduce((acc, node) => {
      const type = node.data?.type || node.type || "CONCEPT";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
  }, [graph.nodes]);

  async function loadGraph() {
    try {
      setIsLoading(true);
      setError("");

      const data = await getVisualGraph();

      setGraph({
        nodes: data.nodes || [],
        edges: data.edges || [],
      });
      setSelectedNode(null);
    } catch (err) {
      console.error(err);
      setError("Could not load graph data from the backend.");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    getVisualGraph()
      .then((data) => {
        if (!isMounted) return;
        setGraph({
          nodes: data.nodes || [],
          edges: data.edges || [],
        });
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error(err);
        setError("Could not load graph data from the backend.");
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <section className="console-panel overflow-hidden">
        <div className="relative flex flex-col justify-between gap-4 border-b border-slate-800 px-5 py-4 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300">
              Graph Explorer
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Knowledge Graph View
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Explore extracted entities, relationship labels, and graph topology from
              <span className="text-slate-300"> GET /graph/visual</span>.
            </p>
          </div>

          <button
            onClick={loadGraph}
            disabled={isLoading}
            className="inline-flex items-center justify-center gap-2 bg-cyan-300 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_34px_rgba(34,211,238,0.16)] transition hover:bg-cyan-200 disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Refreshing" : "Refresh Graph"}
          </button>
        </div>

        <div className="relative grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <GraphStat label="Total Nodes" value={graph.nodes.length} icon={Network} />
          <GraphStat label="Total Edges" value={graph.edges.length} icon={GitBranch} />
          <GraphStat label="Entity Types" value={Object.keys(typeCounts).length} icon={ScanSearch} />
          <GraphStat label="Explorer State" value={isLoading ? "Syncing" : "Ready"} icon={Activity} />
        </div>
      </section>

      {error && (
        <p className="border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      )}

      {graph.nodes.length === 0 && !isLoading ? (
        <section className="console-panel border-dashed p-10 text-center">
          <BrainCircuit className="mx-auto mb-4 h-10 w-10 text-slate-500" />
          <h2 className="text-xl font-semibold text-white">No graph data yet</h2>
          <p className="mt-2 text-slate-400">
            Go to the Ingest page, submit text, then refresh this explorer.
          </p>
        </section>
      ) : (
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
          <GraphCanvas
            nodes={graph.nodes}
            edges={graph.edges}
            onNodeSelect={setSelectedNode}
          />
          <GraphSidePanel
            selectedNode={selectedNode}
            typeCounts={typeCounts}
            edgeCount={graph.edges.length}
          />
        </section>
      )}
    </div>
  );
}

function GraphStat({ label, value, icon: Icon }) {
  return (
    <div className="border border-slate-800 bg-slate-950/65 p-4">
      <div className="mb-3 flex items-center justify-between">
        <Icon className="h-4 w-4 text-cyan-300" />
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
      </div>
      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
    </div>
  );
}

function GraphSidePanel({ selectedNode, typeCounts, edgeCount }) {
  return (
    <aside className="console-panel p-5 xl:min-h-[760px]">
      <div className="relative mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-300">
            Inspector
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">Node Details</h2>
        </div>
        <LocateFixed className="h-5 w-5 text-cyan-300" />
      </div>

      {selectedNode ? (
        <div className="relative mb-6 border border-cyan-400/25 bg-cyan-400/10 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
            Selected
          </p>
          <h3 className="mt-3 text-lg font-semibold text-white">
            {selectedNode.label || "Unknown Node"}
          </h3>
          <p className="mt-3 inline-flex border border-cyan-300/30 bg-slate-950/70 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">
            {selectedNode.type || "CONCEPT"}
          </p>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Node ID: <span className="text-slate-200">{selectedNode.id}</span>
          </p>
        </div>
      ) : (
        <div className="relative mb-6 border border-dashed border-slate-700 bg-slate-950/60 p-4">
          <p className="text-sm leading-6 text-slate-400">
            Select a graph node to inspect its label, type, and identifier.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-400">
            Entity Mix
          </h3>
          <div className="space-y-2">
            {Object.entries(typeCounts).length === 0 ? (
              <p className="text-sm text-slate-500">No entities loaded.</p>
            ) : (
              Object.entries(typeCounts).map(([type, count]) => (
                <div
                  key={type}
                  className="flex items-center justify-between border border-slate-800 bg-slate-950/65 px-3 py-2"
                >
                  <span className="text-sm font-medium text-slate-200">{type}</span>
                  <span className="text-sm text-cyan-300">{count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="border border-slate-800 bg-slate-950/65 p-4">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            Relationship Density
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">{edgeCount}</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Edge labels are rendered directly on graph relationships.
          </p>
        </div>
      </div>
    </aside>
  );
}

export default GraphView;
