willit
======

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
  - [Level](#level)
  - [Type](#type)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g willit
$ willit COMMAND
running command...
$ willit (-v|--version|version)
willit/0.0.1 darwin-x64 node-v10.16.3
$ willit --help [COMMAND]
USAGE
  $ willit COMMAND
...
```
<!-- usagestop -->
# Options
<!-- commands -->
## Level

```sh-session
willit --level=1
```

The level is the amount of articles to generate. Each level correlates to the number of times to double starting our base number of 512. So Level 1 = 512, Level 2 = 1024, Level 3 = 2048, etc

## Type

```sh-session
willit type="mdx" --level=1
```

There are two types currently, `json` or `mdx`. `json` is the default, `mdx` will generate temporary JSON files and then convert them to MDX in an `articles` directory.
<!-- commandsstop -->
