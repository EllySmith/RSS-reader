import * as yup from 'yup';
import fetchData from './fetchers';

const validateURL = (url) => {
  const currentUserSchema = yup.string().url().required();
  return currentUserSchema
    .validate(url)
    .then(() => null)
    .catch((e) => {
      throw new Error('Invalid URL');
    });
};

const parseData = (data) => {
  const {
    link, title, description, items,
  } = data;

  const newEntry = {
    link,
    title,
    description,
    entries: items,
  };

  return newEntry;
};

const updateFeedItems = async (obj, link) => {
  try {
    const data = await fetchData(link);
    const updatedFeed = parseData(data);
    const index = obj.feeds.findIndex(feed => feed.link === link);

    if (index !== -1) {
      obj.feeds[index] = updatedFeed;
    }
  } catch (error) {
    console.error('Error updating feed items:', error);
  }
};

export { validateURL, parseData, updateFeedItems };
