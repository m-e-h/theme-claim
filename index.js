#!/usr/bin/env node

const chalk = require("chalk");
const boxen = require("boxen");
const saveAnswers = require("./lib/answered");
const renameTheme = require("./lib/replace");
const conf = require("./lib/configPath");

let rConf = conf.reqConf;

// Intro text
const init = () => {
	console.log(
		boxen("It starts with \n\n" + chalk.bold.hex("#3d627d")(rConf.from.Name), {
			padding: 1,
			margin: 1,
			borderStyle: "round",
			float: "center",
			align: "center"
		})
	);
};

const run = async () => {
	// show script introduction
	init();

	// Ask questions and save answers
	console.log(chalk.green.bold("Make it Yours"));
	await saveAnswers();

	// find and replace
	console.log("Out with the old. In with the new...\n");
	await renameTheme();
};

run();
