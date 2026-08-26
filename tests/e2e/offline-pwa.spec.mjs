import { expect, test } from "@playwright/test";

test("la démonstration 60 secondes expose avant, après et limites sans preuve inventée", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: /ابدأ المثال/ }).click();
  await expect(page.getByRole("heading", { name: /قبل: عبارة عامة/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /بعد: ملاحظة ثم تفسير/ })).toBeVisible();
  await expect(page.getByText(/ليس نتيجة طالب حقيقي/)).toBeVisible();
  await expect(page.getByRole("heading", { name: /ما لا يضمنه المحرك/ })).toBeVisible();
});

test("la PWA démarre depuis le cache après passage hors ligne", async ({ page, context }) => {
  await page.goto("/");
  await expect(page.locator("#year-grid")).toBeVisible();
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("#year-grid")).toBeVisible();
  await context.setOffline(false);
});
