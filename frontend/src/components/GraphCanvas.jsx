import { useEffect, useMemo } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  MarkerType,
  MiniMap,
  useEdgesState,
  useNodesState,
} from "reactflow";
import CustomNode from "./CustomNode.jsx";

const edgePalette = ["#22d3ee", "#a78bfa", "#34d399", "#60a5fa"];

const defaultEdgeOptions = {
  animated: true,
  type: "smoothstep",
  style: {
    strokeWidth: 2,
  },
  labelStyle: {
    fill: "#dbeafe",
    fontWeight: 700,
    fontSize: 11,
  },
  labelBgStyle: {
    fill: "#020617",
    fillOpacity: 0.88,
  },
  labelBgPadding: [8, 4],
  labelBgBorderRadius: 8,
};

function GraphCanvas({ nodes = [], edges = [], onNodeSelect }) {
  const [flowNodes, setNodes, onNodesChange] = useNodesState([]);
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState([]);

  const nodeTypes = useMemo(
    () => ({
      custom: CustomNode,
    }),
    []
  );

  useEffect(() => {
    const formattedNodes = nodes.map((node, index) => {
      const row = Math.floor(index / 4);
      const col = index % 4;
      const fallbackPosition = {
        x: col * 280 + (row % 2 ? 80 : 0),
        y: row * 190,
      };

      return {
        id: String(node.id),
        type: "custom",
        position: node.position || fallbackPosition,
        data: {
          id: node.id,
          label: node.data?.label || node.label || "Unknown Node",
          type: node.data?.type || node.type || "CONCEPT",
        },
      };
    });

    const formattedEdges = edges.map((edge, index) => {
      return {
        id: String(edge.id || `edge-${index}`),
        source: String(edge.source),
        target: String(edge.target),
        label: edge.label || edge.relationship || "related to",
        type: "smoothstep",
        style: {
          stroke: edgePalette[index % edgePalette.length],
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgePalette[index % edgePalette.length],
        },
      };
    });

    setNodes(formattedNodes);
    setEdges(formattedEdges);
  }, [nodes, edges, setNodes, setEdges]);

  return (
    <div className="relative h-[760px] overflow-hidden border border-slate-800 bg-[#02040a] shadow-2xl shadow-black/30">
      <div className="pointer-events-none absolute left-4 top-4 z-10 border border-cyan-400/20 bg-black/45 px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-cyan-200">
        live graph canvas
      </div>
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={(_, node) => onNodeSelect?.(node.data)}
        onPaneClick={() => onNodeSelect?.(null)}
        fitView
        fitViewOptions={{ padding: 0.2 }}
      >
        <Background color="#164e63" gap={18} size={0.8} variant={BackgroundVariant.Dots} />
        <Background color="#0f766e" gap={108} size={1} />
        <Controls showInteractive={false} />
        <MiniMap
          nodeColor={(node) => {
            const type = node.data?.type;
            if (type === "PERSON") return "#22d3ee";
            if (type === "ORG") return "#a78bfa";
            if (type === "GPE" || type === "LOC") return "#34d399";
            if (type === "EVENT") return "#fbbf24";
            if (type === "DATE") return "#f472b6";
            return "#94a3b8";
          }}
          maskColor="rgba(2, 6, 23, 0.68)"
          nodeStrokeWidth={3}
          zoomable
          pannable
        />
      </ReactFlow>
    </div>
  );
}

export default GraphCanvas;
