import { notFound } from "next/navigation";
import Link from "next/link";
import { getTrainerById } from "@/features/trainers/actions";
import { getInitials } from "@/lib/utils";
import { PageHeader } from "@/components/dashboard/page-header";
import { Edit2, Phone, Mail, Award, Calendar, ChevronLeft, User } from "lucide-react";

interface Props {
  params: Promise<{ subdomain: string; id: string }>;
}

export default async function TrainerDetailPage({ params }: Props) {
  const { id } = await params;
  const trainer = await getTrainerById(id);

  if (!trainer) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in">
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/trainers"
          className="flex items-center gap-2 text-sm font-medium hover:text-[#FF5C73] transition-all text-slate-500"
        >
          <ChevronLeft size={16} />
          Back to Trainers
        </Link>
        <Link
          href={`/dashboard/trainers/${id}/edit`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-foreground)",
          }}
        >
          <Edit2 size={14} />
          Edit Trainer
        </Link>
      </div>

      <div
        className="p-8 rounded-2xl flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div
          className="w-24 h-24 rounded-2xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0"
          style={{ background: "linear-gradient(135deg, var(--color-brand-primary), var(--color-brand-hover))" }}
        >
          {trainer.photoUrl ? (
            <img src={trainer.photoUrl} alt={trainer.name} className="w-full h-full object-cover rounded-2xl" />
          ) : (
            getInitials(trainer.name)
          )}
        </div>

        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 leading-tight">{trainer.name}</h1>
            {trainer.specialization && (
              <p className="text-sm font-semibold mt-1" style={{ color: "var(--color-brand-primary)" }}>
                {trainer.specialization}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-600">
              <Phone size={15} className="text-slate-400" />
              <a href={`tel:${trainer.phone}`} className="hover:underline">{trainer.phone}</a>
            </div>
            {trainer.email && (
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-600">
                <Mail size={15} className="text-slate-400" />
                <a href={`mailto:${trainer.email}`} className="hover:underline">{trainer.email}</a>
              </div>
            )}
            {trainer.experienceYears !== null && (
              <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-600">
                <Award size={15} className="text-slate-400" />
                <span>{trainer.experienceYears} Years Experience</span>
              </div>
            )}
            <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-slate-600">
              <Calendar size={15} className="text-slate-400" />
              <span>Status: <span className={trainer.isActive ? "text-green-600 font-bold" : "text-slate-400 font-bold"}>{trainer.isActive ? "Active" : "Inactive"}</span></span>
            </div>
          </div>

          {trainer.bio && (
            <div className="pt-4 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Biography</p>
              <p className="text-sm text-slate-600 leading-relaxed">{trainer.bio}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
