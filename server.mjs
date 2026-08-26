/* Minimal production-like static server: CSP and safe MIME types, no dependencies. */
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, isAbsolute, join, normalize, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const host = process.env.HOST || "0.0.0.0";
const port = Number(process.env.PORT || process.argv[process.argv.indexOf("--port") + 1] || 8080);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".pdf": "application/pdf"
};
const headers = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; media-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self' https://*.e2b.app; form-action 'self'",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "microphone=(self)",
  "Cross-Origin-Resource-Policy": "same-origin"
};

createServer((req, res) => {
  if (!["GET", "HEAD"].includes(req.method || "GET")) {
    res.writeHead(405, { ...headers, Allow: "GET, HEAD" });
    res.end();
    return;
  }
  const pathname = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`).pathname;
  const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
  const path = normalize(join(root, requested));
  const pathFromRoot = relative(root, path);
  if (
    pathFromRoot.startsWith("..") ||
    isAbsolute(pathFromRoot) ||
    !existsSync(path) ||
    !statSync(path).isFile()
  ) {
    res.writeHead(404, { ...headers, "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  const extension = extname(path);
  const cacheControl = extension === ".html" || path.endsWith("sw.js") ? "no-cache" : "public, max-age=86400";
  res.writeHead(200, {
    ...headers,
    "Content-Type": types[extension] || "application/octet-stream",
    "Cache-Control": cacheControl
  });
  if (req.method === "HEAD") return res.end();
  createReadStream(path).pipe(res);
}).listen(port, host, () => console.log(`Boussole available at http://${host}:${port}`));
