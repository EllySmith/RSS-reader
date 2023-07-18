import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import i18n from 'i18next';
import rus from './locales/rus.js';

const app = () => {
  const state = {
    articleCount: 0,
    articles:
       [],
  };

  i18n.init({
    lng: 'ru',
    resources: {
      ru: {
        translation: rus.translation,
      },
    },
  });
  i18n.changeLanguage('ru');

  const render = () => {
    const header = document.createElement('h1');
    const mainContainer = document.querySelector('body');
    header.textContent = `${i18n.t('title')}`;
    mainContainer.prepend(header);

    const field = document.getElementById('link-input');
    field.focus();
    field.addEventListener('input', () => {
      const inputElement = document.getElementById('link-input');
      const button = document.getElementById('submit-button');
      const validationSchema = yup.object().shape({
        rssLink: yup.string().url().required(),
      });
      const rssLink = inputElement.value.trim();
      validationSchema.validate({ rssLink }).then(() => {
        inputElement.classList.remove('invalid');
        button.disabled = false;
      }).catch(() => {
        inputElement.classList.add('invalid');
        button.disabled = true;
      });
    });

    const submitButton = document.getElementById('submit-button');
    submitButton.textContent = `${i18n.t('addRSS')}`;

    const form = document.getElementById('input-form');
    const formInputField = document.getElementById('link-input');
    formInputField.setAttribute('placeholder', `${i18n.t('placeholder')}`);
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputElement = document.getElementById('link-input');
      const result = inputElement.value;
      const title = document.createElement('p');
      const newElement = document.createElement('div');
      newElement.append(title);
      newElement.classList.add('link-container');
      title.textContent = `${result}`;
      const container = document.querySelector('body');

      const existingArticle = state.articles.find((article) => article.title === result);
      if (existingArticle) {
        inputElement.classList.add('invalid');
        const button = document.getElementById('submit-button');
        button.disabled = true;
        return;
      }

      container.append(newElement);
      let articlename = '';
      fetch(result)
        .then((response) => response.text())
        .then((text) => {
          articlename = text;
          console.log('Page title:', articlename);

          state.articles.push({ title: `${result}`, body: '', header: `${articlename}` });
          inputElement.value = '';
        })
        .catch((error) => {
          console.log('Error:', error);
        });
    });
  };

  render(state);
};

app();

export default app;
