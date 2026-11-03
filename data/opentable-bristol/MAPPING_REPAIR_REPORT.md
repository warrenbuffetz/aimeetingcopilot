# Mapping repair audit

- Original curated records: **102**.
- New curated records: **111** (102 original IDs retained in original order + 9 new).
- Old record IDs where the historical canonical question text did not exactly match the current curated title: **12**. Some are benign wording differences; several are serious mismatches.

## Examples of incorrect legacy mappings

- **B03:** current question: “Why are you interested in the Restaurant Product team specifically?”; older record question: “Why this particular Senior Product Manager role?”.
- **B04:** current question: “Why are you looking for a new opportunity now?”; older record question: “Your background is primarily financial services and retail. Why move into hospitality?”.
- **B05:** current question: “Why move into hospitality and AI/ML product management?”; older record question: “Tell me about a 0-to-1 product you've launched.”.
- **B06:** current question: “What makes your background relevant when you haven't owned a production AI/ML product end to end?”; older record question: “Tell me more about what you're doing at Arc'teryx.”.
- **B41:** current question: “Tell me about expanding Avion to non-RBC customers (Avion Select).”; older record question: “Have you built and shipped AI/ML-powered products?”.
- **B42:** current question: “Tell me about HBC Mastercard growth and funnel experimentation.”; older record question: “How are you using AI in your day-to-day product work?”.
- **B43:** current question: “Tell me about building Arc'teryx membership from zero to one.”; older record question: “How would you approach identifying an AI opportunity that improves restaurant revenue?”.
- **B44:** current question: “Tell me about Aeroplan acquisition and conversion optimization.”; older record question: “How would you measure success for a restaurant revenue-optimization product?”.
- **B45:** current question: “Tell me about a customer problem you identified and solved — ShopPlus.”; older record question: “How comfortable are you working with engineering, data science, and technical teams?”.
- **B46:** current question: “Tell me about your Ensights startup experience.”; older record question: “How do you move quickly when building something new?”.
- **B47:** current question: “RBC Avion overview — scope and impact.”; older record question: “How do you handle conflicting executive or stakeholder priorities?”.
- **B48:** current question: “Arc'teryx overview — current responsibilities.”; older record question: “Have you worked with two-sided marketplaces?”.

## Remediation

- Every Bristol row now points to a newly generated, correctly mapped OpenTable override record; old historical OpenTable entries are preserved but not reused.
- B52, B53 and B54 no longer point to unrelated Questrade canonical questions.
- B40, B49, B50 and B55 retain legitimate shared canonical references, with Bristol-specific wording as profile overrides.
- Full body, title, ID and short answer validated against merged canonical records.
- No runtime app import has been executed; Cursor should run its own regression suite after merge.
