document.addEventListener("DOMContentLoaded", function() {
  const titleInput = document.getElementById("title");
  const desc = document.getElementById("description");
  const priorityInput = document.getElementById("priority");
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
      console.log("Submitting data:", { ticketID, title, description, priority });

      fetch("/add-ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            ticketID,
            title,
            description,
            priority
        })
      }).then(function (res) {
        if (res.ok) {
          console.log("data sent");
          updateTableRow(ticketID, title, description, priority);
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
  });

  function updateTableRow(ticketID, title, description, priority) {
      if (!currentRow) {
          currentRow = table.insertRow(-1);
          currentRow.insertCell(0);
          currentRow.insertCell(1);
          currentRow.insertCell(2);
          currentRow.insertCell(3);
      }

      currentRow.cells[0].innerHTML = ticketID;
      currentRow.cells[1].innerHTML = title;
      currentRow.cells[2].innerHTML = description;
      currentRow.cells[3].innerHTML = priority;
  }
});
