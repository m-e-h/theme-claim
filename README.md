# Theme Claim

> Rename a WP theme with a quick cli walk-through.

## Install

Add to your `devDependencies` in `package.json`
```json
"devDependencies": {
	"theme-claim": "github:m-e-h/theme-claim",
	...
}
```
Add a `script` to your `package.json`
```json
"scripts": {
	"rename": "node node_modules/theme-claim",
	...
}
```
Install your deps
```shell
$ yarn
```

## Usage

Run the `"script"`
```shell
$ yarn rename
```

For now the config is set up for use with 
To rename any other theme, take a look at `node_modules/theme-claim/conf.json` and make it match your current theme data exactly _(this is the data you're wanting to change)_.
