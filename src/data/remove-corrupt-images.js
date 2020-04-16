/**
 * Assuming that all referenced images are uploaded to Google Cloud (all current images are), this script converts the original image URL's to Cloud URL's
 */
const fs = require(`fs-extra`)
const { dd, dump } = require(`dumper.js`)
const chunk = require(`lodash.chunk`)
const probe = require(`probe-image-size`)
const PQueue = require(`p-queue`).default
const retry = require(`async-retry`)
const ProgressBar = require(`progress`)

const queue = new PQueue({ concurrency: 50 })

;(async () => {
  const imageSet0 = await fs.readJson(`./open-image-dataset-v6/json/0-0.json`)
  const imageSet1 = await fs.readJson(`./open-image-dataset-v6/json/0-1.json`)
  const imageSet = [...imageSet0, ...imageSet1]

  // for testing
  // const imageSet = [
  //   {
  //     url: `https://storage.googleapis.com/gatsby-open-images/farm6.staticflickr.com/24/90065256_228728b4a0_o.jpg`,
  //   },
  //   {
  //     url: `https://storage.googleapis.com/gatsby-open-images/farm4.staticflickr.com/231/480832935_6f730b0da1_o.jpg`,
  //   },
  // ]

  const corruptedImages = []

  const bar = new ProgressBar(
    `[:bar] :rate/s | :current/:total | :percent | eta :etas`,
    {
      width: 50,
      total: imageSet.length,
    }
  )

  for (let image of imageSet) {
    queue.add(async () => {
      let dimensions

      try {
        await retry(
          async (bail) => {
            let caughtError
            try {
              dimensions = await probe(image.url)
            } catch (e) {
              caughtError = e
            }

            if (dimensions === null && dimensions !== undefined) {
              bail()
            }

            if (
              caughtError &&
              caughtError.message === `unrecognized file format`
            ) {
              dimensions = null
              bail()
            }
          },
          {
            retries: 20,
            onRetry: (error) => {
              console.log(error)
            },
          }
        )
      } catch (e) {
        if (e.message !== `Aborted`) {
          dd(e.message)
        }
      }

      bar.tick()

      if (!dimensions) {
        console.log(`\n\nbad: ${image.url}`)
        corruptedImages.push(image)
        image = null
      } else {
        // console.log(`good: ${image.url}`)
      }
    })
  }

  await queue.onIdle()

  // write back to json in 2 files. extending the length of the url's makes the image dataset too large for GH
  const chunkedFileContents = chunk(imageSet, imageSet.length / 2 + 1)

  let counter = 0
  for await (const fileContentsChunk of chunkedFileContents) {
    await fs.writeJson(
      `./open-image-dataset-v6/json/0-${counter}.json`,
      fileContentsChunk.filter(Boolean)
    )
    counter++
  }

  await fs.writeJson(
    `./open-image-dataset-v6/json/broken-images.json`,
    corruptedImages
  )
})()
