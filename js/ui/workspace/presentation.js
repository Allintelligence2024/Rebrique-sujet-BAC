import { BROUILLON_MODE_DATA } from "../../../data/brouillon.js";
import { classifyInstruction } from "../../domain/method/gates.js";

export function createWorkspacePresentation({
  METHOD_SCRIPTS,
  node,
  normalizeArabic,
  officialTaskInventoryFor,
  replaceContent,
  store,
  levelWord
}) {
  function provenanceHTML(pole, exerciseNumber, poleType) {
    const inventory = officialTaskInventoryFor(store.state.yearId, store.state.sujetId);
    const mappedTasks = (inventory?.tasks || []).filter((task) =>
      (task.trainingMappings || []).some(
        (mapping) => mapping.exerciseNumber === exerciseNumber && mapping.pole === poleType
      )
    );
    const taskIds = mappedTasks.map((task) => task.id).join("، ");
    const taskLink = taskIds ? ` — المهمة: ${taskIds}` : "";
    if (pole.bacPromptSource === "official") {
      const page = pole.bacPromptPage ? ` — الصفحة ${pole.bacPromptPage}` : "";
      return `<p class="small text-emerald provenance-note">✓ تعليمة رسمية من الموضوع${page}${taskLink}</p>`;
    }
    if (mappedTasks.length) {
      return `<p class="small text-amber provenance-note">⚠ خطوة تدريبية مفككة من ${taskIds} — ليست تعليمة مستقلة في الموضوع الرسمي.</p>`;
    }
    return `<p class="small text-amber provenance-note">⚠ خطوة تدريبية معاد بناؤها — ليست تعليمة مستقلة في الموضوع الرسمي.</p>`;
  }

  function formatEvalFeedback(result) {
    let html = "تشخيص تغطية الإجابة";
    if (result.verdict) html += `<br>${result.verdict}`;
    if (result.rubric?.applicable && result.rubric.display) {
      html += `<br><span class="small">ميزان التحليل: ${result.rubric.display}</span>`;
      const skipped = (result.rubric.steps || []).filter((step) => !step.passed).map((step) => step.label);
      if (skipped.length) html += `<br>⏭️ خطوات ناقصة: <b>${skipped.join("، ")}</b>`;
    }
    if (result.missing?.length) html += `<br>🔎 مفاهيم مفتاحية ناقصة: <b>${result.missing.join("، ")}</b>`;
    if (result.forbiddenFound?.length) {
      html += `<br>⛔ كلمة يجب تجنّبها هنا: <b>${result.forbiddenFound.join("، ")}</b>`;
    }
    if (result.science?.errors?.length) {
      html += `<br>🧪 خطأ علمي: <b>${result.science.errors.map((error) => error.message).join(" — ")}</b>`;
    }
    if (result.document?.gaps?.length) {
      html += `<br>📄 قراءة السند: <b>${result.document.gaps.join(" — ")}</b>`;
    }
    if (result.artifact?.gaps?.length) {
      html += `<br>✏️ مخطط/معادلة: <b>${result.artifact.gaps.join(" — ")}</b>`;
    }
    if (result.hypotheses?.gaps?.length) {
      html += `<br>🔬 الفرضيات: <b>${result.hypotheses.gaps.join(" — ")}</b>`;
    }
    if (result.technique?.gaps?.length) {
      html += `<br>🧫 التقنية: <b>${result.technique.gaps.join(" — ")}</b>`;
    }
    if (
      result.closing?.applicable &&
      result.taskProfile?.id === "scientific-text" &&
      result.closing.score < 0.5
    ) {
      html += "<br>🎯 الخاتمة لا تجيب عن المشكل المطروح في السنّ اقرأ.";
    }
    if (result.methodology?.missing?.length) {
      html += `<br>🧭 المنهجية: ${result.methodology.missing[0]}`;
    }
    if (result.coach?.tips?.length) {
      html += `<br>📘 من دليل المنهجية: ${result.coach.tips.slice(0, 2).join(" ")}`;
    } else if (result.methodology?.score < 0.9 && result.coach?.script?.steps?.length) {
      html += `<br>📘 ${result.coach.script.title}: ${result.coach.script.steps.join(" ← ")}`;
    }
    const sentencePack = BROUILLON_MODE_DATA.sentenceModels.find((pack) => {
      const id = result.taskProfile?.id;
      if (id === "analysis") return pack.title.includes("تقديم");
      if (id === "explanation") return pack.title.includes("تفسير");
      return false;
    });
    if (sentencePack && result.fraction < 0.9) html += `<br>✍️ بدّل: <i>${sentencePack.items[0]}</i>`;
    html += `<br><span class="secondary-score">التقدير النوعي: <b>${levelWord(result.fraction)}</b></span>`;
    return result.empty ? "لم تُدخل أي إجابة بعد." : html;
  }

  function setFeedback(container, result, pole, showScore = false) {
    const feedback = formatEvalFeedback(result)
      .replace(/<br>/g, "\n")
      .replace(/<[^>]*>/g, "");
    const prefix = showScore ? "" : "مراجعة منهجية فقط — لا توجد نقطة رقمية لهذه السنّ.\n";
    const fragments = [node("span", { text: prefix + feedback })];
    if (pole?.modelAnswer) {
      const details = node("details", { className: "model-box" });
      details.append(
        node("summary", { className: "model-summary", text: "إجابة نموذجية للتدريب" }),
        node("div", { className: "model-body" })
      );
      details.lastElementChild.append(node("pre", { className: "model-text", text: pole.modelAnswer }));
      fragments.push(details);
    }
    replaceContent(container, fragments);
  }

  function detectVerb(text) {
    const normalized = normalizeArabic(text || "");
    for (const route of BROUILLON_MODE_DATA.verbRouting) {
      if (route.patterns.some((pattern) => normalized.includes(normalizeArabic(pattern)))) return route;
    }
    return BROUILLON_MODE_DATA.verbRouting[0];
  }

  function gateChipHTML(poleType, pole) {
    const classification = classifyInstruction(pole?.bacPrompt || pole?.prompt || "");
    const gate1 = classification.mode === "paper" ? "📄 ورقة" : "🧠 رأس";
    const gate2 = classification.gate2 ? (classification.gate2 === "film" ? " · 🎬 فيلم" : " · 📷 صورة") : "";
    const columns = classification.twoColumns ? " · عمودان: [من الوثيقة | من الدرس]" : "";
    return `<div class="small text-muted gate-chip" data-gate-chip="${poleType}">🚪 القرار قبل الكتابة: <b>${gate1}${gate2}</b> — مسار ${classification.pathLabel}${columns}</div>`;
  }

  function poleMethodHint(poleType, pole) {
    const fallback = { N: "problem", S: "analysis", E: "explanation", W: "scientific-text" };
    const script = METHOD_SCRIPTS[fallback[poleType]] || METHOD_SCRIPTS.synthesis;
    const verb = detectVerb(pole?.bacPrompt || pole?.prompt || "");
    const trap = verb?.warning ? `<div class="atlas-trap">${verb.warning}</div>` : "";
    if (!script) return trap;
    return `<div class="method-script"><strong>${script.title}</strong> — ${script.steps.join(" ← ")}${trap}</div>`;
  }

  return { detectVerb, gateChipHTML, poleMethodHint, provenanceHTML, setFeedback };
}
