/* Final review screenshots at 1440px and 375px (PROMPTS.md critique loop). */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.env.SHOT_BASE ?? "http://localhost:3000";
const OUT = "screenshots";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ channel: "msedge" });

async function shoot(page, name) {
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
  console.log(`saved ${name}`);
}

async function run(width, tag) {
  const context = await browser.newContext({
    viewport: { width, height: width === 375 ? 812 : 1000 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  await page.goto(`${BASE}/`);
  await shoot(page, `home-${tag}`);

  await page.goto(`${BASE}/services/llc-registration`);
  await shoot(page, `service-${tag}`);

  await page.goto(`${BASE}/lawyers/nino-beridze`);
  await shoot(page, `lawyer-${tag}`);

  // Drive the checkout to an executed order for the confirmation shot.
  await page.goto(`${BASE}/checkout?service=llc-registration`);
  await shoot(page, `checkout-${tag}`);
  await page.locator("#checkout-name").fill("გიორგი თესტიშვილი");
  await page.locator("#checkout-email").fill("giorgi.test@example.ge");
  await page.locator("#checkout-phone").fill("555 12 34 56");
  await page.locator("button[type=submit]").click();
  await page.waitForURL(/\/checkout\/pay\//, { timeout: 30000 });
  await page.getByRole("button").filter({ hasText: "₾" }).first().click();
  await page.waitForURL(/\/checkout\/result\//, { timeout: 30000 });
  await shoot(page, `confirmation-${tag}`);

  await context.close();
}

await run(1440, "1440");
await run(375, "375");
await browser.close();
console.log("done");
