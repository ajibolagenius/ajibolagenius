// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Public site', () => {
  test('home page loads and shows hero', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByText('Design & Engineering', { exact: false })).toBeVisible();
  });

  test('writing page loads', async ({ page }) => {
    await page.goto('/writing');
    await expect(page.getByRole('heading', { name: /Blog & Thoughts/i })).toBeVisible();
  });

  test('teach page loads and shows courses section', async ({ page }) => {
    await page.goto('/teach');
    await expect(page.getByText(/Courses|Mentorship/i)).toBeVisible();
  });

  test('contact form exists and can be filled', async ({ page }) => {
    await page.goto('/contact');
    await expect(page.getByRole('form', { name: 'Contact form' })).toBeVisible();
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Subject').fill('E2E test');
    await page.getByLabel('Message').fill('Hello from Playwright.');
    await expect(page.getByRole('button', { name: /Send Message/i })).toBeEnabled();
  });

  test('contact form submit shows success or error message', async ({ page }) => {
    await page.goto('/contact');
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Subject').fill('E2E test');
    await page.getByLabel('Message').fill('Hello from Playwright.');
    await page.getByRole('button', { name: /Send Message/i }).click();
    await expect(page.getByRole('status')).toBeVisible({ timeout: 10000 });
    const status = page.getByRole('status');
    await expect(status).toContainText(/Message received|Something went wrong|error/i);
  });

  test('newsletter signup on writing page shows feedback', async ({ page }) => {
    await page.goto('/writing');
    await page.getByPlaceholder('your@email.com').fill('e2e-test@example.com');
    await page.getByRole('button', { name: 'Subscribe' }).click();
    await expect(page.getByRole('status').filter({ hasText: /Subscribed|already subscribed|Something went wrong/i })).toBeVisible({ timeout: 10000 });
  });
});
