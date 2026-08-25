/* ============================================================
   MAIN — point d'entrée. Charge la config et initialise l'UI.
   ============================================================ */
import { init } from "./ui.js";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}

document.addEventListener("DOMContentLoaded", init);
