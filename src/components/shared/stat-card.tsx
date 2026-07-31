"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatCardProps) {
  return (
    <Card className={cn("border-0 shadow-md", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
          <Icon className="size-5 text-emerald-600 dark:text-emerald-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="mt-1 text-xs text-muted-foreground">
            {trend && <span className="text-emerald-600">{trend} </span>}
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
