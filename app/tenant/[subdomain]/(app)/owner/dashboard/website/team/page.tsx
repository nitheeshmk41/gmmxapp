import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function TeamPage() {
  return (
    <Card className="border-slate-200 bg-white shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-slate-900">
          <Users size={18} className="text-[#FF5C73]" /> Team / Trainers
        </CardTitle>
        <CardDescription className="text-slate-500">
          Select which staff members should be displayed publicly on your website.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center bg-slate-50">
          <p className="text-slate-500 font-medium">Team selection coming soon.</p>
        </div>
      </CardContent>
    </Card>
  );
}
