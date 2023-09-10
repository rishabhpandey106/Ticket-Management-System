const express = require("express");
const path = require("path");
const app = express();
const session = require("express-session");
const db = require("./models/db");
const clientmodel = require("./models/client");
const ticketmodel = require("./models/tickets");
const employeemodel = require("./models/employee");
const adminmodel = require("./models/admin")
const msgmodel = require("./models/messages");
const http = require("http");
const socketIO = require("socket.io");
const nodemailer = require('nodemailer');

// const multer = require("multer");
// const upload = multer({ dest: "uploads/" });
const multer = require("multer");

const multerstorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        const fileExtension = file.originalname.split(".").pop();
        const uniqueFileName = Date.now() + "-" + file.fieldname + "." + fileExtension;
        cb(null, uniqueFileName);
    },
});

const upload = multer({ storage : multerstorage });
// app.use(upload.single("ticket-chat-img"));


// app.use(express.static(path.join(__dirname, "static")));
app.use(express.static("static"));
app.use('/uploads', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    secret: 'ticketraise',
    resave: false,
    saveUninitialized: true
}));


app.get("/", function (req, res) {
    // employeemodel.create({eID : "5734" , email : "shivam@ticket.com" , name: "shivam" , expertise: "hardware" , assigned: 25});
    // ticketmodel.create({ticketID: "1234" , title: "title" , description:"desc" , priority: "high" , department: "software" , assignedto: "2473" , email: "title@gmail.com"});
    if(!req.session.isloggedin)
    {
        res.redirect("/login");
    }
    res.sendFile(path.join(__dirname, "views/index.html"));
});

app.get("/login" , function(req , res){
    res.sendFile(path.join(__dirname, "views/login.html"));
})

app.post("/emp-login-data" , async function(req , res) {
    const { email, password } = req.body;

    const empcred = await employeemodel.findOne({email : email , password : password});
    if(!empcred){
        console.log("No suitable employee found to assign the email.");
        res.status(500).send("error");
        return;
    }
    else
    {
        req.session.isemploggedin = true;
        req.session.email = email;
        res.redirect("/et");
    }
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

app.post("/client-login-data" , async function(req , res) {
    const { email, password } = req.body;

    const clientcred = await clientmodel.findOne({email : email , password : password});
    if(!clientcred){
        console.log("No suitable client found to assign the email.");
        res.status(500).send("error");
        return;
    }else{
        req.session.isloggedin = true;
        req.session.email = email;
        res.redirect("/");
    }
})

app.post("/admin-login-data" , async function(req , res) {
    const { email, password } = req.body;

    const admincred = await adminmodel.findOne({email : email , password : password});
    if(!admincred){
        console.log("No suitable admin found to assign the email.");
        res.status(500).send("error");
        return;
    }else{
        req.session.isadminloggedin = true;
        req.session.email = email;
        res.redirect("/admin");
    }
})

app.get("/admin-login" , function(req , res){
    res.sendFile(__dirname + "/views/admin-login.html")
})

app.post("/client-signup-data" , async function(req , res) {
    const {email , password} = req.body;
    try{
        await clientmodel.create({email , password});
        console.log("Data saved successfully");
        res.redirect("/");
    } catch (error) {
        console.error("Error saving data:", error);
        res.status(500).send("error");
    }
})
app.get("/logout" , function(req , res) {
    req.session.isloggedin = false;
    req.session.isemploggedin = false;
    res.redirect("/login");
})

app.get("/add-anyone" , function(req , res){
    res.sendFile(__dirname + "/views/add-emp.html")
})

app.get("/static/add-emp.js" , function(req , res){
    res.sendFile(__dirname + "/static/add-emp.js")
})

app.post("/employee-cred" , async function(req , res){
    const {eID , email , name , expertise , password} = req.body;
    console.log(req.body);
    const assigned = 25;
    try
    {
        await employeemodel.create({
            eID,
            email,
            name,
            expertise,
            assigned: 25,
            password
        });
        console.log("data saved");
        sendEmail(email, password);
        res.redirect("/add-anyone?success=true");
    }
    catch{
        // console.error("error : ",error);
        res.static(500).send("error");
    }

})

function sendEmail(to, password) {

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        logger: true,
        debug: true,
        secureConnection: false,
        auth: {
            user: 'rishabhpandey230@gmail.com',
            pass: '******',
        },
        tls: {
            rejectUnauthorized: true
        }
    });

    const mailOptions = {
        from: 'rishabhpandey230@gmail.com',
        to,
        subject: 'Employee Registration',
        text: `Your registration was successful. Your login credentials are:\nEmail: ${to}\nPassword: ${password}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}


app.post("/admin-cred" , async function(req , res) {
    const {adminid , name , email , password} = req.body;
    console.log(req.body);
    try
    {
        await adminmodel.create({
            adminid,
            name,
            email,
            password
        });
        console.log("data saved");
        res.redirect("/add-anyone");
    }
    catch
    {
        console.error("error: ",error);
    }
})

app.post("/delete-ticket" , async function(req , res) {
    console.log("serevr side delete" , req.body);
    const { ticketID } = req.body;
    const deleted = await ticketmodel.findOne({ticketID: ticketID});
    console.log("server side - " , deleted);
    const {status} = deleted;
    // deleted.status = 'close';
    // await deleted.save();
    // res.redirect("/tickets");

    if (deleted) {
        deleted.status = 'close';
        await deleted.save();
        res.json({ message: "Ticket deleted successfully" });
    } else {
        res.status(404).json({ message: "Ticket not found" });
    }
});


app.post("/add-ticket", async function (req, res) {
    const {ticketID, title, description, priority , department , assignedto , email , status} = req.body;
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
        assignedto: employee.eID,
        email: req.session.email,
        status
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

// app.post("/add-ticket", async function (req, res) {
//     const { ticketID, title, description, priority, department, status } = req.body;

//     // Find an employee with expertise in the given department
//     const employee = await Employee.findOne({ expertise: department, assigned: { $gt: 0 } })
//                                     .sort({ assigned: 1 });

//     if (!employee) {
//         console.log("No suitable employee found to assign the ticket.");
//         res.status(500).send("error");
//         return;
//     }

//     // Decrement the assigned count of the assigned employee
//     employee.assigned--;
//     await employee.save();

//     // Create a new ticket instance
//     const newTicket = new Ticket({
//         ticketID,
//         title,
//         description,
//         priority,
//         department,
//         assignedto: employee.eid,
//         status
//     });

//     try {
//         // Save the new ticket to the database
//         await newTicket.save();

//         console.log("Data saved successfully");
//         res.status(200).send("success");
//     } catch (error) {
//         console.error("Error saving data:", error);
//         res.status(500).send("error");
//     }
// });


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

        const auth = req.session.email;

        const ticketAndEmployeeDetails = {
            ticket,
            employee,
            auth
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
    if (req.session.isemploggedin) {
        res.sendFile(__dirname + '/views/tickets.html');
    } else if (req.session.isloggedin) {
        res.sendFile(__dirname + '/views/tickets.html');
    } else {
        res.sendFile(path.join(__dirname, "views/login.html"));
    }
});

app.get('/employee', function(req, res) {
    res.sendFile(__dirname + '/views/emp-login.html');
});

app.get('/get-tickets', async function(req, res) {
    try {
        const tickets = await ticketmodel.find({email: req.session.email});
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

app.get("/static/admin-add.js" , function(req , res){
    res.sendFile(__dirname + "/static/admin-add.js");
})

app.get("/ticket", function (req, res) {
    if(!req.session.isloggedin)
    {
        res.sendFile(path.join(__dirname, "views/login.html"));
    }
    res.sendFile(__dirname + "/views/eachticket.html");
});

app.get("/empticket", function (req, res) {
    if(!req.session.isemploggedin)
    {
        res.sendFile(path.join(__dirname, "views/emp-login.html"));
    }
    res.sendFile(__dirname + "/views/eachticket.html");
});

app.get("/admin" , function(req, res) {
    res.sendFile(__dirname + "/views/admin-add.html");
})

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

app.get("/signup" , function(req , res) {
    res.sendFile(__dirname + "/views/signup.html")
});

app.get('/get-employees', async (req, res) => {
    try {
        const employees = await employeemodel.find();
        res.json(employees);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching employees' });
    }
});

app.get('/get-alltickets', async (req, res) => {
    const employeeId = req.query.employeeId;

    try {
        const tickets = await ticketmodel.find({ assignedto: employeeId });
        res.json(tickets);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching tickets' });
    }
});

app.get("/graph-data", async (req, res) => {
    try {
        const tickets = await ticketmodel.find();
        res.json(tickets);
    } catch (error) {
        console.error("Error fetching ticket data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

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
        app.post("/upload", upload.single("file"), async (req, res) => {
            // Handle the uploaded file in req.file
            // You can save it to a directory or process it further
            const sender = req.body.sender;
            const messageContent = req.body.message;
            const room = req.body.room;
            const uploadedFile = req.file?req.file:null;

            console.log(req.body , "--" , sender , messageContent , uploadedFile , room)
            const message = {
                sender: sender,
                content: messageContent,
                file: uploadedFile,
                url: uploadedFile?`uploads/${uploadedFile.filename}`:null  
            };
            
            if(message.file)
            {
                const msgs = {
                    sender: message.sender,
                    messageContent: message.url, // Assuming you store the content here
                    ticketID: room,
                    timestamp: new Date() // You can customize the timestamp logic
                };
                try {
                    await msgmodel.create(msgs);
                    console.log("Message saved to the database");
                } catch (error) {
                    console.error("Error saving message to the database:", error);
                }
            }
            else
            {
                const msgs = {
                    sender: message.sender,
                    messageContent: message.content, // Assuming you store the content here
                    ticketID: room,
                    timestamp: new Date() // You can customize the timestamp logic
                };
                try {
                    await msgmodel.create(msgs);
                    console.log("Message saved to the database");
                } catch (error) {
                    console.error("Error saving message to the database:", error);
                }
            }

            io.to(room).emit("chat-message", message.sender, message);
        
            // res.json({ message: "File uploaded successfully" });
        });

        app.get("/chat-history/:ticketID", async (req, res) => {
            const room = req.params.ticketID;
            try {
                const chatHistory = await msgmodel.find({ ticketID: room}).sort({ timestamp: 1 });
                res.json(chatHistory);
            } catch (error) {
                console.error("Error fetching chat history:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
        

        const io = require("socket.io")(server);
        
        io.on("connection", (socket) => {
            console.log("A user connected" , socket.id);

            socket.on("join-room", (room) => {
                socket.join(room); // Join the specified room
            });

            socket.on("chat-message", async (room, message) => {
                // Emit the message to only the participants in the room
                console.log(socket.id , ":" , message);
                
                // if (message.file) {
                //     // Handle file upload using Multer
                //     const uploadedFile = await handleFileUpload(message.file);
                //     // const dataUrl = createDataUrlFromBuffer(uploadedFile.buffer);
                //     const fileMessage = {
                //         type: "file",
                //         url: `/uploads/${uploadedFile.filename}`
                //     };
                //     // message.file = uploadedFile.filename;             
    
                //     io.to(room).emit("chat-message", message.sender , fileMessage.url);
                // }
                // else
                // {
                //     io.to(room).emit("chat-message", message.sender, { text: message.content });
                // }

                if(message.file)
                {
                    const fileMessage = {
                                type: "file",
                                url: `uploads/${message.file.filename}`
                            };

                    io.to(room).emit("chat-message", message.sender, fileMessage );
                }                   
                else
                {
                    io.to(room).emit("chat-message", message.sender, message.content );
                }
                    
                socket.broadcast.to(room).emit("notification", "New message received");
            });

            // async function handleFileUpload(file) {
            //     // Define a promise-based version of the multer's upload function
            //     return new Promise((resolve, reject) => {
            //         upload.single("file")(file, null, async function (err) {
            //             if (err) {
            //                 reject(err);
            //             } else {
            //                 resolve(file);
            //             }
            //         });
            //     });
            // }

            // function createDataUrlFromBuffer(buffer) {
            //     return buffer.toString("base64");
            // }

            socket.on("disconnect", () => {
                console.log("A user disconnected");
            });
        });
    })
    .catch(function(error) {
        console.log(error);
    });

