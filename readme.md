# Theme Claim

> Rename a WP theme with a quick cli walk-through.

[![Version][version-badge]][npm]

[version-badge]: https://img.shields.io/npm/v/theme-claim.svg?style=flat-square
[npm]: https://npmjs.com/package/theme-claim

## Install

```shell
$ yarn add theme-claim --dev
```

## Usage

Add a `script` to your `package.json`

```json
"scripts": {
  "rename": "theme-claim",
}
```

Run the `"script"`

```shell
$ yarn rename
```

By default, the config is set up for use with an _in the works_ [starter theme](https://github.com/justintadlock/abc).

To rename any other theme, create a `themeclaim.json` and place it in the root of your theme with the following contents.
Change the data to match your current theme data exactly _(this is the data you're wanting to change)_.

```json
{
	"from": {
		"Name": "Mythic",
		"Description": "An awesome starter theme for WordPress.",
		"Namespace": "Mythic",
		"Uri": "https://themehybrid.com/themes/mythic",
		"Author": "Justin Tadlock",
		"AuthorEmail": "justintadlock@gmail.com",
		"AuthorUri": "https://themehybrid.com"
	}
}
```
