const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
    sender: String,
    messageContent: String,
    ticketID: String,
    timestamp: { type: Date, default: Date.now }
});

const messages = mongoose.model("messages", messagesSchema);

module.exports = messages;
