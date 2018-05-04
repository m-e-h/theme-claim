const path = require("path");
const fs = require("fs-extra");
const conf = require("./conf.json");
const chalk = require("chalk");
const inquirer = require("./inquirer");
const replace = require("replace-in-file");
const files = require("./files");

const themePrompt = async () => {
	const themedata = await inquirer.themeQuestions();
	conf.themeName = themedata.theme_name;
	conf.textDomain = themedata.text_domain;
	conf.themeAuthor = themedata.theme_author;
	conf.themeUri = themedata.theme_uri;
	fs.writeJson(`${path.resolve(__dirname)}/conf.json`, conf, { spaces: 2 });
};

const themeData = async () => {
	try {
		const changes = await replace(files.styleOptions);
		console.log(
			chalk.bold("Theme data updated in:\n"),
			chalk.yellow(changes.join(",\n"))
		);
	} catch (error) {
		console.error("Error occurred:", error);
	}
};

const nameReplace = async () => {
	await themePrompt();
	await themeData();

	try {
		const changes = await replace(files.options);
		console.log(
			chalk.bold("New theme name added to the following:\n"),
			chalk.yellow(changes.join(",\n"))
		);
	} catch (error) {
		console.error("Error occurred:", error);
	}
};

module.exports = {
	nameReplace
};
