import React, { useState, useEffect } from 'react';
import {
  X,
  Terminal,
  Activity,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  RefreshCw,
  Code,
  Shield,
} from 'lucide-react';

interface N8nConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  isN8nConnected: boolean | null;
  onRefreshHealth: () => void;
  latencyMs: number | null;
}

const N8N_FORM_URL = 'https://isayibhargavi.app.n8n.cloud/form/24209d6a-929c-41cf-bdd5-1f25cfee3d65';

export const N8nConsoleModal: React.FC<N8nConsoleModalProps> = ({
  isOpen,
  onClose,
  isN8nConnected,
  onRefreshHealth,
  latencyMs,
}) => {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const sampleCurl = `curl -X POST "${N8N_FORM_URL}" \\
  -F "field-0=Eleanor Vance" \\
  -F "field-1=eleanor@example.com" \\
  -F "field-2=London (LHR)" \\
  -F "field-3=Kyoto, Japan" \\
  -F "field-4=2026-11-01" \\
  -F "field-5=2026-11-10" \\
  -F "field-6=2" \\
  -F "field-7=5500" \\
  -F "field-8=Tea ceremonies, Zen gardens, Kaiseki" \\
  -F "field-9=Couple"`;

  const copyToClipboard = (text: string, type: 'url' | 'curl') => {
    navigator.clipboard.writeText(text);
    if (type === 'url') {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } else {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    }
  };

  const schema = [
    { field: 'field-0', label: 'Name', type: 'text', role: 'Full traveler name' },
    { field: 'field-1', label: 'Email', type: 'email', role: 'Itinerary delivery email' },
    { field: 'field-2', label: 'Source', type: 'text', role: 'Departure origin city / airport' },
    { field: 'field-3', label: 'Destination', type: 'text', role: 'Target travel destination' },
    { field: 'field-4', label: 'Start Date', type: 'date', role: 'Expedition departure date' },
    { field: 'field-5', label: 'End Date', type: 'date', role: 'Expedition return date' },
    { field: 'field-6', label: 'Number of Travelers', type: 'number', role: 'Party count (1-20)' },
    { field: 'field-7', label: 'Budget', type: 'number', role: 'Estimated total budget (USD)' },
    { field: 'field-8', label: 'Interests', type: 'text', role: 'Concierge theme preferences & desires' },
    { field: 'field-9', label: 'Travel Type', type: 'select', role: 'Solo | Couple | Family | Friends | Business' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950">
          <div className="flex items-center gap-2.5">
            <Terminal className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-serif text-lg text-neutral-100 font-medium">
                n8n Workflow Integration Inspector
              </h3>
              <p className="text-xs text-neutral-400">
                Live connection status & form schema configuration
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-100 hover:bg-neutral-800 rounded-md transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-neutral-300">
          {/* Status Bar */}
          <div className="p-4 bg-neutral-950 rounded-lg border border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className={`w-3 h-3 rounded-full ${
                  isN8nConnected === true
                    ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.6)]'
                    : isN8nConnected === false
                    ? 'bg-rose-500'
                    : 'bg-amber-400 animate-pulse'
                }`}
              />
              <div>
                <p className="font-medium text-neutral-100 text-sm">
                  {isN8nConnected === true
                    ? 'n8n Cloud Endpoint Active'
                    : isN8nConnected === false
                    ? 'Endpoint Unreachable'
                    : 'Pinging Endpoint...'}
                </p>
                <p className="text-neutral-400 text-[11px] font-mono mt-0.5">
                  Target: {N8N_FORM_URL}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {latencyMs !== null && (
                <span className="font-mono text-neutral-400 bg-neutral-900 px-2 py-1 rounded border border-neutral-800 tabular-nums">
                  {latencyMs}ms latency
                </span>
              )}
              <button
                onClick={onRefreshHealth}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 rounded border border-neutral-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ping Test</span>
              </button>
            </div>
          </div>

          {/* Form Endpoint Link */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono uppercase tracking-wider text-amber-400 text-[11px]">
                Configured n8n Form Webhook URL
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => copyToClipboard(N8N_FORM_URL, 'url')}
                  className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-200"
                >
                  {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                </button>
                <a
                  href={N8N_FORM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open n8n Form</span>
                </a>
              </div>
            </div>
            <div className="p-2.5 bg-neutral-950 border border-neutral-800 rounded font-mono text-[11px] text-neutral-300 break-all select-all">
              {N8N_FORM_URL}
            </div>
          </div>

          {/* Schema Mapping Table */}
          <div>
            <h4 className="font-mono uppercase tracking-wider text-amber-400 text-[11px] mb-2">
              Exact Field Mapping (10 Inputs)
            </h4>
            <div className="border border-neutral-800 rounded-lg overflow-hidden">
              <table className="w-full text-left font-mono text-[11px]">
                <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                  <tr>
                    <th className="py-2 px-3">Field Key</th>
                    <th className="py-2 px-3">Form Label</th>
                    <th className="py-2 px-3">Type</th>
                    <th className="py-2 px-3">Role / Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800/60 bg-neutral-900/60">
                  {schema.map((item) => (
                    <tr key={item.field} className="hover:bg-neutral-800/40">
                      <td className="py-2 px-3 text-amber-400 font-semibold">{item.field}</td>
                      <td className="py-2 px-3 text-neutral-200">{item.label}</td>
                      <td className="py-2 px-3 text-neutral-400">{item.type}</td>
                      <td className="py-2 px-3 text-neutral-300 font-sans text-xs">{item.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Direct cURL Verification Code */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono uppercase tracking-wider text-amber-400 text-[11px] flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5" />
                <span>Backend Transmission Payload</span>
              </span>
              <button
                onClick={() => copyToClipboard(sampleCurl, 'curl')}
                className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-200"
              >
                {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCurl ? 'Copied' : 'Copy cURL'}</span>
              </button>
            </div>
            <pre className="p-3 bg-neutral-950 border border-neutral-800 rounded text-[11px] font-mono text-neutral-300 overflow-x-auto leading-relaxed">
              {sampleCurl}
            </pre>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-neutral-500">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Encrypted POST transmission with multipart/form-data</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-neutral-200 bg-neutral-800 hover:bg-neutral-700 rounded transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
