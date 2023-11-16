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
    if (state.feedCount > 0) {
      const feedsContainer = document.getElementById('feeds');
      feedsContainer.innerHTML = '';
      feedsContainer.innerHTML = feedListRender(state);

      const postsContainer = document.getElementById('posts');
      postsContainer.innerHTML = '';
      postsContainer.innerHTML = entriesListRender(state);

      const readMore = document.getElementsByClassName('read-more-button');
      const readMoreArray = [...readMore];
      renderButtons(state, readMoreArray);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const inputElement = document.getElementById('url-input');
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
  };

  const form = document.getElementById('input-form');
  form.addEventListener('submit', handleSubmit);
  render(state);
};
app();

export default app;
