# Implementation Plan - Ideal Job Matcher & Priority Highlighting

This plan implements a system for users to define and highlight their "ideal" job criteria.

## Phase 1: Data Management & Configuration
- [x] Task: Update `StorageService` to handle new preferences. 9b53dbf
    - [x] Add `priorityKeywords`, `idealRoleText`, `minScoreThreshold`, and `minHourlyRate` with defaults.
    - [x] Implement getters and setters in `scripts/storage.js`.
- [x] Task: Update Popup UI for Ideal Criteria. db0c082
    - [x] Add "Ideal Job Criteria" section to `popup/popup.html`.
    - [x] Implement keyword management for the Priority list in `popup/popup.js`.
    - [x] Bind the text field and threshold input to storage.
    - [x] Add Min Hourly Rate input.
- [x] Task: Additional Filtering Rules.
    - [x] Filter jobs without salary info.
    - [x] Block jobs mentioning GraphQL.
- [~] Task: Conductor - User Manual Verification 'Data Management & Configuration' (Protocol in workflow.md)

## Phase 2: Priority Highlighting (Content Script)
- [x] Task: Implement Priority Keyword Detection.
    - [x] Write tests for keyword matching logic in a new `tests/priority-matching.test.js`.
    - [x] Update `scripts/content.js` to load and react to priority keywords.
    - [x] Add `applyPriorityHighlighting` function to identify and label matching cards.
- [x] Task: Implement Visual Labels.
    - [x] Define CSS/inline styles for the "⭐ Priority Match" label.
    - [x] Ensure labels are correctly updated or removed when settings change.
- [x] Task: Conductor - User Manual Verification 'Priority Highlighting' (Protocol in workflow.md)

## Phase 3: Qualitative AI Alignment
- [x] Task: Update AI Analysis Prompt.
    - [x] Modify the `analyzeJob` message handler in `scripts/background.js` to fetch `idealRoleText`.
    - [x] Update the prompt template to include user preferences, asking the LLM to evaluate alignment.
- [x] Task: Update Result Display.
    - [x] Update `displayAnalysisResult` in `scripts/content.js` to clearly show the AI's alignment feedback.
- [x] Task: Conductor - User Manual Verification 'Qualitative AI Alignment' (Protocol in workflow.md)

## Phase 4: Baseline Match Logic
- [ ] Task: Implement Simple Keyword Density Match.
    - [ ] Write tests for the density calculation algorithm.
    - [ ] Implement a lightweight matching function in `scripts/content.js` to show a baseline match percentage on the job card.
- [ ] Task: Conductor - User Manual Verification 'Baseline Match Logic' (Protocol in workflow.md)
