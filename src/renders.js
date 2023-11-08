import i18n from 'i18next';

const initialRender = () => {
  const mainContainer = document.getElementById('main-container');
  mainContainer.innerHTML = '';
  const inputForm = document.createElement('form');
  inputForm.id = 'input-form';
  const input = document.createElement('input');
  input.setAttribute('placeholder', `${i18n.t('placeholder')}`);
  input.setAttribute('aria-label', 'url');
  input.type = 'text';
  input.id = 'link-input';
  const button = document.createElement('button');
  button.type = 'submit';
  button.id = 'submit-button';
  button.textContent = `${i18n.t('addRSS')}`;
  inputForm.appendChild(input);
  inputForm.appendChild(button);
  const exampleMessage = document.createElement('p');
  exampleMessage.id = 'example-message';
  inputForm.append(exampleMessage);
  exampleMessage.textContent = `${i18n.t('example')}`;
  const errorMessage = document.createElement('p');
  errorMessage.id = 'error-message';
  inputForm.append(errorMessage);
  mainContainer.appendChild(inputForm);
  const header = document.createElement('h1');
  header.textContent = `${i18n.t('title')}`;
  header.classList.add('.header');
  mainContainer.prepend(header);
};

const feedListRender = (state) => {
  const feedListTitle = `<h2 class='feed-list-title'>${i18n.t('feedlisttitle')}</h2>`;
  const htmlStrings = state.feeds.map((feed) => {
    const summary = `${feed.description.trim().slice(0, 200)}...`;
    return `<div class="link-container"><h2 class="title">${feed.title}</h2><p>${summary}</p></div>`;
  });

  return `${feedListTitle}
  ${htmlStrings.join('')}`;
};

const entriesListRender = (state) => {
  const entriesListTitle = `<h2 class='entries-list-title'>${i18n.t('entrieslisttitle')}</h2>`;
  let htmlString = '';
  const allEntries = state.feeds.reduce((acc, feed) => acc.concat(feed.entries), []);
  allEntries.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  allEntries.forEach((entry) => {
    const singleEntryString = `<div class="entry-container"><a href="${entry.link}"><h2 class="entry-title">${entry.title}</h2><a><button class="read-more-button" postId="${entry.guid}">${i18n.t('readmore')}</button></div>`;
    htmlString += singleEntryString;
  });
  return `${entriesListTitle}
  ${htmlString}`;
};

const renderButtons = (state, array) => {
  array.forEach((readbutton) => {
    readbutton.addEventListener('click', () => {
      const modalOverlay = document.getElementById('modalOverlay');
      modalOverlay.style.display = 'block';
      const closeModalButton = document.getElementById('popup-button');
      const allEntries = state.feeds.reduce((acc, feed) => acc.concat(feed.entries), []);
      const postID = readbutton.getAttribute('postId');
      const shownEntry = allEntries.find((obj) => obj.guid === `${postID}`);
      const title = document.getElementById('popup-title');
      title.textContent = `${shownEntry.title}`;
      const contents = document.getElementById('popup-contents');
      contents.textContent = `${shownEntry.content}`;
      closeModalButton.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
      });
    });
  });
};

export {
  feedListRender, entriesListRender, initialRender, renderButtons,
};
