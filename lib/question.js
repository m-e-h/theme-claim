"use strict";

const fs = require("fs-extra");
const inquirer = require("inquirer");

const askQuestions = config => {
	let conf = require(config);
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
			name: "name_space",
			message: "PHP namespace:",
			default: conf.from.Namespace
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
			name: "theme_author_email",
			message: "Author's email:",
			default: conf.from.AuthorEmail
		},
		{
			type: "input",
			name: "theme_author_uri",
			message: "Website of theme author:",
			default: conf.from.AuthorUri
		}
	];
	return inquirer.prompt(questions);
};

module.exports = async config => {
	const answers = await askQuestions(config);
	const {
		theme_name,
		theme_description,
		name_space,
		theme_uri,
		theme_author,
		theme_author_uri,
		theme_author_email
	} = answers;

	let conf = require(config);
	const toConf = JSON.stringify(
		{
			from: {
				Name: conf.from.Name,
				Description: conf.from.Description,
				Namespace: conf.from.Namespace,
				Uri: conf.from.Uri,
				Author: conf.from.Author,
				AuthorEmail: conf.from.AuthorEmail,
				AuthorUri: conf.from.AuthorUri
			},
			to: {
				Name: theme_name,
				Description: theme_description,
				Namespace: name_space,
				Uri: theme_uri,
				Author: theme_author,
				AuthorEmail: theme_author_email,
				AuthorUri: theme_author_uri
			}
		},
		null,
		2
	);

	try {
		await fs.writeFile(config, toConf);
	} catch (err) {
		console.error(err);
	}
};
