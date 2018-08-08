const fs = require("fs-extra");
const chalk = require("chalk");
const Case = require("case");
const replace = require("replace-in-file");
let conf = require("./configPath");
let uConf = conf.useConf;
let themeRoot = conf.themeRoot;

const doReplacements = async () => {
	let conf = await fs.readJson(uConf);

	return {
		ignore: [
			"vendor/**/*",
			"node_modules/**/*",
			".git/**/*",
			`${themeRoot}/vendor/**/*`,
			`${themeRoot}/node_modules/**/*`,
			`${themeRoot}/.git/**/*`
		],
		files: [
			`${themeRoot}/**/*.php`,
			`${themeRoot}/**/*.js`,
			`${themeRoot}/**/*.css`,
			`${themeRoot}/readme.md`
		],
		from: [
			new RegExp(conf.from.Description, "g"),
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
			conf.to.Description,
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

module.exports = renameTheme = async () => {
	const replacements = await doReplacements();
	try {
		const changes = await replace(replacements);
		console.log(
			chalk.bold("Changes were made in the following files:\n\n"),
			chalk.yellow(changes.join(",\n"))
		);
	} catch (err) {
		console.error(err);
	}
};
