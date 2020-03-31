const fs = require(`fs-extra`)
const kebabCase = require(`lodash.kebabcase`)
const path = require(`path`)
const ProgressBar = require("progress")
const chunk = require(`lodash.chunk`)
const chalk = require(`chalk`)

const fetchAndWriteImage = require(`./fetch-and-write-image`)

const generateMDX = async ({
  articleNumber,
  title,
  imageFileName,
  content,
}) => {
  return `---
articleNumber: ${articleNumber}
title: "${title}"
image: "${`./${imageFileName}`}"
---

import { Link } from "gatsby"

<Link to="/">Go Home</Link>

${content}
`
}

const generateAndWriteMDXFile = async ({ article }) => {
  const articlesDirectory = `${path.resolve()}/src/articles/${kebabCase(
    article.title
  )}`

  await fs.ensureDir(articlesDirectory)

  const imageFileName = await fetchAndWriteImage({
    url: article.image.url,
    directory: articlesDirectory,
  })

  const mdxFileContents = await generateMDX({
    ...article,
    imageFileName,
  })

  await fs.writeFile(`${articlesDirectory}/index.mdx`, mdxFileContents)
}

exports.generateAndWriteMDXFiles = async ({ name, directoryRoot }) => {
  const jsonDir = `./${directoryRoot}/${name}`
  const jsonFiles = (await fs.readdir(jsonDir)).filter(fileName =>
    fileName.includes(`.json`)
  )

  await fs.emptyDir(`${path.resolve()}/src/articles`)

  for (const jsonFile of jsonFiles) {
    const articles = await fs.readJSON(`${jsonDir}/${jsonFile}`)

    console.log(
      chalk.bgBlue.white(`\n\n  Generating MDX from ${name}/${jsonFile}  \n`)
    )

    const jsonBar = new ProgressBar(
      `[:bar] :rate/s | :current/:total | :percent | eta :etas`,
      {
        width: 50,
        total: articles.length,
      }
    )

    const chunkedArticles = chunk(articles, 10)

    for (const articles of chunkedArticles) {
      await Promise.all(
        articles.map(async article => {
          await generateAndWriteMDXFile({
            name,
            article,
          })
          jsonBar.tick()
        })
      )
    }

    console.log(`\n\n`)
  }
}
