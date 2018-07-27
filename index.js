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
	const prevData = require(`${path.resolve(__dirname)}/confOld.json`);
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
		// {
		// 	type: "input",
		// 	name: "theme_version",
		// 	message: "Theme version number:",
		// 	default: prevData.themeVersion
		// },
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
		},
		{
			type: "input",
			name: "name_space",
			message: "Theme namespace:",
			default: prevData.nameSpace
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

	const prevData = await fs.readJson(`${path.resolve(__dirname)}/confOld.json`);

	const prevName = prevData.themeName;
	const prevDesc = prevData.themeDescription;
	const prevUri = prevData.themeUri;
	// const prevVersion = ` prevData.themeVersion`;
	const prevAuthor = prevData.themeAuthor;
	const prevAuthorUri = prevData.themeAuthorUri;
	const prevTextDomain = prevData.textDomain;
	const prevContainerID = slugify(prevName, {separator: '_'}) + '/';
	const prevNameSpaceDec = `namespace ${prevData.nameSpace}`;
	const prevNameSpace = `${prevData.nameSpace}\\\\`;
	const prevSlugged = slugify(prevName, {separator: '_'}) + '_';
	const prevSluggedVar = '\\$' + slugify(prevName, {separator: '_'});
	const prevDashed = slugify(prevName) + '-';
	const prevCamel = camelCase(prevName);
	const prevPascal = camelCase(prevName, {pascalCase: true}) + '\\\\';

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
			new RegExp(prevNameSpaceDec, 'g'),
			new RegExp(prevNameSpace, 'g'),
			new RegExp(prevSluggedVar, 'g'),
			new RegExp(`'${prevTextDomain}'`, 'g'),
			new RegExp(prevDesc, 'g'),
			new RegExp(prevAuthorUri, 'g'),
			new RegExp(prevUri, 'g'),
			new RegExp(prevContainerID, 'g'),
			new RegExp(prevSlugged, 'g'),
			new RegExp(prevDashed, 'g'),
			new RegExp(prevName, 'g'),
			new RegExp(prevPascal, 'g'),
			new RegExp(prevCamel, 'g'),
			new RegExp(prevAuthor, 'g'),
			new RegExp(prevTextDomain, 'g')
			// new RegExp(prevVersion, 'g')
		],
		to: [
			`namespace ${conf.nameSpace}`,
			`${conf.nameSpace}\\`,
			'\$' + slugify(conf.themeName, {separator: '_'}),
			`'${conf.textDomain}'`,
			conf.themeDescription,
			conf.themeAuthorUri,
			conf.themeUri,
			slugify(conf.themeName, {separator: '_'}) + '/',
			slugify(conf.themeName, {separator: '_'}) + '_',
			slugify(conf.themeName) + '-',
			conf.themeName,
			camelCase(conf.themeName, {pascalCase: true}) + '\\',
			camelCase(conf.themeName),
			conf.themeAuthor,
			conf.textDomain
			// conf.themeVersion
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
	// theme_version,
	theme_author,
	theme_author_uri,
	text_domain,
	name_space
) => {
	conf.themeName = theme_name;
	conf.themeDescription = theme_description;
	conf.themeUri = theme_uri;
	// conf.themeVersion = theme_version;
	conf.themeAuthor = theme_author;
	conf.themeAuthorUri = theme_author_uri;
	conf.textDomain = text_domain;
	conf.nameSpace = name_space;
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
		// theme_version,
		theme_author,
		theme_author_uri,
		text_domain,
		name_space
	} = answers;

	console.log('Creating new config...\n');
	await storeData(
		theme_name,
		theme_description,
		theme_uri,
		// theme_version,
		theme_author,
		theme_author_uri,
		text_domain,
		name_space
	);

	console.log('Out with the old. In with the new...\n');
	await renameTheme();
};

run();
