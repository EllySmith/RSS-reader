/* eslint-disable no-restricted-syntax */
import fetchData from './fetchers.js';

async function updateFeeds(state, render) {
  const { entries: currentEntries } = state;
  const { feeds } = state;

  let currentEntriesCount = 0;
  const feedLinks = feeds.map((feed) => feed.link);
  for (const feedLink of feedLinks) {
    try {
      const feed = await fetchData(feedLink);
      const feedEntries = feed.items;
      currentEntriesCount += feedEntries.length;
    } catch (error) {
      console.error('Error fetching entries:', error);
      return;
    }
  }

  if (currentEntriesCount !== currentEntries.length) {
    render(state);
    console.log('update, add');
  }
  console.log('update');
}

export default updateFeeds;
