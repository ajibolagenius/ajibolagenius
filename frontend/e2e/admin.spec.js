// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Admin', () => {
  test('unauthenticated user is redirected to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.getByText('Admin').first()).toBeVisible();
  });

  test('login page has email and password fields', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign in|Log in/i })).toBeVisible();
  });

  test('invalid login shows error', async ({ page }) => {
    await page.goto('/admin/login');
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: /Sign in|Log in/i }).click();
    await expect(page.getByText(/Invalid|error|incorrect/i)).toBeVisible({ timeout: 8000 });
  });
});
