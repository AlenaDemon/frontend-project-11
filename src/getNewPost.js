import downloadRssFeed from './downloadRssFeed.js'

export default (state) => {
  const postsOld = state.data.posts
  return Promise.all(state.data.feeds.map(feed => downloadRssFeed(feed.linkRss)
    .then((data) => {
      const { postsData } = data
      const postsForCurrentFeed = postsOld.filter(({ feedId }) => feedId === feed.id)
      const linksCurrentPosts = postsForCurrentFeed.map(({ link }) => link)
      const newPosts = postsData.filter(({ link }) => (!linksCurrentPosts.includes(link)))
      if (newPosts.length > 0) {
        return newPosts.map(post => ({ ...post, feedId: feed.id }))
      }
      return []
    })
    .catch(() => {
      console.error(`Error when processing feed with ID: ${feed.id}`)
      return []
    })))
    .then(result => result.flat())
}
