import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  trendUp?: boolean;
  className?: string;
}

const StatsCard = ({ title, value, icon, trend, trendUp, className }: StatsCardProps) => (
  <div className={cn("glass rounded-xl p-5 space-y-3", className)}>
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{title}</span>
      <div className="p-2 rounded-lg bg-primary/10 text-primary">{icon}</div>
    </div>
    <div className="space-y-1">
      <p className="text-2xl font-display font-bold text-foreground">{value}</p>
      {trend && (
        <p className={cn("text-xs font-medium", trendUp ? "text-emerald-400" : "text-red-400")}>
          {trendUp ? "↑" : "↓"} {trend}
        </p>
      )}
    </div>
  </div>
);

export default StatsCard;
