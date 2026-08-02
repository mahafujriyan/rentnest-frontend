"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loginSchema, type LoginFormData } from "@/lib/validations";
import { getDashboardPath } from "@/lib/auth";
import { useAuthStore } from "@/store/auth.store";
import { APP_NAME } from "@/constants";
import type { Role } from "@/types";

function getPostLoginPath(role: Role, redirect: string | null): string {
  const dashboard = getDashboardPath(role);
  if (!redirect || !redirect.startsWith("/") || redirect.startsWith("//")) {
    return dashboard;
  }
  if (redirect.startsWith("/login") || redirect.startsWith("/register")) {
    return dashboard;
  }
  if (redirect.startsWith("/dashboard/")) {
    const allowed =
      role === "ADMIN" ||
      (role === "TENANT" && redirect.startsWith("/dashboard/tenant")) ||
      (role === "LANDLORD" && redirect.startsWith("/dashboard/landlord"));
    return allowed ? redirect : dashboard;
  }
  return redirect;
}

function LoginForm() {
  const login = useAuthStore((s) => s.login);
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const user = await login(data);
      const nextPath = getPostLoginPath(user.role, redirect);
      toast.success("Welcome back!");
      // Hard navigation so the proxy/middleware sees the fresh auth cookies
      window.location.href = nextPath;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    }
  };

  return (
    <Card className="border-0 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your {APP_NAME} account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-medium text-emerald-600 hover:underline">
            Create one
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-4 dark:from-emerald-950/20 dark:via-background dark:to-blue-950/20">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center gap-2">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-600">
            <Building2 className="size-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold">{APP_NAME}</h1>
        </div>
        <Suspense fallback={<div className="h-96 animate-pulse rounded-2xl bg-muted" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
