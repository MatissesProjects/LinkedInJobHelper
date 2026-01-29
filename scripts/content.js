/**
 * LinkedInJobHelper - Content Script
 * 
 * This script observes the LinkedIn jobs page for job card elements
 * and applies filters and verification based on user settings.
 */

console.log('LinkedInJobHelper: Content script loaded.');

let activeKeywords = [];
let easyApplyEnabled = false;
let verificationEnabled = true;
let hideUnverified = false;

/**
 * Loads the current settings from storage.
 */
async function loadSettings() {
    return new Promise((resolve) => {
        chrome.storage.local.get(['keywords', 'easyApplyEnabled', 'verificationEnabled', 'hideUnverified'], (result) => {
            activeKeywords = (result.keywords || []).filter(k => k.enabled);
            easyApplyEnabled = !!result.easyApplyEnabled;
            verificationEnabled = result.verificationEnabled !== undefined ? result.verificationEnabled : true;
            hideUnverified = !!result.hideUnverified;
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

    console.log(`Requesting verification for: ${companyName}`);
    chrome.runtime.sendMessage({ action: 'verifyCompany', companyName }, (response) => {
        card.dataset.verificationPending = 'false';
        console.log(`Verification response for ${companyName}:`, response);
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
        
        if (hideUnverified) {
            card.style.opacity = '0.4';
            card.style.filter = 'grayscale(100%)';
        }
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

    // Trigger verification if enabled and not already verified/pending
    if (verificationEnabled && companyName && !card.dataset.verificationPending) {
        verifyCompany(companyName, card);
    }
}

/**
 * Processes a newly detected job card.
 */
function processJobCard(card) {
    applyFiltersToCard(card);
}

// --- AI Analysis Features ---

function injectAnalyzeButton(detailsContainer) {
    // Prevent duplicates
    if (detailsContainer.querySelector('.ljh-analyze-btn')) return;

    const titleSection = detailsContainer.querySelector('.jobs-details-top-card__content-container') || 
                         detailsContainer.querySelector('.job-details-jobs-unified-top-card__content-container') ||
                         detailsContainer.querySelector('.t-24'); // Fallback for some layouts
    
    if (!titleSection) return;

    const btn = document.createElement('button');
    btn.className = 'ljh-analyze-btn';
    btn.textContent = '🤖 Analyze with AI';
    btn.style.cssText = `
        margin: 10px 0;
        padding: 8px 16px;
        background-color: #0a66c2;
        color: white;
        border: none;
        border-radius: 16px;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        transition: background-color 0.2s;
    `;
    
    btn.onmouseover = () => btn.style.backgroundColor = '#004182';
    btn.onmouseout = () => btn.style.backgroundColor = '#0a66c2';

    btn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await runAnalysis(detailsContainer, btn);
    };

    // Insert after title or at top
    titleSection.appendChild(btn);
}

function scrapeJobData(detailsContainer) {
    const titleEl = detailsContainer.querySelector('.jobs-unified-top-card__job-title') || 
                    detailsContainer.querySelector('h1');
    const companyEl = detailsContainer.querySelector('.jobs-unified-top-card__company-name') ||
                      detailsContainer.querySelector('.jobs-unified-top-card__subtitle-primary-grouping a');
    const descriptionEl = detailsContainer.querySelector('#job-details') || 
                          detailsContainer.querySelector('.jobs-description-content__text');

    return {
        title: titleEl ? titleEl.textContent.trim() : 'Unknown Job',
        company: companyEl ? companyEl.textContent.trim() : 'Unknown Company',
        description: descriptionEl ? descriptionEl.innerText.trim() : ''
    };
}

async function runAnalysis(container, btn) {
    const data = scrapeJobData(container);
    if (!data.description) {
        alert('Could not find job description text.');
        return;
    }

    btn.textContent = '⏳ Analyzing...';
    btn.disabled = true;

    // Create prompt
    const prompt = `
        You are an expert technical recruiter and career coach. 
        Analyze the following job posting for a Senior Software Engineer.
        
        Role: ${data.title}
        Company: ${data.company}
        
        Description:
        ${data.description.substring(0, 5000)}

        ---
        Please provide a structured analysis with the following sections:
        
        1. **Summary**: A concise 2-sentence overview of the role and the company's mission.
        2. **Green Flags**: List up to 3 strong positive indicators (e.g., modern tech stack, clear growth path, unique problem space).
        3. **Red Flags**: List up to 3 potential concerns (e.g., vague requirements, "rockstar" culture, legacy tech debt indicators).
        4. **Interestingness Score**: A score from 1 to 10 based on:
           - Technical Challenge
           - Innovation/Uniqueness
           - Clarity of Role
           - Potential for Impact
        
        Format your response using bold headers for each section.
    `;

    chrome.runtime.sendMessage({ action: 'analyzeJob', prompt }, (response) => {
        btn.textContent = '🤖 Analyze with AI';
        btn.disabled = false;

        if (response && response.success) {
            displayAnalysisResult(container, response.data);
        } else {
            alert('Analysis failed: ' + (response ? response.error : 'Unknown error'));
        }
    });
}

function displayAnalysisResult(container, text) {
    const existing = container.querySelector('.ljh-analysis-result');
    if (existing) existing.remove();

    const resultBox = document.createElement('div');
    resultBox.className = 'ljh-analysis-result';
    resultBox.style.cssText = `
        margin: 15px;
        padding: 15px;
        background: #f3f6f8;
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        font-family: monospace;
        white-space: pre-wrap;
        font-size: 13px;
        color: #333;
    `;
    
    // Simple markdown-ish parsing for bolding
    resultBox.innerHTML = `<strong>AI Analysis:</strong>\n\n${text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}`;

    // Insert before description
    const descContainer = container.querySelector('.jobs-description__content') || 
                          container.querySelector('#job-details').parentElement;
    
    if (descContainer) {
        descContainer.insertBefore(resultBox, descContainer.firstChild);
    } else {
        container.appendChild(resultBox);
    }
}

function processJobDetails(node) {
    // Check if it's the right container
    if (node.querySelector('#job-details') || node.matches('.jobs-search__job-details')) {
        injectAnalyzeButton(node);
    } else {
        // Sometimes the node is a wrapper, search inside
        const details = node.querySelector('.jobs-search__job-details') || 
                        (node.querySelector && node.querySelector('#job-details') ? node : null);
        if (details) injectAnalyzeButton(details);
    }
}

/**
 * Re-scans all job cards and applies current filters.
 */
function reprocessAllCards() {
    const cards = document.querySelectorAll('.job-card-container');
    cards.forEach(processJobCard);

    // Also check for already open details pane
    const details = document.querySelector('.jobs-search__job-details');
    if (details) injectAnalyzeButton(details);
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
                        // Job Cards
                        if (node.matches('.job-card-container')) {
                            processJobCard(node);
                        } else {
                            const nestedCards = node.querySelectorAll('.job-card-container');
                            nestedCards.forEach(processJobCard);
                        }

                        // Job Details Pane
                        processJobDetails(node);
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
        if (area === 'local' && (changes.keywords || changes.easyApplyEnabled || changes.verificationEnabled || changes.hideUnverified)) {
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
