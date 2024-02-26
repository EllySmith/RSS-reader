import i18n from 'i18next';
import 'bootstrap';

const renderForm = (state, elements) => {
  const {
    input, submitButton, exampleMessage, header,
  } = elements;
  input.textContent = `${i18n.t('placeholder')}`;
  submitButton.textContent = `${i18n.t('addRSS')}`;
  exampleMessage.textContent = `${i18n.t('example')}`;
  header.textContent = `${i18n.t('title')}`;
  input.classList.remove('invalid');
  if (!state.form.valid) {
    input.classList.add('invalid');
  }
  input.value = '';
  input.focus();
  if (state.loadingStatus === 'loading') {
    submitButton.disabled = true;
  } else {
    submitButton.disabled = false;
  }
};

const renderError = (state, elements) => {
  const { errorMessage } = elements;
  if (state.loadingStatus === 'success') {
    errorMessage.classList.remove('text-danger');
  } else {
    errorMessage.classList.add('text-danger');
  }
  errorMessage.textContent = `${i18n.t(`error.${state.form.error}`)}`;
};

const renderFeeds = (state, elements) => {
  const { feedsContainer, feedListTitle } = elements;
  feedsContainer.textContent = '';
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

const renderEntries = (state, elements) => {
  const { postsContainer, entriesListTitle } = elements;
  entriesListTitle.classList.add('entries-list-title');
  entriesListTitle.textContent = i18n.t('entrieslisttitle');
  postsContainer.textContent = '';
  postsContainer.appendChild(entriesListTitle);

  const allEntries = state.entries;
  allEntries.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  allEntries.forEach((entry) => {
    const entryLink = entry?.link ?? '';
    const entryTitle = entry?.title ?? '';
    const entryId = entry.guid;

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

const renderModal = (state, elements) => {
  if (state.currentEntryId !== null) {
    const allEntries = state.entries;
    const { readMore, modalTitle, modalBody } = elements;
    const shownEntry = allEntries.find((entry) => entry.guid === state.currentEntryId);
    readMore.setAttribute('href', shownEntry.link);
    modalTitle.textContent = shownEntry.title;
    modalBody.textContent = shownEntry.content;
  }
};

export {
  renderForm, renderFeeds, renderEntries, renderModal, renderError,
};
