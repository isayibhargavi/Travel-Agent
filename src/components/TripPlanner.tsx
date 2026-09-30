import React, { useState, useEffect } from 'react';
import {
  Calendar,
  CheckCircle2,
  DollarSign,
  Globe,
  Loader2,
  Mail,
  MapPin,
  PlaneTakeoff,
  Send,
  Sparkles,
  User,
  Users,
  AlertCircle,
  Copy,
  Check,
  RotateCcw,
} from 'lucide-react';
import { TripFormData, TravelType, SubmissionResponse, DestinationTemplate } from '../types.ts';
import { POPULAR_INTEREST_TAGS, POPULAR_ORIGIN_CITIES } from '../data/destinations.ts';

interface TripPlannerProps {
  selectedTemplate: DestinationTemplate | null;
  onClearTemplate: () => void;
  onOpenConsole: () => void;
  isN8nConnected: boolean | null;
}

const N8N_TARGET_URL = 'https://isayibhargavi.app.n8n.cloud/form/24209d6a-929c-41cf-bdd5-1f25cfee3d65';

export const TripPlanner: React.FC<TripPlannerProps> = ({
  selectedTemplate,
  onClearTemplate,
  onOpenConsole,
  isN8nConnected,
}) => {
  // Form State
  const [formData, setFormData] = useState<TripFormData>({
    name: '',
    email: '',
    source: 'New York (JFK)',
    destination: 'Kyoto, Japan',
    startDate: '',
    endDate: '',
    travelers: 2,
    budget: 5000,
    interests: 'Cultural heritage, tea ceremonies, Michelin dining, peaceful zen gardens',
    travelType: 'Couple',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof TripFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<SubmissionResponse | null>(null);
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Set default dates: 1 month from now for 7 days
  useEffect(() => {
    const today = new Date();
    const start = new Date(today);
    start.setDate(today.getDate() + 30);
    const end = new Date(start);
    end.setDate(start.getDate() + 8);

    const format = (d: Date) => d.toISOString().split('T')[0];
    setFormData((prev) => ({
      ...prev,
      startDate: prev.startDate || format(start),
      endDate: prev.endDate || format(end),
    }));
  }, []);

  // Update when template is selected
  useEffect(() => {
    if (selectedTemplate) {
      const today = new Date();
      const start = new Date(today);
      start.setDate(today.getDate() + 35);
      const end = new Date(start);
      end.setDate(start.getDate() + selectedTemplate.suggestedNights);

      const format = (d: Date) => d.toISOString().split('T')[0];

      setFormData((prev) => ({
        ...prev,
        destination: `${selectedTemplate.title}, ${selectedTemplate.country}`,
        startDate: format(start),
        endDate: format(end),
        budget: selectedTemplate.estimatedBudget,
        travelType: selectedTemplate.defaultTravelType,
        interests: selectedTemplate.interests.join(', '),
      }));
    }
  }, [selectedTemplate]);

  // Calculate duration
  const tripDuration = React.useMemo(() => {
    if (!formData.startDate || !formData.endDate) return { days: 0, nights: 0 };
    const s = new Date(formData.startDate).getTime();
    const e = new Date(formData.endDate).getTime();
    if (isNaN(s) || isNaN(e) || e <= s) return { days: 0, nights: 0 };
    const diffDays = Math.round((e - s) / (1000 * 60 * 60 * 24));
    return { days: diffDays + 1, nights: diffDays };
  }, [formData.startDate, formData.endDate]);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof TripFormData, string>> = {};
    if (!formData.name.trim()) errs.name = 'Please provide your full name.';
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid email address.';
    }
    if (!formData.source.trim()) errs.source = 'Origin departure city is required.';
    if (!formData.destination.trim()) errs.destination = 'Destination is required.';
    if (!formData.startDate) errs.startDate = 'Start date is required.';
    if (!formData.endDate) errs.endDate = 'End date is required.';
    if (formData.startDate && formData.endDate && formData.endDate <= formData.startDate) {
      errs.endDate = 'End date must be after start date.';
    }
    if (formData.travelers < 1) errs.travelers = 'Must be at least 1 traveler.';
    if (formData.budget <= 0) errs.budget = 'Please enter an estimated budget.';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleInterestToggle = (tag: string) => {
    const current = formData.interests
      ? formData.interests.split(',').map((s) => s.trim()).filter(Boolean)
      : [];
    let updated: string[];
    if (current.includes(tag)) {
      updated = current.filter((t) => t !== tag);
    } else {
      updated = [...current, tag];
    }
    setFormData((prev) => ({ ...prev, interests: updated.join(', ') }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmissionResult(null);

    try {
      // 1. Submit through our server-side proxy which transmits multipart/form-data to n8n
      const response = await fetch('/api/n8n/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          source: formData.source,
          destination: formData.destination,
          startDate: formData.startDate,
          endDate: formData.endDate,
          travelers: formData.travelers,
          budget: formData.budget,
          interests: formData.interests,
          travelType: formData.travelType,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmissionResult({
          success: true,
          status: data.status,
          message: data.message || 'Itinerary request successfully received by our n8n travel agent.',
          referenceCode: data.referenceCode || `TRIP-${Date.now().toString(36).toUpperCase()}`,
          submittedAt: data.submittedAt || new Date().toISOString(),
        });
      } else {
        // Handle rejection or error
        setSubmissionResult({
          success: false,
          error: data.error || 'Failed to submit itinerary to n8n workflow. Please verify connection.',
        });
      }
    } catch (err: any) {
      console.error('Submission failed:', err);
      setSubmissionResult({
        success: false,
        error: err?.message || 'Network error communicating with the concierge service.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopySummary = () => {
    const text = `Vagabond Itinerary Request:
Traveler: ${formData.name} (${formData.email})
Route: ${formData.source} -> ${formData.destination}
Dates: ${formData.startDate} to ${formData.endDate} (${tripDuration.nights} nights)
Party: ${formData.travelers} Traveler(s) · Style: ${formData.travelType}
Budget: $${formData.budget.toLocaleString()} USD
Curated Themes: ${formData.interests}
Dispatched via n8n Agent Workflow: ${N8N_TARGET_URL}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const resetForm = () => {
    setSubmissionResult(null);
    onClearTemplate();
  };

  return (
    <section id="planner" className="py-20 lg:py-24 border-b border-neutral-800 bg-neutral-950/90 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-amber-400 mb-2">
            <span>Intelligent Travel Planner</span>
            <span aria-hidden="true">·</span>
            <span>Live n8n Webhook Client</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl text-neutral-100 font-light text-balance">
            Design your bespoke itinerary request
          </h2>
          <p className="mt-3 text-sm text-neutral-400">
            Every submission triggers our automated n8n travel agent to analyze seasonal patterns, recommend accommodations, and prepare a personalized travel proposal.
          </p>
        </div>

        {/* Template Notification Banner */}
        {selectedTemplate && (
          <div className="mb-8 p-4 bg-amber-950/30 border border-amber-500/30 rounded-lg flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="text-sm font-medium text-amber-200">
                  Applied Template: {selectedTemplate.title} ({selectedTemplate.country})
                </p>
                <p className="text-xs text-amber-400/80">
                  Pre-filled destination, duration, budget, and interest tags.
                </p>
              </div>
            </div>
            <button
              onClick={onClearTemplate}
              className="text-xs text-neutral-400 hover:text-neutral-200 underline transition-colors whitespace-nowrap"
            >
              Reset to Custom
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: The Form */}
          <div className="lg:col-span-7 bg-neutral-900/60 border border-neutral-800 rounded-xl p-6 sm:p-8 backdrop-blur-sm">
            {submissionResult?.success ? (
              /* Success View */
              <div className="py-6 text-center space-y-6">
                <div className="w-16 h-16 bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>

                <div>
                  <h3 className="font-serif text-2xl text-neutral-100 font-medium">
                    Itinerary Dispatched to n8n Agent
                  </h3>
                  <p className="mt-2 text-sm text-neutral-300 max-w-md mx-auto">
                    Your travel dossier has been recorded and transmitted to the n8n Travel Agent engine.
                  </p>
                </div>

                <div className="bg-neutral-950 border border-neutral-800 rounded-lg p-5 text-left max-w-md mx-auto space-y-3 font-mono text-xs">
                  <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                    <span className="text-neutral-400">Reference:</span>
                    <span className="text-amber-400 font-bold">{submissionResult.referenceCode}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                    <span className="text-neutral-400">Traveler:</span>
                    <span className="text-neutral-200">{formData.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                    <span className="text-neutral-400">Route:</span>
                    <span className="text-neutral-200">{formData.source} → {formData.destination}</span>
                  </div>
                  <div className="flex justify-between border-b border-neutral-800/80 pb-2">
                    <span className="text-neutral-400">Dates:</span>
                    <span className="text-neutral-200">{formData.startDate} to {formData.endDate} ({tripDuration.nights} nights)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-400">Webhook Status:</span>
                    <span className="text-emerald-400">HTTP {submissionResult.status || 200} OK</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={handleCopySummary}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
                  >
                    {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedSummary ? 'Summary Copied' : 'Copy Trip Summary'}</span>
                  </button>

                  <button
                    onClick={resetForm}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Plan Another Journey</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Active Form */
              <form onSubmit={handleSubmit} className="space-y-6">
                {submissionResult?.error && (
                  <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-lg flex items-start gap-3 text-rose-200 text-xs">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold">Workflow Transmission Notice</p>
                      <p className="mt-1 text-rose-300">{submissionResult.error}</p>
                    </div>
                  </div>
                )}

                {/* Section 1: Traveler Details */}
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-4 pb-2 border-b border-neutral-800">
                    1. Primary Traveler Contact
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                        Full Name <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="e.g. Eleanor Vance"
                          className={`w-full pl-9 pr-3 py-2 text-sm bg-neutral-950 border rounded-md text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                            errors.name ? 'border-rose-500' : 'border-neutral-800'
                          }`}
                        />
                      </div>
                      {errors.name && <p className="mt-1 text-[11px] text-rose-400">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                        Email Address <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="eleanor@example.com"
                          className={`w-full pl-9 pr-3 py-2 text-sm bg-neutral-950 border rounded-md text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                            errors.email ? 'border-rose-500' : 'border-neutral-800'
                          }`}
                        />
                      </div>
                      {errors.email && <p className="mt-1 text-[11px] text-rose-400">{errors.email}</p>}
                    </div>
                  </div>
                </div>

                {/* Section 2: Origin & Destination */}
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-4 pb-2 border-b border-neutral-800">
                    2. Flight Vector & Destination
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-medium text-neutral-300">
                          Departure Origin <span className="text-amber-400">*</span>
                        </label>
                      </div>
                      <div className="relative">
                        <PlaneTakeoff className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={formData.source}
                          onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                          placeholder="e.g. London (LHR) or New York"
                          className={`w-full pl-9 pr-3 py-2 text-sm bg-neutral-950 border rounded-md text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                            errors.source ? 'border-rose-500' : 'border-neutral-800'
                          }`}
                        />
                      </div>
                      {errors.source && <p className="mt-1 text-[11px] text-rose-400">{errors.source}</p>}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {POPULAR_ORIGIN_CITIES.slice(0, 4).map((city) => (
                          <button
                            type="button"
                            key={city}
                            onClick={() => setFormData({ ...formData, source: city })}
                            className="text-[10px] text-neutral-400 bg-neutral-950 hover:text-neutral-200 px-2 py-0.5 rounded border border-neutral-800"
                          >
                            {city.split(' ')[0]}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                        Destination <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                        <input
                          type="text"
                          value={formData.destination}
                          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                          placeholder="e.g. Kyoto, Japan or Amalfi Coast"
                          className={`w-full pl-9 pr-3 py-2 text-sm bg-neutral-950 border rounded-md text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                            errors.destination ? 'border-rose-500' : 'border-neutral-800'
                          }`}
                        />
                      </div>
                      {errors.destination && <p className="mt-1 text-[11px] text-rose-400">{errors.destination}</p>}
                      <div className="mt-2 flex flex-wrap gap-1">
                        {['Kyoto, Japan', 'Positano, Italy', 'Zermatt, Switzerland', 'Reykjavik, Iceland'].map((dest) => (
                          <button
                            type="button"
                            key={dest}
                            onClick={() => setFormData({ ...formData, destination: dest })}
                            className="text-[10px] text-neutral-400 bg-neutral-950 hover:text-neutral-200 px-2 py-0.5 rounded border border-neutral-800"
                          >
                            {dest.split(',')[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 3: Dates & Duration */}
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-4 pb-2 border-b border-neutral-800">
                    3. Expedition Dates & Window
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                        Start Date <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                        <input
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                          className={`w-full pl-9 pr-3 py-2 text-sm bg-neutral-950 border rounded-md text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                            errors.startDate ? 'border-rose-500' : 'border-neutral-800'
                          }`}
                        />
                      </div>
                      {errors.startDate && <p className="mt-1 text-[11px] text-rose-400">{errors.startDate}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                        End Date <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                        <input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          className={`w-full pl-9 pr-3 py-2 text-sm bg-neutral-950 border rounded-md text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-400 ${
                            errors.endDate ? 'border-rose-500' : 'border-neutral-800'
                          }`}
                        />
                      </div>
                      {errors.endDate && <p className="mt-1 text-[11px] text-rose-400">{errors.endDate}</p>}
                    </div>
                  </div>

                  {tripDuration.nights > 0 && (
                    <p className="mt-2 text-xs text-neutral-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      <span>
                        Calculated duration: <strong className="text-neutral-200">{tripDuration.nights} nights / {tripDuration.days} days</strong>
                      </span>
                    </p>
                  )}
                </div>

                {/* Section 4: Party, Style & Budget */}
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-4 pb-2 border-b border-neutral-800">
                    4. Party Size, Travel Style & Budget
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                        Number of Travelers <span className="text-amber-400">*</span>
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max="20"
                          value={formData.travelers}
                          onChange={(e) => setFormData({ ...formData, travelers: parseInt(e.target.value, 10) || 1 })}
                          className="w-24 px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-md text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-400 tabular-nums"
                        />
                        <div className="flex items-center gap-1">
                          {[1, 2, 4, 6].map((num) => (
                            <button
                              type="button"
                              key={num}
                              onClick={() => setFormData({ ...formData, travelers: num })}
                              className={`px-2.5 py-1.5 text-xs rounded border transition-colors ${
                                formData.travelers === num
                                  ? 'bg-amber-400 text-neutral-950 border-amber-400 font-semibold'
                                  : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                        Total Estimated Budget (USD) <span className="text-amber-400">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
                        <input
                          type="number"
                          step="100"
                          min="500"
                          value={formData.budget}
                          onChange={(e) => setFormData({ ...formData, budget: parseInt(e.target.value, 10) || 0 })}
                          className="w-full pl-9 pr-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-md text-neutral-100 focus:outline-none focus:ring-1 focus:ring-amber-400 tabular-nums"
                        />
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {[2500, 5000, 7500, 12000].map((b) => (
                          <button
                            type="button"
                            key={b}
                            onClick={() => setFormData({ ...formData, budget: b })}
                            className="text-[10px] text-neutral-400 bg-neutral-950 hover:text-neutral-200 px-2 py-0.5 rounded border border-neutral-800"
                          >
                            ${b.toLocaleString()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Travel Type Select (matches field-9 in n8n) */}
                  <div className="mt-4">
                    <label className="block text-xs font-medium text-neutral-300 mb-2">
                      Travel Type <span className="text-amber-400">*</span>
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {(['Solo', 'Couple', 'Family', 'Friends', 'Business'] as TravelType[]).map((type) => (
                        <button
                          type="button"
                          key={type}
                          onClick={() => setFormData({ ...formData, travelType: type })}
                          className={`py-2 px-1 text-xs rounded-md text-center border transition-colors ${
                            formData.travelType === type
                              ? 'bg-amber-400 text-neutral-950 border-amber-400 font-semibold'
                              : 'bg-neutral-950 text-neutral-400 border-neutral-800 hover:text-neutral-200'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Section 5: Specific Interests */}
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-4 pb-2 border-b border-neutral-800">
                    5. Themes & Tailored Interests
                  </h3>

                  <div className="mb-3">
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Curated Tags (Click to toggle into request)
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto p-2 bg-neutral-950 border border-neutral-800 rounded-md">
                      {POPULAR_INTEREST_TAGS.map((tag) => {
                        const isSelected = formData.interests.toLowerCase().includes(tag.toLowerCase());
                        return (
                          <button
                            type="button"
                            key={tag}
                            onClick={() => handleInterestToggle(tag)}
                            className={`text-xs px-2.5 py-1 rounded transition-colors ${
                              isSelected
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/40 font-medium'
                                : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:text-neutral-200'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Specific Desires & Notes (Sent as <code className="text-amber-400 font-mono">field-8</code> to n8n)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.interests}
                      onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                      placeholder="e.g. Private tea tasting, preference for high floors with mountain views, vegetarian tasting menu recommendations..."
                      className="w-full px-3 py-2 text-sm bg-neutral-950 border border-neutral-800 rounded-md text-neutral-100 placeholder:text-neutral-600 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-xs text-neutral-400">
                    <Globe className="w-3.5 h-3.5 text-amber-400" />
                    <span>Transmits to n8n Cloud via secure proxy</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:cursor-not-allowed rounded-md shadow-md transition-colors"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Dispatching to n8n...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Itinerary Request</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Live Itinerary Voucher & n8n Sync status */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Voucher Card */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-xl">
              <div className="p-6 bg-gradient-to-b from-neutral-800/50 to-neutral-900 border-b border-neutral-800">
                <div className="flex items-center justify-between text-xs font-mono text-amber-400 uppercase tracking-wider mb-2">
                  <span>Draft Expedition Dossier</span>
                  <span className="text-neutral-400">Preview</span>
                </div>
                <h3 className="font-serif text-2xl text-neutral-100 font-medium">
                  {formData.destination || 'Uncharted Horizon'}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Origin: {formData.source || 'Pending Origin'}
                </p>
              </div>

              <div className="p-6 space-y-4 text-xs">
                {/* Flight Vector Representation */}
                <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800 flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-[10px] uppercase font-mono text-neutral-500">Departure</p>
                    <p className="font-medium text-neutral-200 mt-0.5">{formData.source || 'TBD'}</p>
                  </div>
                  <div className="flex-1 px-4 flex flex-col items-center">
                    <span className="text-[10px] font-mono text-amber-400 mb-1">
                      {tripDuration.nights > 0 ? `${tripDuration.nights} Nights` : 'Direct Flow'}
                    </span>
                    <div className="w-full flex items-center">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <div className="flex-1 border-t border-dashed border-neutral-700 mx-1" />
                      <PlaneTakeoff className="w-3.5 h-3.5 text-amber-400" />
                      <div className="flex-1 border-t border-dashed border-neutral-700 mx-1" />
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] uppercase font-mono text-neutral-500">Arrival</p>
                    <p className="font-medium text-neutral-200 mt-0.5">{formData.destination || 'TBD'}</p>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                    <p className="text-[10px] uppercase font-mono text-neutral-500">Party & Style</p>
                    <p className="font-medium text-neutral-200 mt-1 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-amber-400" />
                      <span>{formData.travelers} Traveler(s) · {formData.travelType}</span>
                    </p>
                  </div>

                  <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                    <p className="text-[10px] uppercase font-mono text-neutral-500">Investment Target</p>
                    <p className="font-medium text-neutral-200 mt-1 tabular-nums">
                      ${formData.budget.toLocaleString()} USD
                    </p>
                    <p className="text-[10px] text-neutral-500 mt-0.5">
                      (~${Math.round(formData.budget / Math.max(1, formData.travelers)).toLocaleString()} / traveler)
                    </p>
                  </div>
                </div>

                {/* Dates breakdown */}
                <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                  <p className="text-[10px] uppercase font-mono text-neutral-500">Expedition Window</p>
                  <p className="font-medium text-neutral-200 mt-1 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      {formData.startDate || 'Start'} → {formData.endDate || 'End'}
                    </span>
                  </p>
                </div>

                {/* Selected Themes */}
                <div className="p-3 bg-neutral-950 rounded-lg border border-neutral-800">
                  <p className="text-[10px] uppercase font-mono text-neutral-500 mb-1.5">Specified Preferences</p>
                  <p className="text-neutral-300 italic text-[11px] leading-relaxed line-clamp-3">
                    {formData.interests || 'None specified yet. Select preset tags or enter custom notes.'}
                  </p>
                </div>
              </div>

              {/* Card Footer with n8n Status */}
              <div className="p-4 bg-neutral-950/80 border-t border-neutral-800 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isN8nConnected === true
                        ? 'bg-emerald-500'
                        : isN8nConnected === false
                        ? 'bg-rose-500'
                        : 'bg-amber-400 animate-pulse'
                    }`}
                  />
                  <span className="text-neutral-400">
                    {isN8nConnected === true ? 'n8n Webhook Live' : 'Testing n8n Connection...'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={onOpenConsole}
                  className="text-amber-400 hover:text-amber-300 font-mono text-[11px] underline"
                >
                  View Workflow Schema
                </button>
              </div>
            </div>

            {/* Concierge Guarantee Card */}
            <div className="p-5 bg-neutral-900/40 border border-neutral-800 rounded-xl space-y-3">
              <h4 className="font-serif text-lg text-neutral-200 font-medium">
                The Vagabond Quality Covenant
              </h4>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Once dispatched, our n8n automation passes your criteria through curated supplier APIs, private lodging reserves, and local cultural coordinators. Within 48 hours, a finalized bespoke dossier is compiled for your review.
              </p>
              <div className="pt-2 flex items-center gap-3 text-xs text-amber-400/90">
                <span>· 0% Commission Surcharges</span>
                <span>· Dedicated Concierge Escort</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
