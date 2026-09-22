import React from "react";
import * as LucideIcons from "lucide-react";
import { usePortfolioState } from "@/portfolio/state";

export function EvidenceView({ data }: { data: string[] }) {
  const { state, dispatch } = usePortfolioState();

  const handleReturn = () => {
    if (state.activeProject) {
      // Return to architecture overview
      dispatch({ type: "SHOW_ARCHITECTURE", project: state.activeProject });
    }
  };

  const hasEvidence = Array.isArray(data) && data.length > 0;

  if (!hasEvidence) {
    return (
      <div className="w-full h-full flex items-center justify-center py-12 px-4 animate-in fade-in duration-500">
        <div className="max-w-2xl w-full flex flex-col items-center text-center p-12 rounded-3xl border border-white/5 bg-black/40 shadow-2xl relative overflow-hidden">
          
          {/* Subtle glow behind the icon */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/5 blur-[100px] pointer-events-none rounded-full" />
          
          <div className="w-20 h-20 mb-8 rounded-full bg-white/[0.02] border border-white/10 flex items-center justify-center text-blue-400 relative z-10">
            <LucideIcons.Database size={32} strokeWidth={1.5} />
          </div>
          
          <h2 className="font-display text-3xl md:text-4xl text-white mb-4 relative z-10">
            Knowledge Base Miss
          </h2>
          
          <p className="font-body text-white/50 text-base md:text-lg max-w-lg mx-auto leading-relaxed mb-10 relative z-10">
            The requested detailed evidence data is not present in the current Knowledge Layer schema. This ensures all information shown is verified and accurate.
          </p>
          
          <button 
            onClick={handleReturn}
            className="font-mono text-[11px] tracking-widest text-white/70 uppercase hover:text-white transition-colors py-3 px-6 rounded-full border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10 flex items-center gap-2 group relative z-10"
          >
            <LucideIcons.ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            <span>Return to Overview</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-y-auto custom-scrollbar pb-12">
      <div className="w-full max-w-4xl mx-auto py-4 px-4 lg:px-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="mb-12">
        <button 
          onClick={handleReturn}
          className="flex items-center gap-2 text-white/50 hover:text-[var(--color-accent)] transition-colors font-mono text-[10px] tracking-widest uppercase group mb-6"
        >
          <LucideIcons.ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Architecture</span>
        </button>
        
        <div className="font-mono text-[10px] tracking-widest text-[var(--color-accent)] mb-2 uppercase">
          EVIDENCE & IMPLEMENTATION
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-light tracking-wide text-white leading-tight">
          Verified Source Code
        </h1>
      </div>
      
      {/* List */}
      <div className="grid gap-6">
        {data.map((file, index) => (
          <div 
            key={index} 
            className="group p-6 md:p-8 border border-white/10 bg-black/40 rounded-2xl flex items-center justify-between hover:border-[var(--color-accent)] hover:bg-white/[0.02] transition-all duration-300 cursor-pointer shadow-lg hover:shadow-[0_0_30px_rgba(108,99,255,0.1)]"
          >
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 flex items-center justify-center text-[var(--color-accent)] shadow-inner">
                <LucideIcons.FileCode2 size={24} strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-mono text-white/90 text-sm md:text-base mb-1 break-all">{file}</h3>
                <p className="font-body text-white/40 text-xs md:text-sm tracking-wide">
                  Verified Implementation Reference
                </p>
              </div>
            </div>
            
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-[var(--color-accent)] opacity-0 group-hover:opacity-100 transition-all group-hover:bg-white/5 translate-x-4 group-hover:translate-x-0 duration-300">
              <LucideIcons.ArrowRight size={18} />
            </div>
          </div>
        ))}
      </div>
      
        <p className="text-center text-white/30 text-xs font-mono tracking-widest uppercase mt-16 flex items-center justify-center gap-2">
          <LucideIcons.Info size={12} />
          In V2, this panel will display the raw source code
        </p>
      </div>
    </div>
  );
}
