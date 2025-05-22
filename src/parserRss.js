export default (linkData) => {
  const parserDoc = new DOMParser().parseFromString(linkData, 'application/xml')
  if (parserDoc.querySelector('parsererror')) throw new Error('errors.parserRss')
  if (!parserDoc.querySelector('rss') || !parserDoc.querySelector('channel')) {
    throw new Error('errors.parserRss')
  }
  return parserDoc
}
