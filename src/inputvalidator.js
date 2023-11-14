import * as yup from 'yup';
import i18n from 'i18next';
import rus from './locales/rus.js';

const validator = (inputValue) => {
  const button = document.getElementById('submit-button');
  const inputElement = document.getElementById('link-input');

  const validationSchema = yup.object().shape({
    rssLink: yup.string().url().required(),
  });

  validationSchema.validate({ rssLink: inputValue })
    .then(() => {
      inputElement.classList.remove('invalid');
      button.disabled = false;
      const errorMessage = document.getElementById('error-message');
      errorMessage.textContent = '';
    })
    .catch((error) => {
      inputElement.classList.add('invalid');
      button.disabled = true;
    });
};

const repeatValidator = (state, link) => {
  const inputElement = document.getElementById('link-input');
  const existingArticle = state.feeds.find((feed) => feed.link === link);
  if (existingArticle) {
    inputElement.classList.add('invalid');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = `${i18n.t('error.exists')}`;
    const submitButton = document.getElementById('submit-button');
    submitButton.disabled = true;
  } else {
    inputElement.classList.remove('invalid');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';
    const submitButton = document.getElementById('submit-button');
    submitButton.disabled = false;
  }
};

export { validator, repeatValidator };
