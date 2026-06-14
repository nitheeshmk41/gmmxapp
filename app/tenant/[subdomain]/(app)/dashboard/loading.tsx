export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-200 rounded-md" />
          <div className="h-4 w-72 bg-slate-200 rounded-md" />
        </div>
        <div className="h-10 w-28 bg-slate-200 rounded-md" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-200" />
            <div className="h-4 w-20 bg-slate-200 rounded-md" />
            <div className="h-6 w-12 bg-slate-200 rounded-md" />
          </div>
        ))}
      </div>

      {/* Table Skeleton */}
      <div className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm space-y-4">
        <div className="h-5 w-36 bg-slate-200 rounded-md" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
}
