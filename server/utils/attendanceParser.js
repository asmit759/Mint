const xlsx = require("xlsx");

function parseAttendanceExcel(filePath, academicYear) {
  const workbook = xlsx.readFile(filePath);
  let yearData = { year: academicYear, semesters: [] };

  //  const sheetName = workbook.SheetNames[1];   >>>>>>>>>here pages are 0 base indexing so 0 means 1st page

  workbook.SheetNames.forEach((sheetName) => {
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    let semesterName = sheetName.includes("_")
      ? sheetName.split("_")[1] // e.g. "2025-26_Autumn" → "Autumn"
      : sheetName;

    const subjects = sheetData.map((row) => ({
      subject: row["Subject"],
      facultyName: row["Faculty Name"],
      facultyId: row["Faculty Id"],
      totalDays: row["Total No. of Days"],
      present: row["No.of Present"],
      absent: row["No.of Absent"],
      excuses: row["No. of Excuses"] || 0,
      percentage: row["Total Percentage"],
    }));

    yearData.semesters.push({
      semester: semesterName.trim(), // only "Autumn" or "Spring"
      subjects,
    });
  });

  return yearData;
}

module.exports = parseAttendanceExcel;
