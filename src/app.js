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
      .catch((error) => {
        console.error(error.message.toLowerCase());

        if (error.isAxiosError) {
          watchedState.form.error = 'noconnection';
          watchedState.form.valid = true;
        } else if (error.message.toLowerCase() === 'this must be a valid url') {
          watchedState.form.error = 'notalink';
          watchedState.form.valid = false;
        } else {
          watchedState.form.error = 'notanrss';
          watchedState.form.valid = true;
        }

        watchedState.loadingStatus = 'error';
      });
  };

  const form = document.getElementById('input-form');
  form.addEventListener('submit', handleSubmit);

  render();

  const checkForNewEntries = () => {
    console.log('update');
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
        if (error.message.toLowerCase() === 'load failed') {
          watchedState.loadingStatus = 'error';
          watchedState.form.error = 'noconnection';
          watchedState.form.valid = true;
        }
      }));

    return Promise.all(promisesFeeds)
      .finally(() => setTimeout(() => checkForNewEntries(state), 3000));
  };

  checkForNewEntries(state);
};

export default app;
