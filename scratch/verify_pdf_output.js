const fs = require("fs");
const pdfParse = require("pdf-parse");

async function checkPdf() {
  const dataBuffer = fs.readFileSync("scratch/test_output.pdf");

  const render_page = (pageData) => {
    let render_options = {
      normalizeWhitespace: false,
      disableCombineTextItems: false,
    };
    return pageData.getTextContent(render_options).then(function (textContent) {
      let lastY, text = "";
      for (let item of textContent.items) {
        if (lastY == item.transform[5] || !lastY) {
          text += item.str + " ";
        } else {
          text += "\n" + item.str + " ";
        }
        lastY = item.transform[5];
      }
      return text;
    });
  };

  const options = {
    pagerender: render_page,
  };

  const data = await pdfParse(dataBuffer, options);
  console.log("PDF Total Pages:", data.numpages);
  console.log("\n--- Full PDF Text Content ---");
  console.log(data.text);
}

checkPdf().catch(console.error);
