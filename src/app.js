import i18n from 'i18next';
import rus from './locales/rus.js';
import {
  feedListRender, entriesListRender, initialRender, renderErrorMessage, renderButton,
} from './renders.js';
import fetchInfo from './fetchers.js';
import {
  rssValidator, repeatValidator, urlValidator,
} from './validators.js';
import updateFeeds from './updatefeeds.js';

const app = () => {
  const state = {
    feedCount: 0,
    feedLinks: [],
    feeds:
          [],
    entriesCount: 0,
  };

  i18n.init({
    lng: 'ru',
    resources: {
      ru: {
        translation: rus.translation,
      },
    },
  });

  const render = (errorMessage) => {
    initialRender();
    if (state.feedCount > 0) {
      const feedsContainer = document.getElementById('feeds');
      feedsContainer.innerHTML = feedListRender(state);

      const postsContainer = document.getElementById('posts');
      postsContainer.innerHTML = entriesListRender(state);

      const readMore = document.getElementsByClassName('read-more-button');
      const readMoreArray = [...readMore];
      console.log(readMoreArray);
      readMoreArray.forEach((readbutton) => {
        readbutton.addEventListener('click', () => renderButton(readbutton, state));
      });

      renderErrorMessage(errorMessage || '');
    }
  };

  const onChange = (newState, errorMessage) => {
    Object.assign(state, newState);
    render(errorMessage);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const inputElement = document.getElementById('url-input');
    const rssLink = inputElement.value;

    if (!urlValidator(rssLink)) {
      onChange(state, 'notalink');
      inputElement.classList.add('invalid');
      return;
    }

    if (!rssValidator(rssLink)) {
      onChange(state, 'notanrss');
      return;
    }

    if (state.feeds.find((feed) => feed.link === rssLink)) {
      onChange(state, 'exists');
      return;
    }

    const submitButton = document.querySelector('button[type="submit"]');

    fetchInfo(rssLink, 'title')
      .then((title) => fetchInfo(rssLink, 'description').then((description) => fetchInfo(rssLink, 'entries').then((entries) => {
        const newFeed = {
          link: rssLink,
          id: state.feeds.length + 1,
          title,
          description,
          entries,
        };
        onChange({
          feeds: [...state.feeds, newFeed],
          feedLinks: [...state.feedLinks, rssLink],
          feedCount: state.feedCount + 1,
          entriesCount: state.entriesCount + newFeed.entries.length,
        }, `${i18n.t('rssloaded')}`);
        inputElement.classList.remove('invalid');
        submitButton.disabled = false;
        console.log(state);
        inputElement.value = '';
      })))
      .catch((error) => {
        console.error('Error:', error);
        onChange(state, 'notanrss');
        submitButton.disabled = false;
      });
  };

  const form = document.getElementById('input-form');
  form.addEventListener('submit', handleSubmit);
  render(state);
  setInterval(async () => {
    await updateFeeds(state, render);
  }, 6000);
};

export default app;
