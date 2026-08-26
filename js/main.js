/* ============================================================
   MAIN — point d'entrée. Charge la config et initialise l'UI.
   ============================================================ */
import { init } from "./ui.js";
import { reportDiagnostic } from "./services/diagnostics.js";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () =>
    navigator.serviceWorker
      .register("./sw.js")
      .catch((error) => reportDiagnostic("service-worker.register", error))
  );
}

document.addEventListener("DOMContentLoaded", init);
