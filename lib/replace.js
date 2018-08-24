"use strict";

const casex = require("casex");
const chalk = require("chalk");
const replace = require("replace-in-file");
const {themeRoot} = require("./configPath");

const doReplacePhp = async (conf, ignoreFile) => {
	return {
		allowEmptyPaths: true,
		ignore: [
			"vendor/**/*",
			"node_modules/**/*",
			".git/**/*",
			`${themeRoot}/vendor/**/*`,
			`${themeRoot}/node_modules/**/*`,
			`${themeRoot}/.git/**/*`,
			ignoreFile
		],
		files: [`${themeRoot}/**/*.php`],
		from: [
			new RegExp(`namespace ${conf.from.Namespace}`, "g"),
			new RegExp(`${conf.from.Namespace}\\\\`, "g"),
			new RegExp(`(@package\\s+)${conf.from.Namespace}`, "g"),
			new RegExp(`\\$${casex(conf.from.Name.toLowerCase(), 'ca_se')}`, "g"),
			new RegExp(`${casex(conf.from.Name.toLowerCase(), 'ca_se')}/`, "g"),
			new RegExp(`${casex(conf.from.Name.toLowerCase(), 'ca_se')}_`, "g"),
			new RegExp(`${casex(conf.from.Name.toLowerCase(), 'ca-se')}-`, "g"),
			new RegExp(`'${casex(conf.from.Name.toLowerCase(), 'ca-se')}'`, "g"),
			new RegExp(` ${casex(conf.from.Name.toLowerCase(), 'ca-se')}`, "g"),
			new RegExp(`${casex(conf.from.Name, 'CaSe')}\\\\`, "g"),
			new RegExp(conf.from.AuthorEmail, "g"),
			new RegExp(conf.from.Uri, "g"),
			new RegExp(conf.from.AuthorUri, "g"),
			new RegExp(conf.from.Author, "g"),
			new RegExp(conf.from.Name, "g"),
			new RegExp(casex(conf.from.Name.toLowerCase(), 'ca_se'), "g"),
			new RegExp(casex(conf.from.Name.toLowerCase(), 'caSe'), "g")
		],
		to: [
			`namespace ${conf.to.Namespace}`,
			`${conf.to.Namespace}\\`,
			`@package   ${conf.to.Namespace}`,
			`\$${casex(conf.to.Name.toLowerCase(), 'ca_se')}`,
			`${casex(conf.to.Name.toLowerCase(), 'ca_se')}/`,
			`${casex(conf.to.Name.toLowerCase(), 'ca_se')}_`,
			`${casex(conf.to.Name.toLowerCase(), 'ca-se')}-`,
			`'${casex(conf.to.Name.toLowerCase(), 'ca-se')}'`,
			` ${casex(conf.to.Name.toLowerCase(), 'ca-se')}`,
			`${casex(conf.to.Name, 'CaSe')}\\`,
			conf.to.AuthorEmail,
			conf.to.Uri,
			conf.to.AuthorUri,
			conf.to.Author,
			conf.to.Name,
			casex(conf.to.Name.toLowerCase(), 'ca_se'),
			casex(conf.to.Name.toLowerCase(), 'caSe')
		]
	};
};

const doReplaceAssets = async (conf, ignoreFile) => {
	return {
		allowEmptyPaths: true,
		ignore: [
			"vendor/**/*",
			"node_modules/**/*",
			".git/**/*",
			`${themeRoot}/vendor/**/*`,
			`${themeRoot}/node_modules/**/*`,
			`${themeRoot}/.git/**/*`,
			ignoreFile
		],
		files: [`${themeRoot}/**/*.js`, `${themeRoot}/**/*.scss`],
		from: [
			new RegExp(conf.from.AuthorEmail, "g"),
			new RegExp(conf.from.Author, "g"),
			new RegExp(conf.from.Uri, "g"),
			new RegExp(conf.from.Namespace, "g")
		],
		to: [
			conf.to.AuthorEmail,
			conf.to.Author,
			conf.to.Uri,
			conf.to.Namespace
		]
	};
};

const doReplaceConfigs = async (conf) => {

	return {
		allowEmptyPaths: true,
		files: [
			`${themeRoot}/package.json`,
			`${themeRoot}/composer.json`,
			`${themeRoot}/phpcs.xml.dist`,
			`${themeRoot}/phpcs.xml`,
			`${themeRoot}/.phpcs.xml.dist`,
			`${themeRoot}/.phpcs.xml`,
			`${themeRoot}/style.css`,
			`${themeRoot}/readme.md`
		],
		from: [
			`"${casex(conf.from.Name, 'ca-se')}"`,
			`"${casex(conf.from.Name, 'ca_se')}"`,
			new RegExp(`${casex(conf.from.Author, 'case')}/${casex(conf.from.Name, 'case')}`, "g"),
			new RegExp(conf.from.Description, "g"),
			new RegExp(conf.from.AuthorEmail, "g"),
			new RegExp(conf.from.Uri, "g"),
			new RegExp(conf.from.AuthorUri, "g"),
			new RegExp(conf.from.Author, "g"),
			new RegExp(conf.from.Name, "g"),
			new RegExp(casex(conf.from.Name, 'ca-se'), "g")
		],
		to: [
			`"${casex(conf.to.Name.toLowerCase(), 'ca-se')}"`,
			`"${casex(conf.to.Name.toLowerCase(), 'ca_se')}"`,
			`${casex(conf.to.Author, 'case')}/${casex(conf.to.Name, 'case')}`,
			conf.to.Description,
			conf.to.AuthorEmail,
			conf.to.Uri,
			conf.to.AuthorUri,
			conf.to.Author,
			conf.to.Name,
			casex(conf.to.Name.toLowerCase(), 'ca-se')
		]
	};
};

module.exports = async (config, ignoreFile) => {
	const replacePhp = await doReplacePhp(config, ignoreFile);
	try {
		const changes = await replace(replacePhp);
		console.log(
			chalk.blue(`\nModified ${chalk.bold("PHP")} files:\n`),
			chalk.yellow(changes.join(",\n"))
		);
	} catch (err) {
		console.error(err);
	}

	const replaceAssets = await doReplaceAssets(config, ignoreFile);
	try {
		const changes = await replace(replaceAssets);
		console.log(
			chalk.blue(`\nModified ${chalk.bold("Style and Script")} files:\n`),
			chalk.yellow(changes.join(",\n"))
		);
	} catch (err) {
		console.error(err);
	}

	const replaceConfigs = await doReplaceConfigs(config);
	try {
		const changes = await replace(replaceConfigs);
		console.log(
			chalk.blue(`\nModified ${chalk.bold("Config")} files:\n`),
			chalk.yellow(changes.join(",\n"))
		);
	} catch (err) {
		console.error(err);
	}
};
