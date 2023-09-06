const mongoose = require("mongoose");

const clientschema = new mongoose.Schema({
    email : String,
    password : String
});

const clients = mongoose.model("clients" , clientschema);
module.exports = clients; 