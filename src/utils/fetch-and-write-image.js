const fs = require(`fs-extra`)
const path = require(`path`)
const download = require(`image-downloader`)
const { dd } = require(`dumper.js`)
const retry = require(`async-retry`)
const Url = require(`url`)
const sampleSize = require(`lodash.samplesize`)

const fullImageDataset = require(`../data/open-image-dataset-v6/json/0.json`)

const fetchAndWriteImage = async ({ url, directory }) => {
  const fileName = path.parse(Url.parse(url).pathname).base

  if (await fs.exists(`${directory}/${fileName}`)) {
    return fileName
  }

  let imageUrl = url

  try {
    const fileName = await retry(
      async () => {
        const { filename: fileDirectory } = await download.image({
          url: imageUrl,
          dest: directory,
        })

        const fileName = path.parse(fileDirectory).base

        return fileName
      },
      {
        retries: 1000,
        factor: 1,
        onRetry: (error, attemptNumber) => {
          // try grabbing a new image from our image dataset
          const { url: newUrl } = sampleSize(fullImageDataset, 1)[0]

          console.log(`${imageUrl} not found.`)
          console.log(`trying ${newUrl} instead`)
          imageUrl = newUrl

          if (attemptNumber === 5) {
            console.log(directory)
            console.log(url)
            console.error(error)
          }
        },
      }
    )

    return fileName
  } catch (e) {
    dd(e)
  }
}

module.exports = fetchAndWriteImage
