const mongoose = require("mongoose");

const connectDB = async() => {
    await mongoose.connect(
        "mongodb+srv://nodejspractise:bXMzoXx4G4A3irfe@nodepractise.oyyadyt.mongodb.net/devTinder" //refering to mongodb cluster
    );
    //devTinder is the database refer to this cluseter
};

module.exports = connectDB;