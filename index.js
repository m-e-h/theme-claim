#!/usr/bin/env node

const path = require("path");
const fs = require("fs-extra");
const inquirer = require("inquirer");
const chalk = require("chalk");
const clear = require("clear");
const Case = require("case");
const boxen = require("boxen");
const replace = require("replace-in-file");
const findUp = require("find-up");
const foundFile = findUp.sync("style.css");
const themeRoot = path.dirname(foundFile);
const userConf = `${themeRoot}/themeclaim.json`;

function useConf(file) {
	if (!fs.existsSync(file)) {
        file = `${path.resolve(__dirname)}/conf.json`;
	}
	return file;
}

let conf = require(useConf(userConf));

// Intro text
const init = () => {
	clear();
	console.log(
		boxen(chalk.bold.hex("#3d627d")("Theme") + "\n\nStarter", {
			padding: 1,
			margin: 1,
			borderStyle: "round",
			float: "center",
			align: "center"
		})
	);
};

// Questions
const askQuestions = () => {
	const questions = [
		{
			type: "input",
			name: "theme_name",
			message: "Theme Name:",
			default: conf.from.Name
		},
		{
			type: "input",
			name: "theme_description",
			message: "Short theme description:",
			default: conf.from.Description
		},
		{
			type: "input",
			name: "theme_uri",
			message: "URL to the theme:",
			default: conf.from.Uri
		},
		{
			type: "input",
			name: "theme_author",
			message: "Theme Author:",
			default: conf.from.Author
		},
		{
			type: "input",
			name: "theme_author_uri",
			message: "Website of theme author:",
			default: conf.from.AuthorUri
		},
		{
			type: "input",
			name: "name_space",
			message: "PHP namespace:",
			default: conf.from.Namespace
		}
	];
	return inquirer.prompt(questions);
};

const saveAnswers = async () => {
	const answers = await askQuestions();
	const {
		theme_name,
		theme_description,
		theme_uri,
		theme_author,
		theme_author_uri,
		name_space
	} = answers;

	const toConf = `{
	"from": {
		"Name": "${conf.from.Name}",
		"Description": "${conf.from.Description}",
		"Uri": "${conf.from.Uri}",
		"Author": "${conf.from.Author}",
		"AuthorUri": "${conf.from.AuthorUri}",
		"Namespace": "${conf.from.Namespace}"
	},
	"to": {
		"Name": "${theme_name}",
		"Description": "${theme_description}",
		"Uri": "${theme_uri}",
		"Author": "${theme_author}",
		"AuthorUri": "${theme_author_uri}",
		"Namespace": "${name_space}"
	}
}`;

	try {
		await fs.writeFile(useConf(userConf), toConf);
		console.log("Config updated.");
	} catch (err) {
		console.error(err);
	}
};

// All theme files
const doReplacements = async () => {
	let conf = await fs.readJson(useConf(userConf));

	return {
		files: [
			`${themeRoot}/**/*.php`,
			`${themeRoot}/style.css`,
			`${themeRoot}/readme.md`
		],
		ignore: [
			`${themeRoot}/vendor/**/*`,
			`${themeRoot}/node_modules/**/*`,
			`${themeRoot}/.git/**/*`
		],
		from: [
			new RegExp(`namespace ${conf.from.Namespace}`, "g"),
			new RegExp(`${conf.from.Namespace}\\\\`, "g"),
			new RegExp(`\\$${Case.snake(conf.from.Name)}`, "g"),
			new RegExp(`${Case.snake(conf.from.Name)}/`, "g"),
			new RegExp(`${Case.snake(conf.from.Name)}_`, "g"),
			new RegExp(`${Case.kebab(conf.from.Name)}-`, "g"),
			new RegExp(`'${Case.kebab(conf.from.Name)}'`, "g"),
			new RegExp(` ${Case.kebab(conf.from.Name)}`, "g"),
			new RegExp(`${Case.pascal(conf.from.Name)}\\\\`, "g"),
			new RegExp(conf.from.Description, "g"),
			new RegExp(conf.from.AuthorUri, "g"),
			new RegExp(conf.from.Uri, "g"),
			new RegExp(conf.from.Author, "g"),
			new RegExp(conf.from.Name, "g"),
			new RegExp(Case.snake(conf.from.Name), "g"),
			new RegExp(Case.camel(conf.from.Name), "g")
		],
		to: [
			`namespace ${conf.to.Namespace}`,
			`${conf.to.Namespace}\\`,
			`\$${Case.snake(conf.to.Name)}`,
			`${Case.snake(conf.to.Name)}/`,
			`${Case.snake(conf.to.Name)}_`,
			`${Case.kebab(conf.to.Name)}-`,
			`'${Case.kebab(conf.to.Name)}'`,
			` ${Case.kebab(conf.to.Name)}`,
			`${Case.pascal(conf.to.Name)}\\`,
			conf.to.Description,
			conf.to.AuthorUri,
			conf.to.Uri,
			conf.to.Author,
			conf.to.Name,
			Case.snake(conf.to.Name),
			Case.camel(conf.to.Name)
		]
	};
};

const renameTheme = async () => {
	const replacements = await doReplacements();
	try {
		const changes = await replace(replacements);
		console.log(
			chalk.bold("Changes were made in the following files:\n"),
			chalk.yellow(changes.join(",\n"))
		);
	} catch (err) {
		console.error(err);
	}
};

const run = async () => {
	// show script introduction
	init();

	// Ask questions and save answers
	console.log("Updating config...\n");
	await saveAnswers();

	// find and replace
	console.log("Out with the old. In with the new...\n");
	await renameTheme();
};

run();
