# LinkedInJobHelper

A browser extension to streamline your LinkedIn job search by filtering out noise and highlighting high-quality opportunities.

## 🚀 Features

- **Keyword Filtering:** Automatically dim and label job cards based on your custom list of company names or job titles (e.g., "Confidential", "Revature").
- **Easy Apply Filter:** Toggle to quickly identify or filter out "Easy Apply" listings.
- **Privacy First:** All data and preferences are stored locally in your browser.
- **Lightweight:** Built with Vanilla JavaScript, HTML, and CSS for maximum performance and minimal dependencies.

## 🛠️ Installation (Developer Mode)

1.  Clone this repository.
2.  Open Chrome or Edge and navigate to `chrome://extensions`.
3.  Enable **Developer mode** (toggle in the top right).
4.  Click **Load unpacked**.
5.  Select the `LinkedInJobHelper` folder.

## 📖 Usage

1.  Click the extension icon in your browser toolbar.
2.  **Add Keywords:** Type a company name or job title part and click "Add".
3.  **Toggle Filters:** Use the switches to enable/disable specific keywords or the "Easy Apply" filter.
4.  **View Results:** Refresh the LinkedIn Jobs page. Filtered jobs will be dimmed and labeled.

## 🏗️ Development

This project follows the **Conductor** spec-driven development framework.

- **Tests:** Run `npm test` to execute the test suite (using Node.js built-in test runner).
- **Architecture:** Manifest V3, Content Scripts, Popup UI.

## 🔮 Future Roadmap

- Local LLM integration (Ollama) for deep analysis of job descriptions.
- "Interestingness" scoring for job postings.