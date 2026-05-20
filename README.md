# APG&E PDF Form Filler

A static TypeScript app that fills the APG&E PDF template directly in the browser and downloads the completed PDF.

No backend server is required. This works on GitHub Pages because the PDF generation happens client-side with `pdf-lib`.

## Local setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite.

## Build locally

```bash
npm run build
npm run preview
```

The production files are generated in `dist/`.

## Deploy to GitHub Pages

This repo includes `.github/workflows/deploy.yml`.

1. Push the project to GitHub.
2. Go to the repo's **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main` or `master`.
5. Open the URL shown in the completed GitHub Actions deployment.

## Notes

- The PDF template lives at `public/templates/APGE Template Full.pdf` so Vite copies it into the deployed site.
- `vite.config.ts` uses `base: "./"` so the app works under a GitHub Pages project URL like `https://username.github.io/repo-name/`.
- The generated PDF is downloaded by the browser; it is not uploaded or stored anywhere.
