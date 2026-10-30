import { expect, test, type Page } from "@playwright/test";

/**
 * The radio streams curated audio tracks from public/audio/tracks/. On the
 * homepage its control is the play button in the hero status line, labelled
 * "Play <title> by <artist>" / "Pause <title>".
 */
const radioButton = (page: Page) =>
  page.getByRole("button", { name: /^(Play .+ by |Pause )/ }).first();

test("warms the next track while the current one plays", async ({ page }) => {
  const servedUrls = new Set<string>();
  page.on("response", (r) => {
    if (r.url().includes("/audio/tracks/") && r.ok()) {
      servedUrls.add(r.url());
    }
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });
  const radio = radioButton(page);

  // Retry until hydration has attached the handler.
  await expect(async () => {
    if ((await radio.getAttribute("aria-pressed")) !== "true") await radio.click();
    await expect(radio).toHaveAttribute("aria-pressed", "true");
  }).toPass({ timeout: 10_000 });

  // One clip served for the track now playing, one for the track queued behind it.
  await expect.poll(() => servedUrls.size, { timeout: 15_000 }).toBeGreaterThanOrEqual(2);
});

test("never plays until the visitor presses play", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const radio = radioButton(page);
  await expect(radio).toBeVisible();

  // Scrolling and clicking elsewhere used to start playback. It must not.
  await page.mouse.wheel(0, 400);
  await page.locator("body").click({ position: { x: 5, y: 400 } });
  await page.keyboard.press("ArrowDown");
  await page.waitForTimeout(1500);
  await expect(radio).toHaveAttribute("aria-pressed", "false");
});
