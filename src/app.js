import validate from './validate.js'
import i18next from 'i18next'
import * as yup from 'yup'
import resources from './locales/index.js'
import watch from './view.js'
// import axios from 'axios'
import requestUrl from './requestUrl.js'

const proxyLink = 'https://allorigins.hexlet.app/get?disableCache=true&url=' // прокси, с помощью которого можно качать потоки.
export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector(`#url-input`),
    errorContainer: document.querySelector(`.feedback`),
    button: document.querySelector('button'),
  }
  const i18n = i18next.createInstance()
  i18n.init({
    lng: 'ru',
    resources,
  })
  const state = {
    form: {
      status: 'filling', // "processing", "failed", "success"
      isValid: null,
      errors: {},
      collectionUrl: [],
    },
    parserRss: null,

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
    watchedState.form.status = 'processing'
    validate(url, watchedState.form.collectionUrl)
      .then ((link) => {
        requestUrl(`${proxyLink}${link}`)
          .then((data) => {
            console.log(data)
            watchedState.form.errors = []
            watchedState.form.isValid = 'valid'
            watchedState.form.collectionUrl.push(link)
            watchedState.form.status = 'success'
          })
          .catch((error) => {
            console.log(error.message)
            watchedState.form.isValid = 'invalid'
            watchedState.form.errors = { key: error.message }
            watchedState.form.status = 'failed'
          })
        console.log(watchedState.form.collectionUrl)
      })
      .catch ((error) => {
        watchedState.form.isValid = 'invalid'
        watchedState.form.errors = error.message
      })
  })
}
