const path = require("path");
const findUp = require("find-up");
const conf = require("./conf.json");
const foundFile = findUp.sync("functions.php");
const basePath = path.dirname(foundFile);

// const themeDir = async () => {
// 	const foundFile = await findUp.sync("functions.php");
// 	const foundPath = path.dirname(foundFile);
// 	return foundPath;
// };

// style.css file
const styleOptions = {
	files: `${basePath}/style.css`,
	from: ["themeurl.com", "Your Name"],
	to: [conf.themeUri, conf.themeAuthor]
};

// All theme files
const options = {
	files: [
		`${basePath}/app/**/*.php`,
		`${basePath}/resources/views/**/*.php`,
		`${basePath}/functions.php`,
		`${basePath}/style.css`,
		`${basePath}/readme.md`
	],
	from: [/ABC/g, /abc-/g, /abc_/g, /abc/g],
	to: [
		conf.themeName,
		`${conf.textDomain}-`,
		`${conf.textDomain}_`,
		conf.textDomain
	]
};

module.exports = {
	styleOptions,
	options
};
