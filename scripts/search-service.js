/**
 * Service for performing DuckDuckGo searches and parsing results.
 */
import { JSDOM } from 'jsdom';

export const SearchService = {
    /**
     * Parses the HTML response from DuckDuckGo to extract website and social links.
     * @param {string} html - The raw HTML response.
     * @returns {Object} { website: string|null, social: string[] }
     */
    parseResults(html) {
        // In a real browser extension, we use native DOMParser.
        // In Node.js testing environment, we use JSDOM.
        let doc;
        if (typeof DOMParser !== 'undefined') {
            const parser = new DOMParser();
            doc = parser.parseFromString(html, 'text/html');
        } else {
            const dom = new JSDOM(html);
            doc = dom.window.document;
        }

        const results = doc.querySelectorAll('.result__a');
        const socialDomains = ['linkedin.com', 'twitter.com', 'crunchbase.com', 'facebook.com', 'instagram.com'];
        
        let website = null;
        const social = [];

        for (const link of results) {
            const href = link.href;
            if (!href) continue;

            try {
                const url = new URL(href);
                const hostname = url.hostname.replace('www.', '');

                // Check if it's a social profile
                const isSocial = socialDomains.some(domain => hostname.includes(domain));

                if (isSocial) {
                    if (!social.includes(href)) {
                        social.push(href);
                    }
                } else if (!website) {
                    // First non-social link is assumed to be the primary website
                    website = href.endsWith('/') ? href.slice(0, -1) : href;
                }
            } catch (e) {
                // Invalid URL, ignore
            }
        }

        return { website, social };
    },

    /**
     * Performs a search for the given query.
     * @param {string} query 
     * @returns {Promise<Object>}
     */
    async search(query) {
        const encodedQuery = encodeURIComponent(query);
        const url = `https://html.duckduckgo.com/html/?q=${encodedQuery}`;
        
        try {
            const response = await fetch(url);
            const html = await response.text();
            return this.parseResults(html);
        } catch (error) {
            console.error('Search failed:', error);
            return { website: null, social: [] };
        }
    }
};
