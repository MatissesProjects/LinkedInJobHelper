# Implementation Plan - Company Verification & Basic Info Retrieval

This plan implements a background verification service using DuckDuckGo to validate companies on LinkedIn.

## Phase 1: Search Service (Background Script) [checkpoint: 49ea794]
- [x] Task: Create background service worker and implement search logic. 00cb997
    - [x] Create `scripts/background.js`.
    - [x] Write tests for `SearchService` (parsing DuckDuckGo HTML for URLs).
    - [x] Implement `fetch` logic to DuckDuckGo HTML interface.
    - [x] Implement result parsing for Primary Website and Social Profiles.
- [~] Task: Conductor - User Manual Verification 'Search Service' (Protocol in workflow.md)

## Phase 2: Verification Data Management [checkpoint: a50ca46]
- [x] Task: Implement caching and persistence for verification results. ce6c810
    - [x] Write tests for `VerificationStorage` (storing/retrieving verification status).
    - [x] Implement logic to store results in `chrome.storage.local`.
    - [x] Add rate-limiting/queuing logic to avoid search blocks.
- [~] Task: Conductor - User Manual Verification 'Data Management' (Protocol in workflow.md)

## Phase 3: Content Script Integration & UI
- [x] Task: Update content script to trigger verification and display status. 0b32e2b
    - [x] Write tests for UI indicator rendering.
    - [x] Update `scripts/content.js` to extract company names and request verification from background script.
    - [x] Implement visual indicators (checkmark/warning icons) on job cards.
    - [x] Implement tooltip or hover state to show found links.
- [x] Task: Conductor - User Manual Verification 'Content Script Integration' (Protocol in workflow.md) 784571c

## Phase 4: Popup UI Controls
- [x] Task: Add Verification toggles to Popup UI. 781a87d
    - [x] Add `verificationEnabled` and `hideUnverified` to `StorageService`.
    - [x] Update `popup/popup.html` with two new toggles.
    - [x] Update `popup/popup.js` to handle toggle events.
    - [x] Update `scripts/content.js` to respect these settings (only verify if enabled, dim if unverified and hiding is on).
- [ ] Task: Conductor - User Manual Verification 'Popup Controls' (Protocol in workflow.md)
