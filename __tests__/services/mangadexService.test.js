import { expect, describe } from '@jest/globals';
import { getSearchResults } from '../../src/services/mangadexService';

describe('getSearchResults', () => {
  test('should return results', async () => {
    const [results, totalItems] = await getSearchResults('demon');

    expect(results.length).toBeGreaterThan(1);
    expect(parseInt(totalItems)).toBeGreaterThan(0);
  });

  test('should return results with space in term', async () => {
    const [results, totalItems] = await getSearchResults('one piece');

    expect(results.length).toBeGreaterThan(1);
    expect(parseInt(totalItems)).toBeGreaterThan(0);
  });
});
