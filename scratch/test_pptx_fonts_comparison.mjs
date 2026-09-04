import pptxgen from "pptxgenjs";
import { execSync } from "child_process";
import path from "path";
import fs from "fs";

const testCases = [
  { name: "Chonburi_plain", font: "Chonburi" },
  { name: "Chonburi_Leelawadee", font: "Chonburi, Leelawadee UI" },
  { name: "Chonburi_Leelawadee_sans", font: "Chonburi, Leelawadee UI, sans-serif" },
  { name: "Chonburi_Leelawadee_serif", font: "Chonburi, Leelawadee UI, serif" },
  { name: "Leelawadee_UI", font: "Leelawadee UI" },
  { name: "Tahoma", font: "Tahoma" },
];

const pptx = new pptxgen();
pptx.layout = "LAYOUT_16x9";

for (const tc of testCases) {
  const slide = pptx.addSlide();
  slide.background = { color: "0F172A" };

  slide.addText(`Font Setting: "${tc.font}"`, {
    x: 1.0,
    y: 0.8,
    w: 11.0,
    h: 0.5,
    fontSize: 16,
    color: "38BDF8",
    fontFace: "Arial",
  });

  slide.addText("กลยุทธ์การทรานส์ฟอร์มธุรกิจสู่ยุคดิจิทัล 2026", {
    x: 1.0,
    y: 1.8,
    w: 11.0,
    h: 1.5,
    fontSize: 36,
    color: "FFFFFF",
    fontFace: tc.font,
  });

  slide.addText("หนังสือรับรองผลงานอันทรงเกียรติและนวัตกรรม 2569", {
    x: 1.0,
    y: 3.5,
    w: 11.0,
    h: 1.0,
    fontSize: 24,
    color: "E2E8F0",
    fontFace: tc.font,
  });
}

const outPptx = path.resolve("scratch/test_font_matrix.pptx");
await pptx.writeFile({ fileName: outPptx });
console.log(`Saved: ${outPptx}`);

// Export each slide via PowerPoint COM to PNG
const psScript = `
$ppt = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Open('${outPptx.replace(/\\/g, "\\\\")}', [Microsoft.Office.Core.MsoTriState]::msoTrue, [Microsoft.Office.Core.MsoTriState]::msoFalse, [Microsoft.Office.Core.MsoTriState]::msoFalse)
for ($i = 1; $i -le $pres.Slides.Count; $i++) {
    $outPng = "C:\\\\Users\\\\Keem\\\\Desktop\\\\docbuilder\\\\scratch\\\\matrix_slide_$i.png"
    $pres.Slides.Item($i).Export($outPng, 'PNG', 1280, 720)
    Write-Host "Exported Slide $i to $outPng"
}
$pres.Close()
$ppt.Quit()
`;

fs.writeFileSync("scratch/export_matrix.ps1", psScript, "utf8");
execSync("powershell -ExecutionPolicy Bypass -File scratch/export_matrix.ps1", { stdio: "inherit" });
console.log("Completed font matrix test!");
