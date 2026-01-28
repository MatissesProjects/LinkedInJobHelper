import { StorageService } from '../scripts/storage.js';

document.addEventListener('DOMContentLoaded', async () => {
    const filtersContainer = document.getElementById('filters');
    const newKeywordInput = document.getElementById('new-keyword');
    const addKeywordBtn = document.getElementById('add-keyword');
    const easyApplyToggle = document.getElementById('easy-apply-toggle');

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

    // Initial load
    await StorageService.init();
    const easyApplyEnabled = await StorageService.getEasyApplyEnabled();
    easyApplyToggle.checked = easyApplyEnabled;
    renderTags();
});