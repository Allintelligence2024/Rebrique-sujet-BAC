export function printCurrentExercise() {
  const popup = window.open("", "_blank");
  if (!popup) return false;
  popup.document.open();
  popup.document.write(
    `<html><head><title>نسخة الامتحان</title></head><body>${document.querySelector("#ex-content")?.innerHTML || ""}</body></html>`
  );
  popup.document.close();
  return true;
}

export function reportToCSV(report) {
  const head = ["التمرين", "المسمى", "العلامة القصوى", "N", "S", "E", "W", "المجموع"];
  const lines = [head.join(",")];
  report.rows.forEach((row) => {
    lines.push(
      [
        `ت${row.exercise.replace(/ت/, "")}`,
        `"${row.label.replaceAll('"', '""')}"`,
        row.max,
        row.N,
        row.S,
        row.E,
        row.W,
        row.total
      ].join(",")
    );
  });
  lines.push(["الإجمالي", "", report.grandMax, "", "", "", "", report.grand].join(","));
  return "\ufeff" + lines.join("\n");
}

export function downloadFile(name, content, type = "text/plain") {
  const blob = new Blob([content], { type });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = name;
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    URL.revokeObjectURL(link.href);
    link.remove();
  }, 100);
}
