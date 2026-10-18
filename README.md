# Pausa MX — Week 10
Buyer-side regret prevention. Next.js app + optional LLM + structured user constraints. No accounts or stored personal information.

## Run
`npm install && npm run dev` then open localhost:3000. Without OPENAI_API_KEY the UI explicitly labels its rule-based fallback. Add OPENAI_API_KEY only in Vercel environment settings for real AI output.

## Deploy
Push this directory to a GitHub repository and import to Vercel. Set OPENAI_API_KEY in Vercel project settings; redeploy. Record two actual deployment URLs and five actual commit hashes before submitting.

## Security
Server-only API key; validation on server; no DB; no personal data stored. Do not input identifying personal details. Rate limiting is recommended before public-scale launch.
