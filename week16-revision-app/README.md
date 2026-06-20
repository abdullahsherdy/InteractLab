# Python Revision App

Interactive revision tool covering all Python topics from Basics through OOP, Recursion, Big-O, and Sorting.

## How to open

This app uses ES modules and must be served over HTTP — it won't work when opened directly as a `file://` URL in Chrome.

**Option 1 — VS Code Live Server (easiest):**
1. Open the `InteractLab` folder in VS Code
2. Right-click `week16-revision-app/index.html` → "Open with Live Server"

**Option 2 — Python:**
```bash
cd "path/to/InteractLab"
python -m http.server 8080
# Then open http://localhost:8080/week16-revision-app/
```

**Option 3 — Any static hosting** (GitHub Pages, Netlify, etc.): deploy the whole `InteractLab` folder and navigate to `/week16-revision-app/`.

## First load

The first time you click **Run** on any code block, Pyodide downloads (~10 MB). This takes a few seconds on a good connection. After that, it's cached for the session.

## Updating content

- **Topic text / code examples:** edit `content/topics.js`
- **Practice problems:** edit `content/problems.js`
- **Styles:** edit `styles.css`
- **App logic:** edit `app.js`
