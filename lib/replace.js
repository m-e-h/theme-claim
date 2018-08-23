"use strict";

const casex = require("casex");
const chalk = require("chalk");
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
			new RegExp(`\\$${casex(conf.from.Name, 'ca_se')}`, "g"),
			new RegExp(`${casex(conf.from.Name, 'ca_se')}/`, "g"),
			new RegExp(`${casex(conf.from.Name, 'ca_se')}_`, "g"),
			new RegExp(`${casex(conf.from.Name, 'ca-se')}-`, "g"),
			new RegExp(`'${casex(conf.from.Name, 'ca-se')}'`, "g"),
			new RegExp(` ${casex(conf.from.Name, 'ca-se')}`, "g"),
			new RegExp(`${casex(conf.from.Name, 'CaSe')}\\\\`, "g"),
			new RegExp(conf.from.AuthorEmail, "g"),
			new RegExp(conf.from.Uri, "g"),
			new RegExp(conf.from.AuthorUri, "g"),
			new RegExp(conf.from.Author, "g"),
			new RegExp(conf.from.Name, "g"),
			new RegExp(casex(conf.from.Name, 'ca_se'), "g"),
			new RegExp(casex(conf.from.Name, 'caSe'), "g")
		],
		to: [
			`namespace ${conf.to.Namespace}`,
			`${conf.to.Namespace}\\`,
			`@package   ${conf.to.Namespace}`,
			`\$${casex(conf.to.Name, 'ca_se')}`,
			`${casex(conf.to.Name, 'ca_se')}/`,
			`${casex(conf.to.Name, 'ca_se')}_`,
			`${casex(conf.to.Name, 'ca-se')}-`,
			`'${casex(conf.to.Name, 'ca-se')}'`,
			` ${casex(conf.to.Name, 'ca-se')}`,
			`${casex(conf.to.Name, 'CaSe')}\\`,
			conf.to.AuthorEmail,
			conf.to.Uri,
			conf.to.AuthorUri,
			conf.to.Author,
			conf.to.Name,
			casex(conf.to.Name, 'ca_se'),
			casex(conf.to.Name, 'caSe')
		]
	};
};

const doReplaceAssets = async conf => {
	return {
		ignore: [
			"vendor/**/*",
			"node_modules/**/*",
			".git/**/*",
			`${themeRoot}/vendor/**/*`,
			`${themeRoot}/node_modules/**/*`,
			`${themeRoot}/.git/**/*`
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

const doReplaceConfigs = async conf => {

	return {
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
			new RegExp(`text_domain" type="array" value="${casex(conf.from.Name, 'ca-se')}"`, "g"),
			new RegExp(`prefixes" type="array" value="${casex(conf.from.Name, 'ca_se')}"`, "g"),
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
			`text_domain" type="array" value="${casex(conf.to.Name, 'ca-se')}"`,
			`prefixes" type="array" value="${casex(conf.to.Name, 'ca_se')}"`,
			`${casex(conf.to.Author, 'case')}/${casex(conf.to.Name, 'case')}`,
			conf.to.Description,
			conf.to.AuthorEmail,
			conf.to.Uri,
			conf.to.AuthorUri,
			conf.to.Author,
			conf.to.Name,
			casex(conf.to.Name, 'ca-se')
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

	const replaceAssets = await doReplaceAssets(config);
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
