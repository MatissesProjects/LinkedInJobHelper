import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Priority Matching Logic', () => {
    const priorityKeywords = [
        { text: 'Remote', enabled: true },
        { text: 'Principal', enabled: true },
        { text: 'Rust', enabled: false }
    ];

    function isPriorityMatch(text, keywords) {
        return keywords.some(k => k.enabled && text.toLowerCase().includes(k.text.toLowerCase()));
    }

    test('should identify priority match by title', () => {
        const title = 'Principal Software Engineer';
        assert.ok(isPriorityMatch(title, priorityKeywords), 'Should match "Principal"');
    });

    test('should identify priority match by description/text', () => {
        const text = 'This is a fully remote position with great benefits.';
        assert.ok(isPriorityMatch(text, priorityKeywords), 'Should match "Remote"');
    });

    test('should not match disabled keywords', () => {
        const title = 'Rust Developer';
        assert.strictEqual(isPriorityMatch(title, priorityKeywords), false, 'Should not match disabled "Rust"');
    });

    test('should not match unrelated text', () => {
        const title = 'Junior Java Dev';
        assert.strictEqual(isPriorityMatch(title, priorityKeywords), false);
    });
});
