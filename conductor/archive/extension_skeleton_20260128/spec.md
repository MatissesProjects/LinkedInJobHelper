# Specification - Extension Skeleton & Job Detection

## Overview
This track focuses on setting up the foundational structure of the LinkedInJobHelper browser extension and implementing the core logic required to detect job postings on LinkedIn's job search page.

## Objectives
- Create a valid Manifest V3 browser extension structure.
- Implement a content script that runs on LinkedIn job pages.
- Identify the DOM selectors for job cards in the LinkedIn feed.
- Implement a basic observer to detect when new jobs are loaded.

## Technical Requirements
- **Manifest Version:** 3
- **Permissions:** `declarativeContent`, `storage`, and host permissions for `https://www.linkedin.com/*`.
- **Architecture:** 
    - `manifest.json`
    - `scripts/content.js` (DOM interaction)
    - `popup/popup.html` & `popup/popup.js` (UI controls)
- **Detection Logic:** Use `MutationObserver` to watch for the job list container and identify individual job card elements.

## Success Criteria
- Extension can be loaded into Chrome/Edge in developer mode.
- Console logs indicate successful detection of job cards on the LinkedIn jobs page.
- Extension popup opens correctly.
