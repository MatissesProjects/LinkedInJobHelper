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

describe('VerificationData', () => {
    let VerificationStorage;

    beforeEach(async () => {
        storageMock.clear();
        try {
            const module = await import('../scripts/verification-storage.js');
            VerificationStorage = module.VerificationStorage;
        } catch (e) {
            // Module doesn't exist yet
        }
    });

    test('should store and retrieve verification results', async () => {
        if (!VerificationStorage) assert.fail('VerificationStorage not implemented');

        const company = 'Test Company';
        const data = { website: 'https://test.com', social: ['https://linkedin.com/company/test'], verified: true };
        
        await VerificationStorage.save(company, data);
        const retrieved = await VerificationStorage.get(company);
        
        assert.strictEqual(retrieved.website, data.website);
        assert.deepStrictEqual(retrieved.social, data.social);
        assert.strictEqual(retrieved.verified, data.verified);
        assert.ok(retrieved.timestamp, 'Should have a timestamp');
    });

    test('should return null for unverified companies', async () => {
        if (!VerificationStorage) assert.fail('VerificationStorage not implemented');

        const retrieved = await VerificationStorage.get('Unknown Company');
        assert.strictEqual(retrieved, null);
    });

    test('should handle multiple companies', async () => {
        if (!VerificationStorage) assert.fail('VerificationStorage not implemented');

        await VerificationStorage.save('Co1', { verified: true });
        await VerificationStorage.save('Co2', { verified: false });

        assert.strictEqual((await VerificationStorage.get('Co1')).verified, true);
        assert.strictEqual((await VerificationStorage.get('Co2')).verified, false);
    });
});
