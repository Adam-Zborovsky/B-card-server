const fs = require("fs");
const path = require("path");

const logError = (status, message) => {
	const date = new Date();
	const logDate = date.toISOString().split("T")[0];
	const logFileName = path.join(__dirname, `../logs/${logDate}.log`);
	const logMessage = `${date.toISOString()} - Status: ${status}, Error: ${message}\n`;

	fs.appendFile(logFileName, logMessage, (err) => {
		if (err) {
			console.error("Failed to write to log file", err);
		}
	});
};

module.exports = { logError };
