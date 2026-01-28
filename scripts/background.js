import { SearchService } from './search-service.js';

// Listen for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'verifyCompany') {
        const { companyName } = request;
        
        SearchService.search(companyName)
            .then(results => {
                sendResponse({ success: true, data: results });
            })
            .catch(error => {
                console.error('Search error:', error);
                sendResponse({ success: false, error: error.message });
            });
            
        return true; // Keep message channel open for async response
    }
});
