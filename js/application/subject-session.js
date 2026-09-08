import { examMinutesForYear, getLoadedYear, loadYear } from "../../data/subjects.js";
import { reportDiagnostic } from "../services/diagnostics.js";

/** Loads one subject payload, then starts the persisted session. */
export function createSubjectSessionStarter({
  appConfig,
  renderGuide,
  showScreen,
  store,
  timers,
  toast,
  timerBar
}) {
  function begin(year) {
    store.enterSession(
      year.id,
      year.sujets[0].id,
      examMinutesForYear(year) * 60,
      appConfig.strategyMinutes * 60
    );
    renderGuide(year);
    timers.startGlobal();
    showScreen("view-guide");
    timerBar()?.classList.remove("hidden");
    return year;
  }

  return async function startSession(yearId) {
    const cached = getLoadedYear(yearId);
    if (cached) return begin(cached);
    try {
      return begin(await loadYear(yearId));
    } catch (error) {
      reportDiagnostic("subjects.load-year", error, { yearId: String(yearId) });
      toast(
        globalThis.navigator?.onLine !== false
          ? "تعذّر تحميل بيانات هذه السنة. أعد المحاولة."
          : "هذه السنة غير محفوظة على الجهاز. اتصل بالإنترنت ثم أعد فتحها مرة واحدة.",
        "error",
        6000
      );
      return null;
    }
  };
}
