/** @typedef {{ at: string, scope: string, error: { name: string, message: string, stack: string }, context: Record<string, unknown> }} DiagnosticEntry */

/** @type {DiagnosticEntry[]} */
const entries = [];
const MAX_ENTRIES = 50;

/** @param {unknown} error */
function normalizeError(error) {
  if (error instanceof Error) return { name: error.name, message: error.message, stack: error.stack || "" };
  return { name: "Error", message: String(error ?? "Unknown error"), stack: "" };
}

/**
 * Records recoverable failures without interrupting the student flow.
 * @param {string} scope
 * @param {unknown} error
 * @param {Record<string, unknown>} [context]
 */
export function reportDiagnostic(scope, error, context = {}) {
  const detail = {
    at: new Date().toISOString(),
    scope,
    error: normalizeError(error),
    context
  };
  entries.push(detail);
  if (entries.length > MAX_ENTRIES) entries.shift();
  console.warn(`[boussole4d:${scope}] ${detail.error.message}`, context);
  if (typeof window !== "undefined" && typeof window.CustomEvent === "function") {
    try {
      window.dispatchEvent(new window.CustomEvent("boussole4d:diagnostic", { detail }));
    } catch (eventError) {
      console.warn("[boussole4d:diagnostic-event] Unable to dispatch diagnostic event", eventError);
    }
  }
  return detail;
}

export function getDiagnostics() {
  return entries.map((entry) => ({ ...entry, context: { ...entry.context }, error: { ...entry.error } }));
}

export function clearDiagnostics() {
  entries.length = 0;
}
