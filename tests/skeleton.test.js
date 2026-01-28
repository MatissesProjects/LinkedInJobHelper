import { test } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';

test('manifest.json exists and is valid', () => {
  assert.ok(fs.existsSync('manifest.json'), 'manifest.json should exist');
  const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  assert.strictEqual(manifest.manifest_version, 3);
});

test('content script exists', () => {
  assert.ok(fs.existsSync('scripts/content.js'), 'scripts/content.js should exist');
});

test('popup files exist', () => {
  assert.ok(fs.existsSync('popup/popup.html'), 'popup/popup.html should exist');
  assert.ok(fs.existsSync('popup/popup.js'), 'popup/popup.js should exist');
});
