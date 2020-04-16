const { dd } = require(`dumper.js`)

const globula = require(`glob`)
const Queue = require(`p-queue`).default
const fs = require(`fs-extra`)
const sampleSize = require(`lodash.samplesize`)

const fullImageDataset = require(`../utils/get-image-dataset`)
const corruptImageList = require(`./open-image-dataset-v6/json/broken-images.json`)

const fileQueue = new Queue({ concurrency: 50 })

/**
 * Originally the pregenerated dataset was generated using corrupted images.
 * This script finds and replaces any corrupt images that were discovered using the ./remove-corrup-images.js script
 */
;(async () => {
  const articleFiles = await new Promise((resolve) =>
    globula(`./articles/**/*.json`, (_err, files) => resolve(files))
  )

  articleFiles.forEach((fileName) => {
    fileQueue.add(async () => {
      const fileJSONContents = await fs.readJSON(fileName)

      let hadUpdates = false

      const uncorruptedFileContents = fileJSONContents.map((article) => {
        if (corruptImageList.includes(article.image.url)) {
          hadUpdates = true

          // grab a new image to replace the corrupted one
          const [image] = sampleSize(fullImageDataset, 1)

          return {
            ...article,
            image,
          }
        }

        return article
      })

      if (hadUpdates) {
        await fs.writeJSON(fileName, uncorruptedFileContents)
      }
    })
  })

  await fileQueue.onIdle()
})()
