const fs = require(`fs-extra`)
const sampleSize = require(`lodash.samplesize`)
const ProgressBar = require("progress")
const chalk = require(`chalk`)

const { generateArticles } = require(`./generate`)
const fullImageDataset = require(`./get-image-dataset`)

const arrayOfAscendingNumbers = (times) =>
  Array.from(new Array(times), (_, index) => index)

exports.generateArticlesAndWriteToDisk = async ({
  articleCount,
  name,
  directoryRoot = `data`,
  chunksPerFile = 5000,
}) => {
  const imageDataSet = sampleSize(fullImageDataset, articleCount)

  const numberOfFiles = Math.ceil(articleCount / chunksPerFile)
  const fileIndexes = arrayOfAscendingNumbers(numberOfFiles)

  const directoryPath = `${directoryRoot}/${name}`

  fs.emptyDirSync(directoryPath)

  console.log(
    chalk.bgBlue.white(
      `\n\n  Writing ${articleCount} articles into ${numberOfFiles} JSON files  \n`
    )
  )

  const bar = new ProgressBar(
    `[:bar] :rate/s | :current/:total | :percent | eta :etas`,
    {
      width: 50,
      total: articleCount,
    }
  )

  for await (const index of fileIndexes) {
    const data = await generateArticles({
      imageDataSet,
      chunksPerFile,
      articleCount,
      bar,
      offset: chunksPerFile * index,
    })

    const filePath = `${directoryPath}/${index}.json`

    await fs.ensureFile(filePath)
    await fs.writeJSON(filePath, data)
  }

  fs.writeFileSync(`${directoryPath}/NUM_FILES`, fileIndexes.length)
}
