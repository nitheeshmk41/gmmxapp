"use client";

import { useState, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { CalendarCheck, Check, Search, UserCheck } from "lucide-react";
import { markAttendance, bulkMarkAttendance } from "@/features/attendance/actions";
import { getInitials } from "@/lib/utils";
import { format } from "date-fns";

type Member = { id: string; name: string; phone: string; photo_url: string | null };
type AttendanceRecord = { id: string; member_id: string; member: { name: string } };

interface Props {
  members: Member[];
  attendance: AttendanceRecord[];
  date: string;
}

export function AttendanceClientPage({ members, attendance, date }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const markedIds = new Set(attendance.map((a) => a.member_id));

  const filtered = members.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search)
  );

  function updateDate(newDate: string) {
    router.push(`${pathname}?date=${newDate}`);
  }

  async function handleMark(memberId: string) {
    startTransition(async () => {
      await markAttendance(memberId, date);
      router.refresh();
    });
  }

  async function handleBulkMark() {
    if (selected.size === 0) return;
    startTransition(async () => {
      await bulkMarkAttendance(Array.from(selected), date);
      setSelected(new Set());
      router.refresh();
    });
  }

  function toggleSelect(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function selectAll() {
    const unmarked = filtered.filter((m) => !markedIds.has(m.id)).map((m) => m.id);
    setSelected(new Set(unmarked));
  }

  return (
    <div className="space-y-5 animate-in">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => updateDate(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="px-3 py-2 rounded-lg text-sm"
            style={{ border: "1px solid var(--color-border)", background: "var(--color-surface)", color: "var(--color-foreground)", outline: "none" }}
          />
          <span className="text-sm font-medium" style={{ color: "var(--color-muted-foreground)" }}>
            {format(new Date(date), "EEEE, dd MMMM yyyy")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="badge-success">{attendance.length} marked</span>
          <span className="badge-muted">{members.length - attendance.length} remaining</span>
        </div>
      </div>

      {/* Search + Bulk mark */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--color-muted-foreground)" }} />
          <input
            placeholder="Search members…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-foreground)", outline: "none" }}
          />
        </div>
        <button
          onClick={selectAll}
          className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)", color: "var(--color-foreground)" }}
        >
          Select All Unmarked
        </button>
        {selected.size > 0 && (
          <button
            onClick={handleBulkMark}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white"
            style={{ background: "var(--color-brand-primary)", boxShadow: "var(--shadow-brand)" }}
          >
            <UserCheck size={14} />
            Mark {selected.size} Present
          </button>
        )}
      </div>

      {/* Members grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filtered.map((member) => {
          const isMarked = markedIds.has(member.id);
          const isSelected = selected.has(member.id);

          return (
            <button
              key={member.id}
              onClick={() => isMarked ? null : (isSelected ? toggleSelect(member.id) : handleMark(member.id))}
              disabled={isMarked}
              className="p-4 rounded-xl text-left transition-all hover-lift"
              style={{
                background: isMarked ? "var(--color-success-light)"
                  : isSelected ? "var(--color-brand-light)"
                  : "var(--color-surface)",
                border: `2px solid ${isMarked ? "var(--color-success)" : isSelected ? "var(--color-brand-primary)" : "var(--color-border)"}`,
                cursor: isMarked ? "not-allowed" : "pointer",
              }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ background: isMarked ? "var(--color-success)" : "var(--color-brand-primary)" }}
                >
                  {isMarked ? <Check size={16} /> : getInitials(member.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--color-foreground)" }}>{member.name}</p>
                  <p className="text-xs truncate" style={{ color: "var(--color-muted-foreground)" }}>{member.phone}</p>
                </div>
              </div>
              <span
                className="text-xs font-medium"
                style={{ color: isMarked ? "var(--color-success)" : isSelected ? "var(--color-brand-primary)" : "var(--color-muted-foreground)" }}
              >
                {isMarked ? "✓ Present" : isSelected ? "Selected" : "Tap to mark"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Today's attendance list */}
      {attendance.length > 0 && (
        <div className="rounded-xl p-5" style={{ background: "var(--color-surface)", border: "1px solid var(--color-border)" }}>
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "var(--color-foreground)" }}>
            <CalendarCheck size={16} style={{ color: "var(--color-success)" }} />
            Present Today ({attendance.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {attendance.map((a) => (
              <span key={a.id} className="badge-success">{a.member.name}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
