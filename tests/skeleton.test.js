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

test('manifest.json has correct permissions', () => {
  const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
  assert.ok(manifest.permissions.includes('storage'), 'Should have storage permission');
  assert.ok(manifest.host_permissions.includes('https://www.linkedin.com/*'), 'Should have LinkedIn host permission');
  assert.ok(manifest.host_permissions.includes('http://localhost:11434/*'), 'Should have Ollama host permission');
});

test('content script contains MutationObserver logic', () => {
  const content = fs.readFileSync('scripts/content.js', 'utf8');
  assert.ok(content.includes('MutationObserver'), 'Should use MutationObserver');
  assert.ok(content.includes('.job-card-container'), 'Should reference the job card selector');
});
