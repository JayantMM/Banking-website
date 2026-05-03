const http = require("http");

const server = http.createServer((req, res) => {
    if (req.url === "/users") {
        res.write("USERS WORKING ✅");
        res.end();
    } else {
        res.write("HOME WORKING ✅");
        res.end();
    }
});

server.listen(3000, () => {
    console.log("SERVER RUNNING ON 3000");
});