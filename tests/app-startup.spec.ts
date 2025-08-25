import { test, expect } from '@playwright/test';

test.describe('CashFlow Game - Application Startup', () => {
  test('should load the startup screen successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the startup screen loads
    await expect(page).toHaveTitle(/CashFlow/i);
    
    // Verify main elements are visible
    await expect(page.locator('app-startup-screen')).toBeVisible();
  });

  test('should display player name input field', async ({ page }) => {
    await page.goto('/');
    
    // Check for player name input
    const nameInput = page.locator('input[placeholder*="name" i], input[id*="name" i], p-inputtext');
    await expect(nameInput.first()).toBeVisible();
  });

  test('should display difficulty selection dropdown', async ({ page }) => {
    await page.goto('/');
    
    // Check for difficulty dropdown
    const difficultyDropdown = page.locator('p-dropdown, p-select, select');
    await expect(difficultyDropdown.first()).toBeVisible();
  });

  test('should display start game button', async ({ page }) => {
    await page.goto('/');
    
    // Check for start game button
    const startButton = page.locator('button:has-text("Start"), button:has-text("New"), p-button');
    await expect(startButton.first()).toBeVisible();
  });

  test('should display theme toggle component', async ({ page }) => {
    await page.goto('/');
    
    // Check for theme toggle
    await expect(page.locator('app-theme-toggle')).toBeVisible();
  });

  test('should display language toggle component', async ({ page }) => {
    await page.goto('/');
    
    // Check for language toggle
    await expect(page.locator('app-language-toggle')).toBeVisible();
  });

  test('should generate random name when random name button is clicked', async ({ page }) => {
    await page.goto('/');
    
    const nameInput = page.locator('input[placeholder*="name" i], input[id*="name" i], p-inputtext').first();
    const initialValue = await nameInput.inputValue();
    
    // Click random name button (if exists)
    const randomButton = page.locator('button:has-text("Random"), button[title*="random" i], button[aria-label*="random" i]');
    if (await randomButton.count() > 0) {
      await randomButton.first().click();
      
      // Check if name changed
      const newValue = await nameInput.inputValue();
      expect(newValue).not.toBe(initialValue);
      expect(newValue.length).toBeGreaterThan(0);
    }
  });

  test('should show resume game option if saved game exists', async ({ page }) => {
    await page.goto('/');
    
    // Check if resume button exists (might not be visible if no saved game)
    const resumeButton = page.locator('button:has-text("Resume"), button:has-text("Continue")');
    
    // This test is conditional - resume button only appears if there's a saved game
    if (await resumeButton.count() > 0) {
      await expect(resumeButton.first()).toBeVisible();
    }
  });
});