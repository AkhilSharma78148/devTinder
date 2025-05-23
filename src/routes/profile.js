const express = require("express");

const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");

profileRouter.get("/profile", userAuth, async (req, res) => {
    try {
        const user = req.user;
        res.send(user);
    } catch(err) {
        res.status(400).send("Some error: " + err.message);
    }
});

profileRouter.patch("/profile/edit", userAuth, async(req, res) => {
    try {
        //validate the data
        if(!validateEditProfileData(req)) {
            throw new Error("Invalid edit request");
        }

        const loggedInUser = req.user; //as data is set in user middleware

        Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

        await loggedInUser.save();
        res.json({
            message: `${loggedInUser.firstName}, your profile updated successfuly.`,
            data: loggedInUser
        });
    } catch(err) {
        res.status(400).send("Error: "+err.message);
    }
});

module.exports = profileRouter;