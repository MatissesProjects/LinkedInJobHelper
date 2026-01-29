# Implementation Plan - Local LLM Integration

This plan details the steps to connect the LinkedInJobHelper extension to a local Ollama instance for AI-powered job analysis.

## Phase 1: Configuration & Connectivity
- [ ] Task: Update `StorageService` to handle LLM settings (URL, Model).
- [ ] Task: Update `popup` UI to include an "AI Settings" section (collapsible or separate tab).
    - [ ] Input for API URL (default: `http://localhost:11434`).
    - [ ] Input for Model Name (default: `llama3`).
    - [ ] "Test Connection" button.
- [ ] Task: Implement `LLMService` (script) to handle the `fetch` calls to Ollama.
    - [ ] `checkConnection()` function.
    - [ ] `listModels()` (optional, to populate dropdown).

## Phase 2: Content Script & Scraping
- [ ] Task: Identify selectors for the *full* job description in the detailed view (LinkedIn changes classes often, so need robust fallbacks).
- [ ] Task: Inject the "Analyze Job" button into the DOM near the job title or "Apply" button.
    - [ ] Ensure it only appears when a job is selected/visible.
- [ ] Task: Implement the "Scrape" logic to gather text content for the prompt.

## Phase 3: Background Orchestration
- [ ] Task: Set up message passing: Content Script -> Background -> LLMService -> Background -> Content Script.
    - *Note:* We route through Background to avoid CORS issues if possible, although `localhost` from a Content Script can be tricky due to Mixed Content (HTTPS LinkedIn vs HTTP Localhost). Manifest v3 often requires fetch from Background or specific permissions.
- [ ] Task: Define the System Prompt.
    - Create a template for the analysis request.

## Phase 4: UI Result Display
- [ ] Task: Create a UI component (HTML/CSS) for the analysis result.
    - [ ] Sections: Summary, Score, Pros, Cons.
- [ ] Task: Implement the logic to inject this component into the page when data arrives.
- [ ] Task: Handle "Loading" states and Error messages in the UI.

## Phase 5: Testing & Refinement
- [ ] Task: Test with a real local Ollama instance.
- [ ] Task: Refine the prompt for better results.
