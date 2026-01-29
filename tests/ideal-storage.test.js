import { test, describe, beforeEach, mock } from 'node:test';
import assert from 'node:assert';

// Mock chrome.storage.local
const storageMock = new Map();
global.chrome = {
  storage: {
    local: {
      get: mock.fn((keys, callback) => {
        const result = {};
        if (Array.isArray(keys)) {
          keys.forEach(k => result[k] = storageMock.get(k));
        } else if (typeof keys === 'string') {
          result[keys] = storageMock.get(keys);
        } else {
           for (const [k, v] of storageMock) {
               result[k] = v;
           }
        }
        if (callback) callback(result);
        return Promise.resolve(result);
      }),
      set: mock.fn((items, callback) => {
        for (const [key, value] of Object.entries(items)) {
          storageMock.set(key, value);
        }
        if (callback) callback();
        return Promise.resolve();
      })
    }
  }
};

describe('Ideal Job Storage', () => {
  let StorageService;

  beforeEach(async () => {
    storageMock.clear();
    const module = await import('../scripts/storage.js');
    StorageService = module.StorageService;
  });

  test('should initialize with default ideal job settings', async () => {
    await StorageService.init();
    
    const priorityKeywords = await StorageService.getPriorityKeywords();
    assert.deepStrictEqual(priorityKeywords, [], 'Priority keywords should be empty by default');
    
    const idealRoleText = await StorageService.getIdealRoleText();
    assert.strictEqual(idealRoleText, '', 'Ideal role text should be empty by default');
    
    const minScoreThreshold = await StorageService.getMinScoreThreshold();
    assert.strictEqual(minScoreThreshold, 7, 'Min score threshold should be 7 by default');
  });

  test('should manage priority keywords', async () => {
    await StorageService.init();
    
    await StorageService.addPriorityKeyword('Remote');
    let keywords = await StorageService.getPriorityKeywords();
    assert.strictEqual(keywords.length, 1);
    assert.strictEqual(keywords[0].text, 'Remote');
    assert.strictEqual(keywords[0].enabled, true, 'New priority keywords should be enabled by default');

    await StorageService.togglePriorityKeyword('Remote');
    keywords = await StorageService.getPriorityKeywords();
    assert.strictEqual(keywords[0].enabled, false);

    await StorageService.removePriorityKeyword('Remote');
    keywords = await StorageService.getPriorityKeywords();
    assert.strictEqual(keywords.length, 0);
  });

  test('should manage ideal role text', async () => {
    await StorageService.init();
    const text = 'I want to build cool things with AI';
    await StorageService.setIdealRoleText(text);
    
    const retrieved = await StorageService.getIdealRoleText();
    assert.strictEqual(retrieved, text);
  });

  test('should manage min score threshold', async () => {
    await StorageService.init();
    await StorageService.setMinScoreThreshold(9);
    
    const retrieved = await StorageService.getMinScoreThreshold();
    assert.strictEqual(retrieved, 9);
  });
});
