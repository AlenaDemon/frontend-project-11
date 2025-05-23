import uniqueId from 'lodash/uniqueId.js'

export default (linkData, linkRss) => {
  const parserDoc = new DOMParser().parseFromString(linkData, 'application/xml')
  if (parserDoc.querySelector('parsererror')) throw new Error('errors.parserRss')
  if (!parserDoc.querySelector('rss') || !parserDoc.querySelector('channel')) {
    throw new Error('errors.parserRss')
  }
  const feedTitle = parserDoc.querySelector('title').textContent
  const feedDescription = parserDoc.querySelector('description').textContent
  const feedId = uniqueId()
  const feedData = [{
    id: feedId,
    title: feedTitle,
    description: feedDescription,
    linkRss,
  }]
  const posts = parserDoc.querySelectorAll('item')
  const postsData = Array.from(posts).map((item) => {
    const postTitle = item.querySelector('title').textContent
    const postLink = item.querySelector('link').textContent
    const postDescription = item.querySelector('description').textContent
    const postId = uniqueId()
    const post = {
      id: postId,
      title: postTitle,
      link: postLink,
      description: postDescription,
      feedId,
    }
    return post
  })
  return { feedData, postsData }
}
