const express = require("express");
const connectDB = require("./config/database")
const app = express(); //creating the express server
const User = require("./models/user");

app.post("/signup", async (req, res) => {
    //Creating a new instance of User model
    const user = new User({
        firstName: "Sachin",
        lastName: "Tendulkar",
        emailId: "sachin@gmail.com",
        password: "sachin@12"
    });
    try {
        await user.save();
        res.send("User added successfully.");
    }catch (err) {
        res.status(400).send("Error saving the user: "+ err.message);
    }
});


connectDB()
    .then(() => {
        console.log("Database connection established");
        app.listen(7777, () => {
            console.log("Server is successfully listening on port 7777...");
        });
    }).catch(() => {
        console.log("Database can't be connected");
    });

