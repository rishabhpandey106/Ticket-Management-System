document.addEventListener("DOMContentLoaded", function() {
  const titleInput = document.getElementById("title");
  const desc = document.getElementById("description");
  const priorityInput = document.getElementById("priority");
  const departmentInput = document.getElementById("department");
  const ticketform = document.getElementById("ticket-form");
  const table = document.getElementById('ticket-table');
  const ticketid = document.getElementById("ticketid");

  let currentRow = null;

  ticketid.addEventListener("click", function() {
      ticketid.value = Math.floor(Math.random() * 10000).toString();
      ticketid.disabled = true;
  });

  ticketform.addEventListener("submit", function (event) {
      event.preventDefault();

      const title = titleInput.value;
      const description = desc.value;
      const priority = priorityInput.value;
      const ticketID = ticketid.value;
      const department = departmentInput.value;
      console.log("departent"  , department); // low
      const assignedto = '';
      const email = '';
      const status = 'open';
      console.log("Submitting data:", { ticketID, title, description, priority , department });

      fetch("/add-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ticketID,
            title,
            description,
            priority,
            department,
            assignedto,
            email,
            status
        })
      }).then(function (res) {
        if (res.ok) {
          console.log("data sent");
          updateTableRow(ticketID, title, description, priority , department);
        } else {
          throw new Error("Network response was not ok");
        }
      }).catch(function (error) {
        console.log(error);
      });

      ticketid.value = '';
      ticketid.disabled = false;
      titleInput.value = '';
      desc.value = '';
      priorityInput.value = 'high';
      departmentInput.value = 'Software';
  });

  function updateTableRow(ticketID, title, description, priority , department) {
      if (!currentRow) {
          currentRow = table.insertRow(-1);
          currentRow.insertCell(0);
          currentRow.insertCell(1);
          currentRow.insertCell(2);
          currentRow.insertCell(3);
          currentRow.insertCell(4);
      }

      currentRow.cells[0].innerHTML = ticketID;
      currentRow.cells[1].innerHTML = title;
      currentRow.cells[2].innerHTML = description;
      currentRow.cells[3].innerHTML = priority;
      currentRow.cells[4].innerHTML = department;
  }
});
