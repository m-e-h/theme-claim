const fs = require("fs-extra");
const askQuestions = require("./questions");
const conf = require("./configPath");
let uConf = conf.useConf;
let rConf = conf.reqConf;

module.exports = saveAnswers = async () => {
	const answers = await askQuestions();
	const {
		theme_name,
		theme_description,
		name_space,
		theme_uri,
		theme_author,
		theme_author_uri,
		theme_author_email
	} = answers;

	const toConf = JSON.stringify(
		{
			from: {
				Name: rConf.from.Name,
				Description: rConf.from.Description,
				Namespace: rConf.from.Namespace,
				Uri: rConf.from.Uri,
				Author: rConf.from.Author,
				AuthorEmail: rConf.from.AuthorEmail,
				AuthorUri: rConf.from.AuthorUri
			},
			to: {
				Name: theme_name,
				Description: theme_description,
				Namespace: name_space,
				Uri: theme_uri,
				Author: theme_author,
				AuthorEmail: theme_author_email,
				AuthorUri: theme_author_uri
			}
		},
		null,
		2
	);

	try {
		await fs.writeFile(uConf, toConf);
		console.log("Config updated.");
	} catch (err) {
		console.error(err);
	}
};
