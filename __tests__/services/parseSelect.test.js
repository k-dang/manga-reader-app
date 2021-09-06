import { expect, describe } from '@jest/globals';
import { parseManganatoSelect } from '../../src/services/parseSelect';
import manganato from '../../src/api/manganato';
import { sources } from '../../src/store/search/constants';

describe('parseManganatoSelect', () => {
  test('should return results', async () => {
    const response = await manganato.get('/manga-ax951880');
    const result = parseManganatoSelect(response.data);

    expect(result.chapterRefs.length).toBeGreaterThan(0);
    expect(result.source).toBe(sources.MANGANATO);
  });
});
