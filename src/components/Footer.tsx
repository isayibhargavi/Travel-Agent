import React from 'react';
import { Terminal, Globe, Shield } from 'lucide-react';

interface FooterProps {
  onOpenConsole: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenConsole }) => {
  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 py-12 text-xs text-neutral-400">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-neutral-850">
          <div>
            <a
              href="#"
              className="font-serif text-xl font-bold tracking-tight text-neutral-100 hover:text-amber-400 transition-colors"
            >
              Vagabond Bespoke
            </a>
            <p className="mt-1 text-xs text-neutral-500 max-w-sm">
              Artisan luxury travel curation powered by intelligent n8n agent workflow automation.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs">
            <a href="#destinations" className="hover:text-neutral-200 transition-colors">
              Expeditions
            </a>
            <a href="#process" className="hover:text-neutral-200 transition-colors">
              The Process
            </a>
            <a href="#planner" className="hover:text-neutral-200 transition-colors">
              Trip Planner
            </a>
            <a href="#proof" className="hover:text-neutral-200 transition-colors">
              Traveler Proof
            </a>
            <button
              onClick={onOpenConsole}
              className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 transition-colors font-mono"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>n8n Inspector</span>
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© {new Date().getFullYear()} Vagabond Bespoke Concierge. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-amber-400" />
              <span>Private & Encrypted Intake</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1">
              <Globe className="w-3 h-3 text-amber-400" />
              <span>Automated via n8n Cloud</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
