import * as yup from 'yup';

const validateURL = (link, collection) => {
  yup.setLocale({
    mixed: {
      default: 'input not valid',
    },
    string: {
      url: 'not a link',
      notOneOf: 'already exists',
    },
  });

  const schemaStr = yup.string().required().url();
  const schemaMix = yup.mixed().notOneOf([collection]);
  return schemaStr
    .validate(link)
    .then((url) => schemaMix.validate(url))
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
