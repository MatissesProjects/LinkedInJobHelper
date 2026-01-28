# Implementation Plan - Basic Keyword Filtering

This plan implements keyword-based filtering for LinkedIn job postings, managed via the extension popup.

## Phase 1: Storage and State Management
- [x] Task: Implement storage service for keyword tags. 7462539
    - [x] Write tests for `StorageService` (get, add, remove, toggle tags).
    - [x] Implement `StorageService` using `chrome.storage.local`.
    - [x] Initialize with default keywords ("Confidential", "Hiring") in inactive state.
- [ ] Task: Conductor - User Manual Verification 'Storage and State' (Protocol in workflow.md)

## Phase 2: Popup UI
- [ ] Task: Create tag management UI in the popup.
    - [ ] Write tests for popup UI logic (rendering list, adding/removing tags).
    - [ ] Implement HTML/CSS for the tag list and input field.
    - [ ] Implement JS logic to connect UI to `StorageService`.
- [ ] Task: Conductor - User Manual Verification 'Popup UI' (Protocol in workflow.md)

## Phase 3: Content Script Filtering
- [ ] Task: Implement filtering logic in content script.
    - [ ] Write tests for the filtering function (matching company/title against tags).
    - [ ] Update `scripts/content.js` to apply styles based on matching tags.
    - [ ] Implement listener for storage changes to update UI immediately.
- [ ] Task: Conductor - User Manual Verification 'Content Script Filtering' (Protocol in workflow.md)
