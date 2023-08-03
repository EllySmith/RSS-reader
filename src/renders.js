import i18n from 'i18next';

const feedListRender = (state) => {
  const htmlStrings = state.feeds.map((feed) => {
    const summary = `${feed.description.trim().slice(0, 200)}...`;
    return `<div class="link-container"><h2 class="title">${feed.title}</h2><p>${summary}</p></div>`;
  });

  return htmlStrings.join('');
};

const entriesListRender = (state) => {
  let htmlString = '';
  const allEntries = state.feeds.reduce((acc, feed) => acc.concat(feed.entries), []);
  allEntries.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));
  allEntries.forEach((entry) => {
    const singleEntryString = `<div class="entry-container"><a href="${entry.link}"><h2 class="entry-title">${entry.title}</h2><a><button class="read-more-button" postId="${entry.guid}">${i18n.t('readmore')}</button></div>`;
    htmlString += singleEntryString;
  });
  return (htmlString);
};

const initialRender = () => {
  const mainContainer = document.getElementById('main-container');
  mainContainer.innerHTML = '';
  const inputForm = document.createElement('form');
  inputForm.id = 'input-form';
  const input = document.createElement('input');
  input.type = 'text';
  input.id = 'link-input';
  const button = document.createElement('button');
  button.type = 'submit';
  button.id = 'submit-button';
  inputForm.appendChild(input);
  inputForm.appendChild(button);
  mainContainer.appendChild(inputForm);
  const header = document.createElement('h1');
  header.textContent = `${i18n.t('title')}`;
  header.classList.add('.header');
  mainContainer.prepend(header);
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
