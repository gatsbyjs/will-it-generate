const fs = require(`fs-extra`)
const fetch = require(`node-fetch`)
const ProgressBar = require("progress")
const chalk = require(`chalk`)

exports.fetchPregeneratedDataAndWriteToDisk = async ({
  name,
  articleCount,
  directoryRoot,
}) => {
  // use articleCount to fetch articles from GH
  // https://raw.githubusercontent.com/gatsbyjs/will-it-generate/develop/src/data/articles/${level}/NUM_FILES = number of json files next to this NUM_FILES file
  const numFilesUrl = `https://raw.githubusercontent.com/gatsbyjs/will-it-generate/develop/src/data/articles/${articleCount}/NUM_FILES`

  const numFilesResponse = await fetch(numFilesUrl)

  if (numFilesResponse.status === 404) {
    throw new Error(`No pregenerated data found for ${articleCount} articles`)
  }

  if (numFilesResponse.status !== 200) {
    throw new Error(
      `${numFilesUrl} isn't responding. Status code ${numFilesResponse.status}`
    )
  }

  const directoryPath = `${directoryRoot}/${name}`
  fs.emptyDirSync(directoryPath)

  const numFiles = await numFilesResponse.json()

  console.log(
    chalk.bgBlue.white(`\n\n  Fetching ${numFiles} pregenerated JSON files \n`)
  )

  const bar = new ProgressBar(
    `[:bar] :rate/s | :current/:total | :percent | eta :etas`,
    {
      width: 50,
      total: numFiles,
    }
  )

  await Promise.all(
    Array.from(Array(numFiles).keys()).map(async (fileIndex) => {
      const jsonFileUrl = `https://raw.githubusercontent.com/gatsbyjs/will-it-generate/develop/src/data/articles/${articleCount}/${fileIndex}.json`

      const jsonContentsResponse = await fetch(jsonFileUrl)

      if (jsonContentsResponse.status === 404) {
        throw new Error(`No pregenerated data found at ${jsonFileUrl}`)
      }

      if (jsonContentsResponse.status !== 200) {
        throw new Error(
          `${numFilesUrl} isn't responding. Status code ${jsonContentsResponse.status}`
        )
      }

      const jsonContents = await jsonContentsResponse.json()

      const filePath = `${directoryPath}/${fileIndex}.json`

      await fs.ensureFile(filePath)
      await fs.writeJSON(filePath, jsonContents)
      bar.tick()
    })
  )
}
