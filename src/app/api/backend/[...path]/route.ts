import { proxyToBackend } from "@/lib/backend-proxy";

type RouteContext = {
  params: Promise<{ path?: string[] }> | { path?: string[] };
};

export async function GET(request: Request, context: RouteContext) {
  return proxyToBackend(request, (await context.params).path || []);
}

export async function POST(request: Request, context: RouteContext) {
  return proxyToBackend(request, (await context.params).path || []);
}

export async function PUT(request: Request, context: RouteContext) {
  return proxyToBackend(request, (await context.params).path || []);
}

export async function PATCH(request: Request, context: RouteContext) {
  return proxyToBackend(request, (await context.params).path || []);
}

export async function DELETE(request: Request, context: RouteContext) {
  return proxyToBackend(request, (await context.params).path || []);
}

