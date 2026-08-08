import { redirect } from "next/navigation";
import { getCurrentUser, getCurrentGym } from "@/features/auth/actions";
import Link from "next/link";
import { signOut } from "@/features/auth/actions";

export default async function TrainerLayout({ children }: { children: React.ReactNode }) {
  const [user, gym] = await Promise.all([getCurrentUser(), getCurrentGym()]);

  if (!user || (user.role || "").toUpperCase() !== "TRAINER") {
    redirect(gym?.subdomain ? `/${gym.subdomain}/trainer/login` : "/signin");
  }

  const base = gym?.subdomain ? `/${gym.subdomain}/trainer` : "/trainer";

  return (
    <div className="min-h-screen flex flex-col justify-between" style={{ background: "#F8FAFC", fontFamily: "'Inter', sans-serif" }}>
      <div>
        <header className="bg-white border-b border-slate-100 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-extrabold text-slate-900 text-base">{gym?.name || "Trainer Portal"}</span>
              <span className="badge-success text-xs font-semibold">Trainer</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href={`${base}/dashboard`} className="text-xs font-semibold text-slate-500 hover:text-[#FF5C73] transition-colors">Dashboard</Link>
              <Link href={`${base}/members`} className="text-xs font-semibold text-slate-500 hover:text-[#FF5C73] transition-colors">My Members</Link>
              <Link href={`${base}/profile`} className="text-xs font-semibold text-slate-500 hover:text-[#FF5C73] transition-colors">Profile</Link>
              <form action={signOut}>
                <button type="submit" className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors">Sign out</button>
              </form>
            </div>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
      </div>
      <footer className="py-8 text-center border-t border-slate-100 bg-white">
        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} {gym?.name || "Gym"}. Powered by <a href="https://gmmx.app" className="text-[#FF5C73] font-semibold">GMMX</a>
        </p>
      </footer>
    </div>
  );
}
