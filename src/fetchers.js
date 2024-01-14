import Parser from 'rss-parser';
import axios from 'axios';
import i18n from 'i18next';
import rus from './locales/rus.js';

const fetchData = async (link) => {
  const allOriginsUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`;
  const response = await fetch(allOriginsUrl);

  if (response.ok) {
    const data = await response.json();
    const parser = new Parser();
    const feed = await parser.parseString(data.contents);
    return feed;
  }
  throw new Error();
};

export default fetchData;
