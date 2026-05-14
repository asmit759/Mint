/**
 * Parses and cleans raw attendance data scraped from the KIIT SAP portal.
 * @param {Array} rawData - The raw extracted arrays from Puppeteer
 * @returns {Object} Structured data containing student details and attendance array
 */
function cleanScrapedData(rawData) {
  // 1. FLATTEN RAW DATA
  // Handle potentially missing or non-array inputs
  if (!rawData || !Array.isArray(rawData)) {
    rawData = [];
  }

  // Create an array of rows where each row is a flat array of cleaned strings
  const rows = rawData.map(row => {
    if (!Array.isArray(row)) return [String(row).trim()];
    // Flatten nested arrays inside the row
    return row.flat(Infinity)
      .map(cell => String(cell).trim())
      .filter(cell => cell !== ''); // Remove empty cells
  }).filter(row => row.length > 0); // Ignore empty rows

  // Prepare a giant single string for Regex extraction (Student Details)
  const allText = rows.flat().join('\n');

  // 2. STUDENT DETAILS EXTRACTION
  const extractField = (pattern) => {
    // Match the label, optional colon/hyphen, optional whitespace/newlines, then capture the actual value
    const regex = new RegExp(pattern + "\\s*[:\\-]?\\s*([^\\n]+)", "i");
    const match = allText.match(regex);
    if (match) {
      // Clean up tabs, carriage returns, and multiple spaces
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
  let columnMap = {}; // Example: { subject: [0], faculty: [1, 5], ... }

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
    
    // If we find at least 4 known headers, we confidently consider this the header row
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
        // We have duplicate faculty columns. SAP usually has one with numeric IDs and one with actual names.
        // Let's inspect the data rows to find the one with non-numeric strings.
        for (const colIdx of columnMap.faculty) {
          let hasText = false;
          for (let i = headerRowIndex + 1; i < rows.length; i++) {
            const val = rows[i][colIdx];
            if (val && !/^\\d+$/.test(val.replace(/\s+/g, ''))) {
              hasText = true;
              break;
            }
          }
          if (hasText) {
            actualFacultyCol = colIdx;
            break;
          }
        }
        // Fallback to the first one if we couldn't distinguish
        if (actualFacultyCol === -1) actualFacultyCol = columnMap.faculty[0];
      }
    }

    // 5. FLEXIBLE COLUMN ORDER - Extract rows
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
      // Ignore if subject is empty, purely numeric, or equals the header text
      if (!subject || /^\\d+$/.test(subject.replace(/\s+/g, '')) || getCanonicalHeader(subject) === 'subject') {
        continue;
      }

      const percentage = parseFloat(percentageStr) || 0;
      const totalClasses = parseFloat(totalClassesStr) || 0;
      const present = parseFloat(presentStr) || 0;
      const absent = parseFloat(absentStr) || 0;
      const excused = parseFloat(excusedStr) || 0;

      // Ignore if percentage is out of logical bounds or if there's absolutely no meaningful numeric data
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

module.exports = { cleanScrapedData };
