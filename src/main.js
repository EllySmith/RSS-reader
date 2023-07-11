import './styles.scss';
import 'bootstrap';
import * as yup from 'yup';

const state = {
  articleCount: 0,
  articles:
     [],
};

const app = () => {
  const field = document.getElementById('link-input');
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
  });

  const form = document.getElementById('input-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputElement = document.getElementById('link-input');
    const result = inputElement.value;
    const newElement = document.createElement('p');
    newElement.textContent = `${result}`;
    const container = document.querySelector('body');

    const existingArticle = state.articles.find((article) => article.title === result);
    if (existingArticle) {
      inputElement.classList.add('invalid');
      return;
    }

    container.append(newElement);
    state.articles.push({ title: `${result}`, body: '' });
    inputElement.value = '';
    console.log(state);
  });
};

app();

export default app;
