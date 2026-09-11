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
  timerBar,
  helpers,
  $
}) {
  function begin(year) {
    store.enterSession(
      year.id,
      year.sujets[0].id,
      examMinutesForYear(year) * 60,
      appConfig.strategyMinutes * 60
    );
    renderGuide(year);
    // Global exam clock starts only after the student confirms subject + mode
    // in strategy screen. The 25-minute strategy phase and breathing guide
    // must not debit the official BAC duration (fixes premature timer drain).
    // Keep the timer bar hidden on guide/strategy, but refresh its value to
    // the chosen year's duration so any reveal shows the correct starting time.
    const t = $("#global-timer");
    if (t) t.textContent = helpers.fmt(store.state.globalRemaining);
    showScreen("view-guide");
    timerBar()?.classList.add("hidden");
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
