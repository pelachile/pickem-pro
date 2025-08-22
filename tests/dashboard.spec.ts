import { test, expect } from '@playwright/test';

test.describe('Dashboard - Authenticated User', () => {
  test('should display dashboard with authenticated user elements', async ({ page }) => {
    // Navigate to dashboard - should work because we're authenticated
    await page.goto('/dashboard');
    
    // Should not redirect to login
    await expect(page).toHaveURL('/dashboard');
    
    // Should see dashboard title
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    // Should see authenticated navigation elements
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    
    // Should see league action buttons (they are links styled as buttons)
    await expect(page.locator('a[href="/create-league"]')).toBeVisible();
    await expect(page.locator('a[href="/join-league"]')).toBeVisible();
  });

  test('should access leagues page successfully', async ({ page }) => {
    // Navigate to leagues page
    await page.goto('/leagues');
    
    // Should display leagues page
    await expect(page.locator('h1')).toContainText('My Leagues');
    
    // Should see league management interface
    await expect(page.locator('a[href="/create-league"]')).toBeVisible();
    await expect(page.locator('a[href="/join-league"]')).toBeVisible();
  });

  test('should navigate to create league page from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click create league link
    await page.click('a[href="/create-league"]');
    
    // Should navigate to create league page
    await expect(page).toHaveURL('/create-league');
    
    // Should see create league form
    await expect(page.locator('h1', { hasText: 'Create Your League' })).toBeVisible();
    
    // Should see form fields
    await expect(page.locator('input[placeholder*="My Awesome League"]')).toBeVisible();
    await expect(page.locator('select')).toBeVisible();
  });

  test('should navigate to join league page from dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Click join league link  
    await page.click('a[href="/join-league"]');
    
    // Should navigate to join league page
    await expect(page).toHaveURL('/join-league');
    
    // Should see join league form
    await expect(page.locator('h1', { hasText: 'Join a League' })).toBeVisible();
    
    // Should see form sections
    await expect(page.locator('text=Join with Invitation Code')).toBeVisible();
    await expect(page.locator('text=Browse Public Leagues')).toBeVisible();
  });

  test('should display game schedule with real NFL data', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Should see game schedule section
    await expect(page.locator('text=NFL Schedule')).toBeVisible();
    
    // Should see current week context (e.g., "2025 NFL Preseason - Week 3")
    await expect(page.locator('text=2025 NFL')).toBeVisible();
    
    // Should see week selector buttons
    await expect(page.locator('button', { hasText: 'Current Week' })).toBeVisible();
    
    // Game cards should be visible (if there are games for current week)
    const gameCards = page.locator('[class*="game"], [class*="Game"]').first();
    
    // Wait a bit for data to load
    await page.waitForTimeout(2000);
    
    // Check if games are displayed or no games message
    const hasGames = await gameCards.isVisible().catch(() => false);
    const noGamesMessage = await page.locator('text=No Games').isVisible().catch(() => false);
    
    // Should have either games or a no games message
    expect(hasGames || noGamesMessage).toBeTruthy();
  });

  test('responsive navigation should work on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/dashboard');
    
    // On mobile, should see hamburger menu
    const hamburgerMenu = page.locator('button[aria-label*="menu"], button svg');
    await expect(hamburgerMenu.first()).toBeVisible();
    
    // Desktop navigation should be hidden
    const desktopNav = page.locator('.hidden.md\\:flex');
    await expect(desktopNav).not.toBeVisible();
  });
});

test.describe('Navigation - Authenticated State', () => {
  test('should show authenticated navigation in header', async ({ page }) => {
    await page.goto('/');
    
    // Should NOT show login/register links when authenticated
    await expect(page.locator('a[href="/login"]')).not.toBeVisible();
    await expect(page.locator('a[href="/register"]')).not.toBeVisible();
    
    // Should show authenticated user navigation
    // (This test may need adjustment based on final navbar implementation)
  });
});