# willit

Gatsby&#39;s benchmark data generator

Generates JSON or MDX files, with a datashape resembling a typical article, into the current directory.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/willit.svg)](https://npmjs.org/package/willit)
[![Downloads/week](https://img.shields.io/npm/dw/willit.svg)](https://npmjs.org/package/willit)
[![License](https://img.shields.io/npm/l/willit.svg)](https://github.com/gatsbyjs/will-it-generate/blob/master/package.json)

<!-- toc -->

- [willit](#willit)
- [Usage](#usage)
- [Options](#options)
  - [level](#level)
  - [num-pages](#num-pages)
  - [type](#type)
  - [use-pregenerated-data](#use-pregenerated-data)
    <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g willit
$ willit COMMAND
running command...
$ willit (-v|--version|version)
willit/0.0.7 darwin-x64 node-v10.16.3
$ willit --help [COMMAND]
USAGE
  $ willit COMMAND
...
```

<!-- usagestop -->

# Options

<!-- commands -->

## level

```sh-session
willit --level=1
```

The level is the amount of articles to generate. Each level correlates to the number of times to double starting our base number of 512. So Level 1 = 512, Level 2 = 1024, Level 3 = 2048, etc

## num-pages

```sh-session
willit --num-pages=512
```

`num-pages` allows a specific number of articles to be generated. It overrides `level` if both are used.

## type

```sh-session
willit type="mdx" --level=1
```

There are three types currently, `json`, `mdx`, or `md`. `json` is the default and will generate JSON files into a `data` directory. `mdx` and `md` will generate temporary JSON files and then convert them to MDX in a `src/articles` directory.

## use-pregenerated-data

```sh-session
willit --use-pregenerated-data --level=1 --type="mdx"
```

This fetches pre-generated data from the repo instead of generating on the fly

<!-- commandsstop -->
