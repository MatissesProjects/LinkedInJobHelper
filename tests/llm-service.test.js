import { test, describe, beforeEach, mock } from 'node:test';
import assert from 'node:assert';

// Mock fetch globally
global.fetch = mock.fn();

describe('LLMService', () => {
    let LLMService;

    beforeEach(async () => {
        // Reset fetch mock
        global.fetch.mock.resetCalls();
        
        // Import module
        const module = await import('../scripts/llm-service.js');
        LLMService = module.LLMService;
    });

    test('checkConnection returns true on 200 OK', async () => {
        global.fetch.mock.mockImplementationOnce(() => Promise.resolve({
            ok: true
        }));

        const result = await LLMService.checkConnection('http://localhost:11434');
        assert.strictEqual(result, true);
        assert.strictEqual(global.fetch.mock.calls[0].arguments[0], 'http://localhost:11434/api/tags');
    });

    test('checkConnection returns false on error', async () => {
        global.fetch.mock.mockImplementationOnce(() => Promise.resolve({
            ok: false
        }));

        const result = await LLMService.checkConnection('http://localhost:11434');
        assert.strictEqual(result, false);
    });

    test('generate sends correct payload and returns response', async () => {
        const mockResponse = { response: 'AI Analysis Result' };
        global.fetch.mock.mockImplementationOnce(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve(mockResponse)
        }));

        const prompt = 'Test Prompt';
        const result = await LLMService.generate('http://localhost:11434', 'qwen3:8b', prompt);

        assert.strictEqual(result, 'AI Analysis Result');
        
        const call = global.fetch.mock.calls[0];
        assert.strictEqual(call.arguments[0], 'http://localhost:11434/api/generate');
        assert.strictEqual(call.arguments[1].method, 'POST');
        
        const body = JSON.parse(call.arguments[1].body);
        assert.strictEqual(body.model, 'qwen3:8b');
        assert.strictEqual(body.prompt, prompt);
        assert.strictEqual(body.stream, false);
    });

    test('generate throws error on API failure', async () => {
        global.fetch.mock.mockImplementationOnce(() => Promise.resolve({
            ok: false,
            status: 500
        }));

        await assert.rejects(
            async () => await LLMService.generate('http://localhost:11434', 'qwen3:8b', 'prompt'),
            /Ollama API error: 500/
        );
    });
});
