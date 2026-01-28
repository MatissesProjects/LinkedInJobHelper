/**
 * Service for managing persistent keyword tags.
 * Uses chrome.storage.local to store data.
 */
export const StorageService = {
    DEFAULT_KEYWORDS: [
        { text: 'Confidential', enabled: false },
        { text: 'Hiring', enabled: false }
    ],

    /**
     * Initializes the storage with default keywords and states if none exist.
     */
    async init() {
        const stored = await this.getKeywords();
        if (!stored || stored.length === 0) {
            // Clone the defaults to avoid mutation of the constant
            const defaults = JSON.parse(JSON.stringify(this.DEFAULT_KEYWORDS));
            await this.saveKeywords(defaults);
        }

        const state = await this.getEasyApplyEnabled();
        if (state === undefined) {
            await this.setEasyApplyEnabled(false);
        }
    },

    /**
     * Retrieves the Easy Apply filter state.
     * @returns {Promise<boolean>}
     */
    async getEasyApplyEnabled() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['easyApplyEnabled'], (result) => {
                resolve(result.easyApplyEnabled);
            });
        });
    },

    /**
     * Sets the Easy Apply filter state.
     * @param {boolean} enabled 
     * @returns {Promise<void>}
     */
    async setEasyApplyEnabled(enabled) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ easyApplyEnabled: enabled }, () => {
                resolve();
            });
        });
    },

    /**
     * Retrieves all keywords from storage.
     * @returns {Promise<Array>} List of keywords {text, enabled}
     */
    async getKeywords() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['keywords'], (result) => {
                resolve(result.keywords || []);
            });
        });
    },

    /**
     * Saves the list of keywords to storage.
     * @param {Array} keywords 
     * @returns {Promise<void>}
     */
    async saveKeywords(keywords) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ keywords }, () => {
                resolve();
            });
        });
    },

    /**
     * Adds a new keyword to the list.
     * @param {string} text - The keyword text
     */
    async addKeyword(text) {
        const keywords = await this.getKeywords();
        // Avoid duplicates (case-insensitive check could be added here, but keeping it simple for now)
        if (!keywords.some(k => k.text === text)) {
            keywords.push({ text, enabled: false });
            await this.saveKeywords(keywords);
        }
    },

    /**
     * Removes a keyword from the list.
     * @param {string} text - The keyword text to remove
     */
    async removeKeyword(text) {
        let keywords = await this.getKeywords();
        keywords = keywords.filter(k => k.text !== text);
        await this.saveKeywords(keywords);
    },

    /**
     * Toggles the enabled state of a keyword.
     * @param {string} text - The keyword text to toggle
     */
    async toggleKeyword(text) {
        const keywords = await this.getKeywords();
        const keyword = keywords.find(k => k.text === text);
        if (keyword) {
            keyword.enabled = !keyword.enabled;
            await this.saveKeywords(keywords);
        }
    }
};
