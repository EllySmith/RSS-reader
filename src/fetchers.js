import Parser from 'rss-parser';
import axios from 'axios';

const fetchData = async (link) => {
  const allOriginsUrl = `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(link)}`;
  const response = await axios.get(allOriginsUrl);
  const { data } = response;
  const parser = new Parser();
  const feed = await parser.parseString(data.contents);
  return feed;
};

export default fetchData;
