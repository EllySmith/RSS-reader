import i18n from 'i18next';
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

  const render = () => {
    renderForm(state);
    if (state.feeds.length > 0) {
      renderFeeds(state);
      const readMore = document.getElementsByClassName('read-more-button');
      const readMoreArray = [...readMore];
      console.log('read more array', readMoreArray);
      readMoreArray.forEach((readbutton) => {
        readbutton.addEventListener('click', () => {
          const postId = readbutton.getAttribute('postId');
          state.currentEntryId = postId;
          console.log('read more click');
          console.log('currentpostid changed to', state.currentEntryId);
          console.log(state);
        });
      });

      const closeModalButton = document.getElementById('close-modal-btn');
      closeModalButton.addEventListener('click', () => {
        state.currentEntryId = '0';
        console.log('close modal click');
        console.log('currentpostid changed to', state.currentEntryId);
        console.log(state);
      });
    }
  };

  const onChange = (newState) => {
    Object.assign(state, newState);
    render(state);
  };

  const readMore = document.getElementsByClassName('read-more-button');
  const readMoreArray = [...readMore];
  readMoreArray.forEach((readbutton) => {
    readbutton.addEventListener('click', () => {
      const postId = readbutton.getAttribute('postId');
      state.currentEntryId = postId;
      console.log(state);
      onChange(state);
    });
  });

  const closeModalButton = document.getElementById('close-modal-btn');
  closeModalButton.addEventListener('click', () => {
    state.currentEntryId = '0';
    console.log('close modal click');
    console.log('currentpostid changed to', state.currentEntryId);
  });

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

    state.loadingStatus = 'loading';
    onChange(state);

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
              currentEntryId: 0,
              loadingStatus: 'success',
              form: { error: 'rssloaded', valid: true },
            });
          })))
      .catch((error) => {
        console.error('Error:', error);
        state.form.error = 'notanrss';
        state.loadingStatus = 'error';
        onChange(state);
      });
  };

  const form = document.getElementById('input-form');
  form.addEventListener('submit', handleSubmit);

  render();

  setInterval(async () => {
    await updateFeeds(state, render, onChange);
  }, 6000);
};

export default app;
