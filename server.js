import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

const server = http.createServer((req, res) => {
  const cleanUrl = (req.url || "/").split("?")[0];
  const relPath = cleanUrl === "/" ? "/index.html" : cleanUrl;
  const filePath = path.join(__dirname, relPath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      fs.readFile(path.join(__dirname, "404.html"), (_err404, content404) => {
        res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
        res.end(content404 || "404 Not Found");
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Aegyra Sanctum listening on http://localhost:${PORT}`);
});
