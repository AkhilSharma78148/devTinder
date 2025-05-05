console.log("Dev tinder app");

const express = require("express");

const app = express(); //creating the server

app.use("/", (req, res) => {
    res.send("Namaste Akhil!");
});

app.use("/hello", (req, res) => {
    res.send("Hello from the server");
});

app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777...");
});