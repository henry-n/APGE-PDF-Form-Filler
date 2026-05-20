# APG&E PDF Filler Demo

This is a small proof-of-concept app that lets a user fill out a simple web form and generate a completed APG&E PDF from the included template.

The GitHub Pages version runs fully in the browser:

- No backend server
- No database
- No saved customer data
- No uploaded files
- The completed PDF downloads directly from the user's browser

It does **not** handle signatures yet. The output PDF is meant to be manually signed or routed through DocuSign later.

## GitHub Pages deployment

This repo includes a GitHub Actions workflow at:

```txt
.github/workflows/deploy-pages.yml
```

That workflow publishes the `public/` folder to GitHub Pages.

### Setup steps

1. Push this repo to GitHub.
2. Go to the GitHub repo page.
3. Open **Settings**.
4. Open **Pages**.
5. Under **Build and deployment**, set **Source** to **GitHub Actions**.
6. Push to `main` or `master`.
7. Open the **Actions** tab and wait for **Deploy GitHub Pages** to finish.
8. Your site URL will look like:

```txt
https://YOUR-GITHUB-USERNAME.github.io/YOUR-REPO-NAME/
```

## Local static testing

Because the app fetches the PDF template from `public/templates/`, do not open `public/index.html` directly from File Explorer. Run a small local static server instead.

With Node installed, from the project root run:

```bash
npx serve public
```

Then open the local URL shown in the terminal.

## Local Express testing

The old Express server still exists for local testing:

```bash
npm install
npm run dev
```

Then open:

```txt
http://localhost:3000
```

The GitHub Pages deployment does not use the Express server.

## How it works

- `public/index.html` is the user-facing form.
- `public/main.js` loads `pdf-lib` from a CDN, loads the APG&E template, writes the mapped values onto the PDF, and downloads the completed PDF.
- `public/templates/APGE Template Full.pdf` is the PDF template used by GitHub Pages.
- `.github/workflows/deploy-pages.yml` deploys the `public/` folder to GitHub Pages.
- `src/server.js` and `src/pdf/*` are kept for the older local Express version.

## Important notes

The PDF coordinates are still the main thing to tune. The browser version keeps the coordinate map inside `public/main.js`. If you adjust mapping later, update the values in `public/main.js`.

PDF coordinates start from the bottom-left corner of the page. Increasing `x` moves right. Increasing `y` moves up.
