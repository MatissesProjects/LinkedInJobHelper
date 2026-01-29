# Specification - Ideal Job Matcher & Priority Highlighting

## Overview
This feature allows users to define their "ideal" job criteria through specific keywords and a descriptive text field. The extension will use these criteria to highlight matching jobs in the feed and provide a deeper qualitative comparison when using the AI analysis tool.

## Functional Requirements
### 1. User Interface (Popup)
- **Priority Keywords Section:** A new list where users can add/remove keywords they are actively looking for (e.g., "Remote", "Staff", "Vue").
- **Ideal Role Description:** A multi-line text area where users can describe their perfect role in natural language.
- **Minimum Score Threshold:** A numeric input or slider to set a "Minimum Interestingness Score" for AI analysis.

### 2. Matching Logic
- **Keyword Match (Immediate):** The content script will scan job titles and company names for "Priority Keywords".
- **Density Match (Immediate):** A simple word-frequency comparison between the "Ideal Role Description" and the job description to provide a baseline match indicator.
- **AI-Powered Comparison (On-Demand):** When "Analyze with AI" is triggered, the "Ideal Role Description" will be injected into the prompt, asking the LLM to specifically evaluate how well the job aligns with the user's stated preferences.

### 3. Visual Indicators (LinkedIn UI)
- **Priority Label:** Jobs matching priority keywords will receive a distinct "⭐ Priority Match" label (subtle green/gold accent).
- **Match Score:** Display the density match percentage or an indicator of "Alignment" based on the text field.
- **AI Alignment:** The AI analysis result box will include a specific "Alignment with Ideal Role" section.

## Technical Requirements
- **Storage:** Update `StorageService` to persist `priorityKeywords`, `idealRoleText`, and `minScoreThreshold`.
- **Prompt Engineering:** Update the background script's `analyzeJob` handler to incorporate user preferences into the system prompt.

## Acceptance Criteria
- [ ] Users can manage a separate list of "Priority Keywords" in the popup.
- [ ] Jobs containing priority keywords are visually labeled in the LinkedIn feed.
- [ ] The "Analyze with AI" tool uses the "Ideal Role Description" to provide a personalized alignment check.
- [ ] Users can set a minimum interestingness threshold.

## Out of Scope
- Automatic hiding of jobs that don't match the "Ideal" criteria (dimming/hiding remains tied to the "Filter Keywords" list).
- Advanced semantic search for the immediate keyword match (keeping it simple for performance).
