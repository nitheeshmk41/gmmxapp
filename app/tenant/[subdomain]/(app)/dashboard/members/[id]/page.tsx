import { notFound } from "next/navigation";
import Link from "next/link";
import { getMemberById } from "@/features/members/actions";
import { formatDate, formatCurrency, getExpiryStatus, getInitials } from "@/lib/utils";
import {
  ChevronLeft,
  Edit2,
  Calendar,
  Phone,
  Mail,
  User,
  Activity,
  CreditCard,
  History,
  AlertCircle,
  CheckCircle2,
  XCircle,
  PauseCircle,
} from "lucide-react";

export default async function MemberProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const member = await getMemberById(id);

  if (!member) {
    notFound();
  }

  const membershipEnd = member.membershipEndDate ? new Date(member.membershipEndDate) : null;
  const expiryStatus = membershipEnd ? getExpiryStatus(membershipEnd) : null;

  const StatusIcon = {
    active: CheckCircle2,
    expired: XCircle,
  }[member.status as "active" | "expired"] || User;

  const statusColor = {
    active: "var(--color-success)",
    expired: "var(--color-danger)",
  }[member.status as "active" | "expired"] || "var(--color-muted-foreground)";

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/members"
          className="flex items-center gap-2 text-sm font-medium hover-text-primary transition-all"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          <ChevronLeft size={16} />
          Back to Members
        </Link>
        <Link
          href={`/dashboard/members/${member.id}/edit`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            color: "var(--color-foreground)",
          }}
        >
          <Edit2 size={14} />
          Edit Member
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div
            className="p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            {/* Status Banner */}
            <div
              className="absolute top-0 left-0 right-0 h-2"
              style={{ background: statusColor }}
            />

            <div
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4"
              style={{ background: "var(--color-brand-primary)" }}
            >
              {getInitials(member.name)}
            </div>

            <h1 className="text-xl font-bold" style={{ color: "var(--color-foreground)" }}>
              {member.name}
            </h1>
            <p className="text-xs font-semibold mt-1 tracking-wider" style={{ color: "var(--color-muted-foreground)" }}>
              Code: {member.memberCode}
            </p>
            
            <div className="flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium" style={{ background: `${statusColor}15`, color: statusColor }}>
              <StatusIcon size={14} />
              <span className="capitalize">{member.status}</span>
            </div>

            <div className="w-full mt-6 space-y-4 text-left">
              <div className="flex items-center gap-3 text-sm">
                <Phone size={16} style={{ color: "var(--color-muted-foreground)" }} />
                <a href={`tel:${member.phone}`} className="hover:underline" style={{ color: "var(--color-foreground)" }}>
                  {member.phone}
                </a>
              </div>
              {member.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail size={16} style={{ color: "var(--color-muted-foreground)" }} />
                  <a href={`mailto:${member.email}`} className="hover:underline truncate" style={{ color: "var(--color-foreground)" }}>
                    {member.email}
                  </a>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Calendar size={16} style={{ color: "var(--color-muted-foreground)" }} />
                <span style={{ color: "var(--color-foreground)" }}>
                  Joined {formatDate(member.join_date)}
                </span>
              </div>
            </div>
          </div>          {/* Notes Card */}
          {member.notes && (
            <div
              className="p-5 rounded-xl"
              style={{
                background: "var(--color-surface)",
                border: "1px solid var(--color-border)",
                boxShadow: "var(--shadow-card)",
              }}
            >
              <h3 className="text-xs font-semibold mb-2" style={{ color: "var(--color-foreground)" }}>
                Notes / Remarks
              </h3>
              <p className="text-xs whitespace-pre-wrap leading-relaxed animate-in" style={{ color: "var(--color-muted-foreground)" }}>
                {member.notes}
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Tabs/Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Plan & Expiry */}
          <div
            className="p-6 rounded-2xl"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--color-foreground)" }}>
                  <CreditCard size={20} style={{ color: "var(--color-brand-primary)" }} />
                  Current Plan
                </h2>
                <p className="text-sm mt-1" style={{ color: "var(--color-muted-foreground)" }}>
                  {member.plan ? member.plan.name : "No active plan assigned"}
                </p>
              </div>
              {member.plan && (
                <div className="text-right">
                  <p className="text-lg font-bold" style={{ color: "var(--color-foreground)" }}>
                    {formatCurrency(Number(member.plan.price))}
                  </p>
                  <p className="text-xs" style={{ color: "var(--color-muted-foreground)" }}>
                    per {member.plan.duration_days} days
                  </p>
                </div>
              )}
            </div>

            {membershipEnd ? (
              <div 
                className="p-4 rounded-xl flex items-center gap-4"
                style={{
                  background: expiryStatus === "expired" || expiryStatus === "critical"
                    ? "var(--color-danger-light)"
                    : expiryStatus === "warning" || expiryStatus === "upcoming"
                    ? "var(--color-warning-light)"
                    : "var(--color-success-light)",
                  border: `1px solid ${
                    expiryStatus === "expired" || expiryStatus === "critical"
                    ? "var(--color-danger)"
                    : expiryStatus === "warning" || expiryStatus === "upcoming"
                    ? "var(--color-warning)"
                    : "var(--color-success)"
                  }30`
                }}
              >
                <AlertCircle size={24} style={{
                    color: expiryStatus === "expired" || expiryStatus === "critical"
                    ? "var(--color-danger)"
                    : expiryStatus === "warning" || expiryStatus === "upcoming"
                    ? "var(--color-warning)"
                    : "var(--color-success)"
                }} />
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
                    Membership {expiryStatus === "expired" ? "Expired" : "Expires"}
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
                    {formatDate(membershipEnd)}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl text-center text-sm" style={{ background: "var(--color-surface-muted)", color: "var(--color-muted-foreground)" }}>
                No payment records found.
              </div>
            )}
          </div>

          {/* Payment History */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-border)",
              boxShadow: "var(--shadow-card)",
            }}
          >
            <div className="p-5" style={{ borderBottom: "1px solid var(--color-border)" }}>
              <h3 className="text-lg font-bold flex items-center gap-2" style={{ color: "var(--color-foreground)" }}>
                <History size={18} style={{ color: "var(--color-brand-primary)" }} />
                Payment History
              </h3>
            </div>
            
            {member.payments.length === 0 ? (
              <div className="p-8 text-center text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                No payments recorded yet.
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr style={{ background: "var(--color-border-muted)" }}>
                    <th className="px-5 py-3 text-left text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Date</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Amount</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Plan</th>
                    <th className="px-5 py-3 text-left text-xs font-semibold" style={{ color: "var(--color-muted-foreground)" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {member.payments.map((payment: any) => (
                    <tr key={payment.id} style={{ borderTop: "1px solid var(--color-border-muted)" }}>
                      <td className="px-5 py-4 text-sm" style={{ color: "var(--color-foreground)" }}>
                        {formatDate(payment.paid_at)}
                      </td>
                      <td className="px-5 py-4 text-sm font-medium" style={{ color: "var(--color-foreground)" }}>
                        {formatCurrency(Number(payment.amount))}
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: "var(--color-muted-foreground)" }}>
                        {payment.plan?.name || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 rounded-md text-xs font-medium" style={{ background: "var(--color-success-light)", color: "var(--color-success)" }}>
                          {payment.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
