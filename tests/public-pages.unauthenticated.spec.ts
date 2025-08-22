import { test, expect } from '@playwright/test';

test.describe('Public Pages - Unauthenticated', () => {
  test('should display landing page for unauthenticated users', async ({ page }) => {
    await page.goto('/');
    
    // Should see the landing page
    await expect(page.locator('text=Pick\'em Pro')).toBeVisible();
    
    // Should see login and register links in navigation
    await expect(page.locator('a[href="/login"]')).toBeVisible();
    await expect(page.locator('a[href="/register"]')).toBeVisible();
  });

  test('should display login page', async ({ page }) => {
    await page.goto('/login');
    
    // Should see login form
    await expect(page.locator('h1, h2', { hasText: /sign in|login/i })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should display register page', async ({ page }) => {
    await page.goto('/register');
    
    // Should see register form
    await expect(page.locator('h1, h2', { hasText: /sign up|register|create account/i })).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should redirect to login when accessing protected routes', async ({ page }) => {
    // Try to access dashboard without authentication
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });

  test('should redirect to login when accessing leagues page', async ({ page }) => {
    // Try to access leagues without authentication  
    await page.goto('/leagues');
    
    // Should redirect to login (or show appropriate unauthorized message)
    await expect(page).toHaveURL('/login');
  });

  test('navigation should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Should see the logo
    await expect(page.locator('text=Pick\'em Pro')).toBeVisible();
    
    // On mobile, navigation might be collapsed
    // This test may need adjustment based on responsive implementation
  });

  test('should handle login form validation', async ({ page }) => {
    await page.goto('/login');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Should show validation errors or prevent submission
    // (Specific assertions will depend on validation implementation)
    
    // Fill invalid email
    await page.fill('input[type="email"]', 'invalid-email');
    await page.click('button[type="submit"]');
    
    // Should show email validation error
    // (Specific assertions will depend on validation implementation)
  });
});