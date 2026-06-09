"use client";

import { useState, useTransition } from "react";
import { addDomain, removeDomain } from "@/features/domains/actions";
import { Globe, CheckCircle2, Clock, X, Loader2, Copy, AlertTriangle, Lock } from "lucide-react";

type Domain = {
  id: string;
  custom_domain: string;
  verification_status: string;
  dns_type: string;
  verified_at: Date | null;
  created_at: Date;
};

type Gym = { plan: string; subdomain: string };

interface Props {
  domains: Domain[];
  gym: Gym | null;
}

const SERVER_IP = process.env.NEXT_PUBLIC_SERVER_IP || "YOUR_SERVER_IP";

export function DomainClientPage({ domains, gym }: Props) {
  const [, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const isPro = gym?.plan === "professional" || gym?.plan === "enterprise";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await addDomain(formData);
      if (result?.error) setError(result.error);
      else (e.target as HTMLFormElement).reset();
      setLoading(false);
    });
  }

  async function handleRemove(id: string) {
    if (!confirm("Remove this domain?")) return;
    startTransition(async () => { await removeDomain(id); });
  }

  function copyToClipboard(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(""), 2000);
  }

  const inputStyle = {
    border: "1.5px solid var(--color-border)",
    background: "var(--color-surface)",
    color: "var(--color-foreground)",
    outline: "none",
  };

  return (
    <div className="max-w-2xl space-y-6 animate-in">
      {/* Plan gate */}
      {!isPro && (
        <div className="p-5 rounded-xl flex items-start gap-4" style={{ background: "var(--color-warning-light)", border: "1px solid #fcd34d" }}>
          <Lock size={20} style={{ color: "var(--color-warning)", flexShrink: 0, marginTop: 2 }} />
          <div>
            <p className="text-sm font-semibold" style={{ color: "#92400e" }}>Professional Plan Required</p>
            <p className="text-xs mt-1" style={{ color: "#b45309" }}>
              Custom domains are available on the Professional and Enterprise plans. Upgrade to connect your own domain like ironfit.com.
            </p>
          </div>
        </div>
      )}

      {/* Add domain form */}
      <div className="p-5 rounded-xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        <h3 className="text-sm font-bold mb-1" style={{ color: "var(--color-foreground)" }}>Add Custom Domain</h3>
        <p className="text-xs mb-4" style={{ color: "var(--color-muted-foreground)" }}>
          Connect your own domain (e.g. ironfit.com) to your gym website.
        </p>
        {error && <div className="mb-3 p-3 rounded-lg text-sm" style={{ background: "var(--color-danger-light)", color: "#dc2626" }}>{error}</div>}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            name="custom_domain"
            placeholder="ironfit.com"
            disabled={!isPro}
            required
            className="flex-1 px-3 py-2.5 rounded-lg text-sm"
            style={{ ...inputStyle, opacity: isPro ? 1 : 0.5, cursor: !isPro ? "not-allowed" : "text" }}
            onFocus={(e) => { e.target.style.borderColor = "var(--color-brand-primary)"; }}
            onBlur={(e) => { e.target.style.borderColor = "var(--color-border)"; }}
          />
          <button
            type="submit"
            disabled={!isPro || loading}
            className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white flex items-center gap-2"
            style={{ background: isPro ? "var(--color-brand-primary)" : "var(--color-border)", cursor: !isPro ? "not-allowed" : "pointer" }}
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            Add Domain
          </button>
        </form>
      </div>

      {/* DNS Instructions */}
      {domains.length > 0 && (
        <div className="p-5 rounded-xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <h3 className="text-sm font-bold mb-1" style={{ color: "var(--color-foreground)" }}>DNS Configuration</h3>
          <p className="text-xs mb-4" style={{ color: "var(--color-muted-foreground)" }}>
            Add these DNS records at your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.)
          </p>
          <div className="space-y-3">
            {[
              { type: "A", name: "@", value: SERVER_IP, desc: "Root domain" },
              { type: "CNAME", name: "www", value: "gmmx.app", desc: "www subdomain" },
            ].map((record) => (
              <div
                key={record.type}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: "var(--color-background)", border: "1px solid var(--color-border)" }}
              >
                <span className="badge-info w-14 text-center">{record.type}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>{record.desc}</p>
                  <p className="text-sm font-mono font-medium truncate" style={{ color: "var(--color-foreground)" }}>
                    {record.name} → {record.value}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(record.value, record.type)}
                  className="p-1.5 rounded transition-all"
                  style={{ color: copied === record.type ? "var(--color-success)" : "var(--color-muted-foreground)" }}
                >
                  {copied === record.type ? <CheckCircle2 size={14} /> : <Copy size={14} />}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-3 p-3 rounded-lg flex items-start gap-2" style={{ background: "var(--color-warning-light)", border: "1px solid #fcd34d" }}>
            <AlertTriangle size={14} style={{ color: "var(--color-warning)", marginTop: 1, flexShrink: 0 }} />
            <p className="text-xs" style={{ color: "#92400e" }}>
              DNS changes can take 24–48 hours to propagate. After adding records, contact support to verify your domain.
            </p>
          </div>
        </div>
      )}

      {/* Domains list */}
      {domains.length > 0 && (
        <div className="p-5 rounded-xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: "var(--color-foreground)" }}>Your Domains</h3>
          <div className="space-y-3">
            {domains.map((domain) => (
              <div
                key={domain.id}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ background: "var(--color-background)", border: "1px solid var(--color-border)" }}
              >
                <div className="flex items-center gap-3">
                  <Globe size={18} style={{ color: "var(--color-muted-foreground)" }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>{domain.custom_domain}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {domain.verification_status === "verified" ? (
                        <><CheckCircle2 size={12} style={{ color: "var(--color-success)" }} /><span className="text-xs" style={{ color: "var(--color-success)" }}>Verified</span></>
                      ) : domain.verification_status === "failed" ? (
                        <><X size={12} style={{ color: "var(--color-danger)" }} /><span className="text-xs" style={{ color: "var(--color-danger)" }}>Verification failed</span></>
                      ) : (
                        <><Clock size={12} style={{ color: "var(--color-warning)" }} /><span className="text-xs" style={{ color: "var(--color-warning)" }}>Pending verification</span></>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(domain.id)}
                  className="p-1.5 rounded-lg transition-all"
                  style={{ color: "var(--color-danger)" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--color-danger-light)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
