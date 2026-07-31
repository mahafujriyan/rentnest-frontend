import Link from "next/link";
import { Home, Search } from "lucide-react";
import { PublicLayout } from "@/components/layout/public-layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PublicLayout>
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-8xl font-bold text-emerald-600">404</p>
        <h1 className="mt-4 text-2xl font-bold">Page Not Found</h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="mt-8 flex gap-4">
          <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
            <Link href="/"><Home className="mr-2 size-4" />Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/properties"><Search className="mr-2 size-4" />Browse Properties</Link>
          </Button>
        </div>
      </div>
    </PublicLayout>
  );
}
