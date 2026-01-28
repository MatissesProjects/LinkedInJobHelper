/**
 * LinkedInJobHelper - Content Script
 * 
 * This script observes the LinkedIn jobs page for job card elements
 * and applies filters and verification based on user settings.
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
 * Triggers company verification via background script.
 * @param {string} companyName 
 * @param {Element} card 
 */
async function verifyCompany(companyName, card) {
    if (card.dataset.verificationPending === 'true') return;
    card.dataset.verificationPending = 'true';

    chrome.runtime.sendMessage({ action: 'verifyCompany', companyName }, (response) => {
        card.dataset.verificationPending = 'false';
        if (response && response.success) {
            applyVerificationUI(card, response.data);
        } else {
            console.error('Verification failed for:', companyName, response ? response.error : 'No response');
        }
    });
}

/**
 * Applies verification indicators to the job card.
 * @param {Element} card 
 * @param {Object} data 
 */
function applyVerificationUI(card, data) {
    const companyNameEl = card.querySelector('.artdeco-entity-lockup__subtitle');
    if (!companyNameEl) return;

    // Remove existing label if any
    const existing = card.querySelector('.ljh-verification-label');
    if (existing) existing.remove();

    const label = document.createElement('span');
    label.className = 'ljh-verification-label';
    label.style.marginLeft = '8px';
    label.style.cursor = 'help';
    label.style.fontSize = '12px';

    if (data.verified) {
        label.textContent = '✅';
        label.title = `Verified: ${data.website || 'Social profiles found'}`;
        if (data.website) {
            label.style.cursor = 'pointer';
            label.onclick = (e) => {
                e.stopPropagation();
                window.open(data.website, '_blank');
            };
        }
    } else {
        label.textContent = '⚠️';
        label.title = 'Unverified: No official website or social profiles found';
        label.style.color = '#cc0000';
    }

    companyNameEl.appendChild(label);
}

/**
 * Applies filtering to a job card.
 * @param {Element} card - The .job-card-container element
 */
function applyFiltersToCard(card) {
    const titleEl = card.querySelector('.job-card-list__title--link') || card.querySelector('.artdeco-entity-lockup__title');
    const companyNameEl = card.querySelector('.artdeco-entity-lockup__subtitle');
    
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
        
        if (!card.querySelector('.ljh-filter-label')) {
            const label = document.createElement('div');
            label.className = 'ljh-filter-label';
            label.textContent = filterReason;
            label.style.fontSize = '10px';
            label.style.color = '#cc0000';
            label.style.marginTop = '4px';
            label.style.fontWeight = 'bold';
            
            const target = companyNameEl ? companyNameEl.parentElement : card;
            target.appendChild(label);
        }
    } else {
        card.style.opacity = '1';
        card.style.filter = 'none';
        const label = card.querySelector('.ljh-filter-label');
        if (label) label.remove();
    }

    // Trigger verification if not already verified/pending
    if (companyName && !card.dataset.verificationPending) {
        verifyCompany(companyName, card);
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
