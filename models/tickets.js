const mongoose = require("mongoose");

const ticketschema = new mongoose.Schema({
    ticketID : String,
    title : String,
    description : String,
    priority : String
});

const tickets = mongoose.model("tickets" , ticketschema);
module.exports = tickets; 