// в процессе загрузки блокируем кнопку добавить
// во время загрузки нельзя редактировать imput
// class="is-invalid"
// если ошибка формы, введенную ссылку не стираем
import onChange from 'on-change'

export default (elements, i18n, state) => {
  const { t } = i18n
  const watchedState = onChange(state, (path, value) => {
    switch (path) {
      case 'form.isValid':
        if (value === 'valid') {
          elements.input.classList.remove('is-invalid')
          elements.input.focus()
          elements.input.value = ''
        }
        else {
          elements.input.classList.add('is-invalid')
        }
        break
      case 'form.errors':
        elements.errorContainer.textContent = t(value.key)
        elements.errorContainer.classList.add('text-danger')
        elements.errorContainer.classList.remove('text-success')
        break
      case 'form.status':
        if (value === 'processing') {
          elements.button.setAttribute('disabled', 'true')
          elements.input.setAttribute('disabled', 'true')
        }
        if (value === 'success') {
          elements.errorContainer.textContent = t('success')
          elements.errorContainer.classList.add('text-success')
          elements.errorContainer.classList.remove('text-danger')
          elements.button.removeAttribute('disabled')
          elements.input.removeAttribute('disabled')
        }
        if (value === 'failed') {
          elements.button.removeAttribute('disabled')
          elements.input.removeAttribute('disabled')
        }
        break
      default:
        break
    }
  })
  return watchedState
}
