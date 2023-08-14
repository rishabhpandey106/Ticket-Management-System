const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const db = require("./models/db");
const ticketmodel = require("./models/tickets");
const employeemodel = require("./models/employee");
const http = require("http");
const socketIO = require("socket.io");

// app.use(express.static(path.join(__dirname, "static")));
app.use(express.static("static"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'ticketraise',
    resave: false,
    saveUninitialized: true
}));


app.get("/", function (req, res) {
    // employeemodel.create({eID : "5734" , email : "shivam@ticket.com" , name: "shivam" , expertise: "hardware" , assigned: 25});
    res.sendFile(path.join(__dirname, "views/index.html"));
});

app.post("/emp-login-data" , async function(req , res) {
    const { email, password } = req.body;

    const empcred = await employeemodel.findOne({email : email});
    if(!empcred){
        console.log("No suitable employee found to assign the email.");
        res.status(500).send("error");
        return;
    }
    
    req.session.isloggedin = true;
    req.session.email = email;
    res.redirect("/et");
    // myfun.checkcred({email , password} , function(err , isvalid) {
    //     if(err) {
    //         res.status(500).send("error");
    //         return;
    //     }
    //     else
    //     {
    //         if(isvalid)
    //         {
    //             req.session.isloggedin = true;
    //             req.session.email = email;
    //             res.redirect("./views/employeetickets.html");
    //         }
    //         else
    //         {
    //             // using when sending status code and a error message on another page
    //             return res.status(401).json({ success: false, message: 'Invalid credentials' });

    //             // using template engine like ejs.
    //             // res.render("login" , {error : "Invalid Email or Password"});
    //         }
    //     }
    // });
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

app.get('/employee', function(req, res) {
    res.sendFile(__dirname + '/views/emp-login.html');
});

app.get('/get-tickets', async function(req, res) {
    try {
        const tickets = await ticketmodel.find();
        res.status(200).json(tickets);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});

app.get('/get-emp-tickets', async function(req, res) {
    try {
        const empid = await employeemodel.findOne({email : req.session.email});
        const tickets = await ticketmodel.find({assignedto: empid.eID }); // req.session.eid = eID fetch through employee db
        res.status(200).json(tickets);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching tasks' });
    }
});

app.get("/static/tickets.js" , function(req , res){
    res.sendFile(__dirname + "/static/tickets.js");
})

app.get("/static/employeetickets.js" , function(req , res){
    res.sendFile(__dirname + "/static/employeetickets.js");
})

app.get("/static/eachticket.js" , function(req , res){
    res.sendFile(__dirname + "/static/eachticket.js");
}) 

app.get("/ticket", function (req, res) {
    res.sendFile(__dirname + "/views/eachticket.html");
});

app.get("/empticket", function (req, res) {
    res.sendFile(__dirname + "/views/eachticket.html");
});

app.get("/et" , function(req, res) {
    res.sendFile(__dirname + "/views/employeetickets.html");
})

app.get("/add-ticket" , function(req , res) {
    res.sendFile(__dirname + "/views/index.html")
})

app.get("/static/index.js" , function(req , res){
    res.sendFile(__dirname + "/static/index.js");
})

app.get("/styles.css" , function(req, res) {
    res.sendFile(__dirname + "/views/styles.css");
})

// db.init().then(function () {
//     console.log("database connected");
//     app.listen(3000 , function () {
//         console.log("local host 3000");
//     });
// }).catch(function(error) {
//     console.log(error);
// });
db.init()
    .then(function () {
        console.log("database connected");

        // Start the Express server
        const server = app.listen(3000, function () {
            console.log("local host 3000");
        });

        // Initialize Socket.IO
        const io = require("socket.io")(server);

        io.on("connection", (socket) => {
            console.log("A user connected" , socket.id);

            socket.on("join-room", (room) => {
                socket.join(room); // Join the specified room
            });

            socket.on("chat-message", (room, message) => {
                // Emit the message to only the participants in the room
                console.log(socket.id , ":" , message);
                io.to(room).emit("chat-message", message.sender , message.content);
            });

            socket.on("disconnect", () => {
                console.log("A user disconnected");
            });
        });
    })
    .catch(function(error) {
        console.log(error);
    });

