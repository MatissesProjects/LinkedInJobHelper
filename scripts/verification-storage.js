/**
 * Service for managing persistent verification results for companies.
 * Uses chrome.storage.local to cache results.
 */
export const VerificationStorage = {
    CACHE_KEY: 'verification_cache',

    /**
     * Retrieves the entire cache from storage.
     * @returns {Promise<Object>}
     */
    async _getCache() {
        return new Promise((resolve) => {
            chrome.storage.local.get([this.CACHE_KEY], (result) => {
                resolve(result[this.CACHE_KEY] || {});
            });
        });
    },

    /**
     * Saves verification data for a specific company.
     * @param {string} companyName 
     * @param {Object} data 
     */
    async save(companyName, data) {
        const cache = await this._getCache();
        cache[companyName] = {
            ...data,
            timestamp: Date.now()
        };
        return new Promise((resolve) => {
            chrome.storage.local.set({ [this.CACHE_KEY]: cache }, () => {
                resolve();
            });
        });
    },

    /**
     * Retrieves verification data for a specific company.
     * @param {string} companyName 
     * @returns {Promise<Object|null>}
     */
    async get(companyName) {
        const cache = await this._getCache();
        return cache[companyName] || null;
    }
};
