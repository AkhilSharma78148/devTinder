const express = require("express");
const connectDB = require("./config/database")
const app = express(); //creating the express server
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
    //Creating a new instance of User model
    const user = new User(req.body);
    try {
        await user.save();
        res.send("User added successfully.");
    }catch (err) {
        res.status(400).send("Error saving the user: "+ err.message);
    }
});

//Get user by email
app.get("/user", async (req, res) => {
    const userEmail = req.body.emailId;
    try {
        const user = await User.findOne({ emailId : userEmail });
        if(!user) {
            res.status(404).send("User not found");
        } else {
            res.send(user);   
        }
    } catch(err) {
        res.status(400).send("Something went wrong");
    }

    // try {
    //     const users = await User.find({ emailId : userEmail });
    //     if(users.length) {
    //         res.send(users);
    //     } else {
    //         res.status(404).send("User not found");
    //     }
    // } catch(err) {
    //     res.status(400).send("Something went wrong");
    // }
    
});

//Feed API - GET /feed get the users from database
app.get("/feed", async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch(error) {
        res.status(400).send("Something went wrong");
    }
});

//Delete API - delete user from database
app.delete("/delete", async (req, res) => {
    const userID = req.body.userID;
    try {
        const user = await User.findByIdAndDelete({"_id": userID});
        // const user = User.findByIdAndDelete(userID);
        res.send("User delete successfully.")
    } catch(err) {
        res.status(500).send("Something went wrong");
    }
});

//Patch API - update data of a user
app.patch("/update", async (req, res) => {
    const userId = req.body.userId;
    const data = req.body;
    try {
        const user = await User.findByIdAndUpdate( {_id: userId}, data, {
            returnDocument: "before",
        });
        console.log(user);
        res.send("User updated successfully.");
    } catch(err) {
        res.status(400).send("Something went wrong");
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

