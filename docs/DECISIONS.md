# PAUSA MX — WEEK 10
## Decisions, Testing and Session Close

### 1. Project Decisions

Project: PAUSA MX — AI Regret Prevention for Mexican Consumers.

Vacuum selected: Regret Prevention.

Target user: Mexican consumers who want to make better purchasing decisions and avoid unnecessary spending.

Problem: Many consumers make impulsive purchases without considering their budget, actual needs, or future financial priorities.

Solution: PAUSA MX helps users evaluate purchases before spending money.

The application works for the buyer, not the seller. It does not sell products, recommend stores, or receive commissions.

### 2. Technology Decisions

The application uses:

- Next.js for the user interface.
- OpenAI API for personalized purchase analysis.
- Structured user-constraint data.
- Budget comparison logic.
- Vercel for deployment.
- GitHub for version control.

The application does not require accounts or store purchase histories.

The AI provides guidance, but the final decision always belongs to the user.

### 3. First Deployment

The application was successfully deployed on Vercel.

Live URL:
https://pausa-mx-week10.vercel.app

Initial testing confirmed that:

- The application loads correctly.
- Users can enter purchase information.
- The application processes purchase constraints.
- The application displays a recommendation.
- The application provides follow-up questions.

### 4. AI Integration

The OpenAI API key was configured securely through Vercel Environment Variables.

A new deployment was performed.

AI testing scenario:

Product: iPhone
Price: 18000 MXN
Available budget: 5000 MXN
Reason: My current phone still works, but I want a new one.
Waiting period: 7 days.

Observed result:

The application displayed "ANÁLISIS CON IA".

Recommendation: Do not buy.

The AI explained that the purchase exceeded the available budget and that the current phone was still functional.

This confirmed a successful AI response in the deployed application.

### 5. Mechanical Testing

Test 1: Invalid purchase price.

Product: Headphones
Price: 0 MXN
Budget: 1000 MXN

Expected behavior:
The application should reject a purchase price of zero.

Observed behavior:
The browser displayed a validation message requiring a value of at least 1.

Result: PASS.

### 6. Bug Identified

During testing, the application displayed a previous purchase analysis after the user changed the purchase information.

Example:

Original purchase: iPhone.
New purchase: Headphones.

Problem:
The previous analysis could remain visible even though the form contained new information.

Risk:
Users could mistake an outdated recommendation for an analysis of their current purchase.

### 7. Bug Fix

The application was updated to clear the previous result whenever a user modifies a form field.

File modified:
app/page.tsx

Commit:
Fix stale purchase analysis and improve UI

Commit ID:
faf7036

The updated application was automatically deployed through Vercel.

### 8. Redeployment and Verification

Vercel confirmed the updated deployment status as Ready.

Verification scenario:

Original purchase: New sneakers.
Price: 2500 MXN.
Budget: 3000 MXN.

After generating an analysis, the product name was changed to Headphones.

Observed result:
The previous analysis disappeared from the screen.

Result: PASS.

This completed the documented test-fix-redeploy cycle.

### 9. Security Decisions

- OpenAI API key stored in Vercel environment variables.
- No API keys intentionally committed to GitHub.
- No user accounts required for this MVP.
- No persistent purchase history.
- Input validation on form fields.
- Demo scenarios use fictional purchase information.
- AI output is identified separately from rule-based fallback.

### 10. Remaining Limitations

The application still requires additional testing for delayed AI responses and unexpected network failures.

A previous request may finish after the user changes the form. This concurrency case has not yet been fully fixed.

The application is a decision-support tool, not professional financial advice.

### 11. Session Close

Completed:

- GitHub repository created.
- Application deployed.
- OpenAI integration activated.
- Mechanical tests performed.
- UI bug identified.
- Bug fixed and redeployed.
- Fix verified on the live application.

Next actions:

1. Complete the synthetic persona test.
2. Document the persona's confusion points.
3. Implement the highest-priority improvement.
4. Verify the final deployment.
5. Record the demo video.
6. Prepare the final submission documents.

Final principle:

PAUSA MX must help consumers make informed decisions without manipulating them into buying.
