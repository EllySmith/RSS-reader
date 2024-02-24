import i18n from 'i18next';
import 'bootstrap';

const generateRandomId = () => Math.random().toString(36).substring(2, 15);

const renderForm = (state) => {
  console.log('form rendering');
  const placeholder = document.querySelector('label[for="url-input"]');
  placeholder.textContent = `${i18n.t('placeholder')}`;
  const button = document.getElementById('add-button');
  button.textContent = `${i18n.t('addRSS')}`;
  const exampleMessage = document.getElementById('example');
  exampleMessage.textContent = `${i18n.t('example')}`;
  const header = document.getElementById('rss-header');
  header.textContent = `${i18n.t('title')}`;
  const field = document.getElementById('url-input');
  field.classList.remove('invalid');
  if (!state.form.valid) {
    field.classList.add('invalid');
  }
  field.value = '';
  field.focus();
  const submitButton = document.querySelector('button[type="submit"]');
  if (state.loadingStatus === 'loading') {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
};

const renderError = (state) => {
  console.log('error rendering', state.form.error);
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = `${i18n.t(`error.${state.form.error}`)}`;
  if (state.loadingStatus === 'success') {
    errorMessage.classList.remove('text-danger');
  } else {
    errorMessage.classList.add('text-danger');
  }
};

const renderFeeds = (state) => {
  console.log('feeds rendering');
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

const renderEntries = (state) => {
  console.log('entries rendering');
  const postsContainer = document.getElementById('posts');
  const entriesListTitle = document.createElement('h2');
  entriesListTitle.classList.add('entries-list-title');
  entriesListTitle.textContent = i18n.t('entrieslisttitle');
  postsContainer.innerHTML = '';
  postsContainer.appendChild(entriesListTitle);

  const allEntries = state.entries;
  allEntries.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  allEntries.forEach((entry) => {
    const entryLink = entry?.link ?? '';
    const entryTitle = entry?.title ?? '';
    const newId = entry?.guid || generateRandomId();
    const entryId = newId;

    const singleEntryContainer = document.createElement('div');
    singleEntryContainer.classList.add('entry-container');
    singleEntryContainer.setAttribute('postId', entryId);

    const entryTitleElement = document.createElement('h2');
    entryTitleElement.classList.add('entry-title');

    const entryLinkElement = document.createElement('a');
    entryLinkElement.href = entryLink;
    entryLinkElement.textContent = entryTitle;
    entryLinkElement.classList.add('fw-bold');
    if (state.viewedPosts.includes(entryId)) {
      entryLinkElement.classList.add('fw-normal');
      entryLinkElement.classList.remove('fw-bold');
    }
    entryLinkElement.appendChild(entryTitleElement);

    const readMoreButton = document.createElement('button');
    readMoreButton.setAttribute('data-id', entryId);
    readMoreButton.classList.add('read-more-button');
    readMoreButton.setAttribute('data-bs-toggle', 'modal');
    readMoreButton.setAttribute('data-bs-target', '#modal');
    readMoreButton.textContent = i18n.t('readmore');

    singleEntryContainer.appendChild(entryLinkElement);
    singleEntryContainer.appendChild(readMoreButton);
    postsContainer.appendChild(singleEntryContainer);
  });
};

const renderModal = (state) => {
  const allEntries = state.entries;
  console.log(allEntries);
  const myModal = document.getElementById('modal');
  const readMore = document.querySelector('.full-article');
  const closeModal = document.querySelector('.btn-close-modal');
  const shownEntry = allEntries.find((obj) => obj.guid === `${state.currentEntryId}`);

  console.log('shown entry', shownEntry);
  console.log('curent entry id', state.currentEntryId);
  console.log(state.viewedPosts);
  closeModal.textContent = `${i18n.t('closemodal')}`;
  readMore.textContent = `${i18n.t('readfull')}`;
  readMore.setAttribute('href', shownEntry.link);
  const title = document.querySelector('.modal-title');
  title.textContent = shownEntry.title;
  const contents = document.querySelector('.modal-body');
  contents.textContent = shownEntry.content;
};

export {
  renderForm, renderFeeds, renderEntries, renderModal, renderError,
};
