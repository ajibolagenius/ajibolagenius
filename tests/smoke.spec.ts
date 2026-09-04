import { test, expect } from "@playwright/test";

test.describe("Public Routes Smoke Tests", () => {
  test("homepage renders with heading and skip-to-content target", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Ajibola/);

    // Skip-to-content accessibility check
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toBeAttached();
    await expect(skipLink).toHaveText("Skip to content");

    const main = page.locator("#main-content");
    await expect(main).toBeVisible();
  });

  test("projects listing page loads", async ({ page }) => {
    await page.goto("/projects");
    const main = page.locator("#main-content");
    await expect(main).toBeVisible();
    await expect(main.locator("h1")).toContainText("Projects");
  });

  test("notes listing page loads", async ({ page }) => {
    await page.goto("/notes");
    const main = page.locator("#main-content");
    await expect(main).toBeVisible();
    await expect(main.locator("h1")).toContainText("Notes & Writing");
  });

  test("sandbox page loads", async ({ page }) => {
    await page.goto("/sandbox");
    const main = page.locator("#main-content");
    await expect(main).toBeVisible();
    await expect(main.locator("h1")).toContainText("Sandbox");
  });

  test("cv printable page loads", async ({ page }) => {
    await page.goto("/cv");
    await expect(page.locator("#main-content")).toBeVisible();
  });

  test("licenses page loads", async ({ page }) => {
    await page.goto("/licenses");
    const main = page.locator("#main-content");
    await expect(main).toBeVisible();
    await expect(main.locator("h1")).toContainText("Licenses");
  });
});

test.describe("Admin Auth Gate Smoke Tests", () => {
  test("unauthenticated access to /admin redirects to /admin/login", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.locator("h1")).toContainText("Admin sign in");
  });

  test("unauthenticated access to /admin/manage/skills redirects to /admin/login", async ({ page }) => {
    await page.goto("/admin/manage/skills");
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

test.describe("Contact Form Validation Smoke Tests", () => {
  test("contact form fields are present with HTML5 validation constraints", async ({ page }) => {
    await page.goto("/");

    const form = page.locator("form").filter({ hasText: "Send Message" });
    await expect(form).toBeVisible();

    const nameInput = form.locator('input[name="name"]');
    const emailInput = form.locator('input[name="email"]');
    const messageInput = form.locator('textarea[name="message"]');

    await expect(nameInput).toBeVisible();
    await expect(nameInput).toHaveAttribute("required", "");

    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute("required", "");
    await expect(emailInput).toHaveAttribute("type", "email");

    await expect(messageInput).toBeVisible();
    await expect(messageInput).toHaveAttribute("required", "");
  });
});
