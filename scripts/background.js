import { SearchService } from './search-service.js';
import { VerificationStorage } from './verification-storage.js';

console.log('Background service worker started.');

const searchQueue = [];
let isProcessingQueue = false;
const MIN_DELAY = 2000; // 2 seconds between searches

/**
 * Processes the search queue sequentially with a delay.
 */
async function processQueue() {
    if (isProcessingQueue || searchQueue.length === 0) return;
    isProcessingQueue = true;

    while (searchQueue.length > 0) {
        const { companyName, resolve, reject } = searchQueue.shift();
        
        try {
            // Check cache first
            const cached = await VerificationStorage.get(companyName);
            if (cached) {
                resolve({ success: true, data: cached, fromCache: true });
                continue;
            }

            console.log(`Searching for company: ${companyName}`);
            const results = await SearchService.search(companyName);
            console.log(`Search results for ${companyName}:`, results);
            
            // Add verification status
            const verificationData = {
                ...results,
                verified: !!(results.website || results.social.length > 0)
            };

            await VerificationStorage.save(companyName, verificationData);
            resolve({ success: true, data: verificationData, fromCache: false });
            
            // Delay before next search
            if (searchQueue.length > 0) {
                await new Promise(r => setTimeout(r, MIN_DELAY));
            }
        } catch (error) {
            console.error('Search error:', error);
            reject({ success: false, error: error.message });
        }
    }

    isProcessingQueue = false;
}

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'verifyCompany') {
        console.log('Received verification request for:', request.companyName);
        const { companyName } = request;
        
        // Return a promise that resolves when the queue processes this item
        new Promise((resolve, reject) => {
            searchQueue.push({ companyName, resolve, reject });
            console.log('Added to queue. Queue length:', searchQueue.length);
            processQueue();
        }).then((result) => {
            console.log('Sending response for:', companyName, result);
            sendResponse(result);
        }).catch((error) => {
            console.error('Queue error:', error);
            sendResponse({ success: false, error: error.message });
        });
            
        return true; // Keep message channel open for async response
    }
});