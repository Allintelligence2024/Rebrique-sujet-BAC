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
      recognition.lang = "ar-DZ";
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
        this.target.value = `${this.target.value}${this.target.value ? " " : ""}${transcript}`;
        this.target.dispatchEvent(
          new this.target.ownerDocument.defaultView.Event("input", { bubbles: true })
        );
      };
      recognition.onerror = (/** @type {unknown} */ error) => {
        reportDiagnostic("speech.recognition", error);
        notify("تعذر الإملاء الصوتي. تحقق من إذن الميكروفون.", "warn");
      };
      recognition.onend = () => {
        if (this.recognition === recognition) this.stop(false);
      };
      this.target = input;
      this.recognition = recognition;
      this.listening = true;
      try {
        recognition.start();
        notify("بدأ الإملاء الصوتي…", "info");
        return true;
      } catch (error) {
        reportDiagnostic("speech.start", error);
        this.stop();
        notify("تعذر بدء الإملاء الصوتي.", "warn");
        return false;
      }
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
