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

export { feedListRender, entriesListRender };
