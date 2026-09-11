import { reportDiagnostic } from "./diagnostics.js";

/* Browser speech recognition adapter. The UI supplies its notification channel. */
/**
 * @param {(message: string, type?: string) => void} notify
 * @returns {{ listening: boolean, target: any, recognition: any, start(input: HTMLInputElement | HTMLTextAreaElement): boolean, stop(abort?: boolean): void }}
 */
export function createSpeechEngine(notify = () => {}) {
  return {
    listening: false,
    /** @type {HTMLInputElement | HTMLTextAreaElement | null} */
    target: null,
    /** @type {any} */
    recognition: null,

    start(input) {
      const browserWindow = /** @type {any} */ (window);
      const SR = browserWindow.SpeechRecognition || browserWindow.webkitSpeechRecognition;
      if (!SR || !input) {
        notify("الإملاء الصوتي غير متاح في هذا المتصفح.", "warn");
        return false;
      }
      this.stop();
      const recognition = new SR();
      // "ar-DZ" is not a recognized Web Speech locale and Chromium silently
      // falls back to the browser default (often en-US). Prefer ar-SA
      // (Modern Standard Arabic, widely supported) with ar-EG → ar fallbacks
      // if the engine rejects the primary.
      recognition.lang = "ar-SA";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.onresult = (/** @type {any} */ event) => {
        const transcript = Array.from(event.results)
          .slice(event.resultIndex)
          .map((result) => result[0]?.transcript || "")
          .join(" ")
          .trim();
        if (!transcript || !this.target) return;
        // Insert at caret (or append at end if no selection), preserving the
        // student's cursor so dictation in the middle of notes does not jump.
        const el = this.target;
        const start = typeof el.selectionStart === "number" ? el.selectionStart : el.value.length;
        const end = typeof el.selectionEnd === "number" ? el.selectionEnd : el.value.length;
        const prefix = el.value.slice(0, start);
        const suffix = el.value.slice(end);
        const glue = prefix && !/\s$/.test(prefix) ? " " : "";
        el.value = `${prefix}${glue}${transcript}${suffix}`;
        const caret = (prefix + glue + transcript).length;
        try { el.setSelectionRange(caret, caret); } catch { /* not all inputs support this */ }
        el.dispatchEvent(
          new el.ownerDocument.defaultView.Event("input", { bubbles: true })
        );
      };
      recognition.onerror = (/** @type {unknown} */ error) => {
        reportDiagnostic("speech.recognition", error);
        if (this.recognition === recognition) this.stop(false);
        notify("تعذر الإملاء الصوتي. تحقق من إذن الميكروفون.", "warn");
      };
      recognition.onend = () => {
        if (this.recognition === recognition) this.stop(false);
      };
      this.target = input;
      this.recognition = recognition;
      this.listening = true;
      const tryStart = (lang) => {
        try {
          recognition.lang = lang;
          recognition.start();
          notify("بدأ الإملاء الصوتي…", "info");
          return true;
        } catch (error) {
          return false;
        }
      };
      // Try MSA dialects in order of support; fall back to generic "ar".
      const langs = ["ar-SA", "ar-EG", "ar"];
      let started = false;
      for (const lang of langs) {
        if (tryStart(lang)) { started = true; break; }
      }
      if (started) return true;
      reportDiagnostic("speech.start", new Error("aucun langue arabe supportée"));
      this.stop();
      notify("تعذر بدء الإملاء الصوتي.", "warn");
      return false;
    },

    stop(abort = true) {
      const recognition = this.recognition;
      this.recognition = null;
      this.listening = false;
      this.target = null;
      if (abort && recognition) {
        try {
          recognition.abort();
        } catch (error) {
          reportDiagnostic("speech.abort", error);
        }
      }
    }
  };
}
