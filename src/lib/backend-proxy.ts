const BACKEND_BASE_URL =
  process.env.RENTNEST_API_URL || "https://rentnest-dev.vercel.app/api";

function buildBackendUrl(pathSegments: string[], search: string) {
  const backendUrl = new URL(BACKEND_BASE_URL);
  const basePath = backendUrl.pathname.replace(/\/$/, "");
  const nextPath = pathSegments.join("/");

  backendUrl.pathname = nextPath ? `${basePath}/${nextPath}` : basePath;
  backendUrl.search = search;

  return backendUrl;
}

function copySafeHeaders(source: Headers) {
  const headers = new Headers();
  const contentType = source.get("content-type");
  const authorization = source.get("authorization");
  const accept = source.get("accept");

  if (contentType) headers.set("content-type", contentType);
  if (authorization) headers.set("authorization", authorization);
  if (accept) headers.set("accept", accept);

  return headers;
}

function copyResponseHeaders(source: Headers) {
  const headers = new Headers();
  const contentType = source.get("content-type");

  if (contentType) headers.set("content-type", contentType);

  return headers;
}

export async function proxyToBackend(
  request: Request,
  pathSegments: string[]
): Promise<Response> {
  const backendUrl = buildBackendUrl(pathSegments, new URL(request.url).search);
  const method = request.method.toUpperCase();
  const headers = copySafeHeaders(request.headers);

  const init: RequestInit = {
    method,
    headers,
  };

  if (method !== "GET" && method !== "HEAD") {
    init.body = await request.text();
  }

  const response = await fetch(backendUrl, init);

  return new Response(response.body, {
    status: response.status,
    headers: copyResponseHeaders(response.headers),
  });
}
