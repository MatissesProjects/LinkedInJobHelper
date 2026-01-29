import { StorageService } from '../scripts/storage.js';

document.addEventListener('DOMContentLoaded', async () => {
    const filtersContainer = document.getElementById('filters');
    const newKeywordInput = document.getElementById('new-keyword');
    const addKeywordBtn = document.getElementById('add-keyword');
    const easyApplyToggle = document.getElementById('easy-apply-toggle');
    const verificationToggle = document.getElementById('verification-toggle');
    const hideUnverifiedToggle = document.getElementById('hide-unverified-toggle');
    const llmUrlInput = document.getElementById('llm-url');
    const llmModelInput = document.getElementById('llm-model');
    const testConnectionBtn = document.getElementById('test-connection');
    const connectionStatus = document.getElementById('connection-status');

    /**
     * Renders the list of keyword tags.
     */
    async function renderTags() {
        const keywords = await StorageService.getKeywords();
        filtersContainer.innerHTML = '';

        keywords.forEach(tag => {
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
            item.querySelector('input').addEventListener('change', async (e) => {
                await StorageService.toggleKeyword(e.target.dataset.tag);
            });

            // Remove event
            item.querySelector('.remove-btn').addEventListener('click', async (e) => {
                await StorageService.removeKeyword(e.target.dataset.tag);
                renderTags();
            });

            filtersContainer.appendChild(item);
        });
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

    renderTags();
});