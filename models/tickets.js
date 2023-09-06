const mongoose = require("mongoose");

const ticketschema = new mongoose.Schema({
    ticketID : String,
    title : String,
    description : String,
    priority : String,
    department : String,
    assignedto : String,
    email : String,
    status : String
});

const tickets = mongoose.model("tickets" , ticketschema);
module.exports = tickets; 