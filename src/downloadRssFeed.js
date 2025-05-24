import axios from 'axios'
import parserRss from './parserRss.js'

export default link => axios.get(link, {
  timeout: 10000,
})
  .then((response) => {
    return parserRss(response.data.contents, link)
  })
  .catch((error) => {
    if (error.code === 'ECONNABORTED') { // Ошибка таймаута
      throw new Error('errors.networkError')
    }
    if (error.isAxiosError) {
      throw new Error('errors.networkError')
    }
    throw error
  })
