# Implementation Plan - Local LLM Integration

This plan details the steps to connect the LinkedInJobHelper extension to a local Ollama instance for AI-powered job analysis.

## Phase 1: Configuration & Connectivity
- [x] Task: Update `StorageService` to handle LLM settings (URL, Model).
- [x] Task: Update `popup` UI to include an "AI Settings" section (collapsible or separate tab).
    - [x] Input for API URL (default: `http://localhost:11434`).
    - [x] Input for Model Name (default: `qwen3:8b`).
    - [x] "Test Connection" button.
- [x] Task: Implement `LLMService` (script) to handle the `fetch` calls to Ollama.
    - [x] `checkConnection()` function.
    - [x] `listModels()` (optional, to populate dropdown).

## Phase 2: Content Script & Scraping
- [x] Task: Identify selectors for the *full* job description in the detailed view (LinkedIn changes classes often, so need robust fallbacks).
- [x] Task: Inject the "Analyze Job" button into the DOM near the job title or "Apply" button.
    - [x] Ensure it only appears when a job is selected/visible.
- [x] Task: Implement the "Scrape" logic to gather text content for the prompt.

## Phase 3: Background Orchestration
- [x] Task: Set up message passing: Content Script -> Background -> LLMService -> Background -> Content Script.
    - *Note:* We route through Background to avoid CORS issues if possible, although `localhost` from a Content Script can be tricky due to Mixed Content (HTTPS LinkedIn vs HTTP Localhost). Manifest v3 often requires fetch from Background or specific permissions.
- [x] Task: Define the System Prompt.
    - Create a template for the analysis request.

## Phase 4: UI Result Display
- [x] Task: Create a UI component (HTML/CSS) for the analysis result.
    - [x] Sections: Summary, Score, Pros, Cons.
- [x] Task: Implement the logic to inject this component into the page when data arrives.
- [x] Task: Handle "Loading" states and Error messages in the UI.

## Phase 5: Testing & Refinement
- [x] Task: Write unit tests for LLMService.
- [ ] Task: Test with a real local Ollama instance.
- [ ] Task: Refine the prompt for better results.
