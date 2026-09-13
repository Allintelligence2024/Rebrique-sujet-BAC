import { expect, test } from "@playwright/test";

async function expectNoHorizontalOverflow(page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth
  );
  expect(overflow, "défilement horizontal détecté").toBeLessThanOrEqual(1);
}

test("le lien d’évitement est le premier arrêt clavier et cible le contenu", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  const skipLink = page.locator(".skip-link");
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.locator("#main-content")).toBeFocused();
});

test("le changement d’écran place le focus sur son titre", async ({ page }) => {
  await page.goto("/");
  await page.locator('#year-grid [data-year="2025"]').click();
  await expect(page.locator("#guide-title")).toBeFocused();
  await page.locator("#guide-next").click();
  await expect(page.locator("#view-strategy h2")).toBeFocused();
});

test("les exercices restent accessibles dans n’importe quel ordre sans réponse préalable", async ({
  page
}) => {
  await page.goto("/");
  await page.locator('#year-grid [data-year="2025"]').click();
  await page.locator("#guide-next").click();
  await page.locator('#view-strategy [data-confirm="1"][data-session-mode="bac"]').click();
  const exercises = page.locator("#view-workspace [data-simulation-exercise]");
  await expect(exercises).toHaveCount(3);
  await expect(exercises.nth(2)).toBeEnabled();
  // Le troisième exercice s'ouvre directement : aucune réponse préalable exigée.
  await exercises.nth(2).click();
  await expect(page.locator('[data-official-task^="2025-S1-E3-"]').first()).toBeVisible();
  await page.locator('#view-workspace [data-simulation-exercise="1"]').click();
  await expect(page.locator('[data-official-task^="2025-S1-E1-"]').first()).toBeVisible();
});

test("la remise de copie est confirmée par une boîte de dialogue accessible", async ({ page }) => {
  await page.goto("/");
  await page.locator('#year-grid [data-year="2025"]').click();
  await page.locator("#guide-next").click();
  await page.locator('#view-strategy [data-confirm="1"][data-session-mode="bac"]').click();
  await page.locator("#simulation-finish").click();
  const modal = page.locator(".modal");
  await expect(modal).toBeVisible();
  await expect(modal.locator("#simulation-finish-yes")).toBeVisible();
  await page.locator("#simulation-finish-no").click();
  await expect(modal).toHaveCount(0);
  await expect(page.locator("#view-workspace")).toBeVisible();
});

test("reflow équivalent à un zoom de 200 % sur un écran de 1280 px", async ({ page }) => {
  // WCAG 1.4.10: 1280 CSS px à 200 % laisse une largeur utile équivalente à 640 CSS px.
  await page.setViewportSize({ width: 640, height: 720 });
  await page.goto("/");
  await expect(page.locator("#year-grid")).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.locator('#year-grid [data-year="2025"]').click();
  await page.locator("#guide-next").click();
  await page.locator('#view-strategy [data-confirm="1"][data-session-mode="bac"]').click();
  await expect(page.locator("#view-workspace")).toBeVisible();
  await expectNoHorizontalOverflow(page);
  // Le sujet s'ouvre dans un tiroir : lui aussi doit tenir sans débordement.
  await page.locator("#simulation-pdf").click();
  await expect(page.locator(".drawer.open")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
