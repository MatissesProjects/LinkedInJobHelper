/**
 * Service for performing DuckDuckGo searches and parsing results.
 */

export const SearchService = {
    /**
     * Parses the HTML response from DuckDuckGo to extract website and social links.
     * @param {string} html - The raw HTML response.
     * @returns {Object} { website: string|null, social: string[] }
     */
    parseResults(html) {
        // DOMParser is not available in Service Workers, so we use Regex.
        
        const socialDomains = ['linkedin.com', 'twitter.com', 'crunchbase.com', 'facebook.com', 'instagram.com'];
        
        let website = null;
        const social = [];
        const links = [];

        // Regex to find links. Targeted at DDG's 'lite' HTML structure.
        // Matches: <a class="result__a" href="..."> or just href="..." inside result divs
        // We look for the specific pattern of result links to avoid navigation links.
        const resultLinkRegex = /class="[^"]*result__a[^"]*"[^>]*href="([^"]+)"/g;
        let match;
        while ((match = resultLinkRegex.exec(html)) !== null) {
            links.push(match[1]);
        }
        
        // Fallback: If strict class matching fails, look for generic links within the body
        // (This is riskier but helpful if classes change)
        if (links.length === 0) {
            const genericLinkRegex = /href="((?:https?:\/\/)(?:[^"]+))"/g;
            while ((match = genericLinkRegex.exec(html)) !== null) {
                links.push(match[1]);
            }
        }

        // Helper to filter out internal/junk links
        const isJunk = (href) => {
            if (!href) return true;
            try {
                // Decode DDG intermediate links if possible, though regex usually grabs the raw attribute
                if (href.includes('duckduckgo.com/l/') || href.includes('uddg=')) {
                    // We will attempt to decode below, but if it's a pure internal link:
                    // return false; // Let it pass to decoding
                }
                
                return href.includes('duckduckgo.com') && !href.includes('uddg=') || 
                       href.includes('google.com') || 
                       href.includes('bing.com') ||
                       (href.startsWith('/') && !href.includes('uddg='));
            } catch (e) {
                return true;
            }
        };

        for (let href of links) {
            try {
                // Handle protocol-relative URLs
                if (href.startsWith('//')) {
                    href = 'https:' + href;
                }

                // Handle DDG redirects (extracted from query param)
                if (href.includes('uddg=')) {
                    const match = href.match(/uddg=([^&]+)/);
                    if (match && match[1]) {
                        href = decodeURIComponent(match[1]);
                    }
                }

                if (isJunk(href)) continue;

                // Normalize URL
                const urlObj = new URL(href);
                const hostname = urlObj.hostname.replace('www.', '');

                // Check if it's a social profile
                const isSocial = socialDomains.some(domain => hostname.includes(domain));

                if (isSocial) {
                    if (!social.includes(href)) {
                        social.push(href);
                    }
                } else if (!website) {
                    // First non-social link is likely the company website
                    website = href.endsWith('/') ? href.slice(0, -1) : href;
                }
            } catch (e) {
                // Invalid URL or parsing error, ignore
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
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                    'Upgrade-Insecure-Requests': '1'
                }
            });
            const html = await response.text();
            console.log(`Fetched ${html.length} bytes for ${query}`);
            
            // Check if we accidentally got JSON (Instant Answer API)
            if (html.trim().startsWith('{')) {
                console.warn('Received JSON instead of HTML. DDG might be blocking the request or returning Instant Answers.');
                // We could try to parse JSON here if needed, but for now just log it.
                console.log('JSON content:', html.substring(0, 500));
            }

            return this.parseResults(html);
        } catch (error) {
            console.error('Search failed:', error);
            return { website: null, social: [] };
        }
    }
};