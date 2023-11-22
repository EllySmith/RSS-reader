import i18n from 'i18next';
import rus from './locales/rus.js';
import {
  renderForm, renderFeeds, renderModal,
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
    loadingStatus: 'loaded',
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

  const render = () => {
    renderForm(state);
    if (state.feeds.length > 0) {
      renderFeeds(state);
      const readMore = document.getElementsByClassName('read-more-button');
      const readMoreArray = [...readMore];
      readMoreArray.forEach((readbutton) => {
        readbutton.addEventListener('click', () => {
          console.log(readbutton);
          const postId = readbutton.getAttribute('postId');
          console.log('post id:', postId);
          state.currentEntryId = postId;
          console.log('current enntry id:', state.currentEntryId);
          renderModal(state);
        });
      });
      const closeModalButton = document.getElementById('close-modal-btn');
      closeModalButton.addEventListener('click', () => {
        console.log('close modal button click');
        state.currentEntryId = '0';
        console.log('currentpost id is', state.currentEntryId);
        renderModal(state);
      });
    }
  };

  const onChange = (newState) => {
    Object.assign(state, newState);
    render(state);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputElement = document.getElementById('url-input');
    const rssLink = inputElement.value;

    if (!urlValidator(rssLink)) {
      state.form.error = 'notalink';
      state.form.valid = false;
      onChange(state);
      return;
    }

    if (!rssValidator(rssLink)) {
      state.form.error = 'notanrss';
      state.form.valid = true;
      onChange(state);
      return;
    }

    if (state.feeds.find((feed) => feed.link === rssLink)) {
      state.form.error = 'exists';
      state.form.valid = true;
      onChange(state);
      return;
    }

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
            onChange({
              feeds: [...state.feeds, newFeed],
              entries: [...state.entries, ...newFeed.entries],
              currentPostId: 0,
              loadingStatus: 'loaded',
              form: { error: 'rssloaded', valid: true },
            });
          })))
      .catch((error) => {
        console.error('Error:', error);
        onChange(state);
      });
  };

  const form = document.getElementById('input-form');
  form.addEventListener('submit', handleSubmit);
  render();

  /// setInterval(async () => {
  ///  await updateFeeds(state, render);
  /// }, 6000);
};

export default app;
