const chalk = require("chalk");
const createError = (validator, error) => {
	error.message = `${validator} Error: ${error.message}`;
	error.status = error.status || 400;
	throw new Error(error);
};

const { logError } = require("./fileLogger");

const handleError = (res, status, message) => {
	if (status >= 400) {
		logError(status, message);
	}
	res.status(status).send({ error: message });
};

module.exports = { createError, handleError };
