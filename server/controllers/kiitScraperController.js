const puppeteer = require('puppeteer-core');

// Helper to reliably wait for text to become visible anywhere across all iframes, then click it
async function clickElementWithText(page, textStr, maxRetries = 15, exactMatch = false, pickLast = false, cssSelector = 'a') {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    let clicked = false;
    for (const frame of page.frames()) {
      try {
        const elementHandle = await frame.evaluateHandle((args) => {
          // Find ONLY hyperlinks to avoid clicking static headers/divs that reload the page
          const elements = Array.from(document.querySelectorAll(args.cssSelector));
          
          const matches = elements.filter(el => {
              const txt = (el.textContent || el.innerText || "").trim().toLowerCase();
              const target = args.textToFind.trim().toLowerCase();
              if (args.exactMatch) {
                 return txt === target;
              }
              return txt.includes(target);
          });
          
          if (matches.length > 0) {
              return args.pickLast ? matches[matches.length - 1] : matches[0];
          }
          return null;
        }, {textToFind: textStr, exactMatch, pickLast, cssSelector});

        const isElement = await frame.evaluate(el => el !== null, elementHandle);
        
        if (isElement) {
          // Found it! Let puppeteer try to click. If it's hidden or obscured, .click() will automatically throw!
          const navPromise = frame.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 }).catch(() => {});
          
          await elementHandle.asElement().click();
          await navPromise;
          console.log(`Found and successfully clicked: "${textStr}" via ${cssSelector}`);
          return true; // Click successful!
        }
      } catch (e) {
        // If it throws (e.g. element is not visible or obscured), we silently ignore and keep trying!
      }
    }
    // Wait short interval before next retry
    await new Promise(r => setTimeout(r, 1000));
  }
  return false;
}

const getAttendance = async (req, res) => {
  const { userId, password, year, session } = req.body;

  if (!userId || !password || !year || !session) {
    return res.status(400).json({ error: "Missing required fields: userId, password, year, session." });
  }

  let browser;
  try {
    // Launch browser VISIBLY so you can see it navigate!
    const launchOptions = {
        headless: false,
        defaultViewport: null,
        args: [
            '--start-maximized', 
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process'
        ]
    };

    try {
      browser = await puppeteer.launch({ ...launchOptions, channel: 'chrome' });
    } catch (e) {
      console.log("Chrome not found, falling back to edge");
      browser = await puppeteer.launch({ ...launchOptions, channel: 'msedge' });
    }

    const page = await browser.newPage();
    
    // SAP portals often check user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

    // 1. Navigate to login page
    await page.goto('https://kiitportal.kiituniversity.net/irj/portal/', { waitUntil: 'networkidle2' });

    // 2. Perform Login
    const loginSelector = 'input[id="logonuidfield"], input[name="j_username"], input[type="text"]';
    const passSelector = 'input[id="logonpassfield"], input[name="j_password"], input[type="password"]';
    
    await page.waitForSelector(loginSelector, { timeout: 10000 });
    await page.type(loginSelector, userId);
    await page.type(passSelector, password);
    
    const btnSelector = 'input[name="uidPasswordLogon"], button[type="submit"], input[type="submit"]';
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 30000 }).catch(() => {}),
      page.click(btnSelector)
    ]);

    // Give dashboard time to settle
    await new Promise(r => setTimeout(r, 5000));

    // 3. Post-login Navigation based on standard SAP Tree structure
    // Step 3a: Click the main root parent folder
    // Uses 15 retries (15 seconds max polling)
    const rootClicked = await clickElementWithText(page, "Student Self Service for");
    if (!rootClicked) {
      await clickElementWithText(page, "Student Self Service"); // fallback in case branch-specific string changes
    }
    
    // Step 3b: Click the "Student self service" subfolder immediately after (wait up to 15s for the AJAX tree to open)
    // We pass exactMatch=true and target the exact CSS classes 'a.SItreeText, a.SItreeSelColor' shown in your DOM!
    // We also pass pickLast=true to ensure it ignores the first "Student self service" (top tab) and strictly targets the second occurring (sidebar folder).
    const subFolderClicked = await clickElementWithText(page, "Student self service", 15, true, true, 'a.SItreeText, a.SItreeSelColor');
    if (!subFolderClicked) {
        throw new Error("Could not find 'Student self service' subfolder. Navigation stalled.");
    }

    // Step 3c: Wait and click "Attendance Details"
    // We target the same tree CSS classes and look for Attendance Details
    const finalLinkClicked = await clickElementWithText(page, "Attendance Details", 15, false, false, 'a.SItreeText, a.SItreeSelColor');
    if (!finalLinkClicked) {
        throw new Error("Could not find 'Attendance Details' in the final branch.");
    }

    // Wait for the actual table application frame to load from the server network
    await new Promise(r => setTimeout(r, 8000)); 

    // 4. Look for the content iframe containing the form.
    // Instead of strictly looking for `<select>` (which fails if SAP uses custom Combobox <div>s),
    // we look for the frame that contains the typical "Submit", "Show", or "Get" button.
    let formFrame = null;
    let submitBtnSelector = 'button, input[type="button"], input[type="submit"], input[type="image"], a.urBtnStd';

    for (const frame of page.frames()) {
       // Look for highly specific application text that only exists in the right pane data iframe 
       const isAppFrame = await frame.evaluate(() => {
           const text = (document.body.innerText || "").toLowerCase();
           // In the screenshot, we see 'Student Details', 'Select Year & Session', 'Attendance Details', 'Total Percentage', etc.
           // We also check against left menu to make sure we don't pick a parent frame that contains the left menu!
           return text.includes('student details') && 
                  text.includes('total percentage') && 
                  text.includes('select year & session') &&
                  !text.includes('detailed navigation'); // Must NOT contain the left menu to ensure it's not the top/parent frame!
       }).catch(() => false);

       if (isAppFrame) {
           formFrame = frame;
           break;
       }
    }

    if (!formFrame) {
       throw new Error("Could not identify the Attendance Form or Submit button on the page. The frame may still be loading.");
    }

    // Attempt to inject user answers
    try {
       // If they are standard CSS selects, this will work. 
       // If they are custom SAP Comboboxes, it gracefully fails and we just click Submit (since the defaults are usually correct active sessions!).
       const selectsCount = await formFrame.evaluate(() => document.querySelectorAll('select').length);
       if (selectsCount >= 2) {
           await formFrame.select('select:nth-of-type(1)', year);  
           await new Promise(r => setTimeout(r, 2000));
           await formFrame.select('select:nth-of-type(2)', session);
        } else {
           // SAP WebDynpro requires actual native keystrokes to trigger the AJAX roundtrips
           try {
               const targetYear = year || '2025-2026';
               
               // Year Dropdown
               const yearInput = await formFrame.$('#WD52');
               if (yearInput) {
                   await yearInput.click();
                   // Wait for the dynamic select combo container to render
                   await new Promise(r => setTimeout(r, 1500)); 
                   
                   await formFrame.evaluate((val) => {
                       const nodes = Array.from(document.querySelectorAll('span, div, td, a')).filter(el => {
                           return el.children.length === 0 && (el.innerText || '').trim() === val;
                       });
                       // WebDynpro dropdown fragments are built last in the DOM hierarchy
                       const popupItem = nodes[nodes.length - 1]; 
                       if (popupItem) popupItem.click();
                   }, targetYear);
                   
                   // Give time for any postback callbacks
                   await new Promise(r => setTimeout(r, 2000));
               }

               // Session Dropdown
               const sessionInput = await formFrame.$('#WD6F');
               if (sessionInput) {
                   await sessionInput.click();
                   await new Promise(r => setTimeout(r, 1500)); 
                   
                   await formFrame.evaluate((val) => {
                       const nodes = Array.from(document.querySelectorAll('span, div, td, a')).filter(el => {
                           // Case insensitive check for session like 'spring' vs 'Spring'
                           const txt = (el.innerText || '').trim().toLowerCase();
                           return el.children.length === 0 && txt === val.toLowerCase();
                       });
                       const popupItem = nodes[nodes.length - 1];
                       if (popupItem) popupItem.click();
                   }, session);
                   
                   await new Promise(r => setTimeout(r, 2000));
               }
           } catch (nativeEr) {
               console.log("Native typing using exact IDs failed:", nativeEr);
           }

           // Fallback has been removed since explicit targeting of the IDs #WD5F and #WD6F is guaranteed to be correct.
           await new Promise(r => setTimeout(r, 2000));
       }
       
       // Click submit/show to populate the table (Aggressive Search)
       await formFrame.evaluate((sel) => {
           let success = false;
           // Try standard button/input selectors first
           const btns = Array.from(document.querySelectorAll(sel));
           const sBtn = btns.find(b => {
               const txt = (b.innerText || b.value || b.title || "").toLowerCase();
               return txt === "submit" || txt === "show" || txt === "get" || txt === "view" || txt.includes("submit");
           });
           
           if (sBtn) {
               sBtn.click();
               success = true;
           } else {
               // Fallback: SAP WebDynpro often uses tables, spans, or divs as interactive buttons
               const allLeaves = Array.from(document.querySelectorAll('span, div, td, a')).filter(el => el.children.length === 0);
               const fallbackBtn = allLeaves.find(el => (el.innerText || '').trim().toLowerCase() === 'submit');
               if (fallbackBtn) {
                   fallbackBtn.click();
                   success = true;
               }
           }
       }, submitBtnSelector);

       // wait for attendance table to populate
       await new Promise(r => setTimeout(r, 8000)); 
    } catch(err) {
       console.log("Error interacting with form:", err);
    }

    // 5. Extract table data
    let attendanceData = [];
    if (formFrame) {
      attendanceData = await formFrame.evaluate(() => {
         // Typical SAP WebDynpro table extraction
         const rows = Array.from(document.querySelectorAll('table tbody tr'));
         return rows.map(tr => {
            const cells = Array.from(tr.querySelectorAll('td, th'));
            return cells.map(td => td.innerText.trim());
         }).filter(row => row.length > 0 && row.some(cell => cell.length > 0)); 
      });
    }

    await browser.close();

    return res.status(200).json({
      message: "Scraping completed successfully!",
      route: "Student Self Service > Student self service > Attendance Details",
      data: attendanceData
    });

  } catch (error) {
    if (browser) await browser.close();
    console.error("Puppeteer Scraper Error:", error);
    return res.status(500).json({ error: "Failed to scrape attendance", details: error.message });
  }
};

module.exports = {
  getAttendance
};
