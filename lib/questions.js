const inquirer = require("inquirer");
let conf = require("./configPath");
let rConf = conf.reqConf;

module.exports = askQuestions = () => {
	const questions = [
		{
			type: "input",
			name: "theme_name",
			message: "Theme Name:",
			default: rConf.from.Name
		},
		{
			type: "input",
			name: "theme_description",
			message: "Short theme description:",
			default: rConf.from.Description
		},
		{
			type: "input",
			name: "name_space",
			message: "PHP namespace:",
			default: rConf.from.Namespace
		},
		{
			type: "input",
			name: "theme_uri",
			message: "URL to the theme:",
			default: rConf.from.Uri
		},
		{
			type: "input",
			name: "theme_author",
			message: "Theme Author:",
			default: rConf.from.Author
		},
		{
			type: "input",
			name: "theme_author_email",
			message: "Author's email:",
			default: rConf.from.AuthorEmail
		},
		{
			type: "input",
			name: "theme_author_uri",
			message: "Website of theme author:",
			default: rConf.from.AuthorUri
		}
	];
	return inquirer.prompt(questions);
};
