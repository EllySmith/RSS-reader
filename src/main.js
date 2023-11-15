import './styles.scss';
import 'bootstrap';
import i18n from 'i18next';
import rus from './locales/rus.js';
import {
  feedListRender, entriesListRender, initialRender, renderButtons, renderErrorMessage,
} from './renders.js';
import fetchInfo from './fetchers.js';
import {
  rssValidator, repeatValidator, urlValidator,
} from './validators.js';

const app = async () => {
  const state = {
    linkState: 'invalid',
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

    const form = document.querySelector('form');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const inputElement = document.getElementById('link-input');
      const rssLink = inputElement.value;

      if (!urlValidator(rssLink)) {
        renderErrorMessage('notalink');
        inputElement.classList.add('invalid');
        return;
      }

      if (!rssValidator(rssLink)) {
        renderErrorMessage('notanrss');
        return;
      }

      if (state.feeds.find((feed) => feed.link === rssLink)) {
        renderErrorMessage('exists');
        return;
      }

      const submitButton = document.querySelector('button[type="submit"]');

      try {
        submitButton.disabled = true;
        const newFeed = {
          link: rssLink,
          id: state.feeds.length + 1,
          title: await fetchInfo(rssLink, 'title'),
          description: await fetchInfo(rssLink, 'description'),
          entries: await fetchInfo(rssLink, 'entries'),
        };
        state.feeds.push(newFeed);
        state.feedLinks.push(rssLink);
        state.feedCount += 1;
        render(state);
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = `${i18n.t('rssloaded')}`;
        inputElement.classList.remove('invalid');
        submitButton.disabled = false;
      } catch (error) {
        console.error('Error:', error);
        renderErrorMessage('notanrss');
        submitButton.disabled = false;
      }

      if (state.feedCount > 0) {
        const feedList = document.createElement('div');
        feedList.innerHTML = feedListRender(state);
        feedList.classList.add('feed-list');

        const entriesList = document.createElement('div');
        entriesList.innerHTML = entriesListRender(state);
        entriesList.classList.add('entries-list');

        const mainContainer = document.getElementById('main-container');
        mainContainer.append(feedList);
        mainContainer.append(entriesList);
        const readMore = document.getElementsByClassName('read-more-button');
        const readMoreArray = [...readMore];
        renderButtons(state, readMoreArray);
      }
    });
  };

  render(state);
};

app();

export default app;
