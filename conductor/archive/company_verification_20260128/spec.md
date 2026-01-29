# Specification - Company Verification & Basic Info Retrieval

## Overview
This track implements an automated "reality check" for companies listed on LinkedIn job postings. By performing a background search via DuckDuckGo, the extension will attempt to find a corporate website and social proof (LinkedIn/Crunchbase/Twitter) to verify the company's legitimacy.

## Functional Requirements
### 1. Verification Trigger
- Verification is triggered for any job card that hasn't been verified in the current session.
- Users can also manually re-trigger verification from the job card or popup.

### 2. Search & Retrieval Logic
- Use a background script to perform a search on DuckDuckGo for the `[Company Name]` (optionally adding keywords like "corporate website" or "linkedin").
- Extract the following data points:
    - **Primary Website URL:** The most likely candidate for the company's official site.
    - **Social Proof:** Detection of LinkedIn, Twitter, or Crunchbase URLs in the top 3-5 results.
- **Library Selection:** Prioritize using a lightweight JavaScript tool/wrapper for DuckDuckGo interactions if available; otherwise, implement a robust `fetch` and parse approach for the DuckDuckGo HTML interface.

### 3. Verification Criteria
- A company is considered **"Verified"** if at least a valid Website URL **OR** a link to a major professional social profile (LinkedIn/Crunchbase) is found.
- If neither is found, the company is flagged as **"Unverified"**.

### 4. UI/UX (Job Card)
- **Verified Status:** Add a small, subtle checkmark icon next to the company name.
- **Unverified Status:** Add a small warning icon or label (e.g., "Unverified").
- **Tooltip Info:** Hovering over the status icon should display the found website or social links for quick manual verification.

## Technical Requirements
- **Manifest:** Add `host_permissions` for DuckDuckGo (e.g., `https://*.duckduckgo.com/*`).
- **Storage:** Persist verification results in `chrome.storage.local` to avoid redundant searches for the same company.
- **Rate Limiting:** Implement a simple queue or delay between searches to respect DuckDuckGo's terms and avoid bot detection.

## Acceptance Criteria
- [ ] Extension correctly extracts the company name and initiates a background search.
- [ ] Search results are parsed to successfully identify a website URL.
- [ ] Social profile links are correctly identified.
- [ ] Job cards are visually updated with "Verified" or "Unverified" indicators.
- [ ] Verification results persist across page refreshes.

## Out of Scope
- Subjective "interestingness" analysis (future track).
- Deep scraping of company websites.
- Advanced AI-based analysis of the search snippets.
