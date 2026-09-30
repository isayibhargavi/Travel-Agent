import React from 'react';
import { Sparkles, Terminal } from 'lucide-react';

interface NavbarProps {
  onOpenConsole: () => void;
  onScrollToPlanner: () => void;
  isN8nConnected: boolean | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenConsole,
  onScrollToPlanner,
  isN8nConnected,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-800 bg-neutral-950/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#"
          className="font-serif text-xl font-bold tracking-tight text-neutral-100 hover:text-amber-400 transition-colors whitespace-nowrap"
        >
          Vagabond Bespoke
        </a>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <a
            href="#destinations"
            className="hover:text-neutral-100 transition-colors"
          >
            Curated Expeditions
          </a>
          <a
            href="#process"
            className="hover:text-neutral-100 transition-colors"
          >
            The Process
          </a>
          <a
            href="#planner"
            className="hover:text-neutral-100 transition-colors"
          >
            Trip Planner
          </a>
          <a
            href="#proof"
            className="hover:text-neutral-100 transition-colors"
          >
            Traveler Proof
          </a>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenConsole}
            title="Inspect n8n automation workflow connection"
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-mono text-neutral-300 bg-neutral-900 border border-neutral-800 rounded-md hover:border-neutral-700 transition-colors"
          >
            <Terminal className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">n8n Engine</span>
            <span
              className={`w-2 h-2 rounded-full ${
                isN8nConnected === true
                  ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]'
                  : isN8nConnected === false
                  ? 'bg-rose-500'
                  : 'bg-amber-400 animate-pulse'
              }`}
            />
          </button>

          <button
            onClick={onScrollToPlanner}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Plan Journey</span>
          </button>
        </div>
      </div>
    </header>
  );
};
