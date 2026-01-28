/**
 * LinkedInJobHelper - Content Script
 * 
 * This script observes the LinkedIn jobs page for job card elements
 * and prepares them for filtering/highlighting.
 */

console.log('LinkedInJobHelper: Content script loaded.');

/**
 * Processes a newly detected job card.
 * @param {Element} card - The .job-card-container element
 */
function processJobCard(card) {
    if (card.dataset.helperProcessed) return;
    
    // Mark as processed to avoid duplicate processing
    card.dataset.helperProcessed = 'true';
    
    // For now, just log the detection
    // In future tracks, we will extract details (title, company, etc.)
    console.log('LinkedInJobHelper: Detected job card', card);
}

/**
 * Scans the DOM for existing job cards.
 */
function scanExistingCards() {
    const cards = document.querySelectorAll('.job-card-container');
    cards.forEach(processJobCard);
}

/**
 * Sets up a MutationObserver to catch dynamically loaded job cards.
 */
function setupObserver() {
    const observer = new MutationObserver((mutations) => {
        let cardsFound = false;
        
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check if the added node is a card or contains cards
                        if (node.matches('.job-card-container')) {
                            processJobCard(node);
                            cardsFound = true;
                        } else {
                            const nestedCards = node.querySelectorAll('.job-card-container');
                            if (nestedCards.length > 0) {
                                nestedCards.forEach(processJobCard);
                                cardsFound = true;
                            }
                        }
                    }
                });
            }
        }
    });

    // Observe the entire document body for maximum compatibility with LinkedIn's dynamic loading
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('LinkedInJobHelper: MutationObserver active.');
}

// Initialize
scanExistingCards();
setupObserver();