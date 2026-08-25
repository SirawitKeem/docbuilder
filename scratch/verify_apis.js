const http = require("http");

function fetchJson(urlPath) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${urlPath}`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    }).on("error", reject);
  });
}

async function verify() {
  const profiles = await fetchJson("/api/field-profiles");
  console.log("GET /api/field-profiles Status:", profiles.status, "Count:", profiles.data?.length);

  const docs = await fetchJson("/api/documents");
  console.log("GET /api/documents Status:", docs.status, "Count:", docs.data?.length);

  const quotations = await fetchJson("/api/quotations");
  console.log("GET /api/quotations Status:", quotations.status, "Count:", quotations.data?.length);
}

verify().catch(console.error);
