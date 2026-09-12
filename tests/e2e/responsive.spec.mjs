import { expect, test } from "@playwright/test";

/* ------------------------------------------------------------------
   Validation mobile réelle (chromium, viewport téléphone).
   NOTE: ces tests tournent dans la CI (playwright install chromium)
   ; localement le sandbox ne peut pas télécharger le navigateur.
   ------------------------------------------------------------------ */

const PHONES = [
  { name: "iPhone 13 mini", width: 375, height: 812 },
  { name: "Galaxy S20", width: 360, height: 800 },
  { name: "iPhone 14 Pro Max", width: 430, height: 932 }
];

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow, "défilement horizontal détecté").toBeLessThanOrEqual(1);
}

for (const phone of PHONES) {
  test(`[${phone.name}] hub sans débordement horizontal`, async ({ page }) => {
    await page.setViewportSize({ width: phone.width, height: phone.height });
    await page.goto("/");
    await expect(page.locator("#year-grid")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test(`[${phone.name}] parcours guide → stratégie → workspace sans débordement`, async ({ page }) => {
    await page.setViewportSize({ width: phone.width, height: phone.height });
    await page.goto("/");
    await page.locator('#year-grid [data-year="2025"]').click();
    await expect(page.locator("#view-guide")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.locator("#guide-next").click();
    await expect(page.locator("#view-strategy")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    await page.locator('#view-strategy [data-confirm="1"][data-session-mode="training"]').click();
    await expect(page.locator("#view-workspace")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test(`[${phone.name}] parcours carte-sujet → copie utilisable au doigt`, async ({ page }) => {
    await page.setViewportSize({ width: phone.width, height: phone.height });
    await page.goto("/");
    await page.locator('#year-grid [data-year="2025"]').click();
    await page.locator("#guide-next").click();
    await page.locator('#view-strategy [data-confirm="1"][data-session-mode="training"]').click();
    await expect(page.locator("#view-workspace")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    const field = page.locator("#ex-content textarea, #ex-content input.field").first();
    await expect(field).toBeVisible();
  });
}

test("[phone] la couverture partielle garde la simulation verrouillée", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await page.locator('#year-grid [data-year="2025"]').click();
  await page.locator("#guide-next").click();
  await expect(page.locator('[data-subject-coverage="partial"]')).toHaveCount(1);
  await expect(page.locator('[data-simulation-eligible="true"]')).toHaveCount(0);
  await expect(page.locator("#view-strategy")).toContainText("جرد المهام");
});

test("[phone] parcours Maths : durée 2 h 30 et deux exercices", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await page.locator("#btn-stream-fab").click();
  await expect(page.locator("#stream-fab-label")).toContainText("رياضيات");
  await page.locator('#year-grid [data-year="2026-m"]').click();
  await expect(page.locator("#global-timer")).toHaveText("02:30:00");
  await expect(page.locator("#view-guide")).toContainText("2س30د");
  await page.locator("#guide-next").click();
  await page.locator('#view-strategy [data-confirm="1"][data-session-mode="training"]').click();
  await expect(page.locator("#view-workspace [data-switch]")).toHaveCount(2);
  await expectNoHorizontalOverflow(page);
});

test("[phone] tous les états de pages sans débordement (tiroirs, détails, modale)", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await expect(page.locator("#year-grid")).toBeVisible();

  // Section تدريب المفتاح ouverte + carte البوابتان
  await page.locator("#training-details summary").click();
  await expect(page.locator("#gates-card")).toBeVisible();
  let overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);

  // Parcours complet jusqu'à la copie
  await page.locator('#year-grid [data-year="2025"]').click();
  await page.locator("#guide-next").click();
  await page.locator('#view-strategy [data-confirm="1"][data-session-mode="training"]').click();
  await expect(page.locator("#view-workspace")).toBeVisible();

  // Aide de pôle dépliée (portes + canevas + فحص رباعي)
  await page.locator(".pole-help summary").first().click();
  overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);

  // Tiroir المسودة ouvert
  await page.locator("#ws-brouillon").click();
  await expect(page.locator(".drawer.open")).toBeVisible();
  overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
  await page.locator(".drawer [data-close]").click();

  // Modale التلميح (valve anti-stress). Le rapport a été retiré de la copie
  // (épure élève — verrouillé par tests/all-buttons.test.mjs), la modale
  // réellement atteignable pendant la copie est donc celle du تلميح.
  await page.locator("#ws-panic").click();
  await expect(page.locator(".modal")).toBeVisible();
  overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(1);
  await page.locator(".modal [data-close='btn']").click();
  await expect(page.locator(".modal")).toHaveCount(0);
});
