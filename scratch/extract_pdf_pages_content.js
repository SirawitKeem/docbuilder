const fs = require("fs");

const pdfBuffer = fs.readFileSync("scratch/test_output.pdf");
const content = pdfBuffer.toString("latin1");

// Extract text streams from PDF
const streams = content.split("stream");
console.log("Found stream blocks:", streams.length - 1);

streams.slice(1).forEach((stream, idx) => {
  const endIdx = stream.indexOf("endstream");
  const rawData = stream.substring(0, endIdx);
  
  // Extract visible ASCII/UTF8 strings inside parenthesis (Tj or TJ)
  const strings = [];
  const regex = /\(([^)]+)\)\s*T[jJ]/g;
  let match;
  while ((match = regex.exec(rawData)) !== null) {
    strings.push(match[1]);
  }
  
  if (strings.length > 0) {
    console.log(`\n--- Stream ${idx + 1} Text Snippets (${strings.length} items) ---`);
    console.log(strings.join(" "));
  }
});
