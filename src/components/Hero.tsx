import React from 'react';
import { ArrowRight, Compass, ShieldCheck, Zap } from 'lucide-react';
import heroBg from '../assets/images/hero_luxury_travel_1790759975762.jpg';

interface HeroProps {
  onStartPlanning: () => void;
  onExploreDestinations: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onStartPlanning,
  onExploreDestinations,
}) => {
  return (
    <section className="relative overflow-hidden border-b border-neutral-800 bg-neutral-950 py-20 lg:py-28">
      {/* Background Image with Scrim Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="Serene coastal luxury villa terrace overlooking ocean at sunrise"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/40" />
        <div className="absolute inset-0 bg-radial from-transparent via-neutral-950/50 to-neutral-950" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Subtle editorial kicker without pills */}
          <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-amber-400 mb-4">
            <span>Bespoke Travel Concierge</span>
            <span aria-hidden="true">·</span>
            <span>Intelligent n8n Workflow Automation</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-neutral-100 leading-[1.15] text-balance">
            Journeys handcrafted to your <span className="italic font-normal text-amber-200">unhurried rhythm</span>.
          </h1>

          <p className="mt-6 text-base sm:text-lg text-neutral-300 leading-relaxed max-w-2xl font-normal">
            Escape the ordinary with precision itinerary planning. Seamlessly synchronized with our n8n travel agent cloud, our system transforms your destinations, travel style, and budget into an artisan day-by-day expedition.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              onClick={onStartPlanning}
              className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-md shadow-lg shadow-amber-950/30 transition-all duration-200 group"
            >
              <span>Design Your Itinerary</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <button
              onClick={onExploreDestinations}
              className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-neutral-300 bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 rounded-md backdrop-blur-sm transition-colors"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Browse Signature Destinations</span>
            </button>
          </div>

          {/* Value highlights adhering to zero-pill rule */}
          <div className="mt-12 pt-8 border-t border-neutral-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-neutral-300 text-sm">
            <div className="flex items-start gap-3">
              <Zap className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-neutral-100">Live n8n Form Sync</p>
                <p className="text-xs text-neutral-400 mt-0.5">Direct execution on your n8n cloud webhook</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Compass className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-neutral-100">Tailored Precision</p>
                <p className="text-xs text-neutral-400 mt-0.5">Budget, interests, & traveler types honored</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-neutral-100">Verified Curation</p>
                <p className="text-xs text-neutral-400 mt-0.5">Detailed day-by-day guides sent to your inbox</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
