/**
 * Assuming that all referenced images are uploaded to Google Cloud (all current images are), this script converts the original image URL's to Cloud URL's
 */
const PQueue = require(`p-queue`)
const fs = require(`fs-extra`)
const { dd } = require(`dumper.js`)
const chunk = require(`lodash.chunk`)

;(async () => {
  const imageSet = await fs.readJson(`./open-image-dataset-v6/json/0.json`)
  const storageUrl = `https://storage.googleapis.com/gatsby-open-images/`

  const chunkedImages = chunk(imageSet, 5000)

  for await (const imageChunk of chunkedImages) {
    for await (const image of imageChunk) {
      if (image.url.includes(storageUrl)) {
        continue
      }

      image.url = image.url
        .replace(`https://`, storageUrl)
        .replace(`http://`, storageUrl)
    }
  }

  // write back to json in 2 files. extending the length of the url's makes the image dataset too large for GH
  const chunkedFileContents = chunk(imageSet, imageSet.length / 2 + 1)

  let counter = 0
  for await (const fileContentsChunk of chunkedFileContents) {
    await fs.writeJson(
      `./open-image-dataset-v6/json/0-${counter}.json`,
      fileContentsChunk
    )
    counter++
  }
})()
