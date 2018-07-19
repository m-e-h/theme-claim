#!/usr/bin/env node

const path = require("path");
const fs = require("fs-extra");
const conf = require("./conf.json");
const inquirer = require("inquirer");
const chalk = require("chalk");
const clear = require("clear");
const boxen = require("boxen");
const replace = require('replace-in-file');
const findUp = require('find-up');
const slugify = require('@sindresorhus/slugify');

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
	const prevData = require("./confOld.json");
	const questions = [
		{
			type: "input",
			name: "theme_name",
			message: "Theme Name:",
			default: prevData.themeName
		},
		{
			type: "input",
			name: "theme_description",
			message: "Short theme description:",
			default: prevData.themeDescription
		},
		{
			type: "input",
			name: "theme_uri",
			message: "URL to the theme:",
			default: prevData.themeUri
		},
		{
			type: "input",
			name: "theme_version",
			message: "Theme version number:",
			default: prevData.themeVersion
		},
		{
			type: "input",
			name: "theme_author",
			message: "Theme Author:",
			default: prevData.themeAuthor
		},
		{
			type: "input",
			name: "theme_author_uri",
			message: "Website of theme author:",
			default: prevData.themeAuthorUri
		},
		{
			type: "input",
			name: "text_domain",
			message: "Theme text-domain:",
			default: prevData.textDomain
		}
	];
	return inquirer.prompt(questions);
};

const createConfOld = async () => {
	try {
		await fs.copy("./conf.json", "./confOld.json");
		return fs.readJson("./confOld.json");
	} catch (err) {
		console.error(err);
	}
};

// All theme files
const doReplacements = async () => {
	const foundFile = await findUp("style.css");
	const themeRoot = path.dirname(foundFile);

	const prevData = await fs.readJson("./confOld.json");

	const prevSlugged = new RegExp(slugify(prevData.themeName, {separator: '_'}) + '_', 'g');
	const prevDashed = new RegExp(slugify(prevData.themeName) + '-', 'g');
	const prevName = new RegExp(prevData.themeName, 'g');
	const prevDesc = new RegExp(prevData.themeDescription, 'g');
	const prevUri = new RegExp(prevData.themeUri, 'g');
	const prevVersion = new RegExp(prevData.themeVersion, 'g');
	const prevAuthor = new RegExp(prevData.themeAuthor, 'g');
	const prevAuthorUri = new RegExp(prevData.themeAuthorUri, 'g');
	const prevtextDomain = new RegExp(prevData.textDomain, 'g');

	return {
		files: [
			`${themeRoot}/**/*.php`,
			`${themeRoot}/style.css`,
			`${themeRoot}/readme.md`
		],
		ignore: [

		],
		from: [
			prevDesc,
			prevAuthorUri,
			prevUri,
			prevSlugged,
			prevDashed,
			prevName,
			prevAuthor,
			prevtextDomain,
			prevVersion
		],
		to: [
			conf.themeDescription,
			conf.themeAuthorUri,
			conf.themeUri,
			slugify(conf.themeName, {separator: '_'}) + '_',
			slugify(conf.themeName) + '-',
			conf.themeName,
			conf.themeAuthor,
			conf.textDomain,
			conf.themeVersion
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
	theme_uri,
	theme_version,
	theme_author,
	theme_author_uri,
	text_domain
) => {
	conf.themeName = theme_name;
	conf.themeDescription = theme_description;
	conf.themeUri = theme_uri;
	conf.themeVersion = theme_version;
	conf.themeAuthor = theme_author;
	conf.themeAuthorUri = theme_author_uri;
	conf.textDomain = text_domain;
	await fs.writeJson(`${path.resolve(__dirname)}/conf.json`, conf, { spaces: 2 });
};

const run = async () => {
	// show script introduction
	init();

	console.log('Stashing old config...\n');
	await createConfOld();

	// ask questions
	const answers = await askQuestions();
	const {
		theme_name,
		theme_description,
		theme_uri,
		theme_version,
		theme_author,
		theme_author_uri,
		text_domain
	} = answers;

	console.log('Creating new config...\n');
	await storeData(
		theme_name,
		theme_description,
		theme_uri,
		theme_version,
		theme_author,
		theme_author_uri,
		text_domain
	);

	console.log('Out with the old. In with the new...\n');
	await renameTheme();
};

run();
