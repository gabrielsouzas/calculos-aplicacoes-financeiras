const http = require('http');
const fs = require('fs');
const path = require('path');

// SERVIDOR HTTP
const PORT = 8080;

const server = http.createServer((request, response) => {
    let filePath = "." + request.url;
    if (filePath === "./") {
        filePath = "./index.html";
    }

    const extname = path.extname(filePath);
    let contentType = "text/html";
    switch (extname) {
        case ".js":
            contentType = "text/javascript";
            break;
        case ".css":
            contentType = "text/css";
            break;
    }

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code == "ENOENT") {
                response.writeHead(404, { "Content-Type": "text/html" });
                response.end("<h1>404 Not Found</h1>");
            } else {
                response.writeHead(500);
                response.end(`Internal Server Error: ${error.code}`);
            }
        } else {
            response.writeHead(200, { "Content-Type": contentType });
            response.end(content, "utf-8");
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
  });