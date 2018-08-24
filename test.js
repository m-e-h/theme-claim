const test = require("ava");
const path = require("path");
const fs = require("fs-extra");
const casex = require("casex");
const replace = require("replace-in-file");
const fixturez = require('fixturez');
const writeFilesAtomic = require('write-files-atomic');
let conf = require("./lib/conf.json");
const f = fixturez(__dirname);

test('writes files', async t => {
  let tempDir = f.temp();

  let name = path.join(tempDir, 'name.txt');
  let namespace = path.join(tempDir, 'namespace.txt');

  await writeFilesAtomic([
    { filePath: name, fileContents: 'Mynamer' },
    { filePath: namespace, fileContents: 'namespace Myname' },
  ]);

	let options = {
		files: [
			name,
			namespace
		],
		from: [
			new RegExp('Mynamer', "g"),
			new RegExp('namespace Myname', "g")
		],
		to: [
			'Mytheme',
			'namespace MyTheme'
		]
	};

	try {
		const changes = await replace(options)
		t.is(await fs.readFile(namespace, 'utf8'), 'namespace MyTheme');
		t.is(await fs.readFile(name, 'utf8'), 'Mytheme');
	}
	catch (error) {
		console.error('Error occurred:', error);
	}


});
