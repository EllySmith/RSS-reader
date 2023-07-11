import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';

const state = {
  articleCount: 0,
  articleTitles:
     [],
};

const app = () => {
  const field = document.getElementById("link-input");
  field.focus();
  field.addEventListener('input', () => {
    const inputElement = document.getElementById('link-input');
    const validationSchema = yup.object().shape({
      rssLink: yup.string().url().required(),
    });
    const rssLink = inputElement.value.trim();

    validationSchema.validate({ rssLink }).then(() => {
      inputElement.classList.remove('invalid');
    }).catch(() => {
      inputElement.classList.add('invalid');
    });

    const form = document.getElementById('input-form');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const result = inputElement.value;
      const newElement = document.createElement('p');
      newElement.textContent = `${result}`;
      const container = document.querySelector('body');
      container.append(newElement);
      field.value = '';
    });
  });
};

app();

export default app;
