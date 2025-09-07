import { cn } from "@/components/lib/utils";

// KPI card for dashboard metrics
export default function KpiCard({ icon, label, value, hint, className, dataTour }) {
  
  return (
    <div data-tour={dataTour} className={cn("bg-white border border-gray-300 rounded-lg p-4 shadow-sm", className)}>
      <div className="flex items-start gap-3">
        <div className="shrink-0 w-9 h-9 rounded-md bg-white border border-gray-300 flex items-center justify-start pl-2">
          {icon}
        </div>
        <div className="min-w-0">
          <div className="text-sm text-gray-500 truncate">{label}</div>
          <div className="text-xl font-semibold text-gray-900 leading-tight truncate">{value ?? "—"}</div>
          {hint ? <div className="text-xs text-gray-400 truncate mt-0.5">{hint}</div> : null}
        </div>
      </div>
    </div>
  );
}
