import * as yup from 'yup'

export default (url, collectionUrl) => {
  return yup.string().url().notOneOf(collectionUrl).validate(url, { abortEarly: false })
}
yup.setLocale({
  string: {
    url: () => ({ key: 'errors.validUrl' }),
  },
  mixed: {
    notOneOf: () => ({ key: 'errors.notUniqueRss' }),
  },
})
