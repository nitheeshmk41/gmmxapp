import { notFound } from "next/navigation";
import { getTenantBySubdomain } from "@/lib/tenant";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS, TrainerDocument } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import Link from "next/link";
import { Dumbbell, Phone } from "lucide-react";

interface Props {
  params: Promise<{ subdomain: string }>;
}

export default async function GymTrainersPage({ params }: Props) {
  const { subdomain } = await params;
  const tenant = await getTenantBySubdomain(subdomain);

  if (!tenant) {
    notFound();
  }

  const { databases } = await createAdminClient();
  let trainers: TrainerDocument[] = [];

  try {
    const trainersRes = await databases.listDocuments<TrainerDocument>(
      APPWRITE_DB_ID,
      COLLECTIONS.TRAINERS,
      [Query.equal("gymId", tenant.id), Query.equal("isActive", true)]
    );
    trainers = trainersRes.documents;
  } catch (error) {
    console.error("Failed to fetch trainers", error);
  }

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: "#0A0F1E", fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <nav className="w-full flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#0A0F1E]/90 backdrop-blur-md sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-3">
          {tenant.logoUrl ? (
            <img src={tenant.logoUrl} alt={tenant.name} className="w-9 h-9 rounded-xl object-contain" />
          ) : (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: "#FF5C73" }}>{tenant.name[0]}</div>
          )}
          <span className="font-bold text-white text-lg">{tenant.name}</span>
        </Link>
        <Link href="/" className="text-sm font-semibold text-[#FF5C73] hover:underline">
          ← Back to Home
        </Link>
      </nav>

      {/* Main Content */}
      <main className="flex-1 py-16 px-6 max-w-5xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-3">Our Trainers</h1>
          <p className="text-[#94A3B8] max-w-md mx-auto">Expert guides committed to helping you transform your body and build strength.</p>
        </div>

        {trainers.length === 0 ? (
          <div className="text-center py-16 text-[#94A3B8]">
            <Dumbbell className="mx-auto mb-4 w-12 h-12 text-slate-700" />
            <p>No trainers showcased yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
            {trainers.map((trainer) => (
              <div
                key={trainer.$id}
                className="p-6 rounded-2xl text-center"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  className="w-24 h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #FF5C73, #E64A61)" }}
                >
                  {trainer.photoUrl ? (
                    <img src={trainer.photoUrl} alt={trainer.name} className="w-full h-full object-cover" />
                  ) : (
                    trainer.name[0]
                  )}
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{trainer.name}</h3>
                {trainer.specialization && (
                  <p className="text-sm font-semibold text-[#FF5C73] mb-2">{trainer.specialization}</p>
                )}
                {trainer.experienceYears !== null && (
                  <p className="text-xs text-slate-400 mb-3">{trainer.experienceYears} Years Experience</p>
                )}
                {trainer.bio && (
                  <p className="text-sm text-[#94A3B8] leading-relaxed pt-2 border-t border-white/5">{trainer.bio}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-white/5">
        <p className="text-xs text-slate-600">
          © {new Date().getFullYear()} {tenant.name}. Powered by <a href="https://gmmx.app" className="text-[#FF5C73]">GMMX</a>
        </p>
      </footer>
    </div>
  );
}
