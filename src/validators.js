import * as yup from 'yup';
import i18n from 'i18next';
import rus from './locales/rus.js';
import { renderErrorMessage } from './renders.js';

const urlValidator = (inputValue) => {
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

async function rssValidator(link) {
  try {
    const response = await fetch(link);
    if (!response.ok) {
      return false;
    }
    const contentType = response.headers.get('content-type');
    const contentLegth = response.headers.get('content-length');
    if (contentType && contentType.includes('xml') && contentLegth > 0) {
      return true;
    }
    return false;
  } catch (error) {
    console.error('Error checking RSS link:', error);
    return false;
  }
}

export {
  rssValidator, urlValidator,
};
