import { Link, NavLink } from "react-router-dom";
import { BrainCircuit, Database, Network, RadioTower, TerminalSquare } from "lucide-react";

function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive
      ? "border-b border-cyan-300 bg-cyan-300/8 px-3 py-3 text-cyan-100 shadow-[0_12px_34px_rgba(34,211,238,0.08)]"
      : "border-b border-transparent px-3 py-3 text-slate-500 transition hover:border-slate-700 hover:bg-slate-950/70 hover:text-slate-200";

  return (
    <nav className="sticky top-0 z-30 border-b border-cyan-950/80 bg-[#02040a]/92 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1500px] items-stretch justify-between gap-4 px-3 sm:px-5">
        <Link to="/dashboard" className="flex min-w-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center border border-cyan-400/25 bg-cyan-400/10 shadow-[0_0_34px_rgba(34,211,238,0.12)]">
            <BrainCircuit className="h-5 w-5 text-cyan-300" />
          </span>
          <span className="min-w-0">
            <span className="block text-lg font-semibold tracking-tight text-white">
              NeuraGraph
            </span>
            <span className="hidden text-xs uppercase tracking-[0.22em] text-slate-500 sm:block">
              Graph Intelligence
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-2 border-x border-slate-900 px-4 text-xs text-slate-500 lg:flex">
          <RadioTower className="h-4 w-4 text-emerald-300" />
          <span className="uppercase tracking-[0.22em]">API online</span>
          <span className="pulse-dot h-1.5 w-1.5 rounded-full bg-emerald-300" />
        </div>

        <div className="flex items-stretch gap-0 overflow-x-auto text-sm font-medium">
          <NavLink to="/dashboard" className={linkClass}>
            <span className="flex items-center gap-2">
              <TerminalSquare className="h-4 w-4" />
              Dashboard
            </span>
          </NavLink>
          <NavLink to="/ingest" className={linkClass}>
            <span className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              Ingest
            </span>
          </NavLink>
          <NavLink to="/graph" className={linkClass}>
            <span className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Graph
            </span>
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
