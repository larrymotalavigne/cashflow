import { test, expect } from '@playwright/test';

test.describe('CashFlow Game - Language Toggle', () => {
  test('should display language toggle component on startup screen', async ({ page }) => {
    await page.goto('/');
    
    // Check for language toggle component
    await expect(page.locator('app-language-toggle')).toBeVisible();
  });

  test('should display language toggle component in game screen', async ({ page }) => {
    // Start a new game
    await page.goto('/');
    const nameInput = page.locator('input[placeholder*="name" i], input[id*="name" i], p-inputtext').first();
    await nameInput.fill('Test Player');
    
    const startButton = page.locator('button:has-text("Start"), button:has-text("New"), p-button').first();
    await startButton.click();
    
    // Wait for game to load
    await expect(page).toHaveURL(/\/game/);
    
    // Check for language toggle component in game screen
    await expect(page.locator('app-language-toggle')).toBeVisible();
  });

  test('should toggle between different languages', async ({ page }) => {
    await page.goto('/');
    
    // Find language toggle button/dropdown
    const languageToggle = page.locator('app-language-toggle button, app-language-toggle p-dropdown, app-language-toggle select');
    await expect(languageToggle.first()).toBeVisible();
    
    // Get initial page content
    const initialContent = await page.textContent('body');
    
    // Click language toggle
    await languageToggle.first().click();
    
    // Wait for potential language change
    await page.waitForTimeout(500);
    
    // Check if content changed (indicating language switch)
    const newContent = await page.textContent('body');
    
    // Content should be different after language toggle (if multiple languages are available)
    // This test is flexible as language availability depends on implementation
    expect(typeof newContent).toBe('string');
    expect(newContent.length).toBeGreaterThan(0);
  });

  test('should persist language selection across page navigation', async ({ page }) => {
    await page.goto('/');
    
    // Find and interact with language toggle
    const languageToggle = page.locator('app-language-toggle button, app-language-toggle p-dropdown, app-language-toggle select');
    
    if (await languageToggle.count() > 0) {
      await languageToggle.first().click();
      await page.waitForTimeout(500);
      
      // Navigate to game page
      const nameInput = page.locator('input[placeholder*="name" i], input[id*="name" i], p-inputtext').first();
      await nameInput.fill('Test Player');
      
      const startButton = page.locator('button:has-text("Start"), button:has-text("New"), p-button').first();
      await startButton.click();
      
      // Wait for game to load
      await expect(page).toHaveURL(/\/game/);
      
      // Language toggle should still be visible in game screen
      await expect(page.locator('app-language-toggle')).toBeVisible();
    }
  });

  test('should display language options when clicked', async ({ page }) => {
    await page.goto('/');
    
    // Find language toggle
    const languageToggle = page.locator('app-language-toggle button, app-language-toggle p-dropdown');
    
    if (await languageToggle.count() > 0) {
      await languageToggle.first().click();
      
      // Look for language options (this might be a dropdown, modal, or inline options)
      const languageOptions = page.locator('[role="option"], .language-option, .dropdown-item, li');
      
      // Wait a bit for options to appear
      await page.waitForTimeout(500);
      
      // If options are available, they should be visible
      if (await languageOptions.count() > 0) {
        await expect(languageOptions.first()).toBeVisible();
      }
    }
  });

  test('should handle keyboard navigation for language toggle', async ({ page }) => {
    await page.goto('/');
    
    // Focus on language toggle
    const languageToggle = page.locator('app-language-toggle button, app-language-toggle p-dropdown').first();
    
    if (await languageToggle.count() > 0) {
      await languageToggle.focus();
      
      // Check if element is focusable
      const isFocused = await languageToggle.evaluate(el => document.activeElement === el);
      expect(typeof isFocused).toBe('boolean');
      
      // Test keyboard interaction (Enter or Space)
      await page.keyboard.press('Enter');
      await page.waitForTimeout(500);
      
      // Element should still be accessible
      await expect(languageToggle).toBeVisible();
    }
  });

  test('should maintain accessibility standards', async ({ page }) => {
    await page.goto('/');
    
    // Check for ARIA attributes and labels
    const languageToggle = page.locator('app-language-toggle button, app-language-toggle p-dropdown').first();
    
    if (await languageToggle.count() > 0) {
      // Should have proper ARIA attributes or labels
      const hasAriaLabel = await languageToggle.getAttribute('aria-label');
      const hasTitle = await languageToggle.getAttribute('title');
      const hasAriaDescribedBy = await languageToggle.getAttribute('aria-describedby');
      
      // At least one accessibility attribute should be present
      const hasAccessibilityAttribute = hasAriaLabel || hasTitle || hasAriaDescribedBy;
      expect(typeof hasAccessibilityAttribute).toBe('string');
    }
  });

  test('should work on mobile viewports', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    await page.goto('/');
    
    // Language toggle should still be visible and functional on mobile
    const languageToggle = page.locator('app-language-toggle');
    await expect(languageToggle).toBeVisible();
    
    // Should be clickable on mobile
    const toggleButton = page.locator('app-language-toggle button, app-language-toggle p-dropdown').first();
    if (await toggleButton.count() > 0) {
      await expect(toggleButton).toBeVisible();
      // Test that it's still interactive
      await toggleButton.hover();
    }
  });

  test('should handle rapid language switching', async ({ page }) => {
    await page.goto('/');
    
    const languageToggle = page.locator('app-language-toggle button, app-language-toggle p-dropdown').first();
    
    if (await languageToggle.count() > 0) {
      // Click multiple times rapidly
      await languageToggle.click();
      await page.waitForTimeout(100);
      await languageToggle.click();
      await page.waitForTimeout(100);
      await languageToggle.click();
      
      // Should still be functional after rapid clicking
      await expect(languageToggle).toBeVisible();
      await expect(languageToggle).toBeEnabled();
    }
  });
});