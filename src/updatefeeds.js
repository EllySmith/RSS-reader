import fetchInfo from './fetchers.js';
import {
  feedListRender, entriesListRender, initialRender, renderButtons,
} from './renders.js';

const updateFeeds = async (state) => {
  for (const rssLink of state.feedLinks) {
    try {
      const newFeedData = await fetchInfo(rssLink, 'entries');
      const existingFeed = state.feeds.find((feed) => feed.link === rssLink);
      if (existingFeed) {
        existingFeed.entries = newFeedData;
      }
    } catch (error) {
      console.error('Error updating feed:', error);
    }
  }

  const entriesList = document.createElement('div');
  entriesList.innerHTML = entriesListRender(state);
  entriesList.classList.add('entries-list');

  const existingEntriesList = document.querySelector('.entries-list');
  existingEntriesList.replaceWith(entriesList);

  setTimeout(updateFeeds, 60000);
};

export default updateFeeds;
