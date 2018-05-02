const chalk = require('chalk');
const clear = require('clear');
const prompt = require('./src/prompt');
const boxen = require('boxen');

(() => {
	clear();
	console.log(
		boxen(
			chalk.bold.hex('#3d627d')('Theme') + '\n\nStarter', { padding: 1, margin: 1, borderStyle: 'round', float: 'center', align: 'center' }
		)
	);
	prompt.nameReplace();
})();
