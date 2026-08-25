import { expect, test } from "@playwright/test";

test("la PWA démarre depuis le cache après passage hors ligne", async ({ page, context }) => {
  await page.goto("/");
  await expect(page.locator("#year-grid")).toBeVisible();
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);

  await context.setOffline(true);
  await page.reload();
  await expect(page.locator("#year-grid")).toBeVisible();
  await context.setOffline(false);
});
