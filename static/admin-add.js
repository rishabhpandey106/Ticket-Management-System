let selectedPriority = 'all';
let selectedStatus = 'all';

function filterTicketsByPriority(priorityValue, searchText) {
    const ticketItems = document.querySelectorAll('.ticket-item');

    ticketItems.forEach(ticketItem => {
        const priorityElement = ticketItem.querySelector('.ticket-priority');
        const ticketPriority = priorityElement.textContent.split(': ')[1]; // Extract priority value
        const titleElement = ticketItem.querySelector('.ticket-title');
        const ticketTitle = titleElement.textContent.split(': ')[1]; // Extract title value

        const priorityMatch = priorityValue === 'all' || ticketPriority.toLowerCase() === priorityValue.toLowerCase();
        const searchMatch = ticketTitle.toLowerCase().includes(searchText.toLowerCase());

        if (priorityMatch && searchMatch) {
            ticketItem.style.display = 'block'; // Show the ticket
        } else {
            ticketItem.style.display = 'none'; // Hide the ticket
        }
    });
}


// Add event listener to priority filter dropdown
const priorityFilterDropdown = document.getElementById('priority-filter');
priorityFilterDropdown.addEventListener('change', () => {
    const selectedPriority = priorityFilterDropdown.value;
    const searchValue = ticketSearchInput.value;
    filterTicketsByPriority(selectedPriority, searchValue);
});

// Add event listener to ticket search input
const ticketSearchInput = document.getElementById('ticket-search');
ticketSearchInput.addEventListener('input', () => {
    const searchValue = ticketSearchInput.value;
    const selectedPriority = priorityFilterDropdown.value;
    filterTicketsByPriority(selectedPriority, searchValue);
});

// function filterTickets(priority) {
//     const ticketItems = document.querySelectorAll('.ticket-item');

//     ticketItems.forEach(ticketItem => {
//         const priorityElement = ticketItem.querySelector('.ticket-priority');
//         const ticketPriority = priorityElement.textContent.replace('Priority: ', '');
//         // const priority = tprio.innerText;
//         // const status = ticketItem.dataset.status;

//         if (ticketPriority === priority || priority === 'all') {
//             ticketItem.style.display = 'block'; // Show the ticket
//         } else {
//             ticketItem.style.display = 'none'; // Hide the ticket
//         }

//         // if (
//         //     (selectedPriority === 'all' || priority === selectedPriority) &&
//         //     (selectedStatus === 'all' || status === selectedStatus)
//         // ) {
//         //     ticketItem.style.display = 'block';
//         // } else {
//         //     ticketItem.style.display = 'none';
//         // }
//     });
// }

// document.getElementById('priority-filter').addEventListener('change', event => {
//     selectedPriority = event.target.value;
//     filterTickets(selectedPriority);
// });

// document.getElementById('status-filter').addEventListener('change', event => {
//     selectedStatus = event.target.value;
//     filterTickets();
// });



function fetchEmployeeNames() {
    fetch('/get-employees')
        .then(response => response.json())
        .then(employees => {
            const employeeList = document.getElementById('employeeList');
            employees.forEach(employee => {
                const li = document.createElement('li');
                li.innerHTML = `<a href="#" data-id="${employee.eID}">${employee.name}</a>`;
                employeeList.appendChild(li);
            });

            // Add event listener to employee names
            employeeList.addEventListener('click', handleEmployeeClick);
        })
        .catch(error => console.error('Error fetching employee names:', error));
}

// Handle click event on employee name
function handleEmployeeClick(event) {
    event.preventDefault();
    // document.getElementById("ticketChart").style = "none";
    const employeeId = event.target.getAttribute('data-id');
    fetchTicketsForEmployee(employeeId);
}

// Fetch tickets assigned to a specific employee
// function fetchTicketsForEmployee(employeeId) {
//     fetch(`/get-alltickets?employeeId=${employeeId}`)
//         .then(response => response.json())
//         .then(tickets => {
//             const ticketList = document.getElementById('ticketList');
//             ticketList.innerHTML = '';

//             let openTicketCount = 0;
//             let closedTicketCount = 0;

//             tickets.forEach(ticket => {
//                 if (ticket.status === 'open') {
//                     openTicketCount++;
//                 } else if (ticket.status === 'close') {
//                     closedTicketCount++;
//                 }
//             });

//             const chartData = {
//                 labels: ['Open', 'Closed'],
//                 datasets: [{
//                     label: 'Ticket Status',
//                     data: [openTicketCount, closedTicketCount],
//                     backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(75, 192, 192, 0.5)'],
//                     borderColor: ['rgba(255, 99, 132, 1)', 'rgba(75, 192, 192, 1)'],
//                     borderWidth: 1
//                 }]
//             };

//             updateChart(chartData);

//             tickets.forEach(ticket => {
//                 // const li = document.createElement('li');
//                 // li.className = 'ticket-item';
//                 // li.textContent = `Ticket ID: ${ticket.ticketID} Title: ${ticket.title} Priority: ${ticket.priority}`;
                

//                 const ticketElement = document.createElement('li');
//                 ticketElement.classList.add('ticket-item');
                
//                 const ticketidelement = document.createElement('div');
//                 ticketidelement.classList.add('ticket-id');
//                 ticketidelement.textContent =  ticket.ticketID;

//                 const titleElement = document.createElement('div');
//                 titleElement.classList.add('ticket-title');
//                 titleElement.textContent = `Title: ${ticket.title}`;
                
//                 const descriptionElement = document.createElement('div');
//                 descriptionElement.classList.add('ticket-description');
//                 descriptionElement.textContent =  `Description: ${ticket.description}`;
                
//                 const priorityElement = document.createElement('div');
//                 priorityElement.classList.add('ticket-priority');
//                 priorityElement.textContent = `Priority: ${ticket.priority}`;

//                 const linebreak = document.createElement('hr');
                
//                 ticketElement.appendChild(ticketidelement);
//                 ticketElement.appendChild(linebreak);
//                 ticketElement.appendChild(titleElement);
//                 ticketElement.appendChild(descriptionElement);
//                 ticketElement.appendChild(priorityElement);
                
//                 ticketList.appendChild(ticketElement);
//             });
//         })
//         .catch(error => console.error('Error fetching tickets:', error));
// }
// Fetch tickets for a specific employee and update the chart
function fetchTicketsForEmployee(employeeId) {
    fetch(`/get-alltickets?employeeId=${employeeId}`)
        .then(response => response.json())
        .then(data => {
            const ticketCounts = data.reduce((acc, ticket) => {
                if (ticket.status === "open") {
                    acc.open++;
                } else if (ticket.status === "close") {
                    acc.closed++;
                }
                return acc;
            }, { open: 0, closed: 0 });

            // Call the function to create or update the chart with ticketCounts data
            createOrUpdateChart({
                labels: ["Open", "Closed"],
                datasets: [{
                    label: "Ticket Status",
                    data: [ticketCounts.open, ticketCounts.closed],
                    backgroundColor: ["rgba(255, 99, 132, 0.5)", "rgba(75, 192, 192, 0.5)"],
                    borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
                    borderWidth: 1
                }]
            });

            // Render individual tickets for the employee
            renderEmployeeTickets(data);
        })
        .catch(error => {
            console.error("Error fetching tickets for the employee:", error);
        });
}

// Function to render individual tickets for the employee
function renderEmployeeTickets(tickets) {
    const ticketList = document.getElementById('ticketList');
    ticketList.innerHTML = '';

    tickets.forEach(ticket => {
        const ticketElement = document.createElement('li');
        ticketElement.classList.add('ticket-item');

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

        ticketList.appendChild(ticketElement);
    });
}

let currentChartInstance = null;

// Function to destroy the current chart instance
function destroyChart() {
    if (currentChartInstance !== null) {
        currentChartInstance.destroy();
    }
}

function createOrUpdateChart(chartData) {
    destroyChart(); // Destroy the current chart if it exists

    const ctx = document.getElementById("ticketChart").getContext("2d");
    currentChartInstance = new Chart(ctx, {
        type: "bar",
        data: chartData,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// function createChart(ticketCounts) {
//     const ctx = document.getElementById("ticketChart").getContext("2d");

//     const chart = new Chart(ctx, {
//         type: "bar",
//         data: {
//             labels: ["Open", "Closed"],
//             datasets: [{
//                 label: "Ticket Status",
//                 data: [ticketCounts.open, ticketCounts.closed],
//                 backgroundColor: ["rgba(255, 99, 132, 0.5)", "rgba(75, 192, 192, 0.5)"],
//                 borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     });
//     return chart;
// }

// function updateChart(newData) {
//     const ctx = document.getElementById("ticketChart").getContext("2d");
//     if (currentChartInstance !== null) {
//         currentChartInstance.destroy();
//     }
//     const chart = new Chart(ctx, {
//         type: "bar",
//         data: newData,
//         options: {
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     });
//     currentChartInstance = chart;
// }

// Fetch employee names on page load
document.addEventListener('DOMContentLoaded', () => {
    fetchEmployeeNames();

    fetch("/graph-data")
    .then(response => response.json())
    .then(data => {
        const ticketCounts = data.reduce((acc, ticket) => {
            if (ticket.status === "open") {
                acc.open++;
            } else if (ticket.status === "close") {
                acc.closed++;
            }
            return acc;
        }, { open: 0, closed: 0 });

        // Call a function to create the chart with ticketCounts data
        createOrUpdateChart({
            labels: ["Open", "Closed"],
            datasets: [{
                label: "Ticket Status",
                data: [ticketCounts.open, ticketCounts.closed],
                backgroundColor: ["rgba(255, 99, 132, 0.5)", "rgba(75, 192, 192, 0.5)"],
                borderColor: ["rgba(255, 99, 132, 1)", "rgba(75, 192, 192, 1)"],
                borderWidth: 1
            }]
        });
    })
    .catch(error => {
        console.error("Error fetching ticket data:", error);
    });

    
});
  

  