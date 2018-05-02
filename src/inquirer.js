const inquirer = require('inquirer');

module.exports = {
	themeQuestions: () => {
		const questions = [
			{
				type: 'input',
				name: 'theme_name',
				message: 'Theme Name:'
			},
			{
				type: 'input',
				name: 'text_domain',
				message: 'Theme text-domain:'
			},
			{
				type: 'input',
				name: 'theme_author',
				message: 'Theme Author:'
			},
			{
				type: 'input',
				name: 'theme_uri',
				message: 'Theme URI:'
			}
		];
		return inquirer.prompt(questions);
	}
};
