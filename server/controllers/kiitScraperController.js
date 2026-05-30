const puppeteer = require('puppeteer');
const chromium = require('@sparticuz/chromium');

// Helper to clean and format the raw array of arrays from SAP portal into a structured object
function cleanScrapedData(rawData) {
  // 1. FLATTEN RAW DATA
  if (!rawData || !Array.isArray(rawData)) {
    rawData = [];
  }

  const rows = rawData.map(row => {
    if (!Array.isArray(row)) return [String(row).trim()];
    return row.flat(Infinity)
      .map(cell => String(cell).trim())
      .filter(cell => cell !== '');
  }).filter(row => row.length > 0);

  const allText = rows.flat().join('\n');

  // 2. STUDENT DETAILS EXTRACTION
  const extractField = (pattern) => {
    const regex = new RegExp(pattern + "\\s*[:\\-]?\\s*([^\\n]+)", "i");
    const match = allText.match(regex);
    if (match) {
      return match[1].replace(/[\t\r]+/g, '').trim().replace(/\s+/g, ' ');
    }
    return "Unknown";
  };

  const student = {
    name: extractField("Student Name"),
    rollNo: extractField("Roll No\\.?"),
    regNo: extractField("Reg\\.? No\\.?"),
    program: extractField("Program of Study"),
    semester: extractField("Semester(?:\\s*\\(currently pursuing\\))?")
  };

  // 3. UNIVERSAL HEADER DETECTION & 4. HEADER ALIASES
  const headerAliases = {
    subject: ['subject', 'course', 'paper'],
    faculty: ['faculty name', 'teacher name', 'faculty'],
    percentage: ['total percentage', 'percentage'],
    totalClasses: ['total no. of days', 'total no of days', 'total days', 'total classes'],
    present: ['no.of present', 'no. of present', 'present'],
    absent: ['no.of absent', 'no. of absent', 'absent'],
    excused: ['no. of excuses', 'no.of excuses', 'excuses', 'excused']
  };

  const getCanonicalHeader = (cell) => {
    const lowerCell = cell.toLowerCase().replace(/\s+/g, ' ').trim();
    for (const [canonical, aliases] of Object.entries(headerAliases)) {
      if (aliases.includes(lowerCell)) {
        return canonical;
      }
    }
    return null;
  };

  let headerRowIndex = -1;
  let columnMap = {};

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    let matchCount = 0;
    let tempMap = {};
    
    for (let col = 0; col < row.length; col++) {
      const canonical = getCanonicalHeader(row[col]);
      if (canonical) {
        matchCount++;
        if (!tempMap[canonical]) tempMap[canonical] = [];
        tempMap[canonical].push(col);
      }
    }
    
    if (matchCount >= 4) {
      headerRowIndex = i;
      columnMap = tempMap;
      break;
    }
  }

  // 7. DATA ROW PARSING
  const attendance = [];
  const seenSubjects = new Set();

  if (headerRowIndex !== -1) {
    // 6. DUPLICATE FACULTY NAME COLUMNS
    let actualFacultyCol = -1;
    if (columnMap.faculty && columnMap.faculty.length > 0) {
      if (columnMap.faculty.length === 1) {
        actualFacultyCol = columnMap.faculty[0];
      } else {
        for (const colIdx of columnMap.faculty) {
          let hasText = false;
          for (let i = headerRowIndex + 1; i < rows.length; i++) {
            const val = rows[i][colIdx];
            if (val && !/^\d+$/.test(val.replace(/\s+/g, ''))) {
              hasText = true;
              break;
            }
          }
          if (hasText) {
            actualFacultyCol = colIdx;
            break;
          }
        }
        if (actualFacultyCol === -1) actualFacultyCol = columnMap.faculty[0];
      }
    }

    // 5. FLEXIBLE COLUMN ORDER
    for (let i = headerRowIndex + 1; i < rows.length; i++) {
      const row = rows[i];
      
      const getVal = (canonical) => {
        if (canonical === 'faculty') {
          return actualFacultyCol !== -1 && row[actualFacultyCol] !== undefined ? row[actualFacultyCol] : '';
        }
        if (columnMap[canonical] && columnMap[canonical].length > 0) {
          const colIdx = columnMap[canonical][0];
          return row[colIdx] !== undefined ? row[colIdx] : '';
        }
        return '';
      };

      const subject = getVal('subject');
      const faculty = getVal('faculty');
      const percentageStr = getVal('percentage');
      const totalClassesStr = getVal('totalClasses');
      const presentStr = getVal('present');
      const absentStr = getVal('absent');
      const excusedStr = getVal('excused');

      // 8. ROW VALIDATION
      if (!subject || /^\d+$/.test(subject.replace(/\s+/g, '')) || getCanonicalHeader(subject) === 'subject') {
        continue;
      }

      const percentage = parseFloat(percentageStr) || 0;
      const totalClasses = parseFloat(totalClassesStr) || 0;
      const present = parseFloat(presentStr) || 0;
      const absent = parseFloat(absentStr) || 0;
      const excused = parseFloat(excusedStr) || 0;

      if (percentage < 0 || percentage > 100) continue;
      if (totalClasses === 0 && present === 0 && absent === 0 && percentage === 0) continue;

      // 9. REMOVE DUPLICATES
      if (seenSubjects.has(subject)) continue;
      seenSubjects.add(subject);

      attendance.push({
        subject,
        faculty,
        percentage,
        totalClasses,
        present,
        absent,
        excused
      });
    }
  }

  // 10. OUTPUT
  return {
    student,
    attendance
  };
}

// Helper to reliably wait for text to become visible anywhere across all iframes, then click it
// OPTIMIZATION: Reduced maxRetries and polling interval for faster failure and retry loop
async function clickElementWithText(page, textStr, maxRetries = 20, exactMatch = false, pickLast = false, cssSelector = 'a') {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
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
          // OPTIMIZATION: domcontentloaded instead of networkidle2
          const navPromise = frame.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 3000 }).catch(() => {});
          
          await elementHandle.asElement().click();
          await navPromise;
          console.log(`Found and successfully clicked: "${textStr}" via ${cssSelector}`);
          return true; // Click successful!
        }
      } catch (e) {
        // If it throws (e.g. element is not visible or obscured), we silently ignore and keep trying!
      }
    }
    // OPTIMIZATION: Wait 300ms instead of 1000ms
    await new Promise(r => setTimeout(r, 300));
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
    // OPTIMIZATION: Headless mode true, Disabled GPU/Dev-shm/Rasterizer
    const launchOptions = {
        headless: true, 
        defaultViewport: null,
        args: [
            '--no-sandbox', 
            '--disable-setuid-sandbox',
            '--disable-web-security',
            '--disable-features=IsolateOrigins,site-per-process',
            '--disable-gpu',
            '--disable-dev-shm-usage',
            '--disable-software-rasterizer',
            '--disable-extensions',
            '--mute-audio',
            '--no-zygote'
        ]
    };

    try {
      const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER;
      const executablePath = isProduction 
          ? await chromium.executablePath() 
          : puppeteer.executablePath();

      browser = await puppeteer.launch({ 
         args: isProduction ? [...chromium.args, ...launchOptions.args] : launchOptions.args,
         defaultViewport: chromium.defaultViewport,
         executablePath: executablePath,
         headless: isProduction ? chromium.headless : true,
      });
    } catch (e) {
      console.log("Failed to launch browser:", e);
      throw e;
    }

    const page = await browser.newPage();
    
    // SAP portals often check user agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

    // OPTIMIZATION: Intercept and block unnecessary resources
    await page.setRequestInterception(true);
    page.on('request', (request) => {
        const resourceType = request.resourceType();
        // Allow stylesheets and 'other' (which might be XHR/fetch) to prevent SAP WebDynpro from breaking
        if (['image', 'font', 'media'].includes(resourceType)) {
            request.abort();
        } else {
            request.continue();
        }
    });

    // 1. Navigate to login page
    // OPTIMIZATION: domcontentloaded instead of networkidle2
    await page.goto('https://kiitportal.kiituniversity.net/irj/portal/', { waitUntil: 'domcontentloaded' });

    // 2. Perform Login
    const loginSelector = 'input[id="logonuidfield"], input[name="j_username"], input[type="text"]';
    const passSelector = 'input[id="logonpassfield"], input[name="j_password"], input[type="password"]';
    
    await page.waitForSelector(loginSelector, { timeout: 10000 });
    // OPTIMIZATION: zero delay typing
    await page.type(loginSelector, userId, { delay: 0 });
    await page.type(passSelector, password, { delay: 0 });
    
    const btnSelector = 'input[name="uidPasswordLogon"], button[type="submit"], input[type="submit"]';
    await Promise.all([
      // OPTIMIZATION: domcontentloaded instead of networkidle2
      page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 30000 }).catch(() => {}),
      page.click(btnSelector)
    ]);

    // OPTIMIZATION: Removed fixed 5000ms delay. clickElementWithText will dynamically poll for the target element!

    // 3. Post-login Navigation based on standard SAP Tree structure
    // Step 3a: Click the main root parent folder
    const rootClicked = await clickElementWithText(page, "Student Self Service for", 50); // 50 * 300ms = 15s
    if (!rootClicked) {
      await clickElementWithText(page, "Student Self Service", 50); // fallback in case branch-specific string changes
    }
    
    // Step 3b: Click the "Student self service" subfolder immediately after
    const subFolderClicked = await clickElementWithText(page, "Student self service", 50, true, true, 'a.SItreeText, a.SItreeSelColor');
    if (!subFolderClicked) {
        throw new Error("Could not find 'Student self service' subfolder. Navigation stalled.");
    }

    // Step 3c: Wait and click "Attendance Details"
    const finalLinkClicked = await clickElementWithText(page, "Attendance Details", 50, false, false, 'a.SItreeText, a.SItreeSelColor');
    if (!finalLinkClicked) {
        throw new Error("Could not find 'Attendance Details' in the final branch.");
    }

    // OPTIMIZATION: Replace 8000ms fixed delay with dynamic frame content polling (up to 15 seconds)
    let formFrame = null;
    let submitBtnSelector = 'button, input[type="button"], input[type="submit"], input[type="image"], a.urBtnStd';

    for (let attempt = 1; attempt <= 50; attempt++) {
        for (const frame of page.frames()) {
           const isAppFrame = await frame.evaluate(() => {
               const text = (document.body.innerText || "").toLowerCase();
               return text.includes('student details') && 
                      text.includes('total percentage') && 
                      text.includes('select year & session') &&
                      !text.includes('detailed navigation');
           }).catch(() => false);
    
           if (isAppFrame) {
               formFrame = frame;
               break;
           }
        }
        if (formFrame) break;
        await new Promise(r => setTimeout(r, 300));
    }

    if (!formFrame) {
       throw new Error("Could not identify the Attendance Form or Submit button on the page. The frame may still be loading.");
    }

    // Attempt to inject user answers
    try {
       const selectsCount = await formFrame.evaluate(() => document.querySelectorAll('select').length);
       if (selectsCount >= 2) {
           await formFrame.select('select:nth-of-type(1)', year);  
           // OPTIMIZATION: Reduced 2000ms to 500ms
           await new Promise(r => setTimeout(r, 500));
           await formFrame.select('select:nth-of-type(2)', session);
        } else {
           try {
               const targetYear = year || '2025-2026';
               
               // Year Dropdown
               const yearInput = await formFrame.$('#WD52');
               if (yearInput) {
                   await yearInput.click();
                   // OPTIMIZATION: Reduced 1500ms to 500ms
                   await new Promise(r => setTimeout(r, 500)); 
                   
                   await formFrame.evaluate((val) => {
                       const nodes = Array.from(document.querySelectorAll('span, div, td, a')).filter(el => {
                           return el.children.length === 0 && (el.innerText || '').trim() === val;
                       });
                       const popupItem = nodes[nodes.length - 1]; 
                       if (popupItem) popupItem.click();
                   }, targetYear);
                   
                   // OPTIMIZATION: Reduced 2000ms to 500ms
                   await new Promise(r => setTimeout(r, 500));
               }

               // Session Dropdown
               const sessionInput = await formFrame.$('#WD6F');
               if (sessionInput) {
                   await sessionInput.click();
                   // OPTIMIZATION: Reduced 1500ms to 500ms
                   await new Promise(r => setTimeout(r, 500)); 
                   
                   await formFrame.evaluate((val) => {
                       const nodes = Array.from(document.querySelectorAll('span, div, td, a')).filter(el => {
                           const txt = (el.innerText || '').trim().toLowerCase();
                           return el.children.length === 0 && txt === val.toLowerCase();
                       });
                       const popupItem = nodes[nodes.length - 1];
                       if (popupItem) popupItem.click();
                   }, session);
                   
                   // OPTIMIZATION: Reduced 2000ms to 500ms
                   await new Promise(r => setTimeout(r, 500));
               }
           } catch (nativeEr) {
               console.log("Native typing using exact IDs failed:", nativeEr);
           }

           // OPTIMIZATION: Reduced 2000ms to 500ms
           await new Promise(r => setTimeout(r, 500));
       }
       
       // Click submit/show to populate the table (Aggressive Search)
       await formFrame.evaluate((sel) => {
           let success = false;
           const btns = Array.from(document.querySelectorAll(sel));
           const sBtn = btns.find(b => {
               const txt = (b.innerText || b.value || b.title || "").toLowerCase();
               return txt === "submit" || txt === "show" || txt === "get" || txt === "view" || txt.includes("submit");
           });
           
           if (sBtn) {
               sBtn.click();
               success = true;
           } else {
               const allLeaves = Array.from(document.querySelectorAll('span, div, td, a')).filter(el => el.children.length === 0);
               const fallbackBtn = allLeaves.find(el => (el.innerText || '').trim().toLowerCase() === 'submit');
               if (fallbackBtn) {
                   fallbackBtn.click();
                   success = true;
               }
           }
       }, submitBtnSelector);

       // OPTIMIZATION: Replaced 8000ms fixed delay with dynamic polling for actual data
       await formFrame.waitForFunction(() => {
           const text = document.body.innerText || "";
           // Data rows contain decimal numbers (e.g., 83.05, 59.00). 
           // If we see one, the AJAX response has populated the table!
           return /\\d{1,3}\\.\\d{2}/.test(text);
       }, { timeout: 10000 }).catch(() => {});
       
       // Small buffer to ensure DOM is fully painted
       await new Promise(r => setTimeout(r, 1000));
    } catch(err) {
       console.log("Error interacting with form:", err);
    }

    // 5. Extract table data
    let attendanceData = [];
    if (formFrame) {
      attendanceData = await formFrame.evaluate(() => {
         // Query all rows
         const allTrs = Array.from(document.querySelectorAll('tr'));
         return allTrs.map(tr => {
            // CRITICAL FIX: Only get DIRECT children that are TD or TH.
            // WebDynpro uses nested tables. Using querySelectorAll('td, th') grabs descendants 
            // inside nested tables, resulting in duplicate columns and misaligned data!
            const cells = Array.from(tr.children).filter(el => el.tagName === 'TD' || el.tagName === 'TH');
            return cells.map(td => td.innerText.trim());
         }).filter(row => row.length >= 4); // A valid header or data row has multiple columns
      });
    }

    await browser.close();

    const cleanedData = cleanScrapedData(attendanceData);

    return res.status(200).json({
      message: "Scraping completed successfully!",
      route: "Student Self Service > Student self service > Attendance Details",
      data: cleanedData
    });

  } catch (error) {
    if (browser) await browser.close();
    console.error("Puppeteer Scraper Error:", error);
    return res.status(500).json({ 
        error: "Failed to scrape attendance", 
        details: error.message || String(error),
        stack: error.stack 
    });
  }
};

module.exports = {
  getAttendance
};
