const express = require("express");
const path = require("path");
const app = express();
const db = require("./models/db");
const ticketmodel = require("./models/tickets");

// app.use(express.static(path.join(__dirname, "static")));
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/add-ticket", function (req, res) {
    console.log("Received data:", req.body);

    ticketmodel.create(req.body)
        .then(function () {
            console.log("Data saved successfully");
            res.redirect("/");
        })
        .catch(function (error) {
            console.error("Error saving data:", error);
            res.status(500).send("error");
        });
});

app.get("/each-ticket/:id", function (req, res) {
    const ticketID = req.params.id;
    ticketmodel.findOne({ ticketID }).then(function (ticket) {
        console.log(ticket);
        res.status(200).json(ticket);
    }).catch(function(error){
        console.error("Error fetching ticket details:", err);
        res.status(500).json({ error: "An error occurred while fetching ticket details" });
    });
});

app.get('/tickets', function(req, res) {
    res.sendFile(__dirname + '/tickets.html');
});

app.get('/get-tickets', async function(req, res) {
    try {
        const tickets = await ticketmodel.find();
        res.status(200).json(tickets);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});

app.get("/static/tickets.js" , function(req , res){
    res.sendFile(__dirname + "/static/tickets.js");
})

app.get("/static/eachticket.js" , function(req , res){
    res.sendFile(__dirname + "/static/eachticket.js");
})

app.get("/ticket", function (req, res) {
    res.sendFile(__dirname + "/eachticket.html");
});

app.get("/add-ticket" , function(req , res) {
    res.sendFile(__dirname + "/index.html")
})

app.get("/static/index.js" , function(req , res){
    res.sendFile(__dirname + "/static/index.js");
})

app.get("/styles.css" , function(req, res) {
    res.sendFile(__dirname + "/styles.css");
})

db.init().then(function () {
    console.log("database connected");
    app.listen(3000 , function () {
        console.log("local host 3000");
    });
}).catch(function(error) {
    console.log(error);
});
