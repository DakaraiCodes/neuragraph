import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import IngestText from "./pages/IngestText";
import GraphView from "./pages/GraphView";

function App() {
  return (
    <div className="min-h-screen bg-[#02040a] text-slate-100">
      <div className="pointer-events-none fixed inset-0 graph-shell-bg" />
      <div className="pointer-events-none fixed inset-0 scanline-overlay" />
      <Navbar />

      <main className="relative mx-auto max-w-[1500px] px-3 py-4 sm:px-5 lg:py-5">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ingest" element={<IngestText />} />
          <Route path="/graph" element={<GraphView />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
