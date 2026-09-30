import React from 'react';
import { Quote, Star } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Dr. Alistair Finch',
      role: 'Professor of Architecture, Edinburgh',
      route: 'London (LHR) → Kyoto & Kanazawa',
      dates: 'October 2025 · 12 Nights',
      quote:
        'The depth of the itinerary was astonishing. Within 48 hours of submitting my preferences to the concierge, I had private admissions to sub-temples in Daitoku-ji that are completely inaccessible to normal booking channels.',
      rating: 5,
    },
    {
      name: 'Elena Rostova & Marc Dubois',
      role: 'Design Directors, Zurich',
      route: 'Zurich (ZRH) → Positano & Capri',
      dates: 'June 2025 · 8 Nights',
      quote:
        'We were skeptical of automated travel agent workflows until we received the dossier. Every private boat skipper, cliffside table, and transfer was synchronized with zero friction. Worth every penny of our investment.',
      rating: 5,
    },
    {
      name: 'Devon Takahashi',
      role: 'Venture Partner, San Francisco',
      route: 'San Francisco (SFO) → Zermatt & St. Moritz',
      dates: 'January 2026 · 7 Nights',
      quote:
        'The Glacier Express Excellence Class tickets and private backcountry ski guide were secured flawlessly. The automated n8n pipeline makes the intake effortless, but the itinerary quality feels genuinely bespoke.',
      rating: 5,
    },
  ];

  return (
    <section id="proof" className="py-20 lg:py-24 border-b border-neutral-800 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
            Verified Traveler Experiences
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-neutral-100 font-light text-balance">
            Realized expeditions across the globe
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            Read direct feedback from travelers who entrusted their journeys to our automated travel concierge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, i) => (
            <div
              key={i}
              className="flex flex-col p-6 bg-neutral-900/40 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                {[...Array(rev.rating)].map((_, idx) => (
                  <Star key={idx} className="w-3.5 h-3.5 fill-amber-400" />
                ))}
              </div>

              <p className="text-xs sm:text-sm text-neutral-300 italic leading-relaxed flex-1">
                "{rev.quote}"
              </p>

              <div className="mt-6 pt-4 border-t border-neutral-800/80">
                <p className="font-medium text-sm text-neutral-100">{rev.name}</p>
                <p className="text-xs text-neutral-400 mt-0.5">{rev.role}</p>

                {/* Unboxed metadata separator */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-amber-400/90 font-mono">
                  <span>{rev.route}</span>
                  <span aria-hidden="true">·</span>
                  <span>{rev.dates}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
