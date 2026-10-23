<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/84969666-e5d5-45d6-9343-2a2105407806

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Run the app (no Gemini API key is used by this website):
   `npm run dev`

## Verify a release

Run `npm run lint`, `npm test`, `npm run build`, then `npm run audit:seo`.
The build renders every published route, generates its metadata and FAQ schema,
and creates `llms.txt` / `llms-full.txt` from the public service and FAQ data.
After deployment, run `npm run audit:seo -- --origin=https://www.neutiul.com`.
This audit only reads pages; it does not submit enquiry forms or change Firebase.

## Dependency security and styling

Use `npm ci` and commit `package-lock.json`; npm is the deployment package manager.
Run `npm audit --audit-level=low` with network access before releases (an offline audit is not evidence of a clean registry audit).

Tailwind CSS 4.3 uses `@tailwindcss/postcss` and the theme in `src/styles.css`.
The v3 palette, pixel breakpoints, gradient interpolation and responsive line heights
are preserved for this site's 18px root font. Source scanning excludes build output.
Supported browsers follow Tailwind 4: Safari 16.4+, Chrome 111+, Firefox 128+.
Check desktop and mobile navigation, enquiry forms, portfolio dialogs and admin layout
when changing styling. Avoid automatic migration of non-CSS strings such as the logo's `ring` stage.
