# InteractLab

Free, interactive programming tutorials for mentorship programs. Each lesson is a self-contained HTML page with live visualizers—no build step, no backend.

## Tutorials

| Page | Topic |
|------|--------|
| [index.html](index.html) | Home — navigation and learning path |
| [bitwise-and-number-systems.html](bitwise-and-number-systems.html) | Binary, hex, bitwise operators |
| [recursion-and-big-o.html](recursion-and-big-o.html) | Recursion, call stack, Big-O |
| [sorting-algorithms.html](sorting-algorithms.html) | Sorting algorithms with step-by-step viz |

## Run locally

Open `index.html` in any modern browser, or serve the folder:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .
```

Then visit `http://localhost:8080`.

## Host on GitHub Pages

1. Create a GitHub repository and push this folder.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose branch `main` (or `master`) and folder **/ (root)**.
5. Save. After a minute or two, your site will be at  
   `https://<username>.github.io/<repo-name>/`

The home page is `index.html`, so it loads automatically at the site root.

### Optional: custom domain

In **Pages** settings, add your domain and a `CNAME` file in the repo root if needed.

## Project structure

```
├── index.html
├── bitwise-and-number-systems.html
├── recursion-and-big-o.html
├── sorting-algorithms.html
├── assets/
│   ├── css/site.css      # Shared design system & layout
│   └── js/site.js        # Mobile nav toggle
└── README.md
```

## License

Use and adapt for teaching. Attribution appreciated.
