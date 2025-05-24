// в процессе загрузки блокируем кнопку добавить
// во время загрузки нельзя редактировать imput
// class="is-invalid"
// если ошибка формы, введенную ссылку не стираем
import onChange from 'on-change'

export default (elements, i18n, state) => {
  const { t } = i18n
  const renderForFeeds = () => {
    const divCard = document.createElement('div')
    divCard.classList.add('card', 'border-0')

    const divCardBody = document.createElement('div')
    divCardBody.classList.add('card-body')

    const ul = document.createElement('ul')
    ul.classList.add('list-group', 'border-0', 'rounded-0')

    divCard.append(divCardBody)
    divCard.append(ul)

    const h2 = document.createElement('h2')
    h2.classList.add('card-title', 'h4')
    h2.textContent = t('feeds')
    divCardBody.append(h2)

    return { divCard, ul }
  }

  const feedsItem = (feeds, list) => { //  ul
    feeds.map((feed) => {
      const li = document.createElement('li')
      li.classList.add('list-group-item', 'border-0', 'border-end-0')
      const h3 = document.createElement('h3')
      h3.classList.add('h6', 'm-0')
      h3.textContent = feed.title
      li.append(h3)

      const p = document.createElement('p')
      p.classList.add('m-0', 'small', 'text-black-50')
      p.textContent = feed.description
      li.append(p)

      list.append(li)
    })
  }
  const renderForPosts = () => {
    const divCard = document.createElement('div')
    divCard.classList.add('card', 'border-0')

    const divCardBody = document.createElement('div')
    divCardBody.classList.add('card-body')

    const ul = document.createElement('ul')
    ul.classList.add('list-group', 'border-0', 'rounded-0')

    divCard.append(divCardBody)
    divCard.append(ul)

    const h2 = document.createElement('h2')
    h2.classList.add('card-title', 'h4')
    h2.textContent = t('posts')
    divCardBody.append(h2)

    return { divCard, ul }
  }

  const postsItem = (posts, list) => {
    posts.map((post) => {
      const li = document.createElement('li')
      li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0')
      const a = document.createElement('a')
      a.setAttribute('href', `${post.link}`)
      a.classList.add('fw-bold')
      a.setAttribute('data-id', `${post.id}`)
      a.setAttribute('target', '_blank')
      a.setAttribute('rel', 'noopener noreferrer')
      a.textContent = post.title
      li.append(a)

      const button = document.createElement('button')
      button.classList.add('btn', 'btn-outline-primary', 'btn-sm')
      button.setAttribute('type', 'button')
      button.setAttribute('data-id', `${post.id}`)
      button.setAttribute('data-bs-toggle', 'modal')
      button.setAttribute('data-bs-target', '#modal')
      button.textContent = i18n.t('buttonPost')
      li.append(button)

      list.append(li)
    })
  }

  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.isValid':
        if (value === 'valid') {
          elements.input.classList.remove('is-invalid')
        }
        else {
          elements.input.classList.add('is-invalid')
        }
        break
      case 'errors':
        elements.errorContainer.textContent = t(value.key)
        elements.errorContainer.classList.add('text-danger')
        elements.errorContainer.classList.remove('text-success')
        break
      case 'form.status':
        if (value === 'processing') {
          elements.buttonAdd.setAttribute('disabled', 'true')
          elements.input.setAttribute('disabled', 'true')
        }
        if (value === 'success') {
          elements.errorContainer.textContent = t('success')
          elements.errorContainer.classList.add('text-success')
          elements.errorContainer.classList.remove('text-danger')
          elements.buttonAdd.removeAttribute('disabled')
          elements.input.removeAttribute('disabled')
          elements.input.focus()
          elements.input.value = ''
        }
        if (value === 'failed') {
          elements.buttonAdd.removeAttribute('disabled')
          elements.input.removeAttribute('disabled')
        }
        break
      case 'feeds': {
        const { divCard, ul } = renderForFeeds()
        elements.feedsContainer.innerHTML = ''
        elements.feedsContainer.append(divCard)
        feedsItem(value, ul)
      }
        break
      case 'posts':{
        const { divCard, ul } = renderForPosts()
        elements.postsContainer.innerHTML = ''
        elements.postsContainer.append(divCard)
        postsItem(value, ul)
      }
        break
      case 'postButtonWiew': {
        elements.titleWiew.textContent = value.title
        elements.bodyWiew.textContent = value.description
        elements.buttonReadFull.setAttribute('href', `${value.link}`)
        const a = document.querySelector(`a[data-id="${value.id}"]`)
        a.classList.remove('fw-bold')
        a.classList.add('fw-normal', 'link-secondary')
      }
        break
      case 'aClick': {
        value.classList.remove('fw-bold')
        value.classList.add('fw-normal', 'link-secondary')
      }
        break
      default:
        break
    }
  })
  return watchedState
}
