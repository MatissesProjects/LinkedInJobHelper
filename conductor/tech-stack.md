# Technology Stack - LinkedInJobHelper

## Core Technologies
- **Language:** Vanilla JavaScript (ES6+)
- **Frontend:** HTML5, CSS3
- **Styling:** CSS Variables (Custom Properties) for modular and themeable styles.

## Browser Extension Architecture
- **Manifest Version:** Web Extensions Manifest V3
- **Build Tooling:** None (Native). Source files will be loaded directly into the browser to minimize complexity and build overhead.
- **DOM Interaction:** Native DOM API (`document.querySelector`, `MutationObserver`) for high-performance and dependency-free manipulation of the LinkedIn UI.

## External Integrations
- **Local LLM:** Ollama (Local instance running on `localhost:11434`).
- **Communication:** Native `fetch` API for direct HTTP requests to the Ollama server, with the option to use the `ollama-js` library if more complex interaction (e.g., streaming) is required.

## Development & Testing
- **Editor:** VS Code (or user's preferred editor)
- **Debugging:** Chrome/Edge DevTools
- **Test Framework:** TBD (Preference for lightweight, vanilla-friendly testing if needed later).
