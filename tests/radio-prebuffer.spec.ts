import { expect, test } from "@playwright/test";

/**
 * The radio streams curated audio tracks from public/audio/tracks/.
 * This guards that warming the next track fires as the current track plays.
 */
test("warms the next track while the current one plays", async ({ page }) => {
  const reqUrls = new Set<string>();
  page.on("request", (r) => {
    if (r.url().includes("/audio/tracks/")) {
      reqUrls.add(r.url());
    }
  });

  await page.goto("/");

  const play = page.locator('button[aria-label="Play music"]').first();
  await play.waitFor({ state: "visible" });

  // Ensure hydration is complete and click transitions to playing
  await expect(async () => {
    if (await page.locator('button[aria-label="Pause music"]').first().isHidden()) {
      await play.click();
    }
    await expect(page.locator('button[aria-label="Pause music"]').first()).toBeVisible();
  }).toPass({ timeout: 10_000 });

  // One fetch for the track now playing, one for the track queued behind it.
  await expect.poll(() => reqUrls.size, { timeout: 15_000 }).toBeGreaterThanOrEqual(2);
});
