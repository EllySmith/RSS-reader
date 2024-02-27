import * as yup from 'yup';

const validateURL = (link, collection) => {
  yup.setLocale({
    mixed: {
      default: 'input not valid',
      notOneOf: 'already exists',
    },
    string: {
      url: 'not a link',
    },
  });

  const schemaStr = yup.string().required().url().notOneOf(collection);
  return schemaStr
    .validate(link)
    .then(() => null)
    .catch((e) => {
      throw new Error(e.message);
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
