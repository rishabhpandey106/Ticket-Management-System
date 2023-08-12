const express = require("express");
const path = require("path");
const app = express();
// const session = require("express-session");
const db = require("./models/db");
const ticketmodel = require("./models/tickets");
const employeemodel = require("./models/employee");

// app.use(express.static(path.join(__dirname, "static")));
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// app.use(session({
//     secret: 'ticketraise',
//     resave: false,
//     saveUninitialized: true
// }));

app.get("/", function (req, res) {
    // employeemodel.create({eID : "1548" , name: "rahul" , expertise: "hardware" , assigned: 25});
    res.sendFile(path.join(__dirname, "views/index.html"));
});

app.post("/add-ticket", async function (req, res) {
    const {ticketID, title, description, priority , department , assignedto } = req.body;
    console.log("Received data:", req.body);
    try
    {
    const employee = await employeemodel.findOne({ expertise: department, assigned: { $gt: 0 } }).sort({ assigned: -1 });
    const {eID, name , expertise , assigned } = employee;
    console.log(employee);
    if (!employee) {
        console.log("No suitable employee found to assign the ticket.");
        res.status(500).send("error");
        return;
    }
    ;
    employee.assigned--;
    await employee.save();

    const newTicketData = {
        ticketID,
        title,
        description,
        priority,
        department,
        assignedto: employee.eID
    };
    console.log(newTicketData);
    await ticketmodel.create(newTicketData);
        console.log("Data saved successfully");
        res.redirect("/");
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).send("error");
    }

    // ticketmodel.create(req.body)
    //     .then(function () {
    //         console.log("Data saved successfully");
    //         res.redirect("/");
    //     })
    //     .catch(function (error) {
    //         console.error("Error saving data:", error);
    //         res.status(500).send("error");
    //     });
});

app.post("/add-ticket", async function (req, res) {
    const { ticketID, title, description, priority, department } = req.body;

    // Find an employee with expertise in the given department
    const employee = await Employee.findOne({ expertise: department, assigned: { $gt: 0 } })
                                    .sort({ assigned: 1 });

    if (!employee) {
        console.log("No suitable employee found to assign the ticket.");
        res.status(500).send("error");
        return;
    }

    // Decrement the assigned count of the assigned employee
    employee.assigned--;
    await employee.save();

    // Create a new ticket instance
    const newTicket = new Ticket({
        ticketID,
        title,
        description,
        priority,
        department,
        assignedto: employee.eid
    });

    try {
        // Save the new ticket to the database
        await newTicket.save();

        console.log("Data saved successfully");
        res.status(200).send("success");
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).send("error");
    }
});







app.get("/each-ticket/:id", async function (req, res) {
    const ticketID = req.params.id;

    try 
    {
        const ticket = await ticketmodel.findOne({ ticketID });
        console.log(ticket);
        if (!ticket) {
            res.status(404).json({ error: "Ticket not found" });
            return;
        }
        console.log(ticket.assignedto);
        const employee = await employeemodel.findOne({ eID: ticket.assignedto });
        console.log(employee);
        if (!employee) {
            res.status(404).json({ error: "Employee not found" });
            return;
        }

        const ticketAndEmployeeDetails = {
            ticket,
            employee
        };

        res.status(200).json(ticketAndEmployeeDetails);
    } catch (error) {
        console.error("Error fetching ticket details:", error);
        res.status(500).json({ error: "An error occurred while fetching ticket details" });
    }
    // ticketmodel.findOne({ ticketID }).then(function (ticket) {
    //     console.log(ticket);
    //     res.status(200).json(ticket);
    // }).catch(function(error){
    //     console.error("Error fetching ticket details:", err);
    //     res.status(500).json({ error: "An error occurred while fetching ticket details" });
    // });
});

app.get('/tickets', function(req, res) {
    res.sendFile(__dirname + '/views/tickets.html');
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
    res.sendFile(__dirname + "/views/eachticket.html");
});

app.get("/add-ticket" , function(req , res) {
    res.sendFile(__dirname + "/views/index.html")
})

app.get("/static/index.js" , function(req , res){
    res.sendFile(__dirname + "/static/index.js");
})

app.get("/styles.css" , function(req, res) {
    res.sendFile(__dirname + "/views/styles.css");
})

db.init().then(function () {
    console.log("database connected");
    app.listen(3000 , function () {
        console.log("local host 3000");
    });
}).catch(function(error) {
    console.log(error);
});
