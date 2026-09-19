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
