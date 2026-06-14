import { notFound } from "next/navigation";
import { getTenantBySubdomain } from "@/lib/tenant";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

interface Props {
  params: Promise<{ subdomain: string }>;
}

export default async function GymContactPage({ params }: Props) {
  const { subdomain } = await params;
  const tenant = await getTenantBySubdomain(subdomain);

  if (!tenant) {
    notFound();
  }

  const { databases } = await createAdminClient();
  let contactEmail = tenant.email || "";
  let address = tenant.address || "";
  let phone = tenant.phone || "";
  let workingHours = tenant.workingHours || "";

  try {
    const settingsRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.SETTINGS,
      [Query.equal("gymId", tenant.id)]
    );
    const settingsDoc = settingsRes.documents[0];
    if (settingsDoc) {
      if (settingsDoc.contact_email) contactEmail = settingsDoc.contact_email;
      if (settingsDoc.address) address = settingsDoc.address;
      if (settingsDoc.whatsapp_number && !phone) phone = settingsDoc.whatsapp_number;
    }
  } catch (error) {
    console.error("Failed to fetch settings for contact", error);
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
      <main className="flex-1 py-16 px-6 max-w-3xl mx-auto w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-white mb-3">Get in Touch</h1>
          <p className="text-[#94A3B8]">Have questions or want to see the facility? Contact us directly.</p>
        </div>

        <div className="space-y-4 pt-4">
          {phone && (
            <a href={`tel:${phone}`} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF5C73]/50 transition-colors text-white">
              <Phone className="w-6 h-6 text-[#FF5C73] shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Phone & WhatsApp</p>
                <p className="text-base font-bold">{phone}</p>
              </div>
            </a>
          )}
          {contactEmail && (
            <a href={`mailto:${contactEmail}`} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FF5C73]/50 transition-colors text-white">
              <Mail className="w-6 h-6 text-[#FF5C73] shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Email Address</p>
                <p className="text-base font-bold truncate">{contactEmail}</p>
              </div>
            </a>
          )}
          {address && (
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 text-white">
              <MapPin className="w-6 h-6 text-[#FF5C73] shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Location</p>
                <p className="text-base font-medium">{address}</p>
              </div>
            </div>
          )}
          {workingHours && (
            <div className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10 text-white">
              <Clock className="w-6 h-6 text-[#FF5C73] shrink-0" />
              <div>
                <p className="text-xs text-slate-400">Working Hours</p>
                <p className="text-base font-medium">{workingHours}</p>
              </div>
            </div>
          )}
        </div>
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
