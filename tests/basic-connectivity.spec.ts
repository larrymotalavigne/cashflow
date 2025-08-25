import { test, expect } from '@playwright/test';

test.describe('Basic Connectivity Test', () => {
  test('should be able to navigate to a simple page', async ({ page }) => {
    // Navigate to a simple external page to test basic Playwright functionality
    await page.goto('https://example.com');
    
    // Check if the page loads and has expected content
    await expect(page).toHaveTitle(/Example Domain/);
    
    // Check for basic elements
    await expect(page.locator('h1')).toContainText('Example Domain');
    await expect(page.locator('p')).toBeVisible();
  });

  test('should be able to interact with page elements', async ({ page }) => {
    await page.goto('https://example.com');
    
    // Test basic interaction capabilities
    const mainHeading = page.locator('h1');
    await expect(mainHeading).toBeVisible();
    
    // Test text content verification
    const textContent = await mainHeading.textContent();
    expect(textContent).toBeTruthy();
    expect(textContent?.length).toBeGreaterThan(0);
  });
});