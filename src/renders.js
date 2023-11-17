import i18n from 'i18next';
import 'bootstrap';

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
  const feedListTitle = `<h2 class='feed-list-title'>${i18n.t('feedlisttitle')}</h2>`;
  let htmlString = '';
  const allFeeds = state.feeds ?? [];
  allFeeds.forEach((feed) => {
    const description = feed?.description ?? '';
    const summary = `${description.trim().slice(0, 200)}...` ?? '';
    const singleFeedString = `<div class="link-container"><h2 class="title">${feed.title}</h2><p>${summary}</p></div>`;
    htmlString += singleFeedString;
  });

  return `${feedListTitle}
  ${htmlString}`;
};

const entriesListRender = (state) => {
  const entriesListTitle = `<h2 class='entries-list-title'>${i18n.t('entrieslisttitle')}</h2>`;
  let htmlString = '';
  const entries = state.feeds ?? [];
  const allEntries = entries.reduce((acc, feed) => acc.concat(feed.entries), []) ?? [];
  allEntries.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  allEntries.forEach((entry) => {
    const entryLink = entry?.link ?? '';
    const entryTitle = entry?.title ?? '';
    const entryId = entry?.guid ?? '';
    const singleEntryString = `<div class="entry-container"><a href="${entryLink}"><h2 class="entry-title">${entryTitle}</h2><a><button class="read-more-button" postId="${entryId}">${i18n.t('readmore')}</button></div>`;
    htmlString += singleEntryString;
  });
  return `${entriesListTitle}
  ${htmlString}`;
};

const renderErrorMessage = (type) => {
  console.log(`error ${type} being rendered`);
  const errorMessage = document.getElementById('error-message');
  errorMessage.textContent = `${i18n.t(`error.${type}`)}`;
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
  feedListRender, entriesListRender, initialRender, renderErrorMessage, renderButton,
};
