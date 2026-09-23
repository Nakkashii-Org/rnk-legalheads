# RNK Legalheads website

Frontend for the RNK Legalheads full-service law firm website, built from the *RNK Legalheads Complete Developer Guide* (v1.0).

- **Live site:** https://rnk-legalheads.onrender.com/
- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Hosting:** Render web service

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Other commands: `npm run build` (production build), `npm run start` (serve the build), `npm run lint`.

## Draft review mode

All content starts unapproved (`approved: false`), as the guide requires. On the public site, unapproved services, industries, profiles, publications and newsletter issues stay hidden and pages show honest empty states.

To review the full draft catalogue and the labelled layout previews, set:

```bash
SHOW_DRAFT_CONTENT=true
```

- **Locally:** in `.env.local` (not committed).
- **On Render:** Dashboard → service → **Environment** → add the variable, then **Save, rebuild, and deploy** (a rebuild is required because pages are generated at build time).

Remove the variable (or set it to `false`) for the real public launch, and approve content record by record instead.

## Preview links for the email-link screens

These screens are normally reached only from a verified link in an email. In draft review mode they can be previewed; each is labelled "Preview state" and changes nothing. On the public site these links show the normal screens instead.

| Screen | Guide ref | Preview link |
| --- | --- | --- |
| Subscription confirmed | L05 | https://rnk-legalheads.onrender.com/subscribe/confirm?preview=confirmed |
| Newsletter preferences | L06 | https://rnk-legalheads.onrender.com/preferences?preview=preferences |
| Unsubscribed | L07 | https://rnk-legalheads.onrender.com/unsubscribe?preview=unsubscribed |

Requires `SHOW_DRAFT_CONTENT=true` on Render.

## Backend status

The contact and newsletter forms are frontend only. They post to `/api/contact`, `/api/subscribe`, `/api/preferences` and `/api/unsubscribe`, which are not built yet, so they show an honest "could not be sent" message and never report a false success.
