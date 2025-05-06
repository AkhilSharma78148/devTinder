const express = require("express");
const connectDB = require("./config/database")
const app = express(); //creating the express server
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    
    try {
        //validation of data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password } = req.body;

        //Encypt the password
        const passwordHash = await bcrypt.hash(req.body.password, 10);

        //Creating a new instance of User model
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        await user.save();
        res.send("User added successfully.");
    }catch (err) {
        res.status(400).send("Error saving the user: "+ err.message);
    }
});

app.post("/login", async (req, res) => {
    try  {
        const { emailId, password } = req.body; 

        const user = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("Invalid credentails");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(isPasswordValid) {
            //create jwt token
            const token = await jwt.sign({ _id: user._id }, "DEVTEAM@123");
            console.log(token);

            //Add the token to cookie and send the response back to user
            res.cookie("token", token);
            res.send("Login Successful!!");
        } else {
            throw new Error("Invalid credentails");
        }
    } catch(err) {
        res.status(400).send("Error: "+err.message);
    }
}); 

app.get("/profile", async (req, res) => {
    try {
        const cookies = req.cookies;
    
        const { token } = cookies;
        if(!token) {
            throw new Error("Token not found");
        }
        //Validate my token
        const decodedMessage = await jwt.verify(token, "DEVTEAM@123");
        const { _id } = decodedMessage;
        const user = await User.findById(_id);
        if(!user) {
            throw new Error("User not found");
        }
        res.send(user);
    } catch(err) {
        res.status(400).send("Some error: " + err.message);
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
app.patch("/update/:userId", async (req, res) => {
    const userId = req.params?.userId;
    const data = req.body;
    try {
        const ALLOWED_UPDATES = [
            "photoUrl",
            "gender",
            "age",
            "skills"
        ];

        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );
    
        if(!isUpdateAllowed) {
            throw new Error("Update not allowed");
        }

        if(data?.skills.length > 10) {
            throw new Error("Skills cannot be more than 10");
        }

        const user = await User.findByIdAndUpdate( {_id: userId}, data, {
            returnDocument: "before",
            runValidators: true
        });
        console.log(user);
        res.send("User updated successfully.");
    } catch(err) {
        res.status(400).send("Some error: "+ err.message);
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

