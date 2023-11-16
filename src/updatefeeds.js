import fetchInfo from './fetchers.js';
import {
  feedListRender, entriesListRender, initialRender, renderButtons,
} from './renders.js';

const updateFeeds = async (state) => {
  for (const feed of state.feedLinks) {
    const feedLink = feed.link;
    const newFeedData = await fetchInfo(feedLink, 'entries');
    const existingFeed = state.feeds.find((feed) => feed.link === rssLink);
    if (existingFeed) {
      existingFeed.entries = newFeedData;
    }
  }

  const entriesList = document.createElement('div');
  entriesList.innerHTML = entriesListRender(state);
  entriesList.classList.add('entries-list');

  const existingEntriesList = document.querySelector('.entries-list');
  existingEntriesList.replaceWith(entriesList);
};

export default updateFeeds;
