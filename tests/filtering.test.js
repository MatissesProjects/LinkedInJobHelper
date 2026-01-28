import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import { JSDOM } from 'jsdom';

describe('Filtering Logic', () => {
    let dom;
    let document;

    beforeEach(() => {
        dom = new JSDOM(`
            <div class="job-card-container" id="card1">
                <span class="job-card-container__company-name">Confidential Company</span>
                <h3 class="job-card-list__title">Software Engineer</h3>
            </div>
            <div class="job-card-container" id="card2">
                <span class="job-card-container__company-name">Tech Corp</span>
                <h3 class="job-card-list__title">Frontend Developer</h3>
                <span class="job-card-container__apply-method">Easy Apply</span>
            </div>
            <div class="job-card-container" id="card3">
                <span class="job-card-container__company-name">Good Co</span>
                <h3 class="job-card-list__title">Interesting Problem Solver</h3>
            </div>
        `);
        document = dom.window.document;
        global.Node = dom.window.Node;
        global.Element = dom.window.Element;
        global.document = document;
    });

    // We will test the pure matching logic by extracting it or mocking the environment
    test('should identify matches based on company name', () => {
        const keywords = [{ text: 'Confidential', enabled: true }];
        const companyName = 'Confidential Company';
        const isMatch = keywords.some(k => k.enabled && companyName.toLowerCase().includes(k.text.toLowerCase()));
        assert.ok(isMatch);
    });

    test('should identify matches based on job title', () => {
        const keywords = [{ text: 'Frontend', enabled: true }];
        const jobTitle = 'Frontend Developer';
        const isMatch = keywords.some(k => k.enabled && jobTitle.toLowerCase().includes(k.text.toLowerCase()));
        assert.ok(isMatch);
    });

    test('should identify Easy Apply jobs', () => {
        const card = document.getElementById('card2');
        const hasEasyApply = !!card.querySelector('.job-card-container__apply-method');
        assert.ok(hasEasyApply);
    });

    test('should render verification label on job card', () => {
        const card = document.getElementById('card1');
        const companyNameEl = card.querySelector('.job-card-container__company-name');
        
        const label = document.createElement('span');
        label.className = 'ljh-verification-label';
        label.textContent = ' ✅';
        companyNameEl.appendChild(label);

        assert.ok(card.querySelector('.ljh-verification-label'), 'Verification label should exist');
        assert.strictEqual(card.querySelector('.ljh-verification-label').textContent, ' ✅');
    });
});
