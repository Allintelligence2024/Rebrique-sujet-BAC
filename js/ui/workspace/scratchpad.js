export function composeDrafts(scratch, activePole) {
  const current = scratch[activePole] || "";
  const full = [scratch.N, scratch.S ? `وتبين المعطيات أن ${scratch.S}` : "", scratch.E, scratch.W]
    .filter(Boolean)
    .join("\n");
  return { current, full };
}

export function hasObservationBeforeExplanation(scratch) {
  return !String(scratch.E || "").trim() || Boolean(String(scratch.S || "").trim());
}
