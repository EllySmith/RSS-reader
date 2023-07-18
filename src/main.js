import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import i18n from 'i18next';
import axios from 'axios';
import rus from './locales/rus.js';

const app = async () => {
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
    const mainContainer = document.getElementById('main-container');
    mainContainer.innerHTML = '';
    const inputForm = document.createElement('form');
    inputForm.id = 'input-form';

    const input = document.createElement('input');
    input.type = 'text';
    input.id = 'link-input';

    const button = document.createElement('button');
    button.type = 'submit';
    button.id = 'submit-button';

    inputForm.appendChild(input);
    inputForm.appendChild(button);

    mainContainer.appendChild(inputForm);
    const header = document.createElement('h1');
    header.textContent = `${i18n.t('title')}`;
    mainContainer.prepend(header);

    const field = document.getElementById('link-input');
    field.focus();
    field.addEventListener('input', () => {
      const inputElement = document.getElementById('link-input');
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
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const inputElement = document.getElementById('link-input');
      const rssLink = inputElement.value;
      const existingArticle = state.articles.find((article) => article.link === rssLink);
      if (existingArticle) {
        inputElement.classList.add('invalid');
        button.disabled = true;
        render(state);
        return;
      }

      const fetchData = async (link) => {
        try {
          const response = await axios.get(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`);
          const parser = new DOMParser();
          const doc = parser.parseFromString(response.data.contents, 'text/html');
          const titleElement = doc.querySelector('title');
          if (titleElement) {
            const title = titleElement.textContent;
            return title;
          }
          throw new Error('Title not found');
        } catch (error) {
          console.log('Error:', error);
          throw error;
        }
      };

      const articleToAdd = { link: rssLink, body: '', title: '' };
      try {
        const title = await fetchData(rssLink);
        articleToAdd.title = title;
        state.articles.push(articleToAdd);
        state.articleCount += 1;
        render(state);
      } catch (error) {
        console.error('Error:', error);
      }
    });

    state.articles.forEach((article) => {
      const container = document.createElement('div');
      const title = document.createElement('h2');
      title.textContent = article.title;
      title.classList.add('title');
      const body = document.createElement('p');
      body.textContent = article.body;
      const link = document.createElement('a');
      link.textContent = `${i18n.t('readmore')}`;
      link.href = `${article.link}`;
      link.classList.add('link');
      container.append(title);
      container.append(body);
      container.append(link);
      container.classList.add('link-container');
      mainContainer.appendChild(container);
    });
  };

  render(state);
};

app();

export default app;
