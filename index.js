"use strict";

const fs = require("fs-extra");
const chalk = require("chalk");
const boxen = require("boxen");
const themeQuestions = require("./lib/question");
const renameTheme = require("./lib/replace");
//let ignoreFile = "style.css";

module.exports = async (config, ignoreFile = "**/*.ignore") => {
	// cli Intro
	console.log(
		boxen(
			chalk`
It starts with

{bold.hex("#3d627d") ${require(config).from.Name}}
`,
			{
				padding: 1,
				margin: 1,
				borderStyle: "round",
				float: "center",
				align: "center"
			}
		)
	);

	// Ask questions and save answers
	console.log(chalk.yellow.bold("Make it Yours\n"));

	await themeQuestions(config);

	// find and replace
	let newConf = await fs.readJson(config);

	console.log(chalk.red("\nReplacing..."));

	await renameTheme(newConf, ignoreFile);
};
