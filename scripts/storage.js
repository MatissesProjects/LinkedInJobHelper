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

        const verificationState = await this.getVerificationEnabled();
        if (verificationState === undefined) {
            await this.setVerificationEnabled(true);
        }

        const hideUnverifiedState = await this.getHideUnverified();
        if (hideUnverifiedState === undefined) {
            await this.setHideUnverified(false);
        }

        const llmUrl = await this.getLLMUrl();
        if (llmUrl === undefined) {
            await this.setLLMUrl('http://localhost:11434');
        }

        const llmModel = await this.getLLMModel();
        if (llmModel === undefined) {
            await this.setLLMModel('qwen3:8b');
        }

        const priorityKeywords = await this.getPriorityKeywords();
        if (priorityKeywords === undefined) {
            await this.savePriorityKeywords([]);
        }

        const idealRoleText = await this.getIdealRoleText();
        if (idealRoleText === undefined) {
            await this.setIdealRoleText('');
        }

        const minScoreThreshold = await this.getMinScoreThreshold();
        if (minScoreThreshold === undefined) {
            await this.setMinScoreThreshold(7);
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

    async getVerificationEnabled() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['verificationEnabled'], (result) => {
                resolve(result.verificationEnabled);
            });
        });
    },

    async setVerificationEnabled(enabled) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ verificationEnabled: enabled }, () => {
                resolve();
            });
        });
    },

    async getHideUnverified() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['hideUnverified'], (result) => {
                resolve(result.hideUnverified);
            });
        });
    },

    async setHideUnverified(enabled) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ hideUnverified: enabled }, () => {
                resolve();
            });
        });
    },

    async getLLMUrl() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['llmUrl'], (result) => {
                resolve(result.llmUrl);
            });
        });
    },

    async setLLMUrl(url) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ llmUrl: url }, () => {
                resolve();
            });
        });
    },

    async getLLMModel() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['llmModel'], (result) => {
                resolve(result.llmModel);
            });
        });
    },

    async setLLMModel(model) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ llmModel: model }, () => {
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
    },

    // --- Ideal Job Criteria Storage ---

    async getPriorityKeywords() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['priorityKeywords'], (result) => {
                resolve(result.priorityKeywords);
            });
        });
    },

    async savePriorityKeywords(keywords) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ priorityKeywords: keywords }, () => {
                resolve();
            });
        });
    },

    async addPriorityKeyword(text) {
        const keywords = await this.getPriorityKeywords() || [];
        if (!keywords.some(k => k.text === text)) {
            keywords.push({ text, enabled: true }); // Default to enabled for priority
            await this.savePriorityKeywords(keywords);
        }
    },

    async removePriorityKeyword(text) {
        let keywords = await this.getPriorityKeywords() || [];
        keywords = keywords.filter(k => k.text !== text);
        await this.savePriorityKeywords(keywords);
    },

    async togglePriorityKeyword(text) {
        const keywords = await this.getPriorityKeywords() || [];
        const keyword = keywords.find(k => k.text === text);
        if (keyword) {
            keyword.enabled = !keyword.enabled;
            await this.savePriorityKeywords(keywords);
        }
    },

    async getIdealRoleText() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['idealRoleText'], (result) => {
                resolve(result.idealRoleText);
            });
        });
    },

    async setIdealRoleText(text) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ idealRoleText: text }, () => {
                resolve();
            });
        });
    },

    async getMinScoreThreshold() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['minScoreThreshold'], (result) => {
                resolve(result.minScoreThreshold);
            });
        });
    },

    async setMinScoreThreshold(score) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ minScoreThreshold: score }, () => {
                resolve();
            });
        });
    }
};
