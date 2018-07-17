#!/usr/bin/env node

const path = require("path");
const fs = require("fs-extra");
const conf = require("./conf.json");
const inquirer = require("inquirer");
const chalk = require("chalk");
const clear = require("clear");
const boxen = require("boxen");
const replace = require('replace-in-file');

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

const askQuestions = () => {
	const questions = [
		{
			type: "input",
			name: "theme_name",
			message: "Theme Name:"
		},
		{
			type: "input",
			name: "theme_description",
			message: "Short theme description:"
		},
		{
			type: "input",
			name: "theme_url",
			message: "URL to the theme:"
		},
		{
			type: "input",
			name: "theme_version",
			message: "Theme version number:"
		},
		{
			type: "input",
			name: "theme_author",
			message: "Theme Author:"
		},
		{
			type: "input",
			name: "theme_author_url",
			message: "Website of theme author:"
		},
		{
			type: "input",
			name: "text_domain",
			message: "Theme text-domain:"
		}
	];
	return inquirer.prompt(questions);
};

const stashData = async () => {
	try {
		await fs.copy("./conf.json", "./confOld.json");
		return fs.readJson("./confOld.json");
	} catch (err) {
		console.error(err);
	}
};

// All theme files
const doReplacements = async () => {
	const prevData = require("./confOld.json");
	return {
		files: [
			'./**/*.php',
			'./style.css',
			'./readme.md',
		],
		from: [
			`/${prevData.themeName}/g`,
			`/${prevData.themeDescription}/g`,
			`/${prevData.themeUri}/g`,
			`/${prevData.themeVersion}/g`,
			`/${prevData.themeAuthor}/g`,
			`/${prevData.themeAuthorUrl}/g`,
			`/${prevData.textDomain}/g`
		],
		to: [
			conf.themeName,
			conf.themeDescription,
			conf.themeUri,
			conf.themeVersion,
			conf.themeAuthor,
			conf.themeAuthorUrl,
			conf.textDomain
		]
	}
};

const renameTheme = async () => {
	const replacements = await doReplacements();
	try {
		const changes = await replace(replacements);
		console.log(
			chalk.bold("Theme data updated in:\n"),
			chalk.yellow(changes.join(",\n"))
		);
	} catch (error) {
		console.error("Error occurred:", error);
	}
};

const storeData = async (
	theme_name,
	theme_description,
	theme_url,
	theme_version,
	theme_author,
	theme_author_url,
	text_domain
) => {
	conf.themeName = theme_name;
	conf.themeDescription = theme_description;
	conf.themeUrl = theme_url;
	conf.themeVersion = theme_version;
	conf.themeAuthor = theme_author;
	conf.themeAuthorUrl = theme_author_url;
	conf.textDomain = text_domain;
	fs.writeJson(`${path.resolve(__dirname)}/conf.json`, conf, { spaces: 2 });
};

(async () => {
	// show script introduction
	init();

	console.log('Stashing old data...\n');
	await stashData();

	// ask questions
	const answers = await askQuestions();
	const {
		theme_name,
		theme_description,
		theme_url,
		theme_version,
		theme_author,
		theme_author_url,
		text_domain
	} = answers;

	console.log('Storing new data...\n');
	await storeData(
		theme_name,
		theme_description,
		theme_url,
		theme_version,
		theme_author,
		theme_author_url,
		text_domain
	);

	console.log('Out with the old. In with the new...\n');
	await renameTheme();
})();
