# APG&E PDF Filler Demo

This is a small proof-of-concept app that lets a user fill out a simple web form and generates a completed APG&E PDF from the included template.

It does **not** handle signatures yet. The output PDF is meant to be manually signed or routed through DocuSign later.

## Requirements

- Node.js 18 or newer

## Setup

```bash
npm install
npm run dev
```

Then open:

```txt
http://localhost:3000
```

## How it works

- `public/index.html` is the simple user-facing form.
- `src/server.js` exposes the generate endpoint.
- `src/pdf/fillApgePdf.js` loads the PDF template and writes values onto it.
- `src/pdf/apgeFieldMap.js` stores the rough x/y coordinates.
- `templates/APGE Template Full.pdf` is a normalized copy of the source template. The original PDF had repair/encryption metadata that caused `pdf-lib` to reject it during loading, so this demo uses a repaired copy for easier local testing.

## Important notes

The current coordinates are a starting point. PDF coordinate mapping is normally adjusted by testing, downloading the generated PDF, then nudging x/y values in `src/pdf/apgeFieldMap.js`.

If you use a different APG&E template later and see `PDFDocument.load is encrypted`, normalize/repair that PDF first or keep the `{ ignoreEncryption: true }` option in `src/pdf/fillApgePdf.js`.

PDF coordinates start from the bottom-left corner of the page. Increasing `x` moves right. Increasing `y` moves up.
