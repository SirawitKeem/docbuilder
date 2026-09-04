import fs from "fs";

const xml = fs.readFileSync("scratch/pptx_extracted/ppt/slides/slide1.xml", "utf8");

const matches = [...xml.matchAll(/<a:r>([\s\S]*?)<\/a:r>/g)];
console.log("Total <a:r> runs found:", matches.length);

for (let i = 0; i < matches.length; i++) {
  const rBlock = matches[i][1];
  const tMatch = rBlock.match(/<a:t>([\s\S]*?)<\/a:t>/);
  const text = tMatch ? tMatch[1] : "";
  const latinMatch = rBlock.match(/<a:latin\s+typeface="([^"]*)"/);
  const eaMatch = rBlock.match(/<a:ea\s+typeface="([^"]*)"/);
  const csMatch = rBlock.match(/<a:cs\s+typeface="([^"]*)"/);
  console.log(`[Run ${i + 1}] Text: "${text}"`);
  console.log(`         latin: "${latinMatch ? latinMatch[1] : 'none'}"`);
  console.log(`         ea:    "${eaMatch ? eaMatch[1] : 'none'}"`);
  console.log(`         cs:    "${csMatch ? csMatch[1] : 'none'}"`);
}
