"use client";

import { toast } from "sonner";
import { StatusBadge } from "@/components/shared/status-badge";
import { TableSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useAdminUsers, useUpdateUserStatus } from "@/hooks/use-admin";
import { formatDate } from "@/lib/format";

export default function AdminUsersPage() {
  const { data: users, isLoading, error, refetch } = useAdminUsers();
  const updateStatus = useUpdateUserStatus();

  const handleBan = async (id: string, status: "ACTIVE" | "BANNED") => {
    try {
      await updateStatus.mutateAsync({ id, data: { status } });
      toast.success(`User ${status === "BANNED" ? "banned" : "unbanned"}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  if (isLoading) return <TableSkeleton />;
  if (error) return <ErrorState message={error.message} onRetry={() => refetch()} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="mt-1 text-muted-foreground">Manage platform users</p>
      </div>

      <div className="rounded-2xl border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(users || []).map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell className="capitalize">{user.role.toLowerCase()}</TableCell>
                <TableCell><StatusBadge status={user.status || "ACTIVE"} /></TableCell>
                <TableCell>{user.createdAt ? formatDate(user.createdAt) : "—"}</TableCell>
                <TableCell className="text-right">
                  {user.status === "BANNED" ? (
                    <Button size="sm" variant="outline" onClick={() => handleBan(user.id, "ACTIVE")}>
                      Unban
                    </Button>
                  ) : (
                    <Button size="sm" variant="destructive" onClick={() => handleBan(user.id, "BANNED")}>
                      Ban
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
