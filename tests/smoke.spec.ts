import { expect, test } from '@playwright/test';

test('redirects anonymous user to login from root', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/login/);
  await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
});

test('login page has authentication controls', async ({ page }) => {
  await page.goto('/login');
  await expect(page.getByPlaceholder(/you@example.com/i)).toBeVisible();
  await expect(page.getByPlaceholder(/••••••••/i)).toBeVisible();
  await expect(page.getByRole('button', { name: /log in/i })).toBeVisible();
});

test('can login with demo credentials', async ({ page }) => {
  await page.goto('/login');
  await page.getByPlaceholder(/you@example.com/i).fill('demo@ventovault.com');
  await page.getByPlaceholder(/••••••••/i).fill('demo123');
  await page.getByRole('button', { name: /^log in$/i }).click();
  await expect(page).toHaveURL(/\/dashboard/);
});
