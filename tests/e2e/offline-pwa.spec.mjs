import { expect, test } from "@playwright/test";

test("la démonstration 60 secondes expose avant, après et limites sans preuve inventée", async ({ page }) => {
  await page.goto("/");
  await page.locator("#training-details summary").click();
  await page.getByRole("button", { name: /ابدأ المثال/ }).click();
  await expect(page.getByRole("heading", { name: /قبل: عبارة عامة/ })).toBeVisible();
  await expect(page.getByRole("heading", { name: /بعد: ملاحظة ثم تفسير/ })).toBeVisible();
  await expect(page.getByText(/ليس نتيجة طالب حقيقي/)).toBeVisible();
  await expect(page.getByRole("heading", { name: /ما لا يضمنه المحرك/ })).toBeVisible();
});

test("le shell et une année déjà ouverte redémarrent hors ligne", async ({ page, context }) => {
  await page.goto("/");
  await expect(page.locator("#year-grid")).toBeVisible();
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);

  await page.locator('#year-grid [data-year="2025"]').click();
  await expect(page.locator("#view-guide")).toBeVisible();
  await page.waitForFunction(async () =>
    Boolean(await caches.match("/data/years/se/year-2025.js", { ignoreSearch: true }))
  );
  await context.setOffline(true);
  await page.reload();

  await expect(page.locator("#view-guide")).toBeVisible();
  // Chromium's CDP network emulation keeps navigator.onLine=true after reload;
  // connectivity is therefore asserted below after a real service-worker miss.
  await expect(page.locator("#operational-status [data-build-id]")).toHaveText(/^[a-f0-9]{12}$/);
  await context.setOffline(false);
});

test("une année jamais ouverte annonce clairement son indisponibilité hors ligne", async ({
  page,
  context
}) => {
  await page.goto("/");
  await expect(page.locator("#year-grid")).toBeVisible();
  await page.waitForFunction(() => navigator.serviceWorker?.controller !== null);
  await context.setOffline(true);
  await page.locator('#year-grid [data-year="2024"]').click();
  await expect(page.locator("#view-hub")).toBeVisible();
  await expect(page.locator(".toast")).toContainText("غير محفوظة");
  await expect(page.locator("#operational-status")).toHaveAttribute("data-online", "false");
  await context.setOffline(false);
});

test("l’écran stratégie n’effectue aucune requête PDF avant le clic élève", async ({ page }) => {
  const pdfRequests = [];
  page.on("request", (request) => {
    if (request.url().endsWith(".pdf")) pdfRequests.push(request.url());
  });
  await page.goto("/");
  await page.locator('#year-grid [data-year="2025"]').click();
  await page.locator("#guide-next").click();

  const link = page.locator("#pdf-preview-container .pdf-download");
  await expect(link).toBeVisible();
  await expect(link).toContainText("1.05 م.ب");
  await expect(page.locator("#pdf-preview-container [data-pdf-bytes]")).toHaveAttribute(
    "data-pdf-bytes",
    "1099674"
  );
  expect(pdfRequests).toEqual([]);
});
