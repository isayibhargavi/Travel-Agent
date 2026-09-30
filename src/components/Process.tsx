import React from 'react';
import { FileText, Cpu, MailCheck, ShieldCheck } from 'lucide-react';

export const Process: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Intake & Route Specification',
      description:
        'You submit your flight vectors, preferred dates, party composition, budget envelope, and distinct interests through our bespoke interface.',
      meta: 'Encoded directly into n8n payload fields (field-0 to field-9)',
      icon: FileText,
    },
    {
      step: '02',
      title: 'Intelligent Cloud Orchestration',
      description:
        'Your request triggers an active n8n automation workflow on the cloud. The workflow verifies seasonal windows, cross-references boutique lodgings, and synthesizes local insights.',
      meta: 'Cloud execution on isayibhargavi.app.n8n.cloud',
      icon: Cpu,
    },
    {
      step: '03',
      title: 'Handcrafted Itinerary Delivery',
      description:
        'A comprehensive day-by-day expedition dossier is composed with private reservations, timing logistics, and local dining secrets, delivered directly to your inbox.',
      meta: 'Delivered in digital guide & printable format',
      icon: MailCheck,
    },
  ];

  return (
    <section id="process" className="py-20 lg:py-24 border-b border-neutral-800 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="max-w-2xl mb-14">
          <div className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
            The Curation Architecture
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-neutral-100 font-light text-balance">
            How our intelligent travel concierge works
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            A frictionless bridge between human travel curation and robust n8n workflow automation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col p-8 bg-neutral-900/40 border border-neutral-800 rounded-xl hover:border-neutral-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-3xl font-light text-amber-400/80">
                    {item.step}
                  </span>
                  <div className="p-2.5 bg-neutral-800/80 border border-neutral-700/60 rounded-lg text-amber-400">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="font-serif text-xl font-medium text-neutral-100 mb-3">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed flex-1">
                  {item.description}
                </p>

                <div className="mt-6 pt-4 border-t border-neutral-800/80">
                  <p className="text-[11px] font-mono text-neutral-500">
                    {item.meta}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
