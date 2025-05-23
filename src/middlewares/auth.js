const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => { // <-- added 'next' here
    try {
        //Read the token from req cookies //Validate the token
        //Find the user
        const { token } =  req.cookies;
        if(!token) {
            return res.status(401).send('Please Login');
            // throw new Error("Invalid token");
        }
        
        const decodeObj = await jwt.verify(token, "DEVTEAM@123");
        const { _id } = decodeObj;
        const user = await User.findById(_id);
        if(!user) {
            return res.status(404).send('User not found');
        }
        req.user = user;
        next();
    } catch(err) {
        res.status(400).send("Error: "+err.message);
    }
};

module.exports = {
    userAuth
};
