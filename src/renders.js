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
  const errorMessage = document.getElementById('error-message');
  if (state.form.error === null) {
    errorMessage.textContent = '';
    return;
  }
  errorMessage.textContent = `${i18n.t(`error.${state.form.error}`)}`;
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

  const postsContainer = document.getElementById('posts');
  const entriesListTitle = document.createElement('h2');
  entriesListTitle.classList.add('entries-list-title');
  entriesListTitle.textContent = i18n.t('entrieslisttitle');
  postsContainer.innerHTML = '';
  postsContainer.appendChild(entriesListTitle);

  const allEntries = state.entries;
  allEntries.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  console.log('entries renderig');
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
    entryTitleElement.textContent = entryTitle;

    const entryLinkElement = document.createElement('a');
    entryLinkElement.href = entryLink;
    entryLinkElement.appendChild(entryTitleElement);

    const readMoreButton = document.createElement('button');
    readMoreButton.classList.add('read-more-button');
    readMoreButton.textContent = i18n.t('readmore');
    readMoreButton.setAttribute('postId', entryId);

    singleEntryContainer.appendChild(entryLinkElement);
    singleEntryContainer.appendChild(readMoreButton);
    postsContainer.appendChild(singleEntryContainer);
  });

  console.log('modal being rendered');
  console.log('stateCurrentId is', state.currentEntryId);
  const myModal = document.getElementById('modalOverlay');
  const closeModalButton = document.getElementById('close-modal-btn');
  closeModalButton.textContent = i18n.t('closemodal');
  const shownEntry = allEntries.find((obj) => obj.guid === `${state.currentEntryId}`);

  if (shownEntry && state.currentEntryId !== '0') {
    console.log('shown entry', shownEntry);
    console.log('curent entry id', state.currentEntryId);
    const title = document.querySelector('.modal-title');
    title.textContent = shownEntry.title;
    const contents = document.querySelector('.modal-descr');
    contents.textContent = shownEntry.content.slice(0, 1000);
    myModal.classList.add('show');
    myModal.setAttribute('aria-modal', 'true');
    myModal.setAttribute('style', 'display: block;');
    myModal.removeAttribute('aria-hidden');
  } else {
    console.log('entry undefined');
    myModal.setAttribute('aria-hidden', 'true');
    myModal.setAttribute('style', 'display: none;');
    myModal.classList.remove('show');
    myModal.removeAttribute('aria-modal');
  }
};

export { renderForm, renderFeeds };
