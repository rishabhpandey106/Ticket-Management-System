const ticketID = new URLSearchParams(window.location.search).get("id");

// Function to fetch ticket details from the server
function fetchTicketDetails(ticketID) {
    return fetch(`/each-ticket/${ticketID}`)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error("Error fetching ticket details:", error));
}

// Function to update the HTML with ticket details
function updateTicketDetails(details) {
    const ticketid = document.getElementById("ticket-id");
    const ticketTitle = document.getElementById("ticket-title");
    const ticketDescription = document.getElementById("ticket-description");
    const ticketPriority = document.getElementById("ticket-priority");

    ticketid.innerText = ticketID;
    ticketTitle.innerText = details.title;
    ticketDescription.innerText = `Description: ${details.description}`;
    ticketPriority.innerText = `Priority: ${details.priority}`;
}

function updateEmployeeDetails(details) {
    const eName = document.getElementById("e-name");
    const eExpertise = document.getElementById("e-expertise");

    eName.innerText = details.name;
    eExpertise.innerText = `Expertise: ${details.expertise}`;
}

// Fetch and update ticket details on page load
document.addEventListener("DOMContentLoaded", async () => {
    const socket = io();

    const ticketDetails = await fetchTicketDetails(ticketID);
    const { ticket, employee , auth } = ticketDetails;
    console.log("delete krne wala eachticketjs ka - ",ticket);
    updateTicketDetails(ticket);
    updateEmployeeDetails(employee);

    const closebtn = document.getElementById("close-button");
    closebtn.addEventListener("click" , () => {
        alert("really wanna delete");
        fetch("/delete-ticket", {
        method: "POST",
        headers : {
            "Content-Type": "application/json",
        },
        body : JSON.stringify(ticket)
        }).then(async function(response){
            const resdata = response.json();
            console.log("deleted ticket- " , resdata);
            window.location.href = "/tickets";
        }).catch(function(error) {
            console.log(error);
        });
    });


    socket.emit("join-room", ticketID);

    if(auth === ticket.email)
    {
        sname = "User";
        if(ticket.status == 'close')
            document.getElementById("close-button").remove();
    }
    else
    {
        sname = employee.name;
        const nav1 = document.getElementById("nav1");
        const nav2 = document.getElementById("nav2");
        const nav3 = document.getElementById("nav3");
        const closebtn = document.getElementById("close-button");
        nav1.href = "/et";
        nav2.href = "/closed-tickets";
        nav3.remove();
        closebtn.remove();
    }

    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");
    const chatMessage = document.getElementById("chat-messages");

    fetch(`/chat-history/${ticketID}`)
    .then(response => response.json())
    .then(data => {
        data.forEach(message => {
            if(message.messageContent.startsWith("uploads/"))
            {
                const messageElement = document.createElement("div");
                messageElement.innerHTML = `${message.sender}: `
                const fileLink = document.createElement("img");
                fileLink.src = message.messageContent;
                fileLink.style.maxHeight = "30%";
                fileLink.style.maxWidth = "30%";
                messageElement.appendChild(fileLink);
                chatMessage.appendChild(messageElement);
            }
            else
            {
                const messageElement = document.createElement("div");
                messageElement.innerText = `${message.sender}: ${message.messageContent}`;
                chatMessage.appendChild(messageElement);
            }
            
        });            
    })
    .catch(error => {
        console.error("Error fetching chat history:", error);
    });

    // sendButton.addEventListener("click", () => {
    //     const messageContent = messageInput.value;

    //     const fileInput = document.getElementById("file-input");
    //     const selectedFile = fileInput.files[0];
        
    //     const formData = new FormData();
    //     formData.append("file-input", fileInput.files[0]);
    //     if (messageContent.trim() !== "" || selectedFile) {
    //         const message = {
    //             sender : sname,
    //             content : messageContent,
    //             file: selectedFile
    //         }
    //         socket.emit("chat-message", ticketID , message);
    //         messageInput.value = "";
    //         fileInput.value = "";
    //     }
    // });


    // sendButton.addEventListener("click", () => {
        
    //     if (messageContent.trim() !== "") {
    
    //         const message = {
    //             sender: sname,
    //             content: messageContent
    //         };
            
    //         socket.emit("chat-message", ticketID, message);
    //         messageInput.value = "";
    //     }
    // });

    sendButton.addEventListener("click", async () => {
        const messageContent = messageInput.value;
        const fileInput = document.getElementById("file-input");
    
        if (messageContent.trim() !== "" || fileInput.files.length > 0) {
            const formData = new FormData();
            formData.append("file", fileInput.files[0]); // Append the file to the FormData
            
            formData.append("sender", sname);
            formData.append("room", ticketID);
            formData.append("message", messageContent);
            // if (messageContent.trim() !== "") {
            //     formData.append("message", messageContent);
            // }
    
            try {
                await fetch("/upload", {
                    method: "POST",
                    body: formData,
                });
    
                // Emit a chat-message event without the file content
                // const message = {
                //     sender: sname,
                //     content: messageContent
                // };
                
                // socket.emit("chat-message", ticketID, message);
                
                messageInput.value = "";
                fileInput.value = "";
            } catch (error) {
                console.error("Error uploading file:", error);
            }
        }
    });


    const chatMessages = document.getElementById("chat-messages");

    socket.on("chat-message", (sender, messageContent) => {
        console.log("client side" , messageContent)
        if (messageContent.file) {
            const messageElement = document.createElement("div");
            messageElement.innerHTML = `${sender}: Sent a file - `;
            
            const fileLink = document.createElement("img");
            fileLink.src = messageContent.url;
            console.log("image link" , messageContent.url);
            fileLink.style.maxHeight = "30%";
            fileLink.style.maxWidth = "30%";
            messageElement.appendChild(fileLink);
            chatMessages.appendChild(messageElement);
            
            fileLink.addEventListener("click" , function(req , res) {
                const downloadLink = document.createElement("a");
                downloadLink.href = messageContent.url;
                downloadLink.download = "downloaded_image.jpg"; 
                downloadLink.click();
            })
            
        }  else {
            console.log(socket.id , sender , messageContent )
            const messageElement = document.createElement("div");
            messageElement.innerText = `${sender}: ${messageContent.content}`;
            chatMessages.appendChild(messageElement);
        }

        // if (typeof message === "string") {
        //     // Display text message
        //     const messageElement = document.createElement("div");
        //     messageElement.innerText = `${sender}: ${message}`;
        //     chatMessages.appendChild(messageElement);
        // } else if (typeof message === "object") {
        //     // Handle file message
        //     const fileLink = document.createElement("a");
        //     fileLink.href = message.file.url; // Adjust this based on your server setup
        //     fileLink.target = "_blank";
        //     fileLink.innerText = "Download File";
                
        //     const messageElement = document.createElement("div");
        //     messageElement.innerHTML = `${sender}: Sent a file - `;
        //     messageElement.appendChild(fileLink);
        //     chatMessages.appendChild(messageElement);
        // }

        // console.log(socket.id , sender , messageContent )
        // const messageElement = document.createElement("div");
        // messageElement.innerText = `${sender}: ${messageContent}`;
        // chatMessages.appendChild(messageElement);


        

        const isOnChatPage = isUserOnChatPage(); // Call the function to check
        if (!isOnChatPage) {
            // Display a browser notification
            if (Notification.permission === "granted") {
                const notification = new Notification("New Message Received", {
                    body: `${sender}: ${messageContent}`,
                });
            }
        }
    });

    socket.on("notification", (message) => {
        // Display the notification to the user
        alert(message);
    });
    
    function isUserOnChatPage() {
        const chatPageElement = document.getElementById("chat-messages"); // Change to the actual ID of the chat page element
        return chatPageElement && chatPageElement.style.display !== "none";
    }
});
