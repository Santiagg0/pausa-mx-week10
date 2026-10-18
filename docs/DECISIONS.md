# Decisions and session close
- Vacuum: regret prevention for Mexican buyers, not a seller recommender.
- MVP: no personal-data storage, no authentication needed; inputs used per request only.
- AI is optional; deterministic fallback visibly labeled when API is absent/unavailable.
- First deployment and real persona test pending. Do not claim they occurred.
- Next first move: run `npm install && npm run dev`, complete mechanical test, set Vercel API secret, deploy.
