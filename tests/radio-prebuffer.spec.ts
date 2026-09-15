import { expect, test } from "@playwright/test";

/**
 * The radio streams curated audio tracks from public/audio/tracks/.
 * This guards that warming the next track fires as the current track plays.
 */
test("warms the next track while the current one plays", async ({ page }) => {
  const servedUrls = new Set<string>();
  page.on("response", (r) => {
    if (r.url().includes("/audio/tracks/") && r.ok()) {
      servedUrls.add(r.url());
    }
  });

  await page.goto("/", { waitUntil: "domcontentloaded" });

  const play = page.locator('button[aria-label="Play music"]').first();
  await play.waitFor({ state: "visible" });

  // Ensure hydration is complete and click transitions to playing
  await expect(async () => {
    if (await page.locator('button[aria-label="Pause music"]').first().isHidden()) {
      await play.click();
    }
    await expect(page.locator('button[aria-label="Pause music"]').first()).toBeVisible();
  }).toPass({ timeout: 10_000 });

  // One clip served for the track now playing, one for the track queued behind it.
  await expect.poll(() => servedUrls.size, { timeout: 15_000 }).toBeGreaterThanOrEqual(2);
});

test("initializes at 8% volume and enables continuous playback", async ({ page }) => {
  await page.goto("/", { waitUntil: "domcontentloaded" });

  // Volume slider is set to 8% (0.08) low background level
  const volumeSlider = page.locator('input[type="range"][aria-label="Volume"]').first();
  await expect(volumeSlider).toHaveValue("0.08");

  // Player transitions to playing automatically or on initial interaction
  const pauseBtn = page.locator('button[aria-label="Pause music"]').first();
  await expect(async () => {
    if (await pauseBtn.isHidden()) {
      await page.mouse.wheel(0, 50);
      await page.locator("body").click({ position: { x: 100, y: 100 } });
    }
    await expect(pauseBtn).toBeVisible();
  }).toPass({ timeout: 10_000 });
});

