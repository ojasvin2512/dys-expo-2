<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/600cce35-c460-4f36-97b4-64365fc0073b

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key.
   - If you see quota errors like `RESOURCE_EXHAUSTED`, enable billing in Google Cloud or switch to another model with available quota via `VITE_GEMINI_TEXT_MODEL` (for example `gemini-2.0-pro` or `gemini-1.5-pro`).
3. Run the app:
   `npm run dev`
