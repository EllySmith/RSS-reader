import i18n from 'i18next';
import onChange from 'on-change';
import rus from './locales/rus.js';
import {
  renderForm, renderFeeds, renderEntries, renderModal, renderError,
} from './renders.js';
import fetchData from './fetchers.js';
import {
  validateURL, parseData,
} from './utils.js';
import updateFeeds from './updatefeeds.js';

const app = () => {
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

  i18n.init({
    lng: 'ru',
    resources: {
      ru: {
        translation: rus.translation,
      },
    },
  });

  const watchedState = onChange(state, (path) => {
    switch (path) {
      case 'form.error':
        renderError(state);
        console.log(state);
        break;
      case 'entries':
        renderEntries(state);
        console.log(state);
        break;
      case 'feeds':
        renderFeeds(state);
        console.log(state);
        break;
      case 'viewedPosts':
        renderEntries(state);
        console.log(state);
        break;
      case 'currentEntryId':
        renderModal(state);
        console.log(state);
        break;
      case 'loadingStatus':
        renderForm(state);
        renderError(state);
        console.log(state);
        break;
      default:
        break;
    }
  });

  const render = () => {
    renderForm(state);
    renderError(state);
    if (state.feeds.length > 0) {
      renderFeeds(state);
      renderEntries(state);
    }
    if (state.currentEntryId !== '0') {
      renderModal(state);
    }
  };

  const postsContainer = document.getElementById('posts');
  postsContainer.addEventListener('click', (e) => {
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
    if (state.feedLinks.includes(rssLink)) {
      watchedState.form.error = 'exists';
      watchedState.form.valid = true;
      watchedState.loadingStatus = 'error';
      return;
    }
    watchedState.loadingStatus = 'loading';

    validateURL(rssLink)
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
      .catch((validationError) => {
        console.error(validationError);
        watchedState.form.error = 'notalink';
        watchedState.form.valid = false;
        watchedState.loadingStatus = 'error';
      })
      .catch((fetchError) => {
        console.error(fetchError);
        watchedState.form.error = 'notanrss';
        watchedState.form.valid = true;
        watchedState.loadingStatus = 'error';
      });
  };

  const form = document.getElementById('input-form');
  form.addEventListener('submit', handleSubmit);

  render();
};

export default app;
