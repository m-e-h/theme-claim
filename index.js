#!/usr/bin/env node

const path = require("path");
const fs = require("fs-extra");
const conf = require(`${path.resolve(__dirname)}/conf.json`);
const inquirer = require("inquirer");
const chalk = require("chalk");
const clear = require("clear");
const boxen = require("boxen");
const replace = require('replace-in-file');
const findUp = require('find-up');
const slugify = require('@sindresorhus/slugify');
const camelCase = require('camelcase');

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
	const fromData = require(`${path.resolve(__dirname)}/confOld.json`);
	const questions = [
		{
			type: "input",
			name: "theme_name",
			message: "Theme Name:",
			default: fromData.themeName
		},
		{
			type: "input",
			name: "theme_description",
			message: "Short theme description:",
			default: fromData.themeDescription
		},
		{
			type: "input",
			name: "theme_uri",
			message: "URL to the theme:",
			default: fromData.themeUri
		},
		{
			type: "input",
			name: "theme_author",
			message: "Theme Author:",
			default: fromData.themeAuthor
		},
		{
			type: "input",
			name: "theme_author_uri",
			message: "Website of theme author:",
			default: fromData.themeAuthorUri
		},
		{
			type: "input",
			name: "name_space",
			message: "Theme namespace:",
			default: fromData.nameSpace
		}
	];
	return inquirer.prompt(questions);
};

const createConfOld = async () => {
	try {
		await fs.copy(`${path.resolve(__dirname)}/conf.json`, `${path.resolve(__dirname)}/confOld.json`);
	} catch (err) {
		console.error(err);
	}
};

// All theme files
const doReplacements = async () => {
	const foundFile = await findUp("style.css");
	const themeRoot = path.dirname(foundFile);

	const fromData = await fs.readJson(`${path.resolve(__dirname)}/confOld.json`);

	const fromName = fromData.themeName;
	const fromDesc = fromData.themeDescription;
	const fromUri = fromData.themeUri;
	const fromAuthor = fromData.themeAuthor;
	const fromAuthorUri = fromData.themeAuthorUri;
	const fromNameSpaceDec = `namespace ${fromData.nameSpace}`;
	const fromNameSpace = `${fromData.nameSpace}\\\\`;
	const fromCamel = camelCase(fromName);
	const fromPascal = camelCase(fromName, {pascalCase: true}) + '\\\\';
	const fromUnderscore = slugify(fromName, {separator: '_'});
	const fromDashed = slugify(fromName);
	const fromPrefix = `${fromDashed}-`;
	const fromSlugged = `${fromUnderscore}_`;
	const fromSluggedVar = '\\$' + slugify(fromName, {separator: '_'});
	const fromContainerID = `${fromUnderscore}/`;

	const toDashed = slugify(conf.themeName);
	const toUnderscore = slugify(conf.themeName, {separator: '_'});

	return {
		files: [
			`${themeRoot}/**/*.php`,
			`${themeRoot}/style.css`,
			`${themeRoot}/readme.md`
		],
		ignore: [
			'vendor/**/*',
			'node_modules/**/*',
			'.git/**/*'
		],
		from: [
			new RegExp(fromNameSpaceDec, 'g'),
			new RegExp(fromNameSpace, 'g'),
			new RegExp(fromSluggedVar, 'g'),
			new RegExp(`'${fromDashed}'`, 'g'),
			new RegExp(fromDesc, 'g'),
			new RegExp(fromAuthorUri, 'g'),
			new RegExp(fromUri, 'g'),
			new RegExp(fromContainerID, 'g'),
			new RegExp(fromSlugged, 'g'),
			new RegExp(fromPrefix, 'g'),
			new RegExp(fromName, 'g'),
			new RegExp(fromPascal, 'g'),
			new RegExp(fromAuthor, 'g'),
			new RegExp(` ${fromDashed}`, 'g'),
			new RegExp(fromUnderscore, 'g'),
			new RegExp(fromCamel, 'g'),
		],
		to: [
			`namespace ${conf.nameSpace}`,
			`${conf.nameSpace}\\`,
			`\$${toUnderscore}`,
			`'${toDashed}'`,
			conf.themeDescription,
			conf.themeAuthorUri,
			conf.themeUri,
			`${toUnderscore}/`,
			`${toUnderscore}_`,
			`${toDashed}-`,
			conf.themeName,
			camelCase(conf.themeName, {pascalCase: true}) + '\\',
			conf.themeAuthor,
			` ${toDashed}`,
			toUnderscore,
			camelCase(conf.themeName)
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
	theme_author,
	theme_author_uri,
	name_space
) => {
	conf.themeName = theme_name;
	conf.themeDescription = theme_description;
	conf.themeUri = theme_uri;
	conf.themeAuthor = theme_author;
	conf.themeAuthorUri = theme_author_uri;
	conf.nameSpace = name_space;
	await fs.writeJson(`${path.resolve(__dirname)}/conf.json`, conf, { spaces: 2 });
};

const run = async () => {
	// show script introduction
	init();

	// set current theme data aside
	console.log('Stashing old config...\n');
	await createConfOld();

	// ask questions
	const answers = await askQuestions();
	const {
		theme_name,
		theme_description,
		theme_uri,
		theme_author,
		theme_author_uri,
		name_space
	} = answers;

	// save answers
	console.log('Creating new config...\n');
	await storeData(
		theme_name,
		theme_description,
		theme_uri,
		theme_author,
		theme_author_uri,
		name_space
	);

	// find and replace
	console.log('Out with the old. In with the new...\n');
	await renameTheme();
};

run();
