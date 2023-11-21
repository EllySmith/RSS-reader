import i18n from 'i18next';
import 'bootstrap';
import { SingleEntryPlugin } from 'webpack';

const initialRender = () => {
  const placeholder = document.querySelector('label[for="url-input"]');
  placeholder.textContent = `${i18n.t('placeholder')}`;
  const button = document.getElementById('add-button');
  button.textContent = `${i18n.t('addRSS')}`;
  const exampleMessage = document.getElementById('example');
  exampleMessage.textContent = `${i18n.t('example')}`;
  const header = document.getElementById('rss-header');
  header.textContent = `${i18n.t('title')}`;
  const field = document.getElementById('url-input');
  field.focus();
};

const feedListRender = (state) => {
  const feedsContainer = document.querySelector('#feeds');
  feedsContainer.innerHTML = '';
  const feedListTitle = document.createElement('h2');
  feedListTitle.classList.add('feed-list-title');
  feedListTitle.textContent = `${i18n.t('feedlisttitle')}`;
  feedsContainer.prepend(feedListTitle);

  const allFeeds = state.feeds ?? [];
  allFeeds.forEach((feed) => {
    const description = feed?.description ?? '';
    const summary = `${description.trim().slice(0, 200)}...` ?? '';
    const singleFeed = document.createElement('div');
    singleFeed.classList.add('link-container');
    const feedTitle = document.createElement('h2');
    feedTitle.classList.add('title');
    feedTitle.textContent = feed.title;
    const feedSummary = document.createElement('p');
    feedSummary.textContent = summary;
    singleFeed.append(feedTitle, feedSummary);
    feedsContainer.append(singleFeed);
  });
};

const entriesListRender = (state) => {
  const postsContainer = document.getElementById('posts');
  const entriesListTitle = document.createElement('h2');
  entriesListTitle.classList.add('entries-list-title');
  entriesListTitle.textContent = i18n.t('entrieslisttitle');
  postsContainer.innerHTML = '';
  postsContainer.appendChild(entriesListTitle);

  const entries = state.feeds ?? [];
  const allEntries = entries.reduce((acc, feed) => acc.concat(feed.entries), []) ?? [];
  allEntries.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  allEntries.forEach((entry) => {
    const entryLink = entry?.link ?? '';
    const entryTitle = entry?.title ?? '';
    const entryId = entry?.guid ?? '';

    const singleEntryContainer = document.createElement('div');
    singleEntryContainer.classList.add('entry-container');

    const entryTitleElement = document.createElement('h2');
    entryTitleElement.classList.add('entry-title');
    entryTitleElement.textContent = entryTitle;

    const entryLinkElement = document.createElement('a');
    entryLinkElement.href = entryLink;
    entryLinkElement.appendChild(entryTitleElement);

    const readMoreButton = document.createElement('button');
    readMoreButton.classList.add('read-more-button');
    readMoreButton.setAttribute('postId', entryId);
    readMoreButton.textContent = i18n.t('readmore');

    singleEntryContainer.appendChild(entryLinkElement);
    singleEntryContainer.appendChild(readMoreButton);
    postsContainer.appendChild(singleEntryContainer);
  });
};

const renderErrorMessage = (type) => {
  console.log('error being rendered', type);
  const errorMessage = document.getElementById('error-message');
  if (type === '') {
    errorMessage.textContent = '';
    return;
  }
  errorMessage.textContent = `${i18n.t(`error.${type}`)}`;
  if (type === 'rssloaded') {
    const inputElement = document.getElementById('url-input');
    const submitButton = document.querySelector('button[type="submit"]');
    inputElement.classList.remove('invalid');
    submitButton.disabled = false;
    inputElement.value = '';
    errorMessage.classList.remove('text-danger');
    errorMessage.classList.add('text-success');
    console.log('success');
  }
  if (type === 'notalink') {
    const inputElement = document.getElementById('url-input');
    inputElement.classList.add('invalid');
  }
  console.log('error');
};

const renderButton = (readbutton, state) => {
  const myModal = new bootstrap.Modal(document.getElementById('modalOverlay'));
  myModal.show();
  const closeModalButton = document.getElementById('close-modal-btn');
  closeModalButton.textContent = `${i18n.t('closemodal')}`;
  const allEntries = state.feeds.reduce((acc, feed) => acc.concat(feed.entries), []);
  const postID = readbutton.getAttribute('postId');
  const shownEntry = allEntries.find((obj) => obj.guid === `${postID}`);
  const title = document.querySelector('.modal-title');
  title.textContent = `${shownEntry.title}`;
  const contents = document.querySelector('.modal-descr');
  contents.textContent = `${shownEntry.content.slice(0, 1000)}`;
  closeModalButton.addEventListener('click', () => {
    myModal.hide();
  });
};

export {
  feedListRender, entriesListRender, initialRender,
  renderErrorMessage, renderButton,
};
