const express = require("express");
const app = express();

// simple route
app.get("/", (req, res) => {
    res.send("Home Working ✅");
});

// users route
app.get("/users", (req, res) => {
    res.send("Users Working ✅");
});

// start server
app.listen(3000, () => {
    console.log("SERVER STARTED");
});