"use client";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  monthlyRevenue: { month: string; revenue: number }[];
  newMembers: { month: string; count: number }[];
  attendanceTrend: { date: string; count: number }[];
}

export function DashboardCharts({ monthlyRevenue, newMembers, attendanceTrend }: Props) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Monthly Revenue */}
      <div
        className="lg:col-span-2 p-5 rounded-xl"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
              Monthly Revenue
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
              Last 6 months
            </p>
          </div>
          <span className="badge-brand">₹ INR</span>
        </div>
        {monthlyRevenue.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlyRevenue} barSize={28}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
                tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              />
              <Tooltip
                formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  boxShadow: "var(--shadow-md)",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="revenue" fill="#FF5C73" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-sm text-slate-400">
            No data available yet
          </div>
        )}
      </div>

      {/* New Members */}
      <div
        className="p-5 rounded-xl"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="mb-5">
          <h3 className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
            New Members
          </h3>
          <p className="text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
            Monthly joins
          </p>
        </div>
        {newMembers.length > 0 ? (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={newMembers}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  boxShadow: "var(--shadow-md)",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#22C55E"
                strokeWidth={2.5}
                dot={{ fill: "#22C55E", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-sm text-slate-400">
            No data available yet
          </div>
        )}
      </div>

      {/* Attendance Trend (last 7 days) */}
      <div
        className="lg:col-span-3 p-5 rounded-xl"
        style={{
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          boxShadow: "var(--shadow-card)",
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-sm font-semibold" style={{ color: "var(--color-foreground)" }}>
              Attendance Trend
            </h3>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-muted-foreground)" }}>
              Last 7 days
            </p>
          </div>
        </div>
        {attendanceTrend.length > 0 ? (
          <ResponsiveContainer width="100%" height={150}>
            <LineChart data={attendanceTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: "8px",
                  boxShadow: "var(--shadow-md)",
                  fontSize: "12px",
                }}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                strokeWidth={2.5}
                dot={{ fill: "#3B82F6", r: 4 }}
                activeDot={{ r: 6 }}
                name="Attendance"
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-[150px] text-sm text-slate-400">
            No data available yet
          </div>
        )}
      </div>
    </div>
  );
}
