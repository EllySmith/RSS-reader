import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';
import i18n from 'i18next';
import Parser from 'rss-parser';
import axios from 'axios';
import rus from './locales/rus.js';
import {
  feedListRender, entriesListRender, initialRender, renderButtons,
} from './renders.js';
import fetchInfo from './fetchers.js';
import updateFeeds from './updatefeeds.js';

import { rssValidator, validator, repeatValidator } from './inputvalidator.js';

const app = async () => {
  const state = {
    feedCount: 0,
    feedLinks: [],
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

    const form = document.querySelector('form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const inputElement = document.getElementById('link-input');
      const rssLink = inputElement.value;
      const existingArticle = state.feeds.find((feed) => feed.link === rssLink);
      if (!validator(rssLink)) {
        inputElement.classList.add('invalid');
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = `${i18n.t('error.notalink')}`;
        return;
      }

      if (existingArticle) {
        inputElement.classList.add('invalid');
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = `${i18n.t('error.exists')}`;
        return;
      }

      if (!rssValidator) {
        inputElement.classList.add('invalid');
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = `${i18n.t('error.notanrss')}`;
        return;
      }

      const submitButton = document.querySelector('button[type="submit"]');

      try {
        submitButton.disabled = true;
        const newFeed = {
          link: rssLink,
          id: state.feeds.length + 1,
        };
        newFeed.title = await fetchInfo(rssLink, 'title');
        newFeed.description = await fetchInfo(rssLink, 'description');
        newFeed.entries = await fetchInfo(rssLink, 'entries');
        state.feeds.push(newFeed);
        state.feedLinks.push(rssLink);
        state.feedCount += 1;
        render(state);
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = `${i18n.t('rssloaded')}`;
        submitButton.disabled = false;
      } catch (error) {
        console.error('Error:', error);
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = `${i18n.t('error.notanrss')}`;
        submitButton.disabled = false;
      }

      const feedList = document.createElement('div');
      feedList.innerHTML = feedListRender(state);
      feedList.classList.add('feed-list');

      const entriesList = document.createElement('div');
      entriesList.innerHTML = entriesListRender(state);
      entriesList.classList.add('entries-list');

      if (state.feedCount > 0) {
        const mainContainer = document.getElementById('main-container');
        mainContainer.append(feedList);
        mainContainer.append(entriesList);
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
