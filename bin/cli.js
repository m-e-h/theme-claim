#!/usr/bin/env node
"use strict";

const path = require("path");
const meow = require("meow");
const themeClaim = require("..");
const getConf = require("../lib/configPath");

const themeRoot = getConf.themeRoot;

const cli = meow(
	`
	Usage
	  $ theme-claim

	Options
		--config=<path>  Path to config [Default: ./themeclaim.json]
		--ignore=<path>  Specify an additional file or glob to ignore

	Examples
	  $ theme-claim --config='/build/conf.json' --ignore='**/*.ignore'
`,
	{
		flags: {
			config: {
				type: "string",
				alias: "c",
				default: getConf()
			},
			ignore: {
				type: "string",
				alias: "i",
				default: "**/*.ignore"
			}
		}
	}
);

const pathToConf = path.resolve(themeRoot, cli.flags.config);

module.exports = themeClaim(pathToConf, cli.flags.ignore);
