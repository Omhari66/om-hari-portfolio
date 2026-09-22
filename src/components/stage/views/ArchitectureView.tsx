"use client";

import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import * as LucideIcons from "lucide-react";
import { usePortfolioState } from "@/portfolio/state";
import type { ArchitectureNode } from "@/types";

gsap.registerPlugin(useGSAP);

const DynamicIcon = ({ name }: { name?: string }) => {
  const Icon = name && (LucideIcons as any)[name] ? (LucideIcons as any)[name] : LucideIcons.Box;
  return <Icon className="w-6 h-6 sm:w-8 sm:h-8 mb-4 text-[var(--color-accent)] mx-auto opacity-90" strokeWidth={1.5} />;
};

export function ArchitectureView({ data }: { data: ArchitectureNode[] }) {
  const { state, dispatch } = usePortfolioState();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data && data.length > 0 && !selectedId) {
      setSelectedId(data[0].id);
    }
  }, [data, selectedId]);

  useGSAP(() => {
    if (!containerRef.current) return;
    const nodes = containerRef.current.querySelectorAll('.arch-node');
    const arrows = containerRef.current.querySelectorAll('.arch-arrow');
    
    gsap.fromTo(
      nodes,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: "power2.out" }
    );
    
    gsap.fromTo(
      arrows,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, stagger: 0.1, duration: 0.4, delay: 0.2, ease: "back.out(1.5)" }
    );
  }, [data]);

  if (!Array.isArray(data) || data.length === 0) return null;

  const selectedNode = data.find(n => n.id === selectedId) || data[0];

  const handleViewDecision = () => {
    if (state.activeProject && selectedNode.decisionTopic) {
      dispatch({ type: "SHOW_DECISION", project: state.activeProject, technology: selectedNode.decisionTopic });
    }
  };

  const handleViewEvidence = () => {
    if (state.activeProject && selectedNode.evidenceIds) {
      dispatch({ type: "SHOW_EVIDENCE", project: state.activeProject });
    }
  };

  const formatName = (name: string) => {
    const match = name.match(/^(.*?)(?:\s*\((.*?)\))?$/);
    if (!match) return { main: name, sub: null };
    return { main: match[1].trim(), sub: match[2] ? match[2].trim() : null };
  };

  return (
    <div className="w-full h-full mx-auto flex flex-col gap-8" ref={containerRef}>
      
      {/* Header */}
      <div className="flex-none">
        <h1 className="font-display text-4xl md:text-5xl font-light tracking-wide text-white uppercase">
          SYSTEM ARCHITECTURE
        </h1>
        <p className="font-mono text-xs tracking-widest text-white/40 mt-3 uppercase">
          Interactive Data Pipeline & Component Analysis
        </p>
      </div>

      {/* Main Layout: Pipeline (Top/Left) + Details (Right/Bottom) */}
      <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0 overflow-hidden">
        
        {/* Horizontal Pipeline */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar flex items-stretch py-4"
        >
          <div className="flex items-stretch px-2 h-full min-h-[400px]">
            {data.map((node, index) => {
              const isActive = node.id === selectedId;
              const formatted = formatName(node.name);
              
              return (
                <React.Fragment key={node.id}>
                  {/* Card */}
                  <div 
                    onClick={() => setSelectedId(node.id)}
                    className={`arch-node shrink-0 w-[320px] h-auto min-h-[460px] flex flex-col justify-between p-8 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
                      isActive 
                        ? "border-[var(--color-accent)] bg-white/[0.05] shadow-[0_0_20px_rgba(108,99,255,0.15)] scale-[1.02]" 
                        : "border-white/10 hover:border-white/30 bg-black/40 hover:bg-white/[0.02]"
                    }`}
                  >
                    {/* Top half */}
                    <div className="text-center flex flex-col items-center">
                      <div className={`font-mono text-xs font-bold mb-6 ${isActive ? "text-[var(--color-accent)]" : "text-white/40"}`}>
                        {String(index + 1).padStart(2, "0")}
                      </div>
                      <div className="flex justify-center w-full">
                        <DynamicIcon name={node.icon} />
                      </div>
                      <h3 className={`font-display text-xl leading-tight mb-2 text-center w-full break-words ${isActive ? "text-white" : "text-white/90"}`}>
                        {formatted.main}
                      </h3>
                      {formatted.sub && (
                        <div className="font-mono text-[10px] text-white/50 tracking-wider text-center w-full">
                          ({formatted.sub})
                        </div>
                      )}
                    </div>
                    
                    {/* Middle: Short Description */}
                    <div className="mt-6 mb-6 flex-1 flex flex-col justify-center">
                      <p className="font-body text-xs text-white/60 leading-relaxed text-center break-words">
                        {node.role}
                      </p>
                    </div>

                    {/* Bottom half: Input / Output mini tags */}
                    <div className="mt-auto space-y-4">
                      {node.input && (
                        <div className="text-left w-full">
                          <span className="font-mono text-[9px] text-[var(--color-accent)] uppercase block mb-1">Input</span>
                          <span className="font-body text-xs text-white/80 break-words">{node.input}</span>
                        </div>
                      )}
                      {node.output && (
                        <div className="text-left w-full">
                          <span className="font-mono text-[9px] text-[var(--color-accent)] uppercase block mb-1">Output</span>
                          <span className="font-body text-xs text-white/80 break-words">{node.output}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Arrow connector */}
                  {index < data.length - 1 && (
                    <div className="arch-arrow shrink-0 w-12 flex justify-center text-[var(--color-accent)] opacity-50">
                      <LucideIcons.ArrowRight size={20} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Details Panel (Right side) */}
        <div className="w-full lg:w-[420px] shrink-0 overflow-y-auto custom-scrollbar flex flex-col gap-4 pb-12">
          
          <div className="mb-4">
            <div className="font-mono text-[10px] tracking-widest text-white/40 mb-2 uppercase">
              SELECTED COMPONENT
            </div>
            <h2 className="font-display text-2xl text-white leading-tight">
              {selectedNode.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-center">
              <div className="font-mono text-[10px] text-[var(--color-accent)] tracking-widest uppercase mb-2 flex items-center gap-2">
                <LucideIcons.Zap size={12} /> ROLE
              </div>
              <p className="font-body text-sm text-white/80 break-words">{selectedNode.role}</p>
            </div>
            
            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex flex-col justify-center">
              <div className="font-mono text-[10px] text-[var(--color-accent)] tracking-widest uppercase mb-2 flex items-center gap-2">
                <LucideIcons.Settings size={12} /> TECHNOLOGY
              </div>
              <p className="font-body text-sm text-white/80 break-words">{formatName(selectedNode.name).main}</p>
              {formatName(selectedNode.name).sub && (
                <p className="font-mono text-[10px] text-white/50 mt-1 break-words">{formatName(selectedNode.name).sub}</p>
              )}
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-2 flex items-center gap-2">
                <LucideIcons.ArrowRightCircle size={12} /> INPUT
              </div>
              <p className="font-body text-xs text-white/70 break-words">{selectedNode.input || "N/A"}</p>
            </div>

            <div className="p-4 rounded-xl border border-white/10 bg-white/[0.02]">
              <div className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-2 flex items-center gap-2">
                <LucideIcons.CheckCircle2 size={12} /> OUTPUT
              </div>
              <p className="font-body text-xs text-white/70 break-words">{selectedNode.output || "N/A"}</p>
            </div>
          </div>

          {/* Decision / Why this technology */}
          <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02] mt-2">
            <div className="font-mono text-[10px] text-[var(--color-accent)] tracking-widest uppercase mb-3 flex items-center gap-2">
              <LucideIcons.Lightbulb size={12} /> WHY THIS TECHNOLOGY?
            </div>
            {selectedNode.decisionTopic ? (
              <div className="flex flex-col gap-4">
                <p className="font-body text-sm text-white/70">
                  Detailed technical decision available regarding the selection of this architecture component.
                </p>
                <button 
                  onClick={handleViewDecision}
                  className="self-start text-left font-mono text-[11px] tracking-wider uppercase text-white/90 hover:text-black transition-colors py-2 px-4 rounded-full border border-white/20 hover:bg-white flex items-center gap-2 group"
                >
                  <span>View Technical Decision</span>
                  <span className="opacity-50 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            ) : (
              <p className="font-body text-xs text-white/40 italic">
                No complex technical trade-offs documented for this node.
              </p>
            )}
          </div>

          {/* Evidence */}
          <div className="p-5 rounded-xl border border-white/10 bg-white/[0.02]">
            <div className="font-mono text-[10px] text-white/40 tracking-widest uppercase mb-3 flex items-center gap-2">
              <LucideIcons.FileCode2 size={12} /> EVIDENCE
            </div>
            {selectedNode.evidenceIds && selectedNode.evidenceIds.length > 0 ? (
              <div className="flex flex-col gap-4">
                <p className="font-body text-sm text-white/70">
                  Verified source code or deployment evidence is available.
                </p>
                <button 
                  onClick={handleViewEvidence}
                  className="self-start text-left font-mono text-[11px] tracking-wider uppercase text-white/90 hover:text-black transition-colors py-2 px-4 rounded-full border border-white/20 hover:bg-white flex items-center gap-2 group"
                >
                  <span>View Evidence</span>
                  <span className="opacity-50 group-hover:translate-x-1 transition-transform">→</span>
                </button>
              </div>
            ) : (
              <p className="font-body text-xs text-white/40 italic">
                No verified evidence available for this component in the current knowledge base.
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
