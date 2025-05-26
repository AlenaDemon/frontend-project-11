import validate from './validate.js'
import i18next from 'i18next'
import * as yup from 'yup'
import resources from './locales/index.js'
import watch from './view.js'
import downloadRssFeed from './downloadRssFeed.js'
import getNewPost from './getNewPost.js'

const getProxyLink = link => `https://allorigins.hexlet.app/get?disableCache=true&url=${link}` // прокси, с помощью которого можно качать потоки.
export default () => {
  const i18n = i18next.createInstance()
  i18n.init({
    lng: 'ru',
    resources,
  })
    .then(() => {
      const elements = {
        form: document.querySelector('.rss-form'),
        input: document.querySelector('#url-input'),
        errorContainer: document.querySelector('.feedback'),
        buttonAdd: document.querySelector('button.btn-primary'),
        postsContainer: document.querySelector('.posts'),
        feedsContainer: document.querySelector('.feeds'),
        titleWiew: document.querySelector('.modal-title'),
        bodyWiew: document.querySelector('.modal-body'),
        buttonReadFull: document.querySelector('.full-article'),
      }

      const state = {
        form: {
          isValid: null,
          errors: {},
        },
        request: {
          status: 'filling', // "processing", "failed", "success"
        },
        data: {
          collectionUrl: [],
          feeds: [],
          posts: [],
        },
        ui: {
          postWiew: null,
        },
      }

      const watchedState = watch(elements, i18n, state)

      yup.setLocale({
        string: {
          url: () => ({ key: 'errors.validUrl' }),
        },
        mixed: {
          notOneOf: () => ({ key: 'errors.notUniqueRss' }),
        },
      })

      elements.form.addEventListener('submit', (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        const url = formData.get('url').trim()
        watchedState.request.status = 'processing'
        validate(url, watchedState.data.collectionUrl)
          .then ((link) => {
            downloadRssFeed(getProxyLink(link))
              .then((data) => {
                const { feedData, postsData } = data
                watchedState.data.feeds = [...feedData, ...watchedState.data.feeds]
                watchedState.data.posts = [...postsData, ...watchedState.data.posts]
                watchedState.form.errors = []
                watchedState.form.isValid = 'valid'
                watchedState.data.collectionUrl.push(link)
                watchedState.request.status = 'success'
              })
              .catch((error) => {
                watchedState.form.isValid = 'invalid'
                watchedState.form.errors = { key: error.message }
                watchedState.request.status = 'failed'
              })
          })
          .catch ((error) => {
            watchedState.request.status = 'filling'
            watchedState.form.isValid = 'invalid'
            watchedState.form.errors = error.message
            console.log(error.message)
          })
      })

      elements.postsContainer.addEventListener('click', (e) => {
        const el = e.target
        const postId = el.getAttribute('data-id')
        if (postId) {
          const posts = watchedState.data.posts.find(({ id }) => id === postId)
          watchedState.ui.postWiew = posts
        }
      })

      const updatePosts = () => {
        return getNewPost(watchedState)
          .then((newPosts) => {
            if (newPosts.length > 0) {
              watchedState.data.posts = [...newPosts, ...watchedState.data.posts]
            }
          })
          .catch(() => {
            watchedState.form.errors = { key: 'errors.updateError' }
          })
          .finally(() => {
            setTimeout(updatePosts, 5000)
          })
      }
      updatePosts()
    })
    .catch((err) => {
      console.log('Something went wrong loading', err)
    })
}
