import * as yup from 'yup';

const validator = (inputValue) => {
  const button = document.getElementById('submit-button');
  const inputElement = document.getElementById('link-input');

  const validationSchema = yup.object().shape({
    rssLink: yup.string().url().required(),
  });

  validationSchema.validate({ rssLink: inputValue })
    .then(() => {
      inputElement.classList.remove('invalid');
      button.disabled = false;
    })
    .catch((error) => {
      inputElement.classList.add('invalid');
      button.disabled = true;
    });
};

export default validator;