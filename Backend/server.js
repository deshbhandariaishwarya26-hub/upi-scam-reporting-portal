const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();

app.use(cors());
app.use(express.json());

const PORT = 3000;
const DATA_FILE = "reports.json";

// Test route
app.get("/", (req, res) => {
    res.send("UPI Fraud Reporting API is running");
});

// Create a new fraud report
app.post("/api/reports", (req, res) => {

    const {
        reporterName,
        contact,
        incidentDate,
        transactionId,
        amount,
        incidentType,
        description,
        additionalInfo
    } = req.body;

    if (
        !reporterName ||
        !contact ||
        !incidentDate ||
        !transactionId ||
        !amount ||
        !incidentType ||
        !description
    ) {
        return res.status(400).json({
            message: "Please fill all required fields"
        });
    }

    fs.readFile(DATA_FILE, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Error reading reports"
            });
        }

        const reports = JSON.parse(data);

        const newReport = {
           id: reports.length > 0
    ? Math.max(...reports.map(report => report.id)) + 1
    : 1,
            reporterName,
            contact,
            incidentDate,
            transactionId,
            amount,
            incidentType,
            description,
            additionalInfo,
            status: "Pending"
        };

        reports.push(newReport);

        fs.writeFile(
            DATA_FILE,
            JSON.stringify(reports, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).json({
                        message: "Error saving report"
                    });
                }

                res.status(201).json({
                    message: "Fraud report created successfully",
                    report: newReport
                });
            }
        );
    });
});

// Get all reports
app.get("/api/reports", (req, res) => {

    fs.readFile(DATA_FILE, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Error reading reports"
            });
        }

        const reports = JSON.parse(data);

        res.status(200).json(reports);
    });
});

// Get one report
app.get("/api/reports/:id", (req, res) => {

    const id = parseInt(req.params.id);

    fs.readFile(DATA_FILE, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Error reading reports"
            });
        }

        const reports = JSON.parse(data);

        const report = reports.find(function(report) {
            return report.id === id;
        });

        if (!report) {
            return res.status(404).json({
                message: "Report not found"
            });
        }

        res.status(200).json(report);
    });
});

// Delete a report
app.delete("/api/reports/:id", (req, res) => {

    const id = parseInt(req.params.id);

    fs.readFile(DATA_FILE, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Error reading reports"
            });
        }

        const reports = JSON.parse(data);

        const reportIndex = reports.findIndex(function(report) {
            return report.id === id;
        });

        if (reportIndex === -1) {
            return res.status(404).json({
                message: "Report not found"
            });
        }

        reports.splice(reportIndex, 1);

        fs.writeFile(
            DATA_FILE,
            JSON.stringify(reports, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).json({
                        message: "Error deleting report"
                    });
                }

                res.status(200).json({
                    message: "Report deleted successfully"
                });
            }
        );
    });
});

// Update report status
app.put("/api/reports/:id", (req, res) => {

    const id = parseInt(req.params.id);
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({
            message: "Status is required"
        });
    }

    fs.readFile(DATA_FILE, "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Error reading reports"
            });
        }

        const reports = JSON.parse(data);

        const report = reports.find(function(report) {
            return report.id === id;
        });

        if (!report) {
            return res.status(404).json({
                message: "Report not found"
            });
        }

        report.status = status;

        fs.writeFile(
            DATA_FILE,
            JSON.stringify(reports, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).json({
                        message: "Error updating report"
                    });
                }

                res.status(200).json({
                    message: "Report status updated successfully",
                    report: report
                });
            }
        );
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});