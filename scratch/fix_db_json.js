const fs = require("fs");
const path = require("path");

const dbPath = path.resolve("data/db.json");
const raw = fs.readFileSync(dbPath, "utf-8");

// Find the valid JSON content
const firstClosingBrace = raw.lastIndexOf("}\n}");
let cleanJsonString = "";

if (firstClosingBrace !== -1) {
  cleanJsonString = raw.substring(0, firstClosingBrace + 3);
} else {
  // Try finding valid JSON
  const endIdx = raw.indexOf("}\n  ]\n}");
  if (endIdx !== -1) {
    cleanJsonString = raw.substring(0, endIdx + 7);
  }
}

console.log("Attempting to parse cleaned JSON string...");
try {
  const parsed = JSON.parse(cleanJsonString);
  console.log("Parsed successfully!");
  console.log("fieldProfiles count:", (parsed.fieldProfiles || []).length);
  console.log("documents count:", (parsed.documents || []).length);
  console.log("quotations count:", (parsed.quotations || []).length);
  
  // Format and write back cleanly
  fs.writeFileSync(dbPath, JSON.stringify(parsed, null, 2), "utf-8");
  console.log("data/db.json successfully repaired and saved!");
} catch (err) {
  console.error("Parse error:", err.message);
}
