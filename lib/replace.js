"use strict";

const chalk = require("chalk");
const Case = require("case");
const replace = require("replace-in-file");
const getConf = require("./configPath");
const themeRoot = getConf.themeRoot;

const doReplacePhp = async conf => {
	return {
		ignore: [
			"vendor/**/*",
			"node_modules/**/*",
			".git/**/*",
			`${themeRoot}/vendor/**/*`,
			`${themeRoot}/node_modules/**/*`,
			`${themeRoot}/.git/**/*`
		],
		files: [`${themeRoot}/**/*.php`],
		from: [
			new RegExp(`namespace ${conf.from.Namespace}`, "g"),
			new RegExp(`${conf.from.Namespace}\\\\`, "g"),
			new RegExp(`(@package\\s+)${conf.from.Namespace}`, "g"),
			new RegExp(`\\$${Case.snake(conf.from.Name)}`, "g"),
			new RegExp(`${Case.snake(conf.from.Name)}/`, "g"),
			new RegExp(`${Case.snake(conf.from.Name)}_`, "g"),
			new RegExp(`${Case.kebab(conf.from.Name)}-`, "g"),
			new RegExp(`'${Case.kebab(conf.from.Name)}'`, "g"),
			new RegExp(` ${Case.kebab(conf.from.Name)}`, "g"),
			new RegExp(`${Case.pascal(conf.from.Name)}\\\\`, "g"),
			new RegExp(conf.from.AuthorEmail, "g"),
			new RegExp(conf.from.Uri, "g"),
			new RegExp(conf.from.AuthorUri, "g"),
			new RegExp(conf.from.Author, "g"),
			new RegExp(conf.from.Name, "g"),
			new RegExp(Case.snake(conf.from.Name), "g"),
			new RegExp(Case.camel(conf.from.Name), "g")
		],
		to: [
			`namespace ${conf.to.Namespace}`,
			`${conf.to.Namespace}\\`,
			`@package   ${conf.to.Namespace}`,
			`\$${Case.snake(conf.to.Name)}`,
			`${Case.snake(conf.to.Name)}/`,
			`${Case.snake(conf.to.Name)}_`,
			`${Case.kebab(conf.to.Name)}-`,
			`'${Case.kebab(conf.to.Name)}'`,
			` ${Case.kebab(conf.to.Name)}`,
			`${Case.pascal(conf.to.Name)}\\`,
			conf.to.AuthorEmail,
			conf.to.Uri,
			conf.to.AuthorUri,
			conf.to.Author,
			conf.to.Name,
			Case.snake(conf.to.Name),
			Case.camel(conf.to.Name)
		]
	};
};

const doReplaceCss = async conf => {
	return {
		ignore: [
			"vendor/**/*",
			"node_modules/**/*",
			".git/**/*",
			`${themeRoot}/vendor/**/*`,
			`${themeRoot}/node_modules/**/*`,
			`${themeRoot}/.git/**/*`
		],
		files: [`${themeRoot}/style.css`, `${themeRoot}/**/*.scss`],
		from: [
			new RegExp(`(Theme Name:\\s+)${conf.from.Name}`, "g"),
			new RegExp(`(Text Domain:\\s+)${Case.kebab(conf.from.Name)}`, "g"),
			new RegExp(conf.from.Description, "g"),
			new RegExp(`(Theme URI:\\s+)${conf.from.Uri}`, "g"),
			new RegExp(`(Author URI:\\s+)${conf.from.AuthorUri}`, "g"),
			new RegExp(conf.from.AuthorEmail, "g"),
			new RegExp(`(Author:\\s+)${conf.from.Author}`, "g")
		],
		to: [
			`Theme Name: ${conf.to.Name}`,
			`Text Domain: ${Case.kebab(conf.to.Name)}`,
			conf.to.Description,
			`Theme URI: ${conf.to.Uri}`,
			`Author URI: ${conf.to.AuthorUri}`,
			conf.to.AuthorEmail,
			`Author: ${conf.to.Author}`
		]
	};
};

const doReplaceJs = async conf => {
	return {
		ignore: [
			"vendor/**/*",
			"node_modules/**/*",
			".git/**/*",
			`${themeRoot}/vendor/**/*`,
			`${themeRoot}/node_modules/**/*`,
			`${themeRoot}/.git/**/*`
		],
		files: [`${themeRoot}/**/*.js`, `${themeRoot}/readme.md`],
		from: [
			new RegExp(`namespace ${conf.from.Namespace}`, "g"),
			new RegExp(`${conf.from.Namespace}\\\\`, "g"),
			new RegExp(`(@package\\s+)${conf.from.Namespace}`, "g"),
			new RegExp(`\\$${Case.snake(conf.from.Name)}`, "g"),
			new RegExp(`${Case.snake(conf.from.Name)}/`, "g"),
			new RegExp(`${Case.snake(conf.from.Name)}_`, "g"),
			new RegExp(`${Case.kebab(conf.from.Name)}-`, "g"),
			new RegExp(`'${Case.kebab(conf.from.Name)}'`, "g"),
			new RegExp(` ${Case.kebab(conf.from.Name)}`, "g"),
			new RegExp(`${Case.pascal(conf.from.Name)}\\\\`, "g"),
			new RegExp(conf.from.AuthorEmail, "g"),
			new RegExp(conf.from.Uri, "g"),
			new RegExp(conf.from.AuthorUri, "g"),
			new RegExp(conf.from.Author, "g"),
			new RegExp(conf.from.Name, "g"),
			new RegExp(Case.snake(conf.from.Name), "g"),
			new RegExp(Case.camel(conf.from.Name), "g")
		],
		to: [
			`namespace ${conf.to.Namespace}`,
			`${conf.to.Namespace}\\`,
			`@package   ${conf.to.Namespace}`,
			`\$${Case.snake(conf.to.Name)}`,
			`${Case.snake(conf.to.Name)}/`,
			`${Case.snake(conf.to.Name)}_`,
			`${Case.kebab(conf.to.Name)}-`,
			`'${Case.kebab(conf.to.Name)}'`,
			` ${Case.kebab(conf.to.Name)}`,
			`${Case.pascal(conf.to.Name)}\\`,
			conf.to.AuthorEmail,
			conf.to.Uri,
			conf.to.AuthorUri,
			conf.to.Author,
			conf.to.Name,
			Case.snake(conf.to.Name),
			Case.camel(conf.to.Name)
		]
	};
};

const doReplaceJson = async conf => {
	return {
		files: [`${themeRoot}/package.json`, `${themeRoot}/composer.json`],
		from: [
			new RegExp(`"${conf.from.Description}"`, "g"),
			new RegExp(`"${conf.from.Uri}"`, "g"),
			new RegExp(`"${conf.from.AuthorEmail}"`, "g"),
			new RegExp(`"${conf.from.Author}"`, "g"),
			new RegExp(`"${conf.from.Name}"`, "g"),
			new RegExp(`"${Case.kebab(conf.from.Name)}"`, "g")
		],
		to: [
			`"${conf.to.Description}"`,
			`"${conf.to.Uri}"`,
			`"${conf.to.AuthorEmail}"`,
			`"${conf.to.Author}"`,
			`"${conf.to.Name}"`,
			`"${Case.kebab(conf.to.Name)}"`
		]
	};
};

module.exports = async config => {
	const replacements = await doReplacePhp(config);
	try {
		const changes = await replace(replacements);
		console.log(
			chalk.blue(`\nModified ${chalk.bold("PHP")} files:\n`),
			chalk.yellow(changes.join(",\n"))
		);
	} catch (err) {
		console.error(err);
	}

	const replaceCss = await doReplaceCss(config);
	try {
		const changes = await replace(replaceCss);
		console.log(
			chalk.blue(`\nModified ${chalk.bold("CSS")} files:\n`),
			chalk.yellow(changes.join(",\n"))
		);
	} catch (err) {
		console.error(err);
	}

	const replaceJs = await doReplaceJs(config);
	try {
		const changes = await replace(replaceJs);
		console.log(
			chalk.blue(`\nModified ${chalk.bold("JS")} files:\n`),
			chalk.yellow(changes.join(",\n"))
		);
	} catch (err) {
		console.error(err);
	}

	const replaceJson = await doReplaceJson(config);
	try {
		const changes = await replace(replaceJson);
		console.log(
			chalk.blue(`\nModified ${chalk.bold("JSON")} files:\n`),
			chalk.yellow(changes.join(",\n"))
		);
	} catch (err) {
		console.error(err);
	}
};
