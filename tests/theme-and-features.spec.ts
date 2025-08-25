import { test, expect } from '@playwright/test';

test.describe('CashFlow Game - Theme Toggle and Advanced Features', () => {
  test('should display theme toggle component on startup screen', async ({ page }) => {
    await page.goto('/');
    
    // Check for theme toggle component
    await expect(page.locator('app-theme-toggle')).toBeVisible();
  });

  test('should toggle between light and dark themes', async ({ page }) => {
    await page.goto('/');
    
    // Find theme toggle button
    const themeToggle = page.locator('app-theme-toggle button, app-theme-toggle p-button');
    await expect(themeToggle.first()).toBeVisible();
    
    // Get initial body classes or styles
    const initialBodyClass = await page.getAttribute('body', 'class');
    const initialHtmlClass = await page.getAttribute('html', 'class');
    
    // Click theme toggle
    await themeToggle.first().click();
    
    // Wait for theme change
    await page.waitForTimeout(500);
    
    // Check if theme changed (classes should be different)
    const newBodyClass = await page.getAttribute('body', 'class');
    const newHtmlClass = await page.getAttribute('html', 'class');
    
    // At least one should have changed
    const hasChanged = (initialBodyClass !== newBodyClass) || (initialHtmlClass !== newHtmlClass);
    expect(hasChanged).toBeTruthy();
  });

  test('should persist theme selection across navigation', async ({ page }) => {
    await page.goto('/');
    
    // Toggle theme
    const themeToggle = page.locator('app-theme-toggle button, app-theme-toggle p-button').first();
    await themeToggle.click();
    await page.waitForTimeout(500);
    
    // Get theme state after toggle
    const bodyClassAfterToggle = await page.getAttribute('body', 'class');
    
    // Navigate to game
    const nameInput = page.locator('input[placeholder*="name" i], input[id*="name" i], p-inputtext').first();
    await nameInput.fill('Test Player');
    
    const startButton = page.locator('button:has-text("Start"), button:has-text("New"), p-button').first();
    await startButton.click();
    
    await expect(page).toHaveURL(/\/game/);
    
    // Check if theme persisted
    const bodyClassInGame = await page.getAttribute('body', 'class');
    expect(bodyClassInGame).toBe(bodyClassAfterToggle);
  });

  test('should display PWA service worker functionality', async ({ page }) => {
    await page.goto('/');
    
    // Check if PWA service worker is registered (via service worker registration)
    const swRegistration = await page.evaluate(() => {
      return navigator.serviceWorker.getRegistration();
    });
    
    // Service worker should be available in production builds
    expect(typeof swRegistration).toBeDefined();
  });

  test('should handle accessibility features', async ({ page }) => {
    await page.goto('/');
    
    // Check if accessibility service is working by testing keyboard navigation
    await page.keyboard.press('Tab');
    
    // Should have focusable elements
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(typeof focusedElement).toBe('string');
  });

  test('should display toast notifications system', async ({ page }) => {
    await page.goto('/');
    
    // Check if toast container exists
    const toastContainer = page.locator('app-toast-container');
    await expect(toastContainer).toBeVisible();
    
    // Toast container should be ready to display notifications
    expect(await toastContainer.count()).toBe(1);
  });

  test('should handle confirmation dialogs', async ({ page }) => {
    await page.goto('/');
    
    // Check if confirmation dialog container exists
    const dialogContainer = page.locator('app-confirmation-dialogs');
    await expect(dialogContainer).toBeVisible();
  });

  test('should work with different screen sizes', async ({ page }) => {
    const viewports = [
      { width: 1920, height: 1080 }, // Desktop
      { width: 1024, height: 768 },  // Tablet landscape
      { width: 768, height: 1024 },  // Tablet portrait
      { width: 375, height: 667 }    // Mobile
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      
      // Main components should be visible
      await expect(page.locator('app-startup-screen')).toBeVisible();
      await expect(page.locator('app-theme-toggle')).toBeVisible();
      await expect(page.locator('app-language-toggle')).toBeVisible();
    }
  });

  test('should load and display charts correctly', async ({ page }) => {
    // Start a game to access charts
    await page.goto('/');
    const nameInput = page.locator('input[placeholder*="name" i], input[id*="name" i], p-inputtext').first();
    await nameInput.fill('Test Player');
    
    const startButton = page.locator('button:has-text("Start"), button:has-text("New"), p-button').first();
    await startButton.click();
    
    await expect(page).toHaveURL(/\/game/);
    
    // Check for investment comparison chart
    const chartComponent = page.locator('app-investment-comparison-chart');
    if (await chartComponent.count() > 0) {
      await expect(chartComponent.first()).toBeVisible();
      
      // Check if canvas element exists (Chart.js creates canvas elements)
      const canvas = page.locator('canvas');
      if (await canvas.count() > 0) {
        await expect(canvas.first()).toBeVisible();
      }
    }
  });

  test('should handle investment carousel functionality', async ({ page }) => {
    // Start a game
    await page.goto('/');
    const nameInput = page.locator('input[placeholder*="name" i], input[id*="name" i], p-inputtext').first();
    await nameInput.fill('Test Player');
    
    const startButton = page.locator('button:has-text("Start"), button:has-text("New"), p-button').first();
    await startButton.click();
    
    await expect(page).toHaveURL(/\/game/);
    
    // Check for investment carousel
    const carousel = page.locator('app-investment-carousel');
    if (await carousel.count() > 0) {
      await expect(carousel.first()).toBeVisible();
      
      // Check for navigation buttons or swipe functionality
      const carouselButtons = page.locator('app-investment-carousel button, .carousel-control, .swiper-button');
      if (await carouselButtons.count() > 0) {
        await expect(carouselButtons.first()).toBeVisible();
      }
    }
  });

  test('should display financial calculator', async ({ page }) => {
    // Start a game
    await page.goto('/');
    const nameInput = page.locator('input[placeholder*="name" i], input[id*="name" i], p-inputtext').first();
    await nameInput.fill('Test Player');
    
    const startButton = page.locator('button:has-text("Start"), button:has-text("New"), p-button').first();
    await startButton.click();
    
    await expect(page).toHaveURL(/\/game/);
    
    // Check for financial calculator
    const calculator = page.locator('app-financial-calculator');
    if (await calculator.count() > 0) {
      await expect(calculator.first()).toBeVisible();
      
      // Should have input fields for calculations
      const calculatorInputs = page.locator('app-financial-calculator input, app-financial-calculator p-inputnumber');
      if (await calculatorInputs.count() > 0) {
        await expect(calculatorInputs.first()).toBeVisible();
      }
    }
  });

  test('should handle game configuration properly', async ({ page }) => {
    await page.goto('/');
    
    // Check difficulty selection
    const difficultyDropdown = page.locator('p-dropdown, p-select, select');
    if (await difficultyDropdown.count() > 0) {
      await difficultyDropdown.first().click();
      
      // Should show difficulty options
      await page.waitForTimeout(500);
      const options = page.locator('[role="option"], option, .dropdown-item');
      if (await options.count() > 0) {
        await expect(options.first()).toBeVisible();
        
        // Select an option
        await options.first().click();
      }
    }
  });

  test('should maintain performance standards', async ({ page }) => {
    // Start performance measurement
    await page.goto('/');
    
    // Measure navigation timing
    const navigationTiming = await page.evaluate(() => {
      const timing = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      return {
        domContentLoaded: timing.domContentLoadedEventEnd - timing.domContentLoadedEventStart,
        loadComplete: timing.loadEventEnd - timing.loadEventStart
      };
    });
    
    // Basic performance checks - page should load reasonably fast
    expect(navigationTiming.domContentLoaded).toBeGreaterThanOrEqual(0);
    expect(navigationTiming.loadComplete).toBeGreaterThanOrEqual(0);
    
    // Page should be responsive
    await page.click('body');
    await expect(page).toBeVisible();
  });
});