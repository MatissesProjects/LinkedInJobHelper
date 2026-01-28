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
- [ ] Task: Update content script to trigger verification and display status.
    - [ ] Write tests for UI indicator rendering.
    - [ ] Update `scripts/content.js` to extract company names and request verification from background script.
    - [ ] Implement visual indicators (checkmark/warning icons) on job cards.
    - [ ] Implement tooltip or hover state to show found links.
- [ ] Task: Conductor - User Manual Verification 'Content Script Integration' (Protocol in workflow.md)
