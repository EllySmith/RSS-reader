import i18n from 'i18next';
import onChange from 'on-change';
import rus from './locales/rus.js';
import {
  renderForm, renderFeeds,
} from './renders.js';
import fetchInfo from './fetchers.js';
import {
  rssValidator, repeatValidator, urlValidator,
} from './validators.js';
import updateFeeds from './updatefeeds.js';

const app = () => {
  const state = {
    feeds: [],
    entries: [],
    currentEntryId: '0',
    seenPosts: [],
    loadingStatus: 'success',
    form: {
      error: null,
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

  const changeModalId = (button) => {
    const postId = button.getAttribute('postId');
    watchedState.currentEntryId = postId;
  };

  const zeroModalId = () => {
    watchedState.currentEntryId = '0';
  };

  const render = () => {
    renderForm(state);
    if (state.feeds.length > 0) {
      renderFeeds(state);
      const readMore = document.getElementsByClassName('read-more-button');
      const readMoreArray = [...readMore];
      console.log('read more array', readMoreArray);
      readMoreArray.forEach((readbutton) => {
        readbutton.addEventListener('click', changeModalId(readbutton));
      });
    }

    const closeModalButton = document.getElementById('close-modal-btn');
    closeModalButton.addEventListener('click', () => {
      zeroModalId();
    });
  };

  const watchedState = onChange(state, render);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const rssLink = formData.get('url');

    if (!urlValidator(rssLink)) {
      watchedState.form.error = 'notalink';
      watchedState.form.valid = false;
      return;
    }

    if (!rssValidator(rssLink)) {
      watchedState.form.error = 'notanrss';
      watchedState.form.valid = true;
      return;
    }

    if (state.feeds.find((feed) => feed.link === rssLink)) {
      watchedState.form.error = 'exists';
      watchedState.form.valid = true;
      return;
    }

    watchedState.loadingStatus = 'loading';

    fetchInfo(rssLink, 'title')
      .then((title) => fetchInfo(rssLink, 'description')
        .then((description) => fetchInfo(rssLink, 'entries')
          .then((entries) => {
            const newFeed = {
              link: rssLink,
              id: state.feeds.length + 1,
              title,
              description,
              entries,
            };

            watchedState.feeds = [...state.feeds, newFeed];
            watchedState.entries = [...state.entries, ...newFeed.entries];
            watchedState.currentEntryId = '0';
            watchedState.loadingStatus = 'success';
            watchedState.form = { error: 'rssloaded', valid: true };
          })))
      .catch((error) => {
        console.error('Error:', error);
        watchedState.form.error = 'notanrss';
        watchedState.loadingStatus = 'error';
      });
  };

  const form = document.getElementById('input-form');
  form.addEventListener('submit', handleSubmit);

  render();

  setInterval(async () => {
    try {
      await updateFeeds(state, render);
    } catch (error) {
      state.form.error = 'noconnection';
      onChange(state);
    }
  }, 60000);
};

export default app;
