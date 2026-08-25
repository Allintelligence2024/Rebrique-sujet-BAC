/* Atlas UI feature, isolated from the application screen renderer. */
export function createAtlas({ $, $$, openDrawer, normalizeArabic, bacVerbs }) {
  const atlas = {
    techniques: [
      ["التصوير الإشعاعي الذاتي", "تتبع مسار الجزيئات بعد وسمها بنظير مشع.", "emerald"],
      ["الرحلان الشاردي", "فصل الجزيئات المشحونة حسب الشحنة الصافية.", "indigo"],
      ["الانتشار المناعي (أوكتارلوني)", "إثبات نوعية الأجسام المضادة بظهور أقواس الترسيب.", "amber"],
      ["Patch-Clamp", "عزل قطعة غشائية ودراسة التيارات الشاردية.", "purple"]
    ],
    verbs: bacVerbs.map((v) => ({
      title: v.verb,
      body: `${v.expected} — ${v.quickPlan}`,
      trap: v.trap,
      pole: v.pole
    })),
    hypotheses: [
      { title: "فرضية تفسيرية", body: "نفترض أن … مما يؤدي إلى …", trap: "لا تستعمل ربما/لعل." },
      { title: "مصادقة فرضية", body: "تتأكد صحة الفرضية لأن الوثيقة تُظهر …", trap: "لا تصادق دون سند." }
    ],
    flashcards: [
      { q: "ما أفعال القطب S؟", a: "استخرج، صف، حلّل، قارن — ملاحظة ثم استنتاج دون بسبب." },
      { q: "متى نكتب نصا علميا؟", a: "عند طلب تحرير نص: مقدمة + عرض + خاتمة تجيب عن المشكل." },
      { q: "ما الفرق بين حدد وفسّر؟", a: "حدد = تعيين دقيق. فسّر = سبب + آلية + نتيجة." }
    ]
  };

  function renderBody(category = "techniques", query = "") {
    const q = normalizeArabic(query);
    if (category === "flashcards") {
      return `<div class="flashcard-grid">${atlas.flashcards
        .filter((c) => !q || normalizeArabic(c.q + c.a).includes(q))
        .map(
          (c) =>
            `<div class="flashcard"><div class="flashcard-q">${c.q}<span>↺</span></div><div class="flashcard-a">${c.a}</div></div>`
        )
        .join("")}</div>`;
    }
    if (category === "verbs")
      return atlas.verbs
        .filter((v) => !q || normalizeArabic(v.title + v.body).includes(q))
        .map(
          (v) =>
            `<div class="atlas-card"><strong>${v.title}</strong><p class="small">${v.body}</p><div class="atlas-trap">${v.trap}</div></div>`
        )
        .join("");
    if (category === "hypotheses")
      return atlas.hypotheses
        .map(
          (h) =>
            `<div class="atlas-card"><strong>${h.title}</strong><p class="small">${h.body}</p><div class="atlas-trap">${h.trap}</div></div>`
        )
        .join("");
    return atlas.techniques
      .filter((i) => !q || normalizeArabic(i[0] + i[1]).includes(q))
      .map(
        (i) =>
          `<div class="atlas-card"><strong class="text-${i[2]}">${i[0]}</strong><p class="small text-muted mt-1">${i[1]}</p></div>`
      )
      .join("");
  }

  function bindCards() {
    $$(".flashcard").forEach((card) =>
      card.addEventListener("click", () => card.classList.toggle("revealed"))
    );
  }

  return function openAtlas() {
    openDrawer(
      "left",
      "🔬 أطلس التقنيات التجريبية والمخبرية",
      `<div class="atlas-header"><input class="field" id="atlas-search-input" type="search" placeholder="بحث في الأطلس…"><div class="atlas-tabs"><button class="atlas-tab-btn active" data-cat="techniques">تقنيات</button><button class="atlas-tab-btn" data-cat="verbs">أفعال</button><button class="atlas-tab-btn" data-cat="hypotheses">فرضيات</button><button class="atlas-tab-btn" data-cat="flashcards">بطاقات</button></div></div><div id="atlas-body">${renderBody("techniques")}</div>`
    );
    let category = "techniques";
    const refresh = () => {
      $("#atlas-body").innerHTML = renderBody(category, $("#atlas-search-input")?.value || "");
      bindCards();
    };
    $("#atlas-search-input")?.addEventListener("input", refresh);
    $$(".atlas-tab-btn").forEach((button) =>
      button.addEventListener("click", () => {
        category = button.dataset.cat;
        $$(".atlas-tab-btn").forEach((item) => item.classList.toggle("active", item === button));
        refresh();
      })
    );
    bindCards();
  };
}
