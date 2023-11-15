import * as yup from 'yup';
import i18n from 'i18next';
import rus from './locales/rus.js';

const validator = (inputValue) => {
  const validationSchema = yup.object().shape({
    rssLink: yup.string().url().required(),
  });

  try {
    validationSchema.validateSync({ rssLink: inputValue });
    return true;
  } catch (error) {
    return false;
  }
};

const repeatValidator = (state, link) => {
  const inputElement = document.getElementById('link-input');
  const existingArticle = state.feeds.find((feed) => feed.link === link);
  if (existingArticle) {
    inputElement.classList.add('invalid');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = `${i18n.t('error.exists')}`;
  } else {
    inputElement.classList.remove('invalid');
    const errorMessage = document.getElementById('error-message');
    errorMessage.textContent = '';
  }
};

async function isValidRSS(link) {
  try {
    const response = await fetch(link);
    if (!response.ok) {
      return false;
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('xml')) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking RSS link:', error);
    return false;
  }
}

export { isValidRSS, validator, repeatValidator };
