# Specification - Basic Keyword Filtering

## Overview
This track implements the first core filtering mechanism for LinkedInJobHelper. It allows users to manage a list of keywords (Company Names or Job Titles) via the extension popup and toggle them to visually filter (dim/label) matching job postings on LinkedIn.

## Functional Requirements
### 1. Tag Management (Extension Popup)
- Users can view a list of toggleable keyword tags in the extension popup.
- Users can add new keywords to the list via a simple input field.
- Users can remove keywords from the list.
- Each tag has a toggle switch to enable/disable its filtering logic.
- The list of tags and their toggle states must persist across browser sessions using `chrome.storage.local`.

### 2. Filtering Logic (Content Script)
- The content script will scan job cards for both the **Company Name** and **Job Title**.
- A job card matches if an **enabled** keyword is found as a partial, case-insensitive match within either field.
- **Easy Apply Filtering:** Implement a toggleable filter to dim/label job cards that use the LinkedIn "Easy Apply" feature.
- The script should re-run filtering whenever the DOM changes (already handled by the `MutationObserver` from the skeleton track).

### 3. Visual Indicators (UI/UX)
- **Filtered State:** Matching job cards should have their opacity reduced (e.g., 0.4).
- **Labeling:** A small, subtle label or icon should be added to the job card to indicate it has been filtered.
- **Toggle Responsiveness:** Changes to tags or toggle states in the popup should be reflected immediately on the LinkedIn page without requiring a manual refresh.

## Technical Requirements
- Use `chrome.storage.local` for persistence.
- Communication between the popup and content script via `chrome.runtime.sendMessage` or by listening for `chrome.storage.onChanged`.
- Initialize with a default set of keywords: "Confidential", "Hiring".

## Acceptance Criteria
- [ ] Popup UI displays pre-defined keywords with "OFF" state by default.
- [ ] Adding a new keyword in the popup persists it to storage.
- [ ] Toggling a keyword "ON" in the popup immediately dims matching jobs on an open LinkedIn page.
- [ ] Toggling a keyword "OFF" immediately restores the original appearance of matching jobs.
- [ ] Filtered jobs are visually distinct but remain readable.

## Out of Scope
- AI/LLM-based "interestingness" checks (future track).
- Complex heuristic analysis of job descriptions.
- Advanced Regex support for tags.
