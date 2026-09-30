import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { Destinations } from './components/Destinations.tsx';
import { Process } from './components/Process.tsx';
import { TripPlanner } from './components/TripPlanner.tsx';
import { Testimonials } from './components/Testimonials.tsx';
import { Footer } from './components/Footer.tsx';
import { N8nConsoleModal } from './components/N8nConsoleModal.tsx';
import { DestinationTemplate } from './types.ts';

export default function App() {
  const [selectedTemplate, setSelectedTemplate] = useState<DestinationTemplate | null>(null);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [isN8nConnected, setIsN8nConnected] = useState<boolean | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const checkN8nHealth = useCallback(async () => {
    try {
      const res = await fetch('/api/n8n/health');
      if (res.ok) {
        const data = await res.json();
        setIsN8nConnected(data.connected);
        setLatencyMs(data.latencyMs ?? null);
      } else {
        setIsN8nConnected(false);
      }
    } catch {
      setIsN8nConnected(false);
    }
  }, []);

  useEffect(() => {
    checkN8nHealth();
  }, [checkN8nHealth]);

  const scrollToPlanner = () => {
    const el = document.getElementById('planner');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToDestinations = () => {
    const el = document.getElementById('destinations');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectTemplate = (template: DestinationTemplate) => {
    setSelectedTemplate(template);
    scrollToPlanner();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-400/20 selection:text-amber-200">
      <Navbar
        onOpenConsole={() => setIsConsoleOpen(true)}
        onScrollToPlanner={scrollToPlanner}
        isN8nConnected={isN8nConnected}
      />

      <main className="flex-1">
        <Hero
          onStartPlanning={scrollToPlanner}
          onExploreDestinations={scrollToDestinations}
        />

        <Destinations onSelectTemplate={handleSelectTemplate} />

        <Process />

        <TripPlanner
          selectedTemplate={selectedTemplate}
          onClearTemplate={() => setSelectedTemplate(null)}
          onOpenConsole={() => setIsConsoleOpen(true)}
          isN8nConnected={isN8nConnected}
        />

        <Testimonials />
      </main>

      <Footer onOpenConsole={() => setIsConsoleOpen(true)} />

      <N8nConsoleModal
        isOpen={isConsoleOpen}
        onClose={() => setIsConsoleOpen(false)}
        isN8nConnected={isN8nConnected}
        onRefreshHealth={checkN8nHealth}
        latencyMs={latencyMs}
      />
    </div>
  );
}
