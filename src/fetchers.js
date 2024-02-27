import Parser from 'rss-parser';
import axios from 'axios';

const addProxy = (url) => {
  const urlWithProxy = new URL('/get', 'https://allorigins.hexlet.app');
  urlWithProxy.searchParams.set('url', url);
  urlWithProxy.searchParams.set('disableCache', 'true');
  return urlWithProxy.toString();
};

const fetchData = async (link) => {
  const allOriginsUrl = addProxy(link);
  const response = await axios.get(allOriginsUrl);
  const { data } = response;
  const parser = new Parser();
  const feed = await parser.parseString(data.contents);
  return feed;
};

export default fetchData;
