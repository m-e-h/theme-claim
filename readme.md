# Theme Claim

> Rename a WP theme with a quick cli walk-through.

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
    "Uri": "https://github.com/justintadlock/mythic",
    "Author": "Justin Tadlock",
    "AuthorUri": "https://themehybrid.com",
    "Namespace": "Mythic"
  }
}
```
