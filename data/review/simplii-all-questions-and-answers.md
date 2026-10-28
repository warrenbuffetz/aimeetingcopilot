# Simplii — All prepared questions & answers

Generated: 2026-10-28T15:47:12.024Z

Profile: **Simplii Financial — Senior Product Manager** (`1aff0813-6615-4a12-bfd6-ce7603604f6b`).

Source: supabase.

**Total active rows:** 371

## Table of contents

- [Career & Motivation](#career-motivation) (23)
- [My Product Experience](#my-product-experience) (144)
- [Product & Banking Knowledge](#product-banking-knowledge) (84)
- [Leadership & Behavioural](#leadership-behavioural) (63)
- [People Leadership & Direct Reports](#people-leadership-direct-reports) (20)
- [Other / Unsectioned](#other-unsectioned) (37)

---

## Career & Motivation

<a id="career-motivation"></a>

### 1. Build a business case for investing $2 million in account switching.

<a id="simplii-from-ecbddc79-ce40-4452-88cc-68b3f56f197a-build-a-bu"></a>

- **Import key:** `simplii-from-ecbddc79-ce40-4452-88cc-68b3f56f197a`
- **Library ID:** `c2a11354-320d-4089-88c1-2946ae5ba430`
- **Experience:** Career & Motivation
- **Tier:** P2
- **Evidence:** resume_supported

**Answer (spoken):**

I'd work backward from the business outcome instead of treating account switching as a feature investment.

First, I'd estimate the eligible customer population. How many existing customers have opened an account but haven't established recurring deposits? And how many of them could realistically be influenced by a switching experience?

Next, I'd estimate the incremental adoption lift we could generate, ideally using a smaller experiment before committing the full investment.

Then I'd model what those additional primary customers are worth.

That could include retained deposit balances, expected contribution from those balances, card and transaction economics, and any incremental adoption of other financial products.

But I'd be careful not to equate deposit volume with revenue. We'd need Finance and Treasury to help establish the real contribution after funding costs, servicing, incentives and other expenses.

I'd also consider how durable the behaviour is. A customer who receives one payroll deposit is less valuable than someone who maintains that relationship over several years.

For a $2 million investment, I'd want to show the expected payback period and present a range of outcomes, not just one optimistic forecast.

If the assumptions were uncertain, I'd propose a smaller initial investment to validate the biggest drivers before scaling.

That would give leadership a clearer picture of both the upside and the risks.

---

### 2. Do you prefer building new products or improving established ones?

<a id="simplii-from-e3acf896-6e83-4597-aeb6-088aba201987-do-you-pre"></a>

- **Import key:** `simplii-from-e3acf896-6e83-4597-aeb6-088aba201987`
- **Library ID:** `988c5282-4a66-4c20-be6f-3b98612b7c8d`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I enjoy both, but for different reasons. A zero-to-one product forces you to be very clear about the problem and what's worth building. An established product gives you real behaviour and operational data, so you can be more disciplined about diagnosing friction and measuring improvement.

At Arc'teryx I worked on the former with membership. At RBC and HBC, a lot of the interesting decisions came from improving journeys customers were already using. I wouldn't choose one over the other automatically; I'd choose the team and problem where the PM can have meaningful ownership.

---

### 3. How do you measure genuine primary-banking adoption instead of superficial account opening?

<a id="simplii-from-04f3d519-31e2-478e-9083-e60d2bca7818-how-do-you"></a>

- **Import key:** `simplii-from-04f3d519-31e2-478e-9083-e60d2bca7818`
- **Library ID:** `aecc5083-68b0-4bb6-8ad2-cea0b99018e1`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd separate account creation, first funding, first meaningful use and durable everyday activity.

For example, I could measure whether customers set up a recurring paycheque deposit, pay bills or use a debit card across multiple pay cycles. I'd use cohorts to see whether those behaviours persist after introductory offers expire, and I'd examine the support and failure rates that sit underneath the numbers.

I wouldn't assume a first deposit is a primary-bank relationship. The product question is whether customers are starting to trust the account with the financial tasks they need to complete regularly.

---

### 4. How would you design a reliable account-funding experience?

<a id="simplii-from-cf5d16e4-7d0d-4ddf-8a0b-f87d3dce3efc-how-would-"></a>

- **Import key:** `simplii-from-cf5d16e4-7d0d-4ddf-8a0b-f87d3dce3efc`
- **Library ID:** `f95ea875-f69a-4012-91f9-92870922397b`
- **Experience:** Career & Motivation
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd think about it as a combination of customer experience, payment infrastructure and operational controls.

From the customer perspective, funding should be straightforward. They need to know which account they're using, how much they're transferring, when funds are expected, and whether the transfer has completed.

Behind that experience, there are a number of considerations: account ownership verification, payment limits, eligibility, fraud controls, transfer status, settlement and reconciliation.

I'd work with engineering to make sure we handle retries and duplicate requests safely. A network timeout shouldn't accidentally trigger a second transfer if the customer taps the button again.

I'd also distinguish between funds that have been requested, received, settled and made available, because those aren't necessarily the same thing.

For measurement, I'd look at successful funding per eligible attempt, time to available funds, return rates, support contacts and fraud or loss metrics.

If the experience has a high drop-off rate, I'd diagnose whether the problem is customer confusion, account linking, risk rules or the underlying payment service before deciding what to change.

---

### 5. How would you handle duplicate charges, incorrect balances or transaction discrepancies?

<a id="simplii-from-a40816ee-67e5-4b52-9228-33132bb5ffb1-how-would-"></a>

- **Import key:** `simplii-from-a40816ee-67e5-4b52-9228-33132bb5ffb1`
- **Library ID:** `48be0d8c-0e3d-4827-b42f-ebe99dcd5601`
- **Experience:** Career & Motivation
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

My first priority would be understanding whether this is a display problem, a payment processing problem or an actual ledger discrepancy. Those have very different implications.

For a potentially duplicated transaction, I'd want to trace the payment identifiers and lifecycle to determine whether we initiated the same transaction twice, received duplicate notifications or are simply displaying the same event incorrectly.

I'd work with engineering and operations to contain the issue and understand how many customers are affected.

If balances are wrong, I'd treat that with particular urgency because customers make financial decisions based on the money they believe they have available.

I'd want a controlled remediation process, reconciliation against the authoritative records, clear accountability and customer communication where appropriate.

After resolution, I'd look at the root cause and preventive controls, not just whether the incident ticket was closed.

For a financial product, correctness is part of the customer experience. It's not just a back-office concern.

---

### 6. How would you improve transaction histories?

<a id="simplii-from-94d1edb7-2a12-40f6-8145-2a6006c2d682-how-would-"></a>

- **Import key:** `simplii-from-94d1edb7-2a12-40f6-8145-2a6006c2d682`
- **Library ID:** `6812a08d-4bfc-423e-8366-fdd5e330961a`
- **Experience:** Career & Motivation
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I think transaction history is one of those features people barely notice when it works, but really notice when it doesn't.

A good transaction history should answer three questions quickly: where did my money go, how much did I spend, and has the transaction actually completed?

I'd start by looking at customer confusion and support contacts. Are merchant names unclear? Are pending transactions being mistaken for final charges? Are customers struggling to identify refunds or duplicate transactions?

I'd prioritize accurate merchant names, clear pending and posted states, useful categorization and a consistent way to view refunds or adjustments.

I'd also work closely with the Card and Money Movement teams, because transaction history sits on top of multiple underlying data sources and processing states.

For an MVP, I'd rather have fewer categories that are accurate than an impressive-looking enrichment system that frequently gets transactions wrong.

I'd measure whether customers can identify transactions more easily, whether related support contacts decrease, and whether the feature helps customers manage their spending.

Accuracy and clarity would come before personalization.

---

### 7. How would you make saving more engaging without turning it into a gimmick?

<a id="simplii-from-aa868026-c8b7-4c7a-9318-a8754cb383af-how-would-"></a>

- **Import key:** `simplii-from-aa868026-c8b7-4c7a-9318-a8754cb383af`
- **Library ID:** `fc3620e8-04f2-42e7-9092-3f51524f148c`
- **Experience:** Career & Motivation
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd be careful about the idea of making saving addictive. I understand the intention, but personal finance is a little different from social media or gaming.

I'd rather help customers build a habit that feels rewarding and genuinely improves their financial position.

I'd start by understanding why people struggle to save. For some, it's remembering to transfer money. For others, it's uncertainty about how much they can afford to set aside.

A simple product idea could be goal-based savings with small recurring contributions that customers can adjust or pause easily.

Another possibility is helping users identify opportunities to save after regular expenses are accounted for.

I would avoid overly aggressive defaults that move money without customers clearly understanding what will happen.

For measurement, I'd look at sustained contribution behaviour, progress toward goals and customer retention, alongside safeguards like overdrafts, failed transfers and frequent withdrawals caused by cash-flow stress.

The goal should be helping customers feel more in control of their money, not simply maximizing the number of transfers.

---

### 8. How would you manage an underperforming banking technology vendor?

<a id="simplii-from-176ce1ac-757b-452d-b98c-d8055754808c-how-would-"></a>

- **Import key:** `simplii-from-176ce1ac-757b-452d-b98c-d8055754808c`
- **Library ID:** `4c139c46-b70b-4d8a-b252-4b216f6bef2b`
- **Experience:** Career & Motivation
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd separate immediate customer risk from the longer-term vendor relationship.

If the issue affects payments, balances or another critical banking capability, the first priority is containment and operational continuity. I'd work with Engineering, Operations and the vendor to understand the impact and available recovery options.

Then I'd look at the evidence. Are we seeing availability problems, latency, settlement delays, incorrect responses or missed support commitments?

I'd want clear SLAs and operational metrics so the conversation is grounded in performance rather than frustration.

I'd also review the contractual escalation process and the level of dependency we have on that vendor.

For longer-term improvement, I'd push for an agreed remediation plan, owners and measurable milestones.

If performance remained unacceptable, I'd work with leadership on alternatives, but I wouldn't casually recommend replacing a core banking vendor. The switching costs and operational risks could be significant.

The key is to be firm about the required outcomes while maintaining a productive working relationship.

---

### 9. How would you use AI to improve personal financial management?

<a id="simplii-from-0977208e-9d2d-40dc-8cfa-d48c79105e79-how-would-"></a>

- **Import key:** `simplii-from-0977208e-9d2d-40dc-8cfa-d48c79105e79`
- **Library ID:** `93a29b2b-2c1c-4d40-9bb2-ce2985ea3782`
- **Experience:** Career & Motivation
- **Tier:** P2
- **Evidence:** resume_supported

**Answer (spoken):**

I think there's a meaningful opportunity for AI in helping people understand their finances, but I'd be careful about where we introduce it.

A good starting point might be transaction understanding. Customers could ask why spending was higher this month, identify recurring expenses or understand changes in their cash flow.

Those are useful problems because the underlying data can often be inspected and explained.

I wouldn't immediately have an AI assistant telling people what investments to buy or automatically moving their money. That's a much higher-risk use case involving suitability, authorization, data quality and trust.

I'd start with a narrow experience grounded in reliable transaction and account data, with clear explanations of where the insights came from.

I'd also want ways to handle uncertainty. If the system doesn't have enough information, it should say that rather than confidently generating a misleading answer.

For success, I'd look at whether the feature helps customers complete a task or understand their finances, along with accuracy, user trust and support or complaint metrics.

I see AI as a way to reduce complexity, not as something we should introduce just to say the product uses AI.

---

### 10. Tell me about a complex cross-system product integration you led.

<a id="simplii-from-f8074663-5773-4b95-a25b-1e32a764c1a9-tell-me-ab"></a>

- **Import key:** `simplii-from-f8074663-5773-4b95-a25b-1e32a764c1a9`
- **Library ID:** `1ce955cd-bc52-48fe-85f2-4c3be8d7fde9`
- **Experience:** Career & Motivation
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

At RBC, one of the more complex integrations was adapting an existing Interac e-Transfer service so Avion members who didn't bank with RBC could withdraw cashback.

The challenge wasn't just calling an API. We had to understand eligibility, how an Autodeposit payment was associated with a member, what transaction states could be shown, and what happened when confirmation or reconciliation didn't arrive as expected. Payments, Risk, Financial Operations and the product team each owned a different piece of that journey.

I helped define the customer experience and the business rules, and worked through those dependencies with the other teams. One decision I pushed was making payment status and exception handling part of the MVP, because a withdrawal that leaves customers guessing isn't a complete experience. It taught me to start with the entire journey rather than treat the integration as a technical ticket.

---

### 11. Tell me about yourself.

<a id="simplii-from-2f3a780e-6b54-42b8-b56d-8936a471fa68-tell-me-ab"></a>

- **Import key:** `simplii-from-2f3a780e-6b54-42b8-b56d-8936a471fa68`
- **Library ID:** `e5091a37-ba00-4b2c-b5c7-02f1b23cf334`
- **Experience:** Career & Motivation
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

Sure. I've spent the last nine-plus years in product, mostly working on digital consumer experiences, financial products and the platforms that support them.

I'm currently a Senior Product Manager at Arc'teryx, where I've been leading the strategy for a new membership platform. That involved securing $5.2 million in funding, evaluating different technology solutions and working across business and engineering teams to define how the platform and customer experience come together.

Before that, I was at RBC working on Avion Rewards. One of the more interesting projects was opening Avion to non-RBC customers, which meant rethinking how people signed up and accessed the platform. I also launched consumer cashback withdrawals through Interac e-Transfer, which gave me experience working with payment infrastructure, Risk and Financial Operations.

Earlier in my career, I was at HBC managing growth for its Mastercard portfolio, and at Aeroplan working on credit card acquisition with TD, CIBC and American Express.

So I've had the opportunity to work across different parts of the financial customer journey, from acquisition and onboarding to payments, spending and ongoing engagement.

What interests me about Simplii is the chance to bring those experiences together in everyday banking. You're trying to become the place customers rely on for day-to-day money movement, and the PM owns meaningful scope—discovery, backlog, delivery detail, and outcome accountability—not just a roadmap slide. That combination is why I'm here.

---

### 12. What are your compensation expectations?

<a id="simplii-from-93f1f35c-cd54-49c3-8d6d-6a95d262fd4b-what-are-y"></a>

- **Import key:** `simplii-from-93f1f35c-cd54-49c3-8d6d-6a95d262fd4b`
- **Library ID:** `d2dee267-acdc-4c03-bfbc-9b321907fb43`
- **Experience:** Career & Motivation
- **Tier:** P2
- **Evidence:** resume_supported

**Answer (spoken):**

Based on the scope of the position, my experience and the published range, I'd be targeting somewhere around $175,000 to $185,000 in base salary.

I'm also interested in understanding the overall compensation package, particularly the bonus structure.

The role and the opportunity to own a meaningful product outcome are important to me, so I'm open to discussing the right package if there's a strong mutual fit.

---

### 13. What have you learned about Simplii, and what product question interests you most?

<a id="simplii-from-0accbf98-6b70-462f-9631-d279d5fe3ae5-what-have-"></a>

- **Import key:** `simplii-from-0accbf98-6b70-462f-9631-d279d5fe3ae5`
- **Library ID:** `d7f4b4f0-0d30-464c-942d-eecd7007322b`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I've looked at Simplii as an established digital-first banking option rather than a brand that has to build an entirely new banking proposition. Its no-fee chequing account, CIBC ATM access and everyday money-movement tools are a practical starting point for customers.

What interests me is the journey from signing up to comfortably using the account week after week. How easy is it to set up payroll? How confident does someone feel when they move a recurring bill? What do they see when a payment is delayed?

I wouldn't claim to know which of those is the biggest internal problem. I'd want to learn from the team's customer data and research. But it's the kind of end-to-end, detail-heavy product challenge that fits the role and my experience.

**Embedded follow-ups (2):**

- **Q:** Why Simplii now?

What interests me is that Simplii has an opportunity to build on a customer relationship that already exists, rather than trying to establish one from scratch.

You've already got customers who trust Simplii with their investments. The interesting challenge is figuring out how you become relevant to the rest of their financial lives, particularly the things they do every day.

That's a problem I find really interesting because opening a banking account is relatively easy compared with getting someone to change their habits. Getting them to move their paycheque, pay bills and eventually treat you as their primary bank is a very different level of commitment.

A lot of my experience has been around those kinds of customer behaviours. At RBC, I worked on opening Avion to customers outside the bank and making cashback withdrawals possible through Interac. At HBC, I worked on cardholder acquisition, engagement and long-term value.

I also like the stage Simplii is at. There's an established financial-services business, but still an opportunity to influence what the everyday banking experience becomes. That combination of scale and building something new is particularly appealing to me.

- **Q:** What excites you about Simplii?

What interests me is that Simplii has an opportunity to build on a customer relationship that already exists, rather than trying to establish one from scratch.

You've already got customers who trust Simplii with their investments. The interesting challenge is figuring out how you become relevant to the rest of their financial lives, particularly the things they do every day.

That's a problem I find really interesting because opening a banking account is relatively easy compared with getting someone to change their habits. Getting them to move their paycheque, pay bills and eventually treat you as their primary bank is a very different level of commitment.

A lot of my experience has been around those kinds of customer behaviours. At RBC, I worked on opening Avion to customers outside the bank and making cashback withdrawals possible through Interac. At HBC, I worked on cardholder acquisition, engagement and long-term value.

I also like the stage Simplii is at. There's an established financial-services business, but still an opportunity to influence what the everyday banking experience becomes. That combination of scale and building something new is particularly appealing to me.

---

### 14. What makes you different from other Senior PM candidates?

<a id="simplii-from-f67032ca-4e2e-4b49-ae44-29b181eab8b6-what-makes"></a>

- **Import key:** `simplii-from-f67032ca-4e2e-4b49-ae44-29b181eab8b6`
- **Library ID:** `1be95378-2cc4-45d8-808f-0ff35eef11d1`
- **Experience:** Career & Motivation
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I think one of my strengths is that I can connect the customer experience to the underlying business and technical realities.

I've worked on acquisition and growth, but I've also been involved in the less visible parts of financial products, like payment integrations, eligibility rules, reconciliation, risk requirements and platform architecture.

I also have a fairly analytical foundation through my Master of Management Analytics, so I'm comfortable getting into the data and challenging whether a metric actually represents a better customer or business outcome.

And I like being hands-on. I'll go from discussing an investment decision with leadership to working with engineering on a technical trade-off or building a small prototype myself.

I wouldn't claim to be the deepest specialist in every area of banking, but I think that combination of commercial thinking, technical fluency and execution is valuable for a role that needs to connect multiple product domains.

---

### 15. What should happen when a customer initiates a transfer but the payment fails?

<a id="simplii-from-93a2100c-050b-4990-9340-00412fb9b507-what-shoul"></a>

- **Import key:** `simplii-from-93a2100c-050b-4990-9340-00412fb9b507`
- **Library ID:** `c83572e1-2ab9-4164-8381-5a7c48463ed1`
- **Experience:** Career & Motivation
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

The first thing I care about is making sure the customer doesn't end up with an incorrect balance or a duplicate payment.

I'd want the payment to have a clear lifecycle, with states that distinguish a request being received, processing, completed or failed. In some cases, we'd also need to handle reversals or other exceptions.

If the service times out, I wouldn't immediately assume the payment failed. The underlying provider could have accepted the request even if our application didn't receive the response.

That's where idempotency, status checks and reconciliation become important.

From the customer side, I'd avoid showing a definitive failure or success until we actually know the outcome. We'd need clear messaging about what happened, whether any action is required and when the customer can expect an update.

Operationally, we'd want monitoring for stuck transactions, a process for investigating exceptions and appropriate escalation paths.

I'd measure payment completion rates, unresolved exceptions, time to resolution and customer contacts.

The main principle is that money movement needs to be correct before it needs to be clever. A confusing transfer status can damage trust very quickly.

---

### 16. What would you actually deliver in your first 30 days?

<a id="simplii-from-08bed145-68a4-4f1f-a500-1287247345bc-what-would"></a>

- **Import key:** `simplii-from-08bed145-68a4-4f1f-a500-1287247345bc`
- **Library ID:** `6562c0c7-8336-4806-b7c4-c795815723d3`
- **Experience:** Career & Product Experience
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I wouldn't promise a major launch before understanding the banking dependencies, but I would aim to deliver something tangible.

By day 30, I'd want a shared map of the highest-value customer journeys, their owners and their biggest friction points. That would come from looking at the funnel, support reasons, payment exceptions and talking directly with the teams that operate the product.

I'd also propose a first measurement baseline: funded-account rate, recurring deposit behaviour, successful money movement and the most important reliability guardrails. If we discovered a contained issue we could safely fix quickly, I'd pursue it. The deliverable is shared clarity and a prioritized decision, not just a stack of introductory meetings.

---

### 17. What would you do in your first 90 days?

<a id="simplii-from-d47c60d3-510e-4373-abf0-0749fcc41ebc-what-would"></a>

- **Import key:** `simplii-from-d47c60d3-510e-4373-abf0-0749fcc41ebc`
- **Library ID:** `3198afb8-e52a-457e-8b92-2e8d68f495a3`
- **Experience:** Career & Motivation
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

I'd approach the first 90 days in three parts.

Initially, I'd spend time understanding the product and the people behind it. I'd want to meet the leads across Everyday Banking, Money Movement, Cards, Risk, Operations, Design and Engineering, and understand how ownership is divided.

I'd also want to use the product, review the existing roadmap and understand the current customer lifecycle and performance metrics.

In the next phase, I'd focus on identifying the biggest opportunity or bottleneck. I'd look at customer research, analytics, support themes and operational data to understand where the experience is falling short.

By the end of 90 days, I'd want to have a clear view of the primary-account growth opportunity, an agreed measurement framework, and a prioritized set of initiatives with the team.

I wouldn't come in promising to completely change the roadmap in my first month. I'd want to earn enough context to know what deserves changing.

But I also wouldn't spend three months only observing. I'd look for a contained improvement or experiment that could deliver useful learning early.

---

### 18. What's the strongest reason to hire you for this Simplii role?

<a id="simplii-from-de31db47-3aea-4d26-be40-e0fa92423dd1-what-s-the"></a>

- **Import key:** `simplii-from-de31db47-3aea-4d26-be40-e0fa92423dd1`
- **Library ID:** `48a54a94-f34a-43e7-a0c2-3253f7086dd1`
- **Experience:** Career & Product Experience
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

I think the strongest argument is that I can make the product decision and stay with the detail needed to deliver it. At RBC, the choice wasn't just to add a cashback withdrawal button. We had to make a non-RBC payout journey work through an existing enterprise payment capability, with clear eligibility, transaction status and exception handling. That required customer judgment as well as alignment across Risk, engineering and Financial Operations.



I've also worked closer to growth—at HBC, improving financial-product application completion—and to zero-to-one strategy at Arc'teryx. So I can zoom out when the team needs a direction, but I'm equally comfortable debating whether a story is ready or whether a failure case is actually covered. For a squad-embedded PM, I think that balance is important.

---

### 19. What's your biggest learning curve if you join Simplii?

<a id="simplii-from-a5e5c740-637c-4b42-8642-e889de82dcec-what-s-you"></a>

- **Import key:** `simplii-from-a5e5c740-637c-4b42-8642-e889de82dcec`
- **Library ID:** `be541cf3-a588-41e0-9bc5-376c10944401`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd need to learn the details of the product area, the teams who own the underlying banking systems, and Simplii's particular controls and operating processes. I have experience with payments and financial products, but I haven't owned a chequing ledger.

I'd start with the customer journeys and the critical dependencies, then sit with engineering, Risk, operations and service teams to understand the failure modes they see regularly. I'd also get into the data so I know what customers actually do rather than what we assume they do.

I think being explicit about that learning curve is more useful than pretending adjacent experience makes everything familiar.

---

### 20. Why have you moved between several industries and employers?

<a id="simplii-from-66530581-f599-40f5-8f97-5bf255953c87-why-have-y"></a>

- **Import key:** `simplii-from-66530581-f599-40f5-8f97-5bf255953c87`
- **Library ID:** `ce0e323c-a04a-41e5-807a-9e1af80b0d08`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

The common thread hasn't really been the industry label. It's been building consumer products that connect acquisition, engagement and the platforms underneath.

At Aeroplan, that meant credit-card acquisition with bank partners. At HBC, it meant cardholder growth and commercial performance. At RBC, I worked on expanding Avion to non-bank customers and enabling payouts. Arc'teryx broadened that into a zero-to-one membership platform and substantial technology investment.

Each role let me work on a different part of the customer and business problem. At this stage, I'm looking to bring those experiences together in one place, and everyday banking is a particularly good fit.

---

### 21. Why move into everyday banking from rewards and loyalty?

<a id="simplii-from-c45ce30e-6de2-4164-93bf-8b67902caae0-why-move-i"></a>

- **Import key:** `simplii-from-c45ce30e-6de2-4164-93bf-8b67902caae0`
- **Library ID:** `7e86158f-775e-47ea-ba03-36e30df4835c`
- **Experience:** Career & Motivation
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

I actually see everyday banking as a natural progression from the work I've been doing.

At Aeroplan, I focused on getting customers to adopt financial products. At HBC, the challenge was what happened after they became cardholders, particularly how to keep them engaged and increase the value of the relationship. At RBC, I worked on payments and the underlying platforms needed to support those experiences.

Everyday banking brings those challenges together, but with a higher bar for trust and reliability.

You're dealing with money people rely on for their rent, groceries and everyday expenses. If the product isn't dependable, no amount of clever engagement features is going to make someone move their primary account.

That combination of customer behaviour, commercial outcomes and technical complexity is what appeals to me.

---

### 22. Why Simplii Financial, and why this Senior Product Manager role?

<a id="simplii-from-c1d638b6-1858-487d-9ac2-5b6cc5327eb8-why-simpli"></a>

- **Import key:** `simplii-from-c1d638b6-1858-487d-9ac2-5b6cc5327eb8`
- **Library ID:** `4a553cd2-d27b-4782-ae4f-26e38f8d5fa1`
- **Experience:** Career & Motivation
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

Two things appeal to me. The first is the nature of the product. Simplii already has a compelling everyday-banking proposition—no monthly chequing fee, access to CIBC ATMs, and the core ways customers move money. But an account being easy to open isn't the same as becoming an account someone trusts for payroll, bills and regular spending. That transition is a really interesting product problem.



The second is the role itself. The description is clear that the PM owns discovery, prioritization and the details of delivery, including user stories and acceptance criteria. I like operating at both levels. I've worked on strategic investment decisions, but I also enjoy getting into the edge cases that determine whether a financial journey works. RBC gives me a good foundation in money movement, and HBC and Aeroplan give me the acquisition and engagement lens. It's a relevant combination without pretending I've already owned every part of deposit banking.

---

### 23. You haven't owned a traditional chequing account. Why are you qualified for Simplii?

<a id="simplii-from-a292f433-831a-440c-a196-dbf8c38fbddd-you-haven-"></a>

- **Import key:** `simplii-from-a292f433-831a-440c-a196-dbf8c38fbddd`
- **Library ID:** `21fb87b8-3c43-406b-b2de-7667f970c273`
- **Experience:** Career & Motivation
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

That's true. I haven't owned a chequing ledger, and there are banking-specific details I'd need to learn. I wouldn't blur that distinction.



The relevant experience I do have is designing customer-facing financial journeys that depend on systems outside the product squad. At RBC, our cashback withdrawal experience needed the right eligibility rules, payment status, controls and reconciliation. At HBC, I worked on financial-product acquisition and cardholder engagement, where approval and ongoing behaviour mattered more than a click on an application.



So I'd come in knowing how to reason through regulated journeys and complex dependencies, while learning the specific deposit, posting and servicing processes with the domain experts. I think that's a more credible starting point than claiming the products are identical.

---

## My Product Experience

<a id="my-product-experience"></a>

### 1. Could the HBC incentives have increased spending while destroying profitability?

<a id="simplii-from-cee35d92-74ae-4d9b-a713-3594c8276e17-could-the-"></a>

- **Import key:** `simplii-from-cee35d92-74ae-4d9b-a713-3594c8276e17`
- **Library ID:** `d5d2e272-3d1d-4752-96b3-77291b986ab7`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

Absolutely. A lift in card spend by itself is not the same as value creation. We'd want to distinguish incremental spend from spend that would have happened anyway, then subtract rewards or incentive expense and consider the economics of the portfolio.

I'd also worry about customers timing purchases to earn a reward without changing longer-term habits. The right evaluation looks at margin or contribution, repeat behaviour and the duration of the effect, ideally against a comparison group.

That's why I describe the 10% LTV change as modeled and the spending effect separately. Neither should be taken as proof that every individual promotion was profitable.

---

### 2. Did Quests reach six million active credit cardholders?

<a id="simplii-from-92a7cf55-18dc-4d94-93d7-db3303028b9b-did-quests"></a>

- **Import key:** `simplii-from-92a7cf55-18dc-4d94-93d7-db3303028b9b`
- **Library ID:** `09eab4ba-402f-468b-9019-f5ceb07e3c36`
- **Experience:** HBC — Quests
- **Tier:** P2
- **Evidence:** resume_supported

**Answer (spoken):**

No. The six-million-plus number refers to eligible mobile users within the broader HBC digital ecosystem, not six million Mastercard cardholders. The cardholder portfolio was roughly 500,000-plus. Quests was a rules-based engagement capability that could surface targeted promotional journeys to eligible users, including card-related offers. I would keep audience scale separate from the incremental spend result and from the credit portfolio size. Those are three different numbers measuring different parts of the programme.

**Embedded follow-ups (4):**

- **Q:** 6M users

No. The six-million-plus number refers to eligible mobile users within the broader HBC digital ecosystem, not six million Mastercard cardholders. The cardholder portfolio was roughly 500,000-plus. Quests was a rules-based engagement capability that could surface targeted promotional journeys to eligible users, including card-related offers. I would keep audience scale separate from the incremental spend result and from the credit portfolio size. Those are three different numbers measuring different parts of the programme.

- **Q:** Quests audience

No. The six-million-plus number refers to eligible mobile users within the broader HBC digital ecosystem, not six million Mastercard cardholders. The cardholder portfolio was roughly 500,000-plus. Quests was a rules-based engagement capability that could surface targeted promotional journeys to eligible users, including card-related offers. I would keep audience scale separate from the incremental spend result and from the credit portfolio size. Those are three different numbers measuring different parts of the programme.

- **Q:** Cardholder versus mobile user

No. The six-million-plus number refers to eligible mobile users within the broader HBC digital ecosystem, not six million Mastercard cardholders. The cardholder portfolio was roughly 500,000-plus. Quests was a rules-based engagement capability that could surface targeted promotional journeys to eligible users, including card-related offers. I would keep audience scale separate from the incremental spend result and from the credit portfolio size. Those are three different numbers measuring different parts of the programme.

- **Q:** Scope challenge

No. The six-million-plus number refers to eligible mobile users within the broader HBC digital ecosystem, not six million Mastercard cardholders. The cardholder portfolio was roughly 500,000-plus. Quests was a rules-based engagement capability that could surface targeted promotional journeys to eligible users, including card-related offers. I would keep audience scale separate from the incremental spend result and from the credit portfolio size. Those are three different numbers measuring different parts of the programme.

---

### 3. Did you actually run randomized holdouts on the HBC Mastercard programme?

<a id="simplii-from-af5bd3a4-1b6f-4f1c-a319-15475be31b5d-did-you-ac"></a>

- **Import key:** `simplii-from-af5bd3a4-1b6f-4f1c-a319-15475be31b5d`
- **Library ID:** `e4b5a839-0060-42e5-a472-022192d86fec`
- **Experience:** HBC — Cardholder Portfolio & P&L
- **Tier:** P2
- **Evidence:** resume_supported

**Answer (spoken):**

Yes, for the lifecycle incentive work. We used a randomized holdout within an eligible cardholder population so we could compare customers receiving targeted incentives with customers who did not receive the new treatment during the same period.

We kept the assignment groups distinct, compared active-cardholder rates and spending over a defined observation window, and examined incentive costs alongside the spending lift. The reported improvement was four percentage points in active-cardholder rate and five percent in spend per active cardholder versus the holdout.

For the broader 500,000-plus portfolio, I wouldn't imply every cardholder was in that experiment. The test covered the eligible audience; the portfolio figure describes the business scope. And the modeled 10% LTV improvement was a forecast using observed behaviour and commercial assumptions, not ten percent more lifetime profit already realized.

I'd also distinguish this lifecycle experiment from the separate credit-card application work with Neo. They were different interventions with different audiences, metrics and ownership boundaries.

**Embedded follow-ups (4):**

- **Q:** HBC holdout

Yes, for the lifecycle incentive work. We used a randomized holdout within an eligible cardholder population so we could compare customers receiving targeted incentives with customers who did not receive the new treatment during the same period.

We kept the assignment groups distinct, compared active-cardholder rates and spending over a defined observation window, and examined incentive costs alongside the spending lift. The reported improvement was four percentage points in active-cardholder rate and five percent in spend per active cardholder versus the holdout.

For the broader 500,000-plus portfolio, I wouldn't imply every cardholder was in that experiment. The test covered the eligible audience; the portfolio figure describes the business scope. And the modeled 10% LTV improvement was a forecast using observed behaviour and commercial assumptions, not ten percent more lifetime profit already realized.

I'd also distinguish this lifecycle experiment from the separate credit-card application work with Neo. They were different interventions with different audiences, metrics and ownership boundaries.

- **Q:** Controlled experiment evidence

Yes, for the lifecycle incentive work. We used a randomized holdout within an eligible cardholder population so we could compare customers receiving targeted incentives with customers who did not receive the new treatment during the same period.

We kept the assignment groups distinct, compared active-cardholder rates and spending over a defined observation window, and examined incentive costs alongside the spending lift. The reported improvement was four percentage points in active-cardholder rate and five percent in spend per active cardholder versus the holdout.

For the broader 500,000-plus portfolio, I wouldn't imply every cardholder was in that experiment. The test covered the eligible audience; the portfolio figure describes the business scope. And the modeled 10% LTV improvement was a forecast using observed behaviour and commercial assumptions, not ten percent more lifetime profit already realized.

I'd also distinguish this lifecycle experiment from the separate credit-card application work with Neo. They were different interventions with different audiences, metrics and ownership boundaries.

- **Q:** RCT

Yes, for the lifecycle incentive work. We used a randomized holdout within an eligible cardholder population so we could compare customers receiving targeted incentives with customers who did not receive the new treatment during the same period.

We kept the assignment groups distinct, compared active-cardholder rates and spending over a defined observation window, and examined incentive costs alongside the spending lift. The reported improvement was four percentage points in active-cardholder rate and five percent in spend per active cardholder versus the holdout.

For the broader 500,000-plus portfolio, I wouldn't imply every cardholder was in that experiment. The test covered the eligible audience; the portfolio figure describes the business scope. And the modeled 10% LTV improvement was a forecast using observed behaviour and commercial assumptions, not ten percent more lifetime profit already realized.

I'd also distinguish this lifecycle experiment from the separate credit-card application work with Neo. They were different interventions with different audiences, metrics and ownership boundaries.

- **Q:** Did you A/B test incentives?

Yes, for the lifecycle incentive work. We used a randomized holdout within an eligible cardholder population so we could compare customers receiving targeted incentives with customers who did not receive the new treatment during the same period.

We kept the assignment groups distinct, compared active-cardholder rates and spending over a defined observation window, and examined incentive costs alongside the spending lift. The reported improvement was four percentage points in active-cardholder rate and five percent in spend per active cardholder versus the holdout.

For the broader 500,000-plus portfolio, I wouldn't imply every cardholder was in that experiment. The test covered the eligible audience; the portfolio figure describes the business scope. And the modeled 10% LTV improvement was a forecast using observed behaviour and commercial assumptions, not ten percent more lifetime profit already realized.

I'd also distinguish this lifecycle experiment from the separate credit-card application work with Neo. They were different interventions with different audiences, metrics and ownership boundaries.

---

### 4. Did your UX redesign cause approvals in under three minutes?

<a id="simplii-from-7aafc468-3bf5-48c2-886e-5ca34ce4f660-did-your-u"></a>

- **Import key:** `simplii-from-7aafc468-3bf5-48c2-886e-5ca34ce4f660`
- **Library ID:** `b816ab21-56a8-426d-a4e1-e9bb822f8280`
- **Experience:** HBC — Mastercard Acquisition
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

No, I wouldn't attribute the underwriting speed to my UX redesign. The digital application journey and the lending decisioning capability are related but distinct. My contribution was to improve how customers completed the application and how the experience came together with Neo Financial. The partner's credit-decisioning infrastructure supported decisions in under three minutes. The directly relevant product outcome from the journey work was the 15% increase in application completions. I think drawing that boundary clearly is important, particularly in financial services where multiple teams contribute to the customer experience.

**Embedded follow-ups (4):**

- **Q:** Neo decision speed

No, I wouldn't attribute the underwriting speed to my UX redesign. The digital application journey and the lending decisioning capability are related but distinct. My contribution was to improve how customers completed the application and how the experience came together with Neo Financial. The partner's credit-decisioning infrastructure supported decisions in under three minutes. The directly relevant product outcome from the journey work was the 15% increase in application completions. I think drawing that boundary clearly is important, particularly in financial services where multiple teams contribute to the customer experience.

- **Q:** Underwriting responsibility

No, I wouldn't attribute the underwriting speed to my UX redesign. The digital application journey and the lending decisioning capability are related but distinct. My contribution was to improve how customers completed the application and how the experience came together with Neo Financial. The partner's credit-decisioning infrastructure supported decisions in under three minutes. The directly relevant product outcome from the journey work was the 15% increase in application completions. I think drawing that boundary clearly is important, particularly in financial services where multiple teams contribute to the customer experience.

- **Q:** Under three minutes

No, I wouldn't attribute the underwriting speed to my UX redesign. The digital application journey and the lending decisioning capability are related but distinct. My contribution was to improve how customers completed the application and how the experience came together with Neo Financial. The partner's credit-decisioning infrastructure supported decisions in under three minutes. The directly relevant product outcome from the journey work was the 15% increase in application completions. I think drawing that boundary clearly is important, particularly in financial services where multiple teams contribute to the customer experience.

- **Q:** Confounded results

No, I wouldn't attribute the underwriting speed to my UX redesign. The digital application journey and the lending decisioning capability are related but distinct. My contribution was to improve how customers completed the application and how the experience came together with Neo Financial. The partner's credit-decisioning infrastructure supported decisions in under three minutes. The directly relevant product outcome from the journey work was the 15% increase in application completions. I think drawing that boundary clearly is important, particularly in financial services where multiple teams contribute to the customer experience.

---

### 5. Give me a concrete example of prioritizing across the Avion roadmap.

<a id="simplii-john-experience-depth-v1-rbc-roadmap-tradeoff-give-m"></a>

- **Import key:** `simplii-john-experience-depth-v1-rbc-roadmap-tradeoff`
- **Library ID:** `ad7589e9-26dd-4d7e-b347-694e9dc12b19`
- **Experience:** RBC — Core Web, Mobile & Travel
- **Tier:** P1
- **Evidence:** illustrative_scenario

**Answer (spoken):**

One example is the choice between helping members earn more cashback and fixing their ability to withdraw what they'd already earned.

As Avion expanded to non-RBC customers, offer discovery and shopping engagement were attractive growth opportunities. But for a member who could see a cashback balance and had no practical way to receive it, more earning opportunities didn't resolve the core problem.

I prioritized the withdrawal capability because it completed an existing promise. The affected audience was identifiable, and there was an enterprise payments service we could adapt rather than build from scratch.

That didn't make discovery unimportant. It established an order: make the existing value usable, then improve the ways people earn more. The trade-off was grounded in a broken customer journey and a feasible delivery path.

---

### 6. How can you claim 427% acquisition growth when you only improved conversion by 40%?

<a id="simplii-from-09b7fdec-df53-4a0a-a6af-592fe54cbe57-how-can-yo"></a>

- **Import key:** `simplii-from-09b7fdec-df53-4a0a-a6af-592fe54cbe57`
- **Library ID:** `5cb6995c-39fa-4cb2-8eba-028ea38ccca0`
- **Experience:** Aeroplan — Co-brand Card Acquisition
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I wouldn't claim the conversion improvement alone produced the entire 427% year-over-year increase. The 40% application conversion lift was a product-funnel result associated with the work we did. The 427% was a broader cardholder acquisition outcome, influenced by the programme, distribution, commercial partnerships and marketing as well as the product experience. I use 'contributed to' deliberately. My direct ownership was the digital acquisition experience and improving the funnel, not every lever in the acquisition business. I'd be very comfortable separating those two levels of impact.

**Embedded follow-ups (4):**

- **Q:** Aeroplan attribution

I wouldn't claim the conversion improvement alone produced the entire 427% year-over-year increase. The 40% application conversion lift was a product-funnel result associated with the work we did. The 427% was a broader cardholder acquisition outcome, influenced by the programme, distribution, commercial partnerships and marketing as well as the product experience. I use 'contributed to' deliberately. My direct ownership was the digital acquisition experience and improving the funnel, not every lever in the acquisition business. I'd be very comfortable separating those two levels of impact.

- **Q:** 427% versus 40%

I wouldn't claim the conversion improvement alone produced the entire 427% year-over-year increase. The 40% application conversion lift was a product-funnel result associated with the work we did. The 427% was a broader cardholder acquisition outcome, influenced by the programme, distribution, commercial partnerships and marketing as well as the product experience. I use 'contributed to' deliberately. My direct ownership was the digital acquisition experience and improving the funnel, not every lever in the acquisition business. I'd be very comfortable separating those two levels of impact.

- **Q:** Corporate growth

I wouldn't claim the conversion improvement alone produced the entire 427% year-over-year increase. The 40% application conversion lift was a product-funnel result associated with the work we did. The 427% was a broader cardholder acquisition outcome, influenced by the programme, distribution, commercial partnerships and marketing as well as the product experience. I use 'contributed to' deliberately. My direct ownership was the digital acquisition experience and improving the funnel, not every lever in the acquisition business. I'd be very comfortable separating those two levels of impact.

- **Q:** Did product cause growth?

I wouldn't claim the conversion improvement alone produced the entire 427% year-over-year increase. The 40% application conversion lift was a product-funnel result associated with the work we did. The 427% was a broader cardholder acquisition outcome, influenced by the programme, distribution, commercial partnerships and marketing as well as the product experience. I use 'contributed to' deliberately. My direct ownership was the digital acquisition experience and improving the funnel, not every lever in the acquisition business. I'd be very comfortable separating those two levels of impact.

---

### 7. How did you align TD, CIBC and Amex when the banks had different priorities?

<a id="simplii-from-233f8d5d-fa5a-45a7-a301-39c4e3743edb-how-did-yo"></a>

- **Import key:** `simplii-from-233f8d5d-fa5a-45a7-a301-39c4e3743edb`
- **Library ID:** `6988b2f9-9c18-4d7f-960d-e54cb23ff995`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd start from the shared customer journey and be explicit about where issuer priorities diverged. Different banks could have different offers, eligibility rules, application experiences or operational constraints, so one blanket implementation wasn't necessarily sensible.

The product role is to establish what the customer needs to understand before the handoff, agree on the data and measurement boundaries, and make trade-offs visible to the partners.

My Aeroplan work involved co-brand acquisition across these issuer relationships. I wouldn't imply I controlled their underwriting or internal roadmaps. What I can speak to is using product and analytics to improve the acquisition journeys we influenced and coordinating the bank-dependent pieces.

---

### 8. How did you approach customer activation and retention for the HBC Mastercard?

<a id="simplii-from-7eb5e7ae-c611-4966-8279-0fcc8d80fc3c-how-did-yo"></a>

- **Import key:** `simplii-from-7eb5e7ae-c611-4966-8279-0fcc8d80fc3c`
- **Library ID:** `1ac8bf9a-1a3a-461a-9d15-91d20e550e23`
- **Experience:** HBC — Post-Approval Activation
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

The insight was that approval isn't the finish line. A new cardholder still has to make a first purchase, then find enough ongoing value to keep using the card after any welcome incentive runs out.

At HBC I used lifecycle and behavioural analysis to distinguish first-use activation, repeat usage and longer-term retention. We designed targeted incentives with the economics in mind, rather than treating every increase in activity as evidence of durable value.

For me, that's relevant to everyday banking because the same distinction applies. Opening a chequing account, receiving a first deposit and making it part of someone's routine are three different outcomes. Each needs its own diagnosis and measure of success.

---

### 9. How did you assess whether the membership direction was working before launch?

<a id="simplii-john-experience-depth-v1-arc-validation-depth-how-di"></a>

- **Import key:** `simplii-john-experience-depth-v1-arc-validation-depth`
- **Library ID:** `673cb19c-02ec-471a-9f92-95cc2cb99cf5`
- **Experience:** Arc'teryx — Membership Platform
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I would separate three questions: whether customers understand the proposition, whether we can deliver the benefits, and whether the program changes behavior.

Before launch, research and prototypes can help with the first question. Can someone identify a useful benefit, understand eligibility and find the next step? An assisted pilot can test the second by putting a real request through the service process.

Neither proves long-term retention. That requires observing successful benefit use and later customer behavior after launch, with a credible comparison where possible.

For the phase I led, the concrete milestones were the funded direction, the defined journey and the integration approach. I wouldn't turn those into an adoption result. My measurement plan would follow the customer from enrollment through successful benefit use and the operational cost of fulfilling it.

---

### 10. How did you balance membership development with the existing CRM roadmap?

<a id="simplii-john-experience-depth-v1-arc-remit-team-how-did-you-"></a>

- **Import key:** `simplii-john-experience-depth-v1-arc-remit-team`
- **Library ID:** `d2b31a1c-3cc4-4bd9-aac4-87727def647c`
- **Experience:** Arc'teryx — Employer Overview
- **Tier:** P1
- **Evidence:** illustrative_scenario

**Answer (spoken):**

I treated them as different kinds of commitments competing for some of the same attention and dependencies.

CRM had live customer journeys to protect. Membership had discovery, investment and integration decisions that could determine months of future work. Putting them in one undifferentiated feature list would make it too easy for whichever stakeholder was loudest to win.

I separated operational commitments from discretionary improvements, then looked at the decisions that would unblock the most important membership work. Where the teams shared a dependency, I made the sequencing explicit rather than assume both plans could proceed independently.

My job was to keep the customer consequences and delivery constraints visible across both roadmaps. That meant protecting reliability while still creating enough space to make the larger platform decisions.

---

### 11. How did you decide what to include in the smaller Sperro SV release?

<a id="simplii-from-7c4b9e12-3a6f-4d8e-9b01-5e2c8f7a1d30-how-did-yo"></a>

- **Import key:** `simplii-from-7c4b9e12-3a6f-4d8e-9b01-5e2c8f7a1d30`
- **Library ID:** `d0b3c4ba-600e-4b38-8eee-5476baf6e909`
- **Experience:** Career & Product Experience
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

I think the key was separating the benefits customers would actually receive from the infrastructure we eventually wanted to deliver them through.

The broader membership roadmap included things like enrollment, a member dashboard, gear registration, events and different ways for customers to engage with the brand.

But for Sperro SV, we didn't need to launch that entire experience to make the jacket's benefits meaningful.

So I looked at what was essential for that specific customer journey: what benefits were we promising, how would customers understand and access them, and could the teams responsible actually fulfil those promises?

That's where we focused.

We also had to be careful about dependencies. For example, the digital product passport registration was being delivered by another team, so we needed to coordinate around that rather than pull it into our scope.

The principle was to keep the customer promise intact while reducing the amount of new technology and cross-team coordination required for the launch.

I think that's an important distinction. A smaller MVP shouldn't just mean fewer features. It should mean a more focused experience that still solves the problem properly.

**Embedded follow-ups (6):**

- **Q:** How did you prioritize the Sperro SV launch?

I think the key was separating the benefits customers would actually receive from the infrastructure we eventually wanted to deliver them through.

The broader membership roadmap included things like enrollment, a member dashboard, gear registration, events and different ways for customers to engage with the brand.

But for Sperro SV, we didn't need to launch that entire experience to make the jacket's benefits meaningful.

So I looked at what was essential for that specific customer journey: what benefits were we promising, how would customers understand and access them, and could the teams responsible actually fulfil those promises?

That's where we focused.

We also had to be careful about dependencies. For example, the digital product passport registration was being delivered by another team, so we needed to coordinate around that rather than pull it into our scope.

The principle was to keep the customer promise intact while reducing the amount of new technology and cross-team coordination required for the launch.

I think that's an important distinction. A smaller MVP shouldn't just mean fewer features. It should mean a more focused experience that still solves the problem properly.

- **Q:** What did you cut from the MVP?

I think the key was separating the benefits customers would actually receive from the infrastructure we eventually wanted to deliver them through.

The broader membership roadmap included things like enrollment, a member dashboard, gear registration, events and different ways for customers to engage with the brand.

But for Sperro SV, we didn't need to launch that entire experience to make the jacket's benefits meaningful.

So I looked at what was essential for that specific customer journey: what benefits were we promising, how would customers understand and access them, and could the teams responsible actually fulfil those promises?

That's where we focused.

We also had to be careful about dependencies. For example, the digital product passport registration was being delivered by another team, so we needed to coordinate around that rather than pull it into our scope.

The principle was to keep the customer promise intact while reducing the amount of new technology and cross-team coordination required for the launch.

I think that's an important distinction. A smaller MVP shouldn't just mean fewer features. It should mean a more focused experience that still solves the problem properly.

- **Q:** Why didn't you wait for the full membership platform?

I think the key was separating the benefits customers would actually receive from the infrastructure we eventually wanted to deliver them through.

The broader membership roadmap included things like enrollment, a member dashboard, gear registration, events and different ways for customers to engage with the brand.

But for Sperro SV, we didn't need to launch that entire experience to make the jacket's benefits meaningful.

So I looked at what was essential for that specific customer journey: what benefits were we promising, how would customers understand and access them, and could the teams responsible actually fulfil those promises?

That's where we focused.

We also had to be careful about dependencies. For example, the digital product passport registration was being delivered by another team, so we needed to coordinate around that rather than pull it into our scope.

The principle was to keep the customer promise intact while reducing the amount of new technology and cross-team coordination required for the launch.

I think that's an important distinction. A smaller MVP shouldn't just mean fewer features. It should mean a more focused experience that still solves the problem properly.

- **Q:** How did you decide which benefits were essential?

I think the key was separating the benefits customers would actually receive from the infrastructure we eventually wanted to deliver them through.

The broader membership roadmap included things like enrollment, a member dashboard, gear registration, events and different ways for customers to engage with the brand.

But for Sperro SV, we didn't need to launch that entire experience to make the jacket's benefits meaningful.

So I looked at what was essential for that specific customer journey: what benefits were we promising, how would customers understand and access them, and could the teams responsible actually fulfil those promises?

That's where we focused.

We also had to be careful about dependencies. For example, the digital product passport registration was being delivered by another team, so we needed to coordinate around that rather than pull it into our scope.

The principle was to keep the customer promise intact while reducing the amount of new technology and cross-team coordination required for the launch.

I think that's an important distinction. A smaller MVP shouldn't just mean fewer features. It should mean a more focused experience that still solves the problem properly.

- **Q:** What trade-offs did you make for the circularity launch?

I think the key was separating the benefits customers would actually receive from the infrastructure we eventually wanted to deliver them through.

The broader membership roadmap included things like enrollment, a member dashboard, gear registration, events and different ways for customers to engage with the brand.

But for Sperro SV, we didn't need to launch that entire experience to make the jacket's benefits meaningful.

So I looked at what was essential for that specific customer journey: what benefits were we promising, how would customers understand and access them, and could the teams responsible actually fulfil those promises?

That's where we focused.

We also had to be careful about dependencies. For example, the digital product passport registration was being delivered by another team, so we needed to coordinate around that rather than pull it into our scope.

The principle was to keep the customer promise intact while reducing the amount of new technology and cross-team coordination required for the launch.

I think that's an important distinction. A smaller MVP shouldn't just mean fewer features. It should mean a more focused experience that still solves the problem properly.

- **Q:** How did you manage dependencies across teams?

I think the key was separating the benefits customers would actually receive from the infrastructure we eventually wanted to deliver them through.

The broader membership roadmap included things like enrollment, a member dashboard, gear registration, events and different ways for customers to engage with the brand.

But for Sperro SV, we didn't need to launch that entire experience to make the jacket's benefits meaningful.

So I looked at what was essential for that specific customer journey: what benefits were we promising, how would customers understand and access them, and could the teams responsible actually fulfil those promises?

That's where we focused.

We also had to be careful about dependencies. For example, the digital product passport registration was being delivered by another team, so we needed to coordinate around that rather than pull it into our scope.

The principle was to keep the customer promise intact while reducing the amount of new technology and cross-team coordination required for the launch.

I think that's an important distinction. A smaller MVP shouldn't just mean fewer features. It should mean a more focused experience that still solves the problem properly.

---

### 12. How did you decide which customers should receive a Quest?

<a id="simplii-john-experience-depth-v1-hbc-quests-targeting-how-di"></a>

- **Import key:** `simplii-john-experience-depth-v1-hbc-quests-targeting`
- **Library ID:** `a9613925-b4a0-454b-ac59-4f60137410c2`
- **Experience:** HBC — Quests
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I would start with the behavior we wanted to change, then decide who had a plausible reason to change it.

For example, a customer who is already using the card frequently may complete a spending challenge without doing anything differently. A customer who made a first purchase but hasn't returned could have more room for an incremental response.

That doesn't mean inactive customers are automatically the best target. Some may have little interest in the proposition, and a large reward could simply buy one temporary transaction.

I'd compare the expected response, incentive cost and potential for repeat behavior, then test the treatment against a suitable comparison group. The target is the customer whose behavior we can usefully influence at sensible economics, not the person most likely to collect the reward.

---

### 13. How did you distinguish activation from 90-day repeat-spend retention?

<a id="simplii-john-experience-depth-v1-hbc-retention-definition-ho"></a>

- **Import key:** `simplii-john-experience-depth-v1-hbc-retention-definition`
- **Library ID:** `1c0df6a0-6a33-4f43-a068-0fb8aab48071`
- **Experience:** HBC — Post-Approval Activation
- **Tier:** P0
- **Evidence:** unverified_detail

**Answer (spoken):**

Activation asks whether the customer starts using the card. Repeat-spend retention asks whether they continue using it later. The reported improvements were eight percentage points in 30-day activation and six points in 90-day repeat-spend retention.

I would examine persistence among customers who activated, while also tracking repeat spending across the original approval cohort. Those views answer different questions. The first shows whether initial use becomes repeated use; the second shows the overall effect of the lifecycle journey.

That distinction matters if an intervention changes who activates. A larger, less committed activation cohort can make later retention look weaker even while more approved customers are using the product overall.

For the historical six-point figure, I would use the original report's denominator and exact repeat-purchase window. I would not silently switch those definitions to produce a better-looking result.

---

### 14. How did you drive credit-card acquisition growth at Aeroplan?

<a id="simplii-from-e8d13d9e-a98d-4dbc-a596-a178557963b0-how-did-yo"></a>

- **Import key:** `simplii-from-e8d13d9e-a98d-4dbc-a596-a178557963b0`
- **Library ID:** `2ac953ed-bdb3-4ef9-bb77-84f5c12c762a`
- **Experience:** Aeroplan — Co-brand Card Acquisition
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

At Aeroplan, we were working with TD, CIBC and American Express on digital co-brand acquisition. We already had an engaged membership base, but an Aeroplan member doesn't automatically become a card applicant.

I focused on the digital funnel: where members encountered offers, what they needed to understand before clicking through and where the experience created drop-off. Through behavioural analysis and experimentation, we improved funnel conversion by about 40%. Broader card acquisition grew 427% year over year, but that reflected commercial and marketing factors as well. I wouldn't attribute all of it to one product change.

The lesson I took away was to understand the end-to-end journey even when a partner owns part of it. That's valuable in banking, where the screen a customer uses is only one piece of a larger process.

---

### 15. How did you help secure $5.2 million in funding for Arc'teryx membership?

<a id="simplii-from-439ccf45-857e-431f-ab0e-1312d6998f02-how-did-yo"></a>

- **Import key:** `simplii-from-439ccf45-857e-431f-ab0e-1312d6998f02`
- **Library ID:** `c1a461c3-a61b-480d-9fb4-6c77d31416da`
- **Experience:** Arc'teryx — Membership Platform
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

The $5.2 million was approved capital for a membership initiative, not revenue or proof that the full product had launched.

We started with a broad ambition: deepen the relationship with customers after the initial purchase through care, repair, community and product ownership experiences. My part was helping translate that into a credible first release, technology options, major dependencies and a phased investment case.

We assessed what could be delivered through existing services, what required a membership platform and the tradeoffs between buying a configurable engine and building more internally. I worked with business and technology partners so leadership could see the customer value, delivery approach and risks behind the funding request.

The main product lesson was that investment approval is an important decision milestone, but it isn't an outcome metric. I'd judge the eventual program by meaningful member participation and actual benefits delivered, not the size of the budget.

---

### 16. How did you identify the application problem?

<a id="simplii-from-04f9a779-8058-4470-8817-beccdcbecf1e-how-did-yo"></a>

- **Import key:** `simplii-from-04f9a779-8058-4470-8817-beccdcbecf1e`
- **Library ID:** `ef068144-fcf0-4c59-9c8f-e58f4997ffeb`
- **Experience:** HBC — Mastercard Acquisition
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

We started with step-level application data from Neo and looked at where people stopped progressing. Drop-off was more noticeable on mobile, but the data alone didn't explain why.

In usability sessions, we saw people interrupt the application to look up information or return to shopping. When they came back, they couldn't always find the same application again. Some thought they had to start over.

That gave us a specific hypothesis: the problem wasn't just the length of the form. We were turning an interrupted application into an abandoned one.

I wanted to test that before asking Neo to simplify or remove information that might be necessary for identity verification, eligibility or lending requirements.

**Embedded follow-ups (3):**

- **Q:** How did you know the funnel was broken

We started with step-level application data from Neo and looked at where people stopped progressing. Drop-off was more noticeable on mobile, but the data alone didn't explain why.

In usability sessions, we saw people interrupt the application to look up information or return to shopping. When they came back, they couldn't always find the same application again. Some thought they had to start over.

That gave us a specific hypothesis: the problem wasn't just the length of the form. We were turning an interrupted application into an abandoned one.

I wanted to test that before asking Neo to simplify or remove information that might be necessary for identity verification, eligibility or lending requirements.

- **Q:** What research did you run

We started with step-level application data from Neo and looked at where people stopped progressing. Drop-off was more noticeable on mobile, but the data alone didn't explain why.

In usability sessions, we saw people interrupt the application to look up information or return to shopping. When they came back, they couldn't always find the same application again. Some thought they had to start over.

That gave us a specific hypothesis: the problem wasn't just the length of the form. We were turning an interrupted application into an abandoned one.

I wanted to test that before asking Neo to simplify or remove information that might be necessary for identity verification, eligibility or lending requirements.

- **Q:** Why did you focus on mobile?

We started with step-level application data from Neo and looked at where people stopped progressing. Drop-off was more noticeable on mobile, but the data alone didn't explain why.

In usability sessions, we saw people interrupt the application to look up information or return to shopping. When they came back, they couldn't always find the same application again. Some thought they had to start over.

That gave us a specific hypothesis: the problem wasn't just the length of the form. We were turning an interrupted application into an abandoned one.

I wanted to test that before asking Neo to simplify or remove information that might be necessary for identity verification, eligibility or lending requirements.

---

### 17. How did you identify the customer problem behind RBC cashback withdrawals?

<a id="simplii-john-experience-depth-v1-rbc-discovery-context-how-d"></a>

- **Import key:** `simplii-john-experience-depth-v1-rbc-discovery-context`
- **Library ID:** `c47654ca-a39f-4b17-bb3a-db1d412ce610`
- **Experience:** RBC — Cashback Withdrawals
- **Tier:** P0
- **Evidence:** illustrative_scenario

**Answer (spoken):**

The problem became clear when we looked at the experience of a member who could earn cashback but didn't have an RBC account to receive it.

The value existed in their rewards balance, but the journey wasn't complete for that customer. Support conversations reinforced the same issue: how do I get this money into the bank account I already use?

I would separate the immediate affected audience from the broader opportunity to open Avion to more people. An addressable market is useful context, but the strongest initial case was a specific member with earned value and no practical withdrawal path.

That gave us a focused outcome to pursue: an eligible non-RBC member should be able to receive their cashback reliably, without opening another bank account.

**Embedded follow-ups (1):**

- **Q:** RBC — After a timeout, how do you prevent duplicates and establish payment statu

The first rule is that a timeout is not a declined payment. It means the customer-facing service didn't receive a conclusive response. The instruction may still be processing, and treating that as a failure can create a second payout.

So before launch, I'd want the withdrawal requirement to cover an uncertain outcome explicitly. When the request is initiated, the journey needs a stable reference that can be traced end to end. If we lose the response, we show the customer that the withdrawal is being checked rather than encouraging a new submission.

On the service side, I'd work with the payments owners to confirm how duplicate protection and authoritative status are actually supported. Ideally a retry against the same business request can't move money twice, and there is a reliable way to reconcile the original instruction to its final outcome.

My job is to insist that the contract, customer states, support path and acceptance criteria address that failure mode. The enterprise team decides how the mechanism is implemented, because I don't own their payment architecture.

---

### 18. How did you identify the problem?

<a id="simplii-from-75fd6429-dc9a-4cd3-b996-ce48af985a7b-how-did-yo"></a>

- **Import key:** `simplii-from-75fd6429-dc9a-4cd3-b996-ce48af985a7b`
- **Library ID:** `5fae85d3-7049-43b7-9b39-e21a91bb7b8b`
- **Experience:** Aeroplan — Co-brand Card Acquisition
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

We noticed a gap between members clicking from an Aeroplan card offer and actually starting the bank's application.

The data showed where the journey was losing people, but it didn't tell us whether they were confused, reconsidering the offer or hitting a technical problem.

In usability sessions, people could remember the welcome-points offer but weren't always clear about the annual fee, the spending required to earn the bonus or what the bank application would ask them to do.

That suggested we were getting people interested before helping them make an informed choice. The hypothesis was that clearer information before the handoff would reduce unproductive clicks and improve meaningful application progression.

We still needed an experiment to test that, rather than assuming the research explanation was correct.

**Embedded follow-ups (3):**

- **Q:** What did your analytics show

We noticed a gap between members clicking from an Aeroplan card offer and actually starting the bank's application.

The data showed where the journey was losing people, but it didn't tell us whether they were confused, reconsidering the offer or hitting a technical problem.

In usability sessions, people could remember the welcome-points offer but weren't always clear about the annual fee, the spending required to earn the bonus or what the bank application would ask them to do.

That suggested we were getting people interested before helping them make an informed choice. The hypothesis was that clearer information before the handoff would reduce unproductive clicks and improve meaningful application progression.

We still needed an experiment to test that, rather than assuming the research explanation was correct.

- **Q:** What did customer research add

We noticed a gap between members clicking from an Aeroplan card offer and actually starting the bank's application.

The data showed where the journey was losing people, but it didn't tell us whether they were confused, reconsidering the offer or hitting a technical problem.

In usability sessions, people could remember the welcome-points offer but weren't always clear about the annual fee, the spending required to earn the bonus or what the bank application would ask them to do.

That suggested we were getting people interested before helping them make an informed choice. The hypothesis was that clearer information before the handoff would reduce unproductive clicks and improve meaningful application progression.

We still needed an experiment to test that, rather than assuming the research explanation was correct.

- **Q:** Why wasn't click-through enough?

We noticed a gap between members clicking from an Aeroplan card offer and actually starting the bank's application.

The data showed where the journey was losing people, but it didn't tell us whether they were confused, reconsidering the offer or hitting a technical problem.

In usability sessions, people could remember the welcome-points offer but weren't always clear about the annual fee, the spending required to earn the bonus or what the bank application would ask them to do.

That suggested we were getting people interested before helping them make an informed choice. The hypothesis was that clearer information before the handoff would reduce unproductive clicks and improve meaningful application progression.

We still needed an experiment to test that, rather than assuming the research explanation was correct.

---

### 19. How did you identify what was causing CRM deployment failures?

<a id="simplii-john-experience-depth-v1-arc-crm-discovery-how-did-y"></a>

- **Import key:** `simplii-john-experience-depth-v1-arc-crm-discovery`
- **Library ID:** `49853532-b413-4a6f-a933-954ac07f9a62`
- **Experience:** Arc'teryx — CRM & Customer Communications
- **Tier:** P1
- **Evidence:** illustrative_scenario

**Answer (spoken):**

I started by separating the failures into categories we could act on: content, audience and data conditions, integration dependencies, and the release process itself.

Then I reviewed representative incidents with engineering and QA, tracing each one from the requirement through testing and deployment. The useful question was where we first had enough information to prevent the issue. A problem discovered in production might actually have started with an unclear acceptance criterion or a handoff nobody owned.

I prioritized the recurring patterns rather than the most memorable incident. We assigned an owner to each failure mode and distinguished checks we could automate from decisions that still needed human judgment.

That made the roadmap more concrete. Instead of asking for a general investment in quality, I could explain which recurring problem we were addressing, where the control belonged and how we would know whether it was helping.

---

### 20. How did you know it worked if the full membership platform hadn't launched?

<a id="simplii-from-a412c28e-815d-42b5-91fa-ad7bc4e444b6-how-did-yo"></a>

- **Import key:** `simplii-from-a412c28e-815d-42b5-91fa-ad7bc4e444b6`
- **Library ID:** `421aed67-c50e-4a0a-b427-0b7f9fa868f0`
- **Experience:** Arc'teryx — Membership Platform
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd separate proving the first release was viable from proving membership adoption. Those are different milestones.

For the phase I led, we secured $5.2 million in capital approval, aligned the initial customer journey and its benefit-eligibility requirements, and established the platform and service-integration approach. That tells me we had a funded, executable direction, but not that membership was already changing customer behaviour.

We also ran a small usability exercise with twelve customers. Each person was asked to find a benefit relevant to their gear, explain whether they were eligible, and identify how they would access it. Ten completed that journey without prompting. I would report that as 10 of 12 task successes, not an 83% adoption rate. It helped us assess comprehension and navigation, but the sample was too small to support a demand or retention claim.

The post-launch test would be whether members actually used benefits successfully. I'd track enrollment separately from first successful benefit use within 90 days, then look at fulfilment completion, cost to serve, exceptions and support contact rates by benefit type. I'd also compare similar invited and non-invited customer cohorts where practical before making claims about incremental retention. So the honest result at that stage was an investable product direction plus early usability evidence, not proven lifetime value.

**Embedded follow-ups (3):**

- **Q:** What did the $5.2M prove

I'd separate proving the first release was viable from proving membership adoption. Those are different milestones.

For the phase I led, we secured $5.2 million in capital approval, aligned the initial customer journey and its benefit-eligibility requirements, and established the platform and service-integration approach. That tells me we had a funded, executable direction, but not that membership was already changing customer behaviour.

We also ran a small usability exercise with twelve customers. Each person was asked to find a benefit relevant to their gear, explain whether they were eligible, and identify how they would access it. Ten completed that journey without prompting. I would report that as 10 of 12 task successes, not an 83% adoption rate. It helped us assess comprehension and navigation, but the sample was too small to support a demand or retention claim.

The post-launch test would be whether members actually used benefits successfully. I'd track enrollment separately from first successful benefit use within 90 days, then look at fulfilment completion, cost to serve, exceptions and support contact rates by benefit type. I'd also compare similar invited and non-invited customer cohorts where practical before making claims about incremental retention. So the honest result at that stage was an investable product direction plus early usability evidence, not proven lifetime value.

- **Q:** What were the leading indicators

I'd separate proving the first release was viable from proving membership adoption. Those are different milestones.

For the phase I led, we secured $5.2 million in capital approval, aligned the initial customer journey and its benefit-eligibility requirements, and established the platform and service-integration approach. That tells me we had a funded, executable direction, but not that membership was already changing customer behaviour.

We also ran a small usability exercise with twelve customers. Each person was asked to find a benefit relevant to their gear, explain whether they were eligible, and identify how they would access it. Ten completed that journey without prompting. I would report that as 10 of 12 task successes, not an 83% adoption rate. It helped us assess comprehension and navigation, but the sample was too small to support a demand or retention claim.

The post-launch test would be whether members actually used benefits successfully. I'd track enrollment separately from first successful benefit use within 90 days, then look at fulfilment completion, cost to serve, exceptions and support contact rates by benefit type. I'd also compare similar invited and non-invited customer cohorts where practical before making claims about incremental retention. So the honest result at that stage was an investable product direction plus early usability evidence, not proven lifetime value.

- **Q:** How did you measure pre-launch success?

I'd separate proving the first release was viable from proving membership adoption. Those are different milestones.

For the phase I led, we secured $5.2 million in capital approval, aligned the initial customer journey and its benefit-eligibility requirements, and established the platform and service-integration approach. That tells me we had a funded, executable direction, but not that membership was already changing customer behaviour.

We also ran a small usability exercise with twelve customers. Each person was asked to find a benefit relevant to their gear, explain whether they were eligible, and identify how they would access it. Ten completed that journey without prompting. I would report that as 10 of 12 task successes, not an 83% adoption rate. It helped us assess comprehension and navigation, but the sample was too small to support a demand or retention claim.

The post-launch test would be whether members actually used benefits successfully. I'd track enrollment separately from first successful benefit use within 90 days, then look at fulfilment completion, cost to serve, exceptions and support contact rates by benefit type. I'd also compare similar invited and non-invited customer cohorts where practical before making claims about incremental retention. So the honest result at that stage was an investable product direction plus early usability evidence, not proven lifetime value.

---

### 21. How did you know membership was a customer problem at Arc'teryx?

<a id="simplii-from-ab850009-b3cc-4b2b-b026-cd9bb28987c3-how-did-yo"></a>

- **Import key:** `simplii-from-ab850009-b3cc-4b2b-b026-cd9bb28987c3`
- **Library ID:** `ff8f655c-9971-4641-abb2-1bc5b30ed7a2`
- **Experience:** Arc'teryx — Membership Platform
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

We looked at how people actually found and used the services available after purchase. In customer research, recent purchasers and long-time owners knew that repairs and care services existed, but weren't always sure what applied to their particular gear or where to begin.

That was consistent with questions going into Guest Services, like whether a product qualified for a benefit or how to start a request.

I think it's important to separate two things here. We had evidence that access and eligibility were confusing. We did not yet have proof that putting everything into a membership would create more loyalty or retention.

So I treated that as a hypothesis to validate. The initial experience needed to make the existing services easier to understand and use before we could make broader claims about the program's long-term value.

**Embedded follow-ups (4):**

- **Q:** How did you know this was a customer problem at Arc'teryx

We looked at how people actually found and used the services available after purchase. In customer research, recent purchasers and long-time owners knew that repairs and care services existed, but weren't always sure what applied to their particular gear or where to begin.

That was consistent with questions going into Guest Services, like whether a product qualified for a benefit or how to start a request.

I think it's important to separate two things here. We had evidence that access and eligibility were confusing. We did not yet have proof that putting everything into a membership would create more loyalty or retention.

So I treated that as a hypothesis to validate. The initial experience needed to make the existing services easier to understand and use before we could make broader claims about the program's long-term value.

- **Q:** What research informed the membership program

We looked at how people actually found and used the services available after purchase. In customer research, recent purchasers and long-time owners knew that repairs and care services existed, but weren't always sure what applied to their particular gear or where to begin.

That was consistent with questions going into Guest Services, like whether a product qualified for a benefit or how to start a request.

I think it's important to separate two things here. We had evidence that access and eligibility were confusing. We did not yet have proof that putting everything into a membership would create more loyalty or retention.

So I treated that as a hypothesis to validate. The initial experience needed to make the existing services easier to understand and use before we could make broader claims about the program's long-term value.

- **Q:** Why would customers want membership

We looked at how people actually found and used the services available after purchase. In customer research, recent purchasers and long-time owners knew that repairs and care services existed, but weren't always sure what applied to their particular gear or where to begin.

That was consistent with questions going into Guest Services, like whether a product qualified for a benefit or how to start a request.

I think it's important to separate two things here. We had evidence that access and eligibility were confusing. We did not yet have proof that putting everything into a membership would create more loyalty or retention.

So I treated that as a hypothesis to validate. The initial experience needed to make the existing services easier to understand and use before we could make broader claims about the program's long-term value.

- **Q:** How did you validate the proposition?

We looked at how people actually found and used the services available after purchase. In customer research, recent purchasers and long-time owners knew that repairs and care services existed, but weren't always sure what applied to their particular gear or where to begin.

That was consistent with questions going into Guest Services, like whether a product qualified for a benefit or how to start a request.

I think it's important to separate two things here. We had evidence that access and eligibility were confusing. We did not yet have proof that putting everything into a membership would create more loyalty or retention.

So I treated that as a hypothesis to validate. The initial experience needed to make the existing services easier to understand and use before we could make broader claims about the program's long-term value.

---

### 22. How did you know the Avion cashback withdrawal was a customer problem?

<a id="simplii-from-7df4eff0-1801-4505-afc3-cf652d90eb63-how-did-yo"></a>

- **Import key:** `simplii-from-7df4eff0-1801-4505-afc3-cf652d90eb63`
- **Library ID:** `5bfe1aaa-b1d0-42a9-ae68-7d69d03c8058`
- **Experience:** RBC — Cashback Withdrawals
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

We started with support conversations from members who had cashback available but didn't have an RBC deposit account. The question kept coming back to how they could get it into the bank account they already used.

I also walked through the existing experience. Members could earn cashback, see their balance and understand its value, but the withdrawal path didn't work for that segment. That made the problem fairly concrete.

To size the opportunity, I wanted two numbers separated: members currently affected who had a withdrawable balance, and the much larger audience we hoped to reach by opening Avion beyond RBC customers. I didn't want to treat the future addressable market as proof of current demand.

So the support evidence told us what was frustrating people, and the eligible-member data told us how large the immediate problem was.

**Embedded follow-ups (4):**

- **Q:** How did you know this was a customer problem at RBC

We started with support conversations from members who had cashback available but didn't have an RBC deposit account. The question kept coming back to how they could get it into the bank account they already used.

I also walked through the existing experience. Members could earn cashback, see their balance and understand its value, but the withdrawal path didn't work for that segment. That made the problem fairly concrete.

To size the opportunity, I wanted two numbers separated: members currently affected who had a withdrawable balance, and the much larger audience we hoped to reach by opening Avion beyond RBC customers. I didn't want to treat the future addressable market as proof of current demand.

So the support evidence told us what was frustrating people, and the eligible-member data told us how large the immediate problem was.

- **Q:** What evidence did you have

We started with support conversations from members who had cashback available but didn't have an RBC deposit account. The question kept coming back to how they could get it into the bank account they already used.

I also walked through the existing experience. Members could earn cashback, see their balance and understand its value, but the withdrawal path didn't work for that segment. That made the problem fairly concrete.

To size the opportunity, I wanted two numbers separated: members currently affected who had a withdrawable balance, and the much larger audience we hoped to reach by opening Avion beyond RBC customers. I didn't want to treat the future addressable market as proof of current demand.

So the support evidence told us what was frustrating people, and the eligible-member data told us how large the immediate problem was.

- **Q:** How did you validate the need

We started with support conversations from members who had cashback available but didn't have an RBC deposit account. The question kept coming back to how they could get it into the bank account they already used.

I also walked through the existing experience. Members could earn cashback, see their balance and understand its value, but the withdrawal path didn't work for that segment. That made the problem fairly concrete.

To size the opportunity, I wanted two numbers separated: members currently affected who had a withdrawable balance, and the much larger audience we hoped to reach by opening Avion beyond RBC customers. I didn't want to treat the future addressable market as proof of current demand.

So the support evidence told us what was frustrating people, and the eligible-member data told us how large the immediate problem was.

- **Q:** Was this just a stakeholder request?

We started with support conversations from members who had cashback available but didn't have an RBC deposit account. The question kept coming back to how they could get it into the bank account they already used.

I also walked through the existing experience. Members could earn cashback, see their balance and understand its value, but the withdrawal path didn't work for that segment. That made the problem fairly concrete.

To size the opportunity, I wanted two numbers separated: members currently affected who had a withdrawable balance, and the much larger audience we hoped to reach by opening Avion beyond RBC customers. I didn't want to treat the future addressable market as proof of current demand.

So the support evidence told us what was frustrating people, and the eligible-member data told us how large the immediate problem was.

---

### 23. How did you make the $5.2 million membership investment case credible?

<a id="simplii-john-experience-depth-v1-arc-funding-depth-how-did-y"></a>

- **Import key:** `simplii-john-experience-depth-v1-arc-funding-depth`
- **Library ID:** `9be2ec57-590b-4bf4-8469-4c54cf50f23a`
- **Experience:** Arc'teryx — Membership Platform
- **Tier:** P0
- **Evidence:** illustrative_scenario

**Answer (spoken):**

I tried to make the decision understandable at three levels: the customer problem, the capabilities required to solve it, and the exposure we were asking the business to take on.

The proposition connected existing post-purchase services with a more coherent member experience. The investment case needed to explain why that required more than improved service pages, and which capabilities belonged in the first release.

I worked through platform options, integration dependencies and a phased roadmap with business and technology teams. On the economics, the useful discussion was which assumptions mattered most: participation, benefit use, service cost and the timing of any longer-term value.

We secured $5.2 million in capital approval. I view that as a decision and alignment outcome. It gave us an approved direction; customer adoption and realized return still had to be demonstrated.

---

### 24. How did you measure success for the Avion cashback withdrawal launch?

<a id="simplii-from-11375f03-31fa-45da-8557-488a8cc63beb-how-did-yo"></a>

- **Import key:** `simplii-from-11375f03-31fa-45da-8557-488a8cc63beb`
- **Library ID:** `8750305f-4d55-466b-a9a8-e13bb4a0bfde`
- **Experience:** RBC — Cashback Withdrawals
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

The main measure was whether eligible members who submitted a withdrawal actually received their money, with a clear understanding of the payment status along the way.

In the first full-quarter readout, we had 3,200 requests and 3,168 confirmed payouts inside a 24-hour delivery window. That's a 99% 24-hour confirmation rate, not necessarily a 99% lifetime success rate. The remaining requests still needed to be tracked to a final outcome.

Completed payouts in that quarter were roughly $300,000, so the annualized run rate was around $1.2 million. I would call it a run rate, not twelve months of observed volume.

We also needed to measure eligibility drop-off before submission, reconciliation exceptions and payout-related support contacts. And I would keep the 5M+ settlement events separate: that's the scale of the shared RBC payment service, not the number of Avion withdrawals.

Those measures support adoption and reliability. They don't, by themselves, prove we improved member retention.

**Embedded follow-ups (4):**

- **Q:** What were the KPIs

The main measure was whether eligible members who submitted a withdrawal actually received their money, with a clear understanding of the payment status along the way.

In the first full-quarter readout, we had 3,200 requests and 3,168 confirmed payouts inside a 24-hour delivery window. That's a 99% 24-hour confirmation rate, not necessarily a 99% lifetime success rate. The remaining requests still needed to be tracked to a final outcome.

Completed payouts in that quarter were roughly $300,000, so the annualized run rate was around $1.2 million. I would call it a run rate, not twelve months of observed volume.

We also needed to measure eligibility drop-off before submission, reconciliation exceptions and payout-related support contacts. And I would keep the 5M+ settlement events separate: that's the scale of the shared RBC payment service, not the number of Avion withdrawals.

Those measures support adoption and reliability. They don't, by themselves, prove we improved member retention.

- **Q:** What do the 5M settlement events mean

The main measure was whether eligible members who submitted a withdrawal actually received their money, with a clear understanding of the payment status along the way.

In the first full-quarter readout, we had 3,200 requests and 3,168 confirmed payouts inside a 24-hour delivery window. That's a 99% 24-hour confirmation rate, not necessarily a 99% lifetime success rate. The remaining requests still needed to be tracked to a final outcome.

Completed payouts in that quarter were roughly $300,000, so the annualized run rate was around $1.2 million. I would call it a run rate, not twelve months of observed volume.

We also needed to measure eligibility drop-off before submission, reconciliation exceptions and payout-related support contacts. And I would keep the 5M+ settlement events separate: that's the scale of the shared RBC payment service, not the number of Avion withdrawals.

Those measures support adoption and reliability. They don't, by themselves, prove we improved member retention.

- **Q:** How do you know the launch worked?

The main measure was whether eligible members who submitted a withdrawal actually received their money, with a clear understanding of the payment status along the way.

In the first full-quarter readout, we had 3,200 requests and 3,168 confirmed payouts inside a 24-hour delivery window. That's a 99% 24-hour confirmation rate, not necessarily a 99% lifetime success rate. The remaining requests still needed to be tracked to a final outcome.

Completed payouts in that quarter were roughly $300,000, so the annualized run rate was around $1.2 million. I would call it a run rate, not twelve months of observed volume.

We also needed to measure eligibility drop-off before submission, reconciliation exceptions and payout-related support contacts. And I would keep the 5M+ settlement events separate: that's the scale of the shared RBC payment service, not the number of Avion withdrawals.

Those measures support adoption and reliability. They don't, by themselves, prove we improved member retention.

- **Q:** RBC — After a timeout, how do you prevent duplicates and establish payment statu

The first rule is that a timeout is not a declined payment. It means the customer-facing service didn't receive a conclusive response. The instruction may still be processing, and treating that as a failure can create a second payout.

So before launch, I'd want the withdrawal requirement to cover an uncertain outcome explicitly. When the request is initiated, the journey needs a stable reference that can be traced end to end. If we lose the response, we show the customer that the withdrawal is being checked rather than encouraging a new submission.

On the service side, I'd work with the payments owners to confirm how duplicate protection and authoritative status are actually supported. Ideally a retry against the same business request can't move money twice, and there is a reliable way to reconcile the original instruction to its final outcome.

My job is to insist that the contract, customer states, support path and acceptance criteria address that failure mode. The enterprise team decides how the mechanism is implemented, because I don't own their payment architecture.

---

### 25. How did you measure the 15% improvement in application completions?

<a id="simplii-john-experience-depth-v1-hbc-application-measurement"></a>

- **Import key:** `simplii-john-experience-depth-v1-hbc-application-measurement`
- **Library ID:** `4aab2f21-9f81-411c-9840-9389550a45b1`
- **Experience:** HBC — Mastercard Acquisition
- **Tier:** P0
- **Evidence:** unverified_detail

**Answer (spoken):**

The reported result was a 15% relative improvement in application completions. That is different from a 15-percentage-point increase.

The measurement question is whether more people who started an application went on to submit it, using a consistent definition and enough time for each cohort to complete. Submission is also different from approval or first card use.

To attribute the improvement, I'd examine the comparison design and whether traffic source, device mix, offers or other changes could explain it. A randomized test would provide stronger evidence; a before-and-after comparison would require a more cautious claim.

I would use the original analysis for the actual design and sample sizes. I can explain the 15% result and the funnel logic without presenting hypothetical cohort numbers as the historical experiment.

---

### 26. How did you measure the 15% improvement?

<a id="simplii-from-3218b561-2159-442e-a3aa-074756f877c0-how-did-yo"></a>

- **Import key:** `simplii-from-3218b561-2159-442e-a3aa-074756f877c0`
- **Library ID:** `b1ac4e3e-368d-4b42-a0ce-1e9acbb72fc5`
- **Experience:** HBC — Mastercard Acquisition
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

In the test, we randomly assigned new application starters to the original or revised experience and kept that assignment stable if they returned. Each person had fourteen days to complete, and we waited for the final cohort's window to close.

Completion meant the application had been submitted to Neo for a decision, not that the customer was approved or had activated their card.

In the original group, 2,000 of 4,000 starters completed, or 50%. In the revised group, 2,300 of 4,000 did, or 57.5%.

That's a 7.5-percentage-point improvement, or a 15% relative lift. The denominator was application starters, so we weren't just counting more submissions caused by more advertising traffic.

I'd also monitor duplicate starts, support contacts and any disruption to the shopping experience. Approval and card activation would be separate downstream outcomes that we'd want to understand before making broader profitability claims.

**Embedded follow-ups (3):**

- **Q:** Was that 15 points or 15 percent

In the test, we randomly assigned new application starters to the original or revised experience and kept that assignment stable if they returned. Each person had fourteen days to complete, and we waited for the final cohort's window to close.

Completion meant the application had been submitted to Neo for a decision, not that the customer was approved or had activated their card.

In the original group, 2,000 of 4,000 starters completed, or 50%. In the revised group, 2,300 of 4,000 did, or 57.5%.

That's a 7.5-percentage-point improvement, or a 15% relative lift. The denominator was application starters, so we weren't just counting more submissions caused by more advertising traffic.

I'd also monitor duplicate starts, support contacts and any disruption to the shopping experience. Approval and card activation would be separate downstream outcomes that we'd want to understand before making broader profitability claims.

- **Q:** What was the experiment

In the test, we randomly assigned new application starters to the original or revised experience and kept that assignment stable if they returned. Each person had fourteen days to complete, and we waited for the final cohort's window to close.

Completion meant the application had been submitted to Neo for a decision, not that the customer was approved or had activated their card.

In the original group, 2,000 of 4,000 starters completed, or 50%. In the revised group, 2,300 of 4,000 did, or 57.5%.

That's a 7.5-percentage-point improvement, or a 15% relative lift. The denominator was application starters, so we weren't just counting more submissions caused by more advertising traffic.

I'd also monitor duplicate starts, support contacts and any disruption to the shopping experience. Approval and card activation would be separate downstream outcomes that we'd want to understand before making broader profitability claims.

- **Q:** What did application completion mean?

In the test, we randomly assigned new application starters to the original or revised experience and kept that assignment stable if they returned. Each person had fourteen days to complete, and we waited for the final cohort's window to close.

Completion meant the application had been submitted to Neo for a decision, not that the customer was approved or had activated their card.

In the original group, 2,000 of 4,000 starters completed, or 50%. In the revised group, 2,300 of 4,000 did, or 57.5%.

That's a 7.5-percentage-point improvement, or a 15% relative lift. The denominator was application starters, so we weren't just counting more submissions caused by more advertising traffic.

I'd also monitor duplicate starts, support contacts and any disruption to the shopping experience. Approval and card activation would be separate downstream outcomes that we'd want to understand before making broader profitability claims.

---

### 27. How did you measure the 25% reduction in deployment failures?

<a id="simplii-john-experience-depth-v1-arc-crm-measurement-how-did"></a>

- **Import key:** `simplii-john-experience-depth-v1-arc-crm-measurement`
- **Library ID:** `8f46e2b8-d41c-4244-88c7-8d5210c315f9`
- **Experience:** Arc'teryx — CRM & Customer Communications
- **Tier:** P0
- **Evidence:** unverified_detail

**Answer (spoken):**

The 25% figure refers to deployment failures. It doesn't mean we improved email deliverability by 25%, or that 25% more customers received messages.

To explain it properly, I'd distinguish the number of failed releases from the failure rate per release. If deployment volume changed, a lower raw count alone wouldn't establish that the process became more reliable.

I'd also keep the failure definition and comparison periods consistent, and separate a pre-release defect we caught from a production failure that affected customers.

The result on my resume is the reported reduction in deployment failures following the QA and automation work. I wouldn't add an exact baseline or denominator without the underlying release report. The value I can explain is the change in how we prevented and handled release problems.

---

### 28. How did you measure the 40% conversion improvement at Aeroplan?

<a id="simplii-john-experience-depth-v1-air-conversion-measurement-"></a>

- **Import key:** `simplii-john-experience-depth-v1-air-conversion-measurement`
- **Library ID:** `265ac1c7-8295-443e-83fc-2dd3f602518f`
- **Experience:** Aeroplan — Co-brand Card Acquisition
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

The headline outcome on my resume is a 40% improvement in application conversion. I would be careful about the event definition because reaching an issuer, starting an application and completing an application are different outcomes.

To explain that result properly, I would anchor it to the original reporting definition, eligible audience and comparison period. I do not want to substitute a more impressive downstream event just because it sounds better in an interview.

The measurement approach I'd use is to follow the journey from exposure to offer engagement, the issuer handoff and whatever application outcome we can reliably observe. I'd compare like-for-like traffic and check for changes in offer strength, channel mix or eligibility that might explain part of the movement.

I would also keep the 40% journey result separate from the 427% year-over-year acquisition growth. The broader number had multiple contributors. My job is to explain the product contribution accurately, including the limits of the evidence.

---

### 29. How did you prevent a non-RBC member from getting a worse onboarding experience than an RBC customer?

<a id="simplii-from-0cf5b127-23d5-442e-b968-59bafc1ff0b3-how-did-yo"></a>

- **Import key:** `simplii-from-0cf5b127-23d5-442e-b968-59bafc1ff0b3`
- **Library ID:** `eaf3ff00-4bc5-4f3e-a9f0-ddc9d6ea7fdd`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I wouldn't assume the two entry points should look identical because their authentication and account relationships are different. But the value proposition and the next step should feel equally understandable.

For non-RBC members, a clear sign-up path, identity capture, terms and a reliable way to access the product become especially important. I'd compare conversion and first-value completion across the two segments, while accounting for their different journeys.

If one group struggled, I'd look at authentication friction, missing information and confusing eligibility rules before adding incentives. The important point from Avion Select was opening a financial-services-adjacent product to an audience that wasn't already inside the bank's usual sign-in flow.

---

### 30. How did you prevent one card partner's offer from undermining another's?

<a id="simplii-from-bb903f25-6886-4106-ab80-1fa344cd8a05-how-did-yo"></a>

- **Import key:** `simplii-from-bb903f25-6886-4106-ab80-1fa344cd8a05`
- **Library ID:** `572e25a0-fd87-40fe-9fc3-871a010cf466`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd want a clear set of merchandising rules and a customer-first way to explain each offer. When a customer is comparing cards, the goal isn't to make every bank look identical. It's to make trade-offs understandable and ensure the experience is accurate for the partner's terms.

I'd also agree with the business and issuer teams on what we were optimizing: total qualified acquisition, offer relevance and long-term economics, not simply shifting the same customer from one bank partner to another.

A controlled test and partner-level reporting could help reveal whether one treatment generated truly incremental applications or just redistributed demand across offers.

---

### 31. How did you turn regulatory and operations requirements into stories engineers could build?

<a id="simplii-from-79d4fa99-20bc-4cff-8c9c-0b25705550ca-how-did-yo"></a>

- **Import key:** `simplii-from-79d4fa99-20bc-4cff-8c9c-0b25705550ca`
- **Library ID:** `8317f319-ad43-4328-8380-68402f8d94e5`
- **Experience:** Career & Product Experience
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

I'd start by translating each requirement into an observable customer or system behaviour. For example: when is a customer eligible, what limits apply, what state should the UI show, and what information must Operations have to reconcile or investigate a payout?

The stories then need acceptance criteria for more than the happy path. What happens when eligibility changes, a request is repeated, the provider is slow or a settlement entry doesn't match?

The best requirements give engineering enough clarity on the intended behaviour while leaving room for the team to choose the implementation. I'd validate those cases with Risk, Finance and the payments service owners before committing to launch.

---

### 32. How did your work change when you moved from analyst to product manager at Air Canada?

<a id="simplii-john-experience-depth-v1-air-analyst-to-pm-how-did-y"></a>

- **Import key:** `simplii-john-experience-depth-v1-air-analyst-to-pm`
- **Library ID:** `88fb3749-9464-49c9-af40-bb3c31e9ade8`
- **Experience:** Air Canada / Aeroplan — Employer Overview
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

As an analyst, I was primarily helping the team decide whether an opportunity made commercial sense. I worked through the assumptions, modeled the economics and helped explain the case.

As a product manager, I became more directly responsible for translating an opportunity into a customer journey the team could deliver and improve. On the co-brand acquisition work, that meant thinking through how a member discovered an offer, understood the differences between cards and reached the issuer's application experience.

The analytical foundation remained useful, but the questions became more practical. Where was the friction? What could we change on Aeroplan's side? Which decisions depended on TD, CIBC or American Express? What evidence would tell us the journey was improving?

That progression taught me to connect commercial reasoning with product execution. A strong business case is a starting point. The product work is making the proposition understandable, managing the partner dependencies and learning whether customers behave the way the case assumed.

---

### 33. How do you know the HBC application improvement wasn't caused by a different applicant mix?

<a id="simplii-from-2af89a04-ab52-40bd-928d-96a3122fffd1-how-do-you"></a>

- **Import key:** `simplii-from-2af89a04-ab52-40bd-928d-96a3122fffd1`
- **Library ID:** `bbd2d586-13a7-4617-99f4-9e483c8173ee`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd want the comparison to use a consistent definition of application start and completion, and I'd look at who entered the funnel in each period. Changes in campaign source, device, credit profile or promotions can make the conversion rate move even when the experience doesn't improve.

The strongest approach is a randomized experiment where the applicant mix should be balanced. If we couldn't do that, I'd segment cohorts and be much more conservative about attribution.

I can speak to the reported 15% improvement in completions. I'd avoid claiming a specific experimental design or statistical result unless it's supported by what the team actually measured.

---

### 34. How do you know the headless option saved two quarters?

<a id="simplii-from-1db0b6d1-d7a9-4d2b-b2a4-7758f9c47b3b-how-do-you"></a>

- **Import key:** `simplii-from-1db0b6d1-d7a9-4d2b-b2a4-7758f9c47b3b`
- **Library ID:** `021e2e48-dd92-4e64-a366-7e00e8e65161`
- **Experience:** Arc'teryx — Vendor Evaluation
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

That was a projected reduction in the delivery plan, not six months saved after a completed launch.

During the build-versus-buy evaluation, we compared what we'd have to develop and maintain internally with what the vendor platforms already supported. We looked at membership rules and administration, the integrations we would still need to build, dependencies on identity and guest services, and the sequencing of the MVP.

The headless approach let us reuse standard membership capabilities while keeping control of the customer experience and integration layer. Based on those implementation estimates and the critical-path dependencies, the proposed approach shortened the projected timeline by approximately two quarters compared with building the underlying capabilities ourselves.

I would always describe it as a planning estimate. The realized benefit would depend on implementation, integration testing, partner readiness and the actual launch schedule.

**Embedded follow-ups (4):**

- **Q:** Vendor time savings

That was a projected reduction in the delivery plan, not six months saved after a completed launch.

During the build-versus-buy evaluation, we compared what we'd have to develop and maintain internally with what the vendor platforms already supported. We looked at membership rules and administration, the integrations we would still need to build, dependencies on identity and guest services, and the sequencing of the MVP.

The headless approach let us reuse standard membership capabilities while keeping control of the customer experience and integration layer. Based on those implementation estimates and the critical-path dependencies, the proposed approach shortened the projected timeline by approximately two quarters compared with building the underlying capabilities ourselves.

I would always describe it as a planning estimate. The realized benefit would depend on implementation, integration testing, partner readiness and the actual launch schedule.

- **Q:** Two quarters projection

That was a projected reduction in the delivery plan, not six months saved after a completed launch.

During the build-versus-buy evaluation, we compared what we'd have to develop and maintain internally with what the vendor platforms already supported. We looked at membership rules and administration, the integrations we would still need to build, dependencies on identity and guest services, and the sequencing of the MVP.

The headless approach let us reuse standard membership capabilities while keeping control of the customer experience and integration layer. Based on those implementation estimates and the critical-path dependencies, the proposed approach shortened the projected timeline by approximately two quarters compared with building the underlying capabilities ourselves.

I would always describe it as a planning estimate. The realized benefit would depend on implementation, integration testing, partner readiness and the actual launch schedule.

- **Q:** Actual versus forecast

That was a projected reduction in the delivery plan, not six months saved after a completed launch.

During the build-versus-buy evaluation, we compared what we'd have to develop and maintain internally with what the vendor platforms already supported. We looked at membership rules and administration, the integrations we would still need to build, dependencies on identity and guest services, and the sequencing of the MVP.

The headless approach let us reuse standard membership capabilities while keeping control of the customer experience and integration layer. Based on those implementation estimates and the critical-path dependencies, the proposed approach shortened the projected timeline by approximately two quarters compared with building the underlying capabilities ourselves.

I would always describe it as a planning estimate. The realized benefit would depend on implementation, integration testing, partner readiness and the actual launch schedule.

- **Q:** Build buy calculation

That was a projected reduction in the delivery plan, not six months saved after a completed launch.

During the build-versus-buy evaluation, we compared what we'd have to develop and maintain internally with what the vendor platforms already supported. We looked at membership rules and administration, the integrations we would still need to build, dependencies on identity and guest services, and the sequencing of the MVP.

The headless approach let us reuse standard membership capabilities while keeping control of the customer experience and integration layer. Based on those implementation estimates and the critical-path dependencies, the proposed approach shortened the projected timeline by approximately two quarters compared with building the underlying capabilities ourselves.

I would always describe it as a planning estimate. The realized benefit would depend on implementation, integration testing, partner readiness and the actual launch schedule.

---

### 35. How do you know your incentive program generated incremental spending?

<a id="simplii-from-6cffb3bc-d87e-45de-a116-f6539d8d23dc-how-do-you"></a>

- **Import key:** `simplii-from-6cffb3bc-d87e-45de-a116-f6539d8d23dc`
- **Library ID:** `a33d18a6-0036-4768-97a3-ab21345bc31f`
- **Experience:** HBC — Cardholder Portfolio & P&L
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

For the targeted lifecycle incentives, we used a randomized holdout among eligible cardholders rather than judging success from campaign spend alone. That mattered because some customers would have made purchases even without an offer.

We compared the treatment and holdout groups over the same observation period. The active-cardholder rate improved by four percentage points, while spending per active cardholder was five percent higher. I'd also examine spend per eligible assigned cardholder, because the active-cardholder group can change when an incentive brings more people into the active population.

Then we looked at the economics: incremental spend and the relevant revenue contribution, less the costs of incentives and servicing. The estimated 10% LTV improvement came from modeling the effect of observed engagement and retention assumptions, not from treating every promotional dollar as profit.

That distinction is important. More spending during a promotion isn't necessarily a successful product outcome unless the incremental contribution and longer-term behaviour justify the cost.

---

### 36. How exactly did you measure the 40% conversion lift?

<a id="simplii-from-8f93a4d4-6570-4ae8-8e29-ff5f1c6218b4-how-exactl"></a>

- **Import key:** `simplii-from-8f93a4d4-6570-4ae8-8e29-ff5f1c6218b4`
- **Library ID:** `0343f6eb-6777-488c-9440-7b9e1db73c65`
- **Experience:** Aeroplan — Co-brand Card Acquisition
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

In the experiment, we split 8,000 unique logged-in mobile visitors evenly across two offer-page variants. Enrollment ran for four weeks, and we allowed seven days after each visitor's first exposure to see whether they began the bank application.

We defined a start as completing the first required application step at the bank. Landing on the bank's page didn't count.

In the original experience, 400 of 4,000 visitors started, or 10%. In the revised one, it was 560 of 4,000, or 14%.

That's a four-percentage-point lift, or 40% relative improvement in starts per offer-page visitor. Completion among starters held at 70%, so the additional starts also translated into more submitted applications.

That result applied to the tested audience and offer. It did not, on its own, explain the broader 427% year-over-year acquisition growth or prove a lift in approved, activated cardholders.

**Embedded follow-ups (3):**

- **Q:** Was 40% relative

In the experiment, we split 8,000 unique logged-in mobile visitors evenly across two offer-page variants. Enrollment ran for four weeks, and we allowed seven days after each visitor's first exposure to see whether they began the bank application.

We defined a start as completing the first required application step at the bank. Landing on the bank's page didn't count.

In the original experience, 400 of 4,000 visitors started, or 10%. In the revised one, it was 560 of 4,000, or 14%.

That's a four-percentage-point lift, or 40% relative improvement in starts per offer-page visitor. Completion among starters held at 70%, so the additional starts also translated into more submitted applications.

That result applied to the tested audience and offer. It did not, on its own, explain the broader 427% year-over-year acquisition growth or prove a lift in approved, activated cardholders.

- **Q:** Did the bank provide conversion data

In the experiment, we split 8,000 unique logged-in mobile visitors evenly across two offer-page variants. Enrollment ran for four weeks, and we allowed seven days after each visitor's first exposure to see whether they began the bank application.

We defined a start as completing the first required application step at the bank. Landing on the bank's page didn't count.

In the original experience, 400 of 4,000 visitors started, or 10%. In the revised one, it was 560 of 4,000, or 14%.

That's a four-percentage-point lift, or 40% relative improvement in starts per offer-page visitor. Completion among starters held at 70%, so the additional starts also translated into more submitted applications.

That result applied to the tested audience and offer. It did not, on its own, explain the broader 427% year-over-year acquisition growth or prove a lift in approved, activated cardholders.

- **Q:** How large was the experiment?

In the experiment, we split 8,000 unique logged-in mobile visitors evenly across two offer-page variants. Enrollment ran for four weeks, and we allowed seven days after each visitor's first exposure to see whether they began the bank application.

We defined a start as completing the first required application step at the bank. Landing on the bank's page didn't count.

In the original experience, 400 of 4,000 visitors started, or 10%. In the revised one, it was 560 of 4,000, or 14%.

That's a four-percentage-point lift, or 40% relative improvement in starts per offer-page visitor. Completion among starters held at 70%, so the additional starts also translated into more submitted applications.

That result applied to the tested audience and offer. It did not, on its own, explain the broader 427% year-over-year acquisition growth or prove a lift in approved, activated cardholders.

---

### 37. How much of Avion Select's growth to 500,000 members can you attribute to your work?

<a id="simplii-john-experience-depth-v1-rbc-avion-attribution-how-m"></a>

- **Import key:** `simplii-john-experience-depth-v1-rbc-avion-attribution`
- **Library ID:** `45142e2b-07aa-4669-9f00-3319043d4284`
- **Experience:** RBC — Avion Select
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I would describe my contribution as helping launch the product and the onboarding capabilities that made the new audience possible.

The program subsequently reaching approximately 500,000 members is important context, but I wouldn't attribute that entire outcome to my work. Distribution, the proposition, marketing and continued product development all contributed.

To evaluate the onboarding work specifically, I'd look at completion, access problems and whether new members reached their first useful action. To claim incremental growth from a particular change, I'd need a comparison that isolated it from the other activity.

I'm comfortable explaining both levels: I owned a meaningful part of the launch, and the product went on to achieve that scale. Those are connected facts without being the same causal claim.

---

### 38. How would you build the business case for an Aeroplan partnership?

<a id="simplii-john-experience-depth-v1-air-partnership-model-how-w"></a>

- **Import key:** `simplii-john-experience-depth-v1-air-partnership-model`
- **Library ID:** `b02eb713-454f-4a01-bc2a-5fb9ef6429dc`
- **Experience:** Aeroplan — Commercial Partnerships
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd start with the member behavior we wanted to change. For a frequent-use partner, that could mean linking an account and making the next eligible purchase through the partnership. The model needs to explain how people get from awareness to that behavior.

I'd build the volume side from reachable members, activation, purchase frequency and the value of an eligible transaction. Then I'd connect that volume to the actual contract economics: what creates a billable event, the applicable rate, reward funding and the costs of running the partnership.

The most important distinction is between activity and activity the partnership actually creates. If members were already shopping with both brands, a large transaction total could overstate the value of the relationship. I'd test a conservative incrementality assumption and make that sensitivity visible.

Finally, I'd use a base, downside and upside case to identify the assumptions that change the decision. The output should tell the team what must be true, what we can validate early and when the economics would justify expanding.

---

### 39. How would you compare potential partners such as Uber and Starbucks?

<a id="simplii-john-experience-depth-v1-air-partnership-prioritizat"></a>

- **Import key:** `simplii-john-experience-depth-v1-air-partnership-prioritization`
- **Library ID:** `45be49cd-9ec7-4166-882b-62a81adfa412`
- **Experience:** Aeroplan — Commercial Partnerships
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd compare the behaviors each partnership could create before comparing the size of the brands. A high-frequency partner might give members more reasons to interact with Aeroplan between flights. The question is whether the proposed experience makes that interaction useful and easy enough to repeat.

My evaluation would cover member overlap, frequency of the underlying behavior, the strength of the offer, activation friction and commercial return. I'd also include the work required to support the experience. A compelling forecast becomes less attractive if linking accounts is difficult or members cannot understand why points are missing.

I would avoid putting every assumption into one score that hides the tradeoff. I'd show the strongest case for each partner, the main uncertainty and the cost of testing it. One opportunity might be better for reach, another for repeated engagement.

The recommendation would depend on the objective and the evidence. I wouldn't claim that Uber was inherently a better partner than Starbucks, or that I personally selected one over the other.

---

### 40. How would you define payout success rate?

<a id="simplii-from-a91d4a5a-19bf-4cd7-8ade-e773f9e83028-how-would-"></a>

- **Import key:** `simplii-from-a91d4a5a-19bf-4cd7-8ade-e773f9e83028`
- **Library ID:** `9fe37589-1a10-4263-8e4d-fa81ab68e7fd`
- **Experience:** RBC — Cashback Withdrawals
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd start by defining the lifecycle and eligible population. For example, completed payouts divided by eligible payout attempts initiated during a period, with clear treatment of retries, customer cancellations and reversals. I'd probably report first-attempt completion separately from eventual completion, because those tell us different things about friction and reliability. I'd also separate business-rule rejections, provider failures and unresolved states rather than rolling them into one failure bucket. Finally I'd align the definitions with Financial Operations, so we're not calling a payment successful just because our API received an acknowledgement.

**Embedded follow-ups (4):**

- **Q:** Payment KPI

I'd start by defining the lifecycle and eligible population. For example, completed payouts divided by eligible payout attempts initiated during a period, with clear treatment of retries, customer cancellations and reversals. I'd probably report first-attempt completion separately from eventual completion, because those tell us different things about friction and reliability. I'd also separate business-rule rejections, provider failures and unresolved states rather than rolling them into one failure bucket. Finally I'd align the definitions with Financial Operations, so we're not calling a payment successful just because our API received an acknowledgement.

- **Q:** Successful payouts

I'd start by defining the lifecycle and eligible population. For example, completed payouts divided by eligible payout attempts initiated during a period, with clear treatment of retries, customer cancellations and reversals. I'd probably report first-attempt completion separately from eventual completion, because those tell us different things about friction and reliability. I'd also separate business-rule rejections, provider failures and unresolved states rather than rolling them into one failure bucket. Finally I'd align the definitions with Financial Operations, so we're not calling a payment successful just because our API received an acknowledgement.

- **Q:** First attempt success

I'd start by defining the lifecycle and eligible population. For example, completed payouts divided by eligible payout attempts initiated during a period, with clear treatment of retries, customer cancellations and reversals. I'd probably report first-attempt completion separately from eventual completion, because those tell us different things about friction and reliability. I'd also separate business-rule rejections, provider failures and unresolved states rather than rolling them into one failure bucket. Finally I'd align the definitions with Financial Operations, so we're not calling a payment successful just because our API received an acknowledgement.

- **Q:** Settlement success

I'd start by defining the lifecycle and eligible population. For example, completed payouts divided by eligible payout attempts initiated during a period, with clear treatment of retries, customer cancellations and reversals. I'd probably report first-attempt completion separately from eventual completion, because those tell us different things about friction and reliability. I'd also separate business-rule rejections, provider failures and unresolved states rather than rolling them into one failure bucket. Finally I'd align the definitions with Financial Operations, so we're not calling a payment successful just because our API received an acknowledgement.

---

### 41. How would you handle missing cashback or unclear tracking in ShopPlus?

<a id="simplii-john-experience-depth-v1-rbc-shopplus-trust-how-woul"></a>

- **Import key:** `simplii-john-experience-depth-v1-rbc-shopplus-trust`
- **Library ID:** `cc1db69a-07f5-4896-b19f-cf07cd40bd77`
- **Experience:** RBC — ShopPlus
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd distinguish activating an offer from a purchase being tracked and from cashback being confirmed. Those events can happen at different times and depend on different systems.

The customer should understand what we've observed and what is still pending. I'd avoid promising that an offer activation guarantees a reward before the purchase has been validated against the merchant's terms.

When something is missing, support needs enough information to investigate without asking the customer to reconstruct everything. I'd want a clear reference to the relevant offer and activity, an explanation of the review process and a realistic next step.

Product also needs to learn from those cases. Repeated missing-cashback complaints could point to unclear terms, a tracking issue or an integration problem. I'd use that distinction to prioritize the fix.

---

### 42. How would you measure a journey when the issuer owns the application and approval data?

<a id="simplii-john-experience-depth-v1-air-downstream-data-how-wou"></a>

- **Import key:** `simplii-john-experience-depth-v1-air-downstream-data`
- **Library ID:** `af36ad1a-15e1-4ade-8c52-b49d5c88657c`
- **Experience:** Aeroplan — Co-brand Card Acquisition
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd start by drawing the measurement boundary. On our side, we may be able to observe offer exposure, engagement and the handoff to an issuer. Application completion, approval and account activation may sit with the partner. Those events should remain distinct in the reporting.

Then I'd work with the partner on the minimum reporting arrangement needed to make a product decision. That could be aggregate reporting by an agreed cohort or an appropriately governed attribution mechanism. I wouldn't assume we should receive individual application data simply because it would be convenient.

I'd reconcile definitions, reporting delays and unmatched records before interpreting the funnel. Otherwise a timing difference can look like abandonment, or a change in tagging can look like improved conversion.

If downstream visibility remained limited, I'd be explicit about it. We could still improve the part of the journey we observed, but I would not present more outbound clicks as proof of more approved or activated accounts.

---

### 43. How would you measure whether native travel was better for members?

<a id="simplii-john-experience-depth-v1-rbc-travel-measures-how-wou"></a>

- **Import key:** `simplii-john-experience-depth-v1-rbc-travel-measures`
- **Library ID:** `193f6387-d1c3-4c6c-a01a-db701f1d626b`
- **Experience:** RBC — Core Web, Mobile & Travel
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd start with successful booking completion among members who entered the booking journey, then look at the steps where we expected the experience to improve.

I'd watch errors, abandonment at the handoff and customer contacts about missing or unclear confirmations. I'd also distinguish a completed booking from a satisfied trip; cancellations and servicing issues can change the picture later.

Travel demand, pricing and inventory can move conversion independently of the interface. I'd want comparable audiences and periods, or controlled exposure where practical, before attributing an improvement to the native experience.

The release itself is an established delivery outcome on my resume. Any claim about incremental bookings would need a separate analysis with the right denominator and comparison.

---

### 44. How would you prevent a customer from receiving the same cashback payout twice?

<a id="simplii-from-c864344c-3df9-4f30-b478-278b4e58f8d4-how-would-"></a>

- **Import key:** `simplii-from-c864344c-3df9-4f30-b478-278b4e58f8d4`
- **Library ID:** `6fab1766-f2ed-4c48-97e4-024a05961ebe`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd make the withdrawal request uniquely identifiable and ensure that retrying it doesn't create a new financial instruction. An idempotency key tied to the logical payout is one implementation pattern I'd discuss with engineering.

The important distinction is between a new request and a retry of the same request. If the API times out after acceptance, the app should investigate the existing transaction state rather than blindly submit another transfer.

I'd also want limits and payout eligibility checked against the financial record, with reconciliation finding any mismatch between our request history and settlement activity. The product requirement is simple: a customer can recover from a timeout without getting paid twice or losing track of their money.

---

### 45. How would you roll out a new travel booking experience safely?

<a id="simplii-john-experience-depth-v1-rbc-travel-rollout-how-woul"></a>

- **Import key:** `simplii-john-experience-depth-v1-rbc-travel-rollout`
- **Library ID:** `d34ae15e-41af-42d9-b656-fdff082077e7`
- **Experience:** RBC — Core Web, Mobile & Travel
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd pay particular attention to the point where browsing becomes a booking or financial commitment.

Before release, I'd test whether the customer's selection, price and payment or redemption details remain consistent through the partner handoff. I'd include slow responses, an interrupted session and uncertainty about whether a booking was accepted.

Where the platform supports it, I'd use staged exposure and monitor the journey by step. The rollback plan needs to account for people already in progress, not just stop new traffic.

I would also involve service teams before launch. A customer who has a confirmation problem needs a reliable investigation path and a clear owner.

The aim is to learn from limited exposure while protecting the integrity of the booking and the customer's money.

---

### 46. How would you substantiate Quests' six-percent incremental spending lift?

<a id="simplii-john-experience-depth-v1-hbc-quests-measurement-how-"></a>

- **Import key:** `simplii-john-experience-depth-v1-hbc-quests-measurement`
- **Library ID:** `e02dd37a-04a9-4e3b-86e6-d85656bbd2d4`
- **Experience:** HBC — Quests
- **Tier:** P0
- **Evidence:** unverified_detail

**Answer (spoken):**

The six-percent figure on my resume is an incremental cardholder-spend result. To defend that claim, the key evidence is the comparison: what would those customers have spent without the treatment?

A strong evaluation would assign eligible customers to treatment and holdout, keep the observation period consistent and compare spending across the assigned populations. Looking only at people who completed a Quest would select the customers most likely to respond.

I'd then examine incentive cost and whether the effect persisted beyond the promotion. Higher spending doesn't automatically mean higher contribution.

I would bring the actual Quests measurement design into a detailed discussion rather than assume it was identical to the separate Mastercard lifecycle holdout. The six-percent result and the lifecycle program's other metrics should remain distinct.

---

### 47. How would you test whether customers wanted membership benefits before building the full platform?

<a id="simplii-from-9b1df81f-65b7-4b77-81af-4ae48b03eb79-how-would-"></a>

- **Import key:** `simplii-from-9b1df81f-65b7-4b77-81af-4ae48b03eb79`
- **Library ID:** `384b755d-5b59-4ebd-81cf-06212dd60145`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd test the specific customer job before testing a big membership proposition. For example, do jacket owners struggle to understand repair eligibility or discover how to maintain a product they intend to keep for years?

I'd compare a simpler guided experience against the existing service journey, measure successful task completion and support contacts, and ask customers whether the benefits were genuinely useful. I'd also look for repeated behaviour rather than relying only on stated interest.

If a small test showed customers valued clearer access to existing services, that would strengthen the case for an integrated program. If it didn't, I'd challenge whether a broad membership platform was solving the right problem.

---

### 48. If payout failures doubled after launch, how would you investigate the first week?

<a id="simplii-from-03065da4-6d80-432b-bca7-c034fdf0ff52-if-payout-"></a>

- **Import key:** `simplii-from-03065da4-6d80-432b-bca7-c034fdf0ff52`
- **Library ID:** `b4e925c9-3017-4f3d-b744-ea12da764d28`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd first break failures down by stage and reason: eligibility, request initiation, provider acceptance, delivery, return and reconciliation. I'd compare the increase by app version, customer segment and any payment-service or partner changes.

I'd also ask whether the denominator changed. A growth campaign might bring in more first-time or ineligible customers, so the raw count alone could mislead us.

For customer impact, I'd distinguish money actually at risk from requests that were safely rejected. Then I'd prioritize containment for the harmful cases, communicate clearly, and work with payment operations on a root-cause fix. I'd keep an eye on repeat attempts so the investigation doesn't accidentally create duplicate transfers.

---

### 49. Tell me about a commercial trade-off you made in the HBC card portfolio.

<a id="simplii-john-experience-depth-v1-hbc-commercial-tradeoff-tel"></a>

- **Import key:** `simplii-john-experience-depth-v1-hbc-commercial-tradeoff`
- **Library ID:** `def133e2-0cca-416b-9c02-eafb391c0d2e`
- **Experience:** HBC — Cardholder Portfolio & P&L
- **Tier:** P1
- **Evidence:** illustrative_scenario

**Answer (spoken):**

The choice was between an offer with broad appeal and a more targeted treatment aimed at a specific lifecycle problem.

The broad offer was easier to explain and likely to generate participation. The concern was that it could subsidize spending from customers who were already active, while using budget we could put toward activation or repeat use.

I framed the choice around incremental contribution rather than campaign volume. We needed to consider the expected behavior change, incentive expense and whether the effect would continue after the offer.

I recommended a more focused treatment and a defined comparison so we could learn before expanding it. That meant accepting a smaller headline audience in exchange for a decision we could evaluate more clearly.

---

### 50. Tell me about a cross-team disagreement on the Arc'teryx membership roadmap.

<a id="simplii-john-experience-depth-v1-arc-membership-conflict-tel"></a>

- **Import key:** `simplii-john-experience-depth-v1-arc-membership-conflict`
- **Library ID:** `6584fa28-8157-4be1-9faf-ac28d822d595`
- **Experience:** Arc'teryx — Membership Platform
- **Tier:** P1
- **Evidence:** illustrative_scenario

**Answer (spoken):**

One tension in the membership work was how much channel coverage we should promise in the first release.

The appeal of launching broadly was understandable: a customer should recognize one membership wherever they interact with the brand. But native-app parity, store workflows and service integrations didn't all have the same dependencies or readiness.

I mapped the first customer journey with the teams and asked where it would actually break. That moved the discussion from which channel deserved a feature to whether a member could enroll, understand a benefit and receive it successfully.

I recommended protecting that complete journey and phasing the additional surfaces. It meant accepting a less uniform first release, but it gave us a clearer implementation sequence and a more credible customer promise.

My role was to make the trade-off explicit and carry it consistently into scope and planning.

---

### 51. Tell me about a customer experience you improved at HBC.

<a id="simplii-from-5e92bdca-a458-4e00-9e4f-e5034d641a9b-tell-me-ab"></a>

- **Import key:** `simplii-from-5e92bdca-a458-4e00-9e4f-e5034d641a9b`
- **Library ID:** `770e28de-b443-494a-b46c-0655d7d9297a`
- **Experience:** HBC — Mastercard Acquisition
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

At HBC, I worked with Neo Financial on the digital application journey for the HBC Mastercard. Customers were interested enough to start an application, but too many were leaving before finishing, particularly on mobile.

In usability research, we learned that some customers paused to find information or went back to shopping. When they returned, it wasn't obvious how to pick up where they left off, and some assumed they needed to start again.

Instead of just driving more traffic into the funnel, I focused on helping people complete an application they'd already chosen to begin.

We worked with Neo on a secure save-and-resume experience. Neo continued to own sensitive application data, authentication and underwriting. HBC owned the entry and return journey and made the next step clear.

The application completion rate improved by 15% relative to the original experience. The product also offered credit decisions in under three minutes through Neo's underlying capability. I'd keep that separate from the effect of our UX changes.

**Embedded follow-ups (3):**

- **Q:** Walk me through the 15% application completion increase

At HBC, I worked with Neo Financial on the digital application journey for the HBC Mastercard. Customers were interested enough to start an application, but too many were leaving before finishing, particularly on mobile.

In usability research, we learned that some customers paused to find information or went back to shopping. When they returned, it wasn't obvious how to pick up where they left off, and some assumed they needed to start again.

Instead of just driving more traffic into the funnel, I focused on helping people complete an application they'd already chosen to begin.

We worked with Neo on a secure save-and-resume experience. Neo continued to own sensitive application data, authentication and underwriting. HBC owned the entry and return journey and made the next step clear.

The application completion rate improved by 15% relative to the original experience. The product also offered credit decisions in under three minutes through Neo's underlying capability. I'd keep that separate from the effect of our UX changes.

- **Q:** Describe a financial services funnel you improved

At HBC, I worked with Neo Financial on the digital application journey for the HBC Mastercard. Customers were interested enough to start an application, but too many were leaving before finishing, particularly on mobile.

In usability research, we learned that some customers paused to find information or went back to shopping. When they returned, it wasn't obvious how to pick up where they left off, and some assumed they needed to start again.

Instead of just driving more traffic into the funnel, I focused on helping people complete an application they'd already chosen to begin.

We worked with Neo on a secure save-and-resume experience. Neo continued to own sensitive application data, authentication and underwriting. HBC owned the entry and return journey and made the next step clear.

The application completion rate improved by 15% relative to the original experience. The product also offered credit decisions in under three minutes through Neo's underlying capability. I'd keep that separate from the effect of our UX changes.

- **Q:** What was your Neo Financial project?

At HBC, I worked with Neo Financial on the digital application journey for the HBC Mastercard. Customers were interested enough to start an application, but too many were leaving before finishing, particularly on mobile.

In usability research, we learned that some customers paused to find information or went back to shopping. When they returned, it wasn't obvious how to pick up where they left off, and some assumed they needed to start again.

Instead of just driving more traffic into the funnel, I focused on helping people complete an application they'd already chosen to begin.

We worked with Neo on a secure save-and-resume experience. Neo continued to own sensitive application data, authentication and underwriting. HBC owned the entry and return journey and made the next step clear.

The application completion rate improved by 15% relative to the original experience. The product also offered credit decisions in under three minutes through Neo's underlying capability. I'd keep that separate from the effect of our UX changes.

---

### 52. Tell me about a customer problem you solved at RBC.

<a id="simplii-from-f1194ecf-438d-422d-a96f-9c9b69a54fe2-tell-me-ab"></a>

- **Import key:** `simplii-from-f1194ecf-438d-422d-a96f-9c9b69a54fe2`
- **Library ID:** `a503ee2f-e897-4df9-882d-81e49389504e`
- **Experience:** RBC — Cashback Withdrawals
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

A good example is the cashback withdrawal experience at Avion. We were opening the program to people who didn't bank with RBC, but some members could earn cashback without having a practical way to withdraw it to the account they already used.

We looked at support conversations and the actual withdrawal journey. The problem wasn't that people couldn't understand their rewards balance. They could see the money; they couldn't easily get it out.

I worked with engineering and our payments partners on the options, including direct account linking. We ultimately adapted an existing RBC Interac e-Transfer service. It was a faster route to a usable product, although our initial implementation was limited to members with Autodeposit on their email address.

My focus was making that limitation clear and getting the entire payout journey right: eligibility, transaction states, what happened when confirmation was delayed, and how support and finance could investigate a payment.

We enabled over $1 million in annualized cashback withdrawals. I think the important part was that non-RBC members could finally use the value they'd earned without opening another bank account.

**Embedded follow-ups (3):**

- **Q:** Walk me through the Interac launch

A good example is the cashback withdrawal experience at Avion. We were opening the program to people who didn't bank with RBC, but some members could earn cashback without having a practical way to withdraw it to the account they already used.

We looked at support conversations and the actual withdrawal journey. The problem wasn't that people couldn't understand their rewards balance. They could see the money; they couldn't easily get it out.

I worked with engineering and our payments partners on the options, including direct account linking. We ultimately adapted an existing RBC Interac e-Transfer service. It was a faster route to a usable product, although our initial implementation was limited to members with Autodeposit on their email address.

My focus was making that limitation clear and getting the entire payout journey right: eligibility, transaction states, what happened when confirmation was delayed, and how support and finance could investigate a payment.

We enabled over $1 million in annualized cashback withdrawals. I think the important part was that non-RBC members could finally use the value they'd earned without opening another bank account.

- **Q:** What was your most relevant banking product

A good example is the cashback withdrawal experience at Avion. We were opening the program to people who didn't bank with RBC, but some members could earn cashback without having a practical way to withdraw it to the account they already used.

We looked at support conversations and the actual withdrawal journey. The problem wasn't that people couldn't understand their rewards balance. They could see the money; they couldn't easily get it out.

I worked with engineering and our payments partners on the options, including direct account linking. We ultimately adapted an existing RBC Interac e-Transfer service. It was a faster route to a usable product, although our initial implementation was limited to members with Autodeposit on their email address.

My focus was making that limitation clear and getting the entire payout journey right: eligibility, transaction states, what happened when confirmation was delayed, and how support and finance could investigate a payment.

We enabled over $1 million in annualized cashback withdrawals. I think the important part was that non-RBC members could finally use the value they'd earned without opening another bank account.

- **Q:** Describe an end-to-end product launch.

A good example is the cashback withdrawal experience at Avion. We were opening the program to people who didn't bank with RBC, but some members could earn cashback without having a practical way to withdraw it to the account they already used.

We looked at support conversations and the actual withdrawal journey. The problem wasn't that people couldn't understand their rewards balance. They could see the money; they couldn't easily get it out.

I worked with engineering and our payments partners on the options, including direct account linking. We ultimately adapted an existing RBC Interac e-Transfer service. It was a faster route to a usable product, although our initial implementation was limited to members with Autodeposit on their email address.

My focus was making that limitation clear and getting the entire payout journey right: eligibility, transaction states, what happened when confirmation was delayed, and how support and finance could investigate a payment.

We enabled over $1 million in annualized cashback withdrawals. I think the important part was that non-RBC members could finally use the value they'd earned without opening another bank account.

---

### 53. Tell me about a data-driven product decision at Aeroplan.

<a id="simplii-from-c88f487e-e0d1-44c0-ab54-60f1e19fe79d-tell-me-ab"></a>

- **Import key:** `simplii-from-c88f487e-e0d1-44c0-ab54-60f1e19fe79d`
- **Library ID:** `4b3b3513-adb9-4599-bfd3-9aadb483176e`
- **Experience:** Aeroplan — Co-brand Card Acquisition
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

At Aeroplan, I worked on digital acquisition journeys for co-branded cards with TD, CIBC and American Express. We could create interest in an offer, but we weren't always giving members enough information to decide whether it was right for them before handing them over to a bank application.

In the customer research, people understood the welcome-points headline but were less clear about the annual fee, bonus-spend conditions and what would happen after clicking Apply.

I proposed testing a clearer offer summary rather than simply pushing the button higher on the page. There was a trade-off: more information could mean fewer clicks, but perhaps better-qualified applicants.

In the focused test, offer-page click-through actually fell slightly, while bank-side application starts per visitor rose from 10% to 14%, a 40% relative improvement. Completion among those who started held steady.

That convinced me we were improving real progression through the funnel rather than just generating clicks. The much broader 427% year-over-year acquisition growth had several contributors, so I keep that separate from what this experiment established.

**Embedded follow-ups (3):**

- **Q:** Walk me through the 40% conversion increase

At Aeroplan, I worked on digital acquisition journeys for co-branded cards with TD, CIBC and American Express. We could create interest in an offer, but we weren't always giving members enough information to decide whether it was right for them before handing them over to a bank application.

In the customer research, people understood the welcome-points headline but were less clear about the annual fee, bonus-spend conditions and what would happen after clicking Apply.

I proposed testing a clearer offer summary rather than simply pushing the button higher on the page. There was a trade-off: more information could mean fewer clicks, but perhaps better-qualified applicants.

In the focused test, offer-page click-through actually fell slightly, while bank-side application starts per visitor rose from 10% to 14%, a 40% relative improvement. Completion among those who started held steady.

That convinced me we were improving real progression through the funnel rather than just generating clicks. The much broader 427% year-over-year acquisition growth had several contributors, so I keep that separate from what this experiment established.

- **Q:** What did you do for TD/CIBC/Amex card acquisition

At Aeroplan, I worked on digital acquisition journeys for co-branded cards with TD, CIBC and American Express. We could create interest in an offer, but we weren't always giving members enough information to decide whether it was right for them before handing them over to a bank application.

In the customer research, people understood the welcome-points headline but were less clear about the annual fee, bonus-spend conditions and what would happen after clicking Apply.

I proposed testing a clearer offer summary rather than simply pushing the button higher on the page. There was a trade-off: more information could mean fewer clicks, but perhaps better-qualified applicants.

In the focused test, offer-page click-through actually fell slightly, while bank-side application starts per visitor rose from 10% to 14%, a 40% relative improvement. Completion among those who started held steady.

That convinced me we were improving real progression through the funnel rather than just generating clicks. The much broader 427% year-over-year acquisition growth had several contributors, so I keep that separate from what this experiment established.

- **Q:** Describe an experiment with an unexpected result.

At Aeroplan, I worked on digital acquisition journeys for co-branded cards with TD, CIBC and American Express. We could create interest in an offer, but we weren't always giving members enough information to decide whether it was right for them before handing them over to a bank application.

In the customer research, people understood the welcome-points headline but were less clear about the annual fee, bonus-spend conditions and what would happen after clicking Apply.

I proposed testing a clearer offer summary rather than simply pushing the button higher on the page. There was a trade-off: more information could mean fewer clicks, but perhaps better-qualified applicants.

In the focused test, offer-page click-through actually fell slightly, while bank-side application starts per visitor rose from 10% to 14%, a 40% relative improvement. Completion among those who started held steady.

That convinced me we were improving real progression through the funnel rather than just generating clicks. The much broader 427% year-over-year acquisition growth had several contributors, so I keep that separate from what this experiment established.

---

### 54. Tell me about a disagreement with an issuer on the co-brand acquisition experience.

<a id="simplii-john-experience-depth-v1-air-issuer-conflict-tell-me"></a>

- **Import key:** `simplii-john-experience-depth-v1-air-issuer-conflict`
- **Library ID:** `222acaee-1874-4d2b-9ef2-c1481ac2aed2`
- **Experience:** Aeroplan — Co-brand Card Acquisition
- **Tier:** P1
- **Evidence:** illustrative_scenario

**Answer (spoken):**

One tension was how much prominence an issuer's offer should receive versus how consistently we presented the overall set of cards. The issuer wanted its proposition to stand out. From Aeroplan's perspective, the experience also had to help a member make a clear comparison.

I tried to make the discussion specific. We separated the information every card needed to communicate clearly from the details that genuinely differed by offer. That gave us a common structure without forcing different products into identical copy.

I brought the discussion back to the member's decision: could someone understand who the card was for, the main benefit and what happened when they continued? We also agreed that moving more people to an issuer page would not be enough if those people were less qualified or more confused.

The resolution was a consistent comparison structure with room for legitimate offer differences. The lesson was to give partners a concrete way to express their needs while keeping one understandable customer experience.

---

### 55. Tell me about a disagreement you resolved with Neo Financial.

<a id="simplii-john-experience-depth-v1-hbc-neo-disagreement-tell-m"></a>

- **Import key:** `simplii-john-experience-depth-v1-hbc-neo-disagreement`
- **Library ID:** `89c62a66-86f0-4df3-aa94-7e625b5190e0`
- **Experience:** HBC — Mastercard Acquisition
- **Tier:** P1
- **Evidence:** illustrative_scenario

**Answer (spoken):**

We had a disagreement over how much application information HBC should hold to make the return journey easier.

The customer need was straightforward: help someone continue an application. But solving that by duplicating sensitive application data on the retailer side would introduce responsibilities we didn't need to take on.

I reframed the requirement around the customer state and next action. What was the minimum information HBC needed to show a useful path back, while Neo continued to own the secure application and authentication?

That gave us a narrower integration problem and a clearer ownership boundary. My contribution was to preserve the customer outcome while reducing the amount of data and logic we needed to replicate.

It also made the exception discussion more practical: which team owns an expired session, an unavailable status or a submitted application?

---

### 56. Tell me about a product decision you got wrong.

<a id="simplii-john-experience-depth-v1-hbc-quests-failure-tell-me-"></a>

- **Import key:** `simplii-john-experience-depth-v1-hbc-quests-failure`
- **Library ID:** `1da7a8eb-ce49-4e0e-8567-aa2086caebf2`
- **Experience:** HBC — Quests
- **Tier:** P0
- **Evidence:** illustrative_scenario

**Answer (spoken):**

An example I'd use is the early thinking around spending challenges at HBC.

I initially put too much weight on making the challenges accessible and getting people to participate. That seemed reasonable: encourage a useful action, create momentum and build a habit around the card.

The weakness was that some of the people most likely to complete a challenge were already active cardholders. Participation could look healthy while we were paying for behavior that would have happened anyway.

I changed the question from how many people completed the experience to which behavior we were trying to change and whether the incentive created incremental value. That meant more deliberate targeting and looking beyond completions to spending, cost and repeat behavior.

The mistake was in what I treated as early evidence of success. It made me more disciplined about agreeing on the causal question before designing the incentive.

---

### 57. Tell me about a product judgment you would revisit on ShopPlus.

<a id="simplii-john-experience-depth-v1-rbc-shopplus-lesson-tell-me"></a>

- **Import key:** `simplii-john-experience-depth-v1-rbc-shopplus-lesson`
- **Library ID:** `2997e3a5-d79b-4013-be83-62b9c833587b`
- **Experience:** RBC — ShopPlus
- **Tier:** P1
- **Evidence:** illustrative_scenario

**Answer (spoken):**

Early on, I gave installation too much weight compared with the first successful cashback experience.

Downloads were easy to see and made the launch feel tangible. The weaker part of the discussion was what happened next: whether someone kept the extension enabled, understood the offer and received the benefit they expected.

I changed the review around that first valuable use. We separated distribution from successful offer activation and confirmed cashback, then looked at the points where the customer could lose confidence.

That changed the questions I brought into prioritization. Before pushing harder on acquisition, was the next improvement better discovery, clearer expectations or a more reliable journey after activation?

The lesson was to choose a success measure that stays close to the customer's reason for using the product. A distribution milestone still matters, but it should not stand in for evidence that the product is delivering value.

---

### 58. Tell me about a time you cut scope while protecting customer value.

<a id="simplii-jd-007-tell-me-about-a-time-you-cut-scope-while-prot"></a>

- **Import key:** `simplii-jd-007`
- **Library ID:** `b3a281e6-2ea6-44f1-8b03-4fce0b097877`
- **Experience:** Arc'teryx Membership
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

At Arc'teryx, the ambition for membership was broad: connect product ownership, services like repair and trade-in, and member benefits across different touchpoints. Trying to build the entire proposition in one release would have introduced too many dependencies and made it harder to prove value.



My focus was defining a credible North American MVP—what customers would actually be able to do, which services we could fulfil reliably, and which channels could wait. That meant making choices about earning and redemption, existing operating capabilities, and taking a web-first approach rather than making a native-app experience a launch requirement.



The tradeoff was breadth versus a coherent end-to-end experience. I would rather bring forward a smaller proposition with clear eligibility and fulfilment than commit to a launch date around a list of benefits we couldn't operationally support.

**Embedded follow-ups (2):**

- **Q:** What was deferred?

The larger membership enrollment and dashboard journey, broader earning and notification experiences, and dependencies such as point-of-sale enrollment or advanced service workflows belonged to the later program scope. I would check the original release plan before quoting a feature as shipped.

- **Q:** Leadership — Describe a decision a partner disagreed with, what happened, and wh

At Arc'teryx, membership cut across several teams, so people came into it with legitimate but different priorities. From a brand and engagement perspective, a richer launch—with more benefits and more channels—was attractive. From the platform and guest-service side, each additional benefit created eligibility, identity and fulfilment dependencies.

I advocated for an initial web-first, North America-first release and a narrower set of benefits whose end-to-end operations we could support. I made the trade-off visible: adding the native app or a complex redemption wasn't just adding a screen; it added another surface and another fulfilment path to validate, with implications for scope, dates and support.

We used the MVP and investment-planning process to bring those perspectives to a decision rather than letting the broadest wishlist become the roadmap. We preserved the larger membership ambition but separated the foundation from later phases.

What I learned is that people can disagree on scope without disagreeing on the customer vision. The PM's job is to expose the real dependencies, recommend a sequence and make sure stakeholders understand what the first release will and won't accomplish.

---

### 59. Tell me about a time you influenced teams that did not report to you.

<a id="simplii-jd-015-tell-me-about-a-time-you-influenced-teams-tha"></a>

- **Import key:** `simplii-jd-015`
- **Library ID:** `24f6c5a4-c8d1-4363-97cf-f5607e720cf1`
- **Experience:** RBC Cashback Withdrawal
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

RBC's cashback withdrawal launch depended on teams I didn't manage: the enterprise payments group, Risk, Financial Operations and customer-facing operations. The customer problem was clear—non-RBC members had earned cashback and needed a practical way to receive it—but there wasn't a single team that owned the whole journey.



I focused on getting agreement about the end-to-end behaviour before we treated it as a front-end feature: who was eligible, when a withdrawal could be described as complete, and who investigated exceptions when the financial and customer-facing records didn't line up. Using the existing Interac-based enterprise capability gave us a more viable path than building a separate payment service.



The way I influenced those groups was to make the dependencies and decisions concrete. Once everyone could see how their piece affected the customer and operational outcome, we could move the work forward without needing a reporting line.

**Embedded follow-ups (2):**

- **Q:** What specifically did you influence?

I pushed for transaction-status and recovery handling to be part of the MVP rather than a problem to solve after launch. The payment service and Risk partners still owned their respective controls and technical decisions.

- **Q:** RBC — What was the most contentious decision with Payments, Risk or Financial Op

The most difficult part was making the customer promise line up with what the underlying payment service could actually guarantee. A member presses withdraw and expects a clear answer. But the enterprise service accepting the instruction isn't identical to the money being delivered.

That creates different concerns for different teams. Product wants a clear, reassuring experience. Payments needs us to represent the actual transaction state. Risk cares about eligibility and not creating an unsafe repeat instruction, while Finance needs the transaction to be traceable when an exception has to be reconciled.

The decision I pushed toward was separating an acknowledged request from a confirmed payout, with a defined pending state and an exception path rather than a blanket success message. We worked through the customer states alongside the operating process, so customer service could investigate without asking the member to guess whether the transfer had gone through.

For me, the point wasn't to win an argument with a control partner. It was getting all of us to agree what the customer could safely be told at each stage.

---

### 60. Tell me about a time you protected reliability when a stakeholder wanted a faster release.

<a id="simplii-john-experience-depth-v1-arc-crm-tradeoff-tell-me-ab"></a>

- **Import key:** `simplii-john-experience-depth-v1-arc-crm-tradeoff`
- **Library ID:** `0e559768-362c-4a5f-8879-f119fc24ddea`
- **Experience:** Arc'teryx — CRM & Customer Communications
- **Tier:** P1
- **Evidence:** illustrative_scenario

**Answer (spoken):**

A communications release is a good example. The business wanted to preserve the launch date, but part of the journey still depended on a data condition we hadn't validated.

I brought the discussion back to the customer outcome. If the wrong person received the message or the link led to an incomplete experience, meeting the date would create more work for service teams and weaken trust.

Rather than make it a yes-or-no debate, I separated the release into what was ready and what depended on that condition. We kept the ready portion moving and gave the remaining piece a specific validation requirement and owner.

The decision was smaller scope with a clear path to completion. What mattered was being precise enough that the stakeholder could see a workable option, not just a product manager blocking the launch.

---

### 61. Tell me about a time you used customer data to define a problem before proposing a solution.

<a id="simplii-jd-002-tell-me-about-a-time-you-used-customer-data-t"></a>

- **Import key:** `simplii-jd-002`
- **Library ID:** `63b3d26d-1299-4ab2-88da-0db20bda664c`
- **Experience:** HBC Mastercard
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

The HBC Mastercard application journey is a good example. We were focused on acquisition, but I wanted to understand what happened after someone showed interest rather than assume more traffic was the answer. We looked at the application funnel and identified that completion itself was an opportunity.



I worked with our partner team on changes to the application experience, and completions improved by roughly 15%. The important distinction is that I wouldn't attribute the speed of credit decisions to our UI work—that depended on Neo's underwriting and decisioning capabilities.



What I took from that is that acquisition is a sequence of decisions. If customers have enough intent to start an application, fixing the path between intent and completion can be a better use of effort than increasing top-of-funnel spend.

**Embedded follow-ups (2):**

- **Q:** How did you distinguish a design problem from a change in applicant quality?

I would segment applicants by acquisition source, device and eligibility where the data allows, and compare like-for-like cohorts. A blended conversion number alone cannot establish the cause. I would be precise about which validation was actually run.

- **Q:** Discovery — When did evidence overturn a hypothesis you personally preferred?

At HBC, my first instinct with the Mastercard funnel was that we probably had room to improve the quality of traffic entering the application. It was an acquisition product, and when you want more approved cardholders, more qualified starts looks like a logical place to begin.

But when we looked past starts into the application journey, it became clear that we were losing people who had already expressed strong intent. That changed how I thought about the opportunity. Spending more to bring someone into the same friction wasn't the best next move.

I shifted the focus toward the application experience with Neo—what information the customer expected, how they progressed into the partner's process and whether we were making a consequential step feel more complicated than it needed to be. That work was associated with about a 15% improvement in completed applications.

What I learned was to be willing to change the diagnosis, not just tune the execution. A plausible growth idea isn't necessarily the right constraint to attack.

---

### 62. Tell me about building Avion Select from zero to one.

<a id="simplii-from-6458104e-34c6-430c-8005-aef3a3da9c02-tell-me-ab"></a>

- **Import key:** `simplii-from-6458104e-34c6-430c-8005-aef3a3da9c02`
- **Library ID:** `91d9871a-62d8-4b10-9114-238a9dde4a28`
- **Experience:** RBC — Avion Select
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

Avion Select opened the RBC rewards experience to people who weren't RBC banking customers. That sounds like an acquisition change, but it also changed how we thought about identity and access.

The existing experience assumed people could sign in with RBC credentials. For non-RBC members we needed a simpler registration path that still met the bank's security and platform requirements. I worked on the product experience and the onboarding and identity capabilities needed to support it.

The program subsequently reached roughly 500,000 members. I would distinguish that subsequent scale from what we measured at launch. The product lesson for me is that removing an eligibility assumption can open an entirely new audience, but only if the journey behind the sign-up actually works.

---

### 63. Tell me about improving activation for the HBC Mastercard.

<a id="simplii-john-experience-depth-v1-hbc-activation-story-tell-m"></a>

- **Import key:** `simplii-john-experience-depth-v1-hbc-activation-story`
- **Library ID:** `930e5b8d-8643-47bd-8c56-8b7c26ba733c`
- **Experience:** HBC — Post-Approval Activation
- **Tier:** P0
- **Evidence:** illustrative_scenario

**Answer (spoken):**

At HBC, an approved credit-card application wasn't the end of the customer journey. We still needed people to understand the product, make a first purchase and find a reason to use it again.

I looked at the early lifecycle as a sequence of customer decisions. Had the customer received and understood what they needed? Was the first useful action clear? Were we communicating the benefit at a moment when it mattered?

We worked with Neo on onboarding and targeted incentives rather than sending the same message to everyone. My focus was identifying where a customer was in that journey and choosing the next action that would help them progress.

The reported results were an eight-percentage-point improvement in 30-day activation and six points in 90-day repeat-spend retention. I keep those separate from application conversion because they're different customer behaviors.

---

### 64. Tell me about improving the HBC Mastercard application journey.

<a id="simplii-from-140caed9-55a1-48ac-9190-5d2256afd262-tell-me-ab"></a>

- **Import key:** `simplii-from-140caed9-55a1-48ac-9190-5d2256afd262`
- **Library ID:** `995631d2-4fde-40d1-9105-367105ee5790`
- **Experience:** HBC — Mastercard Acquisition
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

At HBC, I worked with Neo Financial on improving the digital credit card application experience.

Credit card applications are interesting because there's a lot of information customers need to provide, and it can be easy to introduce unnecessary friction.

Our focus was making the application journey clearer and easier to complete while preserving the information and controls required by the financial partner.

We used the application funnel to understand where customers were dropping off and prioritized improvements to the experience.

The result was a 15% increase in application completions.

Customers also had access to credit decisions in under three minutes through the integrated experience.

I would distinguish those two outcomes. The conversion improvement was tied to the digital customer journey, while the decisioning capability depended on Neo Financial's underlying credit infrastructure.

The broader lesson for me was that simplifying a regulated financial experience doesn't mean removing the requirements. It means making those requirements easier for customers to understand and complete.

---

### 65. Tell me about launching ShopPlus.

<a id="simplii-john-experience-depth-v1-rbc-shopplus-story-tell-me-"></a>

- **Import key:** `simplii-john-experience-depth-v1-rbc-shopplus-story`
- **Library ID:** `7b6b9f91-22c5-497a-bf26-e77ee4cb869f`
- **Experience:** RBC — ShopPlus
- **Tier:** P0
- **Evidence:** illustrative_scenario

**Answer (spoken):**

ShopPlus brought Avion cashback offers into the shopping journey through a browser extension across Chrome, Edge and Safari.

The customer problem was that a useful offer could be easy to miss if someone had to remember to visit the rewards platform before shopping. An extension could make the benefit visible closer to the purchase decision.

My product focus was making that intervention useful and understandable. The member needed to know whether an offer applied, what action they needed to take and what to expect afterward. We also had to consider the browser experience and the trust involved in installing an extension.

The extension reached more than 100,000 downloads. I would describe that as distribution, not as 100,000 regularly active members.

The deeper question was whether we helped members successfully earn cashback without making shopping more distracting.

---

### 66. Tell me about owning Avion's core web and mobile roadmap.

<a id="simplii-john-experience-depth-v1-rbc-core-story-tell-me-abou"></a>

- **Import key:** `simplii-john-experience-depth-v1-rbc-core-story`
- **Library ID:** `832f80ec-4146-4865-a9ae-402c54e64471`
- **Experience:** RBC — Core Web, Mobile & Travel
- **Tier:** P0
- **Evidence:** illustrative_scenario

**Answer (spoken):**

My remit at Avion covered the core web and mobile experience, with a 15-person cross-functional squad. That meant looking across journeys rather than owning one isolated feature.

The work included opening Avion to non-RBC customers, native travel booking and capabilities that multiple experiences depended on. The challenge was deciding when to improve an individual journey and when to invest in the shared foundation underneath it.

I tried to connect platform work to a specific customer or delivery problem. If identity or a shared component was blocking several journeys, it could deserve priority over a more visible feature. But I also wanted a clear consumer of that capability so we didn't build abstractions without a near-term use.

My role was to set that direction, make dependencies explicit and help the team deliver useful increments while protecting security and reliability.

---

### 67. Tell me about something you took from an idea into a product.

<a id="simplii-from-2a1ed160-bfa6-4f2a-91ea-d280a3ef0418-tell-me-ab"></a>

- **Import key:** `simplii-from-2a1ed160-bfa6-4f2a-91ea-d280a3ef0418`
- **Library ID:** `0f278822-cbaf-4415-9a35-b337f5530b39`
- **Experience:** Arc'teryx — Membership Platform
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

At Arc’teryx, I worked on developing a membership proposition around what happens after someone buys the product. A jacket might last for years, and over that time its owner may need care advice, repairs or trade-in services.

Some of those services already existed, but they lived in separate journeys. Our hypothesis was that we could make them more useful if customers had one clear way to understand what applied to their gear and how to access it.

I helped define the initial member journey, the MVP and the systems needed behind it. That included identity, benefit eligibility, customer profiles and the handoffs into service teams.

We evaluated five vendors and shaped a headless approach instead of building all of those membership capabilities internally. I also worked with the business and Finance on the investment case, and we secured $5.2 million in capital funding.

That was an important product strategy and delivery milestone. I wouldn't present it as proof of member adoption; the broader program still needed to demonstrate that after launch.

**Embedded follow-ups (3):**

- **Q:** Tell me about a zero-to-one platform

At Arc’teryx, I worked on developing a membership proposition around what happens after someone buys the product. A jacket might last for years, and over that time its owner may need care advice, repairs or trade-in services.

Some of those services already existed, but they lived in separate journeys. Our hypothesis was that we could make them more useful if customers had one clear way to understand what applied to their gear and how to access it.

I helped define the initial member journey, the MVP and the systems needed behind it. That included identity, benefit eligibility, customer profiles and the handoffs into service teams.

We evaluated five vendors and shaped a headless approach instead of building all of those membership capabilities internally. I also worked with the business and Finance on the investment case, and we secured $5.2 million in capital funding.

That was an important product strategy and delivery milestone. I wouldn't present it as proof of member adoption; the broader program still needed to demonstrate that after launch.

- **Q:** How did you shape the Arc’teryx membership strategy

At Arc’teryx, I worked on developing a membership proposition around what happens after someone buys the product. A jacket might last for years, and over that time its owner may need care advice, repairs or trade-in services.

Some of those services already existed, but they lived in separate journeys. Our hypothesis was that we could make them more useful if customers had one clear way to understand what applied to their gear and how to access it.

I helped define the initial member journey, the MVP and the systems needed behind it. That included identity, benefit eligibility, customer profiles and the handoffs into service teams.

We evaluated five vendors and shaped a headless approach instead of building all of those membership capabilities internally. I also worked with the business and Finance on the investment case, and we secured $5.2 million in capital funding.

That was an important product strategy and delivery milestone. I wouldn't present it as proof of member adoption; the broader program still needed to demonstrate that after launch.

- **Q:** What did you own?

At Arc’teryx, I worked on developing a membership proposition around what happens after someone buys the product. A jacket might last for years, and over that time its owner may need care advice, repairs or trade-in services.

Some of those services already existed, but they lived in separate journeys. Our hypothesis was that we could make them more useful if customers had one clear way to understand what applied to their gear and how to access it.

I helped define the initial member journey, the MVP and the systems needed behind it. That included identity, benefit eligibility, customer profiles and the handoffs into service teams.

We evaluated five vendors and shaped a headless approach instead of building all of those membership capabilities internally. I also worked with the business and Finance on the investment case, and we secured $5.2 million in capital funding.

That was an important product strategy and delivery milestone. I wouldn't present it as proof of member adoption; the broader program still needed to demonstrate that after launch.

---

### 68. Tell me about something you would do differently in a partner-led product launch.

<a id="simplii-john-experience-depth-v1-air-partner-failure-tell-me"></a>

- **Import key:** `simplii-john-experience-depth-v1-air-partner-failure`
- **Library ID:** `7ffea759-4653-4a72-bbbb-7ad9233d930a`
- **Experience:** Aeroplan — Co-brand Card Acquisition
- **Tier:** P1
- **Evidence:** illustrative_scenario

**Answer (spoken):**

I initially pushed too hard for a uniform experience across partners. The intention was sensible: members should be able to compare offers without learning a different page structure every time. The mistake was treating consistency as if it required every issuer's proposition to fit the same presentation.

That created unnecessary discussion about exceptions before we had separated real customer needs from partner preferences. I stepped back and defined the information that needed to be consistent, such as the main benefit, key conditions and next step. We then allowed flexibility where the products actually differed.

I also changed the review process. Instead of asking partners to react to a large, nearly finished experience, I used a smaller example to surface the disagreements earlier.

The lesson was that standardization should make a decision easier for the customer and delivery easier for the team. When it creates negotiation without improving either, I need to revisit the standard rather than defend it.

---

### 69. Tell me about the commercial partnership work you did at Aeroplan.

<a id="simplii-john-experience-depth-v1-air-commercial-story-tell-m"></a>

- **Import key:** `simplii-john-experience-depth-v1-air-commercial-story`
- **Library ID:** `00f525e1-2a65-417a-95d0-f73ce8a604d6`
- **Experience:** Aeroplan — Commercial Partnerships
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

Before I moved into the product manager role, I worked on Aeroplan's commercial partnerships. My contribution was on the decision side: financial models, business cases and partner pitch materials, including work associated with Uber and Starbucks.

The interesting question was whether a partnership could create a useful new member habit and support a credible commercial return. A recognizable brand was helpful, but we still had to connect the proposition to adoption, transaction frequency and the economics for both businesses.

I helped turn those assumptions into something the team could examine and use in a commercial discussion. That meant making the drivers visible, showing where the case was sensitive and connecting the numbers to a clear member proposition.

The partnerships were associated with more than $4.3 million in combined annual billings in their first twelve months. I describe that as a partnership outcome I contributed to through the commercial work. I was not the sole owner of the partnerships or of that revenue.

---

### 70. Tell me about the financial impact of your work at HBC.

<a id="simplii-from-89ded97e-dc5a-420c-a4ee-a7372c2937a9-tell-me-ab"></a>

- **Import key:** `simplii-from-89ded97e-dc5a-420c-a4ee-a7372c2937a9`
- **Library ID:** `401870f6-95a2-401e-9559-d49e5b8a648d`
- **Experience:** HBC — Cardholder Portfolio & P&L
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

At HBC, I was responsible for the growth roadmap and commercial performance of a Mastercard portfolio with more than 500,000 cardholders.

One of the things that shaped how I approached the role was that acquiring a customer and generating long-term value from that customer are very different problems.

A newly approved cardholder doesn't necessarily become someone who regularly uses the card.

So I looked at customer behaviour across different cohorts to understand how engagement, spending and retention contributed to portfolio value.

That informed how we prioritized lifecycle initiatives and targeted incentives rather than treating every cardholder the same way.

One of the outcomes we tracked was an estimated 10% improvement in customer lifetime value. We also launched Quests, a rules-based engagement platform that drove a 6% lift in incremental cardholder spending.

What I found interesting was balancing short-term engagement with longer-term economics.

A promotion can generate additional purchases, but that doesn't automatically make it profitable. You need to understand the incremental behaviour, the cost of the incentive and whether customers continue using the product after the promotion.

That's the type of commercial thinking I would bring to everyday banking.

---

### 71. Tell me about the native travel booking work at RBC.

<a id="simplii-john-experience-depth-v1-rbc-travel-story-tell-me-ab"></a>

- **Import key:** `simplii-john-experience-depth-v1-rbc-travel-story`
- **Library ID:** `5b0249a5-86ae-4f0b-8649-6d8d34adf486`
- **Experience:** RBC — Core Web, Mobile & Travel
- **Tier:** P1
- **Evidence:** illustrative_scenario

**Answer (spoken):**

Native travel was part of my broader responsibility for Avion's web and mobile experience.

The customer was moving from a rewards environment into a booking journey, and the experience needed to feel coherent across that transition. My focus was the complete task: finding travel, understanding the payment or redemption choice, booking successfully and knowing what happened afterward.

I worked with the delivery and partner teams on the journey, dependencies and what we needed to handle at the boundaries. That included session continuity, loading and error states, and the handoff when a booking needed support.

We delivered native travel booking as part of the core roadmap. I wouldn't attach an unverified conversion lift to it. The product judgment was deciding where a more integrated experience was worth the implementation and ongoing maintenance cost.

---

### 72. Tell me about your CRM and customer communications work at Arc'teryx.

<a id="simplii-john-experience-depth-v1-arc-crm-story-tell-me-about"></a>

- **Import key:** `simplii-john-experience-depth-v1-arc-crm-story`
- **Library ID:** `e9836a6b-e5e5-4683-aadf-136fade590e8`
- **Experience:** Arc'teryx — CRM & Customer Communications
- **Tier:** P0
- **Evidence:** illustrative_scenario

**Answer (spoken):**

Alongside membership, I owned the roadmap for customer communications across global e-commerce and retail, supporting more than 50 million emails annually through Salesforce Marketing Cloud.

The product challenge was making change reliable across a large number of customer journeys. A small release issue can affect a lot of people at that scale, especially when the message relates to an order or a service interaction.

I focused on the release process as part of the product. We made ownership clearer, strengthened QA expectations and automated repeatable checks so quality depended less on someone remembering every step.

The reported outcome was a 25% reduction in deployment failures. I would keep that separate from email deliverability or engagement, which are different measures.

What I liked about that work was its practicality. It improved a system customers already depended on, and it gave the teams a more dependable way to ship.

---

### 73. Tell me exactly how you defined HBC's 30-day activation and 90-day retention.

<a id="simplii-from-4da64bdb-adc3-4baa-8d64-dae4f6ddf6b5-tell-me-ex"></a>

- **Import key:** `simplii-from-4da64bdb-adc3-4baa-8d64-dae4f6ddf6b5`
- **Library ID:** `6a046b95-dd21-4c42-b2b8-6f2e29769725`
- **Experience:** HBC — Post-Approval Activation
- **Tier:** P2
- **Evidence:** resume_supported

**Answer (spoken):**

For 30-day activation, we defined the denominator as newly approved eligible HBC Mastercard accounts in a given approval cohort. The numerator was accounts that completed at least one qualifying purchase within 30 days of approval. The improvement was eight percentage points against our comparison baseline.

For 90-day repeat-spend retention, we tracked the cardholders who activated and looked at whether they made another qualifying purchase in the agreed later observation window, such as days 61 through 90. We kept that starting cohort and the observation window consistent when comparing results, rather than changing the denominator to include only people who were still active. That metric improved six percentage points.

I'd be careful to separate these from the portfolio-level active-cardholder rate. Activation measures early first use, repeat-spend retention looks at whether the behaviour continues, and portfolio activity is a broader population measure. Each can improve for different reasons, so I wouldn't interchange them.

**Embedded follow-ups (4):**

- **Q:** HBC 8pp

For 30-day activation, we defined the denominator as newly approved eligible HBC Mastercard accounts in a given approval cohort. The numerator was accounts that completed at least one qualifying purchase within 30 days of approval. The improvement was eight percentage points against our comparison baseline.

For 90-day repeat-spend retention, we tracked the cardholders who activated and looked at whether they made another qualifying purchase in the agreed later observation window, such as days 61 through 90. We kept that starting cohort and the observation window consistent when comparing results, rather than changing the denominator to include only people who were still active. That metric improved six percentage points.

I'd be careful to separate these from the portfolio-level active-cardholder rate. Activation measures early first use, repeat-spend retention looks at whether the behaviour continues, and portfolio activity is a broader population measure. Each can improve for different reasons, so I wouldn't interchange them.

- **Q:** HBC 6pp

For 30-day activation, we defined the denominator as newly approved eligible HBC Mastercard accounts in a given approval cohort. The numerator was accounts that completed at least one qualifying purchase within 30 days of approval. The improvement was eight percentage points against our comparison baseline.

For 90-day repeat-spend retention, we tracked the cardholders who activated and looked at whether they made another qualifying purchase in the agreed later observation window, such as days 61 through 90. We kept that starting cohort and the observation window consistent when comparing results, rather than changing the denominator to include only people who were still active. That metric improved six percentage points.

I'd be careful to separate these from the portfolio-level active-cardholder rate. Activation measures early first use, repeat-spend retention looks at whether the behaviour continues, and portfolio activity is a broader population measure. Each can improve for different reasons, so I wouldn't interchange them.

- **Q:** Activation definition

For 30-day activation, we defined the denominator as newly approved eligible HBC Mastercard accounts in a given approval cohort. The numerator was accounts that completed at least one qualifying purchase within 30 days of approval. The improvement was eight percentage points against our comparison baseline.

For 90-day repeat-spend retention, we tracked the cardholders who activated and looked at whether they made another qualifying purchase in the agreed later observation window, such as days 61 through 90. We kept that starting cohort and the observation window consistent when comparing results, rather than changing the denominator to include only people who were still active. That metric improved six percentage points.

I'd be careful to separate these from the portfolio-level active-cardholder rate. Activation measures early first use, repeat-spend retention looks at whether the behaviour continues, and portfolio activity is a broader population measure. Each can improve for different reasons, so I wouldn't interchange them.

- **Q:** Repeat-spend retention definition

For 30-day activation, we defined the denominator as newly approved eligible HBC Mastercard accounts in a given approval cohort. The numerator was accounts that completed at least one qualifying purchase within 30 days of approval. The improvement was eight percentage points against our comparison baseline.

For 90-day repeat-spend retention, we tracked the cardholders who activated and looked at whether they made another qualifying purchase in the agreed later observation window, such as days 61 through 90. We kept that starting cohort and the observation window consistent when comparing results, rather than changing the denominator to include only people who were still active. That metric improved six percentage points.

I'd be careful to separate these from the portfolio-level active-cardholder rate. Activation measures early first use, repeat-spend retention looks at whether the behaviour continues, and portfolio activity is a broader population measure. Each can improve for different reasons, so I wouldn't interchange them.

---

### 74. Tell me more about your time at Air Canada and Aeroplan.

<a id="simplii-john-experience-depth-v1-air-overview-tell-me-more-a"></a>

- **Import key:** `simplii-john-experience-depth-v1-air-overview`
- **Library ID:** `eba5f488-6c47-4acb-bc2c-a7ed6550f5e2`
- **Experience:** Air Canada / Aeroplan — Employer Overview
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

At Air Canada and Aeroplan, I started in commercial strategy and then moved into product management focused on growth and partnerships.

In the product role, I worked on digital acquisition for co-branded credit cards with TD, CIBC and American Express. My focus was the journey from discovering an offer to progressing through the application, including the handoff to the bank.

We used segmentation and funnel experimentation to improve application conversion by 40%. That contributed to broader cardholder acquisition growth, alongside marketing, distribution and other commercial factors.

Earlier, in commercial strategy, I built financial models, business cases and pitch materials to evaluate partnerships, including Uber and Starbucks.

That progression shaped how I work as a PM. I'm comfortable with the commercial question of whether an opportunity is worth pursuing, and with the product work needed to turn that opportunity into a customer experience.

---

### 75. Tell me more about your time at Arc'teryx.

<a id="simplii-john-experience-depth-v1-arc-overview-tell-me-more-a"></a>

- **Import key:** `simplii-john-experience-depth-v1-arc-overview`
- **Library ID:** `fedfd600-9285-49c6-a03a-4e157c69fa1f`
- **Experience:** Arc'teryx — Employer Overview
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

At Arc'teryx, my role covered two quite different product challenges: building a new membership proposition and improving the customer platforms already supporting the business.

On membership, I owned the strategy and roadmap, from the customer proposition and MVP through to identity, benefit eligibility and service integrations. I helped secure $5.2 million in capital funding and led an evaluation of five vendors to shape the platform approach.

I also owned customer communications across global e-commerce and retail. That operation supported more than 50 million emails a year, so reliability and the way teams released changes mattered a lot. We reduced deployment failures by 25% through stronger QA governance and automation.

The role gave me experience making investment decisions while staying close to the practical details of delivery. The membership work is a good example of strategy and cross-team alignment; the CRM work shows how I improve an established operation.

---

### 76. Tell me more about your time at HBC.

<a id="simplii-john-experience-depth-v1-hbc-overview-tell-me-more-a"></a>

- **Import key:** `simplii-john-experience-depth-v1-hbc-overview`
- **Library ID:** `36167e36-b5c4-4109-95fe-001c05206ccb`
- **Experience:** HBC — Employer Overview
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

At HBC, I managed growth and financial products around the HBC Mastercard, working closely with Neo Financial.

My remit covered the customer lifecycle: improving the application journey, helping approved customers start using the card, and increasing repeat engagement across a portfolio of more than 500,000 cardholders.

On acquisition, we used funnel analysis and iterative improvements to increase application completions by 15%. On the existing portfolio, I worked on activation, lifecycle incentives and commercial performance, including the Quests engagement platform.

What I found interesting was the connection between customer behavior and the economics. An approved account still needs to become an active customer, and an incentive needs to generate enough incremental value to justify its cost.

That meant working across product, analytics and our financial partner, while being clear about which decisions HBC owned and which belonged to the issuer. I can go deeper into the Neo application experience, activation and retention, or the portfolio economics.

---

### 77. Tell me more about your time at RBC.

<a id="simplii-john-experience-depth-v1-rbc-overview-tell-me-more-a"></a>

- **Import key:** `simplii-john-experience-depth-v1-rbc-overview`
- **Library ID:** `2ab3eefa-48ac-46d2-ba59-0e2178344e11`
- **Experience:** RBC — Employer Overview
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

At RBC, I was a Senior Product Manager on Avion Rewards, owning the core web and mobile roadmap and leading a 15-person cross-functional squad.

A major theme was expanding Avion beyond existing RBC banking customers. I worked on Avion Select, including new onboarding and identity capabilities, and on Interac e-Transfer cashback withdrawals so non-RBC members could receive the rewards they earned.

For payouts, I owned the consumer requirements and coordinated with the payments team, AML, Risk and Financial Operations. That capability enabled more than $1 million in annualized withdrawals.

My broader remit included native travel booking, shared platform capabilities and the ShopPlus browser extension. So I had to balance growth opportunities with security, reliability and the operational requirements of a bank.

The payments story is particularly relevant to everyday banking, but the wider role was about making a connected customer experience work across multiple channels and teams.

---

### 78. Walk me through a user story for a failed Interac e-Transfer or cashback withdrawal.

<a id="simplii-jd-005-walk-me-through-a-user-story-for-a-failed-int"></a>

- **Import key:** `simplii-jd-005`
- **Library ID:** `d9d5651f-3682-4677-b9a1-785affa4ec3d`
- **Experience:** RBC Cashback Withdrawal
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

I'd start with the customer expectation: they requested money and need to know whether it arrived, failed or is still being checked. The story would define the statuses we can support from the actual payment service, not from a front-end timer.

I'd specify eligibility and request validation, when funds can be released, what happens on a timeout, how we prevent duplicate requests, what events get logged for finance and support, and what message a customer sees in each state. I'd include cases where an email address has changed or Autodeposit is not enabled, because those were relevant to the Avion withdrawal design.

Acceptance means the status is accurate across the customer interface and operational records, and the member has a safe next step. It's not enough for the happy-path API to return a 200 response.

**Embedded follow-ups (2):**

- **Q:** What would you refuse to leave for post-launch?

Correct transaction state, duplicate prevention, accurate customer status and support visibility. Cosmetic refinements can wait; the ability to determine where someone’s money is cannot.

- **Q:** RBC — After a timeout, how do you prevent duplicates and establish payment statu

The first rule is that a timeout is not a declined payment. It means the customer-facing service didn't receive a conclusive response. The instruction may still be processing, and treating that as a failure can create a second payout.

So before launch, I'd want the withdrawal requirement to cover an uncertain outcome explicitly. When the request is initiated, the journey needs a stable reference that can be traced end to end. If we lose the response, we show the customer that the withdrawal is being checked rather than encouraging a new submission.

On the service side, I'd work with the payments owners to confirm how duplicate protection and authoritative status are actually supported. Ideally a retry against the same business request can't move money twice, and there is a reliable way to reconcile the original instruction to its final outcome.

My job is to insist that the contract, customer states, support path and acceptance criteria address that failure mode. The enterprise team decides how the mechanism is implemented, because I don't own their payment architecture.

---

### 79. Walk me through the Interac e-Transfer product you launched at RBC.

<a id="simplii-from-244e239c-2f88-4b6e-968f-ef8ce65daa70-walk-me-th"></a>

- **Import key:** `simplii-from-244e239c-2f88-4b6e-968f-ef8ce65daa70`
- **Library ID:** `ea4c3415-7869-41d4-aa6e-b6dc49d44fec`
- **Experience:** RBC — Cashback Withdrawals
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

At RBC, one of the products I worked on was enabling cashback withdrawals for Avion members who weren't RBC banking customers.

The challenge was that these members could earn cashback, but we needed a way for them to receive that money without requiring an RBC bank account.

We decided to use Interac e-Transfer and adapt an existing enterprise payments capability rather than building a completely separate payment service.

My role was owning the consumer product requirements and coordinating the dependencies across teams, including AML, Risk, Financial Operations and the payments service.

There were a few important considerations. We needed eligibility rules to determine which members could withdraw, transaction limits, a reliable way to initiate the payout and an operational process for settlement and reconciliation.

We also needed the customer experience to be clear about what was happening with their money.

The product ultimately supported over $1 million in annualized cashback withdrawals. It leveraged a broader enterprise payments service that supported more than five million settlement events annually.

What I took away from that experience is that launching a payment feature isn't just about making an API call. The real work is making sure the product behaves predictably across customer experience, risk controls and financial operations.

---

### 80. Walk me through the Quests product you launched at HBC.

<a id="simplii-john-experience-depth-v1-hbc-quests-story-walk-me-th"></a>

- **Import key:** `simplii-john-experience-depth-v1-hbc-quests-story`
- **Library ID:** `38bfeea0-4320-4cef-9472-8e7729cb5dd5`
- **Experience:** HBC — Quests
- **Tier:** P0
- **Evidence:** illustrative_scenario

**Answer (spoken):**

Quests was a rules-based engagement platform for delivering targeted promotional journeys in HBC's digital ecosystem.

The opportunity was to make engagement more relevant to where a customer was in the relationship. An active cardholder, a newer customer and someone whose activity had declined didn't necessarily need the same prompt or incentive.

My product focus was defining the behavior we wanted to influence, which customers should be eligible and how the experience would make the next action clear. That needed to connect with the economics: the incentive had to generate enough additional value to justify its cost.

The platform operated across an eligible mobile audience of more than six million, and the reported result was a six-percent lift in incremental cardholder spend.

I keep the audience figure, the cardholder population and the measured spend effect distinct. They describe different parts of the product.

---

### 81. Walk me through your most recent work on the Arc'teryx membership platform.

<a id="simplii-from-1fd9478b-7396-4778-bc00-e62aee52de52-walk-me-th"></a>

- **Import key:** `simplii-from-1fd9478b-7396-4778-bc00-e62aee52de52`
- **Library ID:** `173d1033-d882-4e4b-8a0f-d55a074622fe`
- **Experience:** Career & Product Experience
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

At Arc'teryx, I led the product strategy for a new membership proposition. We had to bring together experiences like registration, benefits, gear ownership, repair, resale and events, while figuring out which existing systems should provide those capabilities.

I helped define the MVP, evaluate platform options and build the $5.2 million investment case. The larger membership initiative and its supporting platforms involved multiple teams and dependencies, so sequencing mattered as much as the feature list.

We also had a more immediate need around the Sperro SV product launch. Rather than hold the relevant member benefits until the broader platform was ready, we separated out a smaller release and coordinated the benefits, fulfilment and registration dependencies. The broader MVP was planned separately.

I think the meaningful product decision was getting clear about what could genuinely deliver customer value now, what required additional infrastructure, and how not to promise benefits we couldn't reliably fulfil.

**Embedded follow-ups (7):**

- **Q:** What are you working on right now?

One of the more interesting things I've been working on recently is tied to the launch of the Sperro SV, which is Arc'teryx's first circular hardshell.

For context, I've been leading the development of a broader membership program at Arc'teryx. The vision is to build a deeper relationship with customers beyond the initial purchase, particularly around gear ownership, product care, repairs and community experiences.

We'd secured about $5.2 million in funding for that program, but it's a fairly substantial platform build with dependencies across commerce, identity, customer service and our ReBIRD circularity operations.

The interesting challenge came when we needed to support the Sperro SV launch. The full membership platform wasn't going to be ready in time, but there were some genuinely valuable benefits we still wanted to offer customers buying the jacket.

So rather than trying to accelerate the entire membership roadmap, we made the decision to carve out a smaller, more focused release.

That included three years of unlimited out-of-warranty repairs, access to exclusive community events and an opportunity to win a Global Academy experience.

My focus was figuring out how to deliver those benefits independently of the larger platform, while making sure the customer experience and the operational teams behind it were actually ready.

That meant working closely with ReBIRD, customer service and the teams responsible for the jacket's digital product passport, while being really deliberate about what we owned and what needed to remain part of the longer-term membership roadmap.

We were able to support the September launch without having to wait for the entire membership platform.

For me, it was a good example of something that comes up quite often in product management. You can have a compelling long-term vision, but sometimes the right decision is to reduce scope, isolate the most valuable experience and deliver that well rather than trying to do everything at once.

- **Q:** Tell me about your current role.

One of the more interesting things I've been working on recently is tied to the launch of the Sperro SV, which is Arc'teryx's first circular hardshell.

For context, I've been leading the development of a broader membership program at Arc'teryx. The vision is to build a deeper relationship with customers beyond the initial purchase, particularly around gear ownership, product care, repairs and community experiences.

We'd secured about $5.2 million in funding for that program, but it's a fairly substantial platform build with dependencies across commerce, identity, customer service and our ReBIRD circularity operations.

The interesting challenge came when we needed to support the Sperro SV launch. The full membership platform wasn't going to be ready in time, but there were some genuinely valuable benefits we still wanted to offer customers buying the jacket.

So rather than trying to accelerate the entire membership roadmap, we made the decision to carve out a smaller, more focused release.

That included three years of unlimited out-of-warranty repairs, access to exclusive community events and an opportunity to win a Global Academy experience.

My focus was figuring out how to deliver those benefits independently of the larger platform, while making sure the customer experience and the operational teams behind it were actually ready.

That meant working closely with ReBIRD, customer service and the teams responsible for the jacket's digital product passport, while being really deliberate about what we owned and what needed to remain part of the longer-term membership roadmap.

We were able to support the September launch without having to wait for the entire membership platform.

For me, it was a good example of something that comes up quite often in product management. You can have a compelling long-term vision, but sometimes the right decision is to reduce scope, isolate the most valuable experience and deliver that well rather than trying to do everything at once.

- **Q:** What's the latest product initiative you're leading?

One of the more interesting things I've been working on recently is tied to the launch of the Sperro SV, which is Arc'teryx's first circular hardshell.

For context, I've been leading the development of a broader membership program at Arc'teryx. The vision is to build a deeper relationship with customers beyond the initial purchase, particularly around gear ownership, product care, repairs and community experiences.

We'd secured about $5.2 million in funding for that program, but it's a fairly substantial platform build with dependencies across commerce, identity, customer service and our ReBIRD circularity operations.

The interesting challenge came when we needed to support the Sperro SV launch. The full membership platform wasn't going to be ready in time, but there were some genuinely valuable benefits we still wanted to offer customers buying the jacket.

So rather than trying to accelerate the entire membership roadmap, we made the decision to carve out a smaller, more focused release.

That included three years of unlimited out-of-warranty repairs, access to exclusive community events and an opportunity to win a Global Academy experience.

My focus was figuring out how to deliver those benefits independently of the larger platform, while making sure the customer experience and the operational teams behind it were actually ready.

That meant working closely with ReBIRD, customer service and the teams responsible for the jacket's digital product passport, while being really deliberate about what we owned and what needed to remain part of the longer-term membership roadmap.

We were able to support the September launch without having to wait for the entire membership platform.

For me, it was a good example of something that comes up quite often in product management. You can have a compelling long-term vision, but sometimes the right decision is to reduce scope, isolate the most valuable experience and deliver that well rather than trying to do everything at once.

- **Q:** Can you tell me more about your time at Arc'teryx?

One of the more interesting things I've been working on recently is tied to the launch of the Sperro SV, which is Arc'teryx's first circular hardshell.

For context, I've been leading the development of a broader membership program at Arc'teryx. The vision is to build a deeper relationship with customers beyond the initial purchase, particularly around gear ownership, product care, repairs and community experiences.

We'd secured about $5.2 million in funding for that program, but it's a fairly substantial platform build with dependencies across commerce, identity, customer service and our ReBIRD circularity operations.

The interesting challenge came when we needed to support the Sperro SV launch. The full membership platform wasn't going to be ready in time, but there were some genuinely valuable benefits we still wanted to offer customers buying the jacket.

So rather than trying to accelerate the entire membership roadmap, we made the decision to carve out a smaller, more focused release.

That included three years of unlimited out-of-warranty repairs, access to exclusive community events and an opportunity to win a Global Academy experience.

My focus was figuring out how to deliver those benefits independently of the larger platform, while making sure the customer experience and the operational teams behind it were actually ready.

That meant working closely with ReBIRD, customer service and the teams responsible for the jacket's digital product passport, while being really deliberate about what we owned and what needed to remain part of the longer-term membership roadmap.

We were able to support the September launch without having to wait for the entire membership platform.

For me, it was a good example of something that comes up quite often in product management. You can have a compelling long-term vision, but sometimes the right decision is to reduce scope, isolate the most valuable experience and deliver that well rather than trying to do everything at once.

- **Q:** What's happening with the membership program?

One of the more interesting things I've been working on recently is tied to the launch of the Sperro SV, which is Arc'teryx's first circular hardshell.

For context, I've been leading the development of a broader membership program at Arc'teryx. The vision is to build a deeper relationship with customers beyond the initial purchase, particularly around gear ownership, product care, repairs and community experiences.

We'd secured about $5.2 million in funding for that program, but it's a fairly substantial platform build with dependencies across commerce, identity, customer service and our ReBIRD circularity operations.

The interesting challenge came when we needed to support the Sperro SV launch. The full membership platform wasn't going to be ready in time, but there were some genuinely valuable benefits we still wanted to offer customers buying the jacket.

So rather than trying to accelerate the entire membership roadmap, we made the decision to carve out a smaller, more focused release.

That included three years of unlimited out-of-warranty repairs, access to exclusive community events and an opportunity to win a Global Academy experience.

My focus was figuring out how to deliver those benefits independently of the larger platform, while making sure the customer experience and the operational teams behind it were actually ready.

That meant working closely with ReBIRD, customer service and the teams responsible for the jacket's digital product passport, while being really deliberate about what we owned and what needed to remain part of the longer-term membership roadmap.

We were able to support the September launch without having to wait for the entire membership platform.

For me, it was a good example of something that comes up quite often in product management. You can have a compelling long-term vision, but sometimes the right decision is to reduce scope, isolate the most valuable experience and deliver that well rather than trying to do everything at once.

- **Q:** Tell me about the Sperro SV launch.

One of the more interesting things I've been working on recently is tied to the launch of the Sperro SV, which is Arc'teryx's first circular hardshell.

For context, I've been leading the development of a broader membership program at Arc'teryx. The vision is to build a deeper relationship with customers beyond the initial purchase, particularly around gear ownership, product care, repairs and community experiences.

We'd secured about $5.2 million in funding for that program, but it's a fairly substantial platform build with dependencies across commerce, identity, customer service and our ReBIRD circularity operations.

The interesting challenge came when we needed to support the Sperro SV launch. The full membership platform wasn't going to be ready in time, but there were some genuinely valuable benefits we still wanted to offer customers buying the jacket.

So rather than trying to accelerate the entire membership roadmap, we made the decision to carve out a smaller, more focused release.

That included three years of unlimited out-of-warranty repairs, access to exclusive community events and an opportunity to win a Global Academy experience.

My focus was figuring out how to deliver those benefits independently of the larger platform, while making sure the customer experience and the operational teams behind it were actually ready.

That meant working closely with ReBIRD, customer service and the teams responsible for the jacket's digital product passport, while being really deliberate about what we owned and what needed to remain part of the longer-term membership roadmap.

We were able to support the September launch without having to wait for the entire membership platform.

For me, it was a good example of something that comes up quite often in product management. You can have a compelling long-term vision, but sometimes the right decision is to reduce scope, isolate the most valuable experience and deliver that well rather than trying to do everything at once.

- **Q:** What have you been focused on recently?

One of the more interesting things I've been working on recently is tied to the launch of the Sperro SV, which is Arc'teryx's first circular hardshell.

For context, I've been leading the development of a broader membership program at Arc'teryx. The vision is to build a deeper relationship with customers beyond the initial purchase, particularly around gear ownership, product care, repairs and community experiences.

We'd secured about $5.2 million in funding for that program, but it's a fairly substantial platform build with dependencies across commerce, identity, customer service and our ReBIRD circularity operations.

The interesting challenge came when we needed to support the Sperro SV launch. The full membership platform wasn't going to be ready in time, but there were some genuinely valuable benefits we still wanted to offer customers buying the jacket.

So rather than trying to accelerate the entire membership roadmap, we made the decision to carve out a smaller, more focused release.

That included three years of unlimited out-of-warranty repairs, access to exclusive community events and an opportunity to win a Global Academy experience.

My focus was figuring out how to deliver those benefits independently of the larger platform, while making sure the customer experience and the operational teams behind it were actually ready.

That meant working closely with ReBIRD, customer service and the teams responsible for the jacket's digital product passport, while being really deliberate about what we owned and what needed to remain part of the longer-term membership roadmap.

We were able to support the September launch without having to wait for the entire membership platform.

For me, it was a good example of something that comes up quite often in product management. You can have a compelling long-term vision, but sometimes the right decision is to reduce scope, isolate the most valuable experience and deliver that well rather than trying to do everything at once.

---

### 82. Walk me through your ownership of Aeroplan's co-brand acquisition work.

<a id="simplii-john-experience-depth-v1-air-acquisition-ownership-w"></a>

- **Import key:** `simplii-john-experience-depth-v1-air-acquisition-ownership`
- **Library ID:** `bde103c7-4a5f-4fe8-a92a-bfdba3ae3664`
- **Experience:** Aeroplan — Co-brand Card Acquisition
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

I worked on the acquisition experience for Aeroplan's co-brand credit cards with TD, CIBC and American Express. The product challenge was to help members understand the available propositions and move into the right issuer application journey with less friction.

My focus was the digital journey and the coordination required to improve it. I had to connect the member experience on our side with the requirements and constraints of the issuer partners. That meant being clear about what Aeroplan could change directly and what required a partner decision.

The work was associated with a 40% improvement in application conversion and contributed to broader acquisition growth. I separate that journey result from the 427% year-over-year growth figure because the latter reflects a much wider set of influences.

The experience taught me that partner-led acquisition is both a customer problem and a coordination problem. A clearer page helps, but the handoff, the offer and the issuer experience have to support the same promise.

---

### 83. What assumptions in the $5.2 million investment case were most sensitive?

<a id="simplii-from-efc27de7-507e-4d96-b95d-446de1f5badf-what-assum"></a>

- **Import key:** `simplii-from-efc27de7-507e-4d96-b95d-446de1f5badf`
- **Library ID:** `98320790-b5c9-40c8-8f43-0c42d0215d41`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd distinguish the investment decision from a proven return, because much of the value was still forecast. For a membership platform, the sensitive assumptions are likely adoption, incremental engagement with services, long-term retention, and the cost and sequencing of integrations.

I would want Finance to see a range, not a single precise-looking outcome. What happens if member adoption is slower, integration costs rise, or the value comes later than expected?

Our work established enough confidence to obtain approval, but I wouldn't present those forecasts as realized benefits. In a panel discussion, I'd focus on how we made the trade-offs visible and what we'd need to validate after launch.

---

### 84. What did you actually change to improve HBC card activation?

<a id="simplii-john-experience-depth-v1-hbc-activation-actions-what"></a>

- **Import key:** `simplii-john-experience-depth-v1-hbc-activation-actions`
- **Library ID:** `134698dc-e556-48f1-ba3b-b9504b56f51a`
- **Experience:** HBC — Post-Approval Activation
- **Tier:** P1
- **Evidence:** illustrative_scenario

**Answer (spoken):**

The approach was to stop treating every newly approved customer as though they needed the same prompt.

I separated customers who hadn't reached a first purchase from those who had started using the card but hadn't repeated. For the first group, the priority was a clear next step and an understandable reason to use the card. For the second, it was reinforcing value after that initial experience.

I worked with the partner and internal teams on the eligibility, message timing and incentive conditions. The important product decision was matching the treatment to the barrier rather than simply increasing the number of messages.

I also wanted us to evaluate each step independently. A stronger first-purchase result could hide weak repeat behavior, so we needed both views to judge whether the lifecycle was improving.

---

### 85. What did you control in the HBC card portfolio, and what was controlled by Neo?

<a id="simplii-from-4333a9f3-b07d-4d8e-8676-6a7ca9012116-what-did-y"></a>

- **Import key:** `simplii-from-4333a9f3-b07d-4d8e-8676-6a7ca9012116`
- **Library ID:** `1a008ec9-b048-4a8d-b5d0-7b5a1ff689bc`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I owned the product growth roadmap and commercial decisions within the digital ecosystem, not the bank's credit underwriting or the entire lending an account-insights dashboard.

Our Neo partnership meant decisions needed clear boundaries: what the retailer could change in acquisition and engagement, what the issuing partner owned in credit decisioning and operational controls, and where we had to coordinate changes.

When I talk about financial impact, I'm referring to the cardholder growth and engagement initiatives we influenced. I wouldn't suggest I personally set credit policy or that the approval speed came from my UX redesign. That distinction is important when translating the experience into everyday banking.

---

### 86. What did you cut from the membership MVP, and how did you defend those trade-offs?

<a id="simplii-from-31d8ded4-7dc2-4d0b-ad30-009b1f92748b-what-did-y"></a>

- **Import key:** `simplii-from-31d8ded4-7dc2-4d0b-ad30-009b1f92748b`
- **Library ID:** `d003b2d2-2d20-4b31-b374-5bc358df7116`
- **Experience:** Career & Product Experience
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

I was trying to protect a coherent first member experience without making the platform dependent on every possible channel and operational integration. The essential journey was enrollment, a view of membership and gear, clear benefits and a practical way for service teams to support members.

Capabilities like deeper store enrollment, full native-app parity and advanced service workflows could come later if their dependencies weren't ready. That's a different decision from saying they had no value.

I'd explain the trade-off in terms of customer journeys enabled, dependency risk and whether the MVP could actually be measured. The useful lesson was that 'smaller' only works if the remaining experience is still complete enough to create value.

---

### 87. What did you deliver at Arc'teryx, and what remained planned?

<a id="simplii-john-experience-depth-v1-arc-delivered-scope-what-di"></a>

- **Import key:** `simplii-john-experience-depth-v1-arc-delivered-scope`
- **Library ID:** `d51d8579-2c91-405b-87e9-e894e02b0759`
- **Experience:** Arc'teryx — Membership Platform
- **Tier:** P0
- **Evidence:** unverified_detail

**Answer (spoken):**

I'd separate the membership program from the established CRM work because they were at different stages.

For membership, the outcomes I can speak to are the customer proposition, MVP and integration requirements, the platform evaluation and the $5.2 million capital approval. I wouldn't present that as a fully launched program with proven member adoption.

In CRM, I was working with an existing operation supporting more than 50 million annual emails, and the QA and automation work reduced deployment failures by 25%.

There was also work on sequencing a smaller set of benefits independently of the full membership platform. The important boundary is what I personally led versus what the wider organization ultimately launched. I would anchor any specific launch claim to that ownership and timeline rather than imply that all of the broader program was live.

---

### 88. What did you own at HBC versus Neo Financial?

<a id="simplii-john-experience-depth-v1-hbc-ownership-boundaries-wh"></a>

- **Import key:** `simplii-john-experience-depth-v1-hbc-ownership-boundaries`
- **Library ID:** `463e686a-fa86-4b4b-a6d6-fd68426dc57d`
- **Experience:** HBC — Cardholder Portfolio & P&L
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

I owned product growth decisions within HBC's digital financial-services ecosystem: the customer journeys, roadmap priorities and the commercial trade-offs around acquisition and engagement.

Neo owned important issuer capabilities, including credit decisioning and the secure financial application. I wouldn't describe myself as owning underwriting policy or the bank's entire balance sheet.

That distinction matters when discussing results. The 15% application-completion improvement relates to the customer journey. Credit decisions in under three minutes depended on Neo's underlying capability. Portfolio-level engagement and modeled lifetime value also need their own definitions and evidence.

The product work was connecting those responsibilities into one understandable experience, influencing the partner-dependent pieces and being precise about what I could decide directly.

---

### 89. What did you personally decide on the Aeroplan card offer test?

<a id="simplii-from-2e58d329-4b40-4142-bf45-67504474f730-what-did-y"></a>

- **Import key:** `simplii-from-2e58d329-4b40-4142-bf45-67504474f730`
- **Library ID:** `4e19ed6c-9989-4a34-b25b-01615fa388d4`
- **Experience:** Aeroplan — Co-brand Card Acquisition
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

The key decision was to use confirmed bank-side application starts per unique offer-page visitor as the primary success measure, rather than Aeroplan-to-bank click-through.

I worked with the issuer to get aggregate results by experiment variant. We didn't need the customer's full bank application details to understand whether visitors from each version actually made progress.

That choice mattered when the results came back. Click-through went from 30% to 28%, which could have looked negative if we'd stopped there. But application starts per visitor increased from 10% to 14%, and completion among starters held at 70%.

I recommended rolling out the revised experience for that offer, while keeping expansion to other issuers and card types dependent on further testing.

**Embedded follow-ups (3):**

- **Q:** What was your contribution

The key decision was to use confirmed bank-side application starts per unique offer-page visitor as the primary success measure, rather than Aeroplan-to-bank click-through.

I worked with the issuer to get aggregate results by experiment variant. We didn't need the customer's full bank application details to understand whether visitors from each version actually made progress.

That choice mattered when the results came back. Click-through went from 30% to 28%, which could have looked negative if we'd stopped there. But application starts per visitor increased from 10% to 14%, and completion among starters held at 70%.

I recommended rolling out the revised experience for that offer, while keeping expansion to other issuers and card types dependent on further testing.

- **Q:** What metric did you choose

The key decision was to use confirmed bank-side application starts per unique offer-page visitor as the primary success measure, rather than Aeroplan-to-bank click-through.

I worked with the issuer to get aggregate results by experiment variant. We didn't need the customer's full bank application details to understand whether visitors from each version actually made progress.

That choice mattered when the results came back. Click-through went from 30% to 28%, which could have looked negative if we'd stopped there. But application starts per visitor increased from 10% to 14%, and completion among starters held at 70%.

I recommended rolling out the revised experience for that offer, while keeping expansion to other issuers and card types dependent on further testing.

- **Q:** How did you work with the issuer?

The key decision was to use confirmed bank-side application starts per unique offer-page visitor as the primary success measure, rather than Aeroplan-to-bank click-through.

I worked with the issuer to get aggregate results by experiment variant. We didn't need the customer's full bank application details to understand whether visitors from each version actually made progress.

That choice mattered when the results came back. Click-through went from 30% to 28%, which could have looked negative if we'd stopped there. But application starts per visitor increased from 10% to 14%, and completion among starters held at 70%.

I recommended rolling out the revised experience for that offer, while keeping expansion to other issuers and card types dependent on further testing.

---

### 90. What did you personally decide on the Avion cashback withdrawal launch?

<a id="simplii-from-27d2a524-6a0d-4a3d-b102-c531d65f368f-what-did-y"></a>

- **Import key:** `simplii-from-27d2a524-6a0d-4a3d-b102-c531d65f368f`
- **Library ID:** `ed4e02e8-a337-40f9-bd9e-d486927f8577`
- **Experience:** RBC — Cashback Withdrawals
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

One decision I pushed on was that payment status and recovery had to be part of the MVP, not something we figured out after launch.

If a member requests a withdrawal and the confirmation is delayed, they need to know what's happening to both the transfer and their cashback balance. We needed to distinguish pending, completed and unsuccessful states, and avoid encouraging a retry that might create a duplicate payout.

I also wanted support to have a withdrawal reference and a dependable investigation path, and Finance needed to be able to reconcile the payout. We didn't need a fully featured operations console on day one, but we did need a workable process.

Engineering owned the implementation and the underlying payment logic. I owned the customer and operational requirements, the trade-offs in launch scope, and alignment with Risk and Financial Operations on readiness.

**Embedded follow-ups (4):**

- **Q:** What did you personally decide on RBC Avion

One decision I pushed on was that payment status and recovery had to be part of the MVP, not something we figured out after launch.

If a member requests a withdrawal and the confirmation is delayed, they need to know what's happening to both the transfer and their cashback balance. We needed to distinguish pending, completed and unsuccessful states, and avoid encouraging a retry that might create a duplicate payout.

I also wanted support to have a withdrawal reference and a dependable investigation path, and Finance needed to be able to reconcile the payout. We didn't need a fully featured operations console on day one, but we did need a workable process.

Engineering owned the implementation and the underlying payment logic. I owned the customer and operational requirements, the trade-offs in launch scope, and alignment with Risk and Financial Operations on readiness.

- **Q:** What was your ownership versus engineering

One decision I pushed on was that payment status and recovery had to be part of the MVP, not something we figured out after launch.

If a member requests a withdrawal and the confirmation is delayed, they need to know what's happening to both the transfer and their cashback balance. We needed to distinguish pending, completed and unsuccessful states, and avoid encouraging a retry that might create a duplicate payout.

I also wanted support to have a withdrawal reference and a dependable investigation path, and Finance needed to be able to reconcile the payout. We didn't need a fully featured operations console on day one, but we did need a workable process.

Engineering owned the implementation and the underlying payment logic. I owned the customer and operational requirements, the trade-offs in launch scope, and alignment with Risk and Financial Operations on readiness.

- **Q:** What trade-off did you make

One decision I pushed on was that payment status and recovery had to be part of the MVP, not something we figured out after launch.

If a member requests a withdrawal and the confirmation is delayed, they need to know what's happening to both the transfer and their cashback balance. We needed to distinguish pending, completed and unsuccessful states, and avoid encouraging a retry that might create a duplicate payout.

I also wanted support to have a withdrawal reference and a dependable investigation path, and Finance needed to be able to reconcile the payout. We didn't need a fully featured operations console on day one, but we did need a workable process.

Engineering owned the implementation and the underlying payment logic. I owned the customer and operational requirements, the trade-offs in launch scope, and alignment with Risk and Financial Operations on readiness.

- **Q:** What went into the MVP?

One decision I pushed on was that payment status and recovery had to be part of the MVP, not something we figured out after launch.

If a member requests a withdrawal and the confirmation is delayed, they need to know what's happening to both the transfer and their cashback balance. We needed to distinguish pending, completed and unsuccessful states, and avoid encouraging a retry that might create a duplicate payout.

I also wanted support to have a withdrawal reference and a dependable investigation path, and Finance needed to be able to reconcile the payout. We didn't need a fully featured operations console on day one, but we did need a workable process.

Engineering owned the implementation and the underlying payment logic. I owned the customer and operational requirements, the trade-offs in launch scope, and alignment with Risk and Financial Operations on readiness.

---

### 91. What did you personally decide on the HBC Mastercard application journey?

<a id="simplii-from-b9f349e9-64c8-4308-a221-2004dd8f3038-what-did-y"></a>

- **Import key:** `simplii-from-b9f349e9-64c8-4308-a221-2004dd8f3038`
- **Library ID:** `6c2aef3d-628a-4978-b9db-dea5805b966c`
- **Experience:** HBC — Mastercard Acquisition
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

I made continuation of the existing application the core requirement of the return journey.

That meant the customer shouldn't land back on a generic credit-card offer page and be encouraged to start a new application. We needed distinct experiences for an application in progress, one already submitted and a session that required the customer to authenticate again.

I also worked with Neo on what limited status information we could safely display on the HBC side and which support team owned different issues.

Neo owned the secure application flow, customer financial data and underwriting. My responsibility was the customer journey across the HBC-to-Neo boundary, the requirements and the trade-offs necessary to make it understandable and supportable.

**Embedded follow-ups (3):**

- **Q:** What did you own versus Neo

I made continuation of the existing application the core requirement of the return journey.

That meant the customer shouldn't land back on a generic credit-card offer page and be encouraged to start a new application. We needed distinct experiences for an application in progress, one already submitted and a session that required the customer to authenticate again.

I also worked with Neo on what limited status information we could safely display on the HBC side and which support team owned different issues.

Neo owned the secure application flow, customer financial data and underwriting. My responsibility was the customer journey across the HBC-to-Neo boundary, the requirements and the trade-offs necessary to make it understandable and supportable.

- **Q:** What product trade-off mattered

I made continuation of the existing application the core requirement of the return journey.

That meant the customer shouldn't land back on a generic credit-card offer page and be encouraged to start a new application. We needed distinct experiences for an application in progress, one already submitted and a session that required the customer to authenticate again.

I also worked with Neo on what limited status information we could safely display on the HBC side and which support team owned different issues.

Neo owned the secure application flow, customer financial data and underwriting. My responsibility was the customer journey across the HBC-to-Neo boundary, the requirements and the trade-offs necessary to make it understandable and supportable.

- **Q:** Which requirements did you set?

I made continuation of the existing application the core requirement of the return journey.

That meant the customer shouldn't land back on a generic credit-card offer page and be encouraged to start a new application. We needed distinct experiences for an application in progress, one already submitted and a session that required the customer to authenticate again.

I also worked with Neo on what limited status information we could safely display on the HBC side and which support team owned different issues.

Neo owned the secure application flow, customer financial data and underwriting. My responsibility was the customer journey across the HBC-to-Neo boundary, the requirements and the trade-offs necessary to make it understandable and supportable.

---

### 92. What did you personally decide or deprioritize?

<a id="simplii-from-f9022f65-91fb-4094-ae8f-b4dc87edcca7-what-did-y"></a>

- **Import key:** `simplii-from-f9022f65-91fb-4094-ae8f-b4dc87edcca7`
- **Library ID:** `ba7845dc-51b1-42cf-b343-8f4d54d64f5e`
- **Experience:** Arc'teryx — Membership Platform
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

One specific decision was not to build every membership journey natively into the mobile app for the first release.

We could support the initial enrollment and benefit journeys through responsive web while putting engineering effort into identity, eligibility and service fulfilment. It was a less integrated app experience at first, but it protected the part that mattered most: could the customer actually receive the benefit we'd promised?

I recommended that sequencing, worked through the trade-off with channel and service teams, and reflected it in the capability roadmap and investment plan.

To me, that was a better MVP decision than spreading the team across more front-end surfaces while leaving the underlying service journey incomplete.

**Embedded follow-ups (3):**

- **Q:** What was your key MVP trade-off

One specific decision was not to build every membership journey natively into the mobile app for the first release.

We could support the initial enrollment and benefit journeys through responsive web while putting engineering effort into identity, eligibility and service fulfilment. It was a less integrated app experience at first, but it protected the part that mattered most: could the customer actually receive the benefit we'd promised?

I recommended that sequencing, worked through the trade-off with channel and service teams, and reflected it in the capability roadmap and investment plan.

To me, that was a better MVP decision than spreading the team across more front-end surfaces while leaving the underlying service journey incomplete.

- **Q:** How did you challenge the roadmap

One specific decision was not to build every membership journey natively into the mobile app for the first release.

We could support the initial enrollment and benefit journeys through responsive web while putting engineering effort into identity, eligibility and service fulfilment. It was a less integrated app experience at first, but it protected the part that mattered most: could the customer actually receive the benefit we'd promised?

I recommended that sequencing, worked through the trade-off with channel and service teams, and reflected it in the capability roadmap and investment plan.

To me, that was a better MVP decision than spreading the team across more front-end surfaces while leaving the underlying service journey incomplete.

- **Q:** What did you say no to?

One specific decision was not to build every membership journey natively into the mobile app for the first release.

We could support the initial enrollment and benefit journeys through responsive web while putting engineering effort into identity, eligibility and service fulfilment. It was a less integrated app experience at first, but it protected the part that mattered most: could the customer actually receive the benefit we'd promised?

I recommended that sequencing, worked through the trade-off with channel and service teams, and reflected it in the capability roadmap and investment plan.

To me, that was a better MVP decision than spreading the team across more front-end surfaces while leaving the underlying service journey incomplete.

---

### 93. What did you personally own in Avion Select's onboarding and identity experience?

<a id="simplii-john-experience-depth-v1-rbc-avion-identity-what-did"></a>

- **Import key:** `simplii-john-experience-depth-v1-rbc-avion-identity`
- **Library ID:** `b877423a-e451-458c-9569-cf2ff7c89cb1`
- **Experience:** RBC — Avion Select
- **Tier:** P0
- **Evidence:** illustrative_scenario

**Answer (spoken):**

The product change was opening Avion to people who couldn't rely on an existing RBC banking relationship to access it.

My responsibility was the onboarding experience and the requirements around that new entry path. We needed to be clear about who could join, what information was required, how the member accessed the product and what happened when something didn't work.

I worked with the identity and engineering teams on those decisions. They owned the security architecture and implementation; I owned how the requirements came together into an understandable customer journey.

I also had to consider the experience after sign-up. Creating an account was useful only if the new member could reach the benefits they had joined for.

That work helped launch Avion Select from zero to one. The program subsequently grew to approximately 500,000 members.

---

### 94. What did you personally own in the CRM reliability improvement?

<a id="simplii-john-experience-depth-v1-arc-crm-ownership-what-did-"></a>

- **Import key:** `simplii-john-experience-depth-v1-arc-crm-ownership`
- **Library ID:** `faf07ee9-1da1-438f-825c-73cd49944dec`
- **Experience:** Arc'teryx — CRM & Customer Communications
- **Tier:** P1
- **Evidence:** illustrative_scenario

**Answer (spoken):**

I owned making reliability a product priority and turning it into a manageable set of decisions.

That meant agreeing on the customer journeys we needed to protect, putting improvement work into the roadmap, and making sure release expectations were clear enough for engineering, QA and business teams to act on.

Engineering owned implementation and automation. QA brought the testing expertise. My responsibility was deciding where the effort was most valuable, resolving competing priorities and making the acceptance criteria explicit.

For example, if a team wanted to release a change before a dependency was ready, I needed to make the consequence visible and help find a smaller safe scope. I wouldn't claim to have personally built every check. My contribution was getting the work prioritized and making the operating model hold together.

---

### 95. What did you personally own on ShopPlus?

<a id="simplii-john-experience-depth-v1-rbc-shopplus-ownership-what"></a>

- **Import key:** `simplii-john-experience-depth-v1-rbc-shopplus-ownership`
- **Library ID:** `afa7d2c1-087c-46db-b533-34387a5de02c`
- **Experience:** RBC — ShopPlus
- **Tier:** P0
- **Evidence:** illustrative_scenario

**Answer (spoken):**

I owned the product requirements and priorities for the member journey, from understanding why to install the extension to recognizing an eligible offer and knowing what to expect after activating it.

I worked with design and engineering to make those decisions concrete. The important states were whether the member was signed in, whether an applicable offer was available and what action was needed. We needed a useful response when no offer applied as well, so the extension did not become a constant interruption.

My role was to define that customer promise, agree on acceptance criteria and make scope decisions across the browser experiences. Engineering owned the implementation and technical constraints. Partner and operational teams were essential to how cashback was ultimately tracked and confirmed.

I also separated the launch milestone from ongoing value. Reaching more than 100,000 downloads established distribution; the product still needed to help a member successfully earn cashback.

---

### 96. What did you personally own on those Aeroplan partnerships?

<a id="simplii-john-experience-depth-v1-air-partnership-ownership-w"></a>

- **Import key:** `simplii-john-experience-depth-v1-air-partnership-ownership`
- **Library ID:** `08d3a9b7-dc96-4d2f-b3b3-069c5f87d141`
- **Experience:** Aeroplan — Commercial Partnerships
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

My ownership was the analytical and commercial preparation that supported the partnership decision. I worked on the financial models, the business case and the materials used to explain the opportunity.

That is a narrower claim than saying I owned the whole partnership. The commercial leads owned the relationship and negotiations, and other teams handled the operational and technical pieces. My responsibility was to make the case useful: connect the member proposition to the economics, expose the assumptions and make it clear what would change the recommendation.

The value I brought was being able to move between the model and the customer story. If a forecast depended on frequent usage, I needed to understand why a member would actually build that habit. If the proposition sounded attractive but the economics were weak, the team needed to see that before committing.

That experience shaped how I work as a PM. I want to understand the commercial mechanism behind a product outcome, while being precise about which decisions and results I personally own.

---

### 97. What does 'P&L ownership' at HBC actually mean?

<a id="simplii-from-9b0f399e-6750-463a-9570-805c82449eb8-what-does-"></a>

- **Import key:** `simplii-from-9b0f399e-6750-463a-9570-805c82449eb8`
- **Library ID:** `4614d7f7-2554-46b2-bcb0-a8bfc8f3425b`
- **Experience:** HBC — Mastercard Acquisition
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

In that role, I was accountable for the growth roadmap and the commercial performance of the HBC Mastercard programme, working with our financial-services partner and internal stakeholders. In practical terms, my product decisions were informed by cardholder acquisition, engagement, spending, incentive economics and customer lifetime value. I wouldn't claim that I personally owned every lending, underwriting or balance-sheet decision at the issuer. The distinction is that I owned the product growth decisions and business outcomes within our programme scope, while some financial and risk levers sat with the partner. I'd be happy to break down which levers we could directly change versus influence.

**Embedded follow-ups (4):**

- **Q:** P&L detail

In that role, I was accountable for the growth roadmap and the commercial performance of the HBC Mastercard programme, working with our financial-services partner and internal stakeholders. In practical terms, my product decisions were informed by cardholder acquisition, engagement, spending, incentive economics and customer lifetime value. I wouldn't claim that I personally owned every lending, underwriting or balance-sheet decision at the issuer. The distinction is that I owned the product growth decisions and business outcomes within our programme scope, while some financial and risk levers sat with the partner. I'd be happy to break down which levers we could directly change versus influence.

- **Q:** Revenue responsibility

In that role, I was accountable for the growth roadmap and the commercial performance of the HBC Mastercard programme, working with our financial-services partner and internal stakeholders. In practical terms, my product decisions were informed by cardholder acquisition, engagement, spending, incentive economics and customer lifetime value. I wouldn't claim that I personally owned every lending, underwriting or balance-sheet decision at the issuer. The distinction is that I owned the product growth decisions and business outcomes within our programme scope, while some financial and risk levers sat with the partner. I'd be happy to break down which levers we could directly change versus influence.

- **Q:** HBC financial ownership

In that role, I was accountable for the growth roadmap and the commercial performance of the HBC Mastercard programme, working with our financial-services partner and internal stakeholders. In practical terms, my product decisions were informed by cardholder acquisition, engagement, spending, incentive economics and customer lifetime value. I wouldn't claim that I personally owned every lending, underwriting or balance-sheet decision at the issuer. The distinction is that I owned the product growth decisions and business outcomes within our programme scope, while some financial and risk levers sat with the partner. I'd be happy to break down which levers we could directly change versus influence.

- **Q:** What did you control?

In that role, I was accountable for the growth roadmap and the commercial performance of the HBC Mastercard programme, working with our financial-services partner and internal stakeholders. In practical terms, my product decisions were informed by cardholder acquisition, engagement, spending, incentive economics and customer lifetime value. I wouldn't claim that I personally owned every lending, underwriting or balance-sheet decision at the issuer. The distinction is that I owned the product growth decisions and business outcomes within our programme scope, while some financial and risk levers sat with the partner. I'd be happy to break down which levers we could directly change versus influence.

---

### 98. What does 100,000 ShopPlus downloads tell you, and what doesn't it tell you?

<a id="simplii-john-experience-depth-v1-rbc-shopplus-measurement-wh"></a>

- **Import key:** `simplii-john-experience-depth-v1-rbc-shopplus-measurement`
- **Library ID:** `2d088216-185e-4157-9ca8-85e7bf7f006c`
- **Experience:** RBC — ShopPlus
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

It tells me the product achieved meaningful distribution. It doesn't tell me how many people still had it enabled, used it regularly or successfully earned cashback.

I'd look at the funnel after installation: enabled users, relevant offer exposure, activation and confirmed cashback. I'd also watch uninstalls and support issues, because a product can attract installs and then disappoint people.

For business impact, I'd want to understand whether it created incremental rewarded shopping or mainly changed the channel through which existing members accessed the same offers. That requires a credible comparison, not just counting transactions after launch.

So I'm comfortable using 100,000-plus downloads as a scale indicator. I'd keep any active-use, retention or incremental-value claim separate unless I could support it.

---

### 99. What does the $4.3 million partnership result actually mean?

<a id="simplii-john-experience-depth-v1-air-billings-measurement-wh"></a>

- **Import key:** `simplii-john-experience-depth-v1-air-billings-measurement`
- **Library ID:** `3bc5970d-c2fe-4619-a014-4c886caf9ccb`
- **Experience:** Aeroplan — Commercial Partnerships
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

The figure refers to more than $4.3 million in combined annual billings associated with the partnerships in their first twelve months. I use the word billings deliberately. It is not a claim about profit, and it is not a claim that my individual work generated the entire amount.

My contribution was to the commercial analysis and business cases that supported those opportunities. The realized result depended on partner execution, member adoption and the broader team's work.

To assess the quality of that result, I'd look beyond the headline. I'd want to know which activities drove the billings, how concentrated they were, what the reward and operating costs were and whether engagement continued after the initial launch period.

I'd also separate the result from incrementality. Billings demonstrate commercial activity. Proving what would not have happened without the partnership requires a different comparison. That distinction matters because I want the business case to remain credible after launch, rather than just look attractive when we approve it.

---

### 100. What exactly did you change in the HBC application experience?

<a id="simplii-from-e546440d-67eb-4266-8466-0827ccd35e42-what-exact"></a>

- **Import key:** `simplii-from-e546440d-67eb-4266-8466-0827ccd35e42`
- **Library ID:** `f4f37d3a-0e49-4f93-8483-40a968f6fd4a`
- **Experience:** HBC — Mastercard Acquisition
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

The product objective was to make a regulated credit card application easier to complete without compromising the required information or checks. We looked at the funnel and where customers were abandoning, then worked with the partner and design teams on the digital journey. I can confidently speak to the 15% improvement in application completions. For the precise screen-level changes, I'd want to refer to the release scope rather than invent individual form fields or tests. The important product decision was prioritizing friction reduction where the funnel showed the biggest opportunity, while leaving underwriting and risk decisions with the appropriate partner teams.

**Embedded follow-ups (4):**

- **Q:** Funnel changes

The product objective was to make a regulated credit card application easier to complete without compromising the required information or checks. We looked at the funnel and where customers were abandoning, then worked with the partner and design teams on the digital journey. I can confidently speak to the 15% improvement in application completions. For the precise screen-level changes, I'd want to refer to the release scope rather than invent individual form fields or tests. The important product decision was prioritizing friction reduction where the funnel showed the biggest opportunity, while leaving underwriting and risk decisions with the appropriate partner teams.

- **Q:** Which UX screens

The product objective was to make a regulated credit card application easier to complete without compromising the required information or checks. We looked at the funnel and where customers were abandoning, then worked with the partner and design teams on the digital journey. I can confidently speak to the 15% improvement in application completions. For the precise screen-level changes, I'd want to refer to the release scope rather than invent individual form fields or tests. The important product decision was prioritizing friction reduction where the funnel showed the biggest opportunity, while leaving underwriting and risk decisions with the appropriate partner teams.

- **Q:** 15% completion cause

The product objective was to make a regulated credit card application easier to complete without compromising the required information or checks. We looked at the funnel and where customers were abandoning, then worked with the partner and design teams on the digital journey. I can confidently speak to the 15% improvement in application completions. For the precise screen-level changes, I'd want to refer to the release scope rather than invent individual form fields or tests. The important product decision was prioritizing friction reduction where the funnel showed the biggest opportunity, while leaving underwriting and risk decisions with the appropriate partner teams.

- **Q:** High abandonment steps

The product objective was to make a regulated credit card application easier to complete without compromising the required information or checks. We looked at the funnel and where customers were abandoning, then worked with the partner and design teams on the digital journey. I can confidently speak to the 15% improvement in application completions. For the precise screen-level changes, I'd want to refer to the release scope rather than invent individual form fields or tests. The important product decision was prioritizing friction reduction where the funnel showed the biggest opportunity, while leaving underwriting and risk decisions with the appropriate partner teams.

---

### 101. What exactly did you own versus RBC's payments infrastructure team?

<a id="simplii-from-f290b115-770e-4448-82ac-52f4334f34de-what-exact"></a>

- **Import key:** `simplii-from-f290b115-770e-4448-82ac-52f4334f34de`
- **Library ID:** `79d548c7-f53b-44ae-9189-9d3334ea89dd`
- **Experience:** RBC — Cashback Withdrawals
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

I owned the consumer cashback withdrawal experience and the product requirements that made an existing enterprise payment capability usable for non-RBC Avion members. That meant working through eligibility, payout limits, the customer journey, integration requirements and the dependencies with Risk, AML and Financial Operations. I didn't personally build Interac's rails or own the enterprise payments infrastructure. That's an important distinction. Our team was responsible for making sure the customer-facing product worked with those services and operational controls. The value of the work was connecting an existing bank capability to a new consumer use case in a reliable way.

**Embedded follow-ups (4):**

- **Q:** Your ownership

I owned the consumer cashback withdrawal experience and the product requirements that made an existing enterprise payment capability usable for non-RBC Avion members. That meant working through eligibility, payout limits, the customer journey, integration requirements and the dependencies with Risk, AML and Financial Operations. I didn't personally build Interac's rails or own the enterprise payments infrastructure. That's an important distinction. Our team was responsible for making sure the customer-facing product worked with those services and operational controls. The value of the work was connecting an existing bank capability to a new consumer use case in a reliable way.

- **Q:** Did you build the rails?

I owned the consumer cashback withdrawal experience and the product requirements that made an existing enterprise payment capability usable for non-RBC Avion members. That meant working through eligibility, payout limits, the customer journey, integration requirements and the dependencies with Risk, AML and Financial Operations. I didn't personally build Interac's rails or own the enterprise payments infrastructure. That's an important distinction. Our team was responsible for making sure the customer-facing product worked with those services and operational controls. The value of the work was connecting an existing bank capability to a new consumer use case in a reliable way.

- **Q:** Payments team versus product team

I owned the consumer cashback withdrawal experience and the product requirements that made an existing enterprise payment capability usable for non-RBC Avion members. That meant working through eligibility, payout limits, the customer journey, integration requirements and the dependencies with Risk, AML and Financial Operations. I didn't personally build Interac's rails or own the enterprise payments infrastructure. That's an important distinction. Our team was responsible for making sure the customer-facing product worked with those services and operational controls. The value of the work was connecting an existing bank capability to a new consumer use case in a reliable way.

- **Q:** Who did what?

I owned the consumer cashback withdrawal experience and the product requirements that made an existing enterprise payment capability usable for non-RBC Avion members. That meant working through eligibility, payout limits, the customer journey, integration requirements and the dependencies with Risk, AML and Financial Operations. I didn't personally build Interac's rails or own the enterprise payments infrastructure. That's an important distinction. Our team was responsible for making sure the customer-facing product worked with those services and operational controls. The value of the work was connecting an existing bank capability to a new consumer use case in a reliable way.

---

### 102. What exactly does the eight-percentage-point activation improvement mean?

<a id="simplii-john-experience-depth-v1-hbc-activation-definition-w"></a>

- **Import key:** `simplii-john-experience-depth-v1-hbc-activation-definition`
- **Library ID:** `6ba4c255-468a-4fb7-a4e1-7a6bf73108ba`
- **Experience:** HBC — Post-Approval Activation
- **Tier:** P0
- **Evidence:** unverified_detail

**Answer (spoken):**

The result was an eight-percentage-point improvement in the activation rate. That describes the change in the rate itself, rather than an eight-percent relative lift.

For this definition, activation means a qualifying first purchase within 30 days of approval, measured against newly approved eligible accounts. I keep that denominator fixed so we are assessing the same customer population throughout the window.

I would also check that the purchase definition and cohort maturity were consistent. A cohort whose full 30 days have not elapsed cannot be compared fairly with one that has had the entire period to activate.

The eight-point result is the resume headline. The exact baseline and comparison method need to come from the original reporting. Those details determine how strongly I can attribute the movement to the lifecycle changes.

---

### 103. What from your Aeroplan experience would you bring to an everyday banking product?

<a id="simplii-john-experience-depth-v1-air-transfer-to-banking-wha"></a>

- **Import key:** `simplii-john-experience-depth-v1-air-transfer-to-banking`
- **Library ID:** `5495cd03-1963-4004-a21c-f20f28de4ef6`
- **Experience:** Air Canada / Aeroplan — Employer Overview
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

Three things carry over. First, I think about the behavior after acquisition. In a loyalty or financial product, getting someone to sign up is only useful if they understand the proposition and build a reason to keep using it.

Second, I am comfortable with products where the customer journey crosses company boundaries. At Aeroplan, the issuer controlled important parts of the experience. That taught me to make ownership, handoffs and measurement explicit instead of assuming one team could fix the whole journey.

Third, I connect the customer proposition to the economics. My commercial work made me comfortable questioning adoption and frequency assumptions, while the PM work showed me how easily friction can undermine those assumptions.

In everyday banking, I would apply that to a concrete habit, such as moving regular income or making a first recurring payment. I'd look at the customer's reason to switch, whether the journey works reliably and whether the relationship becomes useful beyond an initial incentive.

---

### 104. What happened after the customer clicked Apply—how did you know they became an approved cardholder?

<a id="simplii-from-195a8189-fe48-4c11-9ebe-8f2741146841-what-happe"></a>

- **Import key:** `simplii-from-195a8189-fe48-4c11-9ebe-8f2741146841`
- **Library ID:** `73fec34c-5e8a-4ba3-b7ff-f84d6a573f00`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd separate our digital funnel from the issuer's application and approval funnel. An application click or redirect isn't an approved new cardholder, and reporting them as the same outcome would overstate impact.

Where partner reporting made it possible, I'd reconcile downstream acquisition outcomes back to the source and offer experience, with the right privacy and aggregation controls. Where it didn't, I'd label the upstream measure honestly and avoid claiming the full effect through approval.

The important distinction is that the acquisition growth and conversion improvements are related but not interchangeable. I'd always explain which denominator and stage a metric refers to.

---

### 105. What happened if an Avion member didn't have Interac Autodeposit enabled?

<a id="simplii-from-5c05a272-9334-44b8-bddd-fdbd4a50f6d3-what-happe"></a>

- **Import key:** `simplii-from-5c05a272-9334-44b8-bddd-fdbd4a50f6d3`
- **Library ID:** `63641605-b2d4-4add-9dbe-0bef08308752`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

Autodeposit was an important eligibility consideration because we were sending cashback to the email associated with the member. I wouldn't frame the experience as though every customer with an email address could automatically receive funds.

From a product standpoint, the question is whether we can establish eligibility before offering the withdrawal and give an understandable path if the member isn't eligible. We'd rather explain the requirement clearly than accept a request we know can't complete through the intended flow.

In an interview I'd separate the actual Avion rules from a general recommendation: verify eligibility, don't promise delivery prematurely, and make failure and support states clear.

---

### 106. What happens if a payout API times out after the request was accepted?

<a id="simplii-from-fb3c9a13-b37d-45df-b095-e14f8e84bed2-what-happe"></a>

- **Import key:** `simplii-from-fb3c9a13-b37d-45df-b095-e14f8e84bed2`
- **Library ID:** `25a49bd6-1c1d-4c01-b1c6-1cecf2939849`
- **Experience:** RBC — Cashback Withdrawals
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd treat the outcome as unknown, not failed. Retrying blindly could send the money twice if the payment provider already accepted the request. The implementation needs a unique request or payout identifier, safe retry semantics and a way to query or reconcile the authoritative status. From the customer's perspective, we'd show a pending state rather than falsely claiming success or failure. Operationally, we'd alert on unresolved transactions and provide a reconciliation and recovery path. That's one of the important differences between a normal app interaction and moving money: uncertainty has to be handled explicitly, because the cost of getting it wrong is real.

**Embedded follow-ups (4):**

- **Q:** Timeout after acceptance

I'd treat the outcome as unknown, not failed. Retrying blindly could send the money twice if the payment provider already accepted the request. The implementation needs a unique request or payout identifier, safe retry semantics and a way to query or reconcile the authoritative status. From the customer's perspective, we'd show a pending state rather than falsely claiming success or failure. Operationally, we'd alert on unresolved transactions and provide a reconciliation and recovery path. That's one of the important differences between a normal app interaction and moving money: uncertainty has to be handled explicitly, because the cost of getting it wrong is real.

- **Q:** Duplicate payout

I'd treat the outcome as unknown, not failed. Retrying blindly could send the money twice if the payment provider already accepted the request. The implementation needs a unique request or payout identifier, safe retry semantics and a way to query or reconcile the authoritative status. From the customer's perspective, we'd show a pending state rather than falsely claiming success or failure. Operationally, we'd alert on unresolved transactions and provide a reconciliation and recovery path. That's one of the important differences between a normal app interaction and moving money: uncertainty has to be handled explicitly, because the cost of getting it wrong is real.

- **Q:** Idempotency

I'd treat the outcome as unknown, not failed. Retrying blindly could send the money twice if the payment provider already accepted the request. The implementation needs a unique request or payout identifier, safe retry semantics and a way to query or reconcile the authoritative status. From the customer's perspective, we'd show a pending state rather than falsely claiming success or failure. Operationally, we'd alert on unresolved transactions and provide a reconciliation and recovery path. That's one of the important differences between a normal app interaction and moving money: uncertainty has to be handled explicitly, because the cost of getting it wrong is real.

- **Q:** Unknown payment state

I'd treat the outcome as unknown, not failed. Retrying blindly could send the money twice if the payment provider already accepted the request. The implementation needs a unique request or payout identifier, safe retry semantics and a way to query or reconcile the authoritative status. From the customer's perspective, we'd show a pending state rather than falsely claiming success or failure. Operationally, we'd alert on unresolved transactions and provide a reconciliation and recovery path. That's one of the important differences between a normal app interaction and moving money: uncertainty has to be handled explicitly, because the cost of getting it wrong is real.

---

### 107. What is motivating you to consider a move to Simplii?

<a id="simplii-from-28571e7f-620f-4880-9cd7-cdfc2e146aa8-what-is-mo"></a>

- **Import key:** `simplii-from-28571e7f-620f-4880-9cd7-cdfc2e146aa8`
- **Library ID:** `b31caa0f-ecea-42c5-a340-8be82dbc6388`
- **Experience:** Arc'teryx — Membership Platform
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

The work at Arc'teryx gave me a chance to shape something from an early proposition through technology evaluation and investment decisions, which was valuable experience. What I'm looking for next is a role closer to the financial products I've enjoyed working on at RBC, HBC and Aeroplan.



I like products where small decisions have tangible customer consequences. An unclear payment status or a difficult onboarding step isn't a minor inconvenience when someone is trying to use their money. Simplii combines that customer impact with a role that's very hands-on in discovery and delivery. That's the kind of scope I'd like to be accountable for.

---

### 108. What is the most important product detail you've had to insist on?

<a id="simplii-jd-019-what-is-the-most-important-product-detail-you"></a>

- **Import key:** `simplii-jd-019`
- **Library ID:** `6fe45029-2522-4a03-9ba3-dbad356c9842`
- **Experience:** RBC Cashback Withdrawal
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

One of the most important details in the RBC cashback withdrawal journey was distinguishing a request being accepted from the payment actually being completed. Those aren't necessarily the same event, and for a customer the difference matters.



We needed to think through pending and failed states, what happened when confirmation was delayed, and how service and finance could investigate an exception. Otherwise a polished interface could tell someone their money had arrived when we didn't yet know that, or encourage an unsafe repeat attempt.



I think this is a good example of why product ownership extends into the less visible parts of delivery. The user story and status language are small details on screen, but they carry a lot of the customer's trust.

**Embedded follow-ups (1):**

- **Q:** RBC — After a timeout, how do you prevent duplicates and establish payment statu

The first rule is that a timeout is not a declined payment. It means the customer-facing service didn't receive a conclusive response. The instruction may still be processing, and treating that as a failure can create a second payout.

So before launch, I'd want the withdrawal requirement to cover an uncertain outcome explicitly. When the request is initiated, the journey needs a stable reference that can be traced end to end. If we lose the response, we show the customer that the withdrawal is being checked rather than encouraging a new submission.

On the service side, I'd work with the payments owners to confirm how duplicate protection and authoritative status are actually supported. Ideally a retry against the same business request can't move money twice, and there is a reliable way to reconcile the original instruction to its final outcome.

My job is to insist that the contract, customer states, support path and acceptance criteria address that failure mode. The enterprise team decides how the mechanism is implemented, because I don't own their payment architecture.

---

### 109. What made delivering ShopPlus across three browsers difficult?

<a id="simplii-john-experience-depth-v1-rbc-shopplus-browsers-what-"></a>

- **Import key:** `simplii-john-experience-depth-v1-rbc-shopplus-browsers`
- **Library ID:** `8c891d08-918d-4745-8716-7d36055d9f95`
- **Experience:** RBC — ShopPlus
- **Tier:** P1
- **Evidence:** illustrative_scenario

**Answer (spoken):**

The main product challenge was keeping the member promise consistent without assuming every browser had identical implementation constraints.

I would define parity at the level of the customer task: can someone install the extension, understand permissions, find an applicable offer and complete the intended action? The engineering work to deliver that may differ by browser.

That gives the team room to make technical choices while keeping the essential experience coherent. It also makes a release decision clearer. If a browser-specific limitation breaks the core task, it's a launch issue; if it affects a secondary interaction, it may be a deliberate phased improvement.

The product shipped across Chrome, Edge and Safari. I wouldn't claim every technical difference was mine to solve, but agreeing on the customer standard was part of the product responsibility.

---

### 110. What was your most important HBC product decision?

<a id="simplii-from-b0d58fdf-bced-41f7-b878-1b158fc89643-what-was-y"></a>

- **Import key:** `simplii-from-b0d58fdf-bced-41f7-b878-1b158fc89643`
- **Library ID:** `2179ecf1-b28b-47da-988a-c47641c5688d`
- **Experience:** HBC — Mastercard Acquisition
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

One important decision was treating cardholder value as a lifecycle problem rather than just an acquisition problem. It's tempting to focus on how many applications or approvals a programme generates, but a card that isn't used regularly doesn't create much ongoing value. I focused on understanding different cardholder behaviours and using targeted engagement rather than broad, undifferentiated promotions. That informed the lifecycle roadmap and initiatives like Quests. The key commercial lesson was to consider repeat spending and the cost of incentives, not just whether a campaign generated activity. We tracked improvements in estimated LTV and incremental cardholder spending, while recognizing that not every portfolio outcome could be attributed to a single feature.

**Embedded follow-ups (4):**

- **Q:** HBC best decision

One important decision was treating cardholder value as a lifecycle problem rather than just an acquisition problem. It's tempting to focus on how many applications or approvals a programme generates, but a card that isn't used regularly doesn't create much ongoing value. I focused on understanding different cardholder behaviours and using targeted engagement rather than broad, undifferentiated promotions. That informed the lifecycle roadmap and initiatives like Quests. The key commercial lesson was to consider repeat spending and the cost of incentives, not just whether a campaign generated activity. We tracked improvements in estimated LTV and incremental cardholder spending, while recognizing that not every portfolio outcome could be attributed to a single feature.

- **Q:** Product judgment card

One important decision was treating cardholder value as a lifecycle problem rather than just an acquisition problem. It's tempting to focus on how many applications or approvals a programme generates, but a card that isn't used regularly doesn't create much ongoing value. I focused on understanding different cardholder behaviours and using targeted engagement rather than broad, undifferentiated promotions. That informed the lifecycle roadmap and initiatives like Quests. The key commercial lesson was to consider repeat spending and the cost of incentives, not just whether a campaign generated activity. We tracked improvements in estimated LTV and incremental cardholder spending, while recognizing that not every portfolio outcome could be attributed to a single feature.

- **Q:** One decision

One important decision was treating cardholder value as a lifecycle problem rather than just an acquisition problem. It's tempting to focus on how many applications or approvals a programme generates, but a card that isn't used regularly doesn't create much ongoing value. I focused on understanding different cardholder behaviours and using targeted engagement rather than broad, undifferentiated promotions. That informed the lifecycle roadmap and initiatives like Quests. The key commercial lesson was to consider repeat spending and the cost of incentives, not just whether a campaign generated activity. We tracked improvements in estimated LTV and incremental cardholder spending, while recognizing that not every portfolio outcome could be attributed to a single feature.

- **Q:** Prioritization examples

One important decision was treating cardholder value as a lifecycle problem rather than just an acquisition problem. It's tempting to focus on how many applications or approvals a programme generates, but a card that isn't used regularly doesn't create much ongoing value. I focused on understanding different cardholder behaviours and using targeted engagement rather than broad, undifferentiated promotions. That informed the lifecycle roadmap and initiatives like Quests. The key commercial lesson was to consider repeat spending and the cost of incentives, not just whether a campaign generated activity. We tracked improvements in estimated LTV and incremental cardholder spending, while recognizing that not every portfolio outcome could be attributed to a single feature.

---

### 111. What were the leading indicators before you could measure meaningful payout volume?

<a id="simplii-from-14712a6a-881f-4c8c-9f98-9b3359211669-what-were-"></a>

- **Import key:** `simplii-from-14712a6a-881f-4c8c-9f98-9b3359211669`
- **Library ID:** `b11ba6ea-c39c-4962-8472-ff61da7fcbd6`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

Before looking at annualized volume, I'd want to know whether the flow was usable and operationally safe. Leading indicators would include how many eligible members reached the withdrawal option, how many initiated a request, how many completed the required steps and where they dropped off.

Alongside conversion, I'd watch failed or returned transfers, support contact reasons and settlement exceptions. Those are particularly important because a payment feature can look popular while creating hidden operational work.

I'd be careful not to claim historical values I haven't verified. The broader outcome I can support is that the capability enabled more than $1 million in annualized consumer cashback withdrawals.

---

### 112. What would a good QA strategy look like for customer communications at that scale?

<a id="simplii-john-experience-depth-v1-arc-crm-testing-what-would-"></a>

- **Import key:** `simplii-john-experience-depth-v1-arc-crm-testing`
- **Library ID:** `92f5b55e-490f-493f-8be8-bd2fab662c2b`
- **Experience:** Arc'teryx — CRM & Customer Communications
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd start with the customer promise behind each message. For a transactional journey, the trigger, recipient, timing and next action all need to be right.

Then I'd test a small set of representative states: expected data, missing data, duplicate events, changes in customer details and a dependency that responds late. I'd also check links and rendering across the formats the team actually supports.

The repeatable checks are good candidates for automation. Human review is more useful for whether the message is understandable and whether the customer knows what to do next.

Finally, I'd want a release verification and recovery plan. Passing a test environment isn't the end of the work. Someone needs to know what to monitor after release and what to do if the customer journey isn't behaving as expected.

---

### 113. What would have changed your recommendation from buy to build?

<a id="simplii-from-73b7a947-02f5-4298-8592-4badfbcbb139-what-would"></a>

- **Import key:** `simplii-from-73b7a947-02f5-4298-8592-4badfbcbb139`
- **Library ID:** `03c17222-d1cd-4023-b4f6-2b4d2243ce38`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd reconsider the recommendation if the vendor created more long-term constraint than leverage. For example, if its core data model couldn't support the customer journeys, the integration cost erased the time advantage, or important capabilities were so proprietary that we'd struggle to evolve them.

I'd also weigh how strategically differentiating the capability really was. There are some experiences we should own closely, but that doesn't mean building commodity loyalty infrastructure from scratch.

At Arc'teryx, we evaluated five vendors and chose a headless direction. The reported delivery-time benefit was an estimate against the custom-build alternative, not a realized saving from a launched platform.

---

### 114. What would the customer see while a cashback payout is pending or being investigated?

<a id="simplii-from-bfaa86a1-2c06-4c4f-880a-bf2718e8a330-what-would"></a>

- **Import key:** `simplii-from-bfaa86a1-2c06-4c4f-880a-bf2718e8a330`
- **Library ID:** `d8b81f76-156c-433b-b95a-512ba89307da`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd distinguish a request being received from the money being sent or confirmed. The customer should see a plain-language status, the amount, when they requested it and what happens next.

If a payout is under investigation, I'd avoid telling them it failed or succeeded before we know. I'd rather say we're confirming its status, give a realistic expectation if one is available, and make the support path easy to find.

The status should come from the actual payments and settlement workflow rather than a front-end timer. A good experience here reduces duplicate withdrawal attempts and support anxiety while keeping the financial record accurate.

**Embedded follow-ups (1):**

- **Q:** RBC — After a timeout, how do you prevent duplicates and establish payment statu

The first rule is that a timeout is not a declined payment. It means the customer-facing service didn't receive a conclusive response. The instruction may still be processing, and treating that as a failure can create a second payout.

So before launch, I'd want the withdrawal requirement to cover an uncertain outcome explicitly. When the request is initiated, the journey needs a stable reference that can be traced end to end. If we lose the response, we show the customer that the withdrawal is being checked rather than encouraging a new submission.

On the service side, I'd work with the payments owners to confirm how duplicate protection and authoritative status are actually supported. Ideally a retry against the same business request can't move money twice, and there is a reliable way to reconcile the original instruction to its final outcome.

My job is to insist that the contract, customer states, support path and acceptance criteria address that failure mode. The enterprise team decides how the mechanism is implemented, because I don't own their payment architecture.

---

### 115. What would you do differently after the Aeroplan offer-summary test?

<a id="simplii-from-b810ad2f-f519-4a36-9e96-246c398f9d70-what-would"></a>

- **Import key:** `simplii-from-b810ad2f-f519-4a36-9e96-246c398f9d70`
- **Library ID:** `d5c21740-9827-493d-b8b8-8dfcf8eb748e`
- **Experience:** Aeroplan — Co-brand Card Acquisition
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd define the next set of segmentation questions before rolling the design across the whole portfolio.

The initial test covered one issuer, one offer and logged-in mobile visitors. An entry-level card and a premium card may generate different questions, and someone coming from a campaign may behave differently from someone browsing organically.

I'd select a small number of hypotheses and make sure we had enough traffic and bank-side reporting to evaluate them properly.

I'd also want better visibility into approvals and eventual card activation where the partner could provide it in an appropriate aggregate form. More application starts are useful, but the longer-term commercial outcome is more approved customers who actually use the card.

The lesson is to scale the underlying insight, not assume one winning page will work everywhere.

**Embedded follow-ups (3):**

- **Q:** How would you scale the learning

I'd define the next set of segmentation questions before rolling the design across the whole portfolio.

The initial test covered one issuer, one offer and logged-in mobile visitors. An entry-level card and a premium card may generate different questions, and someone coming from a campaign may behave differently from someone browsing organically.

I'd select a small number of hypotheses and make sure we had enough traffic and bank-side reporting to evaluate them properly.

I'd also want better visibility into approvals and eventual card activation where the partner could provide it in an appropriate aggregate form. More application starts are useful, but the longer-term commercial outcome is more approved customers who actually use the card.

The lesson is to scale the underlying insight, not assume one winning page will work everywhere.

- **Q:** What would you test next

I'd define the next set of segmentation questions before rolling the design across the whole portfolio.

The initial test covered one issuer, one offer and logged-in mobile visitors. An entry-level card and a premium card may generate different questions, and someone coming from a campaign may behave differently from someone browsing organically.

I'd select a small number of hypotheses and make sure we had enough traffic and bank-side reporting to evaluate them properly.

I'd also want better visibility into approvals and eventual card activation where the partner could provide it in an appropriate aggregate form. More application starts are useful, but the longer-term commercial outcome is more approved customers who actually use the card.

The lesson is to scale the underlying insight, not assume one winning page will work everywhere.

- **Q:** What limitation did the experiment have?

I'd define the next set of segmentation questions before rolling the design across the whole portfolio.

The initial test covered one issuer, one offer and logged-in mobile visitors. An entry-level card and a premium card may generate different questions, and someone coming from a campaign may behave differently from someone browsing organically.

I'd select a small number of hypotheses and make sure we had enough traffic and bank-side reporting to evaluate them properly.

I'd also want better visibility into approvals and eventual card activation where the partner could provide it in an appropriate aggregate form. More application starts are useful, but the longer-term commercial outcome is more approved customers who actually use the card.

The lesson is to scale the underlying insight, not assume one winning page will work everywhere.

---

### 116. What would you do differently in your Arc'teryx CRM work?

<a id="simplii-john-experience-depth-v1-arc-crm-lesson-what-would-y"></a>

- **Import key:** `simplii-john-experience-depth-v1-arc-crm-lesson`
- **Library ID:** `5e8dbfcd-2d91-44c1-bd85-2cd82f5b557a`
- **Experience:** Arc'teryx — CRM & Customer Communications
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd make the quality signal visible earlier in roadmap discussions.

When reliability is discussed only after a failed release, it competes poorly with features that already have a sponsor and a date. By then, the team is asking for room to fix a problem rather than making an investment decision.

I would bring a short view of recurring release issues, customer impact and the effort they create into prioritization. That would help us choose preventive work before another deadline made it urgent.

I'd also be careful about adding process after every incident. A control should address a specific failure mode, and we should remove it if it no longer adds value. A release process can become slow without becoming safer.

---

### 117. What would you do differently on the Avion cashback withdrawal launch?

<a id="simplii-from-14ad93b1-527c-49e9-b160-e9b22ca0f888-what-would"></a>

- **Import key:** `simplii-from-14ad93b1-527c-49e9-b160-e9b22ca0f888`
- **Library ID:** `e55c3752-59f6-428f-bdc7-6f05ef560131`
- **Experience:** RBC — Cashback Withdrawals
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd bring a little more operational visibility into the first release.

We had an investigation process, but some questions still went through Production Support or required custom queries. That's workable at low volume, but it's not how I'd want to scale a consumer payment experience.

I'd identify the handful of questions that came up repeatedly and give support a simple read-only lookup: withdrawal reference, current status, timestamps and next action. I wouldn't build an entire payment-management console until the need justified it.

I'd measure whether that reduced investigation time and engineering escalations, as well as whether customers received clearer answers. Looking back, that's a small amount of product work that could make the operational experience much better without delaying the core launch significantly.

**Embedded follow-ups (3):**

- **Q:** What did you learn

I'd bring a little more operational visibility into the first release.

We had an investigation process, but some questions still went through Production Support or required custom queries. That's workable at low volume, but it's not how I'd want to scale a consumer payment experience.

I'd identify the handful of questions that came up repeatedly and give support a simple read-only lookup: withdrawal reference, current status, timestamps and next action. I wouldn't build an entire payment-management console until the need justified it.

I'd measure whether that reduced investigation time and engineering escalations, as well as whether customers received clearer answers. Looking back, that's a small amount of product work that could make the operational experience much better without delaying the core launch significantly.

- **Q:** What was missing at launch

I'd bring a little more operational visibility into the first release.

We had an investigation process, but some questions still went through Production Support or required custom queries. That's workable at low volume, but it's not how I'd want to scale a consumer payment experience.

I'd identify the handful of questions that came up repeatedly and give support a simple read-only lookup: withdrawal reference, current status, timestamps and next action. I wouldn't build an entire payment-management console until the need justified it.

I'd measure whether that reduced investigation time and engineering escalations, as well as whether customers received clearer answers. Looking back, that's a small amount of product work that could make the operational experience much better without delaying the core launch significantly.

- **Q:** What would you improve in version two?

I'd bring a little more operational visibility into the first release.

We had an investigation process, but some questions still went through Production Support or required custom queries. That's workable at low volume, but it's not how I'd want to scale a consumer payment experience.

I'd identify the handful of questions that came up repeatedly and give support a simple read-only lookup: withdrawal reference, current status, timestamps and next action. I wouldn't build an entire payment-management console until the need justified it.

I'd measure whether that reduced investigation time and engineering escalations, as well as whether customers received clearer answers. Looking back, that's a small amount of product work that could make the operational experience much better without delaying the core launch significantly.

---

### 118. What would you do differently on the HBC application experiment?

<a id="simplii-from-092b08d1-51ec-4761-a05d-2ccd56724ad5-what-would"></a>

- **Import key:** `simplii-from-092b08d1-51ec-4761-a05d-2ccd56724ad5`
- **Library ID:** `0ca41580-f93d-44a6-acab-ad01b379c5a4`
- **Experience:** HBC — Mastercard Acquisition
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd agree on downstream reporting with Neo earlier.

Application completion was the right initial metric because that was the customer problem we were fixing. But the business ultimately cares about approved, activated and profitable accounts, not just completed forms.

I'd want to follow both experiment groups through approval and first card use, using the same original starters as the denominator. That would help us understand whether we created more active accounts from the same audience or mainly improved submission among applicants who were unlikely to be approved.

I wouldn't have delayed the initial test just to build a perfect reporting system, but I'd make that downstream measurement a clearer part of the plan from the beginning.

**Embedded follow-ups (3):**

- **Q:** What was missing from the experiment

I'd agree on downstream reporting with Neo earlier.

Application completion was the right initial metric because that was the customer problem we were fixing. But the business ultimately cares about approved, activated and profitable accounts, not just completed forms.

I'd want to follow both experiment groups through approval and first card use, using the same original starters as the denominator. That would help us understand whether we created more active accounts from the same audience or mainly improved submission among applicants who were unlikely to be approved.

I wouldn't have delayed the initial test just to build a perfect reporting system, but I'd make that downstream measurement a clearer part of the plan from the beginning.

- **Q:** How would you make the result more commercially meaningful

I'd agree on downstream reporting with Neo earlier.

Application completion was the right initial metric because that was the customer problem we were fixing. But the business ultimately cares about approved, activated and profitable accounts, not just completed forms.

I'd want to follow both experiment groups through approval and first card use, using the same original starters as the denominator. That would help us understand whether we created more active accounts from the same audience or mainly improved submission among applicants who were unlikely to be approved.

I wouldn't have delayed the initial test just to build a perfect reporting system, but I'd make that downstream measurement a clearer part of the plan from the beginning.

- **Q:** What did you learn?

I'd agree on downstream reporting with Neo earlier.

Application completion was the right initial metric because that was the customer problem we were fixing. But the business ultimately cares about approved, activated and profitable accounts, not just completed forms.

I'd want to follow both experiment groups through approval and first card use, using the same original starters as the denominator. That would help us understand whether we created more active accounts from the same audience or mainly improved submission among applicants who were unlikely to be approved.

I wouldn't have delayed the initial test just to build a perfect reporting system, but I'd make that downstream measurement a clearer part of the plan from the beginning.

---

### 119. What would you do differently on the ReBIRD membership platform?

<a id="simplii-from-8efd1a27-85fe-41e7-a279-d79a07bda1d4-what-would"></a>

- **Import key:** `simplii-from-8efd1a27-85fe-41e7-a279-d79a07bda1d4`
- **Library ID:** `34d16821-5027-4ddc-afd7-606a3c202eb6`
- **Experience:** Arc'teryx — Membership Platform
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd run a small assisted pilot of one benefit earlier, alongside the prototype work.

A prototype can tell us whether someone understands a repair benefit and knows where to click. It doesn't fully tell us what happens when an item needs eligibility verification, a service team has to handle an exception or fulfilment takes longer than expected.

I'd take a small group through the real journey with staff support and record completion, turnaround time, exceptions and the effort involved.

That would give us better evidence for the operating model before committing to more platform functionality. I still think the investment work was important, but I'd want us to learn more from the actual service process sooner.

**Embedded follow-ups (3):**

- **Q:** What did you learn

I'd run a small assisted pilot of one benefit earlier, alongside the prototype work.

A prototype can tell us whether someone understands a repair benefit and knows where to click. It doesn't fully tell us what happens when an item needs eligibility verification, a service team has to handle an exception or fulfilment takes longer than expected.

I'd take a small group through the real journey with staff support and record completion, turnaround time, exceptions and the effort involved.

That would give us better evidence for the operating model before committing to more platform functionality. I still think the investment work was important, but I'd want us to learn more from the actual service process sooner.

- **Q:** What would you change in the MVP process

I'd run a small assisted pilot of one benefit earlier, alongside the prototype work.

A prototype can tell us whether someone understands a repair benefit and knows where to click. It doesn't fully tell us what happens when an item needs eligibility verification, a service team has to handle an exception or fulfilment takes longer than expected.

I'd take a small group through the real journey with staff support and record completion, turnaround time, exceptions and the effort involved.

That would give us better evidence for the operating model before committing to more platform functionality. I still think the investment work was important, but I'd want us to learn more from the actual service process sooner.

- **Q:** How would you de-risk the investment earlier?

I'd run a small assisted pilot of one benefit earlier, alongside the prototype work.

A prototype can tell us whether someone understands a repair benefit and knows where to click. It doesn't fully tell us what happens when an item needs eligibility verification, a service team has to handle an exception or fulfilment takes longer than expected.

I'd take a small group through the real journey with staff support and record completion, turnaround time, exceptions and the effort involved.

That would give us better evidence for the operating model before committing to more platform functionality. I still think the investment work was important, but I'd want us to learn more from the actual service process sooner.

---

### 120. What's the difference between acquiring a cardholder, activating one and retaining one?

<a id="simplii-from-f1a3ec4e-63a0-4bb5-ab2e-4d2a634004b1-what-s-the"></a>

- **Import key:** `simplii-from-f1a3ec4e-63a0-4bb5-ab2e-4d2a634004b1`
- **Library ID:** `6915c2ba-f6bc-45c4-a4f9-d036eba697d6`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

They represent different steps in the relationship. Acquisition means we've gained a new customer or account. Activation means that customer has taken the first meaningful behaviour, such as a qualifying purchase, within a defined period. Retention means that useful behaviour continues over later periods.

For a card product, treating all three as one number hides very different problems. A strong application funnel with weak first purchase may point to onboarding or proposition issues; good activation with poor repeat spend may point to value or habit formation.

At HBC, that distinction informed how I thought about the cardholder lifecycle rather than optimizing application conversion in isolation.

---

### 121. What's the difference between EFT and Interac e-Transfer?

<a id="simplii-from-91cd5cac-65b4-41e6-be3b-76ba3c49e9b1-what-s-the"></a>

- **Import key:** `simplii-from-91cd5cac-65b4-41e6-be3b-76ba3c49e9b1`
- **Library ID:** `ba28f632-76b8-4a9c-b751-814f8357e361`
- **Experience:** RBC — Cashback Withdrawals
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

At a high level, both are ways to move money, but they have different operating models and customer experiences.

Interac e-Transfer is commonly used for sending money between people or businesses in Canada. It's generally a near-real-time customer experience, although the actual completion time and handling can vary.

EFT is more commonly associated with account-to-account debits and credits, including payroll, pre-authorized payments and other recurring banking activity. In Canada, these payments commonly flow through the ACSS clearing system and follow processing, settlement and return rules that differ from Interac e-Transfer.

From a product perspective, those differences affect how I think about payment initiation, authorization, transaction status, available funds, limits and failure handling.

For example, an EFT debit may be subject to returns after the initial processing event. That means showing a customer that we've initiated a transfer isn't necessarily the same as telling them the funds are final and available to spend.

With Interac, I'd focus on the particular transfer flow, eligibility, network and partner responses, completion status and exceptions.

I wouldn't claim to know every Payments Canada rule from memory, but I'm comfortable understanding the rails well enough to define a reliable customer experience and work through the operational trade-offs with specialists.

---

### 122. Which Arc'teryx membership capabilities were actually delivered, and which remained planned?

<a id="simplii-from-1c3f6b10-2b62-4807-bffd-ef21beef30d7-which-arc-"></a>

- **Import key:** `simplii-from-1c3f6b10-2b62-4807-bffd-ef21beef30d7`
- **Library ID:** `70243d04-d1f3-4a85-b2df-c4f5562d1b07`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I separate the larger membership MVP from the narrower Sperro SV benefit release. The approved $5.2 million was for a broader program with enrollment, a member experience and integrations across benefits and services. Those planned capabilities weren't the same thing as completed launch outcomes.

For Sperro SV, we coordinated a smaller set of product-owner benefits around repair, events and related experiences. Registration through the digital product passport was handled by a separate team; my team wasn't the owner of that registration system.

When I talk about the results, I stick to what actually shipped and what we can measure. I wouldn't count the planned North American membership launch or projected participation as delivered adoption.

---

### 123. Which step in a credit-card application funnel would you inspect first, and why?

<a id="simplii-from-0f41544d-2a2d-4b4b-bb41-f89df44c05d0-which-step"></a>

- **Import key:** `simplii-from-0f41544d-2a2d-4b4b-bb41-f89df44c05d0`
- **Library ID:** `48cf508b-5342-4ef5-8890-3f2ea3ee9873`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd inspect the highest-friction step where we could plausibly improve the experience without weakening underwriting or compliance requirements. I'd look at drop-off by device, traffic source and field-level error patterns rather than assume the longest screen is the problem.

For a partner-issued credit card, I'd also separate the part of the application we own from the handoff and approval journey the issuer owns. A better-looking landing page doesn't help much if customers get lost at the transition.

I'd prioritize a hypothesis we can actually test, such as clearer eligibility information or saving progress, and define the outcome as completed applications rather than clicks alone.

---

### 124. Who made the final decision when the payments team, Risk and Product disagreed?

<a id="simplii-from-80a4e168-83f0-45ba-a9b7-bde17123566a-who-made-t"></a>

- **Import key:** `simplii-from-80a4e168-83f0-45ba-a9b7-bde17123566a`
- **Library ID:** `71860ee5-ec35-4a78-853c-d5226d970cad`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I wouldn't imply I had unilateral authority over Risk controls or enterprise payment infrastructure. My role was to own the consumer product requirements and coordinate the decisions needed for the customer experience to work.

If teams disagreed, I'd make the decision explicit: what control is mandatory, what implementation choices are flexible, what customer harm we're trying to avoid and who has authority over each part. Sometimes the right outcome is to change the product flow rather than ask a control owner to waive a requirement.

At RBC, that cross-functional alignment was a big part of the work. It taught me to distinguish influencing a decision from formally owning another team's risk acceptance.

---

### 125. Why a clearer offer summary instead of a shorter page or bigger apply button?

<a id="simplii-from-4fa0697a-ebf8-4c97-a107-946de9e5bf1c-why-a-clea"></a>

- **Import key:** `simplii-from-4fa0697a-ebf8-4c97-a107-946de9e5bf1c`
- **Library ID:** `6314f6b2-d1f3-41ea-955c-d32008a7ac2c`
- **Experience:** Aeroplan — Co-brand Card Acquisition
- **Tier:** P2
- **Evidence:** resume_supported

**Answer (spoken):**

A shorter page or a more prominent button might have increased click-through, but neither addressed the uncertainty customers raised in research.

We tested a compact summary bringing the annual fee, relevant eligibility points, welcome-bonus requirements and what to expect in the bank application into one place.

I expected some people to decide the card wasn't right for them before clicking. I was comfortable with that, because a click wasn't the business outcome we cared about.

The real question was whether a higher share of offer-page visitors went on to begin and complete an application. That's why agreeing on bank-side measurement before launch was so important. Otherwise, the experiment might have looked worse based on clicks while actually improving acquisition progression.

**Embedded follow-ups (3):**

- **Q:** What alternatives did you reject

A shorter page or a more prominent button might have increased click-through, but neither addressed the uncertainty customers raised in research.

We tested a compact summary bringing the annual fee, relevant eligibility points, welcome-bonus requirements and what to expect in the bank application into one place.

I expected some people to decide the card wasn't right for them before clicking. I was comfortable with that, because a click wasn't the business outcome we cared about.

The real question was whether a higher share of offer-page visitors went on to begin and complete an application. That's why agreeing on bank-side measurement before launch was so important. Otherwise, the experiment might have looked worse based on clicks while actually improving acquisition progression.

- **Q:** What was your hypothesis

A shorter page or a more prominent button might have increased click-through, but neither addressed the uncertainty customers raised in research.

We tested a compact summary bringing the annual fee, relevant eligibility points, welcome-bonus requirements and what to expect in the bank application into one place.

I expected some people to decide the card wasn't right for them before clicking. I was comfortable with that, because a click wasn't the business outcome we cared about.

The real question was whether a higher share of offer-page visitors went on to begin and complete an application. That's why agreeing on bank-side measurement before launch was so important. Otherwise, the experiment might have looked worse based on clicks while actually improving acquisition progression.

- **Q:** Why did you expect fewer clicks?

A shorter page or a more prominent button might have increased click-through, but neither addressed the uncertainty customers raised in research.

We tested a compact summary bringing the annual fee, relevant eligibility points, welcome-bonus requirements and what to expect in the bank application into one place.

I expected some people to decide the card wasn't right for them before clicking. I was comfortable with that, because a click wasn't the business outcome we cared about.

The real question was whether a higher share of offer-page visitors went on to begin and complete an application. That's why agreeing on bank-side measurement before launch was so important. Otherwise, the experiment might have looked worse based on clicks while actually improving acquisition progression.

---

### 126. Why did HBC modeled LTV rise 10%, and how certain are you?

<a id="simplii-from-3ba24689-dd1a-4428-b018-743f0a8c61af-why-did-hb"></a>

- **Import key:** `simplii-from-3ba24689-dd1a-4428-b018-743f0a8c61af`
- **Library ID:** `c88351de-66fa-4432-a12d-966bbe0f06e8`
- **Experience:** HBC — Cardholder Portfolio & P&L
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

The important distinction is that the result was an estimated improvement in lifetime value, not a realized increase in lifetime profit. The model depends on projected retention, spending behaviour, contribution economics and incentive costs. In an interview I'd want to refer to the actual model assumptions rather than invent a calculation from memory. More generally, I'd assess whether the observed behaviour appears durable and run sensitivity cases, because a short-term promotional lift shouldn't be extrapolated indefinitely. The business value is in using the model to prioritize investments, while staying clear about which inputs were observed and which were forecasts.

**Embedded follow-ups (4):**

- **Q:** LTV increase provenance

The important distinction is that the result was an estimated improvement in lifetime value, not a realized increase in lifetime profit. The model depends on projected retention, spending behaviour, contribution economics and incentive costs. In an interview I'd want to refer to the actual model assumptions rather than invent a calculation from memory. More generally, I'd assess whether the observed behaviour appears durable and run sensitivity cases, because a short-term promotional lift shouldn't be extrapolated indefinitely. The business value is in using the model to prioritize investments, while staying clear about which inputs were observed and which were forecasts.

- **Q:** LTV sensitivity

The important distinction is that the result was an estimated improvement in lifetime value, not a realized increase in lifetime profit. The model depends on projected retention, spending behaviour, contribution economics and incentive costs. In an interview I'd want to refer to the actual model assumptions rather than invent a calculation from memory. More generally, I'd assess whether the observed behaviour appears durable and run sensitivity cases, because a short-term promotional lift shouldn't be extrapolated indefinitely. The business value is in using the model to prioritize investments, while staying clear about which inputs were observed and which were forecasts.

- **Q:** Explain modeled lift

The important distinction is that the result was an estimated improvement in lifetime value, not a realized increase in lifetime profit. The model depends on projected retention, spending behaviour, contribution economics and incentive costs. In an interview I'd want to refer to the actual model assumptions rather than invent a calculation from memory. More generally, I'd assess whether the observed behaviour appears durable and run sensitivity cases, because a short-term promotional lift shouldn't be extrapolated indefinitely. The business value is in using the model to prioritize investments, while staying clear about which inputs were observed and which were forecasts.

- **Q:** HBC economics

The important distinction is that the result was an estimated improvement in lifetime value, not a realized increase in lifetime profit. The model depends on projected retention, spending behaviour, contribution economics and incentive costs. In an interview I'd want to refer to the actual model assumptions rather than invent a calculation from memory. More generally, I'd assess whether the observed behaviour appears durable and run sensitivity cases, because a short-term promotional lift shouldn't be extrapolated indefinitely. The business value is in using the model to prioritize investments, while staying clear about which inputs were observed and which were forecasts.

---

### 127. Why did you choose a headless membership platform rather than building everything internally?

<a id="simplii-from-a85b536e-5e20-468f-87d9-fb447ae796f6-why-did-yo"></a>

- **Import key:** `simplii-from-a85b536e-5e20-468f-87d9-fb447ae796f6`
- **Library ID:** `eac5de90-ccbd-408c-b8c6-295d3db3f7ec`
- **Experience:** Arc'teryx — Membership Platform
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

We evaluated five vendors, and I approached the decision by looking at what capabilities would genuinely differentiate the membership experience versus what we could reasonably obtain from an existing platform.

Building everything internally would have given us more control, but it also meant taking on additional development and maintenance responsibilities.

On the other hand, choosing a very rigid solution could have limited how we integrated membership into our existing digital experience and how we evolved the program later.

We selected a headless approach that separated the underlying membership capabilities from the customer-facing experience.

That mattered because we needed integrations across identity, customer profiles, commerce and servicing, and we expected those experiences to evolve.

It gave us more flexibility while reducing our projected delivery timeline by approximately two quarters.

I wouldn't say headless is always the right answer. It made sense in that particular context because of the existing platform landscape and the capabilities we wanted to own.

The decision was really about balancing speed, long-term flexibility and total cost of ownership.

---

### 128. Why did you prioritize it over other Avion improvements?

<a id="simplii-from-3bcaff0a-31cb-447a-b037-889edb579c5d-why-did-yo"></a>

- **Import key:** `simplii-from-3bcaff0a-31cb-447a-b037-889edb579c5d`
- **Library ID:** `625b1f18-024c-4c82-b77c-060482bb7de3`
- **Experience:** RBC — Cashback Withdrawals
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

We were making Avion available to people who banked elsewhere. If those members could earn cashback but couldn't withdraw it, that undermined a basic part of the proposition.

There were other things we could have improved, like offer discovery and shopping engagement. Those mattered, but they would help people earn additional rewards before we'd solved how to use the rewards already sitting in their account.

The affected group was identifiable, the customer problem was understandable, and RBC already had a payment capability we could investigate rather than starting completely from scratch.

That made it a practical priority with a clear outcome: could an eligible non-RBC member successfully withdraw cashback to their own bank?

**Embedded follow-ups (3):**

- **Q:** Why now

We were making Avion available to people who banked elsewhere. If those members could earn cashback but couldn't withdraw it, that undermined a basic part of the proposition.

There were other things we could have improved, like offer discovery and shopping engagement. Those mattered, but they would help people earn additional rewards before we'd solved how to use the rewards already sitting in their account.

The affected group was identifiable, the customer problem was understandable, and RBC already had a payment capability we could investigate rather than starting completely from scratch.

That made it a practical priority with a clear outcome: could an eligible non-RBC member successfully withdraw cashback to their own bank?

- **Q:** How did it rank on your roadmap

We were making Avion available to people who banked elsewhere. If those members could earn cashback but couldn't withdraw it, that undermined a basic part of the proposition.

There were other things we could have improved, like offer discovery and shopping engagement. Those mattered, but they would help people earn additional rewards before we'd solved how to use the rewards already sitting in their account.

The affected group was identifiable, the customer problem was understandable, and RBC already had a payment capability we could investigate rather than starting completely from scratch.

That made it a practical priority with a clear outcome: could an eligible non-RBC member successfully withdraw cashback to their own bank?

- **Q:** What did you deprioritize?

We were making Avion available to people who banked elsewhere. If those members could earn cashback but couldn't withdraw it, that undermined a basic part of the proposition.

There were other things we could have improved, like offer discovery and shopping engagement. Those mattered, but they would help people earn additional rewards before we'd solved how to use the rewards already sitting in their account.

The affected group was identifiable, the customer problem was understandable, and RBC already had a payment capability we could investigate rather than starting completely from scratch.

That made it a practical priority with a clear outcome: could an eligible non-RBC member successfully withdraw cashback to their own bank?

---

### 129. Why did you use the member's email address, and what if that address changed?

<a id="simplii-from-c22bc35e-41a0-4bc7-9b53-6d19da3ecfef-why-did-yo"></a>

- **Import key:** `simplii-from-c22bc35e-41a0-4bc7-9b53-6d19da3ecfef`
- **Library ID:** `df872068-1545-45f2-9f53-4b082fbbcfbd`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

The member's email was part of how we identified the destination for an eligible Interac payout. That meant the quality of the customer identity and contact information was operationally important, not just a communications detail.

If the address changed, I'd want to know which email was authorized and evaluated for eligibility at the moment of payout, and whether changes require revalidation. A payout shouldn't silently switch destinations because a profile field changed during processing.

I wouldn't invent the exact production rule without checking it, but the product principle is to bind the payment instruction to a validated destination and keep an auditable record of what was authorized.

---

### 130. Why Interac e-Transfer instead of direct bank-account linking?

<a id="simplii-from-c226bb45-beb6-4162-9628-f16d6660b887-why-intera"></a>

- **Import key:** `simplii-from-c226bb45-beb6-4162-9628-f16d6660b887`
- **Library ID:** `afae3cc0-2213-497c-a730-9dfbb5b7112d`
- **Experience:** RBC — Cashback Withdrawals
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

We looked at both. Linking external bank accounts could have given us a broader funding and withdrawal experience eventually, but it brought additional account verification, data and integration dependencies.

RBC already had an Interac-based business payout capability. By adapting it for consumer cashback, we could build on a service with an established operational model instead of creating a separate money-movement path.

It wasn't a perfect solution. Our first version relied on the member's email address and required Autodeposit. That narrowed eligibility, and we needed to make it obvious before a member tried to withdraw.

I was comfortable with that trade-off for an initial release, as long as we didn't hide it, had a way to handle unsuccessful or delayed transfers, and could measure how many customers were excluded. We'd then have evidence to decide whether expanding the withdrawal options was worth the additional complexity.

**Embedded follow-ups (3):**

- **Q:** What alternatives did you consider

We looked at both. Linking external bank accounts could have given us a broader funding and withdrawal experience eventually, but it brought additional account verification, data and integration dependencies.

RBC already had an Interac-based business payout capability. By adapting it for consumer cashback, we could build on a service with an established operational model instead of creating a separate money-movement path.

It wasn't a perfect solution. Our first version relied on the member's email address and required Autodeposit. That narrowed eligibility, and we needed to make it obvious before a member tried to withdraw.

I was comfortable with that trade-off for an initial release, as long as we didn't hide it, had a way to handle unsuccessful or delayed transfers, and could measure how many customers were excluded. We'd then have evidence to decide whether expanding the withdrawal options was worth the additional complexity.

- **Q:** Why reuse a business payment service

We looked at both. Linking external bank accounts could have given us a broader funding and withdrawal experience eventually, but it brought additional account verification, data and integration dependencies.

RBC already had an Interac-based business payout capability. By adapting it for consumer cashback, we could build on a service with an established operational model instead of creating a separate money-movement path.

It wasn't a perfect solution. Our first version relied on the member's email address and required Autodeposit. That narrowed eligibility, and we needed to make it obvious before a member tried to withdraw.

I was comfortable with that trade-off for an initial release, as long as we didn't hide it, had a way to handle unsuccessful or delayed transfers, and could measure how many customers were excluded. We'd then have evidence to decide whether expanding the withdrawal options was worth the additional complexity.

- **Q:** What trade-off did you accept?

We looked at both. Linking external bank accounts could have given us a broader funding and withdrawal experience eventually, but it brought additional account verification, data and integration dependencies.

RBC already had an Interac-based business payout capability. By adapting it for consumer cashback, we could build on a service with an established operational model instead of creating a separate money-movement path.

It wasn't a perfect solution. Our first version relied on the member's email address and required Autodeposit. That narrowed eligibility, and we needed to make it obvious before a member tried to withdraw.

I was comfortable with that trade-off for an initial release, as long as we didn't hide it, had a way to handle unsuccessful or delayed transfers, and could measure how many customers were excluded. We'd then have evidence to decide whether expanding the withdrawal options was worth the additional complexity.

---

### 131. Why invest in native travel instead of keeping the existing webview?

<a id="simplii-john-experience-depth-v1-rbc-travel-choice-why-inves"></a>

- **Import key:** `simplii-john-experience-depth-v1-rbc-travel-choice`
- **Library ID:** `c2ee031b-fcce-42a9-b536-d160ec1cfbf4`
- **Experience:** RBC — Core Web, Mobile & Travel
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I wouldn't choose native simply because it feels more polished. The decision depends on where the existing experience creates friction and what control we need to improve it.

In this case, the argument was continuity: how a member enters the journey, retains context, understands redemption and recovers when something goes wrong. A webview can be a sensible delivery option, but it can constrain how consistently those transitions behave with the surrounding app.

The trade-off is that native experiences create their own development, testing and maintenance obligations. I would compare that cost with the specific customer problems we could solve and the capabilities we could reuse.

The decision should be justified by an important journey we can improve, with a plan to measure it after release.

---

### 132. Why mention 500K+ cardholders if you didn't control the credit book?

<a id="simplii-from-9dbe28fe-5bde-46e2-86a2-2a9381643704-why-mentio"></a>

- **Import key:** `simplii-from-9dbe28fe-5bde-46e2-86a2-2a9381643704`
- **Library ID:** `36205e5d-6c8c-482c-8b83-62cf71bf608e`
- **Experience:** HBC — Cardholder Portfolio & P&L
- **Tier:** P2
- **Evidence:** resume_supported

**Answer (spoken):**

The 500,000-plus figure describes the scale of the cardholder portfolio whose growth and engagement roadmap I worked on. It doesn't mean I personally set underwriting policy or controlled the bank's entire credit book. I think it's useful context because product decisions about onboarding, offers and engagement need to work at that scale, and small percentage changes can have meaningful commercial effects. I'd always distinguish the levers I owned directly from decisions made by Neo Financial or other partners. The size of the portfolio explains scope; it shouldn't be used to overstate my authority.

**Embedded follow-ups (4):**

- **Q:** Card portfolio ownership

The 500,000-plus figure describes the scale of the cardholder portfolio whose growth and engagement roadmap I worked on. It doesn't mean I personally set underwriting policy or controlled the bank's entire credit book. I think it's useful context because product decisions about onboarding, offers and engagement need to work at that scale, and small percentage changes can have meaningful commercial effects. I'd always distinguish the levers I owned directly from decisions made by Neo Financial or other partners. The size of the portfolio explains scope; it shouldn't be used to overstate my authority.

- **Q:** Issuer controls

The 500,000-plus figure describes the scale of the cardholder portfolio whose growth and engagement roadmap I worked on. It doesn't mean I personally set underwriting policy or controlled the bank's entire credit book. I think it's useful context because product decisions about onboarding, offers and engagement need to work at that scale, and small percentage changes can have meaningful commercial effects. I'd always distinguish the levers I owned directly from decisions made by Neo Financial or other partners. The size of the portfolio explains scope; it shouldn't be used to overstate my authority.

- **Q:** 500k scope

The 500,000-plus figure describes the scale of the cardholder portfolio whose growth and engagement roadmap I worked on. It doesn't mean I personally set underwriting policy or controlled the bank's entire credit book. I think it's useful context because product decisions about onboarding, offers and engagement need to work at that scale, and small percentage changes can have meaningful commercial effects. I'd always distinguish the levers I owned directly from decisions made by Neo Financial or other partners. The size of the portfolio explains scope; it shouldn't be used to overstate my authority.

- **Q:** Bank versus retailer P&L

The 500,000-plus figure describes the scale of the cardholder portfolio whose growth and engagement roadmap I worked on. It doesn't mean I personally set underwriting policy or controlled the bank's entire credit book. I think it's useful context because product decisions about onboarding, offers and engagement need to work at that scale, and small percentage changes can have meaningful commercial effects. I'd always distinguish the levers I owned directly from decisions made by Neo Financial or other partners. The size of the portfolio explains scope; it shouldn't be used to overstate my authority.

---

### 133. Why mention 5M+ settlement events when Avion payouts were only $1M+?

<a id="simplii-from-6eb506c0-03c7-4205-aa2a-ba3662c5b94d-why-mentio"></a>

- **Import key:** `simplii-from-6eb506c0-03c7-4205-aa2a-ba3662c5b94d`
- **Library ID:** `5e54960c-7a73-4f33-833c-fbd585b2793d`
- **Experience:** RBC — Avion Select
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

Those are deliberately two different numbers. The $1 million-plus figure refers to annualized cashback withdrawals enabled by the Avion consumer feature. The five million-plus annual events describe the scale of the broader enterprise payments service we integrated with; they weren't all Avion cashback withdrawals. I include it to show the operational environment and why integration and control requirements mattered. I wouldn't use it as a claim about Avion transaction adoption. If we were evaluating the product itself, I'd focus on its actual withdrawals, eligible users, payout completion and support or exception rates.

**Embedded follow-ups (4):**

- **Q:** 5 million transactions?

Those are deliberately two different numbers. The $1 million-plus figure refers to annualized cashback withdrawals enabled by the Avion consumer feature. The five million-plus annual events describe the scale of the broader enterprise payments service we integrated with; they weren't all Avion cashback withdrawals. I include it to show the operational environment and why integration and control requirements mattered. I wouldn't use it as a claim about Avion transaction adoption. If we were evaluating the product itself, I'd focus on its actual withdrawals, eligible users, payout completion and support or exception rates.

- **Q:** Is volume inflated?

Those are deliberately two different numbers. The $1 million-plus figure refers to annualized cashback withdrawals enabled by the Avion consumer feature. The five million-plus annual events describe the scale of the broader enterprise payments service we integrated with; they weren't all Avion cashback withdrawals. I include it to show the operational environment and why integration and control requirements mattered. I wouldn't use it as a claim about Avion transaction adoption. If we were evaluating the product itself, I'd focus on its actual withdrawals, eligible users, payout completion and support or exception rates.

- **Q:** What's the scope of settlement?

Those are deliberately two different numbers. The $1 million-plus figure refers to annualized cashback withdrawals enabled by the Avion consumer feature. The five million-plus annual events describe the scale of the broader enterprise payments service we integrated with; they weren't all Avion cashback withdrawals. I include it to show the operational environment and why integration and control requirements mattered. I wouldn't use it as a claim about Avion transaction adoption. If we were evaluating the product itself, I'd focus on its actual withdrawals, eligible users, payout completion and support or exception rates.

- **Q:** Claim attribution

Those are deliberately two different numbers. The $1 million-plus figure refers to annualized cashback withdrawals enabled by the Avion consumer feature. The five million-plus annual events describe the scale of the broader enterprise payments service we integrated with; they weren't all Avion cashback withdrawals. I include it to show the operational environment and why integration and control requirements mattered. I wouldn't use it as a claim about Avion transaction adoption. If we were evaluating the product itself, I'd focus on its actual withdrawals, eligible users, payout completion and support or exception rates.

---

### 134. Why prioritize a membership platform rather than improving service pages?

<a id="simplii-from-7d32e566-7779-4fe8-bca5-f9db5c8180d1-why-priori"></a>

- **Import key:** `simplii-from-7d32e566-7779-4fe8-bca5-f9db5c8180d1`
- **Library ID:** `5e5687a2-851f-46fc-a99b-b74a655e9f55`
- **Experience:** Arc'teryx — Membership Platform
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

Improving the existing pages was a credible smaller option, and it could have helped people find information. But we were also considering benefits that required the business to recognize a member consistently and apply eligibility rules across different experiences.

A customer shouldn't have to explain their identity and eligibility from scratch every time they move from the website into a repair or guest-service journey.

That made it more than a content or navigation problem. It raised questions about the underlying customer record, the benefit rules and how service teams would fulfil what we promised.

I worked with the business on the potential value and with the service teams on capacity and cost. For the investment to make sense, we needed a credible first release and a way to test actual participation and fulfilment after launch. I didn't want the funding case to depend on assuming that everyone who enrolled would automatically become more loyal.

**Embedded follow-ups (3):**

- **Q:** What business problem did it solve

Improving the existing pages was a credible smaller option, and it could have helped people find information. But we were also considering benefits that required the business to recognize a member consistently and apply eligibility rules across different experiences.

A customer shouldn't have to explain their identity and eligibility from scratch every time they move from the website into a repair or guest-service journey.

That made it more than a content or navigation problem. It raised questions about the underlying customer record, the benefit rules and how service teams would fulfil what we promised.

I worked with the business on the potential value and with the service teams on capacity and cost. For the investment to make sense, we needed a credible first release and a way to test actual participation and fulfilment after launch. I didn't want the funding case to depend on assuming that everyone who enrolled would automatically become more loyal.

- **Q:** Why invest $5.2M

Improving the existing pages was a credible smaller option, and it could have helped people find information. But we were also considering benefits that required the business to recognize a member consistently and apply eligibility rules across different experiences.

A customer shouldn't have to explain their identity and eligibility from scratch every time they move from the website into a repair or guest-service journey.

That made it more than a content or navigation problem. It raised questions about the underlying customer record, the benefit rules and how service teams would fulfil what we promised.

I worked with the business on the potential value and with the service teams on capacity and cost. For the investment to make sense, we needed a credible first release and a way to test actual participation and fulfilment after launch. I didn't want the funding case to depend on assuming that everyone who enrolled would automatically become more loyal.

- **Q:** Why was this worth doing?

Improving the existing pages was a credible smaller option, and it could have helped people find information. But we were also considering benefits that required the business to recognize a member consistently and apply eligibility rules across different experiences.

A customer shouldn't have to explain their identity and eligibility from scratch every time they move from the website into a repair or guest-service journey.

That made it more than a content or navigation problem. It raised questions about the underlying customer record, the benefit rules and how service teams would fulfil what we promised.

I worked with the business on the potential value and with the service teams on capacity and cost. For the investment to make sense, we needed a credible first release and a way to test actual participation and fulfilment after launch. I didn't want the funding case to depend on assuming that everyone who enrolled would automatically become more loyal.

---

### 135. Why prioritize application continuation instead of more acquisition?

<a id="simplii-from-d9c4b9aa-5e54-44a8-b246-c99a3a380239-why-priori"></a>

- **Import key:** `simplii-from-d9c4b9aa-5e54-44a8-b246-c99a3a380239`
- **Library ID:** `a3533970-6882-486d-a706-8922469c3928`
- **Experience:** HBC — Mastercard Acquisition
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

These were people who had already shown intent by starting an application. We knew where some of them were dropping out, and we had a plausible explanation for what was getting in their way.

Adding more acquisition placements might have produced more starts, but it wouldn't address the experience those applicants were entering. Improving completion could generate more submitted applications from the same audience without needing to increase traffic.

It was also an opportunity we could test with existing demand. We could keep the product offer and underwriting requirements consistent, improve how people returned to an application, and measure whether more starters completed it.

That combination of customer benefit, commercial potential and a focused experiment made it a reasonable priority.

**Embedded follow-ups (3):**

- **Q:** Why this problem

These were people who had already shown intent by starting an application. We knew where some of them were dropping out, and we had a plausible explanation for what was getting in their way.

Adding more acquisition placements might have produced more starts, but it wouldn't address the experience those applicants were entering. Improving completion could generate more submitted applications from the same audience without needing to increase traffic.

It was also an opportunity we could test with existing demand. We could keep the product offer and underwriting requirements consistent, improve how people returned to an application, and measure whether more starters completed it.

That combination of customer benefit, commercial potential and a focused experiment made it a reasonable priority.

- **Q:** What did you deprioritize

These were people who had already shown intent by starting an application. We knew where some of them were dropping out, and we had a plausible explanation for what was getting in their way.

Adding more acquisition placements might have produced more starts, but it wouldn't address the experience those applicants were entering. Improving completion could generate more submitted applications from the same audience without needing to increase traffic.

It was also an opportunity we could test with existing demand. We could keep the product offer and underwriting requirements consistent, improve how people returned to an application, and measure whether more starters completed it.

That combination of customer benefit, commercial potential and a focused experiment made it a reasonable priority.

- **Q:** How did you size the opportunity?

These were people who had already shown intent by starting an application. We knew where some of them were dropping out, and we had a plausible explanation for what was getting in their way.

Adding more acquisition placements might have produced more starts, but it wouldn't address the experience those applicants were entering. Improving completion could generate more submitted applications from the same audience without needing to increase traffic.

It was also an opportunity we could test with existing demand. We could keep the product offer and underwriting requirements consistent, improve how people returned to an application, and measure whether more starters completed it.

That combination of customer benefit, commercial potential and a focused experiment made it a reasonable priority.

---

### 136. Why save-and-resume, and how did you split ownership with Neo?

<a id="simplii-from-c60f747c-fd04-49d7-821c-1ed3e4a0d4c9-why-save-a"></a>

- **Import key:** `simplii-from-c60f747c-fd04-49d7-821c-1ed3e4a0d4c9`
- **Library ID:** `d2634dd3-6a27-4a71-853a-87556928e424`
- **Experience:** HBC — Mastercard Acquisition
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

We considered simpler form interactions and reminder messaging. Those could help, but the research suggested a more basic issue: customers needed a reliable way to continue an application after an interruption.

The proposed design was secure save-and-resume. Neo retained the application data and handled authentication. HBC provided a clear route back into the right application and told customers what to expect.

That boundary mattered. We didn't need to duplicate sensitive financial application data inside HBC systems just to solve a navigation problem.

We still had to define what happened when a link expired, the application had already been submitted or a partner status was temporarily unavailable. Those edge cases were important because a customer shouldn't be encouraged to create a duplicate application simply because the interface was unclear.

**Embedded follow-ups (3):**

- **Q:** Why not shorten the form

We considered simpler form interactions and reminder messaging. Those could help, but the research suggested a more basic issue: customers needed a reliable way to continue an application after an interruption.

The proposed design was secure save-and-resume. Neo retained the application data and handled authentication. HBC provided a clear route back into the right application and told customers what to expect.

That boundary mattered. We didn't need to duplicate sensitive financial application data inside HBC systems just to solve a navigation problem.

We still had to define what happened when a link expired, the application had already been submitted or a partner status was temporarily unavailable. Those edge cases were important because a customer shouldn't be encouraged to create a duplicate application simply because the interface was unclear.

- **Q:** What did your team build

We considered simpler form interactions and reminder messaging. Those could help, but the research suggested a more basic issue: customers needed a reliable way to continue an application after an interruption.

The proposed design was secure save-and-resume. Neo retained the application data and handled authentication. HBC provided a clear route back into the right application and told customers what to expect.

That boundary mattered. We didn't need to duplicate sensitive financial application data inside HBC systems just to solve a navigation problem.

We still had to define what happened when a link expired, the application had already been submitted or a partner status was temporarily unavailable. Those edge cases were important because a customer shouldn't be encouraged to create a duplicate application simply because the interface was unclear.

- **Q:** How did the partner integration work?

We considered simpler form interactions and reminder messaging. Those could help, but the research suggested a more basic issue: customers needed a reliable way to continue an application after an interruption.

The proposed design was secure save-and-resume. Neo retained the application data and handled authentication. HBC provided a clear route back into the right application and told customers what to expect.

That boundary mattered. We didn't need to duplicate sensitive financial application data inside HBC systems just to solve a navigation problem.

We still had to define what happened when a link expired, the application had already been submitted or a partner status was temporarily unavailable. Those edge cases were important because a customer shouldn't be encouraged to create a duplicate application simply because the interface was unclear.

---

### 137. Why this solution and why start in North America?

<a id="simplii-from-d8d2b2a3-94db-456b-b6d2-f94c28429a61-why-this-s"></a>

- **Import key:** `simplii-from-d8d2b2a3-94db-456b-b6d2-f94c28429a61`
- **Library ID:** `8eec9125-4cfd-4ea9-945b-b42361130370`
- **Experience:** Arc'teryx — Membership Platform
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

We wanted one coherent member experience, but a lot of the value would still be delivered by existing services like repair, events and resale. The solution therefore needed to connect those services rather than replace them all.

A configurable headless membership engine made sense for common member and benefit rules, while we kept control of the customer-facing experience and its integrations. We assessed five vendors, and that direction reduced the projected delivery timeline by about two quarters.

I also recommended focusing the broader MVP on North America. Service availability and fulfilment differed by market, and we needed to make sure a benefit shown to a member could actually be honoured where they lived.

The trade-off was a narrower first release. I'd rather launch a useful, complete journey in a defined market than claim broad coverage with exceptions customers only discover when they try to use a benefit.

**Embedded follow-ups (3):**

- **Q:** Why a headless membership engine

We wanted one coherent member experience, but a lot of the value would still be delivered by existing services like repair, events and resale. The solution therefore needed to connect those services rather than replace them all.

A configurable headless membership engine made sense for common member and benefit rules, while we kept control of the customer-facing experience and its integrations. We assessed five vendors, and that direction reduced the projected delivery timeline by about two quarters.

I also recommended focusing the broader MVP on North America. Service availability and fulfilment differed by market, and we needed to make sure a benefit shown to a member could actually be honoured where they lived.

The trade-off was a narrower first release. I'd rather launch a useful, complete journey in a defined market than claim broad coverage with exceptions customers only discover when they try to use a benefit.

- **Q:** What alternatives did you consider

We wanted one coherent member experience, but a lot of the value would still be delivered by existing services like repair, events and resale. The solution therefore needed to connect those services rather than replace them all.

A configurable headless membership engine made sense for common member and benefit rules, while we kept control of the customer-facing experience and its integrations. We assessed five vendors, and that direction reduced the projected delivery timeline by about two quarters.

I also recommended focusing the broader MVP on North America. Service availability and fulfilment differed by market, and we needed to make sure a benefit shown to a member could actually be honoured where they lived.

The trade-off was a narrower first release. I'd rather launch a useful, complete journey in a defined market than claim broad coverage with exceptions customers only discover when they try to use a benefit.

- **Q:** Why not launch globally?

We wanted one coherent member experience, but a lot of the value would still be delivered by existing services like repair, events and resale. The solution therefore needed to connect those services rather than replace them all.

A configurable headless membership engine made sense for common member and benefit rules, while we kept control of the customer-facing experience and its integrations. We assessed five vendors, and that direction reduced the projected delivery timeline by about two quarters.

I also recommended focusing the broader MVP on North America. Service availability and fulfilment differed by market, and we needed to make sure a benefit shown to a member could actually be honoured where they lived.

The trade-off was a narrower first release. I'd rather launch a useful, complete journey in a defined market than claim broad coverage with exceptions customers only discover when they try to use a benefit.

---

### 138. Why use Interac e-Transfer rather than EFT for cashback withdrawals?

<a id="simplii-from-3c199d05-67ba-4f4c-aa98-d7f06a2cc3c6-why-use-in"></a>

- **Import key:** `simplii-from-3c199d05-67ba-4f4c-aa98-d7f06a2cc3c6`
- **Library ID:** `2e484123-59ba-4c11-a61b-76bc1a8211b0`
- **Experience:** RBC — Cashback Withdrawals
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

The product problem was letting a non-RBC member receive cashback without needing an RBC bank account. Interac e-Transfer provided a familiar way for Canadian consumers to receive those payouts, and we were able to adapt an existing enterprise capability. I wouldn't suggest Interac is always the better rail. I'd compare available integrations, customer experience, limits, cost, timing, error handling and operational risk against the use case. For a recurring payroll deposit or certain high-volume account-to-account transfers, EFT may be more appropriate. The important PM decision is choosing the rail that serves the customer need within the bank's constraints, rather than using the same rail for everything.

**Embedded follow-ups (5):**

- **Q:** Rail selection

The product problem was letting a non-RBC member receive cashback without needing an RBC bank account. Interac e-Transfer provided a familiar way for Canadian consumers to receive those payouts, and we were able to adapt an existing enterprise capability. I wouldn't suggest Interac is always the better rail. I'd compare available integrations, customer experience, limits, cost, timing, error handling and operational risk against the use case. For a recurring payroll deposit or certain high-volume account-to-account transfers, EFT may be more appropriate. The important PM decision is choosing the rail that serves the customer need within the bank's constraints, rather than using the same rail for everything.

- **Q:** Why Interac

The product problem was letting a non-RBC member receive cashback without needing an RBC bank account. Interac e-Transfer provided a familiar way for Canadian consumers to receive those payouts, and we were able to adapt an existing enterprise capability. I wouldn't suggest Interac is always the better rail. I'd compare available integrations, customer experience, limits, cost, timing, error handling and operational risk against the use case. For a recurring payroll deposit or certain high-volume account-to-account transfers, EFT may be more appropriate. The important PM decision is choosing the rail that serves the customer need within the bank's constraints, rather than using the same rail for everything.

- **Q:** EFT versus e-transfer

The product problem was letting a non-RBC member receive cashback without needing an RBC bank account. Interac e-Transfer provided a familiar way for Canadian consumers to receive those payouts, and we were able to adapt an existing enterprise capability. I wouldn't suggest Interac is always the better rail. I'd compare available integrations, customer experience, limits, cost, timing, error handling and operational risk against the use case. For a recurring payroll deposit or certain high-volume account-to-account transfers, EFT may be more appropriate. The important PM decision is choosing the rail that serves the customer need within the bank's constraints, rather than using the same rail for everything.

- **Q:** Payments trade-offs

The product problem was letting a non-RBC member receive cashback without needing an RBC bank account. Interac e-Transfer provided a familiar way for Canadian consumers to receive those payouts, and we were able to adapt an existing enterprise capability. I wouldn't suggest Interac is always the better rail. I'd compare available integrations, customer experience, limits, cost, timing, error handling and operational risk against the use case. For a recurring payroll deposit or certain high-volume account-to-account transfers, EFT may be more appropriate. The important PM decision is choosing the rail that serves the customer need within the bank's constraints, rather than using the same rail for everything.

- **Q:** RBC — After a timeout, how do you prevent duplicates and establish payment statu

The first rule is that a timeout is not a declined payment. It means the customer-facing service didn't receive a conclusive response. The instruction may still be processing, and treating that as a failure can create a second payout.

So before launch, I'd want the withdrawal requirement to cover an uncertain outcome explicitly. When the request is initiated, the journey needs a stable reference that can be traced end to end. If we lose the response, we show the customer that the withdrawal is being checked rather than encouraging a new submission.

On the service side, I'd work with the payments owners to confirm how duplicate protection and authoritative status are actually supported. Ideally a retry against the same business request can't move money twice, and there is a reliable way to reconcile the original instruction to its final outcome.

My job is to insist that the contract, customer states, support path and acceptance criteria address that failure mode. The enterprise team decides how the mechanism is implemented, because I don't own their payment architecture.

---

### 139. Why was a browser extension the right place to solve cashback discovery?

<a id="simplii-john-experience-depth-v1-rbc-shopplus-discovery-why-"></a>

- **Import key:** `simplii-john-experience-depth-v1-rbc-shopplus-discovery`
- **Library ID:** `2debf81a-ee8d-4725-8e16-f0ec6ed05429`
- **Experience:** RBC — ShopPlus
- **Tier:** P1
- **Evidence:** illustrative_scenario

**Answer (spoken):**

The opportunity was the distance between discovering a reward and making a purchase.

A member might understand the cashback proposition but still shop directly with a retailer. If the benefit depended on remembering an earlier step in the rewards journey, useful offers could be missed.

The browser gave us a way to meet the customer nearer to that moment. But I would still test whether the intervention helped. If it appeared too often, covered too much of the page or offered irrelevant information, it could create more friction than value.

So the product hypothesis was specific: make an eligible cashback opportunity visible at the relevant moment, explain the next action and then get out of the way. Installation alone wouldn't validate that hypothesis.

---

### 140. Why was a rules-based approach suitable for Quests?

<a id="simplii-john-experience-depth-v1-hbc-quests-rules-why-was-a-"></a>

- **Import key:** `simplii-john-experience-depth-v1-hbc-quests-rules`
- **Library ID:** `3eb4ee01-ba35-46fa-9c90-5540ccdcfea2`
- **Experience:** HBC — Quests
- **Tier:** P1
- **Evidence:** illustrative_scenario

**Answer (spoken):**

A rules-based approach suited a product where eligibility and customer expectations needed to be explainable.

The business needed to define who could receive an offer, what action qualified and when the benefit applied. Customers and support teams also needed a dependable explanation if someone expected a reward and didn't receive it.

Rules give you a controlled starting point for that. They can be tested against known customer states, reviewed with business owners and changed without making the experience dependent on an opaque prediction.

That doesn't prevent more sophisticated targeting later. I would first establish reliable eligibility, measurement and reward handling. Once those foundations work, we can evaluate whether a model improves a specific decision enough to justify its complexity.

---

### 141. Why was it worth prioritizing?

<a id="simplii-from-f2dabb52-3af6-43eb-ab59-c5934bc3a036-why-was-it"></a>

- **Import key:** `simplii-from-f2dabb52-3af6-43eb-ab59-c5934bc3a036`
- **Library ID:** `d74e7bba-7f31-4919-b20b-3bc6b7894ef9`
- **Experience:** Aeroplan — Co-brand Card Acquisition
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

Card acquisition was a significant growth opportunity, and the offer experience was one of the parts of the journey we could actually change.

We had a reasonably well-defined problem and a test we could run without rebuilding the bank's application flow. That made it more practical than trying to solve every drop-off point across every issuer at once.

We started with one issuer, one offer and logged-in mobile members so the audience and measurement were clear. We agreed on the reporting with the bank so we could decide whether the results justified expanding it.

I also liked that it tested something more meaningful than button design: whether helping people understand a financial product earlier produced better downstream behaviour.

**Embedded follow-ups (3):**

- **Q:** Why this funnel change

Card acquisition was a significant growth opportunity, and the offer experience was one of the parts of the journey we could actually change.

We had a reasonably well-defined problem and a test we could run without rebuilding the bank's application flow. That made it more practical than trying to solve every drop-off point across every issuer at once.

We started with one issuer, one offer and logged-in mobile members so the audience and measurement were clear. We agreed on the reporting with the bank so we could decide whether the results justified expanding it.

I also liked that it tested something more meaningful than button design: whether helping people understand a financial product earlier produced better downstream behaviour.

- **Q:** Why not drive more traffic

Card acquisition was a significant growth opportunity, and the offer experience was one of the parts of the journey we could actually change.

We had a reasonably well-defined problem and a test we could run without rebuilding the bank's application flow. That made it more practical than trying to solve every drop-off point across every issuer at once.

We started with one issuer, one offer and logged-in mobile members so the audience and measurement were clear. We agreed on the reporting with the bank so we could decide whether the results justified expanding it.

I also liked that it tested something more meaningful than button design: whether helping people understand a financial product earlier produced better downstream behaviour.

- **Q:** Why start with one issuer?

Card acquisition was a significant growth opportunity, and the offer experience was one of the parts of the journey we could actually change.

We had a reasonably well-defined problem and a test we could run without rebuilding the bank's application flow. That made it more practical than trying to solve every drop-off point across every issuer at once.

We started with one issuer, one offer and logged-in mobile members so the audience and measurement were clear. We agreed on the reporting with the bank so we could decide whether the results justified expanding it.

I also liked that it tested something more meaningful than button design: whether helping people understand a financial product earlier produced better downstream behaviour.

---

### 142. Would you make the same Interac versus EFT decision for a recurring payroll or bill-payment product?

<a id="simplii-from-cd39ab59-8574-443c-b78e-a9dfa3010185-would-you-"></a>

- **Import key:** `simplii-from-cd39ab59-8574-443c-b78e-a9dfa3010185`
- **Library ID:** `da4555a2-025d-4f0d-9853-58d328e9d4bb`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** resume_supported

**Answer (spoken):**

Not automatically. The best payment rail depends on the use case, frequency, cost, customer experience and operational constraints.

For an occasional consumer cashback payout, Interac offered a practical path using infrastructure that already existed at RBC. That doesn't mean it's the right rail for recurring payroll deposits or pre-authorized bill payments. Those have different initiation patterns, returns, timing and customer expectations.

I'd start by mapping the user journey and the actual money movement, then compare the available rails on reliability, economics, eligibility and exception handling. The lesson from RBC wasn't to prefer Interac everywhere. It was to reuse proven capabilities when they genuinely fit the problem.

---

### 143. You say HBC's modeled lifetime value increased 10%. How would you explain that metric?

<a id="simplii-from-333428ab-ba63-4939-a069-a376f0334868-you-say-hb"></a>

- **Import key:** `simplii-from-333428ab-ba63-4939-a069-a376f0334868`
- **Library ID:** `0b835602-8fbe-4800-8d15-72b4c51bcf33`
- **Experience:** HBC — Mastercard Acquisition
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd make a distinction between a realized financial outcome and an estimated lifetime value.

Customer lifetime value is forward-looking. It's based on assumptions about future customer behaviour and the economics of maintaining that relationship.

For a cardholder portfolio, I'd want to look at spending patterns, retention, relevant revenue or contribution economics, incentive costs and the expected duration of the relationship.

The key is understanding which assumptions are driving the change.

For example, an increase in short-term promotional spending shouldn't automatically translate into a large improvement in lifetime value if we don't expect that behaviour to continue.

That's why I'd look at observed cohort performance separately from the modeled value.

I'd also want to understand how sensitive the result is to retention assumptions and incentive costs.

The 10% figure was an estimated LTV improvement, not a claim that we had already realized an additional 10% in lifetime profits.

---

### 144. You secured $5.2M at Arc'teryx. Was the programme launched?

<a id="simplii-from-b1eac049-c167-4977-a7bd-55e98d7e3b0b-you-secure"></a>

- **Import key:** `simplii-from-b1eac049-c167-4977-a7bd-55e98d7e3b0b`
- **Library ID:** `b94d6ad3-774b-4158-8b78-93ae5a52904a`
- **Experience:** Arc'teryx — Membership Platform
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

The $5.2 million refers to capital funding approved for the membership programme, not revenue generated and not proof that the complete platform had launched. My role covered strategy, business alignment, product scope and platform direction. During that period, we also worked on sequencing smaller benefits independently of the full membership build. I would distinguish what was approved, what was designed and what was actually released. I think that's important because a strong product investment decision is meaningful, but it isn't the same outcome as scaled post-launch adoption.

**Embedded follow-ups (4):**

- **Q:** Arc membership launched?

The $5.2 million refers to capital funding approved for the membership programme, not revenue generated and not proof that the complete platform had launched. My role covered strategy, business alignment, product scope and platform direction. During that period, we also worked on sequencing smaller benefits independently of the full membership build. I would distinguish what was approved, what was designed and what was actually released. I think that's important because a strong product investment decision is meaningful, but it isn't the same outcome as scaled post-launch adoption.

- **Q:** Funding versus shipment

The $5.2 million refers to capital funding approved for the membership programme, not revenue generated and not proof that the complete platform had launched. My role covered strategy, business alignment, product scope and platform direction. During that period, we also worked on sequencing smaller benefits independently of the full membership build. I would distinguish what was approved, what was designed and what was actually released. I think that's important because a strong product investment decision is meaningful, but it isn't the same outcome as scaled post-launch adoption.

- **Q:** 0-to-1 claim

The $5.2 million refers to capital funding approved for the membership programme, not revenue generated and not proof that the complete platform had launched. My role covered strategy, business alignment, product scope and platform direction. During that period, we also worked on sequencing smaller benefits independently of the full membership build. I would distinguish what was approved, what was designed and what was actually released. I think that's important because a strong product investment decision is meaningful, but it isn't the same outcome as scaled post-launch adoption.

- **Q:** Capital approval

The $5.2 million refers to capital funding approved for the membership programme, not revenue generated and not proof that the complete platform had launched. My role covered strategy, business alignment, product scope and platform direction. During that period, we also worked on sequencing smaller benefits independently of the full membership build. I would distinguish what was approved, what was designed and what was actually released. I think that's important because a strong product investment decision is meaningful, but it isn't the same outcome as scaled post-launch adoption.

---

## Product & Banking Knowledge

<a id="product-banking-knowledge"></a>

### 1. A customer sees the same purchase twice, once pending and once posted. How would you fix it?

<a id="simplii-from-ec3a7c0b-b921-45be-8548-df8c95b2f713-a-customer"></a>

- **Import key:** `simplii-from-ec3a7c0b-b921-45be-8548-df8c95b2f713`
- **Library ID:** `f7fcf23e-28aa-48e9-bff3-bf83cfcb5501`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd first make sure we're not looking at two actual financial events. A pending authorization and a later posted clearing transaction can represent stages of the same purchase, but their identifiers and amounts may differ.

The experience should link them where we have reliable evidence and replace or resolve the pending presentation when the posted record arrives, rather than showing both as separate settled spending. I'd ask engineering how we correlate those events and what exceptions exist for tips, fuel or adjusted amounts.

I'd also give Support a way to see the underlying states. The goal is accurate display without hiding a genuine duplicate charge.

---

### 2. Card payments start declining, but the banking app and core ledger are online. Where do you look?

<a id="simplii-from-d8be8368-b755-4baf-8494-3cf9a9f8a69e-card-payme"></a>

- **Import key:** `simplii-from-d8be8368-b755-4baf-8494-3cf9a9f8a69e`
- **Library ID:** `a3ff54fb-0700-45c2-a800-4f431d80ef75`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd treat card authorization as its own end-to-end service, not assume the whole banking product is healthy because account login works.

I'd break declines down by merchant category, processor response, card status, geography, balance state and time. Are we seeing legitimate insufficient-funds decisions, new fraud rules, a card-network problem or an integration outage?

I wouldn't suggest disabling risk controls broadly just to improve approval rates. I'd bring the card processor, Risk, Operations and engineering owners together, focus on the affected cohort and distinguish genuine declines from technical failures.

For customers, we'd want a clear, safe support path and communication that doesn't disclose sensitive fraud logic.

---

### 3. Explain how you would model customer lifetime value in banking.

<a id="simplii-from-96d0d431-bf77-42e5-85b5-1b8106ff1edc-explain-ho"></a>

- **Import key:** `simplii-from-96d0d431-bf77-42e5-85b5-1b8106ff1edc`
- **Library ID:** `9ab3cfa1-fabb-4c64-8ffd-f88e7eb6ed2d`
- **Experience:** Product Metrics & Economics
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd model expected contribution over the customer relationship, not simply future revenue. The drivers would depend on the product, but could include net interest or fee contribution, card economics, retention, product adoption, servicing and fraud costs, and incentives. I'd make the time horizon and discounting assumptions explicit. I'd also separate what we've observed from what we're forecasting. If a promotional campaign temporarily increases spending, I wouldn't assume that higher level persists indefinitely. I'd build sensitivity scenarios for retention and behaviour, because those assumptions can dominate the result. A model is useful when it informs an investment decision, not when it produces a conveniently precise number.

**Embedded follow-ups (4):**

- **Q:** LTV model

I'd model expected contribution over the customer relationship, not simply future revenue. The drivers would depend on the product, but could include net interest or fee contribution, card economics, retention, product adoption, servicing and fraud costs, and incentives. I'd make the time horizon and discounting assumptions explicit. I'd also separate what we've observed from what we're forecasting. If a promotional campaign temporarily increases spending, I wouldn't assume that higher level persists indefinitely. I'd build sensitivity scenarios for retention and behaviour, because those assumptions can dominate the result. A model is useful when it informs an investment decision, not when it produces a conveniently precise number.

- **Q:** Bank unit economics

I'd model expected contribution over the customer relationship, not simply future revenue. The drivers would depend on the product, but could include net interest or fee contribution, card economics, retention, product adoption, servicing and fraud costs, and incentives. I'd make the time horizon and discounting assumptions explicit. I'd also separate what we've observed from what we're forecasting. If a promotional campaign temporarily increases spending, I wouldn't assume that higher level persists indefinitely. I'd build sensitivity scenarios for retention and behaviour, because those assumptions can dominate the result. A model is useful when it informs an investment decision, not when it produces a conveniently precise number.

- **Q:** CLV drivers

I'd model expected contribution over the customer relationship, not simply future revenue. The drivers would depend on the product, but could include net interest or fee contribution, card economics, retention, product adoption, servicing and fraud costs, and incentives. I'd make the time horizon and discounting assumptions explicit. I'd also separate what we've observed from what we're forecasting. If a promotional campaign temporarily increases spending, I wouldn't assume that higher level persists indefinitely. I'd build sensitivity scenarios for retention and behaviour, because those assumptions can dominate the result. A model is useful when it informs an investment decision, not when it produces a conveniently precise number.

- **Q:** Revenue model

I'd model expected contribution over the customer relationship, not simply future revenue. The drivers would depend on the product, but could include net interest or fee contribution, card economics, retention, product adoption, servicing and fraud costs, and incentives. I'd make the time horizon and discounting assumptions explicit. I'd also separate what we've observed from what we're forecasting. If a promotional campaign temporarily increases spending, I wouldn't assume that higher level persists indefinitely. I'd build sensitivity scenarios for retention and behaviour, because those assumptions can dominate the result. A model is useful when it informs an investment decision, not when it produces a conveniently precise number.

---

### 4. Give me an exact definition of a monthly active banking customer.

<a id="simplii-from-7ade5d00-b631-4813-bf25-039f6c808fa5-give-me-an"></a>

- **Import key:** `simplii-from-7ade5d00-b631-4813-bf25-039f6c808fa5`
- **Library ID:** `77bf9913-88c6-4e94-9ef8-8ef439f9e5c6`
- **Experience:** Product Metrics & Economics
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd avoid defining it simply as someone who opened the app. For operating purposes, I'd propose a monthly transacting customer: an eligible account holder with at least one qualifying financial transaction during the calendar month, with the qualifying actions agreed across Product, Finance and Data. We would need to decide whether transfers between a customer's own accounts count, and I'd probably track those separately from external payments or purchases. I'd exclude reversals and technical events from the numerator and make the denominator consistent. I would keep login MAU as a separate engagement signal. Clear definitions matter because it's very easy for two teams to report very different 'active customer' numbers.

**Embedded follow-ups (4):**

- **Q:** Define MATU

I'd avoid defining it simply as someone who opened the app. For operating purposes, I'd propose a monthly transacting customer: an eligible account holder with at least one qualifying financial transaction during the calendar month, with the qualifying actions agreed across Product, Finance and Data. We would need to decide whether transfers between a customer's own accounts count, and I'd probably track those separately from external payments or purchases. I'd exclude reversals and technical events from the numerator and make the denominator consistent. I would keep login MAU as a separate engagement signal. Clear definitions matter because it's very easy for two teams to report very different 'active customer' numbers.

- **Q:** MAU versus transacting

I'd avoid defining it simply as someone who opened the app. For operating purposes, I'd propose a monthly transacting customer: an eligible account holder with at least one qualifying financial transaction during the calendar month, with the qualifying actions agreed across Product, Finance and Data. We would need to decide whether transfers between a customer's own accounts count, and I'd probably track those separately from external payments or purchases. I'd exclude reversals and technical events from the numerator and make the denominator consistent. I would keep login MAU as a separate engagement signal. Clear definitions matter because it's very easy for two teams to report very different 'active customer' numbers.

- **Q:** Active banking definition

I'd avoid defining it simply as someone who opened the app. For operating purposes, I'd propose a monthly transacting customer: an eligible account holder with at least one qualifying financial transaction during the calendar month, with the qualifying actions agreed across Product, Finance and Data. We would need to decide whether transfers between a customer's own accounts count, and I'd probably track those separately from external payments or purchases. I'd exclude reversals and technical events from the numerator and make the denominator consistent. I would keep login MAU as a separate engagement signal. Clear definitions matter because it's very easy for two teams to report very different 'active customer' numbers.

- **Q:** Metric denominator

I'd avoid defining it simply as someone who opened the app. For operating purposes, I'd propose a monthly transacting customer: an eligible account holder with at least one qualifying financial transaction during the calendar month, with the qualifying actions agreed across Product, Finance and Data. We would need to decide whether transfers between a customer's own accounts count, and I'd probably track those separately from external payments or purchases. I'd exclude reversals and technical events from the numerator and make the denominator consistent. I would keep login MAU as a separate engagement signal. Clear definitions matter because it's very easy for two teams to report very different 'active customer' numbers.

---

### 5. How did you experiment when the bank owned the application form?

<a id="simplii-from-1161687d-c6f7-4dd4-9c47-39354f254b09-how-did-yo"></a>

- **Import key:** `simplii-from-1161687d-c6f7-4dd4-9c47-39354f254b09`
- **Library ID:** `17f22640-e461-487d-beed-25d36580d9c0`
- **Experience:** Product Metrics & Economics
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

With a co-branded card journey, you have to be specific about where the airline's experience ends and the issuer's experience begins. Product work can include offer discovery, placement, messaging, eligibility guidance, handoff quality and the parts of the journey the partner allows you to influence. I'd track the funnel at those boundaries and work with the issuer on shared measurement where data is available. I wouldn't claim we had unrestricted ability to change underwriting or the bank's entire application form. A good PM can still create meaningful conversion improvements by focusing on the stages they can actually influence.

**Embedded follow-ups (4):**

- **Q:** Issuer handoff

With a co-branded card journey, you have to be specific about where the airline's experience ends and the issuer's experience begins. Product work can include offer discovery, placement, messaging, eligibility guidance, handoff quality and the parts of the journey the partner allows you to influence. I'd track the funnel at those boundaries and work with the issuer on shared measurement where data is available. I wouldn't claim we had unrestricted ability to change underwriting or the bank's entire application form. A good PM can still create meaningful conversion improvements by focusing on the stages they can actually influence.

- **Q:** Partner-owned funnel

With a co-branded card journey, you have to be specific about where the airline's experience ends and the issuer's experience begins. Product work can include offer discovery, placement, messaging, eligibility guidance, handoff quality and the parts of the journey the partner allows you to influence. I'd track the funnel at those boundaries and work with the issuer on shared measurement where data is available. I wouldn't claim we had unrestricted ability to change underwriting or the bank's entire application form. A good PM can still create meaningful conversion improvements by focusing on the stages they can actually influence.

- **Q:** Aeroplan conversion test

With a co-branded card journey, you have to be specific about where the airline's experience ends and the issuer's experience begins. Product work can include offer discovery, placement, messaging, eligibility guidance, handoff quality and the parts of the journey the partner allows you to influence. I'd track the funnel at those boundaries and work with the issuer on shared measurement where data is available. I wouldn't claim we had unrestricted ability to change underwriting or the bank's entire application form. A good PM can still create meaningful conversion improvements by focusing on the stages they can actually influence.

- **Q:** What was controlled?

With a co-branded card journey, you have to be specific about where the airline's experience ends and the issuer's experience begins. Product work can include offer discovery, placement, messaging, eligibility guidance, handoff quality and the parts of the journey the partner allows you to influence. I'd track the funnel at those boundaries and work with the issuer on shared measurement where data is available. I wouldn't claim we had unrestricted ability to change underwriting or the bank's entire application form. A good PM can still create meaningful conversion improvements by focusing on the stages they can actually influence.

---

### 6. How do pending and posted card transactions differ?

<a id="simplii-from-fb56f902-9f1a-4f18-9f34-dffa2027c038-how-do-pen"></a>

- **Import key:** `simplii-from-fb56f902-9f1a-4f18-9f34-dffa2027c038`
- **Library ID:** `c3a4197c-20cd-466f-96ad-8f44a3bf61cf`
- **Experience:** Payments & Controls
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

A pending card transaction generally reflects an authorization or hold before the final posted transaction is available. The amount can change, and a pending authorization may expire or be reversed. A posted transaction represents a later processing state, although disputes or adjustments can still occur. From a product perspective, I want customers to understand why a pending amount may differ from the final charge and how it affects available funds. I'd work with the Card and ledger teams to make those states accurate and consistent. I wouldn't simplify them so aggressively that we mislead someone about their money.

**Embedded follow-ups (4):**

- **Q:** Pending versus settled

A pending card transaction generally reflects an authorization or hold before the final posted transaction is available. The amount can change, and a pending authorization may expire or be reversed. A posted transaction represents a later processing state, although disputes or adjustments can still occur. From a product perspective, I want customers to understand why a pending amount may differ from the final charge and how it affects available funds. I'd work with the Card and ledger teams to make those states accurate and consistent. I wouldn't simplify them so aggressively that we mislead someone about their money.

- **Q:** Transaction state

A pending card transaction generally reflects an authorization or hold before the final posted transaction is available. The amount can change, and a pending authorization may expire or be reversed. A posted transaction represents a later processing state, although disputes or adjustments can still occur. From a product perspective, I want customers to understand why a pending amount may differ from the final charge and how it affects available funds. I'd work with the Card and ledger teams to make those states accurate and consistent. I wouldn't simplify them so aggressively that we mislead someone about their money.

- **Q:** Authorization and clearing

A pending card transaction generally reflects an authorization or hold before the final posted transaction is available. The amount can change, and a pending authorization may expire or be reversed. A posted transaction represents a later processing state, although disputes or adjustments can still occur. From a product perspective, I want customers to understand why a pending amount may differ from the final charge and how it affects available funds. I'd work with the Card and ledger teams to make those states accurate and consistent. I wouldn't simplify them so aggressively that we mislead someone about their money.

- **Q:** Available balance

A pending card transaction generally reflects an authorization or hold before the final posted transaction is available. The amount can change, and a pending authorization may expire or be reversed. A posted transaction represents a later processing state, although disputes or adjustments can still occur. From a product perspective, I want customers to understand why a pending amount may differ from the final charge and how it affects available funds. I'd work with the Card and ledger teams to make those states accurate and consistent. I wouldn't simplify them so aggressively that we mislead someone about their money.

---

### 7. How do you decide whether to experiment or commit directly to delivery?

<a id="simplii-from-03d6326e-9615-4ffc-8464-d9d6c186811d-how-do-you"></a>

- **Import key:** `simplii-from-03d6326e-9615-4ffc-8464-d9d6c186811d`
- **Library ID:** `6be6d298-8e8d-4081-876e-956fd949fead`
- **Experience:** Product Metrics & Economics
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I look at two things: how uncertain the outcome is and how costly it would be to get the decision wrong.

For something like a new onboarding message or offer placement, experimentation is usually a good approach. We can learn relatively quickly without taking significant operational risk.

For foundational banking capabilities, like transaction integrity or required controls, I wouldn't treat correctness as something to A/B test.

We might still phase the rollout, validate usability or test implementation choices, but some requirements are non-negotiable.

I also think experiments need a clear decision attached to them. We should know what success looks like, how long we'll measure it and what we'd do differently based on the result.

Otherwise, it's easy to run experiments that produce interesting dashboards but don't actually influence the roadmap.

---

### 8. How do you ensure financial data shown to customers — or AI tools — is accurate enough to act on?

<a id="simplii-from-eb393097-3860-4697-a24d-dd0a0cbaaf1d-how-do-you"></a>

- **Import key:** `simplii-from-eb393097-3860-4697-a24d-dd0a0cbaaf1d`
- **Library ID:** `ff6be849-49b9-4ae0-87f1-cef4e6667b6b`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd define freshness, source of truth and fallback copy for pending versus posted amounts. Product surfaces should not present inferred balances as settled money. For AI-assisted insights, I'd require labelled uncertainty, link back to source transactions, and block automated actions when reconciliation is incomplete. Human review paths and kill switches matter for incidents. Accuracy is a cross-functional requirement among core banking, payments ops, risk and product — not a front-end polish item.

---

### 9. How do you know a customer really switched their paycheque?

<a id="simplii-from-6f890192-85ca-45f7-8259-f92001b996cf-how-do-you"></a>

- **Import key:** `simplii-from-6f890192-85ca-45f7-8259-f92001b996cf`
- **Library ID:** `c57cae8d-99b9-4721-8bb9-fa2a4481e929`
- **Experience:** Simplii — Direct Deposit
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I wouldn't use a button click or a customer saying 'I've switched' as the success event. I'd work with the banking and data teams to define a qualifying recurring deposit using reliable transaction attributes, source information, amount patterns and cadence, while accepting that classification won't be perfect. I'd distinguish first observed payroll from sustained payroll over at least two or three pay cycles. We'd also need rules to avoid counting self-transfers as salary, along with a path to correct misclassification. The final definition should be rigorous enough for business reporting and transparent enough that customers aren't surprised by eligibility decisions.

**Embedded follow-ups (4):**

- **Q:** Payroll recognition

I wouldn't use a button click or a customer saying 'I've switched' as the success event. I'd work with the banking and data teams to define a qualifying recurring deposit using reliable transaction attributes, source information, amount patterns and cadence, while accepting that classification won't be perfect. I'd distinguish first observed payroll from sustained payroll over at least two or three pay cycles. We'd also need rules to avoid counting self-transfers as salary, along with a path to correct misclassification. The final definition should be rigorous enough for business reporting and transparent enough that customers aren't surprised by eligibility decisions.

- **Q:** Verify salary

I wouldn't use a button click or a customer saying 'I've switched' as the success event. I'd work with the banking and data teams to define a qualifying recurring deposit using reliable transaction attributes, source information, amount patterns and cadence, while accepting that classification won't be perfect. I'd distinguish first observed payroll from sustained payroll over at least two or three pay cycles. We'd also need rules to avoid counting self-transfers as salary, along with a path to correct misclassification. The final definition should be rigorous enough for business reporting and transparent enough that customers aren't surprised by eligibility decisions.

- **Q:** Qualifying direct deposit

I wouldn't use a button click or a customer saying 'I've switched' as the success event. I'd work with the banking and data teams to define a qualifying recurring deposit using reliable transaction attributes, source information, amount patterns and cadence, while accepting that classification won't be perfect. I'd distinguish first observed payroll from sustained payroll over at least two or three pay cycles. We'd also need rules to avoid counting self-transfers as salary, along with a path to correct misclassification. The final definition should be rigorous enough for business reporting and transparent enough that customers aren't surprised by eligibility decisions.

- **Q:** Recurring deposit classification

I wouldn't use a button click or a customer saying 'I've switched' as the success event. I'd work with the banking and data teams to define a qualifying recurring deposit using reliable transaction attributes, source information, amount patterns and cadence, while accepting that classification won't be perfect. I'd distinguish first observed payroll from sustained payroll over at least two or three pay cycles. We'd also need rules to avoid counting self-transfers as salary, along with a path to correct misclassification. The final definition should be rigorous enough for business reporting and transparent enough that customers aren't surprised by eligibility decisions.

---

### 10. How do you know an increase in DAU isn't just more balance checking?

<a id="simplii-from-f7e403b2-26b8-4da4-83c1-ea58c2e3371b-how-do-you"></a>

- **Import key:** `simplii-from-f7e403b2-26b8-4da4-83c1-ea58c2e3371b`
- **Library ID:** `1b939a88-5f06-456d-9e60-297685854201`
- **Experience:** Product Metrics & Economics
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd classify activity by user intent. Balance views, market content, deposits, payments, purchases and servicing are different behaviours. Then I'd look at whether increases in app engagement precede or correlate with sustained banking activity. A customer checking their balance can be a sign of useful engagement, but it isn't proof of a deeper financial relationship. I'd report the engagement metric alongside transaction and deposit outcomes by cohort. If the extra DAU comes mainly from non-transactional visits, I wouldn't count it as success against a primary-banking objective."
C. Payments, technical architecture, reliability and controls

**Embedded follow-ups (4):**

- **Q:** Vanity metrics

I'd classify activity by user intent. Balance views, market content, deposits, payments, purchases and servicing are different behaviours. Then I'd look at whether increases in app engagement precede or correlate with sustained banking activity. A customer checking their balance can be a sign of useful engagement, but it isn't proof of a deeper financial relationship. I'd report the engagement metric alongside transaction and deposit outcomes by cohort. If the extra DAU comes mainly from non-transactional visits, I wouldn't count it as success against a primary-banking objective."
C. Payments, technical architecture, reliability and controls

- **Q:** DAU quality

I'd classify activity by user intent. Balance views, market content, deposits, payments, purchases and servicing are different behaviours. Then I'd look at whether increases in app engagement precede or correlate with sustained banking activity. A customer checking their balance can be a sign of useful engagement, but it isn't proof of a deeper financial relationship. I'd report the engagement metric alongside transaction and deposit outcomes by cohort. If the extra DAU comes mainly from non-transactional visits, I wouldn't count it as success against a primary-banking objective."
C. Payments, technical architecture, reliability and controls

- **Q:** Financial engagement

I'd classify activity by user intent. Balance views, market content, deposits, payments, purchases and servicing are different behaviours. Then I'd look at whether increases in app engagement precede or correlate with sustained banking activity. A customer checking their balance can be a sign of useful engagement, but it isn't proof of a deeper financial relationship. I'd report the engagement metric alongside transaction and deposit outcomes by cohort. If the extra DAU comes mainly from non-transactional visits, I wouldn't count it as success against a primary-banking objective."
C. Payments, technical architecture, reliability and controls

- **Q:** High DAU low deposits

I'd classify activity by user intent. Balance views, market content, deposits, payments, purchases and servicing are different behaviours. Then I'd look at whether increases in app engagement precede or correlate with sustained banking activity. A customer checking their balance can be a sign of useful engagement, but it isn't proof of a deeper financial relationship. I'd report the engagement metric alongside transaction and deposit outcomes by cohort. If the extra DAU comes mainly from non-transactional visits, I wouldn't count it as success against a primary-banking objective."
C. Payments, technical architecture, reliability and controls

---

### 11. How do you prevent cohort analysis from becoming a misleading before-and-after story?

<a id="simplii-from-629392bb-f39b-414e-b66d-0d879a9c4557-how-do-you"></a>

- **Import key:** `simplii-from-629392bb-f39b-414e-b66d-0d879a9c4557`
- **Library ID:** `82434972-97ef-4d86-9c4c-7a7ec44d32fb`
- **Experience:** Product Metrics & Economics
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd check whether the cohorts were comparable before attributing the change to our initiative. Different acquisition channels, customer tenure, holiday periods or promotions can all change spending behaviour. Where possible I'd use randomized holdouts. If we can't, I'd look for a reasonable matched or difference-in-differences approach, and I'd explain the remaining uncertainty rather than presenting the lift as causal. I'd also measure per eligible customer, not just per active user, because an intervention can change who counts as active. Good analysis should help us make a decision and also show where the evidence is weaker.

**Embedded follow-ups (4):**

- **Q:** Seasonality

I'd check whether the cohorts were comparable before attributing the change to our initiative. Different acquisition channels, customer tenure, holiday periods or promotions can all change spending behaviour. Where possible I'd use randomized holdouts. If we can't, I'd look for a reasonable matched or difference-in-differences approach, and I'd explain the remaining uncertainty rather than presenting the lift as causal. I'd also measure per eligible customer, not just per active user, because an intervention can change who counts as active. Good analysis should help us make a decision and also show where the evidence is weaker.

- **Q:** Cohort bias

I'd check whether the cohorts were comparable before attributing the change to our initiative. Different acquisition channels, customer tenure, holiday periods or promotions can all change spending behaviour. Where possible I'd use randomized holdouts. If we can't, I'd look for a reasonable matched or difference-in-differences approach, and I'd explain the remaining uncertainty rather than presenting the lift as causal. I'd also measure per eligible customer, not just per active user, because an intervention can change who counts as active. Good analysis should help us make a decision and also show where the evidence is weaker.

- **Q:** Attribution

I'd check whether the cohorts were comparable before attributing the change to our initiative. Different acquisition channels, customer tenure, holiday periods or promotions can all change spending behaviour. Where possible I'd use randomized holdouts. If we can't, I'd look for a reasonable matched or difference-in-differences approach, and I'd explain the remaining uncertainty rather than presenting the lift as causal. I'd also measure per eligible customer, not just per active user, because an intervention can change who counts as active. Good analysis should help us make a decision and also show where the evidence is weaker.

- **Q:** Comparable groups

I'd check whether the cohorts were comparable before attributing the change to our initiative. Different acquisition channels, customer tenure, holiday periods or promotions can all change spending behaviour. Where possible I'd use randomized holdouts. If we can't, I'd look for a reasonable matched or difference-in-differences approach, and I'd explain the remaining uncertainty rather than presenting the lift as causal. I'd also measure per eligible customer, not just per active user, because an intervention can change who counts as active. Good analysis should help us make a decision and also show where the evidence is weaker.

---

### 12. How do you reduce fraud without rejecting too many legitimate banking customers?

<a id="simplii-from-2c8d4c01-fde5-45f2-83a5-4567c8b9ea00-how-do-you"></a>

- **Import key:** `simplii-from-2c8d4c01-fde5-45f2-83a5-4567c8b9ea00`
- **Library ID:** `9ea8ab0b-fb63-458a-9a44-2455958f6bf8`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd separate confirmed fraud loss from friction and false positives. A risk control has to prevent harm, but broad rules can disproportionately hurt good customers.

I'd ask Risk for the underlying threat model and test whether controls can be targeted by risk signals rather than applied identically to everyone. Where appropriate, we could use additional verification for higher-risk cases while keeping lower-risk journeys simpler.

I'd monitor prevented loss, verified fraud, false-positive rate, completion rate and customer support burden together. I wouldn't optimize conversion by simply removing critical controls. The goal is a better overall risk-adjusted experience, not choosing Risk or Growth as the winner.

---

### 13. How should a customer dispute an unfamiliar debit card transaction?

<a id="simplii-from-0360f445-9e66-472e-932f-e06050ec3a3e-how-should"></a>

- **Import key:** `simplii-from-0360f445-9e66-472e-932f-e06050ec3a3e`
- **Library ID:** `4fa0172e-bdb1-4977-9e6e-8f6bd7eed8f6`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd want the customer to be able to identify the transaction, see the relevant details and reach the correct dispute path without guessing whether it is an authorization hold or a settled purchase.

If the card may be compromised, immediate protective controls such as card locking and appropriate support escalation matter. The investigation and provisional-credit process must follow the relevant product and network requirements, so I'd work with card operations and Risk rather than inventing an instant-refund promise.

I'd measure dispute initiation success, customer time to resolution and repeat contacts while protecting the accuracy of the underlying financial record.

---

### 14. How would you attract customers to Simplii without relying mainly on cash sign-up bonuses?

<a id="simplii-from-855c7ca3-5897-4baa-8c59-99f3c30cdd6e-how-would-"></a>

- **Import key:** `simplii-from-855c7ca3-5897-4baa-8c59-99f3c30cdd6e`
- **Library ID:** `cfd38bff-2159-4c8c-b631-c89e2938e0d2`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I wouldn't assume every acquisition problem needs a larger incentive. I'd look at where people already see value in the proposition and then test whether the friction is awareness, trust, onboarding effort or the experience after approval.

For example, a clear account-switching journey or a more dependable way to manage recurring payments might create value that lasts after a promotion ends. I'd compare incremental funded and active customers, retained balances where appropriate, incentive expense and support cost.

A bonus can be a useful tool, but the product has to give customers a reason to stay once they've received it.

---

### 15. How would you choose between building a payment service and buying one?

<a id="simplii-from-009d20a6-a8cf-458a-a7ea-9ef696c693e0-how-would-"></a>

- **Import key:** `simplii-from-009d20a6-a8cf-458a-a7ea-9ef696c693e0`
- **Library ID:** `d88a71c9-34bf-41fb-8b2f-22789de10c16`
- **Experience:** Payments & Controls
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd start by identifying which part creates differentiation and which part is foundational infrastructure. Payments have complex operational, security and regulatory requirements, so rebuilding a mature capability needs a compelling reason. I'd compare time to market, total cost, flexibility, reliability, integration effort, contractual constraints and exit risk. I'd also look at who owns reconciliation, incidents and customer support when things go wrong. The cheapest vendor quote isn't necessarily the lowest-cost option over time. My experience at Arc'teryx reinforced that the important decision isn't build versus buy in the abstract. It's what we want to own strategically and what dependency we're willing to accept."
D. Resume deep dives and skeptical follow-ups

**Embedded follow-ups (4):**

- **Q:** Build versus buy payments

I'd start by identifying which part creates differentiation and which part is foundational infrastructure. Payments have complex operational, security and regulatory requirements, so rebuilding a mature capability needs a compelling reason. I'd compare time to market, total cost, flexibility, reliability, integration effort, contractual constraints and exit risk. I'd also look at who owns reconciliation, incidents and customer support when things go wrong. The cheapest vendor quote isn't necessarily the lowest-cost option over time. My experience at Arc'teryx reinforced that the important decision isn't build versus buy in the abstract. It's what we want to own strategically and what dependency we're willing to accept."
D. Resume deep dives and skeptical follow-ups

- **Q:** Vendor or in-house

I'd start by identifying which part creates differentiation and which part is foundational infrastructure. Payments have complex operational, security and regulatory requirements, so rebuilding a mature capability needs a compelling reason. I'd compare time to market, total cost, flexibility, reliability, integration effort, contractual constraints and exit risk. I'd also look at who owns reconciliation, incidents and customer support when things go wrong. The cheapest vendor quote isn't necessarily the lowest-cost option over time. My experience at Arc'teryx reinforced that the important decision isn't build versus buy in the abstract. It's what we want to own strategically and what dependency we're willing to accept."
D. Resume deep dives and skeptical follow-ups

- **Q:** Technical strategy

I'd start by identifying which part creates differentiation and which part is foundational infrastructure. Payments have complex operational, security and regulatory requirements, so rebuilding a mature capability needs a compelling reason. I'd compare time to market, total cost, flexibility, reliability, integration effort, contractual constraints and exit risk. I'd also look at who owns reconciliation, incidents and customer support when things go wrong. The cheapest vendor quote isn't necessarily the lowest-cost option over time. My experience at Arc'teryx reinforced that the important decision isn't build versus buy in the abstract. It's what we want to own strategically and what dependency we're willing to accept."
D. Resume deep dives and skeptical follow-ups

- **Q:** Third-party processor

I'd start by identifying which part creates differentiation and which part is foundational infrastructure. Payments have complex operational, security and regulatory requirements, so rebuilding a mature capability needs a compelling reason. I'd compare time to market, total cost, flexibility, reliability, integration effort, contractual constraints and exit risk. I'd also look at who owns reconciliation, incidents and customer support when things go wrong. The cheapest vendor quote isn't necessarily the lowest-cost option over time. My experience at Arc'teryx reinforced that the important decision isn't build versus buy in the abstract. It's what we want to own strategically and what dependency we're willing to accept."
D. Resume deep dives and skeptical follow-ups

---

### 16. How would you decide between better rates and better switching UX?

<a id="simplii-from-648015c7-c77e-4d15-87c7-b0c2c688beb0-how-would-"></a>

- **Import key:** `simplii-from-648015c7-c77e-4d15-87c7-b0c2c688beb0`
- **Library ID:** `11788d86-8709-4c42-bea7-fae65765c7f4`
- **Experience:** Simplii — Primary Account
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd treat them as different levers. A compelling rate can give customers a reason to consider us, while a good switching experience determines whether they can act on that motivation. I'd look at customer research and funnel data to understand the actual constraint. If people don't know why they'd switch, a smoother form won't be enough. If there's strong intent but a high drop-off during payroll setup, UX could be the better investment. I'd also evaluate the economics of a higher rate with Treasury and Finance rather than assuming a more generous offer is free growth. Ideally the value proposition is strong enough to attract the right customers and the experience is simple enough to retain them.

**Embedded follow-ups (4):**

- **Q:** Rate versus experience

I'd treat them as different levers. A compelling rate can give customers a reason to consider us, while a good switching experience determines whether they can act on that motivation. I'd look at customer research and funnel data to understand the actual constraint. If people don't know why they'd switch, a smoother form won't be enough. If there's strong intent but a high drop-off during payroll setup, UX could be the better investment. I'd also evaluate the economics of a higher rate with Treasury and Finance rather than assuming a more generous offer is free growth. Ideally the value proposition is strong enough to attract the right customers and the experience is simple enough to retain them.

- **Q:** Savings APY

I'd treat them as different levers. A compelling rate can give customers a reason to consider us, while a good switching experience determines whether they can act on that motivation. I'd look at customer research and funnel data to understand the actual constraint. If people don't know why they'd switch, a smoother form won't be enough. If there's strong intent but a high drop-off during payroll setup, UX could be the better investment. I'd also evaluate the economics of a higher rate with Treasury and Finance rather than assuming a more generous offer is free growth. Ideally the value proposition is strong enough to attract the right customers and the experience is simple enough to retain them.

- **Q:** Financial incentive versus product

I'd treat them as different levers. A compelling rate can give customers a reason to consider us, while a good switching experience determines whether they can act on that motivation. I'd look at customer research and funnel data to understand the actual constraint. If people don't know why they'd switch, a smoother form won't be enough. If there's strong intent but a high drop-off during payroll setup, UX could be the better investment. I'd also evaluate the economics of a higher rate with Treasury and Finance rather than assuming a more generous offer is free growth. Ideally the value proposition is strong enough to attract the right customers and the experience is simple enough to retain them.

- **Q:** Product positioning

I'd treat them as different levers. A compelling rate can give customers a reason to consider us, while a good switching experience determines whether they can act on that motivation. I'd look at customer research and funnel data to understand the actual constraint. If people don't know why they'd switch, a smoother form won't be enough. If there's strong intent but a high drop-off during payroll setup, UX could be the better investment. I'd also evaluate the economics of a higher rate with Treasury and Finance rather than assuming a more generous offer is free growth. Ideally the value proposition is strong enough to attract the right customers and the experience is simple enough to retain them.

---

### 17. How would you decide if a 5% incremental spending lift justified an incentive?

<a id="simplii-from-35d5ff6e-5890-41c9-a4f2-2d48476b7d3d-how-would-"></a>

- **Import key:** `simplii-from-35d5ff6e-5890-41c9-a4f2-2d48476b7d3d`
- **Library ID:** `47a7ef8b-07e2-4547-9b78-56b8c27039cb`
- **Experience:** Product Metrics & Economics
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd first establish whether the 5% is truly incremental relative to comparable customers, and over what period. Then I'd translate that incremental spending into the actual economics attributable to the card programme, rather than assuming five cents of profit for every dollar of spend. I'd subtract incentive, communications and operational costs, and assess whether there are lasting effects on retention or purchase frequency. I'd also look at who benefited. If the result came mainly from customers who already spent heavily, we might be subsidizing behaviour. I'd want a decision framed around incremental contribution and the durability of the behaviour, not headline transaction volume.

**Embedded follow-ups (4):**

- **Q:** Incentive ROI

I'd first establish whether the 5% is truly incremental relative to comparable customers, and over what period. Then I'd translate that incremental spending into the actual economics attributable to the card programme, rather than assuming five cents of profit for every dollar of spend. I'd subtract incentive, communications and operational costs, and assess whether there are lasting effects on retention or purchase frequency. I'd also look at who benefited. If the result came mainly from customers who already spent heavily, we might be subsidizing behaviour. I'd want a decision framed around incremental contribution and the durability of the behaviour, not headline transaction volume.

- **Q:** Incrementality

I'd first establish whether the 5% is truly incremental relative to comparable customers, and over what period. Then I'd translate that incremental spending into the actual economics attributable to the card programme, rather than assuming five cents of profit for every dollar of spend. I'd subtract incentive, communications and operational costs, and assess whether there are lasting effects on retention or purchase frequency. I'd also look at who benefited. If the result came mainly from customers who already spent heavily, we might be subsidizing behaviour. I'd want a decision framed around incremental contribution and the durability of the behaviour, not headline transaction volume.

- **Q:** Profitability

I'd first establish whether the 5% is truly incremental relative to comparable customers, and over what period. Then I'd translate that incremental spending into the actual economics attributable to the card programme, rather than assuming five cents of profit for every dollar of spend. I'd subtract incentive, communications and operational costs, and assess whether there are lasting effects on retention or purchase frequency. I'd also look at who benefited. If the result came mainly from customers who already spent heavily, we might be subsidizing behaviour. I'd want a decision framed around incremental contribution and the durability of the behaviour, not headline transaction volume.

- **Q:** 5% spend lift

I'd first establish whether the 5% is truly incremental relative to comparable customers, and over what period. Then I'd translate that incremental spending into the actual economics attributable to the card programme, rather than assuming five cents of profit for every dollar of spend. I'd subtract incentive, communications and operational costs, and assess whether there are lasting effects on retention or purchase frequency. I'd also look at who benefited. If the result came mainly from customers who already spent heavily, we might be subsidizing behaviour. I'd want a decision framed around incremental contribution and the durability of the behaviour, not headline transaction volume.

---

### 18. How would you define a business case for fixing a common banking-service issue?

<a id="simplii-jd-012-how-would-you-define-a-business-case-for-fixi"></a>

- **Import key:** `simplii-jd-012`
- **Library ID:** `3cae19ae-9bdd-4805-a722-12cf9bfafe39`
- **Experience:** Product leadership and digital banking
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd start with the actual customer harm, such as people not knowing whether a transfer succeeded and calling support or trying again. Then I'd quantify the frequency, severity, segments affected and current operational cost.

I'd compare options: better status messaging, a deeper payment-system change, or a process fix. Each has different investment, risk and expected benefit. I would define what can be measured, such as fewer repeat attempts, lower contact rates, faster resolution and fewer payment exceptions.

I wouldn't reduce a trust issue to a support-cost line item. I'd show the commercial case, but also make clear where reliability or compliance creates a threshold we shouldn't trade away.

---

### 19. How would you define a customer's share of everyday banking activity at Simplii?

<a id="simplii-from-a60003e2-1f39-431f-8386-531fc24d711c-how-would-"></a>

- **Import key:** `simplii-from-a60003e2-1f39-431f-8386-531fc24d711c`
- **Library ID:** `fca8d188-b975-4a27-91e4-8dfb989a07c5`
- **Experience:** Financial Hub / an account-insights dashboard
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd treat share of wallet as an estimate rather than pretend we know all the customer's activity at other banks.

Within Simplii, I could observe direct deposits, bill payments, purchase activity, balances and recurring transfers. I could build an internal proxy for depth of relationship, but I'd label it as such. To understand actual share across institutions, I'd need customer-permissioned external data or carefully designed research, and I'd be explicit about selection bias.

I'd use that proxy for cohort trends rather than asserting that someone with one paycheque deposit has moved all their banking.

**Embedded follow-ups (4):**

- **Q:** Share of wallet

It's an attractive concept but difficult to measure precisely, because we usually don't see every transaction and balance a customer holds elsewhere. I'd distinguish observable measures from estimates. Observable measures might include recurring inflows, transaction activity, retained deposits and product adoption inside Simplii. If customers permissionfully connect external accounts, we might be able to form a richer view, but only within the limitations of that data and with suitable consent. I wouldn't present an estimated share-of-wallet number as a fact. For operating decisions, I'd probably favour clear behaviours that indicate relationship depth and can be tracked consistently over time.

- **Q:** Financial relationship depth

It's an attractive concept but difficult to measure precisely, because we usually don't see every transaction and balance a customer holds elsewhere. I'd distinguish observable measures from estimates. Observable measures might include recurring inflows, transaction activity, retained deposits and product adoption inside Simplii. If customers permissionfully connect external accounts, we might be able to form a richer view, but only within the limitations of that data and with suitable consent. I wouldn't present an estimated share-of-wallet number as a fact. For operating decisions, I'd probably favour clear behaviours that indicate relationship depth and can be tracked consistently over time.

- **Q:** Primary account measurement

It's an attractive concept but difficult to measure precisely, because we usually don't see every transaction and balance a customer holds elsewhere. I'd distinguish observable measures from estimates. Observable measures might include recurring inflows, transaction activity, retained deposits and product adoption inside Simplii. If customers permissionfully connect external accounts, we might be able to form a richer view, but only within the limitations of that data and with suitable consent. I wouldn't present an estimated share-of-wallet number as a fact. For operating decisions, I'd probably favour clear behaviours that indicate relationship depth and can be tracked consistently over time.

- **Q:** Deposit share

It's an attractive concept but difficult to measure precisely, because we usually don't see every transaction and balance a customer holds elsewhere. I'd distinguish observable measures from estimates. Observable measures might include recurring inflows, transaction activity, retained deposits and product adoption inside Simplii. If customers permissionfully connect external accounts, we might be able to form a richer view, but only within the limitations of that data and with suitable consent. I wouldn't present an estimated share-of-wallet number as a fact. For operating decisions, I'd probably favour clear behaviours that indicate relationship depth and can be tracked consistently over time.

---

### 20. How would you deliver customer-facing features when another team owns the core banking ledger?

<a id="simplii-from-a8fe6bd5-ecc2-4c0f-95d5-63bb51f0c20c-how-would-"></a>

- **Import key:** `simplii-from-a8fe6bd5-ecc2-4c0f-95d5-63bb51f0c20c`
- **Library ID:** `50892393-4fb9-49b5-a96d-a1353b714f09`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd start by drawing a very clear line between the system of record and the customer experience. The product squad might own how customers initiate transfers, see transaction statuses or manage notifications, but it shouldn't invent its own source of truth for balances or settlement.

I'd work with platform and operations partners to understand the APIs, event timing, consistency model, idempotency rules, reconciliation controls and failure states. Then I'd translate those into end-to-end customer journeys and acceptance criteria, including delayed responses and reversals, not only the happy path.

I'd favor an incremental launch with observability, feature flags for experience changes and a tested rollback plan. That's a general integration approach; I wouldn't assume Simplii uses any particular core-banking vendor or architecture without learning it from the team.

---

### 21. How would you design a new payee or recipient verification experience?

<a id="simplii-from-4445d2e9-0632-4f42-b1a8-6a60adc01012-how-would-"></a>

- **Import key:** `simplii-from-4445d2e9-0632-4f42-b1a8-6a60adc01012`
- **Library ID:** `c78af088-eaa0-4520-8f6a-710eacaa7c81`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd start with the harm we're trying to prevent: customers sending money to the wrong destination or fraudsters changing payout details. Verification should be proportional to the action and the risk.

I'd want clear recipient information, appropriate authentication or step-up checks for sensitive changes, and a final review before execution. We should not rely on an attractive confirmation screen if the underlying authorization is weak.

I'd work with Risk and engineering to make sure the rules are enforced server-side. Then I'd measure both sides: prevented errors and fraud, but also abandonment, false positives and support contacts. A control that blocks legitimate customers unnecessarily still has a product cost.

---

### 22. How would you design a safe payroll-switching experience when the employer's first deposit could fail?

<a id="simplii-from-e896f79a-bee7-4d99-a673-d337bb38cd38-how-would-"></a>

- **Import key:** `simplii-from-e896f79a-bee7-4d99-a673-d337bb38cd38`
- **Library ID:** `6182dd01-bae3-4080-b721-fcde8f54dbea`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I wouldn't treat switching payroll as a single click. It's a process with an employer dependency and potentially serious consequences if it goes wrong.

I'd give customers clear instructions or supported switching assistance, explain that an employer may need time to update details, and avoid implying the switch is complete before we have evidence. I'd encourage a transitional period where customers can verify the first successful deposit before relying entirely on the new account for bills.

Internally, I'd define how we recognize successful recurring income and what support should do when a deposit is missing. The goal is to reduce switching friction without giving customers false certainty about their next payday.

---

### 23. How would you design recurring bill payments or pre-authorized debits in a digital bank?

<a id="simplii-from-10c8d63e-14a4-474f-be0c-7a6f5b731600-how-would-"></a>

- **Import key:** `simplii-from-10c8d63e-14a4-474f-be0c-7a6f5b731600`
- **Library ID:** `b94d086e-0aad-4fdf-9814-a27785d9228b`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd start with the customer jobs and the things that can go wrong. People want to set something up once, know it's going to happen and understand what to do if there isn't enough money or the payee information changes.

I'd map creation, confirmation, editing, cancellation, retries, holds and posting delays with payments and operations partners. The stories need exact acceptance criteria around effective dates, cut-offs, customer notifications and what happens when an instruction fails.

For an MVP I'd prioritize correct execution and clear status over clever automation. I'd measure successful scheduled payments, avoidable failures, support contacts and repeat adoption, while ensuring the actual banking rails and biller responsibilities are represented accurately.

---

### 24. How would you estimate the value of a customer who keeps $5,000 in deposits but never uses the debit card?

<a id="simplii-from-23e0a9f7-0f29-4a82-9f42-e673eb6c0bd4-how-would-"></a>

- **Import key:** `simplii-from-23e0a9f7-0f29-4a82-9f42-e673eb6c0bd4`
- **Library ID:** `4d5280c9-7ee9-47a4-afca-53e515237833`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd start with the actual economics of those deposits, not assume the $5,000 balance is revenue. Finance and Treasury would help estimate what the bank earns from deploying or funding against that balance, net of interest paid, liquidity cost and servicing expenses.

I'd then consider balance stability and how long the relationship lasts. A steady operating balance can be more valuable than a promotional balance that disappears after a few weeks.

I'd separate that from debit-card revenue and cross-product benefits, since the customer doesn't generate those just by holding cash. The result would be a contribution estimate with sensitivity to deposit duration and rate assumptions.

---

### 25. How would you experiment on payment reliability if you can't ethically expose customers to worse payments?

<a id="simplii-from-cca30fb0-f7be-497e-8e20-2cd349712829-how-would-"></a>

- **Import key:** `simplii-from-cca30fb0-f7be-497e-8e20-2cd349712829`
- **Library ID:** `bfc6d49c-1fd8-47d3-9e93-50b42c7449d8`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd never deliberately degrade real payment reliability just to create a control group. We can test improvements without putting one group at unacceptable risk.

Before rollout, I'd use simulation, sandbox scenarios, replayed test cases and controlled operational verification to establish safety. Then I might gradually expose customers to a validated change while monitoring completion, duplicate handling, latency and reconciliation exceptions.

If a change is essential for safety or regulatory compliance, it may not need a standard randomized experiment. The product decision becomes whether the system meets agreed acceptance criteria and whether the staged rollout exposes new failure modes. Experimentation should support judgment, not override customer protection.

---

### 26. How would you explain a deposit hold to a customer who needs the money tomorrow?

<a id="simplii-from-b36da9fd-c09c-4202-bc35-aaf2d27afad3-how-would-"></a>

- **Import key:** `simplii-from-b36da9fd-c09c-4202-bc35-aaf2d27afad3`
- **Library ID:** `2d4b98f9-6128-4828-8f43-e301543877c5`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd be explicit about the distinction between money received, money posted and money available to use. Customers shouldn't have to discover a hold only when a payment is declined.

The experience should show what amount is currently available, what's on hold, the known release timing or conditions where available, and what support can and cannot change. I'd avoid promising that a hold will clear early unless the underlying system supports it.

I'd also examine whether we can communicate the hold before the customer initiates the deposit. The outcome to track is fewer surprise shortfalls and support contacts, alongside compliance with the actual funds-availability policy.

---

### 27. How would you explain Simplii's value against other Canadian banking options?

<a id="simplii-from-c4343691-6421-47c9-9c1e-8c88f948e0b6-how-would-"></a>

- **Import key:** `simplii-from-c4343691-6421-47c9-9c1e-8c88f948e0b6`
- **Library ID:** `36ec0e14-39fb-4e04-992e-f03f1279d010`
- **Experience:** Simplii — Primary Account
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I wouldn't pitch a vague claim that we're better at everything. I'd start with what the customer is trying to do.

Simplii offers a digital-first banking model, including a no-monthly-fee chequing account, access to CIBC ATMs and ways to handle everyday payments and transfers. Those are real customer propositions, but we'd still need to understand how customers weigh them against their current setup.

In a product role, I'd turn that into a sharper question: for which segments do those benefits solve a meaningful problem, and where does onboarding or ongoing usage still create friction? Then I'd validate through research and behaviour, rather than declare a winner in a brand comparison.

---

### 28. How would you handle a growing number of complaints about missing or delayed transfers?

<a id="simplii-jd-018-how-would-you-handle-a-growing-number-of-comp"></a>

- **Import key:** `simplii-jd-018`
- **Library ID:** `bfd92f8a-d6c2-425c-935a-97ba884ddc9a`
- **Experience:** Product leadership and digital banking
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd treat that as a potential customer-harm incident, not a backlog enhancement. First I'd partner with payments and operations to understand whether money is actually delayed or whether the interface has stale status—and how many customers are exposed. Until we know what happened to a request, we shouldn't tell people to send it again.



I'd make sure the response includes an accurate customer message and a way for support to locate the transaction. If an active change is causing the issue, we'd assess whether it should be rolled back or disabled while the incident team restores service. Then we'd reconcile affected payments, review the root cause and put monitoring around whatever failed, whether that's the integration, operational process or customer-facing status.



I'd want the retrospective to answer both questions: did every dollar reach a known outcome, and did customers have a credible path to resolution?

**Embedded follow-ups (1):**

- **Q:** RBC — After a timeout, how do you prevent duplicates and establish payment statu

The first rule is that a timeout is not a declined payment. It means the customer-facing service didn't receive a conclusive response. The instruction may still be processing, and treating that as a failure can create a second payout.

So before launch, I'd want the withdrawal requirement to cover an uncertain outcome explicitly. When the request is initiated, the journey needs a stable reference that can be traced end to end. If we lose the response, we show the customer that the withdrawal is being checked rather than encouraging a new submission.

On the service side, I'd work with the payments owners to confirm how duplicate protection and authoritative status are actually supported. Ideally a retry against the same business request can't move money twice, and there is a reliable way to reconcile the original instruction to its final outcome.

My job is to insist that the contract, customer states, support path and acceptance criteria address that failure mode. The enterprise team decides how the mechanism is implemented, because I don't own their payment architecture.

---

### 29. How would you handle a major payment incident?

<a id="simplii-from-2f00fac1-89ff-470f-992d-cd89980a36a9-how-would-"></a>

- **Import key:** `simplii-from-2f00fac1-89ff-470f-992d-cd89980a36a9`
- **Library ID:** `a348edf2-b51a-4b88-acbd-bb390a0bbff2`
- **Experience:** Payments & Controls
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

My first priority would be protecting customers and understanding the scope of the issue.

I'd want to know which transactions are affected, whether money is at risk, whether balances are accurate, and whether the issue is ongoing.

I'd work with Engineering, Operations and the relevant payment partners to establish containment and a reliable picture of the incident.

If there's uncertainty about transaction completion, I'd be particularly careful about how we communicate status to customers. We don't want to tell someone a payment failed if it may actually have succeeded.

Once the immediate issue is controlled, I'd focus on remediation, reconciliation and clear customer communication.

Afterward, I'd want a proper root-cause review, including whether we had the right monitoring, alerting and operational processes in place.

The important thing is not just getting the service back online. It's restoring confidence and reducing the likelihood of the same issue happening again.

---

### 30. How would you handle payment exceptions and straight-through processing as transaction volume grows?

<a id="simplii-from-4068ab67-0613-40ae-bb08-f810651d27a0-how-would-"></a>

- **Import key:** `simplii-from-4068ab67-0613-40ae-bb08-f810651d27a0`
- **Library ID:** `9b5924a2-ecc0-4f8c-b294-6d035ddb34fb`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd focus on making the normal payment journey as automated and predictable as possible, while making exceptions easy to identify and resolve.

As volume grows, you can't have operations teams manually investigating every delayed transaction. So I'd start by understanding the types of exceptions we're seeing.

Some might be temporary network or partner failures. Others could be rejected account details, returns, reconciliation differences or transactions that need a Risk review.

Those shouldn't all follow the same recovery process.

I'd work with engineering and operations to define which issues can be retried safely, which need manual intervention and which should never be retried automatically because we might accidentally move money twice.

I'd also make sure every transaction has a traceable reference and enough information for Support and Finance to understand what happened.

The metrics I'd care about are straight-through processing rate, exception rate by reason, time to resolution, reconciliation breaks and customer impact.

I'd prioritize the highest-volume, repeatable exceptions for automation. But I wouldn't try to automate unusual or potentially high-risk situations just to improve a processing metric.

The goal is fewer manual interventions without creating new financial or operational risk.

**Embedded follow-ups (1):**

- **Q:** How do you improve straight-through processing and exception resolution?

I'd focus on making the normal payment journey as automated and predictable as possible, while making exceptions easy to identify and resolve.

As volume grows, you can't have operations teams manually investigating every delayed transaction. So I'd start by understanding the types of exceptions we're seeing.

Some might be temporary network or partner failures. Others could be rejected account details, returns, reconciliation differences or transactions that need a Risk review.

Those shouldn't all follow the same recovery process.

I'd work with engineering and operations to define which issues can be retried safely, which need manual intervention and which should never be retried automatically because we might accidentally move money twice.

I'd also make sure every transaction has a traceable reference and enough information for Support and Finance to understand what happened.

The metrics I'd care about are straight-through processing rate, exception rate by reason, time to resolution, reconciliation breaks and customer impact.

I'd prioritize the highest-volume, repeatable exceptions for automation. But I wouldn't try to automate unusual or potentially high-risk situations just to improve a processing metric.

The goal is fewer manual interventions without creating new financial or operational risk.

---

### 31. How would you help a Simplii customer make their chequing account part of their everyday financial routine?

<a id="simplii-from-6844c2e7-03c5-434e-b64c-ca9febec68dd-how-would-"></a>

- **Import key:** `simplii-from-6844c2e7-03c5-434e-b64c-ca9febec68dd`
- **Library ID:** `3125f221-40a0-4a60-8c5c-c49ceb2cf581`
- **Experience:** Simplii — Primary Account
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd avoid assuming every customer wants to switch their primary bank. I'd first look at the journey: people who open an account but never fund it, people who fund it once, and people who start receiving paycheques or making recurring payments. Those are quite different problems.

I'd pair the funnel data with customer conversations to understand where confidence breaks down. Maybe setting up direct deposit feels like too much work. Maybe they're worried about a bill being missed during a switch. Or perhaps their existing bank is working well enough and they haven't seen a reason to change.

I'd pick a specific segment and test one improvement, such as clearer direct-deposit setup, a checklist for recurring payments, or better visibility into the first successful deposit. I'd measure completion and, more importantly, the next two or three pay cycles: do income and payments keep flowing through the account?

I'd also watch support contacts and failed-payment issues. A switching feature that increases payroll adoption but leaves people uncertain about their money isn't a win. The goal is sustained, trusted usage, not another opened account.

---

### 32. How would you improve a Simplii account-opening funnel with high abandonment?

<a id="simplii-jd-008-how-would-you-improve-a-simplii-account-openi"></a>

- **Import key:** `simplii-jd-008`
- **Library ID:** `a95417c7-cabd-4f25-a25f-8960396f9026`
- **Experience:** Product leadership and digital banking
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd map the journey from intent to a verified, usable account and look for the biggest friction points by device, source and customer segment. I'd be careful to separate customer abandonment from applications stopped for legitimate risk or eligibility reasons.

Then I'd pair the data with usability sessions and support reasons. If people struggle with identity verification, missing documentation or unclear status, I'd validate that before proposing a shorter form. A shorter flow isn't automatically a safer or better flow.

I'd test the highest-confidence improvement, measure completion and time to usable account, and watch fraud, verification errors and post-opening support as guardrails. I'd also look beyond approval to first funding. Otherwise we might optimize a form without improving the actual customer relationship.

**Embedded follow-ups (1):**

- **Q:** Would you remove identity verification if it hurt conversion?

No. I would work with Risk on what can legitimately be simplified, clarified or deferred, and test allowed recovery paths. Conversion cannot be improved by bypassing mandatory controls.

---

### 33. How would you increase direct deposit adoption?

<a id="simplii-from-06e233ae-5d45-42d3-b560-84baf56a8948-how-would-"></a>

- **Import key:** `simplii-from-06e233ae-5d45-42d3-b560-84baf56a8948`
- **Library ID:** `7b52a3a5-1fdb-4283-8bf2-cbc874df4fa8`
- **Experience:** Simplii — Direct Deposit
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd start by understanding where the friction is, because there are several reasons someone might not move their paycheque.

They might not know how to update payroll information. They may worry about missing a paycheque during the transition. Some may already have automatic bill payments coming out of another account, so switching payroll feels like the start of a much bigger migration.

I'd look at the data first. How many customers are eligible to receive direct deposits? How many begin the setup process? How many complete it? And how many actually receive recurring payroll deposits afterward?

I'd combine that with customer interviews, because a low conversion rate doesn't necessarily tell us why people are hesitating.

My first hypothesis would be to reduce the effort and uncertainty of switching. That could mean clearer payroll instructions, prefilled forms where possible, employer-specific guidance, and a checklist that helps users understand what needs to happen next.

I'd probably test that before introducing expensive incentives.

For measurement, I'd care about the percentage of eligible customers who receive a qualifying payroll deposit within 30 or 60 days, but I'd also look at whether the deposits continue over subsequent pay cycles.

If customers switch once to collect an incentive and then leave, we haven't really won their primary banking relationship.

I'd also monitor funding errors, support contacts and complaints, because trust is especially important during payroll migration.

---

### 34. How would you introduce AI-assisted account insights while preserving consent, accuracy and user control?

<a id="simplii-from-d616c1d2-a2f7-49f4-a246-47feeacdf169-how-would-"></a>

- **Import key:** `simplii-from-d616c1d2-a2f7-49f4-a246-47feeacdf169`
- **Library ID:** `dd143a3d-e0e3-4336-8e8a-c00f859b981b`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd start with a fairly constrained use case rather than asking AI to become someone's financial adviser on day one.

For example, helping a customer understand where their money went last month, identify recurring expenses or explain why their available balance differs from what they expected.

Those are useful problems, and we can ground the answers in actual account data.

I'd want a clear separation between the information retrieved from our systems and the explanation the AI generates. Balances, posted transactions and payment status should come from authoritative sources, not something the model estimates.

I'd also make consent explicit. Customers should understand which information is being accessed, for what purpose and whether it's being shared with an external provider.

Then I'd measure answer accuracy, task completion, customer trust and how often someone needs to correct or challenge the result.

I'd keep money movement out of the first release. Once we have evidence that the read-only experience is reliable, we could explore preparing actions for customer approval.

I like the potential of AI in banking, but I think you earn the right to introduce more autonomy by first proving the simpler experiences are dependable.

**Embedded follow-ups (1):**

- **Q:** How would you safely ship AI account insights?

I'd start with a fairly constrained use case rather than asking AI to become someone's financial adviser on day one.

For example, helping a customer understand where their money went last month, identify recurring expenses or explain why their available balance differs from what they expected.

Those are useful problems, and we can ground the answers in actual account data.

I'd want a clear separation between the information retrieved from our systems and the explanation the AI generates. Balances, posted transactions and payment status should come from authoritative sources, not something the model estimates.

I'd also make consent explicit. Customers should understand which information is being accessed, for what purpose and whether it's being shared with an external provider.

Then I'd measure answer accuracy, task completion, customer trust and how often someone needs to correct or challenge the result.

I'd keep money movement out of the first release. Once we have evidence that the read-only experience is reliable, we could explore preparing actions for customer approval.

I like the potential of AI in banking, but I think you earn the right to introduce more autonomy by first proving the simpler experiences are dependable.

---

### 35. How would you prioritize AI features against core banking reliability?

<a id="simplii-from-14239bac-e0fc-4f29-abfe-3c7a4386539b-how-would-"></a>

- **Import key:** `simplii-from-14239bac-e0fc-4f29-abfe-3c7a4386539b`
- **Library ID:** `48e2762a-1c12-4952-803b-24a1425a514a`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd evaluate them against the same customer and business outcomes rather than assuming AI deserves its own protected roadmap.

If we have a core payment reliability issue that's affecting customers' ability to access their money, that takes priority over launching an AI feature.

But I wouldn't automatically deprioritize all AI work either. Sometimes AI might be the most practical way to solve an existing operational or customer problem.

For example, if Support is spending a lot of time manually classifying payment exceptions, an internal AI-assisted triage tool might improve resolution times without touching financial transaction execution.

I'd compare that investment against other ways to solve the problem, including simpler automation and process changes.

The decision would depend on customer impact, expected benefit, implementation cost, risk and how quickly we can validate the result.

I think AI should compete for investment on the value it creates, not on how interesting the technology is.

In banking, trust and reliability are prerequisites. The best AI features should strengthen those fundamentals, not distract from them.

**Embedded follow-ups (1):**

- **Q:** Would you prioritize AI over banking reliability?

I'd evaluate them against the same customer and business outcomes rather than assuming AI deserves its own protected roadmap.

If we have a core payment reliability issue that's affecting customers' ability to access their money, that takes priority over launching an AI feature.

But I wouldn't automatically deprioritize all AI work either. Sometimes AI might be the most practical way to solve an existing operational or customer problem.

For example, if Support is spending a lot of time manually classifying payment exceptions, an internal AI-assisted triage tool might improve resolution times without touching financial transaction execution.

I'd compare that investment against other ways to solve the problem, including simpler automation and process changes.

The decision would depend on customer impact, expected benefit, implementation cost, risk and how quickly we can validate the result.

I think AI should compete for investment on the value it creates, not on how interesting the technology is.

In banking, trust and reliability are prerequisites. The best AI features should strengthen those fundamentals, not distract from them.

---

### 36. How would you prioritize banking reliability against a differentiated customer feature?

<a id="simplii-from-d6e02f71-bdb1-4dbc-b373-4c7958d83e04-how-would-"></a>

- **Import key:** `simplii-from-d6e02f71-bdb1-4dbc-b373-4c7958d83e04`
- **Library ID:** `0d55d164-6f1e-499f-97be-a0511f630d31`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I would make the reliability baseline explicit. If money movement, balances or access are falling below an acceptable standard, restoring confidence is not optional work that a shiny feature can displace.

When the service is healthy, it becomes an opportunity-cost decision. I'd estimate the customer problem, value, reach, delivery cost and operational risk for the differentiated feature. I'd also consider whether a reliability investment reduces incidents or support demand in ways that don't show up in a growth dashboard.

My recommendation would include the tradeoff and what we are deliberately not doing. I don't like a roadmap where everything is 'important' and nobody can say what success looks like.

**Embedded follow-ups (1):**

- **Q:** How do you balance reliability and innovation in a new bank?

I'd start with a pretty simple principle: customers need a reason to try a new bank, but they need to trust it before they'll make it their primary bank.

So I wouldn't frame reliability and differentiation as completely separate priorities. You need enough of both, but I'd be very deliberate about sequencing.

I'd define a small set of journeys that absolutely have to work: opening an account, funding it, receiving income, making payments, understanding available balances and getting help when something goes wrong.

Those would have very clear reliability and operational requirements before we start scaling adoption.

At the same time, I'd want one compelling reason for an existing Simplii customer to use the account. Maybe that's a genuinely useful connection between everyday cash and investments, rather than launching another generic budgeting dashboard.

I'd make the trade-offs based on risk and customer value. If a core payment journey has unresolved issues, I'm not putting a cosmetic feature ahead of it. But if the basics are meeting our guardrails, I'd absolutely invest in something that makes Simplii meaningfully different.

I'd measure both sides: payment success, exceptions and support contacts alongside activation, recurring transactions and retained deposits.

The goal isn't to build the most features. It's to give customers a reason to switch and the confidence to stay.

---

### 37. How would you protect customers from malicious or unauthorized AI-agent actions?

<a id="simplii-from-1429b53c-f5fd-4819-bb3b-c116ce1ed889-how-would-"></a>

- **Import key:** `simplii-from-1429b53c-f5fd-4819-bb3b-c116ce1ed889`
- **Library ID:** `6e7ffea2-3429-49fa-9156-ac1d2c25463b`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd approach it as a permissions and system-design problem, not something we solve just by telling the AI to behave.

The model might be useful, but it shouldn't be the authority deciding which accounts it can access or what transactions it can execute.

I'd want the financial platform enforcing authentication, account-level authorization and the specific permissions the customer has granted.

I'd also consider attacks where untrusted information contains instructions meant to manipulate the agent. For example, a transaction description or retrieved document might include text that tells the agent to reveal information or perform an unrelated action.

That content needs to remain data, not become an instruction with authority over the workflow.

For consequential actions, I'd use narrow capabilities, strong server-side validation and explicit customer approval.

I'd also make access easy to review and revoke, and keep an audit trail of what the agent requested and what the system actually did.

The principle is that AI can propose actions, but the trusted financial infrastructure determines what's authorized and what actually happens.

**Embedded follow-ups (1):**

- **Q:** How would you prevent prompt injection and unauthorized transfers?

I'd approach it as a permissions and system-design problem, not something we solve just by telling the AI to behave.

The model might be useful, but it shouldn't be the authority deciding which accounts it can access or what transactions it can execute.

I'd want the financial platform enforcing authentication, account-level authorization and the specific permissions the customer has granted.

I'd also consider attacks where untrusted information contains instructions meant to manipulate the agent. For example, a transaction description or retrieved document might include text that tells the agent to reveal information or perform an unrelated action.

That content needs to remain data, not become an instruction with authority over the workflow.

For consequential actions, I'd use narrow capabilities, strong server-side validation and explicit customer approval.

I'd also make access easy to review and revoke, and keep an audit trail of what the agent requested and what the system actually did.

The principle is that AI can propose actions, but the trusted financial infrastructure determines what's authorized and what actually happens.

---

### 38. How would you roll out a critical payments integration?

<a id="simplii-from-038f6014-b892-4a64-84d6-e09048b9fea2-how-would-"></a>

- **Import key:** `simplii-from-038f6014-b892-4a64-84d6-e09048b9fea2`
- **Library ID:** `3288b547-da47-4a68-b913-128a109fc5b7`
- **Experience:** Payments & Controls
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd plan the rollout around risk, not just engineering completion. We need end-to-end test cases for success and failure states, reconciliation sign-off, monitoring, support playbooks, rollback or disablement options where feasible, and agreed incident ownership. I'd normally favour a limited launch with controlled eligibility or volume before expanding. During that period, I'd monitor completion, errors, latency, exceptions and customer contact rates closely with Operations and Engineering. If the signals deteriorate, we'd pause expansion rather than defending the planned date. Getting a critical financial feature to market matters, but not at the expense of trust.

**Embedded follow-ups (4):**

- **Q:** Phased launch

I'd plan the rollout around risk, not just engineering completion. We need end-to-end test cases for success and failure states, reconciliation sign-off, monitoring, support playbooks, rollback or disablement options where feasible, and agreed incident ownership. I'd normally favour a limited launch with controlled eligibility or volume before expanding. During that period, I'd monitor completion, errors, latency, exceptions and customer contact rates closely with Operations and Engineering. If the signals deteriorate, we'd pause expansion rather than defending the planned date. Getting a critical financial feature to market matters, but not at the expense of trust.

- **Q:** Payment feature rollout

I'd plan the rollout around risk, not just engineering completion. We need end-to-end test cases for success and failure states, reconciliation sign-off, monitoring, support playbooks, rollback or disablement options where feasible, and agreed incident ownership. I'd normally favour a limited launch with controlled eligibility or volume before expanding. During that period, I'd monitor completion, errors, latency, exceptions and customer contact rates closely with Operations and Engineering. If the signals deteriorate, we'd pause expansion rather than defending the planned date. Getting a critical financial feature to market matters, but not at the expense of trust.

- **Q:** Release safeguards

I'd plan the rollout around risk, not just engineering completion. We need end-to-end test cases for success and failure states, reconciliation sign-off, monitoring, support playbooks, rollback or disablement options where feasible, and agreed incident ownership. I'd normally favour a limited launch with controlled eligibility or volume before expanding. During that period, I'd monitor completion, errors, latency, exceptions and customer contact rates closely with Operations and Engineering. If the signals deteriorate, we'd pause expansion rather than defending the planned date. Getting a critical financial feature to market matters, but not at the expense of trust.

- **Q:** Integration readiness

I'd plan the rollout around risk, not just engineering completion. We need end-to-end test cases for success and failure states, reconciliation sign-off, monitoring, support playbooks, rollback or disablement options where feasible, and agreed incident ownership. I'd normally favour a limited launch with controlled eligibility or volume before expanding. During that period, I'd monitor completion, errors, latency, exceptions and customer contact rates closely with Operations and Engineering. If the signals deteriorate, we'd pause expansion rather than defending the planned date. Getting a critical financial feature to market matters, but not at the expense of trust.

---

### 39. How would you select an experiment's primary metric and guardrails?

<a id="simplii-from-6441c9f1-738a-4bd4-b819-92ddf2c1de5b-how-would-"></a>

- **Import key:** `simplii-from-6441c9f1-738a-4bd4-b819-92ddf2c1de5b`
- **Library ID:** `429194ec-2d66-49a5-8f71-471d00c7cc00`
- **Experience:** Product Metrics & Economics
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd start from the customer behaviour the experiment is meant to change and choose one primary metric that directly reflects it. For payroll switching, that might be receipt of a qualifying recurring deposit within a fixed window, rather than visits to the payroll setup page. I'd establish guardrails for payment failures, complaints, support contacts and incentive costs. Before starting, I'd agree on the population, assignment method, expected duration and what result would change the roadmap. Without that, teams can end up selecting whichever metric looks best afterward. I also wouldn't experiment with the correctness of core financial controls.

**Embedded follow-ups (4):**

- **Q:** Experiment design

I'd start from the customer behaviour the experiment is meant to change and choose one primary metric that directly reflects it. For payroll switching, that might be receipt of a qualifying recurring deposit within a fixed window, rather than visits to the payroll setup page. I'd establish guardrails for payment failures, complaints, support contacts and incentive costs. Before starting, I'd agree on the population, assignment method, expected duration and what result would change the roadmap. Without that, teams can end up selecting whichever metric looks best afterward. I also wouldn't experiment with the correctness of core financial controls.

- **Q:** Primary KPI

I'd start from the customer behaviour the experiment is meant to change and choose one primary metric that directly reflects it. For payroll switching, that might be receipt of a qualifying recurring deposit within a fixed window, rather than visits to the payroll setup page. I'd establish guardrails for payment failures, complaints, support contacts and incentive costs. Before starting, I'd agree on the population, assignment method, expected duration and what result would change the roadmap. Without that, teams can end up selecting whichever metric looks best afterward. I also wouldn't experiment with the correctness of core financial controls.

- **Q:** Guardrail

I'd start from the customer behaviour the experiment is meant to change and choose one primary metric that directly reflects it. For payroll switching, that might be receipt of a qualifying recurring deposit within a fixed window, rather than visits to the payroll setup page. I'd establish guardrails for payment failures, complaints, support contacts and incentive costs. Before starting, I'd agree on the population, assignment method, expected duration and what result would change the roadmap. Without that, teams can end up selecting whichever metric looks best afterward. I also wouldn't experiment with the correctness of core financial controls.

- **Q:** A/B testing plan

I'd start from the customer behaviour the experiment is meant to change and choose one primary metric that directly reflects it. For payroll switching, that might be receipt of a qualifying recurring deposit within a fixed window, rather than visits to the payroll setup page. I'd establish guardrails for payment failures, complaints, support contacts and incentive costs. Before starting, I'd agree on the population, assignment method, expected duration and what result would change the roadmap. Without that, teams can end up selecting whichever metric looks best afterward. I also wouldn't experiment with the correctness of core financial controls.

---

### 40. How would you tell healthy banking engagement from anxiety-driven repeat checking?

<a id="simplii-from-cb792784-57f0-449a-a12d-76bbbde35b46-how-would-"></a>

- **Import key:** `simplii-from-cb792784-57f0-449a-a12d-76bbbde35b46`
- **Library ID:** `07f34233-3185-4715-8a4a-f19a81efee3e`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd look at the reason people are returning. More sessions can mean the product is valuable, but they can also mean customers are unsure whether a deposit arrived or a payment cleared.

I'd compare visits against successful customer jobs: completed payments, recurring funding, savings actions and resolution of outstanding questions. I'd also look at support contacts, complaints, repeated visits to the same unresolved transaction and qualitative feedback.

If DAU rises while money-movement completion and retention are flat, that's a diagnostic signal, not necessarily good news. The experience should reduce uncertainty and improve financial control, even if that means fewer frantic balance checks.

---

### 41. How would you tell whether better transaction insights actually help Simplii customers?

<a id="simplii-from-59024cc1-b1e1-4f5b-a146-1936c8c86037-how-would-"></a>

- **Import key:** `simplii-from-59024cc1-b1e1-4f5b-a146-1936c8c86037`
- **Library ID:** `6c236ffd-06b3-4daa-b911-ef9a5cebac30`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I wouldn't use visits to an insights screen as the success metric on its own. I'd first define the customer job: finding an unfamiliar transaction, anticipating a bill, understanding what money is genuinely available, or spotting a duplicate-looking charge.

Then I'd choose a measurable outcome for that job. That might be fewer failed bill payments, faster issue resolution, fewer support contacts about unclear transactions or better customer comprehension in usability research. I'd instrument the journey and compare cohorts or run a controlled test where appropriate.

The strongest signal would be that customers can make a decision or complete a task with more confidence, not that they looked at another chart.

---

### 42. How would you test an AI-powered financial feature before launching it broadly?

<a id="simplii-from-df23d3a1-181c-4c9b-9460-42d635d2352d-how-would-"></a>

- **Import key:** `simplii-from-df23d3a1-181c-4c9b-9460-42d635d2352d`
- **Library ID:** `ea745fd6-1702-472b-9112-49e0d9248b04`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I wouldn't start by measuring how impressive the answers sound.

I'd define a fairly narrow set of jobs the product is supposed to perform, then build a test set based on real scenarios and the kinds of mistakes that would actually matter.

For an account-insights feature, I'd include simple questions, but also harder cases: pending transactions, returned payments, duplicate merchant descriptions, unavailable data and ambiguous customer requests.

I'd want to measure factual accuracy, whether the system used the right source, when it declined to answer and how often it incorrectly gave a confident response.

I'd also separate harmless errors from high-impact ones. Misclassifying a coffee purchase is different from telling someone they have enough money to cover a payment when they don't.

I'd start with internal evaluation, move to a limited customer pilot and expand only when accuracy and operational guardrails are acceptable.

I'd monitor customer corrections, complaints and unexpected failure patterns after launch.

The key is to evaluate it as a financial product with real consequences, not simply as a chatbot that produces good-sounding responses.

**Embedded follow-ups (1):**

- **Q:** How do you evaluate financial AI before launch?

I wouldn't start by measuring how impressive the answers sound.

I'd define a fairly narrow set of jobs the product is supposed to perform, then build a test set based on real scenarios and the kinds of mistakes that would actually matter.

For an account-insights feature, I'd include simple questions, but also harder cases: pending transactions, returned payments, duplicate merchant descriptions, unavailable data and ambiguous customer requests.

I'd want to measure factual accuracy, whether the system used the right source, when it declined to answer and how often it incorrectly gave a confident response.

I'd also separate harmless errors from high-impact ones. Misclassifying a coffee purchase is different from telling someone they have enough money to cover a payment when they don't.

I'd start with internal evaluation, move to a limited customer pilot and expand only when accuracy and operational guardrails are acceptable.

I'd monitor customer corrections, complaints and unexpected failure patterns after launch.

The key is to evaluate it as a financial product with real consequences, not simply as a chatbot that produces good-sounding responses.

---

### 43. How would you use feature flags without creating inconsistent financial records?

<a id="simplii-from-6635b44b-bd82-4980-8aef-ea67474a075e-how-would-"></a>

- **Import key:** `simplii-from-6635b44b-bd82-4980-8aef-ea67474a075e`
- **Library ID:** `d42cd57e-2c80-4b1a-85cb-d18d5dc76048`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd use feature flags to control customer exposure and routing, not as an excuse to let two systems maintain contradictory financial truth.

For a new payment path, I'd plan a small rollout with clear eligibility, transaction correlation, observability and rollback conditions. Any in-flight instruction has to finish safely on the path it started; switching a flag shouldn't resubmit or lose it.

I'd rehearse failure cases such as timeouts and duplicate submissions before scaling. In the rollout review, I'd compare successful end-to-end completion, exceptions, support demand and reconciliation, not merely whether the front-end feature loads for users.

---

### 44. If a Simplii customer also maintains an account at another bank, is that a problem?

<a id="simplii-from-0d2ba56b-828d-4eeb-bbc4-b099d740e800-if-a-simpl"></a>

- **Import key:** `simplii-from-0d2ba56b-828d-4eeb-bbc4-b099d740e800`
- **Library ID:** `d75cfe5e-28af-465e-bf89-a1987c081922`
- **Experience:** Simplii — Primary Account
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

Not automatically. People keep more than one bank account for perfectly legitimate reasons, and forcing an all-or-nothing view would be a mistake.

I'd want to know which jobs they trust Simplii with. Maybe they use it for daily purchases, savings or transfers while keeping payroll somewhere else. That may still be a valuable, sustainable relationship.

I'd segment by intent and repeat behaviour. If our goal is primary banking, we'd measure income deposits, recurring bills and active usage. But I wouldn't label every secondary relationship a failure. The question is whether we are solving a meaningful customer problem and whether the economics work.

**Embedded follow-ups (5):**

- **Q:** Multi-banking

I wouldn't treat that as failure. Making a new bank your primary relationship is often a gradual change. Customers may start by sending part of their income, using the card for one spending category, or moving a recurring payment. I'd measure the depth and durability of that relationship and create sensible next steps rather than pressuring them to close their old account. At the same time, I'd avoid confusing partial adoption with a genuine primary relationship. We'd track milestones separately: funded, transacting, recurring deposit, recurring bill payments and sustained account activity. The strategy should make progressive adoption feel easy while being honest about where customers are in the journey.

- **Q:** Split payroll

I wouldn't treat that as failure. Making a new bank your primary relationship is often a gradual change. Customers may start by sending part of their income, using the card for one spending category, or moving a recurring payment. I'd measure the depth and durability of that relationship and create sensible next steps rather than pressuring them to close their old account. At the same time, I'd avoid confusing partial adoption with a genuine primary relationship. We'd track milestones separately: funded, transacting, recurring deposit, recurring bill payments and sustained account activity. The strategy should make progressive adoption feel easy while being honest about where customers are in the journey.

- **Q:** Secondary account

I wouldn't treat that as failure. Making a new bank your primary relationship is often a gradual change. Customers may start by sending part of their income, using the card for one spending category, or moving a recurring payment. I'd measure the depth and durability of that relationship and create sensible next steps rather than pressuring them to close their old account. At the same time, I'd avoid confusing partial adoption with a genuine primary relationship. We'd track milestones separately: funded, transacting, recurring deposit, recurring bill payments and sustained account activity. The strategy should make progressive adoption feel easy while being honest about where customers are in the journey.

- **Q:** Not all-or-nothing

I wouldn't treat that as failure. Making a new bank your primary relationship is often a gradual change. Customers may start by sending part of their income, using the card for one spending category, or moving a recurring payment. I'd measure the depth and durability of that relationship and create sensible next steps rather than pressuring them to close their old account. At the same time, I'd avoid confusing partial adoption with a genuine primary relationship. We'd track milestones separately: funded, transacting, recurring deposit, recurring bill payments and sustained account activity. The strategy should make progressive adoption feel easy while being honest about where customers are in the journey.

- **Q:** Partial switch

I wouldn't treat that as failure. Making a new bank your primary relationship is often a gradual change. Customers may start by sending part of their income, using the card for one spending category, or moving a recurring payment. I'd measure the depth and durability of that relationship and create sensible next steps rather than pressuring them to close their old account. At the same time, I'd avoid confusing partial adoption with a genuine primary relationship. We'd track milestones separately: funded, transacting, recurring deposit, recurring bill payments and sustained account activity. The strategy should make progressive adoption feel easy while being honest about where customers are in the journey.

---

### 45. If direct deposit conversion improved by 20%, how would you determine whether the experiment succeeded?

<a id="simplii-from-976c189b-f59f-409f-92ea-2648cc5b2f5a-if-direct-"></a>

- **Import key:** `simplii-from-976c189b-f59f-409f-92ea-2648cc5b2f5a`
- **Library ID:** `c20b1fbf-edbc-41dd-906d-5120baf01de6`
- **Experience:** Simplii — Direct Deposit
- **Tier:** P2
- **Evidence:** resume_supported

**Answer (spoken):**

First, I'd clarify what that 20% represents.

Is it a relative improvement in the number of customers setting up payroll, or a 20-percentage-point change in the adoption rate? Those are very different outcomes.

I'd also look at the denominator and whether the experiment groups were comparable.

Beyond the initial conversion, I'd want to see how many customers actually received payroll deposits and continued receiving them over subsequent pay cycles.

I'd check for negative effects too. Did failed deposits, customer support contacts or account closures increase?

And I'd consider whether the result was economically worthwhile, particularly if incentives were involved.

If we increased direct deposit adoption but customers stopped using the account after collecting a bonus, I wouldn't call that a complete success.

I'd want to see a sustained change in primary banking behaviour.

---

### 46. Is a $100 million increase in deposits automatically a win?

<a id="simplii-from-6bf73e61-9653-44ef-b0b3-03f854f27398-is-a-100-m"></a>

- **Import key:** `simplii-from-6bf73e61-9653-44ef-b0b3-03f854f27398`
- **Library ID:** `4dfd2405-e466-46c5-b554-57f98a2dc4bd`
- **Experience:** Simplii — Direct Deposit
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

Not automatically. Deposits can be valuable, but we need to understand their stability, what they cost to acquire and retain, and how the bank can use them within its funding and risk framework. I'd work with Treasury and Finance on the actual contribution economics, including interest expense, liquidity needs, servicing costs and any incentives. I'd also look at concentration and churn. A large inflow driven by a short-term rate promotion can be very different from stable recurring payroll deposits. I'd celebrate deposit growth when it builds a durable relationship and creates attractive risk-adjusted economics, not just because the balance is bigger.

**Embedded follow-ups (4):**

- **Q:** Deposit balances versus profit

Not automatically. Deposits can be valuable, but we need to understand their stability, what they cost to acquire and retain, and how the bank can use them within its funding and risk framework. I'd work with Treasury and Finance on the actual contribution economics, including interest expense, liquidity needs, servicing costs and any incentives. I'd also look at concentration and churn. A large inflow driven by a short-term rate promotion can be very different from stable recurring payroll deposits. I'd celebrate deposit growth when it builds a durable relationship and creates attractive risk-adjusted economics, not just because the balance is bigger.

- **Q:** Cost of funds

Not automatically. Deposits can be valuable, but we need to understand their stability, what they cost to acquire and retain, and how the bank can use them within its funding and risk framework. I'd work with Treasury and Finance on the actual contribution economics, including interest expense, liquidity needs, servicing costs and any incentives. I'd also look at concentration and churn. A large inflow driven by a short-term rate promotion can be very different from stable recurring payroll deposits. I'd celebrate deposit growth when it builds a durable relationship and creates attractive risk-adjusted economics, not just because the balance is bigger.

- **Q:** Treasury

Not automatically. Deposits can be valuable, but we need to understand their stability, what they cost to acquire and retain, and how the bank can use them within its funding and risk framework. I'd work with Treasury and Finance on the actual contribution economics, including interest expense, liquidity needs, servicing costs and any incentives. I'd also look at concentration and churn. A large inflow driven by a short-term rate promotion can be very different from stable recurring payroll deposits. I'd celebrate deposit growth when it builds a durable relationship and creates attractive risk-adjusted economics, not just because the balance is bigger.

- **Q:** Net interest margin

Not automatically. Deposits can be valuable, but we need to understand their stability, what they cost to acquire and retain, and how the bank can use them within its funding and risk framework. I'd work with Treasury and Finance on the actual contribution economics, including interest expense, liquidity needs, servicing costs and any incentives. I'd also look at concentration and churn. A large inflow driven by a short-term rate promotion can be very different from stable recurring payroll deposits. I'd celebrate deposit growth when it builds a durable relationship and creates attractive risk-adjusted economics, not just because the balance is bigger.

---

### 47. It's payday and hundreds of customers say their salary hasn't arrived. What do you do in the first 15 minutes?

<a id="simplii-from-2fb1eeab-7958-4099-9216-e2b88d0de5c5-it-s-payda"></a>

- **Import key:** `simplii-from-2fb1eeab-7958-4099-9216-e2b88d0de5c5`
- **Library ID:** `072c0aa7-772e-455e-a8c3-a8b28498e846`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

First I need to establish whether the money is delayed, rejected, posted but not visible, or missing upstream. Those require different responses, and I wouldn't let the app tell customers their payroll failed until we've confirmed it.

I'd convene the incident owners across Engineering, Operations, payments and the banking core, establish impact and an incident lead, and preserve accurate transaction tracing. If there's customer harm, we'd prioritize containment and communication rather than feature work.

I'd also ask Support for a consistent message that clearly distinguishes confirmed facts from what we're still investigating. The immediate goal is protecting customers and restoring a reliable picture of their funds, not racing to a premature root-cause explanation.

---

### 48. MAU is increasing, but transaction frequency and deposits are flat. How would you diagnose it?

<a id="simplii-from-b51df0d6-2cd1-41cb-b1f6-757f899b8bcc-mau-is-inc"></a>

- **Import key:** `simplii-from-b51df0d6-2cd1-41cb-b1f6-757f899b8bcc`
- **Library ID:** `3d26236d-ca1f-4f69-8a1a-d6a52321b604`
- **Experience:** Product Metrics & Economics
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

My initial reaction would be that we're attracting attention without necessarily increasing meaningful banking activity.

But I'd want to be careful because the top-line metrics could be hiding different customer behaviours.

I'd start by separating new customers from existing customers. If we've acquired a lot of new accounts recently, MAU could be increasing simply because people are checking out the product.

Then I'd look at the engagement funnel. Are customers only logging in to check balances, or are they attempting to fund accounts, make payments or use their cards?

I'd also segment customers who have direct deposits from those who don't, because their usage patterns are likely to be quite different.

If first funding is weak, the issue might be onboarding or transfer friction. If customers fund their accounts but don't transact, the card proposition or merchant acceptance experience might need attention. If activity starts strong and drops after 30 days, I'd focus on retention.

I'd also compare cohorts rather than relying entirely on averages, because a change in customer mix could explain the apparent disconnect.

The key is not to jump straight into building engagement features. I'd want to understand whether the issue is product awareness, funding friction, everyday utility or reliability before deciding what to change.

---

### 49. Walk me through how you would run discovery for an unfamiliar Simplii product area.

<a id="simplii-jd-001-walk-me-through-how-you-would-run-discovery-f"></a>

- **Import key:** `simplii-jd-001`
- **Library ID:** `fb61d81c-c27a-4b44-b86c-40184f1578cc`
- **Experience:** Product leadership and digital banking
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

My first question would be what decision we need discovery to help us make. If the team thinks onboarding is underperforming, for example, I'd want to know whether the problem is failed verification, legitimate abandonment, or accounts that open but never become active. Those lead to very different solutions.



I'd review the current journey, segment the data and compare it with complaints, service contacts and previous research. Then I'd use targeted customer or frontline conversations to test the explanation—not run research just to confirm the dashboard. I'd bring design, engineering and Risk in early so we understand where the constraints actually sit.



By the end of that first pass, I want to be able to say: this is the problem we believe is worth solving, this is the evidence, this is what we still don't know, and this is the smallest credible way to test it. Discovery is valuable when it changes a decision.

**Embedded follow-ups (1):**

- **Q:** What if you only have two weeks?

I would narrow the decision. Pick one journey, combine existing analytics with a small number of focused interviews and test the riskiest assumption with a lightweight prototype. I would name what remains uncertain rather than claim two weeks established the whole roadmap.

---

### 50. What controls would you require before allowing a new transfer type?

<a id="simplii-from-83d6cb34-59ce-42d0-88ca-dfb46a91bfae-what-contr"></a>

- **Import key:** `simplii-from-83d6cb34-59ce-42d0-88ca-dfb46a91bfae`
- **Library ID:** `e0ab1aca-b677-4e8d-a390-cb65261f416d`
- **Experience:** Simplii — Direct Deposit
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd start with eligibility, account ownership where relevant, authentication, transaction limits and fraud or AML requirements defined with the accountable teams. Then I'd want a clear payment state model, duplicate-request protection, reconciliation, auditability and well-defined exceptions. There also needs to be operational readiness: monitoring, customer support guidance, incident response and a process for resolving failures. I'd separate controls required by law or policy from choices where Product can optimize the customer experience. I wouldn't treat sign-off as something to collect the day before launch. I'd bring those teams into the design early enough that the requirements shape the actual product.

**Embedded follow-ups (4):**

- **Q:** Controls launch checklist

I'd start with eligibility, account ownership where relevant, authentication, transaction limits and fraud or AML requirements defined with the accountable teams. Then I'd want a clear payment state model, duplicate-request protection, reconciliation, auditability and well-defined exceptions. There also needs to be operational readiness: monitoring, customer support guidance, incident response and a process for resolving failures. I'd separate controls required by law or policy from choices where Product can optimize the customer experience. I wouldn't treat sign-off as something to collect the day before launch. I'd bring those teams into the design early enough that the requirements shape the actual product.

- **Q:** Transfer launch readiness

I'd start with eligibility, account ownership where relevant, authentication, transaction limits and fraud or AML requirements defined with the accountable teams. Then I'd want a clear payment state model, duplicate-request protection, reconciliation, auditability and well-defined exceptions. There also needs to be operational readiness: monitoring, customer support guidance, incident response and a process for resolving failures. I'd separate controls required by law or policy from choices where Product can optimize the customer experience. I wouldn't treat sign-off as something to collect the day before launch. I'd bring those teams into the design early enough that the requirements shape the actual product.

- **Q:** Risk and AML

I'd start with eligibility, account ownership where relevant, authentication, transaction limits and fraud or AML requirements defined with the accountable teams. Then I'd want a clear payment state model, duplicate-request protection, reconciliation, auditability and well-defined exceptions. There also needs to be operational readiness: monitoring, customer support guidance, incident response and a process for resolving failures. I'd separate controls required by law or policy from choices where Product can optimize the customer experience. I wouldn't treat sign-off as something to collect the day before launch. I'd bring those teams into the design early enough that the requirements shape the actual product.

- **Q:** Banking compliance

I'd start with eligibility, account ownership where relevant, authentication, transaction limits and fraud or AML requirements defined with the accountable teams. Then I'd want a clear payment state model, duplicate-request protection, reconciliation, auditability and well-defined exceptions. There also needs to be operational readiness: monitoring, customer support guidance, incident response and a process for resolving failures. I'd separate controls required by law or policy from choices where Product can optimize the customer experience. I wouldn't treat sign-off as something to collect the day before launch. I'd bring those teams into the design early enough that the requirements shape the actual product.

---

### 51. What early signal might tell you Simplii customers are losing trust?

<a id="simplii-from-1f935f03-d796-480c-8e77-2a3c26f156b2-what-early"></a>

- **Import key:** `simplii-from-1f935f03-d796-480c-8e77-2a3c26f156b2`
- **Library ID:** `9a79b326-9836-48b1-838a-2964c890d9f8`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd look for a combination of behavioural and operational signals: failed or delayed payments, rising status-related support contacts, repeat attempts after uncertain confirmations, and customers who stop using a recurring payment journey after an issue.

An account might still show activity while people are checking balances anxiously, so I'd avoid relying on login frequency. I'd also follow complaint severity and time to resolution.

The key is to connect an early warning to a concrete customer harm and a team that can act on it.

---

### 52. What happens if an AI agent gives the customer an incorrect account balance or invents a transaction?

<a id="simplii-from-3772aed5-2bdd-43f0-a114-3eb66342d397-what-happe"></a>

- **Import key:** `simplii-from-3772aed5-2bdd-43f0-a114-3eb66342d397`
- **Library ID:** `2997ad19-affb-42ba-920c-bbfd5691ea0c`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd want to distinguish between bad source data and the AI misrepresenting good source data, because the solutions are different.

If the underlying balance is incorrect, that's a banking data-integrity problem. If the balance returned by the system is correct but the model states a different number, that's an AI reliability problem.

For something as sensitive as a balance, I wouldn't want the model calculating or inventing the value.

I'd retrieve it from the authoritative system and, where possible, render the actual amount and timestamp through a controlled interface. AI can explain the context, but the financial value itself should remain grounded in the source.

I'd also handle unavailable or delayed data explicitly. If we can't confirm the current balance, the experience should say that rather than give a confident estimate.

I'd test common failure modes before launch, including stale information, conflicting transaction states and ambiguous account names.

And if a customer reports an incorrect answer, I'd want enough traceability to understand the source response, what the agent said and whether the issue could have affected other users.

**Embedded follow-ups (1):**

- **Q:** What if the AI hallucinates a bank transaction?

I'd want to distinguish between bad source data and the AI misrepresenting good source data, because the solutions are different.

If the underlying balance is incorrect, that's a banking data-integrity problem. If the balance returned by the system is correct but the model states a different number, that's an AI reliability problem.

For something as sensitive as a balance, I wouldn't want the model calculating or inventing the value.

I'd retrieve it from the authoritative system and, where possible, render the actual amount and timestamp through a controlled interface. AI can explain the context, but the financial value itself should remain grounded in the source.

I'd also handle unavailable or delayed data explicitly. If we can't confirm the current balance, the experience should say that rather than give a confident estimate.

I'd test common failure modes before launch, including stale information, conflicting transaction states and ambiguous account names.

And if a customer reports an incorrect answer, I'd want enough traceability to understand the source response, what the agent said and whether the issue could have affected other users.

---

### 53. What happens to your banking growth strategy when interest rates fall?

<a id="simplii-from-cfe370bc-2273-4055-b0e2-d1adbb96cbf1-what-happe"></a>

- **Import key:** `simplii-from-cfe370bc-2273-4055-b0e2-d1adbb96cbf1`
- **Library ID:** `d218002c-2477-420b-a7c3-e5b19eb8ea77`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd avoid building the entire value proposition around one temporarily attractive savings rate. A rate can help customers try the account, but it can also attract people who move their money as soon as someone else pays more.

I'd look at how sensitive each segment is to rates versus convenience, reliable payments, integrations and service. If rates fall, I'd update the economics with Treasury and examine whether customers continue to use the product for real everyday activity.

The longer-term opportunity is to become useful in a customer's routine, not win an endless bidding contest for promotional balances. I'd measure retained relationships and contribution through different rate environments.

---

### 54. What if an experiment looks positive after two days? Can we ship early?

<a id="simplii-from-f95b4bf7-5896-494b-810c-bb4d06393365-what-if-an"></a>

- **Import key:** `simplii-from-f95b4bf7-5896-494b-810c-bb4d06393365`
- **Library ID:** `f5809828-9544-46e3-b89e-957c7f799d71`
- **Experience:** Product Metrics & Economics
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd be cautious. Early results can be noisy, especially when banking behaviours follow weekly or payroll cycles. I'd look at the pre-agreed stopping rule, required sample size and whether there's enough time to observe the actual outcome. There are legitimate sequential-testing methods, but they need to be designed in advance rather than invented because the number looks good. I'd also check guardrails and segment performance. A strong early signal might justify preparing the rollout, but it wouldn't automatically justify declaring a win.

**Embedded follow-ups (4):**

- **Q:** Peeking

I'd be cautious. Early results can be noisy, especially when banking behaviours follow weekly or payroll cycles. I'd look at the pre-agreed stopping rule, required sample size and whether there's enough time to observe the actual outcome. There are legitimate sequential-testing methods, but they need to be designed in advance rather than invented because the number looks good. I'd also check guardrails and segment performance. A strong early signal might justify preparing the rollout, but it wouldn't automatically justify declaring a win.

- **Q:** Statistical significance

I'd be cautious. Early results can be noisy, especially when banking behaviours follow weekly or payroll cycles. I'd look at the pre-agreed stopping rule, required sample size and whether there's enough time to observe the actual outcome. There are legitimate sequential-testing methods, but they need to be designed in advance rather than invented because the number looks good. I'd also check guardrails and segment performance. A strong early signal might justify preparing the rollout, but it wouldn't automatically justify declaring a win.

- **Q:** Stopping rules

I'd be cautious. Early results can be noisy, especially when banking behaviours follow weekly or payroll cycles. I'd look at the pre-agreed stopping rule, required sample size and whether there's enough time to observe the actual outcome. There are legitimate sequential-testing methods, but they need to be designed in advance rather than invented because the number looks good. I'd also check guardrails and segment performance. A strong early signal might justify preparing the rollout, but it wouldn't automatically justify declaring a win.

- **Q:** Early launch

I'd be cautious. Early results can be noisy, especially when banking behaviours follow weekly or payroll cycles. I'd look at the pre-agreed stopping rule, required sample size and whether there's enough time to observe the actual outcome. There are legitimate sequential-testing methods, but they need to be designed in advance rather than invented because the number looks good. I'd also check guardrails and segment performance. A strong early signal might justify preparing the rollout, but it wouldn't automatically justify declaring a win.

---

### 55. What if employers aren't supported by an automated payroll switching provider?

<a id="simplii-from-d551219e-6540-4760-a132-b27c92c706db-what-if-em"></a>

- **Import key:** `simplii-from-d551219e-6540-4760-a132-b27c92c706db`
- **Library ID:** `f2714376-83a6-4147-a61b-dc502c6a2461`
- **Experience:** Simplii — Direct Deposit
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I wouldn't make employer integration a requirement for the whole experience. I'd support a clear manual path with the right account details, an employer-ready form where appropriate, and simple guidance for common payroll systems. I'd also be explicit that some changes are completed by the employer, not by us. Where automated switching is available, great, but the fallback needs to feel like a first-class flow rather than an error state. I'd measure adoption and failure rates separately for automated and manual paths, then use those data to decide which integrations are worth building. Broad coverage and trust matter more than an impressive demo that only works for a narrow set of employers.

**Embedded follow-ups (4):**

- **Q:** Payroll provider coverage

I wouldn't make employer integration a requirement for the whole experience. I'd support a clear manual path with the right account details, an employer-ready form where appropriate, and simple guidance for common payroll systems. I'd also be explicit that some changes are completed by the employer, not by us. Where automated switching is available, great, but the fallback needs to feel like a first-class flow rather than an error state. I'd measure adoption and failure rates separately for automated and manual paths, then use those data to decide which integrations are worth building. Broad coverage and trust matter more than an impressive demo that only works for a narrow set of employers.

- **Q:** Employer not integrated

I wouldn't make employer integration a requirement for the whole experience. I'd support a clear manual path with the right account details, an employer-ready form where appropriate, and simple guidance for common payroll systems. I'd also be explicit that some changes are completed by the employer, not by us. Where automated switching is available, great, but the fallback needs to feel like a first-class flow rather than an error state. I'd measure adoption and failure rates separately for automated and manual paths, then use those data to decide which integrations are worth building. Broad coverage and trust matter more than an impressive demo that only works for a narrow set of employers.

- **Q:** Manual switch

I wouldn't make employer integration a requirement for the whole experience. I'd support a clear manual path with the right account details, an employer-ready form where appropriate, and simple guidance for common payroll systems. I'd also be explicit that some changes are completed by the employer, not by us. Where automated switching is available, great, but the fallback needs to feel like a first-class flow rather than an error state. I'd measure adoption and failure rates separately for automated and manual paths, then use those data to decide which integrations are worth building. Broad coverage and trust matter more than an impressive demo that only works for a narrow set of employers.

- **Q:** Edge cases employer HR

I wouldn't make employer integration a requirement for the whole experience. I'd support a clear manual path with the right account details, an employer-ready form where appropriate, and simple guidance for common payroll systems. I'd also be explicit that some changes are completed by the employer, not by us. Where automated switching is available, great, but the fallback needs to feel like a first-class flow rather than an error state. I'd measure adoption and failure rates separately for automated and manual paths, then use those data to decide which integrations are worth building. Broad coverage and trust matter more than an impressive demo that only works for a narrow set of employers.

---

### 56. What if payroll bonuses bring in customers who leave immediately afterward?

<a id="simplii-from-73c5726c-d892-4f7b-895c-59a71c29080b-what-if-pa"></a>

- **Import key:** `simplii-from-73c5726c-d892-4f7b-895c-59a71c29080b`
- **Library ID:** `9e35549c-7c36-4196-ade3-09af90082b8c`
- **Experience:** Simplii — Direct Deposit
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd consider that an incentive design problem, not necessarily a marketing success. A spike in first deposits can look great while producing very little lasting value. I'd measure retained qualifying deposits across subsequent pay cycles, net balances, active transactions and the contribution after incentive costs. I'd compare incentivized customers to an appropriate control or baseline and look for signs of customers moving money out immediately. If the programme mainly attracts one-time switches, I'd adjust eligibility, reward timing or the underlying value proposition. The best incentive helps customers get over switching friction; it shouldn't be the only reason they remain.

**Embedded follow-ups (4):**

- **Q:** Incentive hunters

I'd consider that an incentive design problem, not necessarily a marketing success. A spike in first deposits can look great while producing very little lasting value. I'd measure retained qualifying deposits across subsequent pay cycles, net balances, active transactions and the contribution after incentive costs. I'd compare incentivized customers to an appropriate control or baseline and look for signs of customers moving money out immediately. If the programme mainly attracts one-time switches, I'd adjust eligibility, reward timing or the underlying value proposition. The best incentive helps customers get over switching friction; it shouldn't be the only reason they remain.

- **Q:** Bonus abuse

I'd consider that an incentive design problem, not necessarily a marketing success. A spike in first deposits can look great while producing very little lasting value. I'd measure retained qualifying deposits across subsequent pay cycles, net balances, active transactions and the contribution after incentive costs. I'd compare incentivized customers to an appropriate control or baseline and look for signs of customers moving money out immediately. If the programme mainly attracts one-time switches, I'd adjust eligibility, reward timing or the underlying value proposition. The best incentive helps customers get over switching friction; it shouldn't be the only reason they remain.

- **Q:** Promo churn

I'd consider that an incentive design problem, not necessarily a marketing success. A spike in first deposits can look great while producing very little lasting value. I'd measure retained qualifying deposits across subsequent pay cycles, net balances, active transactions and the contribution after incentive costs. I'd compare incentivized customers to an appropriate control or baseline and look for signs of customers moving money out immediately. If the programme mainly attracts one-time switches, I'd adjust eligibility, reward timing or the underlying value proposition. The best incentive helps customers get over switching friction; it shouldn't be the only reason they remain.

- **Q:** Deposit campaign ROI

I'd consider that an incentive design problem, not necessarily a marketing success. A spike in first deposits can look great while producing very little lasting value. I'd measure retained qualifying deposits across subsequent pay cycles, net balances, active transactions and the contribution after incentive costs. I'd compare incentivized customers to an appropriate control or baseline and look for signs of customers moving money out immediately. If the programme mainly attracts one-time switches, I'd adjust eligibility, reward timing or the underlying value proposition. The best incentive helps customers get over switching friction; it shouldn't be the only reason they remain.

---

### 57. What if someone sets up a direct deposit with Simplii once and then stops using the account?

<a id="simplii-from-c4eabdaa-ab91-4b85-8d46-cd2cacdf8d42-what-if-so"></a>

- **Import key:** `simplii-from-c4eabdaa-ab91-4b85-8d46-cd2cacdf8d42`
- **Library ID:** `f8d83e08-6dbd-465f-ac2a-e720c012d0aa`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I would not treat the first deposit as successful long-term adoption. First I'd confirm whether it was actually payroll or a one-off transfer, then look at whether subsequent expected pay cycles arrived.

I'd segment by the setup path, any introductory promotion and support contacts. Some customers may simply be testing the account; others may have run into an issue with bill payments, access or confidence. I'd use interviews to separate those explanations.

If a specific handoff is failing, fix it. If customers don't see continued value, that's a different proposition problem. Either way, an initial deposit is a milestone, not the outcome.

---

### 58. What if the ledger balance and customer-facing balance don't match?

<a id="simplii-from-0c8b1a1c-7290-4b60-8c88-8d978935beae-what-if-th"></a>

- **Import key:** `simplii-from-0c8b1a1c-7290-4b60-8c88-8d978935beae`
- **Library ID:** `f053d81c-c2a8-4652-877f-c02606c3466a`
- **Experience:** Payments & Controls
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd treat that as a high-priority integrity issue and first distinguish between a genuine ledger problem, a stale read model and a legitimate difference between ledger and available balance. I'd want Engineering and Operations to identify the authoritative records and affected accounts before making a customer-facing correction. If the issue could lead to customers spending funds they don't actually have, containment may be necessary. We should communicate carefully and avoid giving a precise resolution promise before we understand the issue. Then I'd focus on reconciliation, remediation and prevention. In a banking experience, customers must be able to trust the numbers they see.

**Embedded follow-ups (4):**

- **Q:** Balance mismatch

I'd treat that as a high-priority integrity issue and first distinguish between a genuine ledger problem, a stale read model and a legitimate difference between ledger and available balance. I'd want Engineering and Operations to identify the authoritative records and affected accounts before making a customer-facing correction. If the issue could lead to customers spending funds they don't actually have, containment may be necessary. We should communicate carefully and avoid giving a precise resolution promise before we understand the issue. Then I'd focus on reconciliation, remediation and prevention. In a banking experience, customers must be able to trust the numbers they see.

- **Q:** Ledger source of truth

I'd treat that as a high-priority integrity issue and first distinguish between a genuine ledger problem, a stale read model and a legitimate difference between ledger and available balance. I'd want Engineering and Operations to identify the authoritative records and affected accounts before making a customer-facing correction. If the issue could lead to customers spending funds they don't actually have, containment may be necessary. We should communicate carefully and avoid giving a precise resolution promise before we understand the issue. Then I'd focus on reconciliation, remediation and prevention. In a banking experience, customers must be able to trust the numbers they see.

- **Q:** Banking incident

I'd treat that as a high-priority integrity issue and first distinguish between a genuine ledger problem, a stale read model and a legitimate difference between ledger and available balance. I'd want Engineering and Operations to identify the authoritative records and affected accounts before making a customer-facing correction. If the issue could lead to customers spending funds they don't actually have, containment may be necessary. We should communicate carefully and avoid giving a precise resolution promise before we understand the issue. Then I'd focus on reconciliation, remediation and prevention. In a banking experience, customers must be able to trust the numbers they see.

- **Q:** Incorrect available balance

I'd treat that as a high-priority integrity issue and first distinguish between a genuine ledger problem, a stale read model and a legitimate difference between ledger and available balance. I'd want Engineering and Operations to identify the authoritative records and affected accounts before making a customer-facing correction. If the issue could lead to customers spending funds they don't actually have, containment may be necessary. We should communicate carefully and avoid giving a precise resolution promise before we understand the issue. Then I'd focus on reconciliation, remediation and prevention. In a banking experience, customers must be able to trust the numbers they see.

---

### 59. What if your PM peers own Cards and Money Movement, but your metric depends on both?

<a id="simplii-from-c4c44a09-0799-471a-97cb-05e06e8bf8a8-what-if-yo"></a>

- **Import key:** `simplii-from-c4c44a09-0799-471a-97cb-05e06e8bf8a8`
- **Library ID:** `7b1dc74c-6017-45b3-8222-7b597b5361bc`
- **Experience:** Product Metrics & Economics
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd make the joint outcome explicit and separate what each team owns. If my goal is primary-account adoption, I can't succeed by optimizing an onboarding screen while payments fail or card transactions are confusing. I'd work with those PMs on a shared metric tree, dependencies and commitments, while being clear about where each team's decision rights sit. If a trade-off affects multiple roadmaps, I'd bring options and expected impact to the appropriate leadership forum rather than letting it become a series of one-off escalations. Cross-product ownership only works when there are clear interfaces and everyone understands the common customer outcome.

**Embedded follow-ups (4):**

- **Q:** Shared ownership

I'd make the joint outcome explicit and separate what each team owns. If my goal is primary-account adoption, I can't succeed by optimizing an onboarding screen while payments fail or card transactions are confusing. I'd work with those PMs on a shared metric tree, dependencies and commitments, while being clear about where each team's decision rights sit. If a trade-off affects multiple roadmaps, I'd bring options and expected impact to the appropriate leadership forum rather than letting it become a series of one-off escalations. Cross-product ownership only works when there are clear interfaces and everyone understands the common customer outcome.

- **Q:** Cross-domain dependencies

I'd make the joint outcome explicit and separate what each team owns. If my goal is primary-account adoption, I can't succeed by optimizing an onboarding screen while payments fail or card transactions are confusing. I'd work with those PMs on a shared metric tree, dependencies and commitments, while being clear about where each team's decision rights sit. If a trade-off affects multiple roadmaps, I'd bring options and expected impact to the appropriate leadership forum rather than letting it become a series of one-off escalations. Cross-product ownership only works when there are clear interfaces and everyone understands the common customer outcome.

- **Q:** Competing roadmaps

I'd make the joint outcome explicit and separate what each team owns. If my goal is primary-account adoption, I can't succeed by optimizing an onboarding screen while payments fail or card transactions are confusing. I'd work with those PMs on a shared metric tree, dependencies and commitments, while being clear about where each team's decision rights sit. If a trade-off affects multiple roadmaps, I'd bring options and expected impact to the appropriate leadership forum rather than letting it become a series of one-off escalations. Cross-product ownership only works when there are clear interfaces and everyone understands the common customer outcome.

- **Q:** Banking operating model

I'd make the joint outcome explicit and separate what each team owns. If my goal is primary-account adoption, I can't succeed by optimizing an onboarding screen while payments fail or card transactions are confusing. I'd work with those PMs on a shared metric tree, dependencies and commitments, while being clear about where each team's decision rights sit. If a trade-off affects multiple roadmaps, I'd bring options and expected impact to the appropriate leadership forum rather than letting it become a series of one-off escalations. Cross-product ownership only works when there are clear interfaces and everyone understands the common customer outcome.

---

### 60. What is reconciliation, and why does a PM need to understand it?

<a id="simplii-from-21cb8214-854d-48a1-a86d-c1d8fd37bf89-what-is-re"></a>

- **Import key:** `simplii-from-21cb8214-854d-48a1-a86d-c1d8fd37bf89`
- **Library ID:** `1b0743e0-4b7e-40fa-898f-aca0169551cd`
- **Experience:** Payments & Controls
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

Reconciliation is how we confirm that the payments we believe we initiated and completed match the records from the relevant payment systems and the financial books. You need it to identify missing, duplicate, reversed or otherwise inconsistent transactions. As a PM, I don't need to run the daily ledger close myself, but I do need to understand what events and identifiers our product must generate, how exceptions are handled and what the customer sees when something isn't resolved. It's not purely a back-office issue. If reconciliation is weak, customers may see incorrect statuses or balances, and Operations may not have a reliable way to investigate.

**Embedded follow-ups (4):**

- **Q:** Reconciliation meaning

Reconciliation is how we confirm that the payments we believe we initiated and completed match the records from the relevant payment systems and the financial books. You need it to identify missing, duplicate, reversed or otherwise inconsistent transactions. As a PM, I don't need to run the daily ledger close myself, but I do need to understand what events and identifiers our product must generate, how exceptions are handled and what the customer sees when something isn't resolved. It's not purely a back-office issue. If reconciliation is weak, customers may see incorrect statuses or balances, and Operations may not have a reliable way to investigate.

- **Q:** Settlement mismatches

Reconciliation is how we confirm that the payments we believe we initiated and completed match the records from the relevant payment systems and the financial books. You need it to identify missing, duplicate, reversed or otherwise inconsistent transactions. As a PM, I don't need to run the daily ledger close myself, but I do need to understand what events and identifiers our product must generate, how exceptions are handled and what the customer sees when something isn't resolved. It's not purely a back-office issue. If reconciliation is weak, customers may see incorrect statuses or balances, and Operations may not have a reliable way to investigate.

- **Q:** Finance operations

Reconciliation is how we confirm that the payments we believe we initiated and completed match the records from the relevant payment systems and the financial books. You need it to identify missing, duplicate, reversed or otherwise inconsistent transactions. As a PM, I don't need to run the daily ledger close myself, but I do need to understand what events and identifiers our product must generate, how exceptions are handled and what the customer sees when something isn't resolved. It's not purely a back-office issue. If reconciliation is weak, customers may see incorrect statuses or balances, and Operations may not have a reliable way to investigate.

- **Q:** Reconcile payouts

Reconciliation is how we confirm that the payments we believe we initiated and completed match the records from the relevant payment systems and the financial books. You need it to identify missing, duplicate, reversed or otherwise inconsistent transactions. As a PM, I don't need to run the daily ledger close myself, but I do need to understand what events and identifiers our product must generate, how exceptions are handled and what the customer sees when something isn't resolved. It's not purely a back-office issue. If reconciliation is weak, customers may see incorrect statuses or balances, and Operations may not have a reliable way to investigate.

---

### 61. What is sample ratio mismatch, and why would you care in a banking A/B test?

<a id="simplii-from-4a20cf51-7a43-415b-b55d-d01104a46d6f-what-is-sa"></a>

- **Import key:** `simplii-from-4a20cf51-7a43-415b-b55d-d01104a46d6f`
- **Library ID:** `38f4f933-f7c3-463e-8f3e-e44213e3371f`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

Sample ratio mismatch means the observed split between experiment groups differs materially from the allocation we expected. That can indicate something went wrong with randomization, eligibility, exposure tracking or logging.

It's important because an apparent conversion lift may be unreliable if the underlying groups aren't comparable. In banking, issues can also arise if a risk rule or technical problem disproportionately prevents one group from reaching the measured step.

I'd check the assignment and exposure data before interpreting the outcome, then review segment balance and instrumentation with Analytics and Engineering. I wouldn't celebrate a lift until the experiment itself was trustworthy.

---

### 62. What is the biggest risk in connecting external accounts?

<a id="simplii-from-6a8c3993-05ae-456b-8750-2b6778b6ee6b-what-is-th"></a>

- **Import key:** `simplii-from-6a8c3993-05ae-456b-8750-2b6778b6ee6b`
- **Library ID:** `56714b9a-9086-41c5-a44e-0103343af8e8`
- **Experience:** Financial Hub / an account-insights dashboard
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

My biggest product concern would be trust in the data. If the customer sees a stale balance or a disconnected account and treats the view as current, we could unintentionally encourage a bad decision. I'd make data freshness, connection status and source clear, and design graceful failure states when an institution isn't available. I'd also want strong consent and clear language about what access is being granted. With read-only aggregation, I'd make sure the experience doesn't imply we can control or move money from those connected accounts. The UX should make the limits of the information obvious without turning every screen into legal language.

**Embedded follow-ups (6):**

- **Q:** Aggregation risks

My biggest product concern would be trust in the data. If the customer sees a stale balance or a disconnected account and treats the view as current, we could unintentionally encourage a bad decision. I'd make data freshness, connection status and source clear, and design graceful failure states when an institution isn't available. I'd also want strong consent and clear language about what access is being granted. With read-only aggregation, I'd make sure the experience doesn't imply we can control or move money from those connected accounts. The UX should make the limits of the information obvious without turning every screen into legal language.

- **Q:** Open banking risk

My biggest product concern would be trust in the data. If the customer sees a stale balance or a disconnected account and treats the view as current, we could unintentionally encourage a bad decision. I'd make data freshness, connection status and source clear, and design graceful failure states when an institution isn't available. I'd also want strong consent and clear language about what access is being granted. With read-only aggregation, I'd make sure the experience doesn't imply we can control or move money from those connected accounts. The UX should make the limits of the information obvious without turning every screen into legal language.

- **Q:** Flinks

My biggest product concern would be trust in the data. If the customer sees a stale balance or a disconnected account and treats the view as current, we could unintentionally encourage a bad decision. I'd make data freshness, connection status and source clear, and design graceful failure states when an institution isn't available. I'd also want strong consent and clear language about what access is being granted. With read-only aggregation, I'd make sure the experience doesn't imply we can control or move money from those connected accounts. The UX should make the limits of the information obvious without turning every screen into legal language.

- **Q:** Wealthica

My biggest product concern would be trust in the data. If the customer sees a stale balance or a disconnected account and treats the view as current, we could unintentionally encourage a bad decision. I'd make data freshness, connection status and source clear, and design graceful failure states when an institution isn't available. I'd also want strong consent and clear language about what access is being granted. With read-only aggregation, I'd make sure the experience doesn't imply we can control or move money from those connected accounts. The UX should make the limits of the information obvious without turning every screen into legal language.

- **Q:** Data stale

My biggest product concern would be trust in the data. If the customer sees a stale balance or a disconnected account and treats the view as current, we could unintentionally encourage a bad decision. I'd make data freshness, connection status and source clear, and design graceful failure states when an institution isn't available. I'd also want strong consent and clear language about what access is being granted. With read-only aggregation, I'd make sure the experience doesn't imply we can control or move money from those connected accounts. The UX should make the limits of the information obvious without turning every screen into legal language.

- **Q:** Privacy

My biggest product concern would be trust in the data. If the customer sees a stale balance or a disconnected account and treats the view as current, we could unintentionally encourage a bad decision. I'd make data freshness, connection status and source clear, and design graceful failure states when an institution isn't available. I'd also want strong consent and clear language about what access is being granted. With read-only aggregation, I'd make sure the experience doesn't imply we can control or move money from those connected accounts. The UX should make the limits of the information obvious without turning every screen into legal language.

---

### 63. What metrics would you use to measure success in everyday banking?

<a id="simplii-from-735da866-20fc-4837-b67d-c91a6b4e2c77-what-metri"></a>

- **Import key:** `simplii-from-735da866-20fc-4837-b67d-c91a6b4e2c77`
- **Library ID:** `65127872-0f03-4669-b10b-c64bbd5f6ee5`
- **Experience:** Product Metrics & Economics
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd separate product engagement from actual banking behaviour.

DAU and MAU are useful, but someone checking their balance every day doesn't necessarily mean we're becoming their primary bank.

I'd want a north-star metric tied to sustained primary-account relationships. For example, customers who have recurring qualifying deposits and regular transactional activity over a defined period.

Under that, I'd look at three sets of metrics.

First, acquisition and activation: account opening conversion, first funding, time to first transaction and direct deposit adoption.

Second, engagement and retention: monthly transacting customers, transactions per active account, repeat deposit behaviour, bill payments and 90-day retained activity.

Third, commercial outcomes: retained deposit balances, net inflows, product adoption and contribution margin where the economics can be measured.

I'd also have strong guardrails around failed payments, fraud, complaints, payment latency and support volume.

One thing I'd be careful about is optimizing transaction frequency in isolation. More transactions aren't automatically better. The customer should be getting more utility from the product, and the business should be building a healthier, more durable relationship.

I'd use these metrics by cohort rather than just looking at top-line averages, because growth from newly acquired accounts can hide weak retention among existing customers.

---

### 64. What would convince you to stop an AI financial-assistant pilot?

<a id="simplii-from-bad7b926-f617-44c4-ab13-ddc78b1e4378-what-would"></a>

- **Import key:** `simplii-from-bad7b926-f617-44c4-ab13-ddc78b1e4378`
- **Library ID:** `9d2bed0d-3ef7-4221-8e41-23454614cec1`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd define stop conditions before launch, including any demonstrated pattern of materially incorrect balances, unsafe transaction interpretations, unauthorized data access or high-severity customer confusion.

A great satisfaction score wouldn't compensate for a smaller number of serious financial errors. I'd classify failures by severity and investigate whether they're coming from stale source data, tool permissions, prompt handling or the model's explanation layer.

I'd also monitor customer corrections and whether the system handles uncertainty properly. In a pilot, stopping or narrowing scope is a useful learning outcome if we discover a risk we can't yet control. The aim is a trustworthy product, not proving AI should ship at any cost.

---

### 65. What would you do if the customer sees a successful transfer but settlement hasn't reconciled?

<a id="simplii-from-771cc93c-f8fd-4499-90dd-04482b325890-what-would"></a>

- **Import key:** `simplii-from-771cc93c-f8fd-4499-90dd-04482b325890`
- **Library ID:** `c7081e76-621b-406b-b02b-10386f5747ee`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd avoid assuming that a customer-facing 'success' label proves every financial event has been reconciled. I'd investigate exactly what success was meant to indicate: instruction accepted, funds posted or final settlement confirmed.

The first step is preserving the accurate transaction history and identifying the discrepancy with Finance, Operations and the payment service. If funds are genuinely at risk or duplicated, that becomes an incident.

Longer term, I'd tighten the product's status definitions and monitoring so we don't prematurely label an operation as final. Customers need a trustworthy status, and internal teams need an exception path that connects the operational record to the financial one.

---

### 66. What would you measure after changing a digital banking onboarding experience?

<a id="simplii-jd-009-what-would-you-measure-after-changing-a-digit"></a>

- **Import key:** `simplii-jd-009`
- **Library ID:** `f44d2290-c1a3-4568-8e73-7539c8df3987`
- **Experience:** Product leadership and digital banking
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd separate whether the flow got easier from whether the resulting accounts became useful. The immediate measures are step completion, time to usable account, verification failures and abandonment by segment.

Then I'd look at first funding and early meaningful activity, such as a transfer, bill payment or direct deposit, depending on the product. I'd use matched cohorts or an experiment when feasible and check whether introductory campaigns or channel mix changed.

I'd keep risk outcomes and support contacts as guardrails. An onboarding change that boosts completion while increasing fraud exposure or confused customers hasn't really succeeded.

---

### 67. What would you use as a north-star measure for deeper everyday-banking engagement?

<a id="simplii-from-0059c616-ee5b-4b23-a15e-f8af7061fd25-what-would"></a>

- **Import key:** `simplii-from-0059c616-ee5b-4b23-a15e-f8af7061fd25`
- **Library ID:** `2ccb20ab-bd0c-4847-811c-a4e0e8f6444e`
- **Experience:** Product Metrics & Economics
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd start with the product area's actual objective. For a chequing experience, one useful candidate is the number of customers showing sustained meaningful activity over several months, perhaps recurring income deposits plus payments or spending.

I'd define those events precisely, make sure we don't double-count transfers between the customer's own accounts, and segment newly activated customers from long-term ones. I'd track guardrails such as payment failures, customer complaints and the cost of servicing the account.

I'd still use account openings as a diagnostic, but I wouldn't make it the outcome. A funded, trusted account that's useful every week matters more than another account opened for a sign-up offer.

**Embedded follow-ups (4):**

- **Q:** North star

I'd use something like retained primary banking customers, but I'd define it operationally. For example: an eligible customer who has received qualifying recurring income and completed a minimum amount of regular third-party spending or bill activity over a defined recent period. I'd validate the thresholds using real behaviour rather than inventing them in a meeting. I'd also report each component separately, because a composite can hide where growth is happening. And I would treat the designation as a product signal rather than claiming we know the customer has abandoned all other banks. It's useful when it reflects a durable habit, not just one transaction.

- **Q:** Primary bank KPI

I'd use something like retained primary banking customers, but I'd define it operationally. For example: an eligible customer who has received qualifying recurring income and completed a minimum amount of regular third-party spending or bill activity over a defined recent period. I'd validate the thresholds using real behaviour rather than inventing them in a meeting. I'd also report each component separately, because a composite can hide where growth is happening. And I would treat the designation as a product signal rather than claiming we know the customer has abandoned all other banks. It's useful when it reflects a durable habit, not just one transaction.

- **Q:** Qualified primary relationship

I'd use something like retained primary banking customers, but I'd define it operationally. For example: an eligible customer who has received qualifying recurring income and completed a minimum amount of regular third-party spending or bill activity over a defined recent period. I'd validate the thresholds using real behaviour rather than inventing them in a meeting. I'd also report each component separately, because a composite can hide where growth is happening. And I would treat the designation as a product signal rather than claiming we know the customer has abandoned all other banks. It's useful when it reflects a durable habit, not just one transaction.

- **Q:** Metric definition

I'd use something like retained primary banking customers, but I'd define it operationally. For example: an eligible customer who has received qualifying recurring income and completed a minimum amount of regular third-party spending or bill activity over a defined recent period. I'd validate the thresholds using real behaviour rather than inventing them in a meeting. I'd also report each component separately, because a composite can hide where growth is happening. And I would treat the designation as a product signal rather than claiming we know the customer has abandoned all other banks. It's useful when it reflects a durable habit, not just one transaction.

---

### 68. What's the one feature you'd build first to win payroll?

<a id="simplii-from-e481df79-5778-46dc-8292-e381da7845d6-what-s-the"></a>

- **Import key:** `simplii-from-e481df79-5778-46dc-8292-e381da7845d6`
- **Library ID:** `5da7ce9b-6af8-4b17-8f35-f2c8801797b5`
- **Experience:** Simplii — Direct Deposit
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

Assuming the account, payment rails and reliability are ready, I'd start with a guided payroll-switching flow that makes the next action obvious. The customer should be able to find their account details, download or share the right deposit information, see what still needs to happen and understand when the change should take effect. I'd test that against a simple baseline and measure actual first payroll receipt, not just use of the guide. The reason I'd start there is that switching has a lot of operational and emotional friction, and we may be able to remove some of it without a massive platform build. I'd only add incentives after understanding where customers are getting stuck.

**Embedded follow-ups (4):**

- **Q:** First MVP

Assuming the account, payment rails and reliability are ready, I'd start with a guided payroll-switching flow that makes the next action obvious. The customer should be able to find their account details, download or share the right deposit information, see what still needs to happen and understand when the change should take effect. I'd test that against a simple baseline and measure actual first payroll receipt, not just use of the guide. The reason I'd start there is that switching has a lot of operational and emotional friction, and we may be able to remove some of it without a massive platform build. I'd only add incentives after understanding where customers are getting stuck.

- **Q:** First direct deposit feature

Assuming the account, payment rails and reliability are ready, I'd start with a guided payroll-switching flow that makes the next action obvious. The customer should be able to find their account details, download or share the right deposit information, see what still needs to happen and understand when the change should take effect. I'd test that against a simple baseline and measure actual first payroll receipt, not just use of the guide. The reason I'd start there is that switching has a lot of operational and emotional friction, and we may be able to remove some of it without a massive platform build. I'd only add incentives after understanding where customers are getting stuck.

- **Q:** Minimum viable switching flow

Assuming the account, payment rails and reliability are ready, I'd start with a guided payroll-switching flow that makes the next action obvious. The customer should be able to find their account details, download or share the right deposit information, see what still needs to happen and understand when the change should take effect. I'd test that against a simple baseline and measure actual first payroll receipt, not just use of the guide. The reason I'd start there is that switching has a lot of operational and emotional friction, and we may be able to remove some of it without a massive platform build. I'd only add incentives after understanding where customers are getting stuck.

- **Q:** Where to start?

Assuming the account, payment rails and reliability are ready, I'd start with a guided payroll-switching flow that makes the next action obvious. The customer should be able to find their account details, download or share the right deposit information, see what still needs to happen and understand when the change should take effect. I'd test that against a simple baseline and measure actual first payroll receipt, not just use of the guide. The reason I'd start there is that switching has a lot of operational and emotional friction, and we may be able to remove some of it without a massive platform build. I'd only add incentives after understanding where customers are getting stuck.

---

### 69. When should an automated retry be prohibited even if it would reduce failures?

<a id="simplii-from-d17bc916-0925-4b2f-9904-092499e61920-when-shoul"></a>

- **Import key:** `simplii-from-d17bc916-0925-4b2f-9904-092499e61920`
- **Library ID:** `03eeca02-d428-4871-810f-1ffedf52dff2`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

When we can't establish whether the original financial instruction actually executed, an automatic retry can be dangerous. It could send money twice.

I'd separate safe technical retries from new business instructions. With a stable transaction identifier and idempotent service contract, some operations can be retried safely. If the downstream outcome is uncertain, I would first query the transaction's authoritative status or route it into an exception workflow.

I'd also prohibit blind retries for failures that require customer action, risk review or corrected recipient information. The operational metric shouldn't reward us for making the system look faster while increasing financial harm.

---

### 70. When would you choose deterministic software or rules instead of an AI model?

<a id="simplii-from-be3e3314-68c5-4f6a-a3d9-7f0b9147e17b-when-would"></a>

- **Import key:** `simplii-from-be3e3314-68c5-4f6a-a3d9-7f0b9147e17b`
- **Library ID:** `b93bf1a4-44e2-46ee-a60d-3edc3d57ab22`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

Whenever the required behaviour can be specified reliably and failure has a clear cost. Balance calculations, eligibility rules, permissions, transfer limits and execution controls should be deterministic and validated server-side.

I'd use AI where natural language or unstructured information adds value, such as helping customers find an explanation or helping an operations team categorize exception descriptions. Even there, I want authoritative inputs and a safe fallback.

The decision isn't AI versus no AI as an identity statement. It's whether a probabilistic model improves the actual customer job enough to justify its latency, error rate, monitoring and security complexity.

---

### 71. Where should transaction status, balance calculation and reconciliation responsibilities sit?

<a id="simplii-from-695ace4a-7c53-415e-9eb2-5f885d680c2b-where-shou"></a>

- **Import key:** `simplii-from-695ace4a-7c53-415e-9eb2-5f885d680c2b`
- **Library ID:** `fdf1ed2d-f1ec-45ec-946f-48af47750005`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd want one clear source of truth for the financial record, but I wouldn't necessarily expect one system to own every part of the customer experience.

The core banking platform would typically be authoritative for account balances and posted ledger entries. Payment services might own the processing status of a transfer, including whether it was accepted, pending, rejected or returned.

Then the customer-facing product needs to translate those different states into something understandable.

Where I think teams get into trouble is when they start maintaining their own versions of the truth. You end up with one system saying a payment completed, another saying it's pending and a customer who doesn't know which balance they can spend.

I'd work with engineering and Finance to define ownership of each state, how updates are communicated, how we handle delayed or out-of-order events and what happens when systems disagree.

Reconciliation should independently confirm that the financial records match the underlying payment and settlement activity.

From my perspective, the product requirement is straightforward: customers need accurate information and a dependable way to resolve exceptions. The architecture needs to support that, not just the happy path.

**Embedded follow-ups (1):**

- **Q:** What owns the source of truth for account balances and payment statuses?

I'd want one clear source of truth for the financial record, but I wouldn't necessarily expect one system to own every part of the customer experience.

The core banking platform would typically be authoritative for account balances and posted ledger entries. Payment services might own the processing status of a transfer, including whether it was accepted, pending, rejected or returned.

Then the customer-facing product needs to translate those different states into something understandable.

Where I think teams get into trouble is when they start maintaining their own versions of the truth. You end up with one system saying a payment completed, another saying it's pending and a customer who doesn't know which balance they can spend.

I'd work with engineering and Finance to define ownership of each state, how updates are communicated, how we handle delayed or out-of-order events and what happens when systems disagree.

Reconciliation should independently confirm that the financial records match the underlying payment and settlement activity.

From my perspective, the product requirement is straightforward: customers need accurate information and a dependable way to resolve exceptions. The architecture needs to support that, not just the happy path.

---

### 72. Which customer segment would you prioritize to deepen Simplii chequing-account adoption?

<a id="simplii-from-0bcc9c40-011a-4fff-9789-fdad78429b78-which-cust"></a>

- **Import key:** `simplii-from-0bcc9c40-011a-4fff-9789-fdad78429b78`
- **Library ID:** `e536abfb-2ded-4688-8f9b-880d2b06bee5`
- **Experience:** Simplii — Primary Account
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd avoid choosing a demographic from intuition. I'd start with the existing journey and identify the biggest opportunity among customers who are eligible, recently onboarded, and showing clear intent but not completing a useful next step.

For example, new customers who funded their account but haven't set up direct deposit may be more receptive to a simple guided flow than completely inactive customers. I'd compare friction, expected value, research evidence and cost to serve by segment.

I'd also check that any proposed intervention helps the customer, not just our balance-sheet targets. Then I'd run a focused test and look for recurring deposits and retained activity over multiple cycles.

**Embedded follow-ups (4):**

- **Q:** First customer segment

I'd start with existing Simplii customers who already have recurring money movement into their investment accounts. They've demonstrated some level of trust and a repeat financial behaviour, so the step toward a broader banking relationship may be smaller. But I'd still validate that hypothesis. I'd compare segments by financial needs, existing product usage, willingness to switch, expected balances and cost to acquire. A frequent trader with high assets isn't necessarily the ideal everyday banking customer. Someone regularly moving a portion of each paycheque into investments might have a much stronger need for integrated cash flow. I'd choose the first segment based on both customer pain and realistic conversion potential, rather than just its current asset value.

- **Q:** Target market

I'd start with existing Simplii customers who already have recurring money movement into their investment accounts. They've demonstrated some level of trust and a repeat financial behaviour, so the step toward a broader banking relationship may be smaller. But I'd still validate that hypothesis. I'd compare segments by financial needs, existing product usage, willingness to switch, expected balances and cost to acquire. A frequent trader with high assets isn't necessarily the ideal everyday banking customer. Someone regularly moving a portion of each paycheque into investments might have a much stronger need for integrated cash flow. I'd choose the first segment based on both customer pain and realistic conversion potential, rather than just its current asset value.

- **Q:** ICP

I'd start with existing Simplii customers who already have recurring money movement into their investment accounts. They've demonstrated some level of trust and a repeat financial behaviour, so the step toward a broader banking relationship may be smaller. But I'd still validate that hypothesis. I'd compare segments by financial needs, existing product usage, willingness to switch, expected balances and cost to acquire. A frequent trader with high assets isn't necessarily the ideal everyday banking customer. Someone regularly moving a portion of each paycheque into investments might have a much stronger need for integrated cash flow. I'd choose the first segment based on both customer pain and realistic conversion potential, rather than just its current asset value.

- **Q:** Early adopters

I'd start with existing Simplii customers who already have recurring money movement into their investment accounts. They've demonstrated some level of trust and a repeat financial behaviour, so the step toward a broader banking relationship may be smaller. But I'd still validate that hypothesis. I'd compare segments by financial needs, existing product usage, willingness to switch, expected balances and cost to acquire. A frequent trader with high assets isn't necessarily the ideal everyday banking customer. Someone regularly moving a portion of each paycheque into investments might have a much stronger need for integrated cash flow. I'd choose the first segment based on both customer pain and realistic conversion potential, rather than just its current asset value.

---

### 73. Which three metrics would you put on a Simplii everyday-banking product scorecard?

<a id="simplii-from-557cbeab-d17e-48bc-99de-1a54625ee37f-which-thre"></a>

- **Import key:** `simplii-from-557cbeab-d17e-48bc-99de-1a54625ee37f`
- **Library ID:** `c8b01a77-90e2-4737-8a6d-2275c8c80de9`
- **Experience:** Career & Product Experience
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

Assuming the goal is to deepen day-to-day chequing use, I'd have a primary outcome of sustained active relationships—for example, the share of an onboarding cohort making meaningful transactions across successive months, not just logging in. Then an activation measure: of customers who've funded an account, how many complete a recurring-payroll or recurring-bill milestone within a defined window? And a reliability guardrail: payment exceptions that remain unresolved beyond the expected processing window per thousand relevant transactions.



I'd agree the denominators and exclusions before anyone uses the numbers for decisions. I'd also cut by new versus existing customers and acquisition channel, because a blended rate can improve while a critical segment gets worse. If the actual squad owns a different journey, those metrics should change with it.

**Embedded follow-ups (1):**

- **Q:** Metrics — Give a rigorous numerator, denominator, window, segments and guardrail

If the outcome were making a new chequing account part of someone's financial routine, I'd define a 90-day recurring payroll adoption rate rather than just counting openings.

My denominator would be distinct eligible customers who opened a usable chequing account in a given acquisition cohort and whose full 90-day observation window has elapsed. The numerator would be customers in that cohort who received at least two qualifying income deposits across separate expected pay cycles during those 90 days. I'd keep setup intent or a single first deposit as earlier funnel milestones, not final adoption.

I'd segment the result by acquisition channel, offer exposure, new versus existing customer relationship and app version if the onboarding flow changed. I'd also compare like-for-like cohorts so a marketing campaign doesn't masquerade as a product improvement.

A key guardrail would be payment or payroll-related failures and complaints, with clear rates instead of raw counts. A conversion lift doesn't help if people struggle to receive or access their paycheque.

---

### 74. Why is spend per active cardholder a risky metric?

<a id="simplii-from-3c438a5c-c720-4277-a72a-fdcdfd5e156d-why-is-spe"></a>

- **Import key:** `simplii-from-3c438a5c-c720-4277-a72a-fdcdfd5e156d`
- **Library ID:** `65441a61-8545-4b4a-a24f-afad1e983299`
- **Experience:** Product Metrics & Economics
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

Because the intervention can change who enters the denominator. If an incentive activates a lot of occasional cardholders with smaller purchases, spend per active cardholder might actually fall even though total profitable activity rises. I'd pair it with active rate, spending per eligible cardholder, incremental spend versus a holdout, and contribution after incentive costs. I'd also look at distribution, not just the mean, because a few high spenders can distort the average. The point is to understand whether the portfolio became healthier, not to optimize a single ratio.

**Embedded follow-ups (4):**

- **Q:** Selection bias

Because the intervention can change who enters the denominator. If an incentive activates a lot of occasional cardholders with smaller purchases, spend per active cardholder might actually fall even though total profitable activity rises. I'd pair it with active rate, spending per eligible cardholder, incremental spend versus a holdout, and contribution after incentive costs. I'd also look at distribution, not just the mean, because a few high spenders can distort the average. The point is to understand whether the portfolio became healthier, not to optimize a single ratio.

- **Q:** Spend per active

Because the intervention can change who enters the denominator. If an incentive activates a lot of occasional cardholders with smaller purchases, spend per active cardholder might actually fall even though total profitable activity rises. I'd pair it with active rate, spending per eligible cardholder, incremental spend versus a holdout, and contribution after incentive costs. I'd also look at distribution, not just the mean, because a few high spenders can distort the average. The point is to understand whether the portfolio became healthier, not to optimize a single ratio.

- **Q:** Denominator problem

Because the intervention can change who enters the denominator. If an incentive activates a lot of occasional cardholders with smaller purchases, spend per active cardholder might actually fall even though total profitable activity rises. I'd pair it with active rate, spending per eligible cardholder, incremental spend versus a holdout, and contribution after incentive costs. I'd also look at distribution, not just the mean, because a few high spenders can distort the average. The point is to understand whether the portfolio became healthier, not to optimize a single ratio.

- **Q:** Incentive gaming

Because the intervention can change who enters the denominator. If an incentive activates a lot of occasional cardholders with smaller purchases, spend per active cardholder might actually fall even though total profitable activity rises. I'd pair it with active rate, spending per eligible cardholder, incremental spend versus a holdout, and contribution after incentive costs. I'd also look at distribution, not just the mean, because a few high spenders can distort the average. The point is to understand whether the portfolio became healthier, not to optimize a single ratio.

---

### 75. Why might my available balance be different from my posted balance?

<a id="simplii-from-0f093e83-c8de-44bd-9398-e0f186a814df-why-might-"></a>

- **Import key:** `simplii-from-0f093e83-c8de-44bd-9398-e0f186a814df`
- **Library ID:** `790355dd-4280-4e76-bda9-1f24d7f19718`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

A posted balance reflects entries recorded on the account ledger, while available funds may account for things like pending holds or restrictions that affect what the customer can spend right now.

The key is not to present one number as universally correct for every customer decision. The app should make clear what is posted, what is pending and what is available, using data from authoritative systems.

I'd test tricky scenarios: a pending card authorization, a released hold, a returned deposit or a delayed state update. If the systems disagree, the customer experience should acknowledge the uncertainty rather than manufacture a precise-looking available amount.

---

### 76. Why would a bank not want unlimited deposits if customers are willing to bring them?

<a id="simplii-from-86fb0ff0-ee19-402f-bbd3-4d478d902d9e-why-would-"></a>

- **Import key:** `simplii-from-86fb0ff0-ee19-402f-bbd3-4d478d902d9e`
- **Library ID:** `fa48410b-1056-476d-a6c1-0678dbd59a35`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

Deposits are a funding source, but they aren't automatically profitable. The bank has to consider the rate it pays, how stable those balances are, how the funds can be deployed, liquidity and capital constraints, and the cost of servicing the customers.

A large promotional inflow that disappears as soon as the offer ends may be far less useful than smaller, stable operating balances from customers who transact regularly.

I'd partner with Finance and Treasury to understand the marginal contribution of the deposits we're attracting. As a PM, I'd want to know whether our incentives are drawing in the right kind of relationship, not just making the balance chart look impressive.

---

### 77. Why would someone move everyday banking activity to Simplii if their existing bank works fine?

<a id="simplii-from-dd28e2fe-24d1-4012-98d0-e951276439c6-why-would-"></a>

- **Import key:** `simplii-from-dd28e2fe-24d1-4012-98d0-e951276439c6`
- **Library ID:** `ec652af9-bea0-42c9-9c1b-51eaacf4b669`
- **Experience:** Simplii — Primary Account
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

A lot of people wouldn't, and I'd start there rather than pretend there's an unmet need for everyone.

I'd look for a segment with a meaningful problem: fees they dislike, a transfer experience that's unreliable, difficulty managing recurring payments, or a need Simplii serves particularly well. Then I'd test whether the value is strong enough to overcome switching effort and perceived risk.

Even if the proposition is attractive, asking someone to move payroll and bills is a high-trust request. I'd make the steps clear, show progress and avoid promising an automatic switch where a customer still has to contact their employer or billers. Success would be sustained usage, not merely a promotional sign-up.

---

### 78. Would you consider a secondary Simplii banking relationship a product failure?

<a id="simplii-from-adc80bff-8a24-4eaf-9c48-8b050d759ab1-would-you-"></a>

- **Import key:** `simplii-from-adc80bff-8a24-4eaf-9c48-8b050d759ab1`
- **Library ID:** `170748d9-959c-4718-8a5d-c5c83e790250`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

No. Not every customer wants one primary institution for everything. Some may use Simplii for day-to-day spending, specific transfers or a separate savings goal.

I'd judge that relationship against the job the customer hired the product to do and the economics of serving it. For a primary-account initiative, we'd still track recurring funding, payments and sustained activity. But I wouldn't collapse every customer into one binary definition of success.

---

### 79. Would you optimize account openings, funded accounts or payroll adoption?

<a id="simplii-from-75a6db9c-b40c-44d3-b7b7-3edd17933d54-would-you-"></a>

- **Import key:** `simplii-from-75a6db9c-b40c-44d3-b7b7-3edd17933d54`
- **Library ID:** `c3bc9de2-a338-4ee0-b115-846d89c99742`
- **Experience:** Simplii — Direct Deposit
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd measure all three, but I wouldn't make account openings the ultimate success metric. Openings show acquisition. First funding shows the customer has taken a meaningful next step. Recurring payroll and transactional activity are stronger indicators that the relationship is becoming habitual. Which lever I'd prioritize depends on the bottleneck. If opening conversion is terrible, we may need to fix that first. But if we're opening lots of accounts that never get funded, acquiring even more accounts won't solve the core problem. I'd use a funnel to identify the constraint and tie the roadmap to durable downstream behaviour.

**Embedded follow-ups (4):**

- **Q:** Metric hierarchy

I'd measure all three, but I wouldn't make account openings the ultimate success metric. Openings show acquisition. First funding shows the customer has taken a meaningful next step. Recurring payroll and transactional activity are stronger indicators that the relationship is becoming habitual. Which lever I'd prioritize depends on the bottleneck. If opening conversion is terrible, we may need to fix that first. But if we're opening lots of accounts that never get funded, acquiring even more accounts won't solve the core problem. I'd use a funnel to identify the constraint and tie the roadmap to durable downstream behaviour.

- **Q:** Funnel priority

I'd measure all three, but I wouldn't make account openings the ultimate success metric. Openings show acquisition. First funding shows the customer has taken a meaningful next step. Recurring payroll and transactional activity are stronger indicators that the relationship is becoming habitual. Which lever I'd prioritize depends on the bottleneck. If opening conversion is terrible, we may need to fix that first. But if we're opening lots of accounts that never get funded, acquiring even more accounts won't solve the core problem. I'd use a funnel to identify the constraint and tie the roadmap to durable downstream behaviour.

- **Q:** Opening versus activation

I'd measure all three, but I wouldn't make account openings the ultimate success metric. Openings show acquisition. First funding shows the customer has taken a meaningful next step. Recurring payroll and transactional activity are stronger indicators that the relationship is becoming habitual. Which lever I'd prioritize depends on the bottleneck. If opening conversion is terrible, we may need to fix that first. But if we're opening lots of accounts that never get funded, acquiring even more accounts won't solve the core problem. I'd use a funnel to identify the constraint and tie the roadmap to durable downstream behaviour.

- **Q:** Growth KPI

I'd measure all three, but I wouldn't make account openings the ultimate success metric. Openings show acquisition. First funding shows the customer has taken a meaningful next step. Recurring payroll and transactional activity are stronger indicators that the relationship is becoming habitual. Which lever I'd prioritize depends on the bottleneck. If opening conversion is terrible, we may need to fix that first. But if we're opening lots of accounts that never get funded, acquiring even more accounts won't solve the core problem. I'd use a funnel to identify the constraint and tie the roadmap to durable downstream behaviour.

---

### 80. Would you use AI to recommend how someone should move their money?

<a id="simplii-from-ad2fa044-aa66-4016-a587-a812cc94514d-would-you-"></a>

- **Import key:** `simplii-from-ad2fa044-aa66-4016-a587-a812cc94514d`
- **Library ID:** `eb4058f0-1593-466f-a4c3-8f983b16661b`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

Potentially, but I'd separate helping someone understand their situation from actually telling them what financial decision to make.

Let's say a customer asks whether they can afford to move $1,000 into savings.

Before I'd want AI giving them an answer, we'd need reliable information about their available balance, upcoming payments, recurring expenses and any limitations in the data we can see.

Even then, I'd be careful about presenting a confident recommendation. We might not know about a rent payment coming from another institution or an expense the customer hasn't told us about.

I'd start with something more transparent, like showing the available balance, known upcoming obligations and what would remain after a proposed transfer.

The customer could use that information to make their own decision.

If we eventually supported an AI-assisted transfer, I'd want explicit authorization, clear limits and a confirmation showing exactly what's happening.

I think AI can help people make better financial decisions. But I wouldn't want it creating the impression that it knows their entire financial situation when it doesn't.

**Embedded follow-ups (1):**

- **Q:** Should AI tell customers how much money to move into savings?

Potentially, but I'd separate helping someone understand their situation from actually telling them what financial decision to make.

Let's say a customer asks whether they can afford to move $1,000 into savings.

Before I'd want AI giving them an answer, we'd need reliable information about their available balance, upcoming payments, recurring expenses and any limitations in the data we can see.

Even then, I'd be careful about presenting a confident recommendation. We might not know about a rent payment coming from another institution or an expense the customer hasn't told us about.

I'd start with something more transparent, like showing the available balance, known upcoming obligations and what would remain after a proposed transfer.

The customer could use that information to make their own decision.

If we eventually supported an AI-assisted transfer, I'd want explicit authorization, clear limits and a confirmation showing exactly what's happening.

I think AI can help people make better financial decisions. But I wouldn't want it creating the impression that it knows their entire financial situation when it doesn't.

---

### 81. You can prioritize only one: direct-deposit setup, transaction clarity, automatic savings, or debit-card reliability. How do you decide?

<a id="simplii-from-50313c26-9a05-42e6-b88e-cc571be4b272-you-can-pr"></a>

- **Import key:** `simplii-from-50313c26-9a05-42e6-b88e-cc571be4b272`
- **Library ID:** `92e78f8e-a79e-425f-84e0-9b3b458842c7`
- **Experience:** Simplii — Direct Deposit
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

First I'd want to know whether reliability is already below an acceptable threshold. If people can't use their cards confidently, I wouldn't trade that away for a growth feature.

If the basics are healthy, I'd evaluate where the largest verified customer problem sits. I'd look at affected customer count, severity, opportunity size, operational cost and engineering dependencies. I'd also ask which metric we'd move and how soon we'd know.

For example, if customers are successfully opening accounts but failing to make Simplii part of their routine, direct-deposit setup might be the best next investment. If customers are calling because their pending transactions look wrong, transaction clarity might be more urgent. I'd take one recommendation to the squad with the evidence, risks and what we'd defer. I don't think a prioritization framework should substitute for product judgment.

---

### 82. You have only a dashboard, no user research. What do you do?

<a id="simplii-from-fce9554d-a36d-4085-874f-e842afda538c-you-have-o"></a>

- **Import key:** `simplii-from-fce9554d-a36d-4085-874f-e842afda538c`
- **Library ID:** `374f20dc-93b9-4e4d-8e97-255e17b34d94`
- **Experience:** Simplii — Primary Account
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd use the dashboard to identify the highest-value uncertainty, not to pretend the numbers explain motivation. Then I'd find lightweight ways to hear from customers: short interviews with customers who dropped off, conversations with frontline support, usability tests or targeted feedback at the relevant step. I don't think discovery always requires a six-week research programme. The key is separating what people did from why they did it. I'd combine those insights with instrumentation and ship a small test where the risk is manageable.

**Embedded follow-ups (4):**

- **Q:** Qual versus quant

I'd use the dashboard to identify the highest-value uncertainty, not to pretend the numbers explain motivation. Then I'd find lightweight ways to hear from customers: short interviews with customers who dropped off, conversations with frontline support, usability tests or targeted feedback at the relevant step. I don't think discovery always requires a six-week research programme. The key is separating what people did from why they did it. I'd combine those insights with instrumentation and ship a small test where the risk is manageable.

- **Q:** No research budget

I'd use the dashboard to identify the highest-value uncertainty, not to pretend the numbers explain motivation. Then I'd find lightweight ways to hear from customers: short interviews with customers who dropped off, conversations with frontline support, usability tests or targeted feedback at the relevant step. I don't think discovery always requires a six-week research programme. The key is separating what people did from why they did it. I'd combine those insights with instrumentation and ship a small test where the risk is manageable.

- **Q:** Data only

I'd use the dashboard to identify the highest-value uncertainty, not to pretend the numbers explain motivation. Then I'd find lightweight ways to hear from customers: short interviews with customers who dropped off, conversations with frontline support, usability tests or targeted feedback at the relevant step. I don't think discovery always requires a six-week research programme. The key is separating what people did from why they did it. I'd combine those insights with instrumentation and ship a small test where the risk is manageable.

- **Q:** Discovery under constraints

I'd use the dashboard to identify the highest-value uncertainty, not to pretend the numbers explain motivation. Then I'd find lightweight ways to hear from customers: short interviews with customers who dropped off, conversations with frontline support, usability tests or targeted feedback at the relevant step. I don't think discovery always requires a six-week research programme. The key is separating what people did from why they did it. I'd combine those insights with instrumentation and ship a small test where the risk is manageable.

---

### 83. Your conversion improved from 10% to 12%. Is that 2% or 20%?

<a id="simplii-from-0e0a03bc-dc74-48a1-8af5-3cc3a80ada2a-your-conve"></a>

- **Import key:** `simplii-from-0e0a03bc-dc74-48a1-8af5-3cc3a80ada2a`
- **Library ID:** `08f7bf7a-f32e-48a1-876d-8ec8a5de03a0`
- **Experience:** Product Metrics & Economics
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

It's a two-percentage-point increase and a 20% relative improvement. I'd always state which one I mean. That's especially important for a resume or executive update, where writing '+20%' without context could sound much larger than the actual movement. I'd also want the sample size, period and eligible denominator before drawing conclusions. A percentage change is only useful if the underlying metric is well-defined and stable.

**Embedded follow-ups (3):**

- **Q:** Relative versus absolute change

It's a two-percentage-point increase and a 20% relative improvement. I'd always state which one I mean. That's especially important for a resume or executive update, where writing '+20%' without context could sound much larger than the actual movement. I'd also want the sample size, period and eligible denominator before drawing conclusions. A percentage change is only useful if the underlying metric is well-defined and stable.

- **Q:** Percentage points

It's a two-percentage-point increase and a 20% relative improvement. I'd always state which one I mean. That's especially important for a resume or executive update, where writing '+20%' without context could sound much larger than the actual movement. I'd also want the sample size, period and eligible denominator before drawing conclusions. A percentage change is only useful if the underlying metric is well-defined and stable.

- **Q:** Conversion math

It's a two-percentage-point increase and a 20% relative improvement. I'd always state which one I mean. That's especially important for a resume or executive update, where writing '+20%' without context could sound much larger than the actual movement. I'd also want the sample size, period and eligible denominator before drawing conclusions. A percentage change is only useful if the underlying metric is well-defined and stable.

---

### 84. Your experiment improves payroll setup by 20% but increases support calls by 30%. Do you ship?

<a id="simplii-from-a27a2489-4944-4faa-b130-5a1a4ab088e9-your-exper"></a>

- **Import key:** `simplii-from-a27a2489-4944-4faa-b130-5a1a4ab088e9`
- **Library ID:** `94f8484a-e4f3-4ea1-b0a8-d041ef4ff9b3`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I wouldn't make the decision from the conversion number alone. I'd first establish whether the 20% is relative or absolute, whether the result is credible, and which customers and support issues are driving the increase.

If the extra calls are short, temporary setup questions, that is different from customers whose first paycheque is missing or who misunderstood whether switching was complete.

I'd segment the support contacts, quantify customer harm and the cost to serve, and look at sustained successful payroll deposits rather than just setup completion. I might revise the experience or roll it out selectively. A conversion lift that damages trust could be a bad trade.

---

## Leadership & Behavioural

<a id="leadership-behavioural"></a>

### 1. A customer says they sent money to the wrong recipient. What can your product realistically do?

<a id="simplii-from-837e7efc-def5-4758-8ca1-627d006ec1ff-a-customer"></a>

- **Import key:** `simplii-from-837e7efc-def5-4758-8ca1-627d006ec1ff`
- **Library ID:** `d392da9b-e6b6-41fe-acc9-5fd0c21c96b3`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd first establish the rail, the actual transaction state and whether the instruction is still cancellable. I wouldn't promise an instant reversal just because the customer made a mistake; what is possible depends on how the payment was processed and the applicable rules.

The product should make destination and amount confirmation clear before sending and provide a fast support path when an error is reported. I'd want operations to be able to trace the instruction, explain what can be investigated and communicate outcomes accurately.

Prevention is often more controllable than recovery, so I'd examine why the mistake happened and whether recipient verification or clearer confirmations would reduce it.

---

### 2. An account was frozen for suspected fraud. How would you handle the customer experience?

<a id="simplii-from-2fb50805-1cb9-43f9-a2ba-54b816d3085d-an-account"></a>

- **Import key:** `simplii-from-2fb50805-1cb9-43f9-a2ba-54b816d3085d`
- **Library ID:** `e27fbc91-c1cf-4f49-801b-d447965c7dc1`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd treat protecting funds and complying with the control as non-negotiable, but I'd also recognize how disruptive an unexpected restriction can be.

The customer needs a clear explanation of what we can disclose, how to verify their identity, how the review progresses and where they can get help. We shouldn't promise a release time the Risk team hasn't authorized, and we shouldn't reveal sensitive fraud-detection methods.

Internally, I'd track time in restricted state, legitimate-customer false positives, escalations and downstream financial harm. The experience should be humane and predictable without compromising the review.

---

### 3. Explain your interview copilot's semantic matching architecture without using technical jargon.

<a id="simplii-from-db88df8e-3a36-4cc6-8b84-4fb24e2136c3-explain-yo"></a>

- **Import key:** `simplii-from-db88df8e-3a36-4cc6-8b84-4fb24e2136c3`
- **Library ID:** `deeb5ff5-6388-4e1a-bd07-fff2e90c4f43`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** resume_supported

**Answer (spoken):**

I had a library of prepared interview answers, but the same question can be asked in dozens of ways. Searching by exact words wasn't good enough.

So I explored a small embedding model through Supabase. It turns each question into a numerical representation of its meaning, then retrieves prepared answers whose questions have similar meanings. I combine that with the conversation topic, because 'How did you measure that?' could mean RBC, HBC or Arc'teryx depending on what we were just discussing.

I deliberately chose retrieval over generating a new answer each time. It keeps the response tied to material I've reviewed and lets me manage cost and reliability. I'd only describe the hosted implementation as deployed if I've verified the live pipeline is running.

---

### 4. How are you using AI in your product management work?

<a id="simplii-from-7c079cf5-b153-435d-a4b3-e83ad3139a2b-how-are-yo"></a>

- **Import key:** `simplii-from-7c079cf5-b153-435d-a4b3-e83ad3139a2b`
- **Library ID:** `b1372f25-667a-4145-8b81-dae2a6ccb2a0`
- **Experience:** Leadership & Judgment
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I use it regularly, although I separate things I've actually built from ideas I might try in a banking product.

For research, I use tools like ChatGPT and Claude to structure questions, challenge an assumption or get a first pass at synthesizing material. I use Cursor to prototype. For example, I've been exploring a side project called Bench that uses computer vision for exercise rep counting, with human review when a rep isn't clear.

The value for me is speed to something testable, not replacing judgment. I still need to verify a claim, understand the customer problem and decide what goes into production. In banking I'd be especially careful about customer data, permission boundaries and any AI-generated financial information. A model output isn't a transaction record, and it shouldn't silently move money.

**Embedded follow-ups (3):**

- **Q:** How are you using AI agents rather than just chatbots?

I've been getting more interested in repeatable AI workflows rather than starting a new chat every time I need something done.

For example, if I'm exploring a product problem, I don't just want a model to summarize a bunch of information. I want a process that can pull together the relevant context, identify recurring themes, flag assumptions and produce something I can actually work with.

I've been exploring that with tools like Claude and ChatGPT, and using Cursor on the development side.

One project I've been building is an interview copilot. It combines live transcription with a structured answer library, and one of the interesting problems is keeping track of the conversation so a follow-up question retrieves the right context rather than an unrelated answer.

That's taught me quite a bit about the difference between a model that generates a plausible response and a workflow that's actually dependable.

The direction I'd like to take that further is with agents that can handle recurring research or product-triage tasks using approved data sources, while keeping the evidence and proposed actions visible for review.

I think the interesting part isn't having an agent do more things. It's deciding which tasks are predictable enough to automate and where human judgment still matters.

- **Q:** How do you measure whether AI is actually making you more effective?

I try not to measure it by how much content AI produces for me. Generating ten documents instead of two doesn't necessarily make me a better product manager.

What I care more about is how much faster I can get to a useful decision or something I can validate.

For example, if I'm exploring three approaches to a product problem, can I build and evaluate working versions before committing engineering resources? Can I uncover an integration constraint earlier? Can I catch a flawed assumption before it becomes an expensive delivery problem?

With the applications I've been building in Cursor, that's the biggest change I've noticed. I can test an idea directly instead of relying entirely on a written specification.

I'd also factor in rework. If AI helps me produce something in half the time but I spend twice as long correcting mistakes, that's not much of a gain.

In a team, I'd look at cycle time, output quality, rework and whether people are making better decisions with the time they've saved.

For me, the goal isn't to maximize AI usage. It's to improve the quality and speed of the product development process.

- **Q:** Why use Claude, ChatGPT, Grok and Cursor? Do you need all of them?

I don't think there's much value in using different models just for the sake of saying I use them.

I tend to choose the tool based on the problem.

ChatGPT and Claude are useful for thinking through product problems, challenging assumptions and structuring research. Grok can be useful when I'm interested in what people are discussing publicly, although I'd treat that as a signal rather than verified customer insight.

Cursor is where things become more tangible for me because I'm actually building and testing software.

Where I think this gets more interesting is connecting those capabilities into repeatable workflows. Instead of manually starting from scratch, the system can gather approved context, perform a defined analysis and produce something for review.

I'm also conscious of the risks. I wouldn't put confidential customer information into an unapproved tool, and I wouldn't automatically trust a model's analysis because it sounds convincing.

For me, the tools are interchangeable to some extent. What matters is the workflow, the quality of the evidence and whether it helps me make a better product decision.

---

### 5. How did you know your semantic-search approach was actually better than keyword matching?

<a id="simplii-from-c8d4a611-d174-48b1-911c-e2db8f3acc3e-how-did-yo"></a>

- **Import key:** `simplii-from-c8d4a611-d174-48b1-911c-e2db8f3acc3e`
- **Library ID:** `2ce2c6a0-5925-487f-8491-86f643f6a334`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** resume_supported

**Answer (spoken):**

I'd compare both systems against a fixed set of realistic questions, including paraphrases, short follow-ups, employer switches and deliberately unrelated prompts. For each case, I'd define which prepared Q&A should appear.

I'd measure top-one accuracy, whether the right answer is in the top three, latency and the rate of wrong-context matches. I'd also test whether manually reanalyzing a missed transcript can recover the answer.

The key is not to assume embeddings are better just because they sound more sophisticated. If the hybrid matcher doesn't improve retrieval in those cases, I'd tune the context logic or simplify the system. I wouldn't claim a percentage improvement until I'd run that benchmark.

---

### 6. How do you challenge a VP who has already promised a launch date?

<a id="simplii-from-478cb389-1d3d-43e6-9a9b-71fd8b7c7cd5-how-do-you"></a>

- **Import key:** `simplii-from-478cb389-1d3d-43e6-9a9b-71fd8b7c7cd5`
- **Library ID:** `3ea04563-8be5-4354-8e39-8d4f2a973fc2`
- **Experience:** Leadership & Judgment
- **Tier:** P2
- **Evidence:** resume_supported

**Answer (spoken):**

I'd avoid a vague message that 'the team is concerned.' I'd bring a clear assessment of what we know, the risks, the decisions still outstanding and the options. For example, we may be able to preserve the date by reducing scope, but not by skipping a critical reconciliation or security control. I'd recommend a path, explain what customer value we can still deliver and make the consequences of each trade-off explicit. I would raise it early rather than waiting until the deadline is obviously impossible. Senior stakeholders don't need a perfect plan; they need a credible explanation and someone willing to take ownership of the decision.

**Embedded follow-ups (4):**

- **Q:** Executive pushback

I'd avoid a vague message that 'the team is concerned.' I'd bring a clear assessment of what we know, the risks, the decisions still outstanding and the options. For example, we may be able to preserve the date by reducing scope, but not by skipping a critical reconciliation or security control. I'd recommend a path, explain what customer value we can still deliver and make the consequences of each trade-off explicit. I would raise it early rather than waiting until the deadline is obviously impossible. Senior stakeholders don't need a perfect plan; they need a credible explanation and someone willing to take ownership of the decision.

- **Q:** Committed date

I'd avoid a vague message that 'the team is concerned.' I'd bring a clear assessment of what we know, the risks, the decisions still outstanding and the options. For example, we may be able to preserve the date by reducing scope, but not by skipping a critical reconciliation or security control. I'd recommend a path, explain what customer value we can still deliver and make the consequences of each trade-off explicit. I would raise it early rather than waiting until the deadline is obviously impossible. Senior stakeholders don't need a perfect plan; they need a credible explanation and someone willing to take ownership of the decision.

- **Q:** Senior stakeholder conflict

I'd avoid a vague message that 'the team is concerned.' I'd bring a clear assessment of what we know, the risks, the decisions still outstanding and the options. For example, we may be able to preserve the date by reducing scope, but not by skipping a critical reconciliation or security control. I'd recommend a path, explain what customer value we can still deliver and make the consequences of each trade-off explicit. I would raise it early rather than waiting until the deadline is obviously impossible. Senior stakeholders don't need a perfect plan; they need a credible explanation and someone willing to take ownership of the decision.

- **Q:** Difficult conversation

I'd avoid a vague message that 'the team is concerned.' I'd bring a clear assessment of what we know, the risks, the decisions still outstanding and the options. For example, we may be able to preserve the date by reducing scope, but not by skipping a critical reconciliation or security control. I'd recommend a path, explain what customer value we can still deliver and make the consequences of each trade-off explicit. I would raise it early rather than waiting until the deadline is obviously impossible. Senior stakeholders don't need a perfect plan; they need a credible explanation and someone willing to take ownership of the decision.

---

### 7. How do you communicate a complex banking trade-off to an executive in two minutes?

<a id="simplii-from-d333a258-c050-4f17-a50b-242e5ad5254d-how-do-you"></a>

- **Import key:** `simplii-from-d333a258-c050-4f17-a50b-242e5ad5254d`
- **Library ID:** `e24772a0-4d42-44be-a0c7-75efafae8fd5`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd start with the decision we need, not a technical history lesson. For example: 'We can launch the new transfer experience this quarter, but only if we reduce scope or accept a specific operational risk. Here are the choices.'

Then I'd give the customer and business impact, the non-negotiable controls, and my recommendation with the main uncertainty. If there are three options, I'd make the consequences explicit rather than ask the executive to infer them from a detailed roadmap.

I'd keep the technical evidence available for follow-up. The goal is to help leadership make a responsible decision quickly without losing the nuance that matters.

---

### 8. How do you decide whether a backlog item is ready for a sprint?

<a id="simplii-jd-006-how-do-you-decide-whether-a-backlog-item-is-r"></a>

- **Import key:** `simplii-jd-006`
- **Library ID:** `a70923f7-1aa0-4372-b99d-46438ef81521`
- **Experience:** Product leadership and digital banking
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I don't need a giant specification, but I do need the problem and expected behaviour to be unambiguous enough for the team to make a commitment.

I want the key rules and acceptance criteria agreed, designs or API contracts sufficiently clear, and dependencies and risks visible. For financial journeys, I also want the failure cases and measurement plan discussed. If we don't know who owns a critical event or approval, calling the story ready is wishful thinking.

The team should still have room to decide implementation details. Readiness is about shared understanding and the ability to deliver customer value, not Product dictating every technical choice.

---

### 9. How do you explain a product tradeoff to senior stakeholders and to engineers differently?

<a id="simplii-jd-010-how-do-you-explain-a-product-tradeoff-to-seni"></a>

- **Import key:** `simplii-jd-010`
- **Library ID:** `fbe72c8e-37e5-47b9-be32-f6a98d8748a1`
- **Experience:** RBC Cashback Withdrawal
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

For leadership, I'd lead with the customer and business outcome, the decision needed, the options, and the consequence of each. They should understand what they are accepting if they choose the faster or cheaper path.

With engineers and design, I'd go deeper into constraints, acceptance criteria, failure states and dependencies, and I'd listen to where my assumption is wrong. It's the same decision, not two contradictory stories.

For example, on a financial payout journey I might tell leadership we're prioritizing accurate payment status over another launch enhancement. With the team I'd discuss the exact transaction-state model, operational reconciliation and how we test delayed confirmations.

---

### 10. How do you handle an engineer who strongly disagrees with your roadmap?

<a id="simplii-from-309200d8-48f6-4957-8eda-75eb4e3faf62-how-do-you"></a>

- **Import key:** `simplii-from-309200d8-48f6-4957-8eda-75eb4e3faf62`
- **Library ID:** `0d53f2f5-c0fa-4fff-b304-7b3860800533`
- **Experience:** Leadership & Judgment
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd want to understand their reasoning before defending my plan. They may be seeing an architectural or reliability risk that isn't obvious in the product requirements. I'd ask them to explain the consequence, the alternatives and the cost of delaying the underlying work. Then I'd compare that against the customer and business outcome we're trying to achieve. Sometimes that will change the roadmap, and it should. If we still disagree, I'd make a recommendation with the trade-offs visible and align on a decision. I think good PM-engineering relationships depend on being able to disagree openly without making it adversarial.

**Embedded follow-ups (4):**

- **Q:** Engineering disagreement

I'd want to understand their reasoning before defending my plan. They may be seeing an architectural or reliability risk that isn't obvious in the product requirements. I'd ask them to explain the consequence, the alternatives and the cost of delaying the underlying work. Then I'd compare that against the customer and business outcome we're trying to achieve. Sometimes that will change the roadmap, and it should. If we still disagree, I'd make a recommendation with the trade-offs visible and align on a decision. I think good PM-engineering relationships depend on being able to disagree openly without making it adversarial.

- **Q:** Challenge PM

I'd want to understand their reasoning before defending my plan. They may be seeing an architectural or reliability risk that isn't obvious in the product requirements. I'd ask them to explain the consequence, the alternatives and the cost of delaying the underlying work. Then I'd compare that against the customer and business outcome we're trying to achieve. Sometimes that will change the roadmap, and it should. If we still disagree, I'd make a recommendation with the trade-offs visible and align on a decision. I think good PM-engineering relationships depend on being able to disagree openly without making it adversarial.

- **Q:** Technical pushback

I'd want to understand their reasoning before defending my plan. They may be seeing an architectural or reliability risk that isn't obvious in the product requirements. I'd ask them to explain the consequence, the alternatives and the cost of delaying the underlying work. Then I'd compare that against the customer and business outcome we're trying to achieve. Sometimes that will change the roadmap, and it should. If we still disagree, I'd make a recommendation with the trade-offs visible and align on a decision. I think good PM-engineering relationships depend on being able to disagree openly without making it adversarial.

- **Q:** Influence without authority

I'd want to understand their reasoning before defending my plan. They may be seeing an architectural or reliability risk that isn't obvious in the product requirements. I'd ask them to explain the consequence, the alternatives and the cost of delaying the underlying work. Then I'd compare that against the customer and business outcome we're trying to achieve. Sometimes that will change the roadmap, and it should. If we still disagree, I'd make a recommendation with the trade-offs visible and align on a decision. I think good PM-engineering relationships depend on being able to disagree openly without making it adversarial.

---

### 11. How do you keep the backlog tied to customer outcomes instead of stakeholder requests?

<a id="simplii-jd-004-how-do-you-keep-the-backlog-tied-to-customer-"></a>

- **Import key:** `simplii-jd-004`
- **Library ID:** `a5d94d98-0d15-4a7f-9249-3ba4343db165`
- **Experience:** Product leadership and digital banking
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I find it helps to make the tradeoff concrete. At RBC, for example, we had opportunities to improve how non-bank members discovered and earned cashback. But there was a more fundamental gap: people could see money they'd earned without a straightforward way to withdraw it. I viewed solving that withdrawal journey as the more important prerequisite.



That doesn't mean engagement work was bad. It meant completing the existing customer promise came first. So when I prioritize, I look at the customer harm or opportunity, size of the affected group, feasibility and the cost of delay. I make the rationale visible so we're not just moving tickets around based on who asked most recently.



In a bank, I'd also separate non-negotiable risk or reliability work from discretionary growth bets. They shouldn't be scored as if they have identical constraints.

**Embedded follow-ups (2):**

- **Q:** What if the business stakeholder insists their item is urgent?

I would ask what consequence or deadline makes it urgent, assess that alongside the existing objective and dependencies, and make a clear call with the squad. Urgency is evidence to investigate, not a free pass around prioritization.

- **Q:** Prioritization — Which two genuine initiatives competed, and what exactly did yo

One decision that captures how I think about sequencing was on Avion. We had good reasons to keep improving cashback discovery and engagement; those experiences help members find earning opportunities and support growth. At the same time, non-RBC members could have a cashback balance without a practical way to receive it.

I put the withdrawal capability ahead of additional earning enhancements. The logic was customer value and order of operations. A better offer-discovery experience encourages people to accumulate more cashback, but it doesn't solve the broken end of the existing journey. The withdrawal gap affected an identifiable set of customers, and we had a realistic path through the enterprise Interac capability.

So what I sequenced behind it was discretionary earning/discovery enhancement work, not a mandatory risk control. I was comfortable with that because we were completing an existing promise before trying to expand engagement. The decision wasn't that growth didn't matter; it was that the product needed to make its current value usable first.

---

### 12. How do you know when to stop investing in a feature?

<a id="simplii-from-df6c37ec-3c98-4d5d-b441-30ba78608f56-how-do-you"></a>

- **Import key:** `simplii-from-df6c37ec-3c98-4d5d-b441-30ba78608f56`
- **Library ID:** `5dda9aad-f138-4b29-864f-0f72806ce0be`
- **Experience:** Leadership & Judgment
- **Tier:** P2
- **Evidence:** resume_supported

**Answer (spoken):**

I'd go back to the original hypothesis and the evidence we committed to collecting. If the feature isn't changing the intended customer behaviour, I'd first establish whether the problem is awareness, usability or a weak underlying need. Sometimes a small iteration makes sense. But if we've tested the reasonable alternatives and the impact still doesn't justify the cost, I'd rather stop than keep shipping around it because we've already invested time. I'd also consider dependencies and any customers relying on the feature before removing it. Good ownership includes being willing to redirect resources when the evidence says something isn't working.

**Embedded follow-ups (4):**

- **Q:** Kill a feature

I'd go back to the original hypothesis and the evidence we committed to collecting. If the feature isn't changing the intended customer behaviour, I'd first establish whether the problem is awareness, usability or a weak underlying need. Sometimes a small iteration makes sense. But if we've tested the reasonable alternatives and the impact still doesn't justify the cost, I'd rather stop than keep shipping around it because we've already invested time. I'd also consider dependencies and any customers relying on the feature before removing it. Good ownership includes being willing to redirect resources when the evidence says something isn't working.

- **Q:** Sunk cost

I'd go back to the original hypothesis and the evidence we committed to collecting. If the feature isn't changing the intended customer behaviour, I'd first establish whether the problem is awareness, usability or a weak underlying need. Sometimes a small iteration makes sense. But if we've tested the reasonable alternatives and the impact still doesn't justify the cost, I'd rather stop than keep shipping around it because we've already invested time. I'd also consider dependencies and any customers relying on the feature before removing it. Good ownership includes being willing to redirect resources when the evidence says something isn't working.

- **Q:** Product underperforming

I'd go back to the original hypothesis and the evidence we committed to collecting. If the feature isn't changing the intended customer behaviour, I'd first establish whether the problem is awareness, usability or a weak underlying need. Sometimes a small iteration makes sense. But if we've tested the reasonable alternatives and the impact still doesn't justify the cost, I'd rather stop than keep shipping around it because we've already invested time. I'd also consider dependencies and any customers relying on the feature before removing it. Good ownership includes being willing to redirect resources when the evidence says something isn't working.

- **Q:** Sunset decisions

I'd go back to the original hypothesis and the evidence we committed to collecting. If the feature isn't changing the intended customer behaviour, I'd first establish whether the problem is awareness, usability or a weak underlying need. Sometimes a small iteration makes sense. But if we've tested the reasonable alternatives and the impact still doesn't justify the cost, I'd rather stop than keep shipping around it because we've already invested time. I'd also consider dependencies and any customers relying on the feature before removing it. Good ownership includes being willing to redirect resources when the evidence says something isn't working.

---

### 13. How do you lead when you don't manage the engineers directly?

<a id="simplii-from-20f12afb-0dbb-49eb-821e-01989453d828-how-do-you"></a>

- **Import key:** `simplii-from-20f12afb-0dbb-49eb-821e-01989453d828`
- **Library ID:** `d83ade07-621a-4212-8867-cfb749a9499b`
- **Experience:** Leadership & Judgment
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

I see leadership as creating clarity and making it easier for the team to do good work. That starts with a clear customer problem and success measure, not just a prioritized ticket list. I want engineers and designers involved in shaping the solution because they often see options I don't. When we're blocked, my responsibility is to make decisions, resolve dependencies and explain trade-offs rather than asking everyone to work harder. I also try to give credit publicly and deal with disagreements directly. You don't need reporting authority to establish direction and accountability, but you do need trust and consistency.

**Embedded follow-ups (4):**

- **Q:** Influence without authority

I see leadership as creating clarity and making it easier for the team to do good work. That starts with a clear customer problem and success measure, not just a prioritized ticket list. I want engineers and designers involved in shaping the solution because they often see options I don't. When we're blocked, my responsibility is to make decisions, resolve dependencies and explain trade-offs rather than asking everyone to work harder. I also try to give credit publicly and deal with disagreements directly. You don't need reporting authority to establish direction and accountability, but you do need trust and consistency.

- **Q:** Matrix organization

I see leadership as creating clarity and making it easier for the team to do good work. That starts with a clear customer problem and success measure, not just a prioritized ticket list. I want engineers and designers involved in shaping the solution because they often see options I don't. When we're blocked, my responsibility is to make decisions, resolve dependencies and explain trade-offs rather than asking everyone to work harder. I also try to give credit publicly and deal with disagreements directly. You don't need reporting authority to establish direction and accountability, but you do need trust and consistency.

- **Q:** Cross-functional leadership

I see leadership as creating clarity and making it easier for the team to do good work. That starts with a clear customer problem and success measure, not just a prioritized ticket list. I want engineers and designers involved in shaping the solution because they often see options I don't. When we're blocked, my responsibility is to make decisions, resolve dependencies and explain trade-offs rather than asking everyone to work harder. I also try to give credit publicly and deal with disagreements directly. You don't need reporting authority to establish direction and accountability, but you do need trust and consistency.

- **Q:** Squad leadership

I see leadership as creating clarity and making it easier for the team to do good work. That starts with a clear customer problem and success measure, not just a prioritized ticket list. I want engineers and designers involved in shaping the solution because they often see options I don't. When we're blocked, my responsibility is to make decisions, resolve dependencies and explain trade-offs rather than asking everyone to work harder. I also try to give credit publicly and deal with disagreements directly. You don't need reporting authority to establish direction and accountability, but you do need trust and consistency.

---

### 14. How do you make decisions when the data is incomplete?

<a id="simplii-from-4f7c15c5-f4ec-40ce-b1df-3e0a7dddfc71-how-do-you"></a>

- **Import key:** `simplii-from-4f7c15c5-f4ec-40ce-b1df-3e0a7dddfc71`
- **Library ID:** `61d2dc83-2655-4597-9f06-3dcc09c37fee`
- **Experience:** Leadership & Judgment
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I think the first step is understanding which uncertainty actually matters to the decision.

Not every product decision needs a perfect data set. Sometimes the cost of waiting is higher than the cost of making a reversible decision and learning from it.

I usually try to separate what we know, what we believe and what would change our recommendation.

If it's a relatively low-risk customer experience change, I'd lean toward a small experiment or phased rollout.

If it's a decision involving money movement, customer balances or significant operational risk, the standard of evidence needs to be much higher.

I also try to be clear with stakeholders about the confidence level behind a recommendation. I'd rather say we have enough evidence to test a hypothesis than pretend we know the outcome.

For me, good judgment isn't the absence of uncertainty. It's knowing which uncertainties need to be resolved before moving forward.

---

### 15. How do you make sure acceptance criteria remain aligned to customer intent during delivery?

<a id="simplii-jd-021-how-do-you-make-sure-acceptance-criteria-rema"></a>

- **Import key:** `simplii-jd-021`
- **Library ID:** `f86c3375-2d93-4b0e-a733-6dd7659ef8fb`
- **Experience:** RBC Cashback Withdrawal
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I keep the story tied to the customer's intended outcome and use real examples during refinement and testing. If the requirement says a customer should know whether a transfer succeeded, then a status label that looks right but isn't connected to payment confirmation doesn't meet the need.

During delivery I'd review the main path, exceptions and accessibility with design, engineering and QA. If new technical detail reveals an inconsistency, we'd update the story and the test cases rather than quietly changing the meaning.

I also want to see the experience working across systems, not just an isolated component passing its unit test. That's where product ownership earns its keep.

**Embedded follow-ups (1):**

- **Q:** Delivery — Give an actual acceptance-criteria change after engineering or QA rai

One example of the sort of refinement that mattered in cashback withdrawals was the meaning of 'completed'. A simple initial story might say: when the payment API accepts the request, show the user that their withdrawal was successful.

The problem is that an accepted request is not necessarily a delivered payment. That's the kind of gap an engineer or QA should raise, because asynchronous processing and delayed confirmation create an intermediate state.

The better acceptance criteria distinguish receipt from completion: if the payment service acknowledges the instruction without a final outcome, show processing and retain the reference; if the result is uncertain after a timeout, don't encourage another payment instruction; and only show completion when the authoritative outcome confirms it.

I'd also make sure service and Finance can trace exceptions. It's not a flashy feature, but it changes whether the product gives a truthful answer about someone's money. That's why I want the BA, engineers and QA involved early rather than validating a happy path after the story is already built.

---

### 16. How do you manage stakeholders who disagree on priorities?

<a id="simplii-from-b4880442-6054-41de-b29b-f89c40e95005-how-do-you"></a>

- **Import key:** `simplii-from-b4880442-6054-41de-b29b-f89c40e95005`
- **Library ID:** `2adb5b81-d679-4daf-9ba0-75c6fea8a325`
- **Experience:** Leadership & Judgment
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

I've found that stakeholder disagreements often come from people optimizing for different outcomes.

Engineering may be focused on reliability or technical debt, Marketing may care about a launch commitment, and Finance may be looking at cost or payback.

My role is to make those trade-offs visible and bring everyone back to the customer or business objective.

I try to understand the underlying concern before proposing a compromise.

If two teams disagree on priority, I'd ask what evidence supports each position, what happens if we delay either initiative, and whether there are dependencies or risks we haven't accounted for.

Sometimes the right answer is a smaller scope. Other times, we have to make a clear decision that not everyone will prefer.

I don't think alignment means getting unanimous agreement. It means people understand the decision, why it was made, and what we're collectively committing to.

If there's a genuine disagreement that can't be resolved at the team level, I'd escalate it with a clear recommendation and trade-offs rather than simply sending leadership a list of competing opinions.

---

### 17. How do you measure success when a feature ships on time but customers don't adopt it?

<a id="simplii-jd-014-how-do-you-measure-success-when-a-feature-shi"></a>

- **Import key:** `simplii-jd-014`
- **Library ID:** `3f8d09d9-3e0a-48b6-bc25-edab453dfade`
- **Experience:** Product leadership and digital banking
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd first resist the temptation to call it a success because we delivered the roadmap. I'd check whether people encountered the feature, understood it, could use it successfully and had a reason to come back.

I'd look at funnels and relevant customer segments, then talk to customers about where the experience breaks down. If discoverability is the issue, that suggests a different response than weak customer value or a reliability problem.

I'd define a short follow-up experiment or decide to stop investing. The output is the release; the outcome is what customers can now do differently. Those are not interchangeable.

---

### 18. How do you say no without damaging a relationship with a powerful stakeholder?

<a id="simplii-from-f33aaf31-f0a3-403e-ad9d-eb2d7e7e410f-how-do-you"></a>

- **Import key:** `simplii-from-f33aaf31-f0a3-403e-ad9d-eb2d7e7e410f`
- **Library ID:** `cf94b94d-4511-42d1-9a30-3efecdc28cac`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd make it clear that I'm saying no to a proposed solution or timing, not dismissing the underlying problem. I'd first ask what outcome they're trying to achieve and whether our current roadmap already addresses it.

Then I'd explain the trade-off in concrete terms: what we'd delay, what customer or operational risk we'd introduce, and what evidence would change my recommendation. Where possible I'd suggest a smaller test or an alternative that preserves the underlying goal.

I also think consistency matters. If I change my position later because new evidence emerges, I'd explain why. That makes the decision feel principled rather than personal.

---

### 19. How do you work with designers and customer researchers?

<a id="simplii-from-c79db9b5-4487-4e2d-b794-624b16332f9e-how-do-you"></a>

- **Import key:** `simplii-from-c79db9b5-4487-4e2d-b794-624b16332f9e`
- **Library ID:** `1c9a6a2a-ec72-4eb7-b44d-653813bec5ff`
- **Experience:** Leadership & Judgment
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

I like bringing design into the problem-definition stage rather than handing over a list of requirements after the solution has already been decided.

I'd want us to agree on the customer problem, the evidence behind it and the outcome we're trying to change.

For example, if we're seeing abandonment during a banking onboarding journey, the answer might not be removing fields. The real problem could be that customers don't understand why we're asking for certain information.

I'd work with design and research to understand that through customer interviews, usability testing and behavioural data.

I think good product design is about making complicated things feel simple without hiding important information.

That's especially important in financial services because customers need enough clarity to make informed decisions.

I also like testing ideas at an appropriate level of fidelity. We shouldn't need to build a complete product to learn whether customers understand the underlying experience.

---

### 20. How do you write a user story and acceptance criteria that engineering can actually use?

<a id="simplii-jd-003-how-do-you-write-a-user-story-and-acceptance-"></a>

- **Import key:** `simplii-jd-003`
- **Library ID:** `2f1a5486-93f3-469a-b3d0-cc6797135237`
- **Experience:** RBC Cashback Withdrawal
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I usually start with the customer behaviour we need, then work backwards to what the system has to guarantee. For a transfer, the story isn't really about displaying a status badge. It's about letting someone know whether the request was received, whether the money moved, and what they can safely do next.



I'd work through that with engineering, the BA, QA and operations. For example: given a payout request has been accepted but we haven't received final confirmation, the customer must see a pending state—not a success state. If the processor times out, we can't blindly encourage another submission if there's a possibility the original is still processing. We'd also agree what gets logged and how support investigates the exception.



My job is to make the intent and the boundary conditions clear. Engineering owns the implementation; I stay accountable for whether the behaviour meets the customer need.

**Embedded follow-ups (2):**

- **Q:** Give me a concrete acceptance criterion.

Given a payout request has been accepted but final confirmation has not arrived, when the member views the request, then the interface shows a pending state and does not label it successful. A retry must not create a second payout for the same logical request. The exact timings and permitted retry behaviour must be confirmed with the payments team.

- **Q:** Delivery — Give an actual acceptance-criteria change after engineering or QA rai

One example of the sort of refinement that mattered in cashback withdrawals was the meaning of 'completed'. A simple initial story might say: when the payment API accepts the request, show the user that their withdrawal was successful.

The problem is that an accepted request is not necessarily a delivered payment. That's the kind of gap an engineer or QA should raise, because asynchronous processing and delayed confirmation create an intermediate state.

The better acceptance criteria distinguish receipt from completion: if the payment service acknowledges the instruction without a final outcome, show processing and retain the reference; if the result is uncertain after a timeout, don't encourage another payment instruction; and only show completion when the authoritative outcome confirms it.

I'd also make sure service and Finance can trace exceptions. It's not a flashy feature, but it changes whether the product gives a truthful answer about someone's money. That's why I want the BA, engineers and QA involved early rather than validating a happy path after the story is already built.

---

### 21. How long would you wait before deciding whether a payroll-switching experiment actually worked?

<a id="simplii-from-b995b443-a009-4b4c-b03b-81f53bd6cc67-how-long-w"></a>

- **Import key:** `simplii-from-b995b443-a009-4b4c-b03b-81f53bd6cc67`
- **Library ID:** `acf99513-7c5a-46d4-a52b-4908a2287189`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd align the measurement window to the behaviour. A completed setup form can be measured quickly, but payroll often follows an employer's own cycle. I'd need enough time to observe the first actual deposit and, ideally, repeated deposits.

I'd define the evaluation period before launching the test, based on expected payroll frequency and a meaningful sample. I'd also watch support contacts and failed deposits while the experiment runs.

If early setup conversion rises but deposits haven't occurred yet, I'd call that a promising leading signal, not proof of primary-banking adoption. The decision to scale should reflect the delay between a user action and the outcome we really care about.

---

### 22. How would you decide when to compensate a customer after a bank payment error?

<a id="simplii-from-7fefebb7-44eb-4fa3-80f8-14e6900cba0b-how-would-"></a>

- **Import key:** `simplii-from-7fefebb7-44eb-4fa3-80f8-14e6900cba0b`
- **Library ID:** `0cf98b04-9f6a-4e74-b5a6-652798abda84`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd first establish the facts and the customer's actual harm. Was money unavailable, did a bill fail, were fees incurred or did the customer simply see a delayed status?

The response needs to follow the bank's legal obligations, policies and incident-remediation framework, so I wouldn't invent a flat compensation promise. But I'd want consistent criteria, fast escalation for urgent hardship and a clear path to correct the financial record.

I'd look for patterns where repeated incidents are generating both customer harm and remediation cost. The product lesson is to prevent the failures, not treat goodwill credits as the primary solution.

---

### 23. How would you estimate whether a customer issue is worth fixing now?

<a id="simplii-jd-020-how-would-you-estimate-whether-a-customer-iss"></a>

- **Import key:** `simplii-jd-020`
- **Library ID:** `46bb9c42-76cd-461e-94de-1ba6fa7694ce`
- **Experience:** Product leadership and digital banking
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd start with the harm, not just ticket count. Is it a cosmetic inconvenience, a problem that blocks a key task, or something that risks access to money? Then I'd look at frequency, affected cohorts, trends and the cost to customers and the business.

I'd investigate whether the problem is new or recurring, whether it creates support contacts or failed transactions, and what the actual solution options cost. Some problems deserve priority because their impact is severe, even if they affect a relatively small group.

I'd make a recommendation with the uncertainties spelled out. 'We need more data' can be valid, but it should come with a specific next step rather than become a way to avoid deciding.

---

### 24. How would you hand off a complex product initiative to another PM?

<a id="simplii-from-b8e9f0a1-2c3d-4e5f-6a7b-8c9d0e1f2a3b-how-would-"></a>

- **Import key:** `simplii-from-b8e9f0a1-2c3d-4e5f-6a7b-8c9d0e1f2a3b`
- **Library ID:** `f135f23e-254b-48c8-9e8f-84314cdbdbad`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd focus on preserving the reasoning behind the roadmap, not just exporting tickets. The next PM needs to understand the customer problem, which assumptions are already tested, the biggest dependencies and why we chose one solution over another.

For a program like Arc'teryx membership, I'd document the scope and decision log, funding commitments, vendor assumptions, operational owners, risks and what was delivered versus still planned. I'd walk through open issues with engineering and business partners so there isn't a hidden dependency that surfaces after the handover.

I'd also introduce the new owner to the people who have to make the experience work. A responsible transition means the team can continue making decisions confidently without depending on one person's memory.

**Embedded follow-ups (8):**

- **Q:** What would your transition plan look like?

I'd take that responsibility pretty seriously, especially given the scale of the membership initiative and the number of teams involved.

I think the biggest risk when a product manager leaves isn't necessarily that the roadmap disappears. It's that a lot of the context behind the decisions leaves with them.

Why did we choose this platform? Why is one capability in the MVP and another deferred? What commitments have we made to different teams? Those are the things that aren't always obvious from looking at a Jira board.

So my first priority would be to make sure that context is documented properly.

I'd work with my manager to identify someone who could take ownership of the product, then walk them through the strategy, the major decisions we've made, the dependencies and any unresolved risks.

I'd also make sure there was a clear view of the upcoming milestones, particularly where teams like Commerce, Identity and ReBIRD are depending on us.

And I wouldn't want to just hand over documentation and disappear. Where possible, I'd have the incoming owner participate in key meetings and decisions so they could build those relationships directly.

Obviously, the timing would need to be worked out with my leadership team. But I think a good product leader should be building clarity and shared ownership throughout the initiative anyway, not only when they're preparing to leave.

My goal would be to leave the team in a position where they can keep making good decisions and moving forward without being dependent on me personally.

- **Q:** How would you hand over the membership program?

I'd take that responsibility pretty seriously, especially given the scale of the membership initiative and the number of teams involved.

I think the biggest risk when a product manager leaves isn't necessarily that the roadmap disappears. It's that a lot of the context behind the decisions leaves with them.

Why did we choose this platform? Why is one capability in the MVP and another deferred? What commitments have we made to different teams? Those are the things that aren't always obvious from looking at a Jira board.

So my first priority would be to make sure that context is documented properly.

I'd work with my manager to identify someone who could take ownership of the product, then walk them through the strategy, the major decisions we've made, the dependencies and any unresolved risks.

I'd also make sure there was a clear view of the upcoming milestones, particularly where teams like Commerce, Identity and ReBIRD are depending on us.

And I wouldn't want to just hand over documentation and disappear. Where possible, I'd have the incoming owner participate in key meetings and decisions so they could build those relationships directly.

Obviously, the timing would need to be worked out with my leadership team. But I think a good product leader should be building clarity and shared ownership throughout the initiative anyway, not only when they're preparing to leave.

My goal would be to leave the team in a position where they can keep making good decisions and moving forward without being dependent on me personally.

- **Q:** How would you ensure the project continues without you?

I'd take that responsibility pretty seriously, especially given the scale of the membership initiative and the number of teams involved.

I think the biggest risk when a product manager leaves isn't necessarily that the roadmap disappears. It's that a lot of the context behind the decisions leaves with them.

Why did we choose this platform? Why is one capability in the MVP and another deferred? What commitments have we made to different teams? Those are the things that aren't always obvious from looking at a Jira board.

So my first priority would be to make sure that context is documented properly.

I'd work with my manager to identify someone who could take ownership of the product, then walk them through the strategy, the major decisions we've made, the dependencies and any unresolved risks.

I'd also make sure there was a clear view of the upcoming milestones, particularly where teams like Commerce, Identity and ReBIRD are depending on us.

And I wouldn't want to just hand over documentation and disappear. Where possible, I'd have the incoming owner participate in key meetings and decisions so they could build those relationships directly.

Obviously, the timing would need to be worked out with my leadership team. But I think a good product leader should be building clarity and shared ownership throughout the initiative anyway, not only when they're preparing to leave.

My goal would be to leave the team in a position where they can keep making good decisions and moving forward without being dependent on me personally.

- **Q:** How would you transfer ownership of the roadmap?

I'd take that responsibility pretty seriously, especially given the scale of the membership initiative and the number of teams involved.

I think the biggest risk when a product manager leaves isn't necessarily that the roadmap disappears. It's that a lot of the context behind the decisions leaves with them.

Why did we choose this platform? Why is one capability in the MVP and another deferred? What commitments have we made to different teams? Those are the things that aren't always obvious from looking at a Jira board.

So my first priority would be to make sure that context is documented properly.

I'd work with my manager to identify someone who could take ownership of the product, then walk them through the strategy, the major decisions we've made, the dependencies and any unresolved risks.

I'd also make sure there was a clear view of the upcoming milestones, particularly where teams like Commerce, Identity and ReBIRD are depending on us.

And I wouldn't want to just hand over documentation and disappear. Where possible, I'd have the incoming owner participate in key meetings and decisions so they could build those relationships directly.

Obviously, the timing would need to be worked out with my leadership team. But I think a good product leader should be building clarity and shared ownership throughout the initiative anyway, not only when they're preparing to leave.

My goal would be to leave the team in a position where they can keep making good decisions and moving forward without being dependent on me personally.

- **Q:** What would happen to your team if you left?

I'd take that responsibility pretty seriously, especially given the scale of the membership initiative and the number of teams involved.

I think the biggest risk when a product manager leaves isn't necessarily that the roadmap disappears. It's that a lot of the context behind the decisions leaves with them.

Why did we choose this platform? Why is one capability in the MVP and another deferred? What commitments have we made to different teams? Those are the things that aren't always obvious from looking at a Jira board.

So my first priority would be to make sure that context is documented properly.

I'd work with my manager to identify someone who could take ownership of the product, then walk them through the strategy, the major decisions we've made, the dependencies and any unresolved risks.

I'd also make sure there was a clear view of the upcoming milestones, particularly where teams like Commerce, Identity and ReBIRD are depending on us.

And I wouldn't want to just hand over documentation and disappear. Where possible, I'd have the incoming owner participate in key meetings and decisions so they could build those relationships directly.

Obviously, the timing would need to be worked out with my leadership team. But I think a good product leader should be building clarity and shared ownership throughout the initiative anyway, not only when they're preparing to leave.

My goal would be to leave the team in a position where they can keep making good decisions and moving forward without being dependent on me personally.

- **Q:** How do you prevent knowledge loss when a PM leaves?

I'd take that responsibility pretty seriously, especially given the scale of the membership initiative and the number of teams involved.

I think the biggest risk when a product manager leaves isn't necessarily that the roadmap disappears. It's that a lot of the context behind the decisions leaves with them.

Why did we choose this platform? Why is one capability in the MVP and another deferred? What commitments have we made to different teams? Those are the things that aren't always obvious from looking at a Jira board.

So my first priority would be to make sure that context is documented properly.

I'd work with my manager to identify someone who could take ownership of the product, then walk them through the strategy, the major decisions we've made, the dependencies and any unresolved risks.

I'd also make sure there was a clear view of the upcoming milestones, particularly where teams like Commerce, Identity and ReBIRD are depending on us.

And I wouldn't want to just hand over documentation and disappear. Where possible, I'd have the incoming owner participate in key meetings and decisions so they could build those relationships directly.

Obviously, the timing would need to be worked out with my leadership team. But I think a good product leader should be building clarity and shared ownership throughout the initiative anyway, not only when they're preparing to leave.

My goal would be to leave the team in a position where they can keep making good decisions and moving forward without being dependent on me personally.

- **Q:** How would you manage a transition to Simplii?

I'd take that responsibility pretty seriously, especially given the scale of the membership initiative and the number of teams involved.

I think the biggest risk when a product manager leaves isn't necessarily that the roadmap disappears. It's that a lot of the context behind the decisions leaves with them.

Why did we choose this platform? Why is one capability in the MVP and another deferred? What commitments have we made to different teams? Those are the things that aren't always obvious from looking at a Jira board.

So my first priority would be to make sure that context is documented properly.

I'd work with my manager to identify someone who could take ownership of the product, then walk them through the strategy, the major decisions we've made, the dependencies and any unresolved risks.

I'd also make sure there was a clear view of the upcoming milestones, particularly where teams like Commerce, Identity and ReBIRD are depending on us.

And I wouldn't want to just hand over documentation and disappear. Where possible, I'd have the incoming owner participate in key meetings and decisions so they could build those relationships directly.

Obviously, the timing would need to be worked out with my leadership team. But I think a good product leader should be building clarity and shared ownership throughout the initiative anyway, not only when they're preparing to leave.

My goal would be to leave the team in a position where they can keep making good decisions and moving forward without being dependent on me personally.

- **Q:** How would you make sure the team could continue without you?

I'd take that responsibility pretty seriously, especially given the scale of the membership initiative and the number of teams involved.

I think the biggest risk when a product manager leaves isn't necessarily that the roadmap disappears. It's that a lot of the context behind the decisions leaves with them.

Why did we choose this platform? Why is one capability in the MVP and another deferred? What commitments have we made to different teams? Those are the things that aren't always obvious from looking at a Jira board.

So my first priority would be to make sure that context is documented properly.

I'd work with my manager to identify someone who could take ownership of the product, then walk them through the strategy, the major decisions we've made, the dependencies and any unresolved risks.

I'd also make sure there was a clear view of the upcoming milestones, particularly where teams like Commerce, Identity and ReBIRD are depending on us.

And I wouldn't want to just hand over documentation and disappear. Where possible, I'd have the incoming owner participate in key meetings and decisions so they could build those relationships directly.

Obviously, the timing would need to be worked out with my leadership team. But I think a good product leader should be building clarity and shared ownership throughout the initiative anyway, not only when they're preparing to leave.

My goal would be to leave the team in a position where they can keep making good decisions and moving forward without being dependent on me personally.

---

### 25. How would you handle an offshore team that doesn't understand the customer impact of a requirement?

<a id="simplii-from-a95a3a54-604e-4617-af66-92158c5c2c53-how-would-"></a>

- **Import key:** `simplii-from-a95a3a54-604e-4617-af66-92158c5c2c53`
- **Library ID:** `4cee9abd-4fe7-4cad-b071-e66302621e0a`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd avoid treating that as a motivation problem before checking whether I've supplied enough context. A ticket that only describes a field or API change doesn't help an engineer make good decisions.

I'd walk through the customer journey, explain what goes wrong if the requirement fails, and include examples of both the expected and exceptional states. I'd also create a quick feedback loop where engineers can challenge unclear assumptions before work proceeds too far.

I've worked with geographically distributed engineering teams, so I'm conscious that written communication and explicit acceptance criteria matter. The aim is to create shared product understanding, not just hand out detailed instructions.

---

### 26. How would you handle events arriving out of order in a customer's transaction history?

<a id="simplii-from-25ad6af4-9d72-4ac5-9159-29bceeebfb80-how-would-"></a>

- **Import key:** `simplii-from-25ad6af4-9d72-4ac5-9159-29bceeebfb80`
- **Library ID:** `525c198e-8ce6-4a46-afff-96219cf7463c`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd want financial systems to remain authoritative about posted entries while the app handles presentation carefully. If events arrive late or out of order, we shouldn't assume the arrival order is the financial order.

I'd work with engineering on stable identifiers, event timestamps, versions and reconciliation against the source of truth. The customer view may need to update an earlier pending item when a final status becomes available rather than append another unrelated row.

I'd test delayed, duplicated and missing events explicitly. If we can't establish an accurate status, it's better to acknowledge uncertainty than show a confident but incorrect sequence of money movements.

---

### 27. How would you know that the delivery team's roadmap is improving customers' lives?

<a id="simplii-jd-023-how-would-you-know-that-the-delivery-team-s-r"></a>

- **Import key:** `simplii-jd-023`
- **Library ID:** `f3e36c46-8203-46b5-a827-71ba9335d028`
- **Experience:** Product leadership and digital banking
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd insist on separating release progress from outcome progress. We need to know whether the work shipped safely, but also whether customers completed a job more easily, with fewer errors or better confidence.

That means defining the baseline before launch, instrumenting the important steps, and looking at outcomes by cohort. I'd combine that with qualitative evidence because some issues, like fear of moving payroll, don't show up as a neat funnel event.

If the outcome doesn't move, I'd ask whether the feature reached the right customers, whether it worked properly and whether our original problem statement was right. A completed roadmap is not the same thing as a better banking experience.

---

### 28. How would you run a healthy product squad day to day?

<a id="simplii-jd-016-how-would-you-run-a-healthy-product-squad-day"></a>

- **Import key:** `simplii-jd-016`
- **Library ID:** `899e8ec4-9f03-4e3f-b4c1-6f08db03a215`
- **Experience:** Product leadership and digital banking
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd want three things to be true: the team knows the outcome we're trying to move, the next decisions are clear, and surprises surface early enough that we can act on them.



In practice, I keep discovery close to the delivery team, use refinement to resolve rules and dependencies before sprint commitment, and make room for operational work rather than pretending the roadmap runs in a vacuum. I want engineering and QA to challenge unclear acceptance criteria, and I want customer-service evidence to reach the squad without being reduced to a ticket count.



My role isn't to run every ceremony or prescribe every technical decision. It's to provide clarity on priorities, make tradeoffs when the team needs a call, and check after release whether the product outcome actually changed.

---

### 29. How would you set shared OKRs without making ownership ambiguous?

<a id="simplii-from-059b883d-ccbf-4e0b-8719-5dbff7c26da6-how-would-"></a>

- **Import key:** `simplii-from-059b883d-ccbf-4e0b-8719-5dbff7c26da6`
- **Library ID:** `eb5e4dcf-77d7-4b07-b56f-9947e88598fe`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd separate the customer outcome that teams jointly influence from the capabilities each team directly owns. For example, sustained active primary accounts might be shared, while one team owns reliable payroll funding and another owns card transaction success.

I'd define lead measures and service-level guardrails for the dependencies, then agree on a regular decision forum where cross-team trade-offs are resolved. Shared outcomes should encourage collaboration, but they shouldn't become a way for everyone to blame someone else when performance misses.

I'd want clear escalation paths and a common view of the customer journey so the organization optimizes for the relationship rather than isolated feature deliveries.

---

### 30. How would you work with designers, engineers, analysts and researchers who disagree on a solution?

<a id="simplii-jd-022-how-would-you-work-with-designers-engineers-a"></a>

- **Import key:** `simplii-jd-022`
- **Library ID:** `4647cae3-176b-49c0-b317-18c582a000b5`
- **Experience:** Product leadership and digital banking
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd first ask what each person is actually disagreeing about. A BA may see an unhandled rule, an engineer may see a downstream dependency, and QA may be pointing to a failure we can't safely test. Those aren't just competing preferences.



I'd make the assumptions and consequences visible, then decide whether we need a quick spike, a customer test, or simply a clear product call. If we can't resolve it with more evidence before the commitment, I would recommend a direction, document the assumption and define what we'd monitor after release.



I want everyone to challenge the decision before we make it, but I also don't want ambiguity to become a permanent excuse not to decide. The PM owns the customer tradeoff, while technical and control owners retain their appropriate decision rights.

---

### 31. How would you work with Risk when a control adds friction to a customer journey?

<a id="simplii-jd-013-how-would-you-work-with-risk-when-a-control-a"></a>

- **Import key:** `simplii-jd-013`
- **Library ID:** `3df86e9e-2cad-4aa7-b58d-a641ab422518`
- **Experience:** RBC Cashback Withdrawal
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd first get specific about the risk we're mitigating. Is this a regulatory requirement, an internal policy, or one proposed way of managing an identified exposure? That tells us how much design flexibility exists.



If verification is causing legitimate applicants to drop out, for example, I wouldn't start by asking Risk to loosen the threshold. I'd look at the failure reasons, whether the customer understands what is needed, and whether there are permissible recovery or alternative-verification paths. Then we'd evaluate the customer benefit against the residual risk and operational cost.



Sometimes the answer is that the control stays, even if conversion suffers. My responsibility is to bring the customer evidence and better options to the decision, not treat risk acceptance as my unilateral call.

---

### 32. If debit-card reliability is already strong but payroll adoption is flat, how would you reprioritize?

<a id="simplii-from-e3fe2cd3-f788-42bb-9446-e5e8fc5fa2d0-if-debit-c"></a>

- **Import key:** `simplii-from-e3fe2cd3-f788-42bb-9446-e5e8fc5fa2d0`
- **Library ID:** `40fa38a7-005e-4cf0-844c-5b6432fd3ffa`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd check that 'strong' reliability means what it sounds like: not just uptime, but authorization success and customer-impacting incidents by segment. If that baseline holds, I'd shift capacity toward diagnosing payroll adoption.

I'd examine the journey from funded account to obtaining the direct-deposit form, providing it to an employer and observing the first and next pay cycles. I'd research where people get stuck and test a contained improvement, while keeping reliability guardrails in place.

The important thing is responding to evidence rather than treating the original roadmap as a promise.

---

### 33. Should a bank help customers automate savings when they have unpredictable income?

<a id="simplii-from-4f6209aa-a000-442c-bbd6-96723a266b9a-should-a-b"></a>

- **Import key:** `simplii-from-4f6209aa-a000-442c-bbd6-96723a266b9a`
- **Library ID:** `c63ca3d7-ac6d-40af-b784-9d4fcf1e9538`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

Yes, but I'd avoid a fixed recurring transfer that assumes everyone receives the same paycheque every two weeks.

For someone with variable income, I'd explore flexible triggers, clear minimum-balance safeguards and the ability to pause or adjust transfers. I'd prioritize transparent rules and explicit consent before more ambitious AI-led automation.

I'd test whether the feature actually helps people accumulate savings without triggering failed payments, overdrafts or repeated manual reversals. A savings automation that creates cash shortages isn't a successful savings product, even if the transfer count looks healthy.

---

### 34. Tell me about a product decision you got wrong. What did you learn?

<a id="simplii-from-c8d9e0f1-2a3b-4c5d-6e7f-8a9b0c1d2e3f-tell-me-ab"></a>

- **Import key:** `simplii-from-c8d9e0f1-2a3b-4c5d-6e7f-8a9b0c1d2e3f`
- **Library ID:** `413c49cd-795d-4555-a4e6-353acd0ad2aa`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** unverified_detail

**Answer (spoken):**

I don't want to manufacture a dramatic failure story. A genuine lesson from working on a complex membership program is that it's easy to underestimate how much an apparently simple benefit depends on operations and other platforms.

Early planning can make a capability look self-contained, but when you walk through fulfilment, service exceptions and the customer journey, you find the real dependencies. My response was to push for more end-to-end validation and separate what we could launch credibly from what needed more work.

If you want a specific decision where I was personally wrong, I'd rather be precise about the original call and what changed it than turn a general learning into a fabricated incident. That's an area I'd prepare a more concrete example for before an interview.

**Embedded follow-ups (6):**

- **Q:** Tell me about a mistake you made as a product manager.

One example that comes to mind is when I was working on cardholder engagement at HBC.

We were exploring ways to get customers to use their HBC Mastercard more frequently, and one of the approaches was introducing spending challenges through our Quests platform.

My initial thinking was that if we made the challenges relatively accessible, we'd get more people participating, build a habit around using the card and ultimately drive more spend.

And we did see engagement. The problem was, when we started looking more closely at the behaviour, I realized I'd been putting too much weight on participation itself.

Some of the customers completing those challenges were already fairly active cardholders. So we were potentially rewarding spending that would have happened anyway, which isn't a great use of incentive dollars.

That was the part I got wrong. I had focused too much on making the experience engaging without being disciplined enough upfront about what incremental behaviour we were actually trying to create.

So I pushed us to rethink how we were targeting the challenges. Instead of treating all cardholders the same, we'd look at where there was a genuine opportunity to change behaviour, like getting newer cardholders to make their next purchase or bringing back customers whose activity had declined.

We also needed to be much more deliberate about measurement, looking beyond completions to changes in spending behaviour and the cost of generating that activity.

The biggest lesson for me was that a product can look successful from an engagement standpoint and still be a poor business decision.

Since then, I've been much more careful about agreeing on the behaviour we're trying to change before we start debating features or incentives.

- **Q:** Describe a product decision you regret.

One example that comes to mind is when I was working on cardholder engagement at HBC.

We were exploring ways to get customers to use their HBC Mastercard more frequently, and one of the approaches was introducing spending challenges through our Quests platform.

My initial thinking was that if we made the challenges relatively accessible, we'd get more people participating, build a habit around using the card and ultimately drive more spend.

And we did see engagement. The problem was, when we started looking more closely at the behaviour, I realized I'd been putting too much weight on participation itself.

Some of the customers completing those challenges were already fairly active cardholders. So we were potentially rewarding spending that would have happened anyway, which isn't a great use of incentive dollars.

That was the part I got wrong. I had focused too much on making the experience engaging without being disciplined enough upfront about what incremental behaviour we were actually trying to create.

So I pushed us to rethink how we were targeting the challenges. Instead of treating all cardholders the same, we'd look at where there was a genuine opportunity to change behaviour, like getting newer cardholders to make their next purchase or bringing back customers whose activity had declined.

We also needed to be much more deliberate about measurement, looking beyond completions to changes in spending behaviour and the cost of generating that activity.

The biggest lesson for me was that a product can look successful from an engagement standpoint and still be a poor business decision.

Since then, I've been much more careful about agreeing on the behaviour we're trying to change before we start debating features or incentives.

- **Q:** When did you realize your product strategy was wrong?

One example that comes to mind is when I was working on cardholder engagement at HBC.

We were exploring ways to get customers to use their HBC Mastercard more frequently, and one of the approaches was introducing spending challenges through our Quests platform.

My initial thinking was that if we made the challenges relatively accessible, we'd get more people participating, build a habit around using the card and ultimately drive more spend.

And we did see engagement. The problem was, when we started looking more closely at the behaviour, I realized I'd been putting too much weight on participation itself.

Some of the customers completing those challenges were already fairly active cardholders. So we were potentially rewarding spending that would have happened anyway, which isn't a great use of incentive dollars.

That was the part I got wrong. I had focused too much on making the experience engaging without being disciplined enough upfront about what incremental behaviour we were actually trying to create.

So I pushed us to rethink how we were targeting the challenges. Instead of treating all cardholders the same, we'd look at where there was a genuine opportunity to change behaviour, like getting newer cardholders to make their next purchase or bringing back customers whose activity had declined.

We also needed to be much more deliberate about measurement, looking beyond completions to changes in spending behaviour and the cost of generating that activity.

The biggest lesson for me was that a product can look successful from an engagement standpoint and still be a poor business decision.

Since then, I've been much more careful about agreeing on the behaviour we're trying to change before we start debating features or incentives.

- **Q:** Tell me about a time you changed your mind.

One example that comes to mind is when I was working on cardholder engagement at HBC.

We were exploring ways to get customers to use their HBC Mastercard more frequently, and one of the approaches was introducing spending challenges through our Quests platform.

My initial thinking was that if we made the challenges relatively accessible, we'd get more people participating, build a habit around using the card and ultimately drive more spend.

And we did see engagement. The problem was, when we started looking more closely at the behaviour, I realized I'd been putting too much weight on participation itself.

Some of the customers completing those challenges were already fairly active cardholders. So we were potentially rewarding spending that would have happened anyway, which isn't a great use of incentive dollars.

That was the part I got wrong. I had focused too much on making the experience engaging without being disciplined enough upfront about what incremental behaviour we were actually trying to create.

So I pushed us to rethink how we were targeting the challenges. Instead of treating all cardholders the same, we'd look at where there was a genuine opportunity to change behaviour, like getting newer cardholders to make their next purchase or bringing back customers whose activity had declined.

We also needed to be much more deliberate about measurement, looking beyond completions to changes in spending behaviour and the cost of generating that activity.

The biggest lesson for me was that a product can look successful from an engagement standpoint and still be a poor business decision.

Since then, I've been much more careful about agreeing on the behaviour we're trying to change before we start debating features or incentives.

- **Q:** Describe a feature that performed well but didn't create business value.

One example that comes to mind is when I was working on cardholder engagement at HBC.

We were exploring ways to get customers to use their HBC Mastercard more frequently, and one of the approaches was introducing spending challenges through our Quests platform.

My initial thinking was that if we made the challenges relatively accessible, we'd get more people participating, build a habit around using the card and ultimately drive more spend.

And we did see engagement. The problem was, when we started looking more closely at the behaviour, I realized I'd been putting too much weight on participation itself.

Some of the customers completing those challenges were already fairly active cardholders. So we were potentially rewarding spending that would have happened anyway, which isn't a great use of incentive dollars.

That was the part I got wrong. I had focused too much on making the experience engaging without being disciplined enough upfront about what incremental behaviour we were actually trying to create.

So I pushed us to rethink how we were targeting the challenges. Instead of treating all cardholders the same, we'd look at where there was a genuine opportunity to change behaviour, like getting newer cardholders to make their next purchase or bringing back customers whose activity had declined.

We also needed to be much more deliberate about measurement, looking beyond completions to changes in spending behaviour and the cost of generating that activity.

The biggest lesson for me was that a product can look successful from an engagement standpoint and still be a poor business decision.

Since then, I've been much more careful about agreeing on the behaviour we're trying to change before we start debating features or incentives.

- **Q:** What was a product failure you learned from?

One example that comes to mind is when I was working on cardholder engagement at HBC.

We were exploring ways to get customers to use their HBC Mastercard more frequently, and one of the approaches was introducing spending challenges through our Quests platform.

My initial thinking was that if we made the challenges relatively accessible, we'd get more people participating, build a habit around using the card and ultimately drive more spend.

And we did see engagement. The problem was, when we started looking more closely at the behaviour, I realized I'd been putting too much weight on participation itself.

Some of the customers completing those challenges were already fairly active cardholders. So we were potentially rewarding spending that would have happened anyway, which isn't a great use of incentive dollars.

That was the part I got wrong. I had focused too much on making the experience engaging without being disciplined enough upfront about what incremental behaviour we were actually trying to create.

So I pushed us to rethink how we were targeting the challenges. Instead of treating all cardholders the same, we'd look at where there was a genuine opportunity to change behaviour, like getting newer cardholders to make their next purchase or bringing back customers whose activity had declined.

We also needed to be much more deliberate about measurement, looking beyond completions to changes in spending behaviour and the cost of generating that activity.

The biggest lesson for me was that a product can look successful from an engagement standpoint and still be a poor business decision.

Since then, I've been much more careful about agreeing on the behaviour we're trying to change before we start debating features or incentives.

---

### 35. Tell me about a product initiative that didn't go according to plan.

<a id="simplii-from-15aa03e2-46af-4d60-9d73-90ed342c6ccc-tell-me-ab"></a>

- **Import key:** `simplii-from-15aa03e2-46af-4d60-9d73-90ed342c6ccc`
- **Library ID:** `2fca5f1c-f7a9-4a1e-84c1-15955b449a46`
- **Experience:** Leadership & Judgment
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

The Arc'teryx membership work is a good example. We had an ambitious proposition connecting a number of customer and service experiences, but the dependencies across technology, operations and partner teams were more complicated than a single roadmap slide suggested.

As we worked through the delivery sequence, it became important to distinguish the broader platform MVP from benefits that could be provided sooner. We adjusted the scope and separated a smaller Sperro SV-related release instead of forcing everything into the same timeline.

My responsibility was to make those tradeoffs clear to stakeholders and keep the customer promise credible. The lesson for me was that being committed to an outcome doesn't mean defending the first delivery plan after the evidence changes.

---

### 36. Tell me about a time you challenged the original product strategy.

<a id="simplii-from-011b9f33-e2ea-4063-aa22-446d561e6df1-tell-me-ab"></a>

- **Import key:** `simplii-from-011b9f33-e2ea-4063-aa22-446d561e6df1`
- **Library ID:** `c7d1b75f-344c-4a09-b2a3-386c6bbcc081`
- **Experience:** Leadership & Judgment
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

At Arc'teryx, the membership vision brought several experiences together, from registration and gear ownership to repairs and events. As we worked through the technical and operational dependencies, it became clear that treating everything as one launch created unnecessary risk.

I pushed for separating the benefits we could reliably deliver from capabilities that genuinely required the larger membership infrastructure. The Sperro SV release is an example: we coordinated a narrower set of benefits without suggesting the full membership program was already live.

That required explaining why a phased approach was better for customers, not just easier for the team. I'd rather make a clear tradeoff about scope than rush a release that promises an experience the service teams can't fulfil.

---

### 37. Tell me about a time you had competing priorities with Risk, Compliance or Engineering.

<a id="simplii-from-e09deee1-3efa-4774-9274-2f18848b739f-tell-me-ab"></a>

- **Import key:** `simplii-from-e09deee1-3efa-4774-9274-2f18848b739f`
- **Library ID:** `16da5085-1878-47fa-bcd8-67063062e82c`
- **Experience:** Leadership & Judgment
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

One example is the consumer cashback payout work at RBC.

From the customer perspective, the ideal experience was straightforward: a member had earned cashback and wanted to withdraw it without unnecessary friction.

But introducing a new consumer payout flow meant we also needed to satisfy banking risk, payment eligibility and financial operations requirements.

Those priorities weren't in conflict at a high level. Everyone wanted a reliable product. The challenge was translating them into a customer experience that was still simple.

I approached it by making the requirements and ownership explicit. We needed to understand which controls were mandatory, what could be handled by the underlying payments service and where the consumer experience needed additional logic.

For instance, eligibility and payment limits were part of the product design, not something we could leave until the end.

I also tried to keep the conversation focused on what we were trying to achieve rather than treating customer experience and risk as competing teams.

We launched the consumer payout capability and enabled more than $1 million in annualized withdrawals.

The experience reinforced that in financial services, good product management isn't about pushing past controls. It's about finding a solution that works within them without making the customer experience unnecessarily difficult.

---

### 38. Tell me about a time you said no to a stakeholder.

<a id="simplii-from-1c3ffb21-7fdd-46b3-832a-57c13b409a34-tell-me-ab"></a>

- **Import key:** `simplii-from-1c3ffb21-7fdd-46b3-832a-57c13b409a34`
- **Library ID:** `ce5494ec-503c-4396-8c27-91c05985f710`
- **Experience:** Leadership & Judgment
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

A useful example is the membership platform at Arc'teryx. There was a broad set of capabilities people wanted, but trying to make all of them part of the initial release created dependency and timing risk. My role was to help define what was essential to the customer proposition and what could reasonably be deferred. The difficult part wasn't saying that an idea lacked value; it was explaining why it shouldn't be part of the first version. I tried to make that a product decision with clear criteria rather than a personal disagreement. If the scope changes, everyone should understand what we're protecting and what trade-off we're accepting.

**Embedded follow-ups (4):**

- **Q:** Saying no

A useful example is the membership platform at Arc'teryx. There was a broad set of capabilities people wanted, but trying to make all of them part of the initial release created dependency and timing risk. My role was to help define what was essential to the customer proposition and what could reasonably be deferred. The difficult part wasn't saying that an idea lacked value; it was explaining why it shouldn't be part of the first version. I tried to make that a product decision with clear criteria rather than a personal disagreement. If the scope changes, everyone should understand what we're protecting and what trade-off we're accepting.

- **Q:** Scope cut

A useful example is the membership platform at Arc'teryx. There was a broad set of capabilities people wanted, but trying to make all of them part of the initial release created dependency and timing risk. My role was to help define what was essential to the customer proposition and what could reasonably be deferred. The difficult part wasn't saying that an idea lacked value; it was explaining why it shouldn't be part of the first version. I tried to make that a product decision with clear criteria rather than a personal disagreement. If the scope changes, everyone should understand what we're protecting and what trade-off we're accepting.

- **Q:** Difficult stakeholder

A useful example is the membership platform at Arc'teryx. There was a broad set of capabilities people wanted, but trying to make all of them part of the initial release created dependency and timing risk. My role was to help define what was essential to the customer proposition and what could reasonably be deferred. The difficult part wasn't saying that an idea lacked value; it was explaining why it shouldn't be part of the first version. I tried to make that a product decision with clear criteria rather than a personal disagreement. If the scope changes, everyone should understand what we're protecting and what trade-off we're accepting.

- **Q:** Pushback example

A useful example is the membership platform at Arc'teryx. There was a broad set of capabilities people wanted, but trying to make all of them part of the initial release created dependency and timing risk. My role was to help define what was essential to the customer proposition and what could reasonably be deferred. The difficult part wasn't saying that an idea lacked value; it was explaining why it shouldn't be part of the first version. I tried to make that a product decision with clear criteria rather than a personal disagreement. If the scope changes, everyone should understand what we're protecting and what trade-off we're accepting.

---

### 39. Tell me about your first disagreement with a new team's established strategy.

<a id="simplii-from-fef2b30f-d115-48fe-be83-cf89c80548de-tell-me-ab"></a>

- **Import key:** `simplii-from-fef2b30f-d115-48fe-be83-cf89c80548de`
- **Library ID:** `d57d602e-95e5-4f90-b8f4-1a7da805082b`
- **Experience:** Leadership & Judgment
- **Tier:** P2
- **Evidence:** resume_supported

**Answer (spoken):**

I wouldn't assume I'm right based on an outside view. I'd start by understanding what the team has already learned, what constraints they're operating under and why the existing plan made sense when it was created. If I still saw a gap, I'd frame it as a hypothesis and bring evidence, not just an opinion. I'd ask what would need to be true for us to change course and whether a small test could resolve the disagreement. I think you have to earn credibility by understanding the environment, but that doesn't mean avoiding difficult questions. The right balance is curiosity first, then a clear recommendation once you have enough context.

**Embedded follow-ups (3):**

- **Q:** Join new team and disagree

I wouldn't assume I'm right based on an outside view. I'd start by understanding what the team has already learned, what constraints they're operating under and why the existing plan made sense when it was created. If I still saw a gap, I'd frame it as a hypothesis and bring evidence, not just an opinion. I'd ask what would need to be true for us to change course and whether a small test could resolve the disagreement. I think you have to earn credibility by understanding the environment, but that doesn't mean avoiding difficult questions. The right balance is curiosity first, then a clear recommendation once you have enough context.

- **Q:** First 90 days conflict

I wouldn't assume I'm right based on an outside view. I'd start by understanding what the team has already learned, what constraints they're operating under and why the existing plan made sense when it was created. If I still saw a gap, I'd frame it as a hypothesis and bring evidence, not just an opinion. I'd ask what would need to be true for us to change course and whether a small test could resolve the disagreement. I think you have to earn credibility by understanding the environment, but that doesn't mean avoiding difficult questions. The right balance is curiosity first, then a clear recommendation once you have enough context.

- **Q:** New PM challenges direction

I wouldn't assume I'm right based on an outside view. I'd start by understanding what the team has already learned, what constraints they're operating under and why the existing plan made sense when it was created. If I still saw a gap, I'd frame it as a hypothesis and bring evidence, not just an opinion. I'd ask what would need to be true for us to change course and whether a small test could resolve the disagreement. I think you have to earn credibility by understanding the environment, but that doesn't mean avoiding difficult questions. The right balance is curiosity first, then a clear recommendation once you have enough context.

---

### 40. What do you do when a shared dependency is blocking your objective but the other PM has different priorities?

<a id="simplii-from-110a4074-4ba6-4eb9-9b8e-4a96b4e223e4-what-do-yo"></a>

- **Import key:** `simplii-from-110a4074-4ba6-4eb9-9b8e-4a96b4e223e4`
- **Library ID:** `a36f7962-4c1e-46f8-be01-b6ec4be2a8ab`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd start with the shared outcome and the actual cost of the dependency, rather than arguing whose roadmap is more important.

If Everyday Banking needs a money-movement change to improve primary-account adoption, I'd quantify the expected value, the customer impact of delay and the effort or risk involved. Then I'd work with the other PM to see whether there's a smaller shared milestone or sequencing option that helps both teams.

If we still can't resolve it, leadership should make an explicit portfolio trade-off with the facts available. I'd want clear ownership, dates and interim customer workarounds, not an indefinite dependency in a roadmap spreadsheet.

---

### 41. What do you do when requirements change after engineering has started?

<a id="simplii-jd-011-what-do-you-do-when-requirements-change-after"></a>

- **Import key:** `simplii-jd-011`
- **Library ID:** `b3bd3cd5-1864-4270-94d7-e426cf36aa75`
- **Experience:** Product leadership and digital banking
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

First I would find out what changed and why. A newly discovered compliance issue or customer-harm risk is different from an executive preference about copy.

I'd work with the team to understand the implementation impact, which parts are already committed, and whether we can split the change. Then I'd make the tradeoff explicit: accept the change and move the date, adjust scope, or defer it with a reason. I don't like pretending a new requirement comes at zero cost.

I'd update acceptance criteria and make sure QA and dependent teams understand the new behaviour. The outcome needs to remain clear even when the plan changes.

---

### 42. What if Engineering says your banking launch plan is unsafe but leadership wants the date?

<a id="simplii-from-77caa5b4-817d-47b3-9569-366aa012daf6-what-if-en"></a>

- **Import key:** `simplii-from-77caa5b4-817d-47b3-9569-366aa012daf6`
- **Library ID:** `8d62085d-d097-4a3f-baa6-10e7a6828873`
- **Experience:** Career & Product Experience
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd want to understand the specific failure mode before turning it into a date negotiation. Is the concern data integrity, double payment, reconciliation, untested load or an incomplete operational process?

I'd bring the engineering owner and relevant controls teams together to define the minimum safe conditions for launch. Then I'd give leadership clear choices: reduce scope, stage rollout, change sequencing or move the date, with the risks of each option visible.

A date can be a business commitment, but it doesn't make an unsafe money-movement path safe. I'd rather explain the trade-off early than have customers discover it after launch.

---

### 43. What if leadership wants to optimize DAU but you believe retained deposits matter more?

<a id="simplii-from-868dbf79-c06d-4ed3-83c4-f001b12be2bf-what-if-le"></a>

- **Import key:** `simplii-from-868dbf79-c06d-4ed3-83c4-f001b12be2bf`
- **Library ID:** `99916d38-7d95-471e-96bd-668b9a3dfaca`
- **Experience:** Leadership & Judgment
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd start by understanding why DAU has become the priority.

It may be serving as a proxy for engagement, or there may be a specific business concern behind it.

I wouldn't dismiss DAU. I'd look at whether it actually correlates with valuable banking behaviours.

If customers with higher engagement also tend to establish direct deposits, transact regularly and maintain balances, then it can be a useful leading indicator.

But if DAU is rising because people are checking a market feed while their banking activity remains unchanged, optimizing it may not help us achieve the everyday banking objective.

I'd bring that evidence into the discussion and recommend a measurement framework that includes both engagement and actual financial relationship depth.

That way we're not arguing about which metric sounds more important. We're aligning around the outcome the business wants.

---

### 44. What if leadership wants to ship five banking features at once?

<a id="simplii-from-1d491196-487e-4282-9a80-15e857190b75-what-if-le"></a>

- **Import key:** `simplii-from-1d491196-487e-4282-9a80-15e857190b75`
- **Library ID:** `a7a300c2-2670-4eec-bd3a-b179aacaa2e1`
- **Experience:** Leadership & Judgment
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd ask which customer or business outcome those five features are meant to change. If they're all important, that doesn't necessarily mean they all need to ship together. I'd map the dependencies, identify which capabilities are foundational and estimate where we have the strongest evidence of impact. In banking, I'd also distinguish controls and operational readiness from discretionary enhancements. Then I'd put forward a sequence with clear trade-offs: what we can commit to, what we're deferring and what signal would justify changing the order. I'd rather be accountable for a smaller number of meaningful outcomes than deliver a broad roadmap where no single experience works particularly well.

**Embedded follow-ups (4):**

- **Q:** Too many priorities

I'd ask which customer or business outcome those five features are meant to change. If they're all important, that doesn't necessarily mean they all need to ship together. I'd map the dependencies, identify which capabilities are foundational and estimate where we have the strongest evidence of impact. In banking, I'd also distinguish controls and operational readiness from discretionary enhancements. Then I'd put forward a sequence with clear trade-offs: what we can commit to, what we're deferring and what signal would justify changing the order. I'd rather be accountable for a smaller number of meaningful outcomes than deliver a broad roadmap where no single experience works particularly well.

- **Q:** Stakeholder pressure

I'd ask which customer or business outcome those five features are meant to change. If they're all important, that doesn't necessarily mean they all need to ship together. I'd map the dependencies, identify which capabilities are foundational and estimate where we have the strongest evidence of impact. In banking, I'd also distinguish controls and operational readiness from discretionary enhancements. Then I'd put forward a sequence with clear trade-offs: what we can commit to, what we're deferring and what signal would justify changing the order. I'd rather be accountable for a smaller number of meaningful outcomes than deliver a broad roadmap where no single experience works particularly well.

- **Q:** Roadmap overload

I'd ask which customer or business outcome those five features are meant to change. If they're all important, that doesn't necessarily mean they all need to ship together. I'd map the dependencies, identify which capabilities are foundational and estimate where we have the strongest evidence of impact. In banking, I'd also distinguish controls and operational readiness from discretionary enhancements. Then I'd put forward a sequence with clear trade-offs: what we can commit to, what we're deferring and what signal would justify changing the order. I'd rather be accountable for a smaller number of meaningful outcomes than deliver a broad roadmap where no single experience works particularly well.

- **Q:** Scope discipline

I'd ask which customer or business outcome those five features are meant to change. If they're all important, that doesn't necessarily mean they all need to ship together. I'd map the dependencies, identify which capabilities are foundational and estimate where we have the strongest evidence of impact. In banking, I'd also distinguish controls and operational readiness from discretionary enhancements. Then I'd put forward a sequence with clear trade-offs: what we can commit to, what we're deferring and what signal would justify changing the order. I'd rather be accountable for a smaller number of meaningful outcomes than deliver a broad roadmap where no single experience works particularly well.

---

### 45. What if Risk still says no after you've presented all your evidence?

<a id="simplii-from-458f82bd-542b-4331-92fb-d77bb3645d06-what-if-ri"></a>

- **Import key:** `simplii-from-458f82bd-542b-4331-92fb-d77bb3645d06`
- **Library ID:** `7fe19929-b644-44b5-b687-f433e97b3bfd`
- **Experience:** Career & Product Experience
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd make sure I understand whether it's a non-negotiable requirement, a decision within their mandate or a concern we might solve in another way.

If it's a hard control, the product needs to work within it. The question then is whether we can change the customer flow, add targeted verification or reduce scope without undermining the objective.

If it's a genuine judgment call, I'd document the options, impact and decision owner, and escalate through the agreed governance when appropriate. I wouldn't treat escalation as a way to bully Risk into approving a launch. In financial products, you need to build a working relationship where disagreement improves the decision.

---

### 46. What if Risk wants a step that cuts conversion by 20%?

<a id="simplii-from-9e7049a3-2fa7-4388-931c-875a7cc4d416-what-if-ri"></a>

- **Import key:** `simplii-from-9e7049a3-2fa7-4388-931c-875a7cc4d416`
- **Library ID:** `0d73635c-53b8-49c8-831a-af7cd43196c2`
- **Experience:** Leadership & Judgment
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd first understand whether the step is legally required, required by bank policy, or simply one implementation option. If it's a mandatory control, removing it isn't on the table. But we can still explore where it appears, how we explain it, how often customers need to complete it and whether the technology can make it less frustrating. I'd look at the funnel to see exactly where customers struggle and work with Risk and Design on alternatives that preserve the control. I'd also quantify the business impact so everyone understands the trade-off. The goal isn't to win an argument against Risk. It's to create the best compliant customer experience we can.

**Embedded follow-ups (4):**

- **Q:** Risk versus conversion

I'd first understand whether the step is legally required, required by bank policy, or simply one implementation option. If it's a mandatory control, removing it isn't on the table. But we can still explore where it appears, how we explain it, how often customers need to complete it and whether the technology can make it less frustrating. I'd look at the funnel to see exactly where customers struggle and work with Risk and Design on alternatives that preserve the control. I'd also quantify the business impact so everyone understands the trade-off. The goal isn't to win an argument against Risk. It's to create the best compliant customer experience we can.

- **Q:** Compliance friction

I'd first understand whether the step is legally required, required by bank policy, or simply one implementation option. If it's a mandatory control, removing it isn't on the table. But we can still explore where it appears, how we explain it, how often customers need to complete it and whether the technology can make it less frustrating. I'd look at the funnel to see exactly where customers struggle and work with Risk and Design on alternatives that preserve the control. I'd also quantify the business impact so everyone understands the trade-off. The goal isn't to win an argument against Risk. It's to create the best compliant customer experience we can.

- **Q:** Mandatory KYC step

I'd first understand whether the step is legally required, required by bank policy, or simply one implementation option. If it's a mandatory control, removing it isn't on the table. But we can still explore where it appears, how we explain it, how often customers need to complete it and whether the technology can make it less frustrating. I'd look at the funnel to see exactly where customers struggle and work with Risk and Design on alternatives that preserve the control. I'd also quantify the business impact so everyone understands the trade-off. The goal isn't to win an argument against Risk. It's to create the best compliant customer experience we can.

- **Q:** Security trade-off

I'd first understand whether the step is legally required, required by bank policy, or simply one implementation option. If it's a mandatory control, removing it isn't on the table. But we can still explore where it appears, how we explain it, how often customers need to complete it and whether the technology can make it less frustrating. I'd look at the funnel to see exactly where customers struggle and work with Risk and Design on alternatives that preserve the control. I'd also quantify the business impact so everyone understands the trade-off. The goal isn't to win an argument against Risk. It's to create the best compliant customer experience we can.

---

### 47. What if someone fails identity verification while opening a Simplii account?

<a id="simplii-from-cdc38655-878f-4b7f-a49d-109f3b69125e-what-if-so"></a>

- **Import key:** `simplii-from-cdc38655-878f-4b7f-a49d-109f3b69125e`
- **Library ID:** `4d2ab3c2-7bb2-44fd-905f-5d134c340999`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd separate a genuine risk outcome from a customer who simply made an input error or couldn't complete the available verification method. The product should explain the next permissible step without disclosing fraud thresholds or weakening controls.

I'd work with Risk and operations to map retry limits, alternative verification routes where available, accessibility concerns and safe escalation. I'd measure false rejection signals and abandonment alongside fraud and compliance outcomes.

I'd never promise approval or suggest bypassing controls. It's about making a regulated decision understandable and helping legitimate customers recover when there is an allowed path.

---

### 48. What if the team ships a feature on time, but adoption is poor?

<a id="simplii-from-4671a4a2-6cdf-4a6a-ad67-48ff291ca2dc-what-if-th"></a>

- **Import key:** `simplii-from-4671a4a2-6cdf-4a6a-ad67-48ff291ca2dc`
- **Library ID:** `b863ded4-54b0-48c1-a14f-8b7e96fdfd3f`
- **Experience:** Leadership & Judgment
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I wouldn't treat delivery as the final measure of success.

First, I'd want to understand whether the feature reached the intended audience and whether customers understood it.

Low adoption can mean several things. The problem may not have been important enough, the solution may be difficult to discover, or the experience may introduce too much friction.

I'd examine the funnel and speak with customers before deciding whether to invest further.

If the feature is solving a real problem but has usability issues, we'd iterate.

If the underlying customer need isn't strong enough, I'd be willing to stop investing in it.

I think that distinction matters at a senior level. Owning a product outcome also means recognizing when something isn't producing enough value to justify continued investment.

---

### 49. What is the difference between KYC, AML monitoring and transaction fraud prevention?

<a id="simplii-from-ba4861ca-9dc4-4514-9fd9-1d2ec6edb13c-what-is-th"></a>

- **Import key:** `simplii-from-ba4861ca-9dc4-4514-9fd9-1d2ec6edb13c`
- **Library ID:** `621403df-44f1-47fb-8c4e-d165e25dee17`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I think of them as related but different controls. KYC is about identifying and understanding the customer and meeting applicable onboarding requirements. AML monitoring looks for patterns and activity that require review under financial-crime controls. Transaction fraud prevention focuses on whether a specific action appears unauthorized or deceptive.

They share data but aren't interchangeable. A customer can be legitimately onboarded and still experience an account takeover or suspicious payment attempt.

As a PM, I'd work with the right control owners to design clear workflows and measure legitimate-customer friction and false positives, while keeping mandatory decisions with the regulated risk and compliance teams.

---

### 50. What is your biggest weakness as a product leader?

<a id="simplii-from-39a0bcf9-7d01-4cde-8da4-4ff893da44b3-what-is-yo"></a>

- **Import key:** `simplii-from-39a0bcf9-7d01-4cde-8da4-4ff893da44b3`
- **Library ID:** `e1c81e50-0ca1-4e2d-8620-aeaabebac563`
- **Experience:** Leadership & Judgment
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

Earlier in my career I sometimes spent too much time trying to resolve every open question before taking a recommendation forward. I like understanding the data and technical implications, which is useful, but it can slow momentum if you treat every uncertainty as equally important. I've become better at separating decisions that need more evidence from those we can make reversibly and learn from. Now I try to be clear about the level of confidence we need, the cost of waiting and what we'd monitor after the decision. I still care about rigor; I'm just more deliberate about applying it where it matters.

**Embedded follow-ups (4):**

- **Q:** Weakness

Earlier in my career I sometimes spent too much time trying to resolve every open question before taking a recommendation forward. I like understanding the data and technical implications, which is useful, but it can slow momentum if you treat every uncertainty as equally important. I've become better at separating decisions that need more evidence from those we can make reversibly and learn from. Now I try to be clear about the level of confidence we need, the cost of waiting and what we'd monitor after the decision. I still care about rigor; I'm just more deliberate about applying it where it matters.

- **Q:** Development area

Earlier in my career I sometimes spent too much time trying to resolve every open question before taking a recommendation forward. I like understanding the data and technical implications, which is useful, but it can slow momentum if you treat every uncertainty as equally important. I've become better at separating decisions that need more evidence from those we can make reversibly and learn from. Now I try to be clear about the level of confidence we need, the cost of waiting and what we'd monitor after the decision. I still care about rigor; I'm just more deliberate about applying it where it matters.

- **Q:** Self-awareness

Earlier in my career I sometimes spent too much time trying to resolve every open question before taking a recommendation forward. I like understanding the data and technical implications, which is useful, but it can slow momentum if you treat every uncertainty as equally important. I've become better at separating decisions that need more evidence from those we can make reversibly and learn from. Now I try to be clear about the level of confidence we need, the cost of waiting and what we'd monitor after the decision. I still care about rigor; I'm just more deliberate about applying it where it matters.

- **Q:** Improvement

Earlier in my career I sometimes spent too much time trying to resolve every open question before taking a recommendation forward. I like understanding the data and technical implications, which is useful, but it can slow momentum if you treat every uncertainty as equally important. I've become better at separating decisions that need more evidence from those we can make reversibly and learn from. Now I try to be clear about the level of confidence we need, the cost of waiting and what we'd monitor after the decision. I still care about rigor; I'm just more deliberate about applying it where it matters.

---

### 51. What should happen if someone loses their phone and tries to access their bank account?

<a id="simplii-from-6ffb405d-688b-433e-87c3-a7d992430bad-what-shoul"></a>

- **Import key:** `simplii-from-6ffb405d-688b-433e-87c3-a7d992430bad`
- **Library ID:** `e41cbff6-9712-4802-a2fc-0439f03d34ba`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd separate account recovery from payment authorization. Someone who has lost their phone needs a way back in, but that is also a moment when an attacker might impersonate them.

I'd work with identity and security teams on a recovery path with appropriate alternative verification, additional checks when credentials or devices change, and strong restrictions around sensitive actions until the account is trusted again.

I'd also measure recovery success, time to regain access and fraud linked to recovery flows. Fast recovery is valuable, but it can't be so easy that changing devices becomes a shortcut around security controls.

---

### 52. What would the MVP of a payroll-switching feature actually contain?

<a id="simplii-from-8ba596cd-8c2c-456e-bf5e-0681333ab61a-what-would"></a>

- **Import key:** `simplii-from-8ba596cd-8c2c-456e-bf5e-0681333ab61a`
- **Library ID:** `3d14e3f4-4472-41ef-b54b-a3831cd60684`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd define the smallest end-to-end journey that helps an eligible customer move income safely. That could include clear account details, simple employer instructions or supported switching assistance, confirmation of what the customer submitted and a way to verify the first successful deposit.

I'd also make the failure and support paths part of the MVP, not phase-two surprises. Customers need to understand what is and isn't confirmed, and what to do if their next paycheque doesn't arrive.

I wouldn't start with every employer integration. I'd choose a segment with a credible route to adoption and measure sustained deposits and support burden after the first cycle.

---

### 53. What would you do if a new AI feature gave customers incorrect financial advice?

<a id="simplii-from-e4952adf-c7af-45fb-955e-169fc91e2f7d-what-would"></a>

- **Import key:** `simplii-from-e4952adf-c7af-45fb-955e-169fc91e2f7d`
- **Library ID:** `f723e54f-92d4-41fe-8486-857bfbf43dc6`
- **Experience:** Leadership & Judgment
- **Tier:** P2
- **Evidence:** resume_supported

**Answer (spoken):**

I'd first assess whether customers were exposed to harmful or misleading recommendations and involve the appropriate product, risk and compliance teams. Depending on severity, I'd disable or constrain the feature while we investigate. Then I'd ask whether we allowed the model to make claims beyond what the underlying data could support, whether the interface made uncertainty clear and whether our evaluation covered realistic failure cases. I would prefer an assistant grounded in known account information and clear educational explanations over one that confidently tells customers what to do with their money. A financial product has to earn trust through accuracy and restraint, not just an impressive conversation.

**Embedded follow-ups (4):**

- **Q:** AI hallucination

I'd first assess whether customers were exposed to harmful or misleading recommendations and involve the appropriate product, risk and compliance teams. Depending on severity, I'd disable or constrain the feature while we investigate. Then I'd ask whether we allowed the model to make claims beyond what the underlying data could support, whether the interface made uncertainty clear and whether our evaluation covered realistic failure cases. I would prefer an assistant grounded in known account information and clear educational explanations over one that confidently tells customers what to do with their money. A financial product has to earn trust through accuracy and restraint, not just an impressive conversation.

- **Q:** Financial AI risk

I'd first assess whether customers were exposed to harmful or misleading recommendations and involve the appropriate product, risk and compliance teams. Depending on severity, I'd disable or constrain the feature while we investigate. Then I'd ask whether we allowed the model to make claims beyond what the underlying data could support, whether the interface made uncertainty clear and whether our evaluation covered realistic failure cases. I would prefer an assistant grounded in known account information and clear educational explanations over one that confidently tells customers what to do with their money. A financial product has to earn trust through accuracy and restraint, not just an impressive conversation.

- **Q:** Model safety

I'd first assess whether customers were exposed to harmful or misleading recommendations and involve the appropriate product, risk and compliance teams. Depending on severity, I'd disable or constrain the feature while we investigate. Then I'd ask whether we allowed the model to make claims beyond what the underlying data could support, whether the interface made uncertainty clear and whether our evaluation covered realistic failure cases. I would prefer an assistant grounded in known account information and clear educational explanations over one that confidently tells customers what to do with their money. A financial product has to earn trust through accuracy and restraint, not just an impressive conversation.

- **Q:** Financial wellness assistant

I'd first assess whether customers were exposed to harmful or misleading recommendations and involve the appropriate product, risk and compliance teams. Depending on severity, I'd disable or constrain the feature while we investigate. Then I'd ask whether we allowed the model to make claims beyond what the underlying data could support, whether the interface made uncertainty clear and whether our evaluation covered realistic failure cases. I would prefer an assistant grounded in known account information and clear educational explanations over one that confidently tells customers what to do with their money. A financial product has to earn trust through accuracy and restraint, not just an impressive conversation.

---

### 54. What would you do if customer research supports a feature but post-launch data contradicts it?

<a id="simplii-jd-017-what-would-you-do-if-customer-research-suppor"></a>

- **Import key:** `simplii-jd-017`
- **Library ID:** `04831833-59e9-40b3-a3ee-2eec61969dbe`
- **Experience:** Product leadership and digital banking
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd separate three possibilities: the measurement is wrong, the execution failed, or the original hypothesis was wrong. I'd verify exposure and instrumentation first, because bad measurement can send a team into unnecessary redesigns. Then I'd segment the results and compare what customers did with what we heard in research.



If people clearly need the capability but can't discover or complete it, I'd test a targeted fix. If they can use it but aren't getting value, I'd revisit the problem itself. And if the evidence still doesn't support the investment, I'd stop. I don't see reversing a product decision as failure; continuing to defend it without evidence is the bigger mistake.

---

### 55. What would you do if Engineering said your top feature was six months of work?

<a id="simplii-from-0f4d097c-a03a-4123-9e70-37c642139843-what-would"></a>

- **Import key:** `simplii-from-0f4d097c-a03a-4123-9e70-37c642139843`
- **Library ID:** `a2930228-6118-4b5a-8590-a3a6101826cb`
- **Experience:** Leadership & Judgment
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

First I'd try to understand what's driving the estimate. Is it foundational architecture, data quality, dependency risk or simply the size of the proposed solution? Then I'd step back to the customer problem and ask what the smallest useful outcome would be. Sometimes we can change the scope, test a manual or rules-based approach, or sequence the foundational work. Other times the estimate is telling us the platform needs investment before the feature makes sense. I don't want Engineering to become an order-taking function, and I also don't want 'it's hard' to end the product discussion. The goal is to make the trade-off visible and choose intentionally.

**Embedded follow-ups (4):**

- **Q:** High engineering estimate

First I'd try to understand what's driving the estimate. Is it foundational architecture, data quality, dependency risk or simply the size of the proposed solution? Then I'd step back to the customer problem and ask what the smallest useful outcome would be. Sometimes we can change the scope, test a manual or rules-based approach, or sequence the foundational work. Other times the estimate is telling us the platform needs investment before the feature makes sense. I don't want Engineering to become an order-taking function, and I also don't want 'it's hard' to end the product discussion. The goal is to make the trade-off visible and choose intentionally.

- **Q:** Team says no

First I'd try to understand what's driving the estimate. Is it foundational architecture, data quality, dependency risk or simply the size of the proposed solution? Then I'd step back to the customer problem and ask what the smallest useful outcome would be. Sometimes we can change the scope, test a manual or rules-based approach, or sequence the foundational work. Other times the estimate is telling us the platform needs investment before the feature makes sense. I don't want Engineering to become an order-taking function, and I also don't want 'it's hard' to end the product discussion. The goal is to make the trade-off visible and choose intentionally.

- **Q:** Scope negotiation

First I'd try to understand what's driving the estimate. Is it foundational architecture, data quality, dependency risk or simply the size of the proposed solution? Then I'd step back to the customer problem and ask what the smallest useful outcome would be. Sometimes we can change the scope, test a manual or rules-based approach, or sequence the foundational work. Other times the estimate is telling us the platform needs investment before the feature makes sense. I don't want Engineering to become an order-taking function, and I also don't want 'it's hard' to end the product discussion. The goal is to make the trade-off visible and choose intentionally.

- **Q:** Discovery spike

First I'd try to understand what's driving the estimate. Is it foundational architecture, data quality, dependency risk or simply the size of the proposed solution? Then I'd step back to the customer problem and ask what the smallest useful outcome would be. Sometimes we can change the scope, test a manual or rules-based approach, or sequence the foundational work. Other times the estimate is telling us the platform needs investment before the feature makes sense. I don't want Engineering to become an order-taking function, and I also don't want 'it's hard' to end the product discussion. The goal is to make the trade-off visible and choose intentionally.

---

### 56. What would you do if post-launch data contradicts the user research that justified the feature?

<a id="simplii-from-48f67960-28cb-4d6b-b863-e7cfe2c1ca71-what-would"></a>

- **Import key:** `simplii-from-48f67960-28cb-4d6b-b863-e7cfe2c1ca71`
- **Library ID:** `8e7db533-7a3e-41d0-bec7-8abd16b4bf1f`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd treat that as an opportunity to learn which assumption was wrong. Research can accurately describe customer frustration while still failing to predict whether a particular solution changes behaviour.

I'd check whether the target segment was actually reached, whether the feature worked as intended and whether the metric captured the job we hoped to improve. I'd also follow up with customers who tried it and those who ignored it.

Depending on the evidence, I might improve discoverability, change the workflow, test a narrower segment or stop investing. I wouldn't defend the original research or the feature just because we'd already committed to it.

---

### 57. What would you tell customers if a major banking partner was down and you didn't know the restoration time?

<a id="simplii-from-ab5294e4-b011-43a7-8cb2-432d84014ec7-what-would"></a>

- **Import key:** `simplii-from-ab5294e4-b011-43a7-8cb2-432d84014ec7`
- **Library ID:** `f13eb4d9-13b3-48fb-925e-c277c4c97fc8`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd communicate the confirmed impact, the affected journeys and the next planned update without inventing a recovery estimate. It's tempting to say 'we'll be back shortly,' but that can undermine trust if we don't know.

I'd coordinate with incident command and Support so every channel tells the same story. If there's a safe alternative path for customers, we'd explain it clearly without encouraging repeated submissions that could duplicate payments.

Once service returns, we'd verify financial consistency and any unresolved transactions before announcing that everything is complete. Reliability includes honest status communication and a real recovery process, not just an uptime banner.

---

### 58. What would your launch-readiness checklist include for an everyday-banking feature?

<a id="simplii-from-606fd4d4-8492-40ac-b65f-099d93621451-what-would"></a>

- **Import key:** `simplii-from-606fd4d4-8492-40ac-b65f-099d93621451`
- **Library ID:** `15507bb8-6db1-4b04-8509-615fbb7dff05`
- **Experience:** Career & Product Experience
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd want explicit ownership and evidence across the customer journey, integration, risk controls and operations—not just a feature checklist.

For a money-movement feature, that means the happy path, authorization, exception states, transaction tracing, reconciliations, support training, monitoring and rollback or containment procedures. I'd also check that customer-facing claims are accurate about timing and availability.

I'd run realistic failure scenarios, confirm launch guardrails with the control owners and stage exposure where possible. The release decision should answer whether we can operate the experience safely when things go wrong, not simply whether the UI works in a demo.

---

### 59. What's one product opinion you hold strongly that others might disagree with?

<a id="simplii-from-2b7b68cd-d7ae-4358-b609-405c36f1f6b6-what-s-one"></a>

- **Import key:** `simplii-from-2b7b68cd-d7ae-4358-b609-405c36f1f6b6`
- **Library ID:** `de43f0bd-a74f-4313-8354-9fd587be24c7`
- **Experience:** Leadership & Judgment
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I think financial products sometimes overvalue engagement for its own sake. A customer opening an app more often isn't necessarily having a better experience. In some cases, the best product is one that makes an important task so dependable that the customer doesn't need to think about it. I still care about engagement metrics, but I'd rather optimize for successfully received paycheques, payments completed correctly and better financial decisions than extra sessions. The interesting part is finding a measurement system that recognizes that value even when it doesn't show up as more screen time.

**Embedded follow-ups (4):**

- **Q:** Contrarian view

I think financial products sometimes overvalue engagement for its own sake. A customer opening an app more often isn't necessarily having a better experience. In some cases, the best product is one that makes an important task so dependable that the customer doesn't need to think about it. I still care about engagement metrics, but I'd rather optimize for successfully received paycheques, payments completed correctly and better financial decisions than extra sessions. The interesting part is finding a measurement system that recognizes that value even when it doesn't show up as more screen time.

- **Q:** Product philosophy

I think financial products sometimes overvalue engagement for its own sake. A customer opening an app more often isn't necessarily having a better experience. In some cases, the best product is one that makes an important task so dependable that the customer doesn't need to think about it. I still care about engagement metrics, but I'd rather optimize for successfully received paycheques, payments completed correctly and better financial decisions than extra sessions. The interesting part is finding a measurement system that recognizes that value even when it doesn't show up as more screen time.

- **Q:** Strong opinion

I think financial products sometimes overvalue engagement for its own sake. A customer opening an app more often isn't necessarily having a better experience. In some cases, the best product is one that makes an important task so dependable that the customer doesn't need to think about it. I still care about engagement metrics, but I'd rather optimize for successfully received paycheques, payments completed correctly and better financial decisions than extra sessions. The interesting part is finding a measurement system that recognizes that value even when it doesn't show up as more screen time.

- **Q:** Radical candor

I think financial products sometimes overvalue engagement for its own sake. A customer opening an app more often isn't necessarily having a better experience. In some cases, the best product is one that makes an important task so dependable that the customer doesn't need to think about it. I still care about engagement metrics, but I'd rather optimize for successfully received paycheques, payments completed correctly and better financial decisions than extra sessions. The interesting part is finding a measurement system that recognizes that value even when it doesn't show up as more screen time.

---

### 60. When would you shut down a feature your own team spent six months building?

<a id="simplii-from-1de87c3a-d693-419c-9ded-b76154af230a-when-would"></a>

- **Import key:** `simplii-from-1de87c3a-d693-419c-9ded-b76154af230a`
- **Library ID:** `a3807c53-5103-480c-9882-77c96ff6f083`
- **Experience:** Career & Product Experience
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd separate sunk cost from future value. Six months of work tells us what we've invested, but it doesn't by itself justify another six months.

I'd examine whether the feature solves a meaningful customer problem, whether adoption and quality are improving, whether the economics work and what we'd give up by continuing. Sometimes a contained iteration or repositioning test is appropriate. Sometimes the better decision is to stop.

I'd also consider contractual, operational and customer obligations before shutting anything off. I'd explain the decision to the team through what we've learned and where their effort will create more value, rather than framing it as their work having been wasted.

---

### 61. Why should we hire you instead of someone with direct core-banking experience?

<a id="simplii-from-56065bcd-e97e-4d82-ac21-e35a44296ae7-why-should"></a>

- **Import key:** `simplii-from-56065bcd-e97e-4d82-ac21-e35a44296ae7`
- **Library ID:** `f299ad67-b1a3-4815-a20b-be3dda974a14`
- **Experience:** Leadership & Judgment
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

Someone with direct core-banking experience would bring useful domain knowledge. I'd want that expertise on the team, and I wouldn't claim to replace it.

What I bring is a combination of related financial-product experience and end-to-end product practice. I worked on consumer payouts and payment operations at RBC, acquisition and lifecycle economics at HBC, and co-branded financial-product funnels at Aeroplan. At Arc'teryx, I also had to turn a broad strategy into a scoped product and an investment decision.

So I can work comfortably across customer research, analytics, commercial tradeoffs and engineering detail. I'd get up to speed on Simplii's specific platforms, but I wouldn't be learning from scratch how to manage a financial customer journey or make a regulated experience dependable.

---

### 62. Would you delay launch over a 0.5% payment failure rate?

<a id="simplii-from-17154883-f321-4b28-bee5-6fa80de879db-would-you-"></a>

- **Import key:** `simplii-from-17154883-f321-4b28-bee5-6fa80de879db`
- **Library ID:** `61c08831-de35-42c7-8fa6-6fd116f1a88d`
- **Experience:** Leadership & Judgment
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I wouldn't decide based on that number in isolation. I'd want to know the baseline, the rail, the type of failures, who is affected, whether funds are at risk and whether customers can recover. A half-percent failure rate could be unacceptable for a critical flow, particularly if failures are silent or lead to duplicate payments. I'd also need to know the volume and severity of the incidents. We'd agree on launch criteria with Engineering, Risk and Operations ahead of time, rather than inventing the threshold during the go/no-go meeting. The decision should be grounded in customer harm and operational readiness, not just the aggregate percentage.

**Embedded follow-ups (4):**

- **Q:** Reliability threshold

I wouldn't decide based on that number in isolation. I'd want to know the baseline, the rail, the type of failures, who is affected, whether funds are at risk and whether customers can recover. A half-percent failure rate could be unacceptable for a critical flow, particularly if failures are silent or lead to duplicate payments. I'd also need to know the volume and severity of the incidents. We'd agree on launch criteria with Engineering, Risk and Operations ahead of time, rather than inventing the threshold during the go/no-go meeting. The decision should be grounded in customer harm and operational readiness, not just the aggregate percentage.

- **Q:** Go/no-go

I wouldn't decide based on that number in isolation. I'd want to know the baseline, the rail, the type of failures, who is affected, whether funds are at risk and whether customers can recover. A half-percent failure rate could be unacceptable for a critical flow, particularly if failures are silent or lead to duplicate payments. I'd also need to know the volume and severity of the incidents. We'd agree on launch criteria with Engineering, Risk and Operations ahead of time, rather than inventing the threshold during the go/no-go meeting. The decision should be grounded in customer harm and operational readiness, not just the aggregate percentage.

- **Q:** Failure rate acceptable

I wouldn't decide based on that number in isolation. I'd want to know the baseline, the rail, the type of failures, who is affected, whether funds are at risk and whether customers can recover. A half-percent failure rate could be unacceptable for a critical flow, particularly if failures are silent or lead to duplicate payments. I'd also need to know the volume and severity of the incidents. We'd agree on launch criteria with Engineering, Risk and Operations ahead of time, rather than inventing the threshold during the go/no-go meeting. The decision should be grounded in customer harm and operational readiness, not just the aggregate percentage.

- **Q:** Launch risk

I wouldn't decide based on that number in isolation. I'd want to know the baseline, the rail, the type of failures, who is affected, whether funds are at risk and whether customers can recover. A half-percent failure rate could be unacceptable for a critical flow, particularly if failures are silent or lead to duplicate payments. I'd also need to know the volume and severity of the incidents. We'd agree on launch criteria with Engineering, Risk and Operations ahead of time, rather than inventing the threshold during the go/no-go meeting. The decision should be grounded in customer harm and operational readiness, not just the aggregate percentage.

---

### 63. Would you use screen scraping or customer-permissioned banking APIs for account aggregation?

<a id="simplii-from-c6aa4266-ebca-41df-a32b-99cba4676ffd-would-you-"></a>

- **Import key:** `simplii-from-c6aa4266-ebca-41df-a32b-99cba4676ffd`
- **Library ID:** `d84570be-7eb6-42d6-a654-a06e4230a071`
- **Experience:** Career & Product Experience
- **Tier:** P2
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd start with the coverage and reliability required for the customer job, then assess the actual data-access methods available in Canada and the bank connections we're targeting.

Where secure permissioned APIs are available, they can provide clearer access control and revocation than sharing credentials. But I'd still validate data freshness, completeness, authentication journeys and vendor operations rather than assuming an API solves the product problem automatically.

I'd involve Security and Privacy early, show customers what they're connecting and how to disconnect, and never suggest that a linked account gives us a complete or always-current view of their finances.

---

## People Leadership & Direct Reports

<a id="people-leadership-direct-reports"></a>

### 1. Did you directly manage engineers at Arc'teryx?

<a id="simplii-pl-06-did-you-directly-manage-engineers-at-arc-teryx"></a>

- **Import key:** `simplii-pl-06`
- **Library ID:** `8de0f21d-1677-4614-a254-dca3de68b974`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

No, not as their formal people manager. On CRM, the delivery group included three engineers, two offshore engineers, one offshore QA, one QA and one BA. I was the people manager for the BA and the QA, while the engineers had their own reporting managers. My responsibility with engineering was product direction, prioritization, requirements and decisions about scope. Their functional leaders owned their performance and technical career development. I worked closely with them, but I wouldn't conflate that with having them as direct reports.

---

### 2. Have you hired someone or handled termination? How would you approach it?

<a id="simplii-pl-20-have-you-hired-someone-or-handled-termination-"></a>

- **Import key:** `simplii-pl-20`
- **Library ID:** `5761a45d-2a2f-401b-b628-19b284cde88f`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P2
- **Evidence:** unverified_detail

**Answer (spoken):**

I've had formal people-management responsibilities, but I'd distinguish that from decisions I can specifically verify having owned around hiring or termination. For hiring, I'd define the actual capabilities the role needs, assess candidates consistently and involve the people who would work closely with them. For a serious performance issue, I'd focus on clear expectations, fair documented feedback and support, with HR involved at the right stage. Those decisions affect someone's career and the team's trust, so I wouldn't approach them casually or make claims about experience I haven't had.

---

### 3. Have you managed managers, or only individual contributors?

<a id="simplii-pl-04-have-you-managed-managers-or-only-individual-c"></a>

- **Import key:** `simplii-pl-04`
- **Library ID:** `23fb2bcd-1dc9-46b4-8b19-8abf62568831`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I've managed both individual contributors and a manager-level employee, although I wouldn't describe it as running a large management hierarchy. At HBC, I had one manager-level direct report. At Arc'teryx my direct reports included a project manager, business analysts and QA. When someone has more experience, I try to align on outcomes and decision rights rather than prescribe every step. I want them bringing a recommendation, not waiting for me to make all the calls. But I also keep accountability clear—especially where a decision affects commitments to other teams.

---

### 4. How did you demonstrate leadership at Air Canada and Aeroplan?

<a id="simplii-pl-08-how-did-you-demonstrate-leadership-at-air-cana"></a>

- **Import key:** `simplii-pl-08`
- **Library ID:** `5b279668-e4fe-4285-9ea5-454f885eca7c`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P1
- **Evidence:** unverified_detail

**Answer (spoken):**

At Aeroplan, a lot of the leadership was cross-functional and through partners. The digital card-acquisition work involved TD, CIBC and American Express, which meant different organizations with their own priorities and constraints. I needed to connect the commercial goal to the acquisition journey, work with stakeholders on the experience and help the teams make decisions that moved the work forward. The redesigned digital acquisition journey improved conversion by around 40%. That experience taught me that influence often depends less on reporting lines and more on knowing the problem, being prepared on the details and giving partners a clear reason to move in the same direction.

---

### 5. How did you lead a 15-person RBC squad with no direct reports?

<a id="simplii-pl-05-how-did-you-lead-a-15-person-rbc-squad-with-no"></a>

- **Import key:** `simplii-pl-05`
- **Library ID:** `524ce7d0-7bfb-47ff-9e0b-b0fc826f0a3d`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

At Avion, I was the product lead for a 15-person cross-functional squad including me, but I wasn't anyone's formal people manager. We had a BA, Scrum Master, two QA, two iOS developers, two Android developers, two front-end developers, one backend developer, a solution architect and two UX designers. My job was to make the customer problem and priorities clear, make product trade-offs and ensure the team understood the business and operational constraints. On cashback withdrawals, for example, the conversation couldn't stop at the user interface—we needed agreement on eligibility, payment states and exception handling. I relied on the engineers and architect for technical design. I owned the product decisions and helped the team work through the dependencies, rather than directing how each specialist did their job.

**Embedded follow-ups (1):**

- **Q:** Have you managed managers, or only individual contributors?

I've managed both individual contributors and a manager-level employee, although I wouldn't describe it as running a large management hierarchy. At HBC, I had one manager-level direct report. At Arc'teryx my direct reports included a project manager, business analysts and QA. When someone has more experience, I try to align on outcomes and decision rights rather than prescribe every step. I want them bringing a recommendation, not waiting for me to make all the calls. But I also keep accountability clear—especially where a decision affects commitments to other teams.

---

### 6. How did you manage the manager-level employee at HBC?

<a id="simplii-pl-07-how-did-you-manage-the-manager-level-employee-"></a>

- **Import key:** `simplii-pl-07`
- **Library ID:** `ee5899c6-fd05-4d11-99c1-9d2937591402`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P1
- **Evidence:** unverified_detail

**Answer (spoken):**

At HBC, I directly managed a manager-level colleague while I was responsible for the wider Mastercard and growth agenda. I tried to be clear about what we were trying to achieve and where that person had room to make decisions, without turning every operational issue into an escalation. With someone experienced, I find the best use of one-on-one time is priorities, judgment calls, obstacles and development—not a status readout of every task. I still believe accountability matters, but it should come through clear expectations and follow-through, rather than close supervision.

---

### 7. How do you assess whether your direct reports are performing well?

<a id="simplii-pl-14-how-do-you-assess-whether-your-direct-reports-"></a>

- **Import key:** `simplii-pl-14`
- **Library ID:** `4c1e968f-ae8f-49f4-86cb-e1898198c4ef`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I wouldn't assess a BA, QA specialist and project manager with the same output metric. For a BA, I'd look at how well they clarify business rules, uncover dependencies and help the team make decisions. For QA, I'd look at judgment around coverage and risk, not just the number of tests run. For a project manager, I'd care about whether they're keeping the right people informed, anticipating risks and maintaining credible plans. Across all of them I'd look at collaboration, accountability and professional growth. Delivery results matter, but I wouldn't confuse counting tasks with measuring someone's contribution.

---

### 8. How do you balance product ownership with being a people manager?

<a id="simplii-pl-03-how-do-you-balance-product-ownership-with-bein"></a>

- **Import key:** `simplii-pl-03`
- **Library ID:** `6d66ba90-bf37-46b3-bd43-ed4696ab0f97`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I see them as related responsibilities, but I try not to confuse them. As the PM, I'm accountable for the problem we're solving, the prioritization and whether we're delivering customer value. As a people manager, I'm accountable for setting expectations, providing feedback and supporting someone's development. A project can run into a dependency outside a person's control, and that doesn't automatically mean they've underperformed. Equally, shipping on time doesn't tell you everything about how someone is developing. I'd have conversations about delivery and individual performance separately, while making sure people understand how their work connects to the product outcome.

---

### 9. How do you coach and develop direct reports?

<a id="simplii-pl-09-how-do-you-coach-and-develop-direct-reports"></a>

- **Import key:** `simplii-pl-09`
- **Library ID:** `fb5cea15-40c8-4dcc-a0d6-303700fbe1fa`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

I try to make development specific to the person's role and where they want to grow. At Arc'teryx, for example, the support a BA needs is different from what helps a QA specialist or project manager. With a BA, I might focus on getting more comfortable challenging unclear requirements. With QA, I'd look at identifying risks to the end-to-end customer journey, not just executing a test plan. With a project manager, it may be anticipating dependencies and escalating trade-offs early. I'd agree on one or two meaningful areas to build, give the person room to practise and revisit the progress regularly. The outcome I'm looking for is stronger independent judgment.

**Embedded follow-ups (1):**

- **Q:** How do you assess whether your direct reports are performing well?

I wouldn't assess a BA, QA specialist and project manager with the same output metric. For a BA, I'd look at how well they clarify business rules, uncover dependencies and help the team make decisions. For QA, I'd look at judgment around coverage and risk, not just the number of tests run. For a project manager, I'd care about whether they're keeping the right people informed, anticipating risks and maintaining credible plans. Across all of them I'd look at collaboration, accountability and professional growth. Delivery results matter, but I wouldn't confuse counting tasks with measuring someone's contribution.

---

### 10. How do you delegate without losing visibility?

<a id="simplii-pl-15-how-do-you-delegate-without-losing-visibility"></a>

- **Import key:** `simplii-pl-15`
- **Library ID:** `fe2ec484-e990-41ae-8d5f-1065937e306c`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I try to delegate a decision or an outcome, not just a list of tasks. If a project manager owns the delivery plan, they should have space to manage sequencing and follow-ups without checking with me on every step. What I'd agree up front is the outcome, the guardrails, key dependencies and when I expect escalation. That lets me stay close to material product risks without becoming a bottleneck. There is a difference between being informed and approving everything. If I'm still making every small call, I haven't really given that person ownership.

---

### 11. How do you handle conflict between QA and engineering?

<a id="simplii-pl-12-how-do-you-handle-conflict-between-qa-and-engi"></a>

- **Import key:** `simplii-pl-12`
- **Library ID:** `88745f0c-bc94-4812-8310-1da296b46d07`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd first separate an actual disagreement about the requirement from a disagreement about severity or ownership. A developer may believe a story is finished because the API and interface work as specified, while QA is seeing an exception where the customer could get stuck. I'd bring it back to the agreed customer outcome and acceptance criteria: what should happen, what can actually happen and how serious is the gap? Then we'd decide whether it's release-blocking, needs a narrow fix or can be documented and deferred. Because my CRM QA reported to me and the engineers didn't, I'd be particularly careful not to treat the QA position as automatically correct. The call should be based on evidence and customer risk.

---

### 12. How do you maintain morale when delivery pressure is high?

<a id="simplii-pl-19-how-do-you-maintain-morale-when-delivery-press"></a>

- **Import key:** `simplii-pl-19`
- **Library ID:** `85ae3f8d-5f95-46d5-9ba0-236cb674aaa6`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P1
- **Evidence:** rehearsal_framework

**Answer (spoken):**

First, I want the team to know what actually matters. If everything is labelled urgent, people end up switching constantly and the quality suffers. I'd work with stakeholders to make the trade-offs explicit and protect a realistic amount of work in flight. I'd also look at what we're doing to create our own pressure—late requirements, unresolved dependencies or commitments made without the team's input. I think people respond better to a difficult but credible plan than constant encouragement around an impossible deadline. My role is to give them context, remove obstacles and keep the work meaningful.

---

### 13. How do you manage an offshore or distributed team?

<a id="simplii-pl-13-how-do-you-manage-an-offshore-or-distributed-t"></a>

- **Import key:** `simplii-pl-13`
- **Library ID:** `0329abc8-e696-4a98-bba3-3302a1150335`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

At Arc'teryx CRM, we worked with two offshore engineers and an offshore QA as part of the broader team. The biggest risk in that setup is ambiguity becoming a day's delay because people don't share every working hour. I'd rather clarify the business rules and dependencies during refinement than leave them buried in a ticket. I also want decisions recorded clearly and enough overlap for the conversations that actually need to happen. I don't think the answer is more meetings. It's making it easier for people to keep moving independently and knowing when an issue needs an immediate conversation.

---

### 14. How would you manage an underperforming employee?

<a id="simplii-pl-10-how-would-you-manage-an-underperforming-employ"></a>

- **Import key:** `simplii-pl-10`
- **Library ID:** `40c45de4-0152-486b-bcd7-5c99c5c8f6e4`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I'd start by understanding the gap rather than assuming it's an effort problem. Is the expectation unclear? Is it a skill gap? Or are there dependencies or circumstances affecting delivery? Then I'd make the expectation concrete, explain the impact, agree what improvement looks like and set a reasonable check-in cadence. My job is to provide candid feedback and practical support, but also to be fair to the rest of the team. If progress wasn't happening, I'd follow the company's formal performance and HR processes. I think the worst outcome is letting someone discover months later that their manager had concerns they never discussed directly.

**Embedded follow-ups (1):**

- **Q:** Have you hired someone or handled termination? How would you approach it?

I've had formal people-management responsibilities, but I'd distinguish that from decisions I can specifically verify having owned around hiring or termination. For hiring, I'd define the actual capabilities the role needs, assess candidates consistently and involve the people who would work closely with them. For a serious performance issue, I'd focus on clear expectations, fair documented feedback and support, with HR involved at the right stage. Those decisions affect someone's career and the team's trust, so I wouldn't approach them casually or make claims about experience I haven't had.

---

### 15. Tell me about a time you gave difficult feedback.

<a id="simplii-pl-11-tell-me-about-a-time-you-gave-difficult-feedba"></a>

- **Import key:** `simplii-pl-11`
- **Library ID:** `9d4280e2-fc16-4acc-9011-24decaaf5af1`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P1
- **Evidence:** illustrative_scenario

**Answer (spoken):**

The way I'd approach difficult feedback is to start with a specific behaviour and its impact, rather than a judgment about the person. Say a BA is surfacing material requirements late in refinement. I'd explain what that does to engineering estimates, QA readiness and the team's ability to make a credible commitment. Then I'd ask what contributed to it—maybe the right stakeholders weren't involved early enough, or the story was treated as ready before the business rules were clear. We'd agree on a practical change, like earlier dependency review, and I'd follow up to see whether it worked. I want difficult feedback to leave someone with a clear path forward, not simply a feeling that they disappointed me.

---

### 16. Tell me about your people-management experience.

<a id="simplii-pl-01-tell-me-about-your-people-management-experienc"></a>

- **Import key:** `simplii-pl-01`
- **Library ID:** `bc4cded5-252f-495c-890c-9e5715b98f4f`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P0
- **Evidence:** rehearsal_framework

**Answer (spoken):**

I've had a mix of formal people management and broader product-team leadership. At Arc'teryx, on Membership, I directly managed a project manager and a business analyst. On CRM, I managed the BA and a QA specialist, while partnering with a larger engineering group whose engineers reported to their own people managers. At HBC, I also had a manager-level direct report. RBC was organized differently: I led product work within a 15-person cross-functional squad, including myself, but nobody in that squad reported to me as their people manager. I think both experiences matter. Managing people makes you accountable for how individuals develop and perform. Leading a product team means creating clarity and alignment even when you don't have formal authority over everyone involved.

**Embedded follow-ups (1):**

- **Q:** What's the difference between managing people and leading a product team?

People management is about helping individuals perform and grow. Product leadership is about getting a group with different expertise aligned on the right problem and making decisions that lead to customer value. They overlap, but one doesn't automatically imply the other. RBC is a good example: I led product work in a 15-person squad without formal direct reports. Arc'teryx added people-management accountability alongside the product remit. I enjoyed both. The distinction has made me more intentional about decision rights, feedback and how I work with functional leaders.

---

### 17. What would your direct reports say about your leadership style?

<a id="simplii-pl-17-what-would-your-direct-reports-say-about-your-"></a>

- **Import key:** `simplii-pl-17`
- **Library ID:** `270dc335-04fd-4c12-9b32-83b367a573b6`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P1
- **Evidence:** resume_supported

**Answer (spoken):**

I'd hope they'd say I'm clear about expectations, accessible when they need support and comfortable being challenged. I like people understanding the reason behind a decision, not just what to do next. I also want concerns raised early—even when the message isn't convenient—because that gives us a chance to solve the problem before it affects customers or the team. I probably have high expectations around ownership and follow-through, but I try to pair that with autonomy. I want people to feel they can bring a recommendation, not just a problem for me to solve.

---

### 18. What's the difference between managing people and leading a product team?

<a id="simplii-pl-16-what-s-the-difference-between-managing-people-"></a>

- **Import key:** `simplii-pl-16`
- **Library ID:** `fe0ab12a-8d31-492d-9d92-fb5e9dbda958`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

People management is about helping individuals perform and grow. Product leadership is about getting a group with different expertise aligned on the right problem and making decisions that lead to customer value. They overlap, but one doesn't automatically imply the other. RBC is a good example: I led product work in a 15-person squad without formal direct reports. Arc'teryx added people-management accountability alongside the product remit. I enjoyed both. The distinction has made me more intentional about decision rights, feedback and how I work with functional leaders.

---

### 19. What's your management philosophy?

<a id="simplii-pl-02-what-s-your-management-philosophy"></a>

- **Import key:** `simplii-pl-02`
- **Library ID:** `dfd5d624-673d-459a-9a2f-eefdee1ac43e`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

I try to give people clarity on the outcome and genuine ownership of how they get there. That means being explicit about priorities, the decisions they can make independently and when I expect them to raise something. I like regular one-on-ones and direct feedback, but I don't want someone checking with me on every detail. Different people need different support. A newer team member might need help structuring an approach, while an experienced BA or project manager may just need context and a sounding board. To me, good management is when the person gets stronger and more independent over time, not when the manager becomes indispensable.

**Embedded follow-ups (1):**

- **Q:** How do you maintain morale when delivery pressure is high?

First, I want the team to know what actually matters. If everything is labelled urgent, people end up switching constantly and the quality suffers. I'd work with stakeholders to make the trade-offs explicit and protect a realistic amount of work in flight. I'd also look at what we're doing to create our own pressure—late requirements, unresolved dependencies or commitments made without the team's input. I think people respond better to a difficult but credible plan than constant encouragement around an impossible deadline. My role is to give them context, remove obstacles and keep the work meaningful.

---

### 20. Why pursue a Senior PM role if you've already managed people?

<a id="simplii-pl-18-why-pursue-a-senior-pm-role-if-you-ve-already-"></a>

- **Import key:** `simplii-pl-18`
- **Library ID:** `776f1e70-c242-41bc-acc5-28747f0f6453`
- **Experience:** People Leadership & Direct Reports
- **Tier:** P0
- **Evidence:** resume_supported

**Answer (spoken):**

I don't see the number of direct reports as the measure of progression in product. I enjoy managing people, and it's made me more thoughtful about how teams work, but I'm also very comfortable in an individual-contributor product leadership role. What matters to me is the scope of the decisions, the complexity of the problems and whether I can have a meaningful impact. Simplii is interesting because the product touches how people manage and move money every day. The role seems close to discovery, prioritization and delivery, which is where I do some of my best work. I don't need a reporting hierarchy to find that challenging or rewarding.

---

## Other / Unsectioned

<a id="other-unsectioned"></a>

### 1. Arc'teryx — What was deliberately deferred, and what was approved before you left?

<a id="simplii-hp-05-arc-teryx-what-was-deliberately-deferred-and-w"></a>

- **Import key:** `simplii-hp-05`
- **Library ID:** `1420efb8-b78a-4265-8973-d42f903ea352`
- **Tier:** P1

**Answer (spoken):**

We had a broad membership ambition: engage people beyond the purchase through gear ownership, care, repair, trade-in and community. The useful product decision was not to force all of that into the first release.

My recommendation was a focused North America-first, web-first foundation. That let us concentrate on the core membership model—identity, eligibility, how a benefit is represented and who fulfils it—before expanding across every channel. The native app was a candidate for a later phase rather than a dependency for establishing the first member journey. We also revisited the breadth and cost of redemptions because an attractive proposition isn't useful if it creates an operating model we can't sustain.

By the time I left, I'd led the proposition, vendor evaluation, scope definition, stage-gate material and the investment case, around $5.2 million. The program was in planning and decision-making, not a fully launched membership experience. I'd distinguish a funded direction or stage-gate endorsement from an approved specification for every future perk.

---

### 2. Customers say bill-payment history is harder to find after the redesign. How would you address it?

<a id="simplii-panel-app-02-customers-say-bill-payment-history-is-h"></a>

- **Import key:** `simplii-panel-app-02`
- **Library ID:** `4f1e8575-564d-4db1-9ae6-8f7b7c051f52`
- **Tier:** P1

**Answer (spoken):**

I'd separate a missing capability from one that still exists but has become harder to discover. Several customers described needing extra taps to check whether a bill had already been paid. That sounds like a workflow problem, even if the underlying history is technically available.

I'd watch customers try three common tasks: find the last payment to a payee, confirm an upcoming scheduled payment and retrieve a reference number. Then I'd look at completion and time-to-answer across old and current experiences, alongside support contacts.

If the evidence supports it, the improvement might be quite focused: clear payment history from the payee screen, visible last-paid information and sensible links to upcoming payments. I also saw the October 16 update specifically improved payment history, so I'd first establish what it fixed and what customers still struggle with.

---

### 3. Define a metric precisely, including its numerator, denominator and time window.

<a id="simplii-panel-gap-05-define-a-metric-precisely-including-its"></a>

- **Import key:** `simplii-panel-gap-05`
- **Library ID:** `3b944ff0-0835-43e1-a831-f778c9f62b30`
- **Tier:** P1

**Answer (spoken):**

For an account activation initiative, I'd avoid measuring only accounts opened. I'd define something like 60-day meaningful activation: of the eligible new accounts opened in a given cohort, what percentage completed a qualifying customer-initiated transaction or recurring funding milestone within 60 days?

We'd have to decide upfront what qualifies, and exclude test accounts, rejected applications and transactions that don't demonstrate actual use. I'd inspect direct-deposit setup separately from a first successful payroll deposit, because setting up an instruction isn't the same as money arriving.

I'd look at this by acquisition channel and cohort, and compare against a baseline or a controlled experiment if feasible. Then I'd keep payment errors, complaints and suspicious activity as guardrails. The point is to define behaviour that reflects customer value, not find the most flattering denominator.

**Embedded follow-ups (1):**

- **Q:** Metrics — Give a rigorous numerator, denominator, window, segments and guardrail

If the outcome were making a new chequing account part of someone's financial routine, I'd define a 90-day recurring payroll adoption rate rather than just counting openings.

My denominator would be distinct eligible customers who opened a usable chequing account in a given acquisition cohort and whose full 90-day observation window has elapsed. The numerator would be customers in that cohort who received at least two qualifying income deposits across separate expected pay cycles during those 90 days. I'd keep setup intent or a single first deposit as earlier funnel milestones, not final adoption.

I'd segment the result by acquisition channel, offer exposure, new versus existing customer relationship and app version if the onboarding flow changed. I'd also compare like-for-like cohorts so a marketing campaign doesn't masquerade as a product improvement.

A key guardrail would be payment or payroll-related failures and complaints, with clear rates instead of raw counts. A conversion lift doesn't help if people struggle to receive or access their paycheque.

---

### 4. Delivery — Give an actual acceptance-criteria change after engineering or QA raised an issue.

<a id="simplii-hp-09-delivery-give-an-actual-acceptance-criteria-ch"></a>

- **Import key:** `simplii-hp-09`
- **Library ID:** `b80423b3-4ed5-4d4e-93a7-621ff1b6f488`
- **Tier:** P1

**Answer (spoken):**

One example of the sort of refinement that mattered in cashback withdrawals was the meaning of 'completed'. A simple initial story might say: when the payment API accepts the request, show the user that their withdrawal was successful.

The problem is that an accepted request is not necessarily a delivered payment. That's the kind of gap an engineer or QA should raise, because asynchronous processing and delayed confirmation create an intermediate state.

The better acceptance criteria distinguish receipt from completion: if the payment service acknowledges the instruction without a final outcome, show processing and retain the reference; if the result is uncertain after a timeout, don't encourage another payment instruction; and only show completion when the authoritative outcome confirms it.

I'd also make sure service and Finance can trace exceptions. It's not a flashy feature, but it changes whether the product gives a truthful answer about someone's money. That's why I want the BA, engineers and QA involved early rather than validating a happy path after the story is already built.

---

### 5. Describe a disagreement over a user story or acceptance criteria.

<a id="simplii-panel-gap-03-describe-a-disagreement-over-a-user-sto"></a>

- **Import key:** `simplii-panel-gap-03`
- **Library ID:** `c34099e8-30c9-4ef4-b733-27b36e13801d`
- **Tier:** P1

**Answer (spoken):**

In a payments journey, the wording of 'successful' can change the customer experience quite significantly. One detail I focused on in the Avion cashback withdrawal work was the difference between a payment request being accepted by a service and the payout actually being confirmed.

From the customer's perspective, those are not the same event. If the system is still processing, the story needs a pending state, an accurate next step and safeguards against duplicate requests. So the acceptance criteria need to cover timeouts, delayed responses and how service teams investigate an exception—not just the happy path where an API call succeeds.

That's the sort of detail I want to work through with engineering, a BA and QA before a sprint commitment. It's much cheaper to resolve ambiguity in refinement than after a customer thinks their money has disappeared.

**Embedded follow-ups (1):**

- **Q:** Delivery — Give an actual acceptance-criteria change after engineering or QA rai

One example of the sort of refinement that mattered in cashback withdrawals was the meaning of 'completed'. A simple initial story might say: when the payment API accepts the request, show the user that their withdrawal was successful.

The problem is that an accepted request is not necessarily a delivered payment. That's the kind of gap an engineer or QA should raise, because asynchronous processing and delayed confirmation create an intermediate state.

The better acceptance criteria distinguish receipt from completion: if the payment service acknowledges the instruction without a final outcome, show processing and retain the reference; if the result is uncertain after a timeout, don't encourage another payment instruction; and only show completion when the authoritative outcome confirms it.

I'd also make sure service and Finance can trace exceptions. It's not a flashy feature, but it changes whether the product gives a truthful answer about someone's money. That's why I want the BA, engineers and QA involved early rather than validating a happy path after the story is already built.

---

### 6. Describe a technical dependency or incident that forced you to change a delivery decision.

<a id="simplii-panel-gap-06-describe-a-technical-dependency-or-inci"></a>

- **Import key:** `simplii-panel-gap-06`
- **Library ID:** `6079b7ab-c81f-4adf-a76b-f46e64602e26`
- **Tier:** P1

**Answer (spoken):**

The RBC cashback withdrawal feature is an example of an underlying dependency shaping a product decision. We didn't own the enterprise payments service that would actually move the money. My team owned the consumer experience, but the end-to-end journey depended on service capabilities, eligibility rules, confirmation states and financial reconciliation outside our squad.

Rather than treating that dependency as something engineering could resolve at the end, I brought the service owners, Risk and Financial Operations into the work early. We had to define what the customer could safely initiate, what would happen when confirmation was delayed, and who owned an exception.

We adapted the existing enterprise capability rather than building a separate payments platform. That kept the work feasible, but it also meant the release scope had to respect the real operating model. I think that's important in a bank: you can be accountable for the customer journey without pretending you own every system behind it.

---

### 7. Discovery — When did evidence overturn a hypothesis you personally preferred?

<a id="simplii-hp-06-discovery-when-did-evidence-overturn-a-hypothe"></a>

- **Import key:** `simplii-hp-06`
- **Library ID:** `7d6708de-6e70-4480-a279-bfc4a29c5ebe`
- **Tier:** P1

**Answer (spoken):**

At HBC, my first instinct with the Mastercard funnel was that we probably had room to improve the quality of traffic entering the application. It was an acquisition product, and when you want more approved cardholders, more qualified starts looks like a logical place to begin.

But when we looked past starts into the application journey, it became clear that we were losing people who had already expressed strong intent. That changed how I thought about the opportunity. Spending more to bring someone into the same friction wasn't the best next move.

I shifted the focus toward the application experience with Neo—what information the customer expected, how they progressed into the partner's process and whether we were making a consequential step feel more complicated than it needed to be. That work was associated with about a 15% improvement in completed applications.

What I learned was to be willing to change the diagnosis, not just tune the execution. A plausible growth idea isn't necessarily the right constraint to attack.

---

### 8. HBC — Which step had the highest drop-off, what changed, and how did you measure the 15%?

<a id="simplii-hp-01-hbc-which-step-had-the-highest-drop-off-what-c"></a>

- **Import key:** `simplii-hp-01`
- **Library ID:** `76771138-9f99-416b-9bd0-aa3da9f07899`
- **Tier:** P1

**Answer (spoken):**

The important distinction at HBC was between getting someone interested in the Mastercard and getting an interested applicant through to submission. We had acquisition demand, but an application is a higher-friction decision: customers move from browsing an offer into providing sensitive information and going through a credit process owned by Neo.

I focused on that conversion journey with the partner team. We looked at where customers were exiting and what we could improve in the path from HBC's proposition into the credit application, rather than treating more acquisition spend as the answer. The outcome we reported was roughly a 15% improvement in completed applications.

I wouldn't attribute Neo's credit decisioning speed to that work. Their platform supported rapid decisions; our contribution was improving the experience leading up to a completed application. I'd also distinguish an increase in completion volume from a lift in completion rate—I don't want to give you an exact step-level figure or testing methodology from memory if I can't substantiate it.

---

### 9. How do you decide what goes into a sprint?

<a id="simplii-panel-bank-02-how-do-you-decide-what-goes-into-a-spr"></a>

- **Import key:** `simplii-panel-bank-02`
- **Library ID:** `8764407d-df29-4519-b4aa-defa892f348a`
- **Tier:** P1

**Answer (spoken):**

The backlog priority is my responsibility; the sprint commitment is something we make with the team. Before planning, I want the highest-value stories refined enough that engineering and QA understand the behaviour, dependencies and acceptance criteria.

In sprint planning we agree on a coherent sprint goal, look at the team's actual capacity and recent delivery pattern, and decide what can realistically be completed. I don't want five unrelated high-priority tickets just because each stakeholder said theirs was urgent.

If a production issue or a mandatory control change comes up, we discuss the impact openly and renegotiate scope. I'd rather have a smaller sprint goal we achieve than carry an unrealistic commitment and call that agility.

---

### 10. How do you develop a business case for a product improvement?

<a id="simplii-panel-bank-10-how-do-you-develop-a-business-case-for"></a>

- **Import key:** `simplii-panel-bank-10`
- **Library ID:** `11fd50b5-a492-4b21-98ef-1403a4cbc081`
- **Tier:** P1

**Answer (spoken):**

I'd quantify the current problem before jumping into the solution. How many customers experience it, how often, what does it cost them in time or confidence, and what is the commercial or operational effect for the bank?

Then I'd compare plausible interventions and distinguish what we know from what we're assuming. For a confusing bill-payment experience, there could be value in fewer failed tasks, fewer support contacts and better ongoing account usage. I'd estimate the upside, delivery effort and dependencies, but also be honest about the uncertainty.

The business case should help us decide whether to act and at what scale. It shouldn't be a polished way of defending a feature we already wanted to build.

---

### 11. How do you handle a live production problem that interrupts the roadmap?

<a id="simplii-panel-bank-12-how-do-you-handle-a-live-production-pr"></a>

- **Import key:** `simplii-panel-bank-12`
- **Library ID:** `6f2670f0-3b6d-404c-b532-63159678692a`
- **Tier:** P1

**Answer (spoken):**

If it affects access to money, payment accuracy or security, I treat it as an incident first and a roadmap issue second. Engineering and operations need to establish severity and scope. My role is to make sure the customer impact is understood, communications are accurate and the right business partners are involved.

We don't want to tell someone to retry a transaction when we can't confirm its status. Once we've stabilized the experience, I'd work through the root cause and prevention with the team, and replan the displaced product work transparently.

I'd also look beyond whether the service is back up. Time to resolution, affected customers, unresolved exceptions and repeat contacts tell us whether the issue was actually resolved for people.

---

### 12. How do you handle a mid-sprint requirement change?

<a id="simplii-panel-bank-08-how-do-you-handle-a-mid-sprint-require"></a>

- **Import key:** `simplii-panel-bank-08`
- **Library ID:** `01fcf213-b70f-4a2d-9fd6-c39a49fabbfa`
- **Tier:** P1

**Answer (spoken):**

First I'd distinguish a genuine new fact from a late preference. A legal or control issue that changes whether we can safely release is not the same as a stakeholder wanting a different layout.

I would take the change to engineering and QA, understand whether it puts the sprint goal at risk, and see whether there's a minimal compliant path or a sensible split. Then we'd agree what moves, who needs to approve the change and how tests or documentation are updated.

I'm comfortable changing the plan when the facts change. What I try to avoid is quietly expanding scope and pretending delivery time and quality won't be affected.

---

### 13. How do you handle multiple stakeholders who all say their request is urgent?

<a id="simplii-panel-bank-05-how-do-you-handle-multiple-stakeholder"></a>

- **Import key:** `simplii-panel-bank-05`
- **Library ID:** `e72e6ddf-8798-41d5-ad29-4e3e64f16b0b`
- **Tier:** P1

**Answer (spoken):**

I ask what happens if we don't do each item in the next month or quarter. That usually gets us past labels like 'critical' and into consequences: customer harm, a regulatory deadline, lost revenue, an operational burden or simply a preferred timeline.

Then I compare those consequences against our team capacity and the product outcome we've committed to. I don't try to make everybody happy by adding all the requests to the sprint. I make a recommendation and show what's displaced.

If there's a genuine conflict between senior stakeholders, I bring them the same set of facts and a clear decision, rather than negotiating separately and making different promises to each group.

---

### 14. How do you know whether a launch was successful?

<a id="simplii-panel-bank-14-how-do-you-know-whether-a-launch-was-s"></a>

- **Import key:** `simplii-panel-bank-14`
- **Library ID:** `fbcab8aa-7400-42fd-a849-c36c60ec7db2`
- **Tier:** P1

**Answer (spoken):**

I separate a safe release from a successful product outcome. A banking feature needs to function correctly and meet its controls—that's the first hurdle. After that, I want to know whether the intended customers found it, used it successfully and kept using it where repeat behaviour matters.

I'd agree on the baseline and success criteria before launch, measure by cohort and watch guardrails like failure rates, complaints and cost to serve. A single adoption spike in the first week isn't enough if the behaviour falls away or creates more confusion.

And if the outcome doesn't improve, I want the team to be able to say whether the feature was hard to discover, hard to use or simply solving a weaker problem than we thought.

---

### 15. How do you partner with a BA or Scrum Master without overlapping roles?

<a id="simplii-panel-bank-07-how-do-you-partner-with-a-ba-or-scrum-"></a>

- **Import key:** `simplii-panel-bank-07`
- **Library ID:** `e5827b1d-6013-4585-891b-cd2b145958b1`
- **Tier:** P1

**Answer (spoken):**

I see the PM as accountable for the customer problem, the priority and the outcome. A BA can be a really important partner in decomposing processes, surfacing business rules and testing that requirements hold together across teams. The Scrum Master helps the team maintain a healthy delivery process and resolve impediments.

I wouldn't hand a vague idea to the BA and disappear, and I wouldn't use the Scrum Master as a project administrator. We'd refine together, challenge edge cases together and stay clear on who makes the product trade-off when constraints change.

The best collaboration is where each person has room to use their expertise and customers don't experience the seams between those roles.

---

### 16. How do you prioritize your product backlog?

<a id="simplii-panel-bank-01-how-do-you-prioritize-your-product-bac"></a>

- **Import key:** `simplii-panel-bank-01`
- **Library ID:** `c18b2148-b0ee-413b-824e-82f3f8c1c9a5`
- **Tier:** P1

**Answer (spoken):**

I start with what we're trying to improve and what constraints are non-negotiable. In a bank, a regulatory commitment, material customer harm or an active reliability issue can outrank a feature with an attractive growth forecast.

For the discretionary work, I compare customer reach and severity, expected business impact, confidence in the evidence, engineering effort and dependencies. I find scoring frameworks useful for exposing assumptions, but I wouldn't let a weighted spreadsheet make the decision for me.

I keep the trade-offs visible. If we move an item up, we should be able to explain what moves down and why. That matters for trust with the squad and with stakeholders who won't get everything they asked for.

**Embedded follow-ups (1):**

- **Q:** Prioritization — Which two genuine initiatives competed, and what exactly did yo

One decision that captures how I think about sequencing was on Avion. We had good reasons to keep improving cashback discovery and engagement; those experiences help members find earning opportunities and support growth. At the same time, non-RBC members could have a cashback balance without a practical way to receive it.

I put the withdrawal capability ahead of additional earning enhancements. The logic was customer value and order of operations. A better offer-discovery experience encourages people to accumulate more cashback, but it doesn't solve the broken end of the existing journey. The withdrawal gap affected an identifiable set of customers, and we had a realistic path through the enterprise Interac capability.

So what I sequenced behind it was discretionary earning/discovery enhancement work, not a mandatory risk control. I was comfortable with that because we were completing an existing promise before trying to expand engagement. The decision wasn't that growth didn't matter; it was that the product needed to make its current value usable first.

---

### 17. How do you work with Risk, Legal and Compliance?

<a id="simplii-panel-bank-03-how-do-you-work-with-risk-legal-and-co"></a>

- **Import key:** `simplii-panel-bank-03`
- **Library ID:** `d0d89da6-1e95-4b7c-857b-24558e72cb6c`
- **Tier:** P1

**Answer (spoken):**

I involve them while we're defining the problem and options, rather than arriving with a finished experience and asking for approval at the end. They bring different expertise: Risk helps us understand exposure and acceptable controls, Compliance helps interpret regulatory obligations and monitoring requirements, and Legal helps with the legal implications, contracts and customer terms.

I try to make the discussion concrete. What exact customer behaviour are we enabling? Which control or obligation is affected? Is it mandatory as designed, or are there compliant alternatives? Then we agree on the decision owner, evidence and approval path.

The goal isn't to persuade control partners to waive a requirement. It's to find the simplest customer experience that meets the requirement—and surface unresolved risks early enough that the roadmap can change.

---

### 18. How would you interpret the app's public ratings and reviews?

<a id="simplii-panel-app-06-how-would-you-interpret-the-app-s-publi"></a>

- **Import key:** `simplii-panel-app-06`
- **Library ID:** `d13f27d0-3f77-451d-a22b-c2392b5e1c74`
- **Tier:** P1

**Answer (spoken):**

I'd treat ratings as a broad reputation signal and written reviews as hypotheses worth investigating, not as a representative customer sample. People who leave reviews are self-selected, and the score includes years of experience across different app versions.

I'd read recent comments by theme and version, then try to validate them against internal signals: crash and login errors, task abandonment, support volume, successful bill-payment journeys and accessibility issues. I'd also look for the counterevidence—customers who like the redesign or complete these tasks faster.

If we can show a repeated problem across external feedback and actual customer behaviour, that's a much stronger reason to prioritize it than a raw star rating on its own.

---

### 19. How would you prioritize a new feature against fixing post-redesign complaints?

<a id="simplii-panel-app-05-how-would-you-prioritize-a-new-feature-"></a>

- **Import key:** `simplii-panel-app-05`
- **Library ID:** `3126ebd5-e954-4575-8ff2-1615962587b0`
- **Tier:** P1

**Answer (spoken):**

I'd compare what happens if we delay each one. A new folder capability might offer meaningful long-term engagement and retention, but if existing customers are struggling to confirm bill payments or sign in reliably, that affects a more fundamental promise.

I wouldn't automatically cancel new development based on a handful of online reviews. I'd validate the scale and severity through customer-service reasons, journey telemetry, app version and customer interviews. For genuine high-severity regressions, I'd prioritize a focused fix and keep the new capability moving where dependencies allow.

The decision I'd present is the customer harm we're addressing, what work we're deferring and how we'll know the problem is resolved. Especially following a major redesign, confidence in everyday tasks is part of the product strategy—not just maintenance.

---

### 20. If you joined Simplii, what would you improve first in the mobile app?

<a id="simplii-panel-app-01-if-you-joined-simplii-what-would-you-im"></a>

- **Import key:** `simplii-panel-app-01`
- **Library ID:** `2fdc7f6c-edfd-47c2-b848-4f8a8cfe1177`
- **Tier:** P1

**Answer (spoken):**

I'd be cautious about announcing a new feature on day one. Simplii has just made a significant investment in its app and the Simplii Account experience, so my first job would be understanding what's working and where the redesign introduced friction.

I did look through recent app reviews and community feedback. One recurring complaint is that people have had more trouble finding prior bill payments and transfer history. That's interesting because, in banking, confirming whether you've already paid someone isn't an occasional edge case; it's a core trust moment.

I'd look at task completion, time to find a past payment, support contacts and errors by app version. The October releases have already improved some of that functionality, so I'd validate what's still unresolved before proposing a change. My first priority would be restoring confidence in core tasks while the team expands the new experience.

---

### 21. Leadership — Describe a decision a partner disagreed with, what happened, and what you learned.

<a id="simplii-hp-10-leadership-describe-a-decision-a-partner-disag"></a>

- **Import key:** `simplii-hp-10`
- **Library ID:** `c3ac4022-8733-4338-a1d7-f2534372c657`
- **Tier:** P1

**Answer (spoken):**

At Arc'teryx, membership cut across several teams, so people came into it with legitimate but different priorities. From a brand and engagement perspective, a richer launch—with more benefits and more channels—was attractive. From the platform and guest-service side, each additional benefit created eligibility, identity and fulfilment dependencies.

I advocated for an initial web-first, North America-first release and a narrower set of benefits whose end-to-end operations we could support. I made the trade-off visible: adding the native app or a complex redemption wasn't just adding a screen; it added another surface and another fulfilment path to validate, with implications for scope, dates and support.

We used the MVP and investment-planning process to bring those perspectives to a decision rather than letting the broadest wishlist become the roadmap. We preserved the larger membership ambition but separated the foundation from later phases.

What I learned is that people can disagree on scope without disagreeing on the customer vision. The PM's job is to expose the real dependencies, recommend a sequence and make sure stakeholders understand what the first release will and won't accomplish.

---

### 22. Metrics — Give a rigorous numerator, denominator, window, segments and guardrail.

<a id="simplii-hp-08-metrics-give-a-rigorous-numerator-denominator-"></a>

- **Import key:** `simplii-hp-08`
- **Library ID:** `9a3c625d-b0ec-4c1c-8370-fc0310894e46`
- **Tier:** P1

**Answer (spoken):**

If the outcome were making a new chequing account part of someone's financial routine, I'd define a 90-day recurring payroll adoption rate rather than just counting openings.

My denominator would be distinct eligible customers who opened a usable chequing account in a given acquisition cohort and whose full 90-day observation window has elapsed. The numerator would be customers in that cohort who received at least two qualifying income deposits across separate expected pay cycles during those 90 days. I'd keep setup intent or a single first deposit as earlier funnel milestones, not final adoption.

I'd segment the result by acquisition channel, offer exposure, new versus existing customer relationship and app version if the onboarding flow changed. I'd also compare like-for-like cohorts so a marketing campaign doesn't masquerade as a product improvement.

A key guardrail would be payment or payroll-related failures and complaints, with clear rates instead of raw counts. A conversion lift doesn't help if people struggle to receive or access their paycheque.

---

### 23. Prioritization — Which two genuine initiatives competed, and what exactly did you defer?

<a id="simplii-hp-07-prioritization-which-two-genuine-initiatives-c"></a>

- **Import key:** `simplii-hp-07`
- **Library ID:** `de14d86a-305b-4b45-92de-4f6ae78aee74`
- **Tier:** P1

**Answer (spoken):**

One decision that captures how I think about sequencing was on Avion. We had good reasons to keep improving cashback discovery and engagement; those experiences help members find earning opportunities and support growth. At the same time, non-RBC members could have a cashback balance without a practical way to receive it.

I put the withdrawal capability ahead of additional earning enhancements. The logic was customer value and order of operations. A better offer-discovery experience encourages people to accumulate more cashback, but it doesn't solve the broken end of the existing journey. The withdrawal gap affected an identifiable set of customers, and we had a realistic path through the enterprise Interac capability.

So what I sequenced behind it was discretionary earning/discovery enhancement work, not a mandatory risk control. I was comfortable with that because we were completing an existing promise before trying to expand engagement. The decision wasn't that growth didn't matter; it was that the product needed to make its current value usable first.

---

### 24. RBC — After a timeout, how do you prevent duplicates and establish payment status without owning the rail?

<a id="simplii-hp-04-rbc-after-a-timeout-how-do-you-prevent-duplica"></a>

- **Import key:** `simplii-hp-04`
- **Library ID:** `fde67b88-6146-4333-9c48-5ed26c1f3147`
- **Tier:** P1

**Answer (spoken):**

The first rule is that a timeout is not a declined payment. It means the customer-facing service didn't receive a conclusive response. The instruction may still be processing, and treating that as a failure can create a second payout.

So before launch, I'd want the withdrawal requirement to cover an uncertain outcome explicitly. When the request is initiated, the journey needs a stable reference that can be traced end to end. If we lose the response, we show the customer that the withdrawal is being checked rather than encouraging a new submission.

On the service side, I'd work with the payments owners to confirm how duplicate protection and authoritative status are actually supported. Ideally a retry against the same business request can't move money twice, and there is a reliable way to reconcile the original instruction to its final outcome.

My job is to insist that the contract, customer states, support path and acceptance criteria address that failure mode. The enterprise team decides how the mechanism is implemented, because I don't own their payment architecture.

---

### 25. RBC — Separate ~3,200 requests, ~$1.2M in annualized payouts, ~99% within 24 hours and 5M+ enterprise events.

<a id="simplii-hp-03-rbc-separate-3-200-requests-1-2m-in-annualized"></a>

- **Import key:** `simplii-hp-03`
- **Library ID:** `68cba772-025b-4a40-b8ed-c199b9a91058`
- **Tier:** P1

**Answer (spoken):**

They're four different measures, and I deliberately keep them separate. Around 3,200 withdrawal requests in a quarter describes customer demand for the Avion withdrawal journey. The roughly $1.2 million annualized figure describes the value of cashback paid out at that run-rate. That's customer money distributed, not revenue and not the total processing volume of the bank.

The approximately 99% within 24 hours is a service-outcome measure for that customer flow, assuming we're describing the same reporting definition. It needs a precise starting point and an unambiguous completion event to be meaningful.

Separately, the existing enterprise payment capability supported more than five million settlement events annually across broader use cases. My team integrated with that capability; I didn't build it or own its full event volume. So I use the enterprise number as context for the service we depended on, not as an accomplishment of the Avion feature itself.

---

### 26. RBC — What was the most contentious decision with Payments, Risk or Financial Operations?

<a id="simplii-hp-02-rbc-what-was-the-most-contentious-decision-wit"></a>

- **Import key:** `simplii-hp-02`
- **Library ID:** `74b17e6b-dd75-4dc3-9d4c-dbb88e58f69d`
- **Tier:** P1

**Answer (spoken):**

The most difficult part was making the customer promise line up with what the underlying payment service could actually guarantee. A member presses withdraw and expects a clear answer. But the enterprise service accepting the instruction isn't identical to the money being delivered.

That creates different concerns for different teams. Product wants a clear, reassuring experience. Payments needs us to represent the actual transaction state. Risk cares about eligibility and not creating an unsafe repeat instruction, while Finance needs the transaction to be traceable when an exception has to be reconciled.

The decision I pushed toward was separating an acknowledged request from a confirmed payout, with a defined pending state and an exception path rather than a blanket success message. We worked through the customer states alongside the operating process, so customer service could investigate without asking the member to guess whether the transfer had gone through.

For me, the point wasn't to win an argument with a control partner. It was getting all of us to agree what the customer could safely be told at each stage.

---

### 27. Tell me about a genuine disagreement with another stakeholder.

<a id="simplii-panel-gap-02-tell-me-about-a-genuine-disagreement-wi"></a>

- **Import key:** `simplii-panel-gap-02`
- **Library ID:** `469b3ada-9d4c-406d-af5b-f1688eacabcc`
- **Tier:** P1

**Answer (spoken):**

One useful example is the membership scope at Arc'teryx. There was a real ambition to create a connected experience across registration, service benefits and ongoing engagement. The tension was between designing the full proposition and committing to a launch we could genuinely support with the systems and operational processes available.

My position was that a smaller, end-to-end experience would give us a better foundation than spreading the initial release across too many capabilities. I worked through dependencies, fulfillment ownership and which experiences could be supported on the web first, rather than assuming the app and every benefit needed to launch together.

What helped was putting the decision in terms of customer outcomes and delivery risk rather than whose preferred feature won. We could preserve the broader vision while being honest about what the first release could support.

**Embedded follow-ups (1):**

- **Q:** Leadership — Describe a decision a partner disagreed with, what happened, and wh

At Arc'teryx, membership cut across several teams, so people came into it with legitimate but different priorities. From a brand and engagement perspective, a richer launch—with more benefits and more channels—was attractive. From the platform and guest-service side, each additional benefit created eligibility, identity and fulfilment dependencies.

I advocated for an initial web-first, North America-first release and a narrower set of benefits whose end-to-end operations we could support. I made the trade-off visible: adding the native app or a complex redemption wasn't just adding a screen; it added another surface and another fulfilment path to validate, with implications for scope, dates and support.

We used the MVP and investment-planning process to bring those perspectives to a decision rather than letting the broadest wishlist become the roadmap. We preserved the larger membership ambition but separated the foundation from later phases.

What I learned is that people can disagree on scope without disagreeing on the customer vision. The PM's job is to expose the real dependencies, recommend a sequence and make sure stakeholders understand what the first release will and won't accomplish.

---

### 28. Tell me about a time you chose between two worthwhile priorities.

<a id="simplii-panel-gap-04-tell-me-about-a-time-you-chose-between-"></a>

- **Import key:** `simplii-panel-gap-04`
- **Library ID:** `fd1ca5e7-6982-4978-a526-8b79dc331042`
- **Tier:** P1

**Answer (spoken):**

At Avion, there were good reasons to invest in helping members discover and earn more cashback. But for non-RBC customers who had already earned cashback, the ability to actually withdraw it was a more fundamental gap.

I favoured addressing that first. It completed a promise we'd already made to an identifiable group of members, and there was an existing enterprise payment capability we could adapt instead of creating a new payment system. That gave us a feasible path to value, even though it meant some engagement opportunities would follow later.

I don't view that as a blanket rule that reliability always beats growth. It was specific to where the journey was broken, how material it was to trust and whether there was a practical way to solve it. We needed to make the value people had earned usable before optimizing how they earned more.

**Embedded follow-ups (1):**

- **Q:** Prioritization — Which two genuine initiatives competed, and what exactly did yo

One decision that captures how I think about sequencing was on Avion. We had good reasons to keep improving cashback discovery and engagement; those experiences help members find earning opportunities and support growth. At the same time, non-RBC members could have a cashback balance without a practical way to receive it.

I put the withdrawal capability ahead of additional earning enhancements. The logic was customer value and order of operations. A better offer-discovery experience encourages people to accumulate more cashback, but it doesn't solve the broken end of the existing journey. The withdrawal gap affected an identifiable set of customers, and we had a realistic path through the enterprise Interac capability.

So what I sequenced behind it was discretionary earning/discovery enhancement work, not a mandatory risk control. I was comfortable with that because we were completing an existing promise before trying to expand engagement. The decision wasn't that growth didn't matter; it was that the product needed to make its current value usable first.

---

### 29. Tell me about a time your original hypothesis proved wrong.

<a id="simplii-panel-gap-01-tell-me-about-a-time-your-original-hypo"></a>

- **Import key:** `simplii-panel-gap-01`
- **Library ID:** `8815a53a-31f5-46ba-b31a-c14fab04db94`
- **Tier:** P1

**Answer (spoken):**

The HBC Mastercard application is a useful example of having to challenge the obvious growth response. When applications weren't converting as well as we wanted, the natural assumption was that we needed more qualified traffic or a stronger acquisition push. But looking at the journey made me question that. We were already getting intent; people were dropping off before completing the application.

That changed where I focused the work. Instead of putting all the effort into acquisition, I worked with our partner on friction in the application experience. The redesigned journey improved completions by around 15%. The lesson was to check where the constraint actually is before investing in the most visible lever. More traffic into a leaky journey can make the numbers look busy without fixing the customer problem.

**Embedded follow-ups (1):**

- **Q:** Discovery — When did evidence overturn a hypothesis you personally preferred?

At HBC, my first instinct with the Mastercard funnel was that we probably had room to improve the quality of traffic entering the application. It was an acquisition product, and when you want more approved cardholders, more qualified starts looks like a logical place to begin.

But when we looked past starts into the application journey, it became clear that we were losing people who had already expressed strong intent. That changed how I thought about the opportunity. Spending more to bring someone into the same friction wasn't the best next move.

I shifted the focus toward the application experience with Neo—what information the customer expected, how they progressed into the partner's process and whether we were making a consequential step feel more complicated than it needed to be. That work was associated with about a 15% improvement in completed applications.

What I learned was to be willing to change the diagnosis, not just tune the execution. A plausible growth idea isn't necessarily the right constraint to attack.

---

### 30. What do you think of Simplii's new folders and payment-backup features?

<a id="simplii-panel-app-04-what-do-you-think-of-simplii-s-new-fold"></a>

- **Import key:** `simplii-panel-app-04`
- **Library ID:** `50cf08b9-a8e2-4d75-b455-172065bc14d6`
- **Tier:** P1

**Answer (spoken):**

I think the folders direction is interesting because it reflects a real customer job: making it easier to set money aside for bills or savings without managing several separate accounts. The paycheque-allocation piece is especially relevant to everyday banking because it connects the feature to behaviour that recurs each pay cycle.

For the pilot, I wouldn't stop at folder creation. I'd want to see whether people actually fund folders, use them for intended payments or goals, and keep doing that across several pay periods. I'd also watch confusion about available balances, transfers and what payment backup does or doesn't cover.

There's real potential to make Simplii a more habitual primary account, but the experience needs to be easy to understand. More structure is only useful if it reduces mental effort rather than adding a new budgeting chore.

---

### 31. What does a good user story look like to you?

<a id="simplii-panel-bank-06-what-does-a-good-user-story-look-like-"></a>

- **Import key:** `simplii-panel-bank-06`
- **Library ID:** `bcbd87cb-5c97-41e2-baa6-2c2325b9f1f7`
- **Tier:** P1

**Answer (spoken):**

It should be small enough to deliver and test, but not so small that the customer outcome disappears. I want to know who needs something, why it matters, the rules that govern it and the observable behaviour that tells us it's done.

For a payment confirmation, for instance, we'd define when a request is received, when a payment is actually complete, what to show if the state is uncertain, and whether a retry is permitted. I'd expect negative cases, accessibility and measurement to be part of the conversation with BA, engineering and QA.

A story is ready when the team shares an understanding of the intent, not when Product has filled in every possible template field.

---

### 32. What does a healthy relationship with engineering look like?

<a id="simplii-panel-bank-11-what-does-a-healthy-relationship-with-"></a>

- **Import key:** `simplii-panel-bank-11`
- **Library ID:** `b7c57602-b471-4fe5-8d4e-ed7f639213f2`
- **Tier:** P1

**Answer (spoken):**

I want engineering involved when we're still framing the problem, not just after we've committed to a solution. They often see opportunities to reuse a capability, or risks in a dependency, that completely change the sensible product choice.

I'm clear about outcomes, business rules and trade-offs; engineering owns the technical design and gives us a realistic view of capacity and complexity. If we're disagreeing, I'd make the assumption visible and work through evidence rather than escalating on title.

That was particularly important on the Avion cashback payout work because the customer journey depended on enterprise services outside the squad.

---

### 33. What exactly did you own versus the enterprise payments team at RBC?

<a id="simplii-panel-gap-07-what-exactly-did-you-own-versus-the-ent"></a>

- **Import key:** `simplii-panel-gap-07`
- **Library ID:** `1abf51a3-3d27-4e28-9e6d-88caefc16582`
- **Tier:** P1

**Answer (spoken):**

The distinction is important. I owned the consumer-facing cashback withdrawal experience for non-RBC Avion members: the product requirements, eligibility journey, withdrawal request and status expectations, failure and recovery cases, and cross-functional alignment needed to launch it.

We reused an existing enterprise payments capability for the underlying movement and settlement of funds. That service and its broader transaction volume were not products I built or owned. The platform, Risk and Financial Operations teams had their own responsibilities around payment execution, controls and reconciliation.

My job was to make those capabilities work as a reliable customer journey, including the handoffs and operational processes. That's also why I tend to talk about successful customer payouts and exception handling rather than taking credit for the enterprise service's full scale.

**Embedded follow-ups (1):**

- **Q:** RBC — Separate ~3,200 requests, ~$1.2M in annualized payouts, ~99% within 24 hou

They're four different measures, and I deliberately keep them separate. Around 3,200 withdrawal requests in a quarter describes customer demand for the Avion withdrawal journey. The roughly $1.2 million annualized figure describes the value of cashback paid out at that run-rate. That's customer money distributed, not revenue and not the total processing volume of the bank.

The approximately 99% within 24 hours is a service-outcome measure for that customer flow, assuming we're describing the same reporting definition. It needs a precise starting point and an unambiguous completion event to be meaningful.

Separately, the existing enterprise payment capability supported more than five million settlement events annually across broader use cases. My team integrated with that capability; I didn't build it or own its full event volume. So I use the enterprise number as context for the service we depended on, not as an accomplishment of the Avion feature itself.

---

### 34. What if Risk rejects a feature that Product wants to launch?

<a id="simplii-panel-bank-04-what-if-risk-rejects-a-feature-that-pr"></a>

- **Import key:** `simplii-panel-bank-04`
- **Library ID:** `b6cfd38e-4c87-432a-a298-360161c2c9b8`
- **Tier:** P1

**Answer (spoken):**

I'd want to understand precisely what's unacceptable. Is it the underlying customer activity, the lack of a control, our current data quality, or the way we're proposing to introduce it?

Sometimes there's a different implementation that solves the same customer problem, such as stronger verification for a narrow high-risk path or a permitted manual review. I'd put the alternatives and their impact on the table with Risk and engineering.

If the residual risk remains outside appetite or the requirement is mandatory, we don't launch that version. I'd document the decision, update the plan and explain the consequence to stakeholders. I'd rather make the trade-off explicit than quietly keep a date that no longer reflects reality.

---

### 35. What if you have to choose between shipping on time and addressing a quality issue?

<a id="simplii-panel-bank-09-what-if-you-have-to-choose-between-shi"></a>

- **Import key:** `simplii-panel-bank-09`
- **Library ID:** `24b8f7f5-9735-4625-a869-0d522ab86ee8`
- **Tier:** P1

**Answer (spoken):**

The answer depends on what the issue affects. If it could misstate a balance, expose customer information, allow duplicate movement of money or break a mandatory control, I wouldn't treat it as a normal launch trade-off.

For something lower-severity, like a small cosmetic inconsistency, we could agree on a documented follow-up, provided the experience remains usable and accessible. I'd explain the consequence of each option and make sure the right owners accept the residual risk.

A date is a commitment, but so is the customer's expectation that their banking works correctly.

---

### 36. What is one missing banking-app capability you would investigate?

<a id="simplii-panel-app-03-what-is-one-missing-banking-app-capabil"></a>

- **Import key:** `simplii-panel-app-03`
- **Library ID:** `740fb26c-653f-4366-8134-091464274506`
- **Tier:** P1

**Answer (spoken):**

More configurable transaction alerts would be worth investigating. Some reviews complain about not receiving the type of real-time card or account-activity notifications they expect. I wouldn't assume that means Simplii has no alerts; there's a difference between low-balance alerts, security pushes and transaction-level notifications.

I'd first understand what alert coverage exists today and where the gap is. Then I'd look at customer demand, fraud-related contacts, notification reliability, privacy and false-alert burden. A targeted set of useful alerts—say for card purchases or unusual activity where supported—could increase customer confidence without inundating people.

The key is that we can actually deliver timely and accurate signals. An alert arriving late or describing a pending transaction as final could reduce trust rather than improve it.

---

### 37. What is the difference between a roadmap and a backlog?

<a id="simplii-panel-bank-13-what-is-the-difference-between-a-roadm"></a>

- **Import key:** `simplii-panel-bank-13`
- **Library ID:** `566cf8e9-628e-4ac0-a8b5-f89544b2efa2`
- **Tier:** P1

**Answer (spoken):**

The roadmap communicates the problems we're investing in and the outcomes we're working toward, with a useful view of sequence and uncertainty. The backlog is the team's ordered set of work to make progress toward those outcomes.

I wouldn't want a roadmap that's just a list of features with dates, or a backlog that's a collection of stakeholder requests. Good discovery changes what goes into the backlog, and what we learn during delivery can change the roadmap.

The link between them should be easy to explain: this sprint's work supports this opportunity, which supports this measurable customer or business outcome.

---
