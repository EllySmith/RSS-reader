import i18n from 'i18next';
import onChange from 'on-change';
import rus from './locales/rus.js';
import {
  renderForm, renderFeeds, renderEntries, renderModal, renderError,
} from './renders.js';
import fetchData from './fetchers.js';
import {
  validateURL, parseData, chekIfExists,
} from './utils.js';

async function initializeI18n() {
  await i18n.init({
    lng: 'ru',
    resources: {
      ru: {
        translation: rus.translation,
      },
    },
  });
}
await initializeI18n();

const app = () => {
  const elements = {
    form: document.querySelector('form'),
    submitButton: document.querySelector('add-button'),
    exampleMessage: document.getElementById('example'),
    header: document.getElementById('rss-header'),
    errorMessage: document.getElementById('error-message'),
    feedback: document.querySelector('.feedback'),
    input: document.querySelector('#url-input'),
    submit: document.querySelector('[type="submit"]'),
    postsContainer: document.querySelector('.posts'),
    entriesListTitle: document.createElement('h2'),
    feedsContainer: document.querySelector('.feeds'),
    feedListTitle: document.createElement('h2'),
    modal: document.querySelector('.modal'),
    readMore: document.querySelector('.full-article'),
    modalTitle: document.querySelector('.modal-title'),
    modalBody: document.querySelector('.modal-body'),
  };

  const state = {
    feeds: [],
    feedLinks: [],
    entries: [],
    currentEntryId: '0',
    viewedPosts: [],
    loadingStatus: 'success',
    form: {
      error: 'none',
      valid: true,
    },
  };

  const watchedState = onChange(state, elements, (path) => {
    switch (path) {
      case 'form.error':
        renderError(state, elements);
        break;
      case 'entries':
        renderEntries(state, elements);
        break;
      case 'feeds':
        renderFeeds(state, elements);
        break;
      case 'viewedPosts':
        renderEntries(state, elements);
        break;
      case 'currentEntryId':
        renderModal(state, elements);
        break;
      case 'loadingStatus':
        renderForm(state, elements);
        renderError(state, elements);
        break;
      default:
        break;
    }
  });

  const render = () => {
    renderForm(state, elements);
  };

  elements.postsContainer.addEventListener('click', (e) => {
    if (!e.target.dataset.id) {
      return;
    }
    watchedState.currentEntryId = e.target.dataset.id;
    if (!watchedState.viewedPosts.includes(e.target.dataset.id)) {
      watchedState.viewedPosts.push(e.target.dataset.id);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rssLink = formData.get('url');
    watchedState.loadingStatus = 'loading';

    validateURL(rssLink)
      .then(() => chekIfExists(rssLink, state.feedLinks))
      .then(() => fetchData(rssLink))
      .then((data) => {
        const newFeed = parseData(data);
        watchedState.feeds = [...state.feeds, newFeed];
        watchedState.entries = [...state.entries, ...newFeed.entries];
        watchedState.feedLinks = [...state.feedLinks, rssLink];
        watchedState.currentEntryId = '0';
        watchedState.loadingStatus = 'success';
        watchedState.form.error = 'rssloaded';
        watchedState.form.valid = true;
      })
      .catch((error) => {
        if (error.isAxiosError) {
          watchedState.form.error = 'noconnection';
          watchedState.form.valid = true;
        } else if (error.message.toLowerCase() === 'this must be a valid url') {
          watchedState.form.error = 'notalink';
          watchedState.form.valid = false;
        } else if (error.message.toLowerCase() === 'this url exists') {
          watchedState.form.error = 'exists';
          watchedState.form.valid = true;
        } else {
          watchedState.form.error = 'notanrss';
          watchedState.form.valid = true;
        }

        watchedState.loadingStatus = 'error';
        throw error;
      });
  };

  elements.form.addEventListener('submit', handleSubmit);

  render();

  const checkForNewEntries = () => {
    const promisesFeeds = state.feedLinks.map((feedLink) => fetchData(feedLink)
      .then((data) => {
        const parsedData = parseData(data);
        const currentFeed = state.feeds.find((feed) => feed.link === feedLink);
        const currentFeedIndex = state.feeds.findIndex((feed) => feed.link === feedLink);

        if (currentFeed && parsedData.items.length > currentFeed.entries.length) {
          state.feeds[currentFeedIndex].entries = parsedData.entries;
        }
      })
      .catch((error) => {
        throw error;
      }));

    return Promise.all(promisesFeeds)
      .finally(() => setTimeout(() => checkForNewEntries(state), 5000));
  };

  checkForNewEntries(state);
};

export default app;
