const express = require("express");

const app = express();

app.get("/", (req, res) => {
    res.send("HOME WORKING ✅");
});

app.get("/users", (req, res) => {
    res.send("USERS WORKING ✅");
});

app.listen(3000, () => {
    console.log("SERVER STARTED...");
});

// KEEP SERVER ALIVE (IMPORTANT)
setInterval(() => {}, 1000);