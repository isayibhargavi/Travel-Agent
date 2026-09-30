import React from 'react';
import { ArrowUpRight, Check, Clock, DollarSign, Users } from 'lucide-react';
import { FEATURED_DESTINATIONS } from '../data/destinations.ts';
import { DestinationTemplate } from '../types.ts';

interface DestinationsProps {
  onSelectTemplate: (template: DestinationTemplate) => void;
}

export const Destinations: React.FC<DestinationsProps> = ({ onSelectTemplate }) => {
  return (
    <section id="destinations" className="py-20 lg:py-24 border-b border-neutral-800 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
              Featured Itinerary Inspirations
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl text-neutral-100 font-light text-balance">
              Signature journeys crafted for discerning travelers
            </h2>
          </div>
          <p className="text-sm text-neutral-400 max-w-md">
            Click any expedition below to pre-populate our intelligent trip builder and dispatch your customized preferences directly to our n8n travel agent.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {FEATURED_DESTINATIONS.map((dest) => (
            <div
              key={dest.id}
              className="flex flex-col bg-neutral-900/60 border border-neutral-800 rounded-xl overflow-hidden hover:border-neutral-700 transition-all duration-200 group"
            >
              {/* Aspect Ratio 4:3 Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900">
                <img
                  src={dest.image}
                  alt={dest.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-neutral-200 font-medium">
                  <span className="bg-neutral-950/70 backdrop-blur-md px-2.5 py-1 rounded border border-neutral-700/50">
                    {dest.country}
                  </span>
                  <span className="bg-neutral-950/70 backdrop-blur-md px-2.5 py-1 rounded border border-neutral-700/50 tabular-nums">
                    Est. ${dest.estimatedBudget.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="flex flex-col flex-1 p-6">
                <h3 className="font-serif text-2xl text-neutral-100 font-medium group-hover:text-amber-300 transition-colors">
                  {dest.title}
                </h3>
                <p className="mt-2 text-xs text-neutral-400 leading-relaxed">
                  {dest.tagline}
                </p>

                {/* Metadata Row adhering to Zero-Pill discipline */}
                <div className="mt-4 py-3 border-y border-neutral-800/80 flex items-center justify-between text-xs text-neutral-400">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{dest.suggestedDuration}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-400" />
                    <span>Ideal for {dest.defaultTravelType}</span>
                  </div>
                </div>

                <div className="mt-4 flex-1">
                  <p className="text-xs font-medium text-neutral-300 mb-2">Curated Highlights:</p>
                  <ul className="space-y-2">
                    {dest.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-400">
                        <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Interests tags in clean muted text */}
                <div className="mt-5 pt-4 border-t border-neutral-800/80">
                  <p className="text-[11px] text-neutral-500 mb-2">Included themes:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {dest.interests.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] text-neutral-300 bg-neutral-800/70 px-2 py-0.5 rounded border border-neutral-700/40"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => onSelectTemplate(dest)}
                  className="mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-neutral-900 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors group/btn"
                >
                  <span>Use as Trip Template</span>
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
