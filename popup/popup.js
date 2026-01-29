import { StorageService } from '../scripts/storage.js';

document.addEventListener('DOMContentLoaded', async () => {
    const filtersContainer = document.getElementById('filters');
    const priorityFiltersContainer = document.getElementById('priority-filters');
    
    const newKeywordInput = document.getElementById('new-keyword');
    const addKeywordBtn = document.getElementById('add-keyword');
    
    const newPriorityKeywordInput = document.getElementById('new-priority-keyword');
    const addPriorityKeywordBtn = document.getElementById('add-priority-keyword');
    
    const easyApplyToggle = document.getElementById('easy-apply-toggle');
    const verificationToggle = document.getElementById('verification-toggle');
    const hideUnverifiedToggle = document.getElementById('hide-unverified-toggle');
    
    const llmUrlInput = document.getElementById('llm-url');
    const llmModelInput = document.getElementById('llm-model');
    const testConnectionBtn = document.getElementById('test-connection');
    const connectionStatus = document.getElementById('connection-status');
    
    const idealRoleTextarea = document.getElementById('ideal-role-text');
    const minScoreThresholdInput = document.getElementById('min-score-threshold');

    /**
     * Renders the list of keyword tags.
     */
    async function renderTags() {
        const keywords = await StorageService.getKeywords();
        filtersContainer.innerHTML = '';

        keywords.forEach(tag => {
            const item = createTagItem(tag, async () => {
                await StorageService.toggleKeyword(tag.text);
            }, async () => {
                await StorageService.removeKeyword(tag.text);
                renderTags();
            });
            filtersContainer.appendChild(item);
        });
    }

    /**
     * Renders the list of priority keyword tags.
     */
    async function renderPriorityTags() {
        const keywords = await StorageService.getPriorityKeywords() || [];
        priorityFiltersContainer.innerHTML = '';

        keywords.forEach(tag => {
            const item = createTagItem(tag, async () => {
                await StorageService.togglePriorityKeyword(tag.text);
            }, async () => {
                await StorageService.removePriorityKeyword(tag.text);
                renderPriorityTags();
            });
            priorityFiltersContainer.appendChild(item);
        });
    }

    function createTagItem(tag, onToggle, onRemove) {
        const item = document.createElement('div');
        item.className = 'tag-item';
        
        item.innerHTML = `
            <div class="tag-info">
                <span class="tag-text">${tag.text}</span>
            </div>
            <div class="tag-actions">
                <label class="switch">
                    <input type="checkbox" ${tag.enabled ? 'checked' : ''} data-tag="${tag.text}">
                    <span class="slider"></span>
                </label>
                <span class="remove-btn" data-tag="${tag.text}">&times;</span>
            </div>
        `;

        // Toggle event
        item.querySelector('input').addEventListener('change', onToggle);

        // Remove event
        item.querySelector('.remove-btn').addEventListener('click', onRemove);

        return item;
    }

    // Add keyword event
    addKeywordBtn.addEventListener('click', async () => {
        const text = newKeywordInput.value.trim();
        if (text) {
            await StorageService.addKeyword(text);
            newKeywordInput.value = '';
            renderTags();
        }
    });

    // Enter key to add
    newKeywordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addKeywordBtn.click();
        }
    });

    // Add priority keyword event
    addPriorityKeywordBtn.addEventListener('click', async () => {
        const text = newPriorityKeywordInput.value.trim();
        if (text) {
            await StorageService.addPriorityKeyword(text);
            newPriorityKeywordInput.value = '';
            renderPriorityTags();
        }
    });

    newPriorityKeywordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addPriorityKeywordBtn.click();
        }
    });

    // Ideal Role Description
    idealRoleTextarea.addEventListener('input', async (e) => {
        await StorageService.setIdealRoleText(e.target.value);
    });

    // Min Score Threshold
    minScoreThresholdInput.addEventListener('input', async (e) => {
        const val = parseInt(e.target.value);
        if (!isNaN(val)) {
            await StorageService.setMinScoreThreshold(val);
        }
    });

    // Easy Apply toggle event
    easyApplyToggle.addEventListener('change', async (e) => {
        await StorageService.setEasyApplyEnabled(e.target.checked);
    });

    // Verification toggle events
    verificationToggle.addEventListener('change', async (e) => {
        await StorageService.setVerificationEnabled(e.target.checked);
    });

    hideUnverifiedToggle.addEventListener('change', async (e) => {
        await StorageService.setHideUnverified(e.target.checked);
    });

    // LLM Settings events
    llmUrlInput.addEventListener('input', async (e) => {
        await StorageService.setLLMUrl(e.target.value.trim());
    });

    llmModelInput.addEventListener('input', async (e) => {
        await StorageService.setLLMModel(e.target.value.trim());
    });

    testConnectionBtn.addEventListener('click', async () => {
        connectionStatus.textContent = 'Testing...';
        connectionStatus.style.color = '#666';
        
        const url = llmUrlInput.value.trim();
        try {
            // Ollama typically has a tag endpoint or just base URL for status
            const response = await fetch(`${url}/api/tags`);
            if (response.ok) {
                connectionStatus.textContent = 'Connected successfully!';
                connectionStatus.style.color = 'green';
            } else {
                connectionStatus.textContent = `Error: ${response.status}`;
                connectionStatus.style.color = 'red';
            }
        } catch (error) {
            connectionStatus.textContent = 'Connection failed. Is Ollama running?';
            connectionStatus.style.color = 'red';
        }
    });

    // Initial load
    await StorageService.init();
    
    const easyApplyEnabled = await StorageService.getEasyApplyEnabled();
    easyApplyToggle.checked = easyApplyEnabled;

    const verificationEnabled = await StorageService.getVerificationEnabled();
    verificationToggle.checked = verificationEnabled;

    const hideUnverified = await StorageService.getHideUnverified();
    hideUnverifiedToggle.checked = hideUnverified;

    llmUrlInput.value = await StorageService.getLLMUrl() || '';
    llmModelInput.value = await StorageService.getLLMModel() || '';

    idealRoleTextarea.value = await StorageService.getIdealRoleText() || '';
    minScoreThresholdInput.value = await StorageService.getMinScoreThreshold() || 7;

    renderTags();
    renderPriorityTags();
});