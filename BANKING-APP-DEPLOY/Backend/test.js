const express = require("express");
const app = express();

app.get("/", (req, res) => {
    res.send("Hello Working ✅");
});

app.get("/users", (req, res) => {
    res.send("Users Page Working ✅");
});

app.listen(3000, () => {
    console.log("Server running...");
});