# Implementation Plan - Basic Keyword Filtering

This plan implements keyword-based filtering for LinkedIn job postings, managed via the extension popup.

## Phase 1: Storage and State Management [checkpoint: 96ac938]
- [x] Task: Implement storage service for keyword tags. 7462539
    - [x] Write tests for `StorageService` (get, add, remove, toggle tags).
    - [x] Implement `StorageService` using `chrome.storage.local`.
    - [x] Initialize with default keywords ("Confidential", "Hiring") in inactive state.
- [x] Task: Implement storage for Easy Apply filter state. 78c0df4
    - [x] Add `easyApplyEnabled` to storage and implement toggle logic.
- [x] Task: Conductor - User Manual Verification 'Storage and State' (Protocol in workflow.md) 78c0df4

## Phase 2: Popup UI [checkpoint: 036119b]
- [x] Task: Create tag management UI in the popup. c0328cd
    - [x] Write tests for popup UI logic (rendering list, adding/removing tags).
    - [x] Implement HTML/CSS for the tag list and input field.
    - [x] Implement JS logic to connect UI to `StorageService`.
- [x] Task: Add Easy Apply toggle to popup UI. c0328cd
- [~] Task: Conductor - User Manual Verification 'Popup UI' (Protocol in workflow.md)

## Phase 3: Content Script Filtering [checkpoint: 1c1fa36]
- [x] Task: Implement filtering logic in content script. d60039b
    - [x] Write tests for the filtering function (matching company/title against tags).
    - [x] Update `scripts/content.js` to apply styles based on matching tags.
    - [x] Implement detection for "Easy Apply" indicator on job cards.
    - [x] Implement listener for storage changes to update UI immediately.
- [x] Task: Conductor - User Manual Verification 'Content Script Filtering' (Protocol in workflow.md) bc20ac6
