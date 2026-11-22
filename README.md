# ÉPURE Skincare

Immersive Morphè Studios portfolio demo — **ÉPURE · The Art of Ritual**. Next.js App Router, TypeScript, Tailwind, optional Three.js/R3F hero on hardware WebGL.

## Run locally

```bash
cd epure-skincare
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm start` — serve production build
- `npm run lint` — ESLint

## Routes

| Route | Description |
| --- | --- |
| `/` | Homepage |
| `/shop` | Catalog with filter & sort |
| `/shop/[slug]` | Product detail |
| `/cart` | Cart (localStorage) |
| `/checkout` | Demo checkout (no payments) |
| `/about` | Brand story |
| `/contact` | Contact form |

## Notes

- Prices are in ZAR.
- Cart persists in `localStorage`.
- Checkout and contact forms validate client-side only; no real payments or email delivery.
- Pass 1 homepage: cinematic scroll storytelling + pointer-responsive hero. Simulated ÉPURE packaging mockups are labelled in alt text — not real product photos.
- Do not push to GitHub until review.
