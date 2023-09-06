const ticketContainer = document.getElementById('ticket-container');

function showTicket(ticket)
{
    
    const ticketElement = document.createElement('div');
    ticketElement.classList.add('ticket');
    
    const ticketidelement = document.createElement('div');
    ticketidelement.classList.add('ticket-id');
    ticketidelement.textContent =  ticket.ticketID;

    const titleElement = document.createElement('div');
    titleElement.classList.add('ticket-title');
    titleElement.textContent = `Title: ${ticket.title}`;
    
    const descriptionElement = document.createElement('div');
    descriptionElement.classList.add('ticket-description');
    descriptionElement.textContent =  `Description: ${ticket.description}`;
    
    const priorityElement = document.createElement('div');
    priorityElement.classList.add('ticket-priority');
    priorityElement.textContent = `Priority: ${ticket.priority}`;

    const linebreak = document.createElement('hr');
    
    ticketElement.appendChild(ticketidelement);
    ticketElement.appendChild(linebreak);
    ticketElement.appendChild(titleElement);
    ticketElement.appendChild(descriptionElement);
    ticketElement.appendChild(priorityElement);
    
    ticketContainer.appendChild(ticketElement);
    if(ticket.status == "close")
    {
        ticketElement.style.backgroundColor = "#adb5bd";
        // const ticketFlag = document.createElement("span");
        // ticketFlag.classList.add("ticket-flag")
        // ticketFlag.innerText = "Resolved"
        // ticketFlag.style.color="#212529"
        // ticketidelement.appendChild(ticketFlag)
    }
        

    const singleTicket = document.querySelectorAll('.ticket');
    singleTicket.forEach(oneticket => {
        oneticket.addEventListener("click" , ()=> {
            const ticketID = oneticket.querySelector(".ticket-id").textContent;
            window.location.href = `/ticket?id=${ticketID}`;
        });
    })
}

fetch('/get-tickets')
    .then(response => response.json())
    .then(tickets => {
        tickets.forEach(ticket => {
            showTicket(ticket);
        });
    })
    .catch(error => console.error(error));
