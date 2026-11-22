# ÉPURE Skincare

Portfolio demo storefront for a fictional luxury skincare brand. Built with Next.js App Router, TypeScript, and Tailwind CSS.

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
