import validate from './validate.js'
import i18next from 'i18next'
import * as yup from 'yup'
import resources from './locales/index.js'
import watch from './view.js'

export default () => {
  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.querySelector(`#url-input`),
    errorContainer: document.querySelector(`.feedback`),
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
    console.log(e.target)
    validate(url, watchedState.form.collectionUrl)
      .then ((link) => {
        watchedState.form.errors = []
        watchedState.form.isValid = 'valid'
        watchedState.form.collectionUrl.push(link)
      })
      .catch ((error) => {
        watchedState.form.isValid = 'invalid'
        watchedState.form.errors = error.message
      })
  })
}
