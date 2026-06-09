import type { Metadata } from "next";
import Header from "./Header";
import Footer from "./Footer";

export const metadata: Metadata = {
  title: "gmmx – Gym Management Platform",
  description: "The all-in-one gym management platform. Track members, collect payments, and get a professional gym website in minutes.",
};

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Header />
      <main className="flex-grow flex flex-col">
        {children}
      </main>
      <Footer />
    </div>
  );
}
