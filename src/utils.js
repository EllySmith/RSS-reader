import * as yup from 'yup';

const validateURL = (url, links) => {
  const currentUserSchema = yup.string().url().required().notOneOf(links);
  return currentUserSchema
    .validate(url)
    .then(() => null)
    .catch((e) => e.message);
};

const parseData = (data) => {
  console.log(data);

  const {
    link, title, description, entries,
  } = data;

  const newEntry = {
    link,
    title,
    description,
    entries,
  };

  return newEntry;
};

export { validateURL, parseData };
