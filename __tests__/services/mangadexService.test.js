import { expect, describe } from '@jest/globals';
import {
  getSearchResults,
  getMangaDetail,
  getMangaFeed,
  getChapters,
  getChapterImages,
} from '../../src/services/mangadexService';

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

describe('getMangaDetail', () => {
  test('should return details', async () => {
    const result = await getMangaDetail('32d76d19-8a05-4db0-9fc2-e0b0648fe9d0');

    expect(result.infoImageUrl).not.toBeNull();
    expect(result.status).not.toBeNull();
    expect(result.lastUpdated).not.toBeNull();
    expect(result.cleanedDescription).not.toBeNull();
    expect(result.hasOwnProperty('lastChapter')).toBeTruthy();
  });
});

describe('getMangaFeed', () => {
  test('should return feed with chapters (smaller series)', async () => {
    const result = await getMangaFeed('f7418c7b-14ee-4889-85ae-b31fcb8b0857');

    expect(result.length).toBeGreaterThan(1);
    expect(result[0].next).toBeNull(); // first one should have no next
    expect(result[1].next).toEqual(result[0].chapterRef);
  });

  test('should return feed with chapters (longer series)', async () => {
    const result = await getMangaFeed('d8f9afe2-aa44-4bc6-9145-eebb1f282372');

    expect(result.length).toBeGreaterThan(1);
    expect(result[0].next).toBeNull(); // first one should have no next
    expect(result[1].next).toEqual(result[0].chapterRef);
  });
});

describe('getChapters', () => {
  test('should return chapters no offset', async () => {
    const result = await getChapters('fbc8e1e4-cba6-48ec-b828-d613fe3d93a6', 0);

    expect(result.length).toBeGreaterThan(0);
    expect(typeof result[0].chapterRef).toBe('string');
    expect(typeof result[0].name).toBe('string');
    expect(typeof result[0].date).toBe('string');
  });
});

describe('getChapterImages', () => {
  test('should return image array', async () => {
    const result = await getChapterImages(
      '1aef5635-80e3-410f-af69-472ac3349658'
    );

    expect(result.length).toBeGreaterThan(0);
    expect(result[0].url).toContain('https://uploads.mangadex.org/data');
  });
});
