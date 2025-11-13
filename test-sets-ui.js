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
    const gymTab = await page.locator('text="Log Gym"').first();
    if (await gymTab.isVisible()) {
      console.log('Found "Log Gym" tab, clicking...');
      await gymTab.click();
      await page.waitForTimeout(2000);
      
      await page.screenshot({ 
        path: path.join(screenshotsDir, '02-gym-tab-clicked.png'),
        fullPage: true 
      });
    } else {
      console.log('Could not find "Log Gym" tab. Taking screenshot of available options...');
      await page.screenshot({ 
        path: path.join(screenshotsDir, '02-no-gym-tab-found.png'),
        fullPage: true 
      });
      
      // Try to find any tab-like elements
      const tabElements = await page.locator('button, a, [role="tab"]').all();
      console.log(`Found ${tabElements.length} potential tab elements`);
      
      for (let i = 0; i < Math.min(tabElements.length, 5); i++) {
        const text = await tabElements[i].textContent();
        console.log(`Tab ${i}: "${text}"`);
      }
    }

    console.log('3. Looking for exercise addition functionality...');
    
    // Look for ways to add an exercise
    const addButtons = await page.locator('text=/Add.*Exercise/i').or(page.locator('text=/\\+ Exercise/i')).or(page.locator('button:has-text("Add")')).all();
    console.log(`Found ${addButtons.length} potential add exercise buttons`);
    
    if (addButtons.length > 0) {
      console.log('Clicking first add exercise button...');
      await addButtons[0].click();
      await page.waitForTimeout(2000);
      
      await page.screenshot({ 
        path: path.join(screenshotsDir, '03-add-exercise-clicked.png'),
        fullPage: true 
      });
      
      // Look for exercise name input or selection
      const exerciseInputs = await page.locator('input[type="text"], select, input[placeholder*="exercise" i]').all();
      console.log(`Found ${exerciseInputs.length} potential exercise input fields`);
      
      if (exerciseInputs.length > 0) {
        // Try to add an exercise
        const firstInput = exerciseInputs[0];
        const tagName = await firstInput.evaluate(el => el.tagName.toLowerCase());
        
        if (tagName === 'select') {
          // If it's a select dropdown
          const options = await firstInput.locator('option').all();
          if (options.length > 1) {
            await firstInput.selectOption({ index: 1 }); // Select first non-empty option
            console.log('Selected exercise from dropdown');
          }
        } else if (tagName === 'input') {
          // If it's a text input
          await firstInput.fill('Bench Press');
          console.log('Filled exercise name: Bench Press');
        }
        
        await page.waitForTimeout(2000);
        
        // Look for confirm/submit buttons
        const confirmButtons = await page.locator('button:has-text("Add"), button:has-text("Save"), button:has-text("Confirm")').all();
        if (confirmButtons.length > 0) {
          await confirmButtons[0].click();
          console.log('Clicked confirmation button');
          await page.waitForTimeout(2000);
        }
        
        await page.screenshot({ 
          path: path.join(screenshotsDir, '04-exercise-added.png'),
          fullPage: true 
        });
      }
    } else {
      console.log('No add exercise buttons found. Looking for existing exercises or forms...');
      
      // Look for any form elements that might be the gym form
      const forms = await page.locator('form').all();
      console.log(`Found ${forms.length} forms on the page`);
      
      if (forms.length > 0) {
        await page.screenshot({ 
          path: path.join(screenshotsDir, '03-forms-found.png'),
          fullPage: true 
        });
      }
    }

    console.log('4. Looking for sets table/interface...');
    
    // Look for sets-related elements
    const setsElements = await page.locator('text=/set/i, .set, [class*="set"], table').all();
    console.log(`Found ${setsElements.length} potential sets-related elements`);
    
    if (setsElements.length > 0) {
      await page.screenshot({ 
        path: path.join(screenshotsDir, '05-sets-interface-found.png'),
        fullPage: true 
      });
      
      // Look for input fields in sets area
      const setInputs = await page.locator('input[type="number"], input[placeholder*="weight"], input[placeholder*="rep"], input[placeholder*="set"]').all();
      console.log(`Found ${setInputs.length} potential set input fields`);
      
      if (setInputs.length > 0) {
        // Take focused screenshot on sets area
        const firstSetInput = setInputs[0];
        await firstSetInput.scrollIntoViewIfNeeded();
        
        const boundingBox = await firstSetInput.boundingBox();
        if (boundingBox) {
          await page.screenshot({
            path: path.join(screenshotsDir, '06-sets-inputs-closeup.png'),
            clip: {
              x: Math.max(0, boundingBox.x - 50),
              y: Math.max(0, boundingBox.y - 50),
              width: Math.min(page.viewportSize().width, boundingBox.x + 300),
              height: Math.min(page.viewportSize().height, boundingBox.y + 200)
            }
          });
        }
        
        // Try to interact with set inputs
        if (setInputs.length >= 2) {
          await setInputs[0].fill('135'); // Weight
          await setInputs[1].fill('8');   // Reps
          console.log('Filled sample set data');
          await page.waitForTimeout(1000);
          
          await page.screenshot({ 
            path: path.join(screenshotsDir, '07-sets-with-data.png'),
            fullPage: true 
          });
        }
      }
    } else {
      console.log('No sets interface found. Taking final screenshot...');
      await page.screenshot({ 
        path: path.join(screenshotsDir, '05-no-sets-found.png'),
        fullPage: true 
      });
    }

    console.log('5. Testing mobile responsiveness...');
    
    // Test mobile view
    await page.setViewportSize({ width: 375, height: 667 }); // iPhone SE size
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: path.join(screenshotsDir, '08-mobile-view.png'),
      fullPage: true 
    });

    // Test tablet view
    await page.setViewportSize({ width: 768, height: 1024 }); // iPad size
    await page.waitForTimeout(2000);
    
    await page.screenshot({ 
      path: path.join(screenshotsDir, '09-tablet-view.png'),
      fullPage: true 
    });

    console.log('6. Analysis complete! Screenshots saved to ./screenshots/');
    
    // Generate a simple HTML report
    const reportHtml = `
<!DOCTYPE html>
<html>
<head>
    <title>Sets UI Analysis Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .screenshot { margin: 20px 0; text-align: center; }
        img { max-width: 100%; border: 1px solid #ccc; }
        h2 { color: #333; border-bottom: 2px solid #007acc; padding-bottom: 5px; }
    </style>
</head>
<body>
    <h1>Fitness Tracker Sets UI Analysis</h1>
    <h2>Screenshots Captured:</h2>
    
    <div class="screenshot">
        <h3>1. Initial Page Load</h3>
        <img src="01-initial-page.png" alt="Initial page">
    </div>
    
    <div class="screenshot">
        <h3>2. After Clicking Gym Tab</h3>
        <img src="02-gym-tab-clicked.png" alt="Gym tab clicked">
    </div>
    
    <div class="screenshot">
        <h3>3. Add Exercise Interaction</h3>
        <img src="03-add-exercise-clicked.png" alt="Add exercise">
    </div>
    
    <div class="screenshot">
        <h3>4. Exercise Added</h3>
        <img src="04-exercise-added.png" alt="Exercise added">
    </div>
    
    <div class="screenshot">
        <h3>5. Sets Interface</h3>
        <img src="05-sets-interface-found.png" alt="Sets interface">
    </div>
    
    <div class="screenshot">
        <h3>6. Sets Inputs Close-up</h3>
        <img src="06-sets-inputs-closeup.png" alt="Sets inputs">
    </div>
    
    <div class="screenshot">
        <h3>7. Sets with Sample Data</h3>
        <img src="07-sets-with-data.png" alt="Sets with data">
    </div>
    
    <div class="screenshot">
        <h3>8. Mobile View (375x667)</h3>
        <img src="08-mobile-view.png" alt="Mobile view">
    </div>
    
    <div class="screenshot">
        <h3>9. Tablet View (768x1024)</h3>
        <img src="09-tablet-view.png" alt="Tablet view">
    </div>
    
    <p><em>Analysis generated on ${new Date().toLocaleString()}</em></p>
</body>
</html>`;
    
    fs.writeFileSync(path.join(screenshotsDir, 'analysis-report.html'), reportHtml);
    console.log('Analysis report saved to ./screenshots/analysis-report.html');

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