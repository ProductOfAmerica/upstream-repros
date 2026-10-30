// Runs axe-core's label-content-name-mismatch rule against the dev server (npm run dev).
import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const url = process.env.URL ?? "http://localhost:5181";
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH });
const context = await browser.newContext({ locale: "en-US" });
const page = await context.newPage();
await page.goto(url);
await page.waitForSelector("button.rdp-day_button");

const day = page.locator('button.rdp-day_button:text-is("22")').first();
console.log("Day button HTML:\n" + (await day.evaluate((el) => el.outerHTML)));
console.log("Gridcell HTML:\n" + (await day.evaluate((el) => el.parentElement.outerHTML.replace(el.outerHTML, "<button>...</button>"))));

const { violations, testEngine } = await new AxeBuilder({ page })
  .withRules(["label-content-name-mismatch"])
  .analyze();
console.log("\naxe-core " + testEngine.version);
console.log(`violations: ${violations.length}`);
for (const v of violations) {
  console.log(`\n${v.id} (${v.impact}) ${v.helpUrl}\n${v.description}`);
  console.log(`affected nodes: ${v.nodes.length}`);
  console.log(v.nodes[0].html);
  console.log(v.nodes[0].any.map((a) => a.message).join("\n"));
}
await browser.close();
process.exit(violations.length ? 1 : 0);
