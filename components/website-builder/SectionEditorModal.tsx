"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { WebsiteSectionDefinition } from "@/types";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  section: WebsiteSectionDefinition | null;
  onSave: (key: string, config: any) => void;
  initialConfig?: any;
}

export function SectionEditorModal({ isOpen, onClose, section, onSave, initialConfig }: Props) {
  const [config, setConfig] = useState<any>(initialConfig || section?.defaultConfig || {});

  if (!isOpen || !section) return null;

  const handleSave = () => {
    onSave(section.key, config);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Edit {section.label}</h3>
            <p className="text-sm text-slate-500">Configure settings for this section.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-xl transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {section.key === "hero" ? (
            <HeroEditorForm config={config} onChange={setConfig} />
          ) : section.key === "about" ? (
            <AboutEditorForm config={config} onChange={setConfig} />
          ) : (
            <GenericEditorForm config={config} onChange={setConfig} />
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="px-4 py-2 text-sm font-semibold text-white bg-[#FF5C73] hover:bg-[#FF5C73]/90 rounded-xl shadow-sm shadow-[#FF5C73]/20 transition-all"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// Forms
// ─────────────────────────────────────────────

function HeroEditorForm({ config, onChange }: { config: any, onChange: (c: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
        <input 
          type="text" 
          value={config.title || ""} 
          onChange={(e) => onChange({ ...config, title: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5C73]"
          placeholder="e.g. Welcome to GMMX"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Subtitle</label>
        <input 
          type="text" 
          value={config.subtitle || ""} 
          onChange={(e) => onChange({ ...config, subtitle: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5C73]"
          placeholder="e.g. Your fitness journey starts here"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Background Image URL</label>
        <input 
          type="url" 
          value={config.bgImage || ""} 
          onChange={(e) => onChange({ ...config, bgImage: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5C73]"
          placeholder="https://..."
        />
      </div>
    </div>
  );
}

function AboutEditorForm({ config, onChange }: { config: any, onChange: (c: any) => void }) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">About Text</label>
        <textarea 
          value={config.text || ""} 
          onChange={(e) => onChange({ ...config, text: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF5C73] min-h-[120px]"
          placeholder="Write something about your gym..."
        />
      </div>
    </div>
  );
}

function GenericEditorForm({ config, onChange }: { config: any, onChange: (c: any) => void }) {
  return (
    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-center">
      <p className="text-sm text-slate-500">Specific configuration options for this section are coming soon.</p>
    </div>
  );
}
