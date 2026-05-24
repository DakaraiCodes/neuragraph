import {
  BrainCircuit,
  Building2,
  CalendarDays,
  Clock3,
  MapPin,
  Network,
  UserRound,
  Zap,
} from "lucide-react";
import { Handle, Position } from "reactflow";

const typeConfig = {
  PERSON: {
    icon: UserRound,
    border: "border-cyan-300/55",
    glow: "shadow-cyan-950/35",
    badge: "border-cyan-300/30 bg-cyan-300/10 text-cyan-200",
    iconBox: "border-cyan-300/25 bg-cyan-300/10 text-cyan-200",
  },
  ORG: {
    icon: Building2,
    border: "border-violet-300/55",
    glow: "shadow-violet-950/35",
    badge: "border-violet-300/30 bg-violet-300/10 text-violet-200",
    iconBox: "border-violet-300/25 bg-violet-300/10 text-violet-200",
  },
  GPE: {
    icon: MapPin,
    border: "border-emerald-300/55",
    glow: "shadow-emerald-950/35",
    badge: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
    iconBox: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
  },
  LOC: {
    icon: MapPin,
    border: "border-emerald-300/55",
    glow: "shadow-emerald-950/35",
    badge: "border-emerald-300/30 bg-emerald-300/10 text-emerald-200",
    iconBox: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
  },
  EVENT: {
    icon: Zap,
    border: "border-amber-300/55",
    glow: "shadow-amber-950/35",
    badge: "border-amber-300/30 bg-amber-300/10 text-amber-200",
    iconBox: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  },
  DATE: {
    icon: Clock3,
    border: "border-pink-300/55",
    glow: "shadow-pink-950/35",
    badge: "border-pink-300/30 bg-pink-300/10 text-pink-200",
    iconBox: "border-pink-300/25 bg-pink-300/10 text-pink-200",
  },
};

function getTypeConfig(type) {
  return typeConfig[type] || {
    icon: type === "TIME" ? CalendarDays : BrainCircuit,
    border: "border-slate-500/70",
    glow: "shadow-black/35",
    badge: "border-slate-500/50 bg-slate-700/40 text-slate-200",
    iconBox: "border-slate-600 bg-slate-800/80 text-slate-200",
  };
}

function CustomNode({ data = {}, selected }) {
  const label = data.label || "Unknown Node";
  const type = data.type || "CONCEPT";
  const config = getTypeConfig(type);
  const Icon = config.icon || Network;

  return (
    <div
      className={`min-w-52 max-w-64 border ${config.border} bg-slate-950/95 px-4 py-3 shadow-2xl ${config.glow} ${
        selected ? "ring-2 ring-cyan-300/70" : ""
      }`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-2.5 !w-2.5 !border-slate-950 !bg-cyan-300"
      />

      <div className="flex items-start gap-3">
        <span className={`flex h-9 w-9 shrink-0 items-center justify-center border ${config.iconBox}`}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="line-clamp-2 text-sm font-semibold leading-snug text-white">
            {label}
          </p>
          <span
            className={`mt-2 inline-flex border px-2 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${config.badge}`}
          >
            {type}
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-2.5 !w-2.5 !border-slate-950 !bg-violet-300"
      />
    </div>
  );
}

export default CustomNode;
