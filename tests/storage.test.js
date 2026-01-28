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
           // Return all if null/undefined, or specific keys if object
           for (const [k, v] of storageMock) {
               result[k] = v;
           }
        }
        
        // Handle Promise-based or callback-based usage.
        // For this test, we assume Promise-based usage if no callback, 
        // but our implementation might use callbacks or promises.
        // Let's assume standard extension API callbacks for now, 
        // but we'll wrap it in a Promise in the service.
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

// We will import the service after mocking
// Since we are testing a module that doesn't exist yet, this will fail initially (Red Phase)
// We'll use dynamic import or assume the file structure.

describe('StorageService', () => {
  let StorageService;

  beforeEach(async () => {
    storageMock.clear();
    // Reset the module registry to ensure fresh import if needed, 
    // but with ESM it's harder. We'll rely on fresh storageMock.
    
    // Import the service. 
    // Note: In a real scenario, we'd import the class.
    // For TDD, we'll try to import it, expecting failure or implementing it.
    try {
        const module = await import('../scripts/storage.js');
        StorageService = module.StorageService;
    } catch (e) {
        // Module doesn't exist yet
    }
  });

  test('should initialize with default keywords if empty', async () => {
    if (!StorageService) assert.fail('StorageService not implemented');
    
    await StorageService.init();
    
    const stored = await new Promise(resolve => chrome.storage.local.get('keywords', resolve));
    assert.deepStrictEqual(stored.keywords, [
      { text: 'Confidential', enabled: false },
      { text: 'Hiring', enabled: false }
    ]);
  });

  test('should not overwrite existing keywords on init', async () => {
     if (!StorageService) assert.fail('StorageService not implemented');

    const existing = [{ text: 'Existing', enabled: true }];
    storageMock.set('keywords', existing);
    
    await StorageService.init();
    
    const stored = await new Promise(resolve => chrome.storage.local.get('keywords', resolve));
    assert.deepStrictEqual(stored.keywords, existing);
  });

  test('should add a new keyword', async () => {
     if (!StorageService) assert.fail('StorageService not implemented');

    await StorageService.init();
    await StorageService.addKeyword('NewTag');
    
    const stored = await new Promise(resolve => chrome.storage.local.get('keywords', resolve));
    assert.strictEqual(stored.keywords.length, 3);
    assert.deepStrictEqual(stored.keywords[2], { text: 'NewTag', enabled: false });
  });

  test('should remove a keyword', async () => {
     if (!StorageService) assert.fail('StorageService not implemented');

    await StorageService.init();
    await StorageService.removeKeyword('Confidential');
    
    const stored = await new Promise(resolve => chrome.storage.local.get('keywords', resolve));
    assert.strictEqual(stored.keywords.length, 1);
    assert.strictEqual(stored.keywords[0].text, 'Hiring');
  });

  test('should toggle a keyword', async () => {
     if (!StorageService) assert.fail('StorageService not implemented');

    await StorageService.init();
    await StorageService.toggleKeyword('Confidential');
    
    const stored = await new Promise(resolve => chrome.storage.local.get('keywords', resolve));
    assert.strictEqual(stored.keywords[0].enabled, true);
    
    await StorageService.toggleKeyword('Confidential');
    const stored2 = await new Promise(resolve => chrome.storage.local.get('keywords', resolve));
    assert.strictEqual(stored2.keywords[0].enabled, false);
  });

  test('should manage easyApplyEnabled state', async () => {
    if (!StorageService) assert.fail('StorageService not implemented');

    await StorageService.init();
    let stored = await new Promise(resolve => chrome.storage.local.get('easyApplyEnabled', resolve));
    assert.strictEqual(stored.easyApplyEnabled, false, 'Should be disabled by default');

    await StorageService.setEasyApplyEnabled(true);
    stored = await new Promise(resolve => chrome.storage.local.get('easyApplyEnabled', resolve));
    assert.strictEqual(stored.easyApplyEnabled, true);

    await StorageService.setEasyApplyEnabled(false);
    stored = await new Promise(resolve => chrome.storage.local.get('easyApplyEnabled', resolve));
    assert.strictEqual(stored.easyApplyEnabled, false);
  });
});
