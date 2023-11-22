/* eslint-disable no-restricted-syntax */
import fetchInfo from './fetchers.js';

async function updateFeeds(state, render) {
  const { entries: currentEntries } = state;
  const { feeds } = state;

  let currentEntriesCount = 0;
  const feedLinks = feeds.map((feed) => feed.link);
  for (const feedLink of feedLinks) {
    try {
      const feedEntries = await fetchInfo(feedLink, 'entries');
      currentEntriesCount += feedEntries.length;
    } catch (error) {
      console.error('Error fetching entries:', error);
      state.form.error = 'noconnnection';
      state.form.valid = true;
      onChange(state);
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
