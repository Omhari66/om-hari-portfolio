"use client";

import React from "react";
import { usePortfolioState } from "@/portfolio/state";
import { ArchitectureView } from "./views/ArchitectureView";
import { DecisionView } from "./views/DecisionView";
import { EvidenceView } from "./views/EvidenceView";

export function DynamicStage() {
  const { state, dispatch } = usePortfolioState();

  // If we're home (no project selected) or no data is available, render nothing
  if (state.activeView === "home" || !state.viewData) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-6 pt-24 pb-32">
      {/* Background blur overlay that fades in when stage is active */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md pointer-events-auto transition-opacity" />
      
      {/* Absolute Close Button (Outside the container to prevent visual merging) */}
      <button 
        onClick={() => dispatch({ type: "SHOW_HOME" })}
        className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full border border-white/10 hover:border-white/40 flex items-center justify-center text-white/50 hover:text-white transition-all bg-black/50 backdrop-blur-md pointer-events-auto cursor-pointer hover:bg-white/10"
        title="Close View"
      >
        ✕
      </button>

      {/* Stage Container */}
      <div className="relative w-full max-w-7xl h-full border border-[var(--color-border)] bg-[var(--color-bg-elevated)] rounded-xl overflow-hidden flex flex-col pointer-events-auto shadow-2xl">
        
        {/* Stage Header */}
        <header className="shrink-0 h-16 border-b border-[var(--color-border)] flex items-center justify-between px-6 bg-[var(--color-bg-subtle)]">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-[var(--color-accent)] animate-pulse" />
            <h2 className="font-mono text-sm tracking-widest text-white/70 uppercase">
              {state.activeProject?.replace("project-", "")} // {state.activeView}
            </h2>
          </div>
        </header>

        {/* Stage Content Area */}
        <main className="flex-1 overflow-hidden p-6 md:p-8 flex flex-col">
          {state.activeView === "architecture" && <ArchitectureView data={state.viewData} />}
          {state.activeView === "decision" && <DecisionView data={state.viewData} />}
          {state.activeView === "evidence" && <EvidenceView data={state.viewData} />}
        </main>

      </div>
    </div>
  );
}
