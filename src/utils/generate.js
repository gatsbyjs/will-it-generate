const faker = require(`faker`)

exports.generateArticles = async ({
  imageDataSet,
  chunksPerFile,
  articleCount,
  bar,
  offset = 0,
}) => {
  const articles = []

  for (
    let articleNumber = 0 + offset;
    articleNumber <= offset + chunksPerFile - 1 && articleNumber < articleCount;
    articleNumber++
  ) {
    const image = {
      // to account for that some of our images url's no longer existed
      // if there is no image for this article
      ...(imageDataSet[articleNumber]
        ? imageDataSet[articleNumber]
        : // use another image from earlier in the array
          imageDataSet[articleNumber - imageDataSet.length]),
    }

    const title = faker.random.words(Math.floor(Math.random() * 5) + 3)

    const content = faker.random.words(500)

    const article = {
      articleNumber: articleNumber + 1,
      title,
      content,
      image,
    }

    articles.push(article)
    bar.tick()
  }

  return articles
}
