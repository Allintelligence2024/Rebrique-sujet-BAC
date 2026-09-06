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
    await page.locator('#view-strategy [data-confirm="1"]').click();
    await expect(page.locator("#view-workspace")).toBeVisible();
    await expectNoHorizontalOverflow(page);
  });

  test(`[${phone.name}] جلسة 10 دقائق usable au doigt`, async ({ page }) => {
    await page.setViewportSize({ width: phone.width, height: phone.height });
    await page.goto("/");
    await page.locator("#btn-quick-session").click();
    await expect(page.locator("#view-workspace")).toBeVisible();
    await expectNoHorizontalOverflow(page);
    const field = page.locator("#ex-content textarea, #ex-content input.field").first();
    await expect(field).toBeVisible();
  });
}
