import { test } from "node:test";
import assert from "node:assert/strict";
import { APP_CONFIG } from "../data/subjects.js";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CASES_PATH = join(__dirname, "hard-benchmark", "cases.json");

function loadCases() {
  try {
    return JSON.parse(readFileSync(CASES_PATH, "utf8"));
  } catch {
    return { cases: [] };
  }
}

const BAD_KEYWORDS = ["synthetic", "généré", "LLM", "GPT", "Claude", "Gemini", "chatbot", "fabriqué"];

test("aucune entrée cases.json ne contient de mots-clés synthétiques dans source", () => {
  const data = loadCases();
  for (const c of data.cases) {
    const src = (c.source || "").toLowerCase();
    const provenanceSrc = ((c.provenance && c.provenance.source) || "").toLowerCase();
    const text = src + " " + provenanceSrc;
    const hits = BAD_KEYWORDS.filter((k) => text.includes(k.toLowerCase()));
    assert.equal(hits.length, 0, `mot-clé interdit détecté dans source/provenance: ${hits.join(", ")}`);
  }
});

test("pdfExternalUrl, si défini, est une URL https:// valide", () => {
  for (const year of APP_CONFIG.years) {
    for (const sujet of year.sujets) {
      if (sujet.pdfExternalUrl) {
        assert.ok(
          sujet.pdfExternalUrl.startsWith("https://"),
          `pdfExternalUrl doit être https:// pour ${year.id}/S${sujet.id}: ${sujet.pdfExternalUrl}`
        );
        assert.ok(!sujet.pdfExternalUrl.includes(" "), `pdfExternalUrl ne doit pas contenir d'espaces`);
      }
    }
  }
});

test("pdfAvailable et pdfExternalUrl sont cohérents", () => {
  for (const year of APP_CONFIG.years) {
    for (const sujet of year.sujets) {
      if (sujet.pdfAvailable) {
        assert.ok(
          sujet.pdf && sujet.pdf.length > 0,
          `pdfAvailable=true mais pdf vide pour ${year.id}/S${sujet.id}`
        );
      }
      if (!sujet.pdfAvailable && !sujet.pdfExternalUrl) {
        assert.ok(
          sujet.pdfNote && sujet.pdfNote.length > 0,
          `pdf non disponible sans URL ni note pour ${year.id}/S${sujet.id}`
        );
      }
    }
  }
});

test("tout pôle marqué official a page + date ISO + notes > 5 caractères", () => {
  for (const year of APP_CONFIG.years) {
    for (const sujet of year.sujets) {
      for (const ex of sujet.exercises) {
        for (const [poleLetter, pole] of Object.entries(ex.poles)) {
          if (pole.bacPromptSource === "official") {
            assert.ok(
              pole.bacPromptPage && typeof pole.bacPromptPage === "number",
              `bacPromptPage manquant pour ${year.id}/S${sujet.id}/E${ex.number}/${poleLetter}`
            );
            assert.ok(
              pole.bacPromptVerifiedAt && /^\d{4}-\d{2}-\d{2}$/.test(pole.bacPromptVerifiedAt),
              `bacPromptVerifiedAt invalide pour ${year.id}/S${sujet.id}/E${ex.number}/${poleLetter}`
            );
            assert.ok(
              pole.bacPromptNotes && pole.bacPromptNotes.length > 5,
              `bacPromptNotes trop courte pour ${year.id}/S${sujet.id}/E${ex.number}/${poleLetter}`
            );
          }
        }
      }
    }
  }
});

test("aucun bacPrompt officiel ne contient de sous-partie ou reconstructed", () => {
  for (const year of APP_CONFIG.years) {
    for (const sujet of year.sujets) {
      for (const ex of sujet.exercises) {
        for (const [poleLetter, pole] of Object.entries(ex.poles)) {
          if (pole.bacPromptSource === "official" && pole.bacPrompt) {
            const notes = pole.bacPromptNotes || "";
            assert.ok(
              !pole.bacPrompt.includes("reconstructed"),
              `bacPrompt officiel contient 'reconstructed' pour ${year.id}/S${sujet.id}/E${ex.number}/${poleLetter}`
            );
            assert.ok(
              !pole.bacPrompt.includes("ليس سؤالاً رسمياً مستقلاً"),
              `bacPrompt officiel contient une sous-partie pour ${year.id}/S${sujet.id}/E${ex.number}/${poleLetter}`
            );
            assert.ok(
              !/— الخاتمة/.test(pole.bacPrompt),
              `suffixe pédagogique interdit dans bacPrompt officiel ${year.id}/S${sujet.id}/E${ex.number}/${poleLetter}`
            );
            assert.ok(
              !/reconstructed|sous-partie|ليس سؤالاً رسمياً مستقلاً/.test(notes),
              `notes officielles contaminées pour ${year.id}/S${sujet.id}/E${ex.number}/${poleLetter}`
            );
          }
        }
      }
    }
  }
});

test("un même bacPrompt certifié officiel ne peut pas être partagé par deux pôles d'un même exercice", () => {
  for (const year of APP_CONFIG.years) {
    for (const sujet of year.sujets) {
      for (const ex of sujet.exercises) {
        const officialPrompts = new Map();
        for (const [poleLetter, pole] of Object.entries(ex.poles)) {
          if (pole.bacPromptSource === "official" && pole.bacPrompt) {
            if (officialPrompts.has(pole.bacPrompt)) {
              assert.fail(
                `bacPrompt officiel dupliqué entre pôles ${officialPrompts.get(pole.bacPrompt)} et ${poleLetter} dans ${year.id}/S${sujet.id}/E${ex.number}`
              );
            }
            officialPrompts.set(pole.bacPrompt, poleLetter);
          }
        }
      }
    }
  }
});

test("la somme des points N/S/E/W égale ex.max pour chaque exercice", () => {
  for (const year of APP_CONFIG.years) {
    for (const sujet of year.sujets || []) {
      for (const ex of sujet.exercises || []) {
        const sum = ["N", "S", "E", "W"].reduce((a, p) => a + (ex.poles[p]?.points || 0), 0);
        assert.ok(
          Math.abs(sum - ex.max) < 1e-6,
          `somme pôles ${sum} ≠ max ${ex.max} pour ${year.id}/S${sujet.id}/E${ex.number}`
        );
      }
    }
  }
});

test("toute année enabled=true a au moins un sujet, chaque sujet un exercice, chaque exercice 4 pôles N/S/E/W", () => {
  for (const year of APP_CONFIG.years) {
    if (!year.enabled) continue;
    assert.ok(year.sujets.length > 0, `année ${year.id} activée mais sans sujet`);
    for (const sujet of year.sujets) {
      assert.ok(sujet.exercises.length > 0, `sujet ${year.id}/S${sujet.id} sans exercice`);
      for (const ex of sujet.exercises) {
        for (const p of ["N", "S", "E", "W"]) {
          assert.ok(ex.poles[p], `exercice ${year.id}/S${sujet.id}/E${ex.number} sans pôle ${p}`);
        }
      }
    }
  }
});

test("les chaînes de données interpolées dans le HTML ne contiennent aucun caractère cassant le balisage", () => {
  // workspace.js / strategy.js / brouillon.js interpolent les chaînes de
  // données (labels, prompts, consignes BAC, placeholders, notes PDF,
  // réponses modèles) dans des templates HTML. Le contenu est du texte
  // officiel de confiance (pas une saisie utilisateur), mais il doit
  // rester neutre côté balisage : aucun <, >, &, backtick ni guillemet
  // double ASCII (placeholders injectés dans des attributs placeholder="…").
  const offenders = [];
  const walk = (obj, path) => {
    if (typeof obj === "string") {
      if (/[<>&`"]/.test(obj)) offenders.push(`${path} :: ${obj.slice(0, 60)}`);
    } else if (obj && typeof obj === "object") {
      for (const [k, v] of Object.entries(obj)) walk(v, `${path}.${k}`);
    }
  };
  for (const year of APP_CONFIG.years) walk(year, year.id);
  assert.deepEqual(offenders, [], "caractères HTML-dangereux dans les données :\n" + offenders.join("\n"));
});
