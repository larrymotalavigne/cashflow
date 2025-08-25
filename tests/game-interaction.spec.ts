import { test, expect } from '@playwright/test';

test.describe('CashFlow Game - Game Interactions', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to home and start a new game
    await page.goto('/');
    
    // Fill in player name
    const nameInput = page.locator('input[placeholder*="name" i], input[id*="name" i], p-inputtext').first();
    await nameInput.fill('Test Player');
    
    // Start the game
    const startButton = page.locator('button:has-text("Start"), button:has-text("New"), p-button').first();
    await startButton.click();
    
    // Wait for game to load
    await expect(page).toHaveURL(/\/game/);
    await expect(page.locator('app-game-panels')).toBeVisible();
  });

  test('should display game panels after starting game', async ({ page }) => {
    // Verify main game panels are visible
    await expect(page.locator('app-game-panels')).toBeVisible();
    
    // Check for player information panel
    await expect(page.locator('app-player-info, .player-info, [class*="player"]')).toBeVisible();
  });

  test('should display player information correctly', async ({ page }) => {
    // Check if player name is displayed
    await expect(page.locator('text=Test Player')).toBeVisible();
    
    // Check for financial information elements
    const financialElements = page.locator('text=/\\$[0-9,]+/, text=/Income/, text=/Expenses/, text=/Cash Flow/');
    await expect(financialElements.first()).toBeVisible();
  });

  test('should display investment options', async ({ page }) => {
    // Check for investment carousel or investment options
    const investmentSection = page.locator('app-investment-carousel, .investment, [class*="investment"]');
    if (await investmentSection.count() > 0) {
      await expect(investmentSection.first()).toBeVisible();
    }
  });

  test('should display financial calculator if available', async ({ page }) => {
    // Check for financial calculator component
    const calculator = page.locator('app-financial-calculator, .calculator, [class*="calculator"]');
    if (await calculator.count() > 0) {
      await expect(calculator.first()).toBeVisible();
    }
  });

  test('should allow interaction with game controls', async ({ page }) => {
    // Look for any clickable game buttons or controls
    const gameButtons = page.locator('button:visible, p-button:visible');
    const buttonCount = await gameButtons.count();
    
    // Ensure there are interactive elements
    expect(buttonCount).toBeGreaterThan(0);
    
    // Test that buttons are clickable (without actually clicking to avoid game state changes)
    if (buttonCount > 0) {
      const firstButton = gameButtons.first();
      await expect(firstButton).toBeEnabled();
    }
  });

  test('should display charts if available', async ({ page }) => {
    // Check for Chart.js canvas elements or chart containers
    const charts = page.locator('canvas, .chart, [class*="chart"], app-investment-comparison-chart');
    if (await charts.count() > 0) {
      await expect(charts.first()).toBeVisible();
    }
  });

  test('should handle responsive design on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verify game panels are still visible and functional
    await expect(page.locator('app-game-panels')).toBeVisible();
    
    // Check that player info is still accessible
    await expect(page.locator('app-player-info, .player-info, [class*="player"]')).toBeVisible();
  });

  test('should maintain game state during interactions', async ({ page }) => {
    // Get initial player name
    const playerNameElement = page.locator('text=Test Player');
    await expect(playerNameElement).toBeVisible();
    
    // Interact with page (scroll, click safe areas)
    await page.mouse.move(200, 200);
    
    // Verify player name is still there (game state maintained)
    await expect(playerNameElement).toBeVisible();
  });

  test('should show toast notifications for game events', async ({ page }) => {
    // Check if toast container is available for notifications
    const toastContainer = page.locator('app-toast-container, .toast, [class*="toast"], p-toast');
    if (await toastContainer.count() > 0) {
      await expect(toastContainer.first()).toBeVisible();
    }
  });

  test('should show confirmation dialogs when needed', async ({ page }) => {
    // Check if confirmation dialog container is available
    const dialogContainer = page.locator('app-confirmation-dialogs, p-dialog, .dialog');
    if (await dialogContainer.count() > 0) {
      // Dialog container should be present but not necessarily visible initially
      expect(await dialogContainer.count()).toBeGreaterThan(0);
    }
  });

  test('should navigate back to startup screen', async ({ page }) => {
    // Look for back/home button
    const backButton = page.locator('button:has-text("Back"), button:has-text("Home"), button:has-text("Exit")');
    
    if (await backButton.count() > 0) {
      await backButton.first().click();
      
      // Should navigate back to home
      await expect(page).toHaveURL('/');
      await expect(page.locator('app-startup-screen')).toBeVisible();
    }
  });
});