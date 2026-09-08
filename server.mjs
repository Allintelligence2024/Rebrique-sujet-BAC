/* Production-like static server: explicit public surface, CSP and safe MIME types. */
import { createReadStream, existsSync, readFileSync, realpathSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, isAbsolute, join, normalize, relative, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const host = process.env.HOST || "0.0.0.0";
const argIdx = process.argv.indexOf("--port");
const port = Number(process.env.PORT || (argIdx >= 0 ? process.argv[argIdx + 1] : undefined) || 8080);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json",
  ".png": "image/png",
  ".pdf": "application/pdf"
};

export const securityHeaders = {
  "Content-Security-Policy":
    "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; media-src 'self'; connect-src 'self'; frame-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'self' https://*.e2b.app; form-action 'self'",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "microphone=(self)",
  "Cross-Origin-Resource-Policy": "same-origin"
};

const PUBLIC_FILES = new Set([
  "index.html",
  "manifest.webmanifest",
  "release.json",
  "sw.js",
  "BAC2025_SVT_Sujet1.pdf",
  "BAC2025_SVT_Sujet2.pdf"
]);
const PUBLIC_DIRECTORIES = ["assets/", "js/", "data/"];

/** Public URL allowlist. Build files, tests, docs, patches and dotfiles are never deployable assets. */
export function isPublicRoute(requested) {
  if (typeof requested !== "string" || !requested || requested.includes("\\")) return false;
  if (requested.split("/").some((part) => !part || part === "." || part === ".." || part.startsWith("."))) {
    return false;
  }
  return (
    PUBLIC_FILES.has(requested) || PUBLIC_DIRECTORIES.some((directory) => requested.startsWith(directory))
  );
}

function notFound(res) {
  res.writeHead(404, { ...securityHeaders, "Content-Type": "text/plain; charset=utf-8" });
  res.end("Not found");
}

export function createStaticServer({ rootDirectory = root } = {}) {
  const canonicalRoot = realpathSync(rootDirectory);
  let buildId = "dev";
  try {
    const version = readFileSync(join(canonicalRoot, "js/app-version.js"), "utf8");
    buildId = version.match(/APP_BUILD_ID\s*=\s*"([a-f0-9]{12})"/)?.[1] || buildId;
  } catch {
    /* A missing version file is handled as a normal 404 by the route below. */
  }
  return createServer((req, res) => {
    if (!["GET", "HEAD"].includes(req.method || "GET")) {
      res.writeHead(405, { ...securityHeaders, Allow: "GET, HEAD" });
      res.end();
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(
        new URL(req.url || "/", `http://${req.headers.host || "localhost"}`).pathname
      );
    } catch {
      notFound(res);
      return;
    }
    const requested = pathname === "/" ? "index.html" : pathname.replace(/^\/+/, "");
    if (!isPublicRoute(requested)) {
      notFound(res);
      return;
    }

    const path = normalize(join(canonicalRoot, requested));
    const pathFromRoot = relative(canonicalRoot, path);
    if (
      pathFromRoot.startsWith("..") ||
      isAbsolute(pathFromRoot) ||
      !existsSync(path) ||
      !statSync(path).isFile()
    ) {
      notFound(res);
      return;
    }

    // A checked-in symlink inside an allowed directory must not escape the public root.
    const canonicalPath = realpathSync(path);
    const canonicalRelative = relative(canonicalRoot, canonicalPath);
    if (canonicalRelative.startsWith("..") || isAbsolute(canonicalRelative)) {
      notFound(res);
      return;
    }

    const extension = extname(canonicalPath);
    const stableEntryPoint =
      extension === ".html" ||
      extension === ".webmanifest" ||
      canonicalPath.endsWith("sw.js") ||
      canonicalPath.endsWith("app-version.js") ||
      canonicalPath.endsWith("release.json");
    const cacheControl = stableEntryPoint
      ? "no-cache"
      : extension === ".pdf"
        ? "public, max-age=0, must-revalidate"
        : "public, max-age=86400";
    res.writeHead(200, {
      ...securityHeaders,
      "Content-Type": types[extension] || "application/octet-stream",
      "Content-Length": statSync(canonicalPath).size,
      "Cache-Control": cacheControl,
      "X-Miftah-Build": buildId
    });
    if (req.method === "HEAD") return res.end();
    createReadStream(canonicalPath).pipe(res);
  });
}

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const rootDirectory = process.env.PUBLIC_ROOT ? resolve(root, process.env.PUBLIC_ROOT) : root;
  createStaticServer({ rootDirectory }).listen(port, host, () =>
    console.log(`Miftah Kanz ${rootDirectory} available at http://${host}:${port}`)
  );
}
