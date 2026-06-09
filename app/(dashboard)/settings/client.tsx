"use client";

import { useState, useTransition } from "react";
import { Building2, User, CreditCard, Bell, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";

type Gym = {
  id: string;
  name: string;
  owner_name: string;
  phone: string;
  email: string;
  address: string | null;
  city: string | null;
  state: string | null;
  subdomain: string;
  plan: string;
  subscription_status: string;
  trial_ends_at: Date | null;
};

type User = { id: string; email: string; role: string };
type Subscription = { plan: string; status: string; current_period_end: Date | null } | null;

interface Props { gym: Gym | null; user: User | null; subscription: Subscription; }

const TABS = [
  { id: "gym", label: "Gym Profile", icon: Building2 },
  { id: "subscription", label: "Subscription", icon: CreditCard },
  { id: "account", label: "Account", icon: User },
];

const PLAN_LABELS: Record<string, string> = {
  starter: "Starter – ₹499/mo",
  professional: "Professional – ₹999/mo",
  enterprise: "Enterprise – Custom",
};

const STATUS_BADGES: Record<string, string> = {
  trial: "badge-warning",
  active: "badge-success",
  suspended: "badge-danger",
  cancelled: "badge-muted",
  expired: "badge-danger",
};

export function SettingsClientPage({ gym, user, subscription }: Props) {
  const [activeTab, setActiveTab] = useState("gym");

  const inputStyle = {
    border: "1.5px solid var(--color-border)",
    background: "var(--color-surface)",
    color: "var(--color-foreground)",
    outline: "none",
  };

  return (
    <div className="max-w-2xl space-y-5 animate-in">
      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all"
              style={{
                background: activeTab === tab.id ? "var(--color-brand-primary)" : "transparent",
                color: activeTab === tab.id ? "white" : "var(--color-muted-foreground)",
              }}
            >
              <Icon size={15} />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Gym Profile Tab */}
      {activeTab === "gym" && gym && (
        <div className="p-5 rounded-xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: "var(--color-foreground)" }}>Gym Information</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Gym Name", value: gym.name },
              { label: "Owner Name", value: gym.owner_name },
              { label: "Phone", value: gym.phone },
              { label: "Email", value: gym.email },
              { label: "City", value: gym.city || "" },
              { label: "State", value: gym.state || "" },
              { label: "Subdomain", value: `${gym.subdomain}.gmmx.app` },
              { label: "Plan", value: gym.plan.charAt(0).toUpperCase() + gym.plan.slice(1) },
            ].map((field) => (
              <div key={field.label} className="space-y-1">
                <label className="text-xs font-medium" style={{ color: "var(--color-muted-foreground)" }}>{field.label}</label>
                <p className="text-sm font-medium" style={{ color: "var(--color-foreground)" }}>{field.value || "—"}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg" style={{ background: "var(--color-border-muted)" }}>
            <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
              To update gym information, please contact GMMX support. Some fields like subdomain cannot be changed after setup.
            </p>
          </div>
        </div>
      )}

      {/* Subscription Tab */}
      {activeTab === "subscription" && (
        <div className="p-5 rounded-xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: "var(--color-foreground)" }}>Subscription Details</h3>
          {gym && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl" style={{ background: "var(--color-background)", border: "1px solid var(--color-border)" }}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-base font-bold" style={{ color: "var(--color-foreground)" }}>
                      {PLAN_LABELS[gym.plan] || gym.plan}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>Current plan</p>
                  </div>
                  <span className={STATUS_BADGES[gym.subscription_status] || "badge-muted"}>
                    {gym.subscription_status.charAt(0).toUpperCase() + gym.subscription_status.slice(1)}
                  </span>
                </div>
                {gym.subscription_status === "trial" && gym.trial_ends_at && (
                  <p className="text-xs" style={{ color: "var(--color-warning)" }}>
                    ⏰ Trial expires: {formatDate(gym.trial_ends_at)}
                  </p>
                )}
                {subscription?.current_period_end && (
                  <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                    Next billing: {formatDate(subscription.current_period_end)}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {["Starter – ₹499", "Professional – ₹999", "Enterprise"].map((plan) => (
                  <div key={plan} className="p-3 rounded-xl text-center" style={{ border: "1px solid var(--color-border)", background: "var(--color-background)" }}>
                    <p className="text-xs font-medium" style={{ color: "var(--color-foreground)" }}>{plan}</p>
                  </div>
                ))}
              </div>
              <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                To upgrade or cancel your plan, please contact GMMX support at support@gmmx.app
              </p>
            </div>
          )}
        </div>
      )}

      {/* Account Tab */}
      {activeTab === "account" && user && (
        <div className="p-5 rounded-xl" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <h3 className="text-sm font-bold mb-4" style={{ color: "var(--color-foreground)" }}>Account Details</h3>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--color-muted-foreground)" }}>Email Address</label>
              <p className="text-sm font-medium mt-1" style={{ color: "var(--color-foreground)" }}>{user.email}</p>
            </div>
            <div>
              <label className="text-xs font-medium" style={{ color: "var(--color-muted-foreground)" }}>Role</label>
              <p className="text-sm font-medium mt-1" style={{ color: "var(--color-foreground)" }}>
                {user.role.split("_").map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
              </p>
            </div>
            <div className="pt-3" style={{ borderTop: "1px solid var(--color-border-muted)" }}>
              <p className="text-xs font-medium mb-2" style={{ color: "var(--color-foreground)" }}>Password</p>
              <p className="text-xs mb-3" style={{ color: "var(--color-muted-foreground)" }}>
                To change your password, use the forgot password flow from the login page.
              </p>
              <a
                href="/forgot-password"
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium"
                style={{ background: "var(--color-border)", color: "var(--color-foreground)" }}
              >
                Change Password
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
