//jshint esversion:8

import { isBDay, OPEN_DATE } from "./ext/openDate.js";
import setPage from "./ext/setPage.js";
import { late, soon } from "./pages.js";
import { animate } from "./animation.js";

function startCountdown() {
  const target = new Date(`${OPEN_DATE}T00:00:00`).getTime();
  const dEl = document.getElementById("cd-d");
  const hEl = document.getElementById("cd-h");
  const mEl = document.getElementById("cd-m");
  const sEl = document.getElementById("cd-s");
  if (!dEl || !hEl || !mEl || !sEl) return;
  const tick = () => {
    const diff = target - Date.now();
    if (diff <= 0) { location.reload(); return; }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    dEl.textContent = String(d).padStart(2, "0");
    hEl.textContent = String(h).padStart(2, "0");
    mEl.textContent = String(m).padStart(2, "0");
    sEl.textContent = String(s).padStart(2, "0");
    requestAnimationFrame(tick);
  };
  tick();
}

/******************************************************* SETUP ************************************************************/

const status = isBDay();
if (status === "IS_EARLY") { setPage(soon); startCountdown(); }
if (status === "IS_LATE") setPage(late);
if (status === "ON_TIME") animate();
