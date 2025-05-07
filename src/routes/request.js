const express = require("express");

const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");


requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
    req.send("Hi");
});

module.exports = {
    requestRouter
}