const mongoose = require("mongoose");

const employeeschema = new mongoose.Schema({
    eID : String,
    email: String,
    name : String,
    expertise : String,
    assigned : Number,
    password : String
});

const employee = mongoose.model("employee" , employeeschema);
module.exports = employee; 