"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
  accent?: "emerald" | "sky" | "amber" | "violet";
}

const accentStyles = {
  emerald: "from-emerald-500/15 to-emerald-500/5 text-emerald-600 dark:text-emerald-400",
  sky: "from-sky-500/15 to-sky-500/5 text-sky-600 dark:text-sky-400",
  amber: "from-amber-500/15 to-amber-500/5 text-amber-600 dark:text-amber-400",
  violet: "from-violet-500/15 to-violet-500/5 text-violet-600 dark:text-violet-400",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  accent = "emerald",
}: StatCardProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-5 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-emerald-500/5",
        className
      )}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-gradient-to-br opacity-80 blur-2xl transition-opacity group-hover:opacity-100",
          accentStyles[accent]
        )}
      />
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          {(description || trend) && (
            <p className="mt-2 text-xs text-muted-foreground">
              {trend && <span className="font-medium text-emerald-600 dark:text-emerald-400">{trend} </span>}
              {description}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex size-11 items-center justify-center rounded-xl bg-gradient-to-br",
            accentStyles[accent]
          )}
        >
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}
