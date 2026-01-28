/**
 * LinkedInJobHelper - Content Script
 * 
 * This script observes the LinkedIn jobs page for job card elements
 * and applies filters based on user settings.
 */

console.log('LinkedInJobHelper: Content script loaded.');

let activeKeywords = [];
let easyApplyEnabled = false;

/**
 * Loads the current settings from storage.
 */
async function loadSettings() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['keywords', 'easyApplyEnabled'], (result) => {
            activeKeywords = (result.keywords || []).filter(k => k.enabled);
            easyApplyEnabled = !!result.easyApplyEnabled;
            resolve();
        });
    });
}

/**
 * Applies filtering to a job card.
 * @param {Element} card - The .job-card-container element
 */
function applyFiltersToCard(card) {
    // Selectors updated based on page inspection
    const titleEl = card.querySelector('.job-card-list__title--link') || card.querySelector('.artdeco-entity-lockup__title');
    const companyNameEl = card.querySelector('.artdeco-entity-lockup__subtitle');
    
    // For Easy Apply, we check the list items in the footer or metadata
    const listItems = card.querySelectorAll('li');
    let applyMethodEl = null;
    for (const li of listItems) {
        if (li.textContent.includes('Easy Apply')) {
            applyMethodEl = li;
            break;
        }
    }
    
    const companyName = companyNameEl ? companyNameEl.textContent.trim() : '';
    const title = titleEl ? titleEl.textContent.trim() : '';
    const isEasyApply = !!applyMethodEl;

    // Debug logging to verify selectors
    // console.log('Processing Card:', { companyName, title, isEasyApply });

    let shouldFilter = false;
    let filterReason = '';

    // Check keywords
    for (const keyword of activeKeywords) {
        if (companyName.toLowerCase().includes(keyword.text.toLowerCase()) || 
            title.toLowerCase().includes(keyword.text.toLowerCase())) {
            shouldFilter = true;
            filterReason = `Matched: ${keyword.text}`;
            break;
        }
    }

    // Check Easy Apply
    if (!shouldFilter && easyApplyEnabled && isEasyApply) {
        shouldFilter = true;
        filterReason = 'Easy Apply Filter';
    }

    if (shouldFilter) {
        card.style.opacity = '0.4';
        card.style.filter = 'grayscale(100%)';
        
        // Add a small label if it doesn't exist
        if (!card.querySelector('.ljh-filter-label')) {
            const label = document.createElement('div');
            label.className = 'ljh-filter-label';
            label.textContent = filterReason;
            label.style.fontSize = '10px';
            label.style.color = '#cc0000';
            label.style.marginTop = '4px';
            label.style.fontWeight = 'bold';
            
            // Find a good place to insert - under the company name or title
            const target = companyNameEl ? companyNameEl.parentElement : card;
            target.appendChild(label);
        }
    } else {
        // Reset if it was previously filtered
        card.style.opacity = '1';
        card.style.filter = 'none';
        const label = card.querySelector('.ljh-filter-label');
        if (label) label.remove();
    }
}

/**
 * Processes a newly detected job card.
 */
function processJobCard(card) {
    applyFiltersToCard(card);
}

/**
 * Re-scans all job cards and applies current filters.
 */
function reprocessAllCards() {
    const cards = document.querySelectorAll('.job-card-container');
    cards.forEach(processJobCard);
}

/**
 * Sets up a MutationObserver to catch dynamically loaded job cards.
 */
function setupObserver() {
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.matches('.job-card-container')) {
                            processJobCard(node);
                        } else {
                            const nestedCards = node.querySelectorAll('.job-card-container');
                            nestedCards.forEach(processJobCard);
                        }
                    }
                });
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

/**
 * Listens for storage changes to update filters in real-time.
 */
function listenForChanges() {
    chrome.storage.onChanged.addListener(async (changes, area) => {
        if (area === 'local' && (changes.keywords || changes.easyApplyEnabled)) {
            await loadSettings();
            reprocessAllCards();
        }
    });
}

// Initialize
(async () => {
    await loadSettings();
    reprocessAllCards();
    setupObserver();
    listenForChanges();
})();