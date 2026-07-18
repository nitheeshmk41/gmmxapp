"use client";

import { useState } from "react";
import { WebsiteSectionDefinition } from "@/types";
import { WEBSITE_SECTIONS } from "@/lib/website-sections";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Settings, ShieldCheck, Check, Power, PowerOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionEditorModal } from "./SectionEditorModal";
import { saveWebsiteSections } from "@/features/website/actions";
import { toast } from "sonner";

interface SectionState extends WebsiteSectionDefinition {
  isEnabled: boolean;
  sortOrder: number;
}

export function SectionsManagerClient() {
  // In a real app, you would fetch the gym's specific configured sections from the server
  // and merge them with WEBSITE_SECTIONS. For now, we initialize from the registry.
  const [sections, setSections] = useState<SectionState[]>(
    WEBSITE_SECTIONS.map((sec, idx) => ({
      ...sec,
      isEnabled: sec.defaultEnabled,
      sortOrder: idx,
    }))
  );

  const [editingSection, setEditingSection] = useState<SectionState | null>(null);

  const toggleSection = (key: string) => {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, isEnabled: !s.isEnabled } : s))
    );
  };

  const handleSaveConfig = (key: string, config: any) => {
    setSections((prev) =>
      prev.map((s) => (s.key === key ? { ...s, defaultConfig: config } : s))
    );
  };

  const handleSaveOrder = async () => {
    const payload = sections.map((s, idx) => ({
      key: s.key,
      sortOrder: idx,
      isEnabled: s.isEnabled,
      config: s.defaultConfig
    }));

    const result = await saveWebsiteSections(payload);
    if (result.success) {
      toast.success("Sections updated successfully!");
    } else {
      toast.error(result.error || "Failed to update sections.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Manage Sections</h2>
          <p className="text-sm text-slate-500">Drag to reorder sections on your website.</p>
        </div>
        <button
          onClick={handleSaveOrder}
          className="px-4 py-2 bg-[#FF5C73] text-white rounded-xl text-sm font-semibold hover:bg-[#FF5C73]/90 transition-colors shadow-sm shadow-[#FF5C73]/20"
        >
          Save Layout
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <div className="w-8"></div>
          <div className="flex-1">Section</div>
          <div className="w-32 text-center">Category</div>
          <div className="w-24 text-center">Status</div>
          <div className="w-24 text-center">Actions</div>
        </div>
        
        <Reorder.Group axis="y" values={sections} onReorder={setSections} className="divide-y divide-slate-100">
          {sections.map((section) => (
            <SectionRow 
              key={section.key} 
              section={section} 
              onToggle={() => toggleSection(section.key)} 
              onEdit={() => setEditingSection(section)}
            />
          ))}
        </Reorder.Group>
      </div>

      <SectionEditorModal 
        isOpen={!!editingSection} 
        onClose={() => setEditingSection(null)} 
        section={editingSection}
        onSave={handleSaveConfig}
        initialConfig={editingSection?.defaultConfig}
      />
    </div>
  );
}

function SectionRow({ section, onToggle, onEdit }: { section: SectionState; onToggle: () => void, onEdit: () => void }) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={section}
      dragListener={false}
      dragControls={controls}
      className={cn(
        "flex items-center px-4 py-4 bg-white transition-colors",
        !section.isEnabled && "opacity-60 bg-slate-50/50"
      )}
    >
      {/* Drag Handle */}
      <div
        className="w-8 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600"
        onPointerDown={(e) => controls.start(e)}
      >
        <GripVertical size={18} />
      </div>

      {/* Title */}
      <div className="flex-1 min-w-0">
        <p className={cn("text-sm font-bold truncate", section.isEnabled ? "text-slate-900" : "text-slate-500")}>
          {section.label}
        </p>
        <p className="text-[11px] text-slate-500 font-mono mt-0.5">{section.key}</p>
      </div>

      {/* Category Badge */}
      <div className="w-32 flex justify-center">
        {section.category === "essential" && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
            ESSENTIAL
          </span>
        )}
        {section.category === "premium" && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100">
            <ShieldCheck size={10} />
            PREMIUM
          </span>
        )}
        {section.category === "mandatory" && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            MANDATORY
          </span>
        )}
      </div>

      {/* Status Toggle */}
      <div className="w-24 flex justify-center">
        <button
          onClick={onToggle}
          disabled={section.category === "mandatory"}
          className={cn(
            "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C73] focus-visible:ring-offset-2",
            section.isEnabled ? "bg-[#FF5C73]" : "bg-slate-200",
            section.category === "mandatory" && "opacity-50 cursor-not-allowed"
          )}
        >
          <span className="sr-only">Toggle {section.label}</span>
          <span
            className={cn(
              "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              section.isEnabled ? "translate-x-4" : "translate-x-0"
            )}
          />
        </button>
      </div>

      {/* Actions */}
      <div className="w-24 flex justify-center">
        <button 
          className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
          onClick={onEdit}
        >
          <Settings size={16} />
        </button>
      </div>
    </Reorder.Item>
  );
}
