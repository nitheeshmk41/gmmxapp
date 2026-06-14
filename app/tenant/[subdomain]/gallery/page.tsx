import { notFound } from "next/navigation";
import { getTenantBySubdomain } from "@/lib/tenant";
import { createAdminClient } from "@/lib/appwrite/server";
import { APPWRITE_DB_ID, COLLECTIONS } from "@/lib/appwrite/types";
import { Query } from "node-appwrite";
import Link from "next/link";
import { Image as ImageIcon } from "lucide-react";

interface Props {
  params: Promise<{ subdomain: string }>;
}

export default async function GymGalleryPage({ params }: Props) {
  const { subdomain } = await params;
  const tenant = await getTenantBySubdomain(subdomain);

  if (!tenant) {
    notFound();
  }

  const { databases } = await createAdminClient();
  let galleryUrls: string[] = [];

  try {
    const settingsRes = await databases.listDocuments(
      APPWRITE_DB_ID,
      COLLECTIONS.SETTINGS,
      [Query.equal("gymId", tenant.id)]
    );
    const settingsDoc = settingsRes.documents[0];
    galleryUrls = settingsDoc?.gallery_urls || tenant.gallery || [];
  } catch (error) {
    console.error("Failed to fetch settings for gallery", error);
    galleryUrls = tenant.gallery || [];
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
          <h1 className="text-4xl font-black text-white mb-3">Gym Gallery</h1>
          <p className="text-[#94A3B8] max-w-md mx-auto">Take a virtual tour of our modern equipment, training spaces, and facilities.</p>
        </div>

        {galleryUrls.length === 0 ? (
          <div className="text-center py-16 text-[#94A3B8]">
            <ImageIcon className="mx-auto mb-4 w-12 h-12 text-slate-700" />
            <p>No photos uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-6">
            {galleryUrls.map((url, i) => (
              <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/5 group">
                <img
                  src={url}
                  alt={`${tenant.name} facility ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
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
