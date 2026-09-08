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
  await page.locator('#view-strategy [data-confirm="1"][data-session-mode="training"]').click();
  const switches = page.locator("#view-workspace [data-switch]");
  await expect(switches).toHaveCount(3);
  await expect(switches.nth(2)).toBeEnabled();
  await switches.nth(2).click();
  await expect(page.locator("#ws-banner")).toContainText("التمرين 03");
  await page.locator('#view-workspace [data-switch="1"]').click();
  await expect(page.locator("#ws-banner")).toContainText("التمرين 01");
});

test("reflow équivalent à un zoom de 200 % sur un écran de 1280 px", async ({ page }) => {
  // WCAG 1.4.10: 1280 CSS px à 200 % laisse une largeur utile équivalente à 640 CSS px.
  await page.setViewportSize({ width: 640, height: 720 });
  await page.goto("/");
  await expect(page.locator("#year-grid")).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.locator('#year-grid [data-year="2025"]').click();
  await page.locator("#guide-next").click();
  await page.locator('#view-strategy [data-confirm="1"][data-session-mode="training"]').click();
  await expect(page.locator("#view-workspace")).toBeVisible();
  await expectNoHorizontalOverflow(page);
  await page.locator("#ws-brouillon").click();
  await expect(page.locator(".drawer.open")).toBeVisible();
  await expectNoHorizontalOverflow(page);
});
