document.getElementById("user-type").addEventListener("change", function() {
    var userType = this.value;
    var adminForm = document.getElementById("admin-form");
    var employeeForm = document.getElementById("employee-form");
    
    if (userType === "admin") {
        adminForm.style.display = "block";
        employeeForm.style.display = "none";
        generateAdminId();
    } else if (userType === "employee") {
        employeeForm.style.display = "block";
        adminForm.style.display = "none";
        generateEmployeeId();
    }
});

function generateAdminId() {
    var adminIdInput = document.querySelector("form#admin-form input[name='adminid']");
    adminIdInput.value = "A" + generateUniqueId();
}

function generateEmployeeId() {
    var employeeIdInput = document.querySelector("form#employee-form input[name='eID']");
    employeeIdInput.value = "E" + generateUniqueId();
}

function generateUniqueId() {
    var timestamp = new Date().getTime();
    var randomNumber = Math.floor(Math.random() * 10000) + 1;
    var first = String(timestamp).substring(3,5);
    var second = String(randomNumber).substring(2,4)
    return first + second;
}