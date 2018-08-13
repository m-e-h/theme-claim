"use strict";

const path = require("path");
const fs = require("fs-extra");
const findUp = require("find-up");
const foundFile = findUp.sync("style.css");
const themeRoot = path.dirname(foundFile);
const userConf = `${themeRoot}/themeclaim.json`;

module.exports = (config = userConf) => {
	if (!fs.existsSync(config)) {
		config = `${path.resolve(__dirname)}/conf.json`;
	}
	return config;
};

module.exports.themeRoot = themeRoot;
