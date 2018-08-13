"use strict";

const chalk = require("chalk");
const boxen = require("boxen");
const themeQuestions = require("./question");
const renameTheme = require("./replace");

module.exports = async config => {
	// show script introduction
	let conf = require(config);
	console.log(
		boxen("It starts with \n\n" + chalk.bold.hex("#3d627d")(conf.from.Name), {
			padding: 1,
			margin: 1,
			borderStyle: "round",
			float: "center",
			align: "center"
		})
	);

	// Ask questions and save answers
	console.log(chalk.green.bold("Make it Yours"));
	await themeQuestions(config);

	// find and replace
	console.log(chalk.red("\nReplacing...\n"));
	await renameTheme(config);
};
