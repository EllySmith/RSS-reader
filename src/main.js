import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import i18n from 'i18next';
import Parser from 'rss-parser';
import axios from 'axios';
import rus from './locales/rus.js';
import { fetchTitle, fetchDescription, fetchEntries } from './fetchers.js';
import {
  feedListRender, entriesListRender, initialRender, renderButtons,
} from './renders.js';

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
    initialRender();

    const field = document.getElementById('link-input');
    field.focus();
    field.addEventListener('input', () => {
      const button = document.getElementById('submit-button');
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
        return;
      }

      const articleToAdd = {
        link: rssLink,
        title: '',
        id: state.feeds.length + 1,
        entries: [],
      };

      try {
        const title = await fetchTitle(rssLink);
        articleToAdd.title = title;
        const description = await fetchDescription(rssLink);
        articleToAdd.description = description;
        const entries = await fetchEntries(rssLink);
        articleToAdd.entries = entries;
        state.feeds.push(articleToAdd);
        state.articleCount += 1;
        render(state);
      } catch (error) {
        console.error('Error:', error);
      }

      const feedList = document.createElement('div');
      feedList.innerHTML = feedListRender(state);
      feedList.classList.add('feed-list');
      const feedListTitle = document.createElement('h2');
      feedListTitle.classList.add('feed-list-title');
      feedListTitle.textContent = i18n.t('feedlisttitle');

      const entriesList = document.createElement('div');
      entriesList.innerHTML = entriesListRender(state);
      entriesList.classList.add('entries-list');
      const entriesTitle = document.createElement('h2');
      entriesTitle.classList.add('entries-list-title');
      entriesTitle.textContent = i18n.t('entrieslisttitle');

      if (feedList.textContent !== '') {
        const mainContainer = document.getElementById('main-container');
        feedList.prepend(feedListTitle);
        entriesList.prepend(entriesTitle);
        mainContainer.append(feedList);
        mainContainer.append(entriesList);
        console.log(state);
      }

      const readMore = document.getElementsByClassName('read-more-button');
      const readMoreArray = [...readMore];
      renderButtons(state, readMoreArray);
    });
  };
  render(state);
};

app();

export default app;
