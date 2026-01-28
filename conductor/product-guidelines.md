# Product Guidelines - LinkedInJobHelper

## Visual Identity & UI Style
- **Minimalist Approach:** Use subtle visual cues rather than heavy overlays. Preferred methods include thin borders, small status icons, or slight background color shifts.
- **Color Palette:**
    - High-Quality/Interesting: Subtle green accents (e.g., `#e6fffa` background or `#38a169` border).
    - Hidden/Filtered: Reduced opacity (0.3 - 0.5) or a "strikethrough" effect on text.
- **Native Feel:** UI elements should respect LinkedIn's typography and spacing to maintain a clean layout.

## User Experience & Interactions
- **LLM Feedback:** When an Ollama analysis is triggered, display a subtle loading spinner or progress indicator within the context of the job posting being analyzed.
- **Non-Destructive Filtering:** Jobs that meet "hide" criteria should not be removed from the page entirely; they should be grayed out or crossed out to allow for manual verification.
- **Filtering Controls:** A popup menu will provide toggle switches for each active filter (e.g., "AI Detection", "Vague Company Filter", "Interestingness Highlight").
- **Correction Mechanism:** Provide a small, unobtrusive "X" or "Dismiss" button on any extension-applied highlight to allow the user to manually override a false positive.

## Content & Messaging
- **Technical Tone:** Analysis summaries or tooltips should provide raw, technical data (e.g., LLM confidence scores or specific matched patterns) rather than conversational explanations.
- **Clarity over Prose:** Use concise labels and data-driven indicators for quick scanning.

## Performance Principles
- **Lazy Execution:** LLM checks (Ollama) should only occur on user-initiated actions (tagging or opening a job) to prevent browser lag.
- **DOM Efficiency:** Minimize frequent re-renders of the LinkedIn feed to ensure smooth scrolling.
