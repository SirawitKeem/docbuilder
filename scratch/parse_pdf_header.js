const fs = require("fs");

const pdfBuffer = fs.readFileSync("scratch/pdf_prefer.pdf");
const content = pdfBuffer.toString("latin1");

const pageMatches = content.match(/\/Type\s*\/Page\b/g);
console.log("PDF File Size:", pdfBuffer.length, "bytes");
console.log("Internal Page Object Count:", pageMatches ? pageMatches.length : 0);
