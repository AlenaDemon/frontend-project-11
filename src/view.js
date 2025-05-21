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
          elements.form.reset()
          elements.input.classList.remove('is-invalid')
          elements.errorContainer.classList.add('text-success')
          elements.errorContainer.classList.remove('text-danger')
          elements.errorContainer.textContent = t('success')
        }
        else {
          elements.input.classList.add('is-invalid')
          elements.errorContainer.classList.add('text-danger')
          elements.errorContainer.classList.remove('text-success')
        }
        break
      case 'form.errors':
        elements.errorContainer.textContent = t(value.key)
        break
      default:
    }
  })
  return watchedState
}
