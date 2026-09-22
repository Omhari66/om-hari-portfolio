import React from "react";
import * as LucideIcons from "lucide-react";
import { usePortfolioState } from "@/portfolio/state";
import type { EngineeringDecision } from "@/types";

export function DecisionView({ data }: { data: EngineeringDecision }) {
  const { state, dispatch } = usePortfolioState();

  if (!data || !data.topic) return null;

  const handleBack = () => {
    if (state.activeProject) {
      dispatch({ type: "SHOW_ARCHITECTURE", project: state.activeProject });
    }
  };

  const handleViewEvidence = () => {
    if (state.activeProject) {
      dispatch({ type: "SHOW_EVIDENCE", project: state.activeProject });
    }
  };

  // Split reasons for the UI layout: first point is main reason, rest are key benefits
  const mainReason = data.reason && data.reason.length > 0 ? data.reason[0] : "Rationale not provided.";
  const keyBenefits = data.reason && data.reason.length > 1 ? data.reason.slice(1) : [];

  // Determine if evidence button should be enabled. We check if the project has evidence array.
  // Wait, we don't have the full project object here, just the EngineeringDecision.
  // We can assume evidence is "available" if we dispatch SHOW_EVIDENCE and it checks it.
  // But to be completely safe and accurate to the Knowledge Layer as requested: 
  // Let's rely on the user clicking it to see the Evidence view (which will handle empty state).
  // Alternatively, the prompt asks: "Only show/enable this when evidence references actually exist."
  // Since DecisionView doesn't know if the *project* has evidence without accessing `projects.ts`, 
  // I will import `projects` here just to check if `evidence` array has items.
  const hasEvidence = React.useMemo(() => {
    if (!state.activeProject) return false;
    // We shouldn't duplicate logic, but reading the length is safe.
    // Actually, let's just import the projects array to check.
    const proj = require("@/content/projects").default.find((p: any) => p.id === state.activeProject);
    return proj && proj.evidence && proj.evidence.length > 0;
  }, [state.activeProject]);

  return (
    <div className="w-full h-full mx-auto flex flex-col py-4 px-4 lg:px-8 overflow-hidden">
      
      {/* Header */}
      <div className="mb-8 flex-none animate-in fade-in slide-in-from-top-4 duration-500">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-white/50 hover:text-[var(--color-accent)] transition-colors font-mono text-[10px] tracking-widest uppercase group mb-6"
        >
          <LucideIcons.ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Architecture</span>
        </button>
        
        <div className="font-mono text-[10px] tracking-widest text-[var(--color-accent)] mb-2 uppercase flex items-center gap-2">
          TECHNICAL DECISION
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-light tracking-wide text-white leading-tight mb-3 break-words">
          {data.topic}
        </h1>
        <p className="font-body text-lg text-white/70 max-w-3xl leading-relaxed break-words">
          {data.decision}
        </p>
      </div>

      {/* Two-Column Main Area */}
      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0 overflow-y-auto custom-scrollbar pb-12 pr-2 animate-in fade-in duration-700 delay-150 fill-mode-both">
        
        {/* LEFT COLUMN: Main Content */}
        <div className="flex-1 flex flex-col gap-4 max-w-3xl">
          
          {/* Why I chose it */}
          <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-black/40 hover:bg-white/[0.02] transition-colors flex gap-6">
            <div className="shrink-0 mt-1">
              <div className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)] shadow-[0_0_15px_rgba(108,99,255,0.15)]">
                <LucideIcons.Target size={20} />
              </div>
            </div>
            <div>
              <h3 className="font-display text-xl text-white/90 mb-3 break-words">Why I chose it</h3>
              <p className="font-body text-sm text-white/70 leading-relaxed break-words">
                {mainReason}
              </p>
            </div>
          </div>

          {/* Key Benefits */}
          {keyBenefits.length > 0 && (
            <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-black/40 hover:bg-white/[0.02] transition-colors flex gap-6">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent-teal)]/10 border border-[var(--color-accent-teal)]/30 flex items-center justify-center text-[var(--color-accent-teal)] shadow-[0_0_15px_rgba(0,217,177,0.15)]">
                  <LucideIcons.Check size={20} />
                </div>
              </div>
              <div>
                <h3 className="font-display text-xl text-white/90 mb-4">Key Benefits</h3>
                <ul className="space-y-3">
                  {keyBenefits.map((benefit, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <span className="text-[var(--color-accent-teal)] mt-1.5 shrink-0 opacity-80"><div className="w-1.5 h-1.5 rounded-full bg-current" /></span>
                      <span className="font-body text-white/70 leading-relaxed text-sm break-words">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Implementation Context */}
          {data.implementationContext && (
            <div className="p-6 md:p-8 rounded-2xl border border-white/10 bg-black/40 hover:bg-white/[0.02] transition-colors flex gap-6">
              <div className="shrink-0 mt-1">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                  <LucideIcons.Code2 size={20} />
                </div>
              </div>
              <div>
                <h3 className="font-display text-xl text-white/90 mb-3 break-words">Implementation Context</h3>
                <p className="font-body text-sm text-white/70 leading-relaxed break-words">
                  {data.implementationContext}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Persistent Panel */}
        <div className="w-full lg:w-[380px] shrink-0 flex flex-col gap-6">
          
          {/* Alternatives */}
          <div className="flex-1 flex flex-col">
            <div className="font-mono text-[11px] text-white/50 tracking-widest uppercase mb-4 flex items-center gap-3 border-b border-white/10 pb-3">
              <LucideIcons.GitCompare size={14} className="text-white/40" />
              Alternatives Considered
            </div>
            
            {data.alternatives && data.alternatives.length > 0 ? (
              <div className="flex flex-col gap-3">
                {data.alternatives.map((alt, i) => (
                  <div key={i} className="px-5 py-4 border border-white/5 bg-black/40 rounded-xl">
                    <div className="font-display text-lg text-white/80 mb-2 break-words">{alt}</div>
                    <div className="font-body text-xs text-white/40 leading-relaxed break-words">
                      Evaluated during the architecture phase but not selected for this specific implementation.
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-5 py-6 border border-dashed border-white/10 bg-black/20 rounded-xl text-center">
                <p className="text-white/40 italic font-body text-xs">
                  No viable alternatives were strongly considered.
                </p>
              </div>
            )}
          </div>

          {/* Evidence Action */}
          <div className="mt-auto pt-6">
            {hasEvidence ? (
              <button 
                onClick={handleViewEvidence}
                className="w-full font-mono text-[11px] tracking-wider uppercase text-white/90 hover:text-black transition-all duration-300 py-4 px-6 rounded-xl border border-white/20 hover:border-white hover:bg-white flex justify-between items-center group shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
              >
                <div className="flex items-center gap-3">
                  <LucideIcons.FileCode2 size={16} />
                  <span>View Evidence</span>
                </div>
                <LucideIcons.ArrowRight size={16} className="opacity-50 group-hover:translate-x-1 transition-transform" />
              </button>
            ) : (
              <div className="w-full font-mono text-[10px] tracking-wider uppercase text-white/30 py-4 px-6 rounded-xl border border-dashed border-white/10 bg-black/20 flex justify-center items-center gap-3 text-center">
                <LucideIcons.SearchX size={14} />
                <span>No Evidence Available</span>
              </div>
            )}
          </div>
          
        </div>

      </div>
    </div>
  );
}
