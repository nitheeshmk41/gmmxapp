import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutTemplate } from "lucide-react";

export default function TemplatesPage() {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
          <LayoutTemplate size={18} className="text-[#FF5C73]" /> Choose Template
        </CardTitle>
        <CardDescription className="text-slate-500">
          Select a layout design for your gym's public website.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-2 border-[#FF5C73] rounded-xl overflow-hidden relative cursor-pointer group">
            <div className="absolute top-2 right-2 bg-[#FF5C73] text-white text-[10px] font-bold px-2 py-1 rounded-full z-10">Active</div>
            <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center p-4">
              <span className="text-slate-400 font-bold">Modern Fitness</span>
            </div>
            <div className="p-3 bg-white border-t border-slate-100">
              <p className="font-semibold text-sm text-slate-900">Modern Fitness</p>
            </div>
          </div>

          <div className="border-2 border-transparent hover:border-slate-300 transition-colors rounded-xl overflow-hidden relative cursor-pointer group">
            <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center p-4">
              <span className="text-slate-400 font-bold">Minimal (Coming Soon)</span>
            </div>
            <div className="p-3 bg-white border-t border-slate-100">
              <p className="font-semibold text-sm text-slate-900">Minimal</p>
            </div>
          </div>

          <div className="border-2 border-transparent hover:border-slate-300 transition-colors rounded-xl overflow-hidden relative cursor-pointer group">
            <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center p-4">
              <span className="text-slate-400 font-bold">Performance (Coming Soon)</span>
            </div>
            <div className="p-3 bg-white border-t border-slate-100">
              <p className="font-semibold text-sm text-slate-900">Performance</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
