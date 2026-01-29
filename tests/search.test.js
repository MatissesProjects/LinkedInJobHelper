import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';

describe('SearchService', () => {
    let SearchService;

    beforeEach(async () => {
        // Dynamic import to simulate module loading
        try {
            const module = await import('../scripts/search-service.js');
            SearchService = module.SearchService;
        } catch (e) {
            // Module doesn't exist yet
        }
    });

    test('should parse DuckDuckGo HTML to find primary website (Lite format)', () => {
        if (!SearchService) assert.fail('SearchService not implemented');

        // Sample HTML snippet using the "lite" result structure
        const html = `
            <div class="result">
                <a class="result__a" href="https://www.example.com">Example Company</a>
                <a class="result__snippet" href="https://www.example.com">Snippet text...</a>
            </div>
        `;

        const result = SearchService.parseResults(html);
        assert.strictEqual(result.website, 'https://www.example.com');
    });

    test('should decode DuckDuckGo redirect URLs (uddg)', () => {
        if (!SearchService) assert.fail('SearchService not implemented');

        // Example: https://duckduckgo.com/l/?kh=-1&uddg=https%3A%2F%2Fwww.real-target.com%2F
        const encodedTarget = encodeURIComponent('https://www.real-target.com/');
        const html = `
            <div class="result">
                <a class="result__a" href="https://duckduckgo.com/l/?kh=-1&uddg=${encodedTarget}">Real Target</a>
            </div>
        `;

        const result = SearchService.parseResults(html);
        assert.strictEqual(result.website, 'https://www.real-target.com');
    });

    test('should identify social profiles', () => {
        if (!SearchService) assert.fail('SearchService not implemented');

        const html = `
            <div class="result"><a class="result__a" href="https://www.linkedin.com/company/example-company">LinkedIn</a></div>
            <div class="result"><a class="result__a" href="https://twitter.com/examplecompany">Twitter</a></div>
        `;

        const result = SearchService.parseResults(html);
        assert.ok(result.social.includes('https://www.linkedin.com/company/example-company'));
        assert.ok(result.social.includes('https://twitter.com/examplecompany'));
    });

    test('should use fallback regex if no specific classes found', () => {
        if (!SearchService) assert.fail('SearchService not implemented');

        // HTML that doesn't use .result__a but has links
        const html = `
            <html><body>
                <p>Some text</p>
                <a href="https://fallback-example.com">Fallback Link</a>
            </body></html>
        `;

        const result = SearchService.parseResults(html);
        assert.strictEqual(result.website, 'https://fallback-example.com');
    });

    test('should ignore irrelevant/internal results', () => {
        if (!SearchService) assert.fail('SearchService not implemented');

        const html = `
            <a class="result__a" href="/?q=test">Internal Search</a>
            <a class="result__a" href="https://duckduckgo.com/settings">Settings</a>
            <a class="result__a" href="https://www.google.com/search">Google</a>
        `;

        const result = SearchService.parseResults(html);
        assert.strictEqual(result.website, null);
        assert.strictEqual(result.social.length, 0);
    });

    test('should handle protocol-relative URLs', () => {
        if (!SearchService) assert.fail('SearchService not implemented');
        
        const html = `<a class="result__a" href="//www.protocol-relative.com">Relative</a>`;
        const result = SearchService.parseResults(html);
        assert.strictEqual(result.website, 'https://www.protocol-relative.com');
    });
});
