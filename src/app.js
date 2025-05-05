console.log("Dev tinder app");

const express = require("express");
const { adminAuth, userAuth } = require("./middlewares/auth");

const app = express(); //creating the express server

// app.use("/", (req, res) => {
//     res.send("Namaste Akhil!");
// });

// app.use(
//     "/user", 
//     (req, res, next) => {
//         //route handler
//         // res.send("Route handler1");
//         next();
//     },
//     (req, res) => {
//         res.send("Route handler2");
//     }
// );

// app.use("/hello", (req, res) => {
//     res.send("Hello from the server");
// });

// app.get("/abc", (req, res) => {
//     res.send({"firstname": "Akhil", "lastname": "Sharma"});
// });

// // app.get("/ab?c", (req, res) => {
// //     res.send({"firstname": "Akhil", "lastname": "Sharma"});
// // });

// app.get("/user", (req, res) => {
//     console.log(req.query);
//     res.send({"firstname": "Vijay", "lastname": "Kumar"});
// });

// app.get("/data/:userId/:name/:password", (req, res) => {
//     console.log(req.query);
//     res.send({"firstname": "Vijay", "lastname": "Kumar"});
// });

// Handle Auth Middleware for all GET, POST, DELETE
app.use("/admin", adminAuth);

app.get("/admin/getAllData", (req, res) => {
    res.send("Admin get all data");
});

app.get("/user/login", (req, res) => {
    console.log(req.query);
    res.send("Login User");
});

app.get("/user/data", userAuth , (req, res) => {
    console.log(req.query);
    res.send({"firstname": "Vijay", "lastname": "Kumar"});
});

app.get("/admin/deleteData", (req, res) => {
    res.send("Admin delete the data");
});

app.listen(7777, () => {
    console.log("Server is successfully listening on port 7777...");
});