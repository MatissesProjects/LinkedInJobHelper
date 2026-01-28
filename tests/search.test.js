import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';

// Mock SearchService - we will implement this in scripts/background.js or a separate module
// For testing, we'll import the logic we plan to write.
// Since background.js in extensions is often a single entry point, we might extract the logic to a module 'scripts/search-service.js'.

describe('SearchService', () => {
    let SearchService;

    beforeEach(async () => {
        // Setup global DOMParser for tests
        const dom = new JSDOM();
        global.DOMParser = dom.window.DOMParser;

        // Dynamic import to simulate module loading
        try {
            const module = await import('../scripts/search-service.js');
            SearchService = module.SearchService;
        } catch (e) {
            // Module doesn't exist yet
        }
    });

    test('should parse DuckDuckGo HTML to find primary website', () => {
        if (!SearchService) assert.fail('SearchService not implemented');

        // Sample HTML snippet from a DuckDuckGo result (simplified)
        const html = `
            <div class="result results_links_deep highlight_d result--url-spacer-above">
                <div class="result__body links_main links_deep">
                    <h2 class="result__title">
                        <a class="result__a" href="https://www.example.com">Example Company: Leading the Industry</a>
                    </h2>
                    <div class="result__snippet">
                        Example Company is a global leader in...
                    </div>
                </div>
            </div>
        `;

        const result = SearchService.parseResults(html);
        assert.strictEqual(result.website, 'https://www.example.com');
    });

    test('should identify social profiles', () => {
        if (!SearchService) assert.fail('SearchService not implemented');

        const html = `
            <div class="result">
                <a class="result__a" href="https://www.linkedin.com/company/example-company">Example Company | LinkedIn</a>
            </div>
            <div class="result">
                <a class="result__a" href="https://twitter.com/examplecompany">Example Company (@examplecompany) / Twitter</a>
            </div>
        `;

        const result = SearchService.parseResults(html);
        assert.ok(result.social.includes('https://www.linkedin.com/company/example-company'));
        assert.ok(result.social.includes('https://twitter.com/examplecompany'));
    });

    test('should ignore irrelevant results', () => {
        if (!SearchService) assert.fail('SearchService not implemented');

        const html = `
            <div class="result">
                <a class="result__a" href="https://www.irrelevant-blog.com/article/example-company">Article about Example Company</a>
            </div>
        `;

        const result = SearchService.parseResults(html);
        // Should not be the primary website (assuming logic prioritizes "official" looking links or first result)
        // For this test, let's assume we want specific "official" patterns or just the first non-social link as primary.
        // If the *only* link is a blog, it might be picked as primary, but it definitely shouldn't be social.
        assert.strictEqual(result.social.length, 0);
    });
});
