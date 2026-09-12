/* ============================================================
   Visionneuse du sujet — un seul point de construction.
   ------------------------------------------------------------
   Le PDF local (subjects/**) est servi par le même origine : la CSP
   autorise frame-src 'self', l'iframe affiche donc le sujet sans
   quitter l'application. Le lien dzexams reste disponible en source,
   et le téléchargement permet de travailler hors ligne.
   ============================================================ */

const escapeHTML = (value = "") =>
  String(value).replace(
    /[&<>'"]/g,
    (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[character]
  );

export function pdfViewerHTML(subject, { showCover = true } = {}) {
  const local = subject?.pdfLocalUrl;
  const external = subject?.pdfExternalUrl;
  const label = `موضوع البكالوريا ${subject?.id === 1 ? "الأول" : "الثاني"}`;
  if (local) {
    return `<div class="pdf-reader stack">
      ${showCover ? `<div class="pdf-viewer-head"><strong>📄 ${escapeHTML(label)}</strong><span class="small text-muted">الملف المحلي — يُعرض داخل التطبيق</span></div>` : ""}
      <iframe class="pdf-frame" title="${escapeHTML(label)}" src="${escapeHTML(local)}#view=FitH"></iframe>
      <div class="flex wrap pdf-viewer-actions">
        <a class="btn btn-indigo btn-sm" href="${escapeHTML(local)}" target="_blank" rel="noopener noreferrer">📄 فتح في نافذة مستقلة</a>
        <a class="btn btn-ghost btn-sm" href="${escapeHTML(local)}" download>⬇️ تنزيل PDF</a>
        ${external ? `<a class="small" href="${escapeHTML(external)}" target="_blank" rel="noopener noreferrer">المصدر الخارجي</a>` : ""}
      </div>
    </div>`;
  }
  if (external) {
    return `<div class="pdf-reader stack">
      <div class="pdf-reader-cover" role="status">
        <span class="pdf-reader-icon" aria-hidden="true">📄</span>
        <strong>لا يوجد ملف محلي لهذا الموضوع</strong>
        <p class="small text-muted">يُفتح الموضوع على المصدر الخارجي في نافذة مستقلة.</p>
      </div>
      <a class="btn btn-indigo btn-block pdf-open" href="${escapeHTML(external)}" target="_blank" rel="noopener noreferrer">📄 فتح المصدر الخارجي</a>
    </div>`;
  }
  return `<div class="center stack preview-empty"><p class="small text-muted">لا يوجد ملف موضوع متاح لهذه الدورة في التطبيق.</p></div>`;
}
