import  './styles.scss';
import  'bootstrap';
import * as yup from 'yup';

const state = {
     articleCount: 0,
     articleTitles:
     [],
}

const app = () => {
     console.log('Submit');
     const field = document.getElementById("link-input");
     field.addEventListener('input', (e) => {
          const inputElement = document.getElementById('link-input');
          if (inputElement.value === '1234567') {
               field.classList.remove('invalid');
          }
          else {
               field.classList.add('invalid');
          }
     });

     const form = document.getElementById("input-form");
     form.addEventListener('submit', (e) => {
          e.preventDefault();
          const inputElement = document.getElementById('link-input');
          const result = inputElement.value;
          console.log(result);
     });
};

app();

export default app;