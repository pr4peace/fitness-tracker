const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function inspectSetsUI() {
  console.log('Starting Sets UI inspection...');
  
  // Create screenshots directory
  const screenshotsDir = path.join(__dirname, 'screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
  }

  // Launch browser
  const browser = await chromium.launch({ 
    headless: false, // Show browser for visual inspection
    slowMo: 1000 // Slow down for better visibility
  });
  
  const context = await browser.newContext({
    viewport: { width: 1200, height: 800 }
  });
  
  const page = await context.newPage();

  try {
    console.log('1. Navigating to fitness tracker app...');
    await page.goto('http://localhost:3000');
    
    // Wait for the page to load
    await page.waitForTimeout(3000);
    
    // Take initial screenshot
    await page.screenshot({ 
      path: path.join(screenshotsDir, '01-initial-page.png'),
      fullPage: true 
    });
    
    console.log('2. Looking for "Log Gym" tab...');
    
    // Try to find and click the "Log Gym" tab
    try {
      const gymTab = page.locator('text="Log Gym"').first();
      if (await gymTab.isVisible()) {
        console.log('Found "Log Gym" tab, clicking...');
        await gymTab.click();
        await page.waitForTimeout(2000);
        
        await page.screenshot({ 
          path: path.join(screenshotsDir, '02-gym-tab-clicked.png'),
          fullPage: true 
        });
      }
    } catch (e) {
      console.log('Could not find "Log Gym" tab. Continuing with current page...');
      await page.screenshot({ 
        path: path.join(screenshotsDir, '02-no-gym-tab-found.png'),
        fullPage: true 
      });
    }

    console.log('3. Looking for exercise forms and inputs...');
    
    // Look for any button with "add" in the text
    try {
      const addButton = page.locator('button').filter({ hasText: /add/i }).first();
      if (await addButton.isVisible()) {
        console.log('Found add button, clicking...');
        await addButton.click();
        await page.waitForTimeout(2000);
        
        await page.screenshot({ 
          path: path.join(screenshotsDir, '03-add-button-clicked.png'),
          fullPage: true 
        });
      }
    } catch (e) {
      console.log('No add button found');
    }
    
    // Try to find text input for exercise name
    try {
      const exerciseInput = page.locator('input[type="text"]').first();
      if (await exerciseInput.isVisible()) {
        console.log('Found text input, adding exercise name...');
        await exerciseInput.fill('Bench Press');
        await page.waitForTimeout(1000);
        
        // Look for submit/save button
        const saveButton = page.locator('button').filter({ hasText: /save|submit|add/i }).first();
        if (await saveButton.isVisible()) {
          await saveButton.click();
          await page.waitForTimeout(2000);
        }
        
        await page.screenshot({ 
          path: path.join(screenshotsDir, '04-exercise-added.png'),
          fullPage: true 
        });
      }
    } catch (e) {
      console.log('Could not add exercise');
    }

    console.log('4. Looking for sets interface...');
    
    // Look for number inputs (likely weight/reps)
    const numberInputs = await page.locator('input[type="number"]').all();
    console.log(`Found ${numberInputs.length} number inputs`);
    
    if (numberInputs.length > 0) {
      console.log('Found sets inputs, taking focused screenshot...');
      
      await page.screenshot({ 
        path: path.join(screenshotsDir, '05-sets-interface.png'),
        fullPage: true 
      });
      
      // Try to fill some sample data
      try {
        if (numberInputs.length >= 2) {
          await numberInputs[0].fill('135'); // Weight
          await numberInputs[1].fill('8');   // Reps
          console.log('Filled sample set data');
          await page.waitForTimeout(1000);
          
          await page.screenshot({ 
            path: path.join(screenshotsDir, '06-sets-with-data.png'),
            fullPage: true 
          });
        }
      } catch (e) {
        console.log('Could not fill set data:', e.message);
      }
    }
    
    // Look for any table elements
    const tables = await page.locator('table, .table, [role="table"]').all();
    console.log(`Found ${tables.length} table-like elements`);
    
    if (tables.length > 0) {
      await page.screenshot({ 
        path: path.join(screenshotsDir, '07-tables-found.png'),
        fullPage: true 
      });
    }

    console.log('5. Testing responsive design...');
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: path.join(screenshotsDir, '08-mobile-view.png'),
      fullPage: true 
    });

    // Test tablet view  
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: path.join(screenshotsDir, '09-tablet-view.png'),
      fullPage: true 
    });

    console.log('6. Screenshots complete! Saved to ./screenshots/');

  } catch (error) {
    console.error('Error during inspection:', error);
    await page.screenshot({ 
      path: path.join(screenshotsDir, 'error-screenshot.png'),
      fullPage: true 
    });
  } finally {
    await browser.close();
  }
}

inspectSetsUI().catch(console.error);