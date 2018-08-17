#!/usr/bin/env node
"use strict";

const path = require("path");
const meow = require("meow");
const themeClaim = require("./lib/theme-claim");
const getConf = require("./lib/configPath");

const themeRoot = getConf.themeRoot;

const cli = meow(
	`
	Usage
	  $ theme-claim --config=<path>

	Options
	  --config=<path>  Path to config [Default: ./themeclaim.json]

	Examples
	  $ theme-claim --config='/build/conf.json'
`,
	{
		flags: {
			config: {
				type: "string",
				alias: "c",
				default: getConf()
			}
		}
	}
);

const pathToConf = path.resolve(themeRoot, cli.flags.config);

(async () => {
	return await themeClaim(pathToConf);
})();

module.exports = async (config = pathToConf) => {
	return await themeClaim(config);
}
