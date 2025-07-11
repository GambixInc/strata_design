# Strata - AI-Powered Website Optimization Platform

This repository contains two main components:

1.  **`strata_design`**: The React frontend application built with Vite and TypeScript.
2.  **`strata_scraper`**: The Python Flask backend that handles web scraping and data storage.

## Project Overview

Strata is an AI-powered platform designed to help businesses optimize their websites. It provides functionalities for:

*   **User Authentication**: Secure login and dashboard access.
*   **Website Scraping**: A tool to scrape website content.
*   **SEO & Analytics Dashboard**: Displays scraped data, including SEO metrics, performance indicators, and analytics.

## Prerequisites

Before running the application, ensure you have the following installed:

*   **Node.js** (LTS version recommended) and **npm** (comes with Node.js)
*   **Python 3.8+** and **pip**

## Setup and Running the Application

To get the Strata application up and running, you need to start both the frontend and the backend services.

### 1. Backend Setup (`strata_scraper`)

Navigate to the `strata_scraper` directory and set up the Python backend:

```bash
cd strata_scraper
pip install -r requirements.txt
python server.py
```

This will start the Flask development server, which provides the API endpoints for the frontend.

### 2. Frontend Setup (`strata_design`)

Open a new terminal window, navigate to the `strata_design` directory, and set up the React frontend:

```bash
cd strata_design
npm install
npm run dev
```

This will start the Vite development server. The application will typically be accessible at `http://localhost:5173` (or another port if 5173 is in use).

## Usage

Once both the frontend and backend servers are running:

1.  Open your web browser and go to the frontend URL (e.g., `http://localhost:5173`).
2.  You will be presented with the login page. You can use the following demo credentials:
    *   **Email**: `john@techstartup.com` / `sarah@ecommerce.com` / `mike@agency.com`
    *   **Password**: `demo123`
3.  After logging in, you will be redirected to the dashboard. You can also navigate to the scraper tool from the dashboard.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
