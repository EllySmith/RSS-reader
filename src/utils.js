import * as yup from 'yup';

const validateURL = (url) => {
  const currentUserSchema = yup.string().url().required();
  return currentUserSchema
    .validate(url)
    .then(() => null)
    .catch(() => {
      const customError = new Error();
      customError.message = 'this must be a valid url';
      throw customError;
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
