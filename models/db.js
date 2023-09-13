const mongoose = require('mongoose');

module.exports.init = async function () 
{
    await mongoose.connect('mongodb+srv://jaiyaxh:HO4k5AFZfg3nEpKx@todoapp.abmtknx.mongodb.net/ticketlist?retryWrites=true&w=majority')
    
}