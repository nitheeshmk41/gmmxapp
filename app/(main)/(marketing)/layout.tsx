import type { Metadata } from "next";
import Header from "./Header";
import Footer from "./Footer";
import { GmmxAssistant } from "@/components/marketing/GmmxAssistant";

export const metadata: Metadata = {
  title: "gmmx – Gym Management Platform",
  description: "The all-in-one gym management platform. Track members, collect payments, and get a professional website in minutes.",
};

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col selection:bg-rose-500/30 selection:text-rose-900">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <GmmxAssistant />
    </div>
  );
}
