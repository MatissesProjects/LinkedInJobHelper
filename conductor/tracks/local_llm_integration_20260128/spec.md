# Specification - Local LLM Integration (Ollama)

## Overview
Enable the extension to communicate with a locally running Ollama instance. This allows users to perform qualitative analysis on job descriptions (e.g., "Is this job actually interesting?", "Summarize key requirements", "Find red flags") without sending private data to external cloud APIs.

## Functional Requirements
### 1. Configuration (Popup UI)
- **Ollama URL:** Input field to specify the local API endpoint (default: `http://localhost:11434`).
- **Model Selection:** Input field or dropdown to specify the model to use (e.g., `llama3`, `mistral`, `gemma`).
- **Test Connection:** A button to verify the extension can talk to Ollama.

### 2. Analysis Trigger
- **Manual Trigger:** Add an "Analyze with AI" button to the job details view (the right-hand pane or full page view).
- **Context:** When clicked, the extension scrapes the *full* job description and company details from the active view.

### 3. LLM Processing
- **Prompt Engineering:** Construct a prompt that asks for:
    - A brief summary (2-3 sentences).
    - "Green Flags" (unique benefits, modern tech, clear mission).
    - "Red Flags" (generic corporate speak, unrealistic requirements, "rockstar" terminology).
    - An "Interestingness Score" (1-10) based on user-defined criteria (which can be hardcoded for now or customizable later).
- **Communication:** Send this prompt to the `/api/generate` or `/api/chat` endpoint of the configured Ollama instance.

### 4. Result Display
- **Overlay/Modal:** Display the analysis result in a non-intrusive overlay or injected HTML block within the job description area.
- **Visuals:** Use color coding for flags (Green/Red) and the score.

## Technical Requirements
- **Permissions:** may need to adjust `content_security_policy` or `host_permissions` to allow fetching from `localhost` or arbitrary user-defined URLs.
- **Streaming:** Ideally support streaming responses from Ollama for a responsive UI (optional for v1, but good for UX).
- **Error Handling:** Gracefully handle cases where Ollama is not running, the model is missing, or the request times out.

## Acceptance Criteria
- [ ] User can save Ollama URL and Model name in settings.
- [ ] "Analyze" button appears on job detail pages.
- [ ] Clicking the button successfully sends the job description to the local LLM.
- [ ] The LLM's response is displayed clearly on the page.
- [ ] Connection errors are reported to the user friendly.
