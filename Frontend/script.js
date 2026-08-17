const fraudForm = document.getElementById("fraudForm");

fraudForm.addEventListener("submit", async function(event) {

    event.preventDefault();

    if (
    document.getElementById("reporterName").value === "" ||
    document.getElementById("contact").value === "" ||
    document.getElementById("incidentDate").value === "" ||
    document.getElementById("transactionId").value === "" ||
    document.getElementById("amount").value === "" ||
    document.getElementById("incidentType").value === "" ||
    document.getElementById("description").value === ""
) {
    alert("Please fill all required fields.");
    return;
}

    const report = {
        reporterName: document.getElementById("reporterName").value,
        contact: document.getElementById("contact").value,
        incidentDate: document.getElementById("incidentDate").value,
        transactionId: document.getElementById("transactionId").value,
        amount: document.getElementById("amount").value,
        incidentType: document.getElementById("incidentType").value,
        description: document.getElementById("description").value,
        additionalInfo: document.getElementById("additionalInfo").value
    };

    try {

        const response = await fetch("http://localhost:3000/api/reports", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(report)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Fraud report submitted successfully!");
            fraudForm.reset();
        } else {
            alert(data.message);
        }

    } catch (error) {

        alert("Unable to connect to the server.");

        console.log(error);
    }

});

async function getReports() {

    const response = await fetch("http://localhost:3000/api/reports");

    const reports = await response.json();

    const reportsContainer = document.getElementById("reports");

    reportsContainer.innerHTML = "";

    reports.forEach(function(report) {

        const reportDiv = document.createElement("div");

        reportDiv.innerHTML = `
    <h3>Report ID: ${report.id}</h3>
    <p><strong>Name:</strong> ${report.reporterName}</p>
    <p><strong>Transaction ID:</strong> ${report.transactionId}</p>
    <p><strong>Amount:</strong> ₹${report.amount}</p>
    <p><strong>Incident Type:</strong> ${report.incidentType}</p>
    <p><strong>Status:</strong> ${report.status}</p>

    <button onclick="viewReport(${report.id})">
        View Details
    </button>

    <button onclick="deleteReport(${report.id})">
        Delete Report
    </button>

    <button onclick="updateStatus(${report.id})">
        Update Status
    </button>

    <hr>
`;

        reportsContainer.appendChild(reportDiv);
    });
}

getReports();

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", async function() {

    const searchText = searchInput.value.toLowerCase();

    const response = await fetch("http://localhost:3000/api/reports");

    const reports = await response.json();

    const reportsContainer = document.getElementById("reports");

    reportsContainer.innerHTML = "";

    reports.forEach(function(report) {

        const name = report.reporterName.toLowerCase();
        const transactionId = report.transactionId.toLowerCase();

        if (
            name.includes(searchText) ||
            transactionId.includes(searchText)
        ) {

            const reportDiv = document.createElement("div");

            reportDiv.innerHTML = `
    <h3>Report ID: ${report.id}</h3>
    <p><strong>Name:</strong> ${report.reporterName}</p>
    <p><strong>Transaction ID:</strong> ${report.transactionId}</p>
    <p><strong>Amount:</strong> ₹${report.amount}</p>
    <p><strong>Incident Type:</strong> ${report.incidentType}</p>
    <p><strong>Status:</strong> ${report.status}</p>

    <button onclick="viewReport(${report.id})">
        View Details
    </button>

    <button onclick="deleteReport(${report.id})">
        Delete Report
    </button>

    <button onclick="updateStatus(${report.id})">
        Update Status
    </button>

    <hr>
`;

            reportsContainer.appendChild(reportDiv);
        }
    });
});

async function viewReport(id) {

    const response = await fetch(`http://localhost:3000/api/reports/${id}`);

    const report = await response.json();

    alert(
        "Report Details\n\n" +
        "Reporter Name: " + report.reporterName + "\n" +
        "Contact: " + report.contact + "\n" +
        "Incident Date: " + report.incidentDate + "\n" +
        "Transaction ID: " + report.transactionId + "\n" +
        "Amount: ₹" + report.amount + "\n" +
        "Incident Type: " + report.incidentType + "\n" +
        "Description: " + report.description + "\n" +
        "Additional Information: " + report.additionalInfo + "\n" +
        "Status: " + report.status
    );
}

async function deleteReport(id) {

    const confirmDelete = confirm("Are you sure you want to delete this report?");

    if (!confirmDelete) {
        return;
    }

    const response = await fetch(`http://localhost:3000/api/reports/${id}`, {
        method: "DELETE"
    });

    const data = await response.json();

    if (response.ok) {
        alert("Report deleted successfully!");
        getReports();
    } else {
        alert(data.message);
    }
}

async function updateStatus(id) {

    const newStatus = prompt(
        "Enter new status:\nPending, Investigating, Resolved"
    );

    if (!newStatus) {
        return;
    }

    const response = await fetch(`http://localhost:3000/api/reports/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            status: newStatus
        })
    });

    const data = await response.json();

    if (response.ok) {
        alert("Report status updated successfully!");
        getReports();
    } else {
        alert(data.message);
    }
}

