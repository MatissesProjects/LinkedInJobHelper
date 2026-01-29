/**
 * Service for communicating with a local Ollama instance.
 */
export const LLMService = {
    /**
     * Checks if the Ollama API is reachable.
     * @param {string} url - The base URL of the Ollama API.
     * @returns {Promise<boolean>}
     */
    async checkConnection(url) {
        try {
            const response = await fetch(`${url}/api/tags`);
            return response.ok;
        } catch (error) {
            console.error('LLMService: Connection check failed', error);
            return false;
        }
    },

    /**
     * Sends a prompt to the Ollama API.
     * @param {string} url - The base URL of the Ollama API.
     * @param {string} model - The name of the model to use.
     * @param {string} prompt - The prompt text.
     * @returns {Promise<string>} The model's response.
     */
    async generate(url, model, prompt) {
        try {
            const response = await fetch(`${url}/api/generate`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: model,
                    prompt: prompt,
                    stream: false
                })
            });

            if (response.status === 403) {
                throw new Error('CORS Error: Please start Ollama with OLLAMA_ORIGINS="*" environment variable.');
            }

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.status}`);
            }

            const data = await response.json();
            return data.response;
        } catch (error) {
            console.error('LLMService: Generation failed', error);
            throw error;
        }
    }
};
