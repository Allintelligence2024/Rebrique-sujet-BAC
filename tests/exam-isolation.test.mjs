import test from "node:test";
import assert from "node:assert/strict";
import { simulationExamHTML } from "../js/ui/screens/simulation.js";

test("active exam renders only the selected subject tasks and no answer model", () => {
  const subject = {
    id: 2,
    exercises: [{ number: 1, label: "التمرين الأول", poles: { N: { modelAnswer: "hidden" } } }]
  };
  const html = simulationExamHTML({
    subject,
    inventory: {
      tasks: [{ id: "S2-E1-T1", exerciseNumber: 1, order: 1, prompt: "تعليمة رسمية", page: 1, maxPoints: 4 }]
    },
    activeExercise: 1,
    completed: false
  });
  assert.match(html, /تعليمة رسمية/);
  assert.doesNotMatch(html, /hidden|مراجع التدريب/);
  assert.doesNotMatch(html, /الموضوع الأول|simulation-pdf|فتح المصدر/);
});
