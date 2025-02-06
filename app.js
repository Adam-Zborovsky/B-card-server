//© Adam Zborovsky
const express = require("express");
const connectToDB = require("./DB/dbService");
const router = require("./router/router");
const corsMiddleware = require("./middlewares/cors");
const { handleError } = require("./utils/handleErrors");
const chalk = require("chalk");
const { loggerMiddleware } = require("./logger/loggerService");
const app = express();
const PORT = process.env.PORT || 8181;
require("dotenv").config();
app.use(express.static("./public"));
app.use(corsMiddleware);
app.use(express.json());
app.use(loggerMiddleware());
app.use(router);

app.use((err, req, res, next) => {
	const message = err || "Internal Server error";
	return handleError(res, 500, message);
});

app.listen(PORT, () => {
	console.log(chalk.bgGreen.green("Server lisening to port " + PORT));
	connectToDB();
});
