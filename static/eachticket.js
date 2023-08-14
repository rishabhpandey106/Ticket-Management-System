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
    const { ticket, employee } = ticketDetails;
    updateTicketDetails(ticket);
    updateEmployeeDetails(employee);

    socket.emit("join-room", ticketID);

    const messageInput = document.getElementById("message-input");
    const sendButton = document.getElementById("send-button");

    sendButton.addEventListener("click", () => {
        const messageContent = messageInput.value;
        if (messageContent.trim() !== "") {
            const message = {
                sender : ticketID,
                content : messageContent
            }
            socket.emit("chat-message", ticketID , message);
            messageInput.value = "";
        }
    });

    const chatMessages = document.getElementById("chat-messages");

    socket.on("chat-message", (sender, messageContent) => {
        console.log(socket.id , sender , messageContent )
        const messageElement = document.createElement("div");
        // messageElement.innerText = message;
        messageElement.innerText = `${sender}: ${messageContent}`;
        chatMessages.appendChild(messageElement);
    });
});
