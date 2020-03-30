const { Command, flags } = require(`@oclif/command`)
const fs = require(`fs-extra`)
const asciiArt = require(`ascii-text-generator`)

const { generateArticlesAndWriteToDisk } = require(`./utils/write`)
const { generateAndWriteMDXFiles } = require(`./utils/generate-mdx`)
const { generateAndWriteMDFiles } = require(`./utils/generate-md`)

class WillitCommand extends Command {
  async run() {
    console.log(` `)
    console.log(` `)
    console.log(asciiArt(`Will it`, `2`))
    console.log(asciiArt(`Generate`, `2`))

    const { flags } = this.parse(WillitCommand)
    const fileType = flags.type || "json"
    const level = flags.level || 1
    const numPages = flags[`num-pages`]

    const isMDX = fileType === `mdx`
    const isMD = fileType === `md`

    const tempDir = `.temp---will-it-gen-json`
    const directoryRoot = isMDX || isMD ? tempDir : `data`

    const articleCount = numPages || Math.pow(2, level) * (512 / 2)

    const name = `willitbuild-${level < 10 ? `0` : ``}${level}`

    // generates JSON
    await generateArticlesAndWriteToDisk({
      name,
      articleCount,
      fileType,
      directoryRoot,
    })

    if (isMDX) {
      // converts the .temp json to mdx and places it in src/articles
      await generateAndWriteMDXFiles({
        name,
        directoryRoot,
      })
    } else if (isMD) {
      // converts the .temp json to md and places it in src/articles
      await generateAndWriteMDFiles({
        name,
        directoryRoot,
      })
    }

    if (isMDX || isMD) {
      // delete the .temp directory
      await fs.remove(`./${tempDir}`)
    }
  }
}

WillitCommand.description = `Generates either JSON or MDX files full of dummy data`

WillitCommand.flags = {
  // add --version flag to show CLI version
  version: flags.version({ char: "v" }),
  // add --help flag to show CLI version
  help: flags.help({ char: "h" }),
  level: flags.integer({
    char: "l",
    description:
      "The amount of articles to generate. Each level doubles starting from 512 at level 1. The default is 1.",
  }),
  "num-pages": flags.integer({
    char: "n",
    description: "The amount of pages to generate.",
  }),
  type: flags.string({
    char: "t",
    description: "The file type to output. either 'json' or 'mdx'",
  }),
}

module.exports = WillitCommand
