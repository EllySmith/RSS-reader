const feedListRender = (state) => {
  const htmlStrings = state.feeds.map((feed) => {
    const summary = `${feed.description.trim().slice(0, 100)}...`;
    return `<div class="link-container"><h2 class="title">${feed.title}</h2><p>${summary}</p></div>`;
  });

  return htmlStrings.join('');
};

const entriesListRender = (state) => {
  let htmlString = '';
  const allEntries = state.feeds.reduce((acc, feed) => acc.concat(feed.entries), []);
  allEntries.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate));

  allEntries.forEach((entry) => {
    const description = `${entry.content.trim().slice(0, 200)}...` || 'No description available';
    const singleEntryString = `<div class="entry-container"><h2 class="entry-title">${entry.title}</h2><p>${description}</p></div>`;
    htmlString += singleEntryString;
  });
  return (htmlString);
};

export { feedListRender, entriesListRender };
