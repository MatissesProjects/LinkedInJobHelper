# Product Definition - LinkedInJobHelper

## Initial Concept
The goal of this project is to help with the jobs section of LinkedIn by filtering out vague or fake-looking posts and highlighting high-quality, interesting opportunities. It will be a browser extension with toggleable filters that affect the page directly.

## Target Audience
- Individual job seekers (specifically optimized for personal use) who want to streamline their search and avoid wasting time on low-quality listings.

## Core Problem
LinkedIn job listings are often cluttered with:
- "Fake" or "ghost" postings with vague information.
- Postings from "Confidential" companies.
- Repetitive, generic, or AI-generated descriptions that lack substance.
- High-quality opportunities buried under a high volume of noise.

## Key Features
- **Spam Filtering:** Identify and hide postings with generic company names or AI-generated sounding descriptions.
- **Local LLM Verification:** Integrate with a local Ollama instance to perform deeper analysis on specific postings.
- **Targeted Analysis:** Trigger LLM-based "interestingness" checks only on opened or specifically tagged job postings to maintain performance.
- **Visual Highlighting:** Visually mark "interesting" jobs (e.g., those solving unique problems) with a distinct highlight (e.g., green border).
- **Toggleable Filters:** A popup menu UI with toggle switches to enable/disable specific filtering and highlighting logic on the fly.

## Success Criteria
- Successfully hide postings based on company name and description patterns.
- Integration with local Ollama for qualitative analysis of job "interestingness."
- Visual modification of the LinkedIn Jobs UI without significant performance degradation.
