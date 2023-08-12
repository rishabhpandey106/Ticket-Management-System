const mongoose = require("mongoose");

const employeeschema = new mongoose.Schema({
    eID : String,
    name : String,
    expertise : String,
    assigned : Number
});

const employee = mongoose.model("employee" , employeeschema);
module.exports = employee; 