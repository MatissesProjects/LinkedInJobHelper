# Implementation Plan - Ideal Job Matcher & Priority Highlighting

This plan implements a system for users to define and highlight their "ideal" job criteria.

## Phase 1: Data Management & Configuration
- [x] Task: Update `StorageService` to handle new preferences. 9b53dbf
    - [x] Add `priorityKeywords`, `idealRoleText`, and `minScoreThreshold` with defaults.
    - [x] Implement getters and setters in `scripts/storage.js`.
- [~] Task: Update Popup UI for Ideal Criteria.
    - [ ] Add "Ideal Job Criteria" section to `popup/popup.html`.
    - [ ] Implement keyword management for the Priority list in `popup/popup.js`.
    - [ ] Bind the text field and threshold input to storage.
- [ ] Task: Conductor - User Manual Verification 'Data Management & Configuration' (Protocol in workflow.md)

## Phase 2: Priority Highlighting (Content Script)
- [ ] Task: Implement Priority Keyword Detection.
    - [ ] Write tests for keyword matching logic in a new `tests/priority-matching.test.js`.
    - [ ] Update `scripts/content.js` to load and react to priority keywords.
    - [ ] Add `applyPriorityHighlighting` function to identify and label matching cards.
- [ ] Task: Implement Visual Labels.
    - [ ] Define CSS/inline styles for the "⭐ Priority Match" label.
    - [ ] Ensure labels are correctly updated or removed when settings change.
- [ ] Task: Conductor - User Manual Verification 'Priority Highlighting' (Protocol in workflow.md)

## Phase 3: Qualitative AI Alignment
- [ ] Task: Update AI Analysis Prompt.
    - [ ] Modify the `analyzeJob` message handler in `scripts/background.js` to fetch `idealRoleText`.
    - [ ] Update the prompt template to include user preferences, asking the LLM to evaluate alignment.
- [ ] Task: Update Result Display.
    - [ ] Update `displayAnalysisResult` in `scripts/content.js` to clearly show the AI's alignment feedback.
- [ ] Task: Conductor - User Manual Verification 'Qualitative AI Alignment' (Protocol in workflow.md)

## Phase 4: Baseline Match Logic
- [ ] Task: Implement Simple Keyword Density Match.
    - [ ] Write tests for the density calculation algorithm.
    - [ ] Implement a lightweight matching function in `scripts/content.js` to show a baseline match percentage on the job card.
- [ ] Task: Conductor - User Manual Verification 'Baseline Match Logic' (Protocol in workflow.md)
