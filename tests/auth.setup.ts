import { test as setup, expect } from '@playwright/test';
import { Amplify } from 'aws-amplify';
import { signIn } from 'aws-amplify/auth';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load Amplify configuration
const outputs = JSON.parse(readFileSync(join(__dirname, '../amplify_outputs.json'), 'utf-8'));

// Configure Amplify for testing
Amplify.configure(outputs);

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
  // Test credentials provided by user
  const username = 'pelachile@mac.com';
  const password = 'bwc7avr@KJP0vkg!gxv';

  console.log('Starting authentication setup...');

  try {
    // First, try to authenticate via API using Amplify Auth
    console.log('Authenticating with AWS Cognito...');
    const signInResult = await signIn({ username, password });
    
    if (signInResult.isSignedIn) {
      console.log('Successfully authenticated with Cognito');
      
      // Navigate to the app and let Amplify handle the authentication state
      await page.goto('/dashboard');
      
      // Wait for the authentication to be processed by the app
      await page.waitForTimeout(2000);
      
      // Check if we're successfully authenticated by looking for dashboard elements
      // This should redirect to login if not authenticated
      await expect(page).toHaveURL('/dashboard');
      
      // Look for authenticated user elements (these should be present after auth)
      await expect(page.locator('h1')).toContainText('Dashboard');
      
      console.log('Authentication verified on dashboard page');
      
      // Save the authenticated state
      await page.context().storageState({ path: authFile });
      console.log(`Saved authentication state to ${authFile}`);
      
    } else {
      throw new Error('Authentication failed - user not signed in');
    }
    
  } catch (error) {
    console.error('API authentication failed, trying browser login:', error);
    
    // Fallback: Use the browser login form
    await page.goto('/login');
    
    // Fill in the login form
    await page.fill('input[type="email"]', username);
    await page.fill('input[type="password"]', password);
    
    // Click sign in button
    await page.click('button[type="submit"]');
    
    // Wait for navigation to dashboard
    await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
    
    // Verify we're on the dashboard
    await expect(page.locator('h1')).toContainText('Dashboard');
    
    console.log('Browser authentication successful');
    
    // Save the authenticated state
    await page.context().storageState({ path: authFile });
    console.log(`Saved authentication state to ${authFile}`);
  }
});

// Optional: Set up test data or additional configurations
setup('prepare test data', async ({ page }) => {
  // This setup can be used to prepare any test data needed
  // For example, creating test leagues, test picks, etc.
  console.log('Test data preparation completed');
});