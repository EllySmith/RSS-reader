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

export { validateURL, parseData };
