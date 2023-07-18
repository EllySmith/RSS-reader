import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import i18n from 'i18next';
import Parser from 'rss-parser';
import axios from 'axios';
import rus from './locales/rus.js';

const app = async () => {
  const state = {
    articleCount: 0,
    feeds:
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
      const existingArticle = state.feeds.find((feed) => feed.link === rssLink);
      if (existingArticle) {
        inputElement.classList.add('invalid');
        button.disabled = true;
        render(state);
        return;
      }

      const articleToAdd = {
        link: rssLink,
        body: '',
        title: '',
        id: state.feeds.length,
        entries: [],
      };

      const fetchTitle = async (link) => {
        try {
          const parser = new Parser();
          const feed = await parser.parseURL(link);
          if (feed.title) {
            return feed.title;
          }
          throw new Error('Title not found');
        } catch (error) {
          console.log('Error:', error);
          throw error;
        }
      };

      try {
        const allOriginsUrl = `https://allorigins.hexlet.app/get?url=${encodeURIComponent(rssLink)}`;
        const title = await fetchTitle(allOriginsUrl);
        articleToAdd.title = title;
        state.feeds.push(articleToAdd);
        state.articleCount += 1;
        render(state);
      } catch (error) {
        console.error('Error:', error);
      }
    });

    const feedList = document.createElement('div');
    feedList.classList.add('feed-list');
    state.feeds.forEach((article) => {
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
      feedList.append(container);
    });
    const feedListTitle = document.createElement('h2');
    feedListTitle.classList.add('feed-list-title');
    feedListTitle.textContent = i18n.t('feedlisttitle');
    if (feedList.textContent !== '') {
      feedList.prepend(feedListTitle);
      mainContainer.append(feedList);
    }
    console.log(state);
  };

  render(state);
};

app();

export default app;
