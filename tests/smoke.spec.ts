import { expect, test } from "@playwright/test";

/** ENGINEERING.md §11 — smoke tests for the money paths. */

test("register search filters the ledger to a known service", async ({ page }) => {
  await page.goto("/services");
  const search = page.getByRole("searchbox");
  await search.fill("შპს");

  await expect(page.getByRole("link", { name: /შპს რეგისტრაცია/ })).toBeVisible();
  await expect(
    page.getByRole("link", { name: /იურიდიული კონსულტაცია/ }),
  ).toHaveCount(0);

  // One-keystroke clear restores the full register.
  await search.press("Escape");
  await expect(
    page.getByRole("link", { name: /იურიდიული კონსულტაცია/ }),
  ).toBeVisible();
});

test("service page renders in both locales with the correct price", async ({
  page,
}) => {
  await page.goto("/services/llc-registration");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "შპს რეგისტრაცია",
  );
  await expect(page.locator("main")).toContainText("₾ 250");

  await page.goto("/en/services/llc-registration");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "LLC Registration",
  );
  await expect(page.locator("main")).toContainText("₾ 250");
});

test("checkout completes end-to-end against the MockProvider", async ({ page }) => {
  await page.goto("/en/checkout?service=llc-registration");

  await page.getByLabel("Full name").fill("John Tester");
  await page.getByLabel("Email").fill("john.tester@example.com");
  await page.getByLabel("Phone").fill("555 12 34 56");
  await page.getByRole("button", { name: /Sign & pay/ }).click();

  await page.waitForURL(/\/en\/checkout\/pay\//);
  await expect(page.locator("main")).toContainText("SANDBOX");
  await page.getByRole("button", { name: /Approve payment/ }).click();

  await page.waitForURL(/\/en\/checkout\/result\//);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "The order is executed.",
  );
  await expect(page.locator("main")).toContainText(/LM-\d{4}-\d{5}/);
});

test("a bad service slug renders the branded 404", async ({ page }) => {
  const response = await page.goto("/services/does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "ეს მუხლი არ არსებობს.",
  );

  const responseEn = await page.goto("/en/services/does-not-exist");
  expect(responseEn?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "This clause does not exist.",
  );
});
