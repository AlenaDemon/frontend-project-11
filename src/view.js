// в процессе загрузки блокируем кнопку добавить
// во время загрузки нельзя редактировать imput
// class="is-invalid"
// если ошибка формы, введенную ссылку не стираем
import onChange from 'on-change'

export default (elements, i18n, state) => {
  const { t } = i18n
  const watchedState = onChange(state, (path, value) => {
    console.log(path, value)
    switch (path) {
      case 'form.isValid':
        if (value === 'valid') {
          elements.input.classList.remove('is-invalid')
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
        if (value === 'success') {
          elements.errorContainer.textContent = t('success')
          elements.errorContainer.classList.add('text-success')
          elements.errorContainer.classList.remove('text-danger')
        }
        break
      default:
        break
    }
  })
  return watchedState
}
