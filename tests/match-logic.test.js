import { test, describe } from 'node:test';
import assert from 'node:assert';

describe('Match Logic', () => {
    function calculateMatchScore(text, keywords) {
        if (!keywords.length) return 0;
        const active = keywords.filter(k => k.enabled);
        if (!active.length) return 0;

        let matches = 0;
        const lowerText = text.toLowerCase();
        
        active.forEach(k => {
            if (lowerText.includes(k.text.toLowerCase())) {
                matches++;
            }
        });

        return Math.round((matches / active.length) * 100);
    }

    test('should return 100% when all keywords match', () => {
        const keywords = [{ text: 'Rust', enabled: true }, { text: 'Remote', enabled: true }];
        const text = 'Rust developer remote position';
        assert.strictEqual(calculateMatchScore(text, keywords), 100);
    });

    test('should return 50% when half match', () => {
        const keywords = [{ text: 'Rust', enabled: true }, { text: 'Java', enabled: true }];
        const text = 'Rust developer position';
        assert.strictEqual(calculateMatchScore(text, keywords), 50);
    });

    test('should return 0% when none match', () => {
        const keywords = [{ text: 'Rust', enabled: true }];
        const text = 'Java developer position';
        assert.strictEqual(calculateMatchScore(text, keywords), 0);
    });

    test('should ignore disabled keywords', () => {
        const keywords = [{ text: 'Rust', enabled: true }, { text: 'Java', enabled: false }];
        const text = 'Rust developer position';
        assert.strictEqual(calculateMatchScore(text, keywords), 100);
    });
});
