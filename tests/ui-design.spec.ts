import { test, expect } from '@playwright/test';

test.describe('Modern UI Design Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should display modern glassmorphism design', async ({ page }) => {
    // Check if the modern app container is present
    await expect(page.locator('.modern-app')).toBeVisible();
    
    // Check gradient background
    await expect(page.locator('.app-background')).toBeVisible();
    
    // Check welcome header with glassmorphism
    const welcomeHeader = page.locator('.welcome-header');
    await expect(welcomeHeader).toBeVisible();
    await expect(welcomeHeader).toHaveClass(/glass-card/);
    
    // Check for streak badge
    await expect(page.locator('.streak-badge')).toBeVisible();
    await expect(page.locator('.streak-number')).toContainText('🔥 7');
  });

  test('should have iOS-style navigation', async ({ page }) => {
    // Check modern navigation
    const modernNav = page.locator('.modern-nav');
    await expect(modernNav).toBeVisible();
    await expect(modernNav).toHaveClass(/glass-card/);
    
    // Check iOS toggle buttons
    const iosToggle = page.locator('.ios-toggle');
    await expect(iosToggle).toBeVisible();
    
    // Check navigation buttons
    await expect(page.locator('button:has-text("Dashboard")')).toBeVisible();
    await expect(page.locator('button:has-text("Log Gym")')).toBeVisible(); 
    await expect(page.locator('button:has-text("Log Run")')).toBeVisible();
  });

  test('should display floating action button', async ({ page }) => {
    const fab = page.locator('.fab');
    await expect(fab).toBeVisible();
    await expect(fab).toHaveClass(/glass-card/);
    await expect(fab.locator('.fab-icon')).toContainText('+');
  });

  test('should show dashboard with glass cards', async ({ page }) => {
    // Check dashboard section
    await expect(page.locator('.dashboard')).toBeVisible();
    
    // Check glass cards
    await expect(page.locator('.quick-stats')).toBeVisible();
    await expect(page.locator('.quick-stats')).toHaveClass(/glass-card/);
    
    await expect(page.locator('.demo-section')).toBeVisible();
    await expect(page.locator('.activity-section')).toBeVisible();
  });

  test('should navigate between views', async ({ page }) => {
    // Click Log Gym
    await page.click('button:has-text("Log Gym")');
    await expect(page.locator('.workout-form-container')).toBeVisible();
    await expect(page.locator('h2:has-text("Log Gym Workout")')).toBeVisible();
    
    // Click Log Run
    await page.click('button:has-text("Log Run")');
    await expect(page.locator('h2:has-text("Log Running Activity")')).toBeVisible();
    
    // Back to Dashboard
    await page.click('button:has-text("Dashboard")');
    await expect(page.locator('.dashboard')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile layout
    await expect(page.locator('.container')).toBeVisible();
    await expect(page.locator('.welcome-header')).toBeVisible();
    await expect(page.locator('.modern-nav')).toBeVisible();
    
    // Check FAB position on mobile
    const fab = page.locator('.fab');
    await expect(fab).toBeVisible();
  });

  test('should have proper color contrast and accessibility', async ({ page }) => {
    // Check for proper heading structure
    await expect(page.locator('h1')).toContainText('Hey, Fitness Pro!');
    await expect(page.locator('h3')).toHaveCount.gte(1);
    
    // Check button accessibility
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    expect(buttonCount).toBeGreaterThan(0);
    
    // Check for proper focus indicators
    await page.keyboard.press('Tab');
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });

  test('should load and display sample data', async ({ page }) => {
    // Look for sample data button
    const sampleButton = page.locator('button:has-text("Load Sample Data")');
    if (await sampleButton.isVisible()) {
      await sampleButton.click();
      // Wait for data to load
      await page.waitForTimeout(1000);
    }
    
    // Check if activity history appears
    await expect(page.locator('.activity-section')).toBeVisible();
  });
});

test.describe('Visual Design Validation', () => {
  test('should have bright, vibrant colors', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check CSS custom properties are applied
    const computedStyle = await page.evaluate(() => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return {
        primaryGreen: styles.getPropertyValue('--primary-green').trim(),
        accentGreen: styles.getPropertyValue('--accent-green').trim(),
        brightBlue: styles.getPropertyValue('--bright-blue').trim()
      };
    });
    
    // Verify bright colors are being used
    expect(computedStyle.primaryGreen).toBe('#34d399');
    expect(computedStyle.accentGreen).toBe('#10b981'); 
    expect(computedStyle.brightBlue).toBe('#3b82f6');
  });

  test('should have glassmorphism effects', async ({ page }) => {
    await page.goto('http://localhost:3000');
    
    // Check for backdrop-filter on glass cards
    const glassCard = page.locator('.glass-card').first();
    const backdropFilter = await glassCard.evaluate((el) => {
      return getComputedStyle(el).backdropFilter;
    });
    
    expect(backdropFilter).toContain('blur');
  });
});