"use client";

import React, { createContext, useContext, useReducer, ReactNode } from "react";
import type { EngineeringDecision } from "@/types";

import projects from "@/content/projects";

// ============================================================================
// 1. STATE DEFINITION
// ============================================================================

export type ActiveView = "home" | "architecture" | "decision" | "evidence";

export type PortfolioState = {
  activeProject: string | null;
  activeView: ActiveView;
  selectedTechnology: string | null;
  // This holds the exact, validated data from the Knowledge Layer to render.
  viewData: any; 
};

export const initialState: PortfolioState = {
  activeProject: null,
  activeView: "home",
  selectedTechnology: null,
  viewData: null,
};

// ============================================================================
// 2. EVENT DEFINITION
// ============================================================================

export type PortfolioEvent =
  | { type: "SHOW_HOME" }
  | { type: "SHOW_ARCHITECTURE"; project: string }
  | { type: "SHOW_DECISION"; project: string; technology: string }
  | { type: "SHOW_EVIDENCE"; project: string };

// ============================================================================
// 3. REDUCER
// ============================================================================

function portfolioReducer(state: PortfolioState, event: PortfolioEvent): PortfolioState {
  switch (event.type) {
    case "SHOW_HOME":
      return {
        ...state,
        activeProject: null,
        activeView: "home",
        selectedTechnology: null,
        viewData: null,
      };
    case "SHOW_ARCHITECTURE": {
      const p = projects.find(proj => proj.id === event.project);
      return {
        ...state,
        activeProject: event.project,
        activeView: "architecture",
        selectedTechnology: null,
        viewData: p?.architecture || null,
      };
    }
    case "SHOW_DECISION": {
      const p = projects.find(proj => proj.id === event.project);
      const decision = p?.decisions.find(d => 
        d.topic.toLowerCase().includes(event.technology.toLowerCase()) ||
        event.technology.toLowerCase().includes(d.topic.toLowerCase())
      );
      return {
        ...state,
        activeProject: event.project,
        activeView: "decision",
        selectedTechnology: decision?.topic || event.technology,
        viewData: decision || null,
      };
    }
    case "SHOW_EVIDENCE": {
      const p = projects.find(proj => proj.id === event.project);
      return {
        ...state,
        activeProject: event.project,
        activeView: "evidence",
        selectedTechnology: null,
        viewData: p?.evidence || [],
      };
    }
    default:
      return state;
  }
}

// ============================================================================
// 4. CONTEXT & PROVIDER
// ============================================================================

type PortfolioContextType = {
  state: PortfolioState;
  dispatch: React.Dispatch<PortfolioEvent>;
};

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(portfolioReducer, initialState);

  return (
    <PortfolioContext.Provider value={{ state, dispatch }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolioState() {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolioState must be used within a PortfolioProvider");
  }
  return context;
}
