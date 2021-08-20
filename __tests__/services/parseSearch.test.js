import { expect, jest } from '@jest/globals';
import { parseManganatoSearch } from '../../src/services/parseSearch';
import axios from 'axios';

test('adds 1 + 2 to equal 3', () => {
  expect(3).toBe(3);
});

// jest.mock('cheerio');

test('parseManganatoSearch should return results', async () => {
  const response = await axios.get(`https://manganato.com/search/story/demon`);

  // cheerio.load().mockResolvedValue(response.data);

  const [results, totalPages] = parseManganatoSearch(response.data);
  expect(results.length).toBeGreaterThan(1);
  expect(parseInt(totalPages)).toBeGreaterThan(0);

  expect(results[0].id).toBeTruthy();
  expect(results[0].title).toBeTruthy();
  expect(results[0].imageUrl).toBeTruthy();
});
