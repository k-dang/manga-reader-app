import axios from 'axios';

export default axios.create({
  baseURL: 'https://us-central1-manga-reader-994fc.cloudfunctions.net',
});
