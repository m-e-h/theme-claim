const path = require("path");
const fs = require("fs-extra");
const findUp = require("find-up");
const foundFile = findUp.sync("style.css");
const themeRoot = path.dirname(foundFile);
const userConf = `${themeRoot}/themeclaim.json`;

function getConf(file) {
	if (!fs.existsSync(file)) {
		file = `${path.resolve(__dirname)}/conf.json`;
	}
	return file;
}
const useConf = getConf(userConf)

const reqConf = require(getConf(userConf));

module.exports.useConf = useConf;
module.exports.reqConf = reqConf;
module.exports.themeRoot = themeRoot;
