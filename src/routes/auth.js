const express = require("express");
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth");

authRouter.post("/signup", async (req, res) => {
    
    try {
        //validation of data
        validateSignUpData(req);

        const { firstName, lastName, emailId, password, age } = req.body;

        //Encypt the password
        const passwordHash = await bcrypt.hash(req.body.password, 10);

        //Creating a new instance of User model
        const user = new User({
            firstName,
            lastName,
            age,
            emailId,
            password: passwordHash
        });

        await user.save();
        res.send("User added successfully.");
    }catch (err) {
        res.status(400).send("Error saving the user: "+ err.message);
    }
});

authRouter.post("/login", async (req, res) => {
    try  {
        const { emailId, password } = req.body; 

        const user = await User.findOne({emailId: emailId});
        if(!user) {
            throw new Error("Invalid credentails");
        }

        const isPasswordValid = await user.validatePassword(password);
        if(isPasswordValid) {
            const token = await user.getJWT();
            
            //Add the token to cookie and send the response back to user
            res.cookie("token", token, {expires: new Date(Date.now() + 8 * 3600000)}); // // cookie will be removed after 8 hours
            res.send("Login Successful!!");
        } else {
            throw new Error("Invalid credentails");
        }
    } catch(err) {
        res.status(400).send("Error: "+err.message);
    }
}); 

authRouter.get("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.send("Logout successful.");
});


module.exports = authRouter;