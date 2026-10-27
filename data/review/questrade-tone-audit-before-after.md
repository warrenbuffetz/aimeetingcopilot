# Questrade tone audit — before / after

Generated: 2026-10-27T03:52:52.117Z

Baseline: `git HEAD` → `exports/questrade_interview_library.json` (pre–working-tree export).
After: current export (post P0 + P1 apply).

---

## P0 · `009d20a6-a8cf-458a-a7ea-9ef696c693e0`

**Question:** How would you choose between building a payment service and buying one?

**Fields changed:** `answer`, `spokenAnswer`, `shortAnswer`

### Canonical `answer`

**Before**

```text
"I'd start by identifying which part creates differentiation and which part is foundational infrastructure. Payments have complex operational, security and regulatory requirements, so rebuilding a mature capability needs a compelling reason. I'd compare time to market, total cost, flexibility, reliability, integration effort, contractual constraints and exit risk. I'd also look at who owns reconciliation, incidents and customer support when things go wrong. The cheapest vendor quote isn't necessarily the lowest-cost option over time. My experience at Arc'teryx reinforced that the important decision isn't build versus buy in the abstract. It's what we want to own strategically and what dependency we're willing to accept."
D. Resume deep dives and skeptical follow-ups
```

**After**

```text
I'd start by identifying which part creates differentiation and which part is foundational infrastructure. Payments have complex operational, security and regulatory requirements, so rebuilding a mature capability needs a compelling reason. I'd compare time to market, total cost, flexibility, reliability, integration effort, contractual constraints and exit risk. I'd also look at who owns reconciliation, incidents and customer support when things go wrong. The cheapest vendor quote isn't necessarily the lowest-cost option over time. My experience at Arc'teryx reinforced that the important decision isn't build versus buy in the abstract. It's what we want to own strategically and what dependency we're willing to accept.
```

### `spokenAnswer`

**Before**

```text
"I'd start by identifying which part creates differentiation and which part is foundational infrastructure. Payments have complex operational, security and regulatory requirements, so rebuilding a mature capability needs a compelling reason. I'd compare time to market, total cost, flexibility, reliability, integration effort, contractual constraints and exit risk. I'd also look at who owns reconciliation, incidents and customer support when things go wrong. The cheapest vendor quote isn't necessarily the lowest-cost option over time. My experience at Arc'teryx reinforced that the important decision isn't build versus buy in the abstract. It's what we want to own strategically and what dependency we're willing to accept."
D. Resume deep dives and skeptical follow-ups
```

**After**

```text
I'd start by identifying which part creates differentiation and which part is foundational infrastructure. Payments have complex operational, security and regulatory requirements, so rebuilding a mature capability needs a compelling reason. I'd compare time to market, total cost, flexibility, reliability, integration effort, contractual constraints and exit risk. I'd also look at who owns reconciliation, incidents and customer support when things go wrong. The cheapest vendor quote isn't necessarily the lowest-cost option over time. My experience at Arc'teryx reinforced that the important decision isn't build versus buy in the abstract. It's what we want to own strategically and what dependency we're willing to accept.
```

---

## P1 · `06e233ae-5d45-42d3-b560-84baf56a8948`

**Question:** How would you increase direct deposit adoption?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
I'd start by understanding where the friction is, because there are several reasons someone might not move their paycheque.

They might not know how to update payroll information. They may worry about missing a paycheque during the transition. Some may already have automatic bill payments coming out of another account, so switching payroll feels like the start of a much bigger migration.

I'd look at the data first. How many customers are eligible to receive direct deposits? How many begin the setup process? How many complete it? And how many actually receive recurring payroll deposits afterward?

I'd combine that with customer interviews, because a low conversion rate doesn't necessarily tell us why people are hesitating.

My first hypothesis would be to reduce the effort and uncertainty of switching. That could mean clearer payroll instructions, prefilled forms where possible, employer-specific guidance, and a checklist that helps users understand what needs to happen next.

I'd probably test that before introducing expensive incentives.

For measurement, I'd care about the percentage of eligible customers who receive a qualifying payroll deposit within 30 or 60 days, but I'd also look at whether the deposits continue over subsequent pay cycles.

If customers switch once to collect an incentive and then leave, we haven't really won their primary banking relationship.

I'd also monitor funding errors, support contacts and complaints, because trust is especially important during payroll migration.
```

**After**

```text
I'd focus first on making payroll switching feel safe and manageable. People may like a new bank but still hesitate to move their salary because they're worried about a missed paycheque or a bill coming out of the wrong account. I'd use funnel data and customer conversations to distinguish uncertainty from actual setup friction. Then I'd test a guided flow with clear employer instructions and confirmation of what has and hasn't happened. I'd rather remove that uncertainty before spending heavily on sign-up incentives. The main success metric wouldn't be completed setup forms; it would be customers who receive a first qualifying deposit and keep receiving deposits over subsequent pay cycles. I'd monitor failed deposits, support contacts and drop-off as closely as conversion.
```

---

## P1 · `08bed145-68a4-4f1f-a500-1287247345bc`

**Question:** What would you actually deliver in your first 30 days?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
I wouldn't promise a major launch before understanding the banking dependencies, but I would aim to deliver something tangible. By day 30, I'd want a shared map of the highest-value customer journeys, their owners and their biggest friction points. That would come from looking at the funnel, support reasons, payment exceptions and talking directly with the teams that operate the product. I'd also propose a first measurement baseline: funded-account rate, recurring deposit behaviour, successful money movement and the most important reliability guardrails. If we discovered a contained issue…
```

**After**

```text
By day 30, my tangible deliverable would be a shared map of the highest-value everyday-banking journeys, who owns each one and where the biggest friction sits — backed by funnel data, support themes and payment exceptions. Alongside that, I'd propose a first measurement baseline for funded accounts, recurring deposits and successful money movement. I wouldn't promise a major launch before I understand the dependencies, but I would leave with a prioritized decision and, if we find a contained fix, one small test we can run safely in the next sprint.
```

---

## P0 · `0e33272e-0d91-49a8-8d6d-e74881372454`

**Question:** How did you measure the 40% conversion improvement at Aeroplan?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
The headline outcome on my resume is a 40% improvement in application conversion. I would be careful about the event definition because reaching an issuer, starting an application and completing an application are different outcomes.

To explain that result properly, I would anchor it to the original reporting definition, eligible audience and comparison period. I do not want to substitute a more impressive downstream event just because it sounds better in an interview.

The measurement approach I'd use is to follow the journey from exposure to offer engagement, the issuer handoff and whatever application outcome we can reliably observe. I'd compare like-for-like traffic and check for changes in offer strength, channel mix or eligibility that might explain part of the movement.

I would also keep the 40% journey result separate from the 427% year-over-year acquisition growth. The broader number had multiple contributors. My job is to explain the product contribution accurately, including the limits of the evidence.
```

**After**

```text
The reported 40% improvement was in the co-brand card acquisition funnel. I'd be precise about what that conversion event meant, because clicking through to an issuer, starting an application and completing one are different things. We worked on the digital experience that helped members understand the offer and move toward applying, and I would separate that funnel result from the much broader 427% year-over-year acquisition growth. That growth involved more than one product change. If we were discussing attribution, I'd go back to the original conversion definition, audience and comparison period rather than imply that the full acquisition gain came from a single test.
```

---

## P1 · `140caed9-55a1-48ac-9190-5d2256afd262`

**Question:** Tell me about improving the HBC Mastercard application journey.

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
At HBC, I worked with Neo Financial on improving the digital credit card application experience.

Credit card applications are interesting because there's a lot of information customers need to provide, and it can be easy to introduce unnecessary friction.

Our focus was making the application journey clearer and easier to complete while preserving the information and controls required by the financial partner.

We used the application funnel to understand where customers were dropping off and prioritized improvements to the experience.

The result was a 15% increase in application completions.

Customers also had access to credit decisions in under three minutes through the integrated experience.

I would distinguish those two outcomes. The conversion improvement was tied to the digital customer journey, while the decisioning capability depended on Neo Financial's underlying credit infrastructure.

The broader lesson for me was that simplifying a regulated financial experience doesn't mean removing the requirements. It means making those requirements easier for customers to understand and complete.
```

**After**

```text
At HBC, we were losing customers partway through the Mastercard application experience. My focus was on understanding the drop-off and improving the journey with Neo without weakening the issuer's required checks. We reviewed the funnel, prioritized the points where the experience was confusing or difficult to complete and worked across the HBC-to-Neo boundary on the changes. The reported result was a 15% improvement in application completions. Neo's underlying credit infrastructure also supported decisions in under three minutes, but I'd keep that separate from the conversion improvement. The product lesson was that you can make a regulated journey much easier without pretending the controls don't exist.
```

---

## P1 · `15aa03e2-46af-4d60-9d73-90ed342c6ccc`

**Question:** Tell me about a product initiative that didn't go according to plan.

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
One example would be the membership program I'm working on at Arc'teryx.

It's a fairly ambitious initiative involving different customer experiences, technology platforms and teams, and one of the challenges has been managing the dependencies across all of those areas.

As we got deeper into the planning, it became clear that some capabilities were more dependent on the broader platform than we'd initially anticipated.

Rather than trying to force everything into one launch, we had to revisit the sequencing and distinguish between what was essential for the MVP and what could be delivered separately or later.

That meant working with business and technology stakeholders to explain the trade-offs and make sure we were still solving the right customer problem.

One thing I've learned is that there's a difference between being committed to a product outcome and being committed to the original roadmap.

I think a good PM needs to be willing to challenge the plan when new information comes to light, even if that means having some difficult conversations.

I'd rather be transparent about the constraints and find a more realistic path to delivering value than continue pushing toward a launch that carries unnecessary risk.
```

**After**

```text
A recent example is Arc'teryx membership, where we secured funding for a broad platform but hit a fixed date for the Sperro SV launch. As planning matured, more capabilities depended on the shared platform than we first assumed. Rather than force one big release, we separated scope: a smaller Sperro SV benefits package shipped on time while the larger membership build continued on its own track. That wasn't a product failure — it was revising sequencing when dependencies became clear. I'd rather be transparent about constraints and deliver value safely than chase an original roadmap that carries unnecessary risk.
```

---

## P1 · `1fd9478b-7396-4778-bc00-e62aee52de52`

**Question:** What are you currently working on at Arc'teryx?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
One of the more interesting things I've been working on recently is tied to the launch of the Sperro SV, which is Arc'teryx's first circular hardshell. For context, I've been leading the development of a broader membership program at Arc'teryx. The vision is to build a deeper relationship with customers beyond the initial purchase, particularly around gear ownership, product care, repairs and community experiences. We'd secured about $5.2 million in funding for that program, but it's a fairly substantial platform build with dependencies across commerce, identity, customer service…
```

**After**

```text
I'm leading Arc'teryx's broader membership program — about $5.2 million approved — across commerce, identity, service and ReBIRD. Sperro SV had a fixed September launch before that platform would be ready, so we carved out a smaller release: three years of out-of-warranty repairs, community experiences and a Global Academy opportunity, delivered without waiting for the full membership stack. My job was scoping what we could ship independently, aligning ReBIRD and service operations and making ownership clear between the launch benefits and the longer roadmap. It's a good example of reducing scope to deliver something meaningful on a date the business committed to.
```

---

## P1 · `233b0497-5bff-471f-9617-6abdeca51522`

**Question:** Would you extend Questrade MCP beyond brokerage into everyday banking?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
I'd definitely explore it, but I wouldn't assume that something appropriate for brokerage accounts automatically makes sense for everyday banking. Banking information is more operationally sensitive. People depend on it to pay bills, receive income and understand what money they can actually spend. I'd start with read-only capabilities where the value is clear. For example, a customer could ask why their account balance changed, whether a bill payment has posted, or how much they've spent on recurring expenses. I'd want to validate those use cases before exposing more…
```

**After**

```text
I'd start everyday banking on MCP with read-only value: explain balance changes, confirm whether a bill payment posted or summarize recurring spend. Permissions would be granular, especially for transaction descriptions. Money movement would stay staged — perhaps prepare a transfer for in-app review — with limits and explicit authorization. I'd expand only after we prove customer value and operational readiness, not because the connector exists.
```

---

## P1 · `244e239c-2f88-4b6e-968f-ef8ce65daa70`

**Question:** Walk me through the Interac e-Transfer product you launched at RBC.

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
At RBC, one of the products I worked on was enabling cashback withdrawals for Avion members who weren't RBC banking customers.

The challenge was that these members could earn cashback, but we needed a way for them to receive that money without requiring an RBC bank account.

We decided to use Interac e-Transfer and adapt an existing enterprise payments capability rather than building a completely separate payment service.

My role was owning the consumer product requirements and coordinating the dependencies across teams, including AML, Risk, Financial Operations and the payments service.

There were a few important considerations. We needed eligibility rules to determine which members could withdraw, transaction limits, a reliable way to initiate the payout and an operational process for settlement and reconciliation.

We also needed the customer experience to be clear about what was happening with their money.

The product ultimately supported over $1 million in annualized cashback withdrawals. It leveraged a broader enterprise payments service that supported more than five million settlement events annually.

What I took away from that experience is that launching a payment feature isn't just about making an API call. The real work is making sure the product behaves predictably across customer experience, risk controls and financial operations.
```

**After**

```text
At RBC I owned consumer requirements for Avion cashback withdrawals via Interac e-Transfer for members without an RBC bank account. We reused an enterprise payments service rather than build a separate rail. I coordinated AML, Risk, Financial Operations and engineering on eligibility, limits, initiation, customer status messaging and reconciliation. The consumer product supported more than $1 million in annualized withdrawals on infrastructure that handled millions of settlement events enterprise-wide. My takeaway: shipping payments is about predictable behaviour across experience, controls and operations — not just enabling a transfer.
```

---

## P1 · `2b7b68cd-d7ae-4358-b609-405c36f1f6b6`

**Question:** What's one product opinion you hold strongly that others might disagree with?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
I think financial products sometimes overvalue engagement for its own sake. A customer opening an app more often isn't necessarily having a better experience. In some cases, the best product is one that makes an important task so dependable that the customer doesn't need to think about it. I still care about engagement metrics, but I'd rather optimize for successfully received paycheques, payments completed correctly and better financial decisions than extra sessions. The interesting part is finding a measurement system that recognizes that value even when it doesn't show up as more screen time.
```

**After**

```text
I believe financial products overvalue engagement for its own sake. More app opens don't automatically mean a better outcome — sometimes the best product is the one that makes paycheques, bills and transfers so reliable the customer doesn't need to think about it. I'd rather optimize for successfully received income, payments completed correctly and better financial decisions than extra sessions. The hard part is building metrics that reward that value even when it doesn't show up as screen time.
```

---

## P1 · `2f3a780e-6b54-42b8-b56d-8936a471fa68`

**Question:** Tell me about yourself.

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
Sure. I've spent the last nine-plus years in product, mostly working on digital consumer experiences, financial products and the platforms that support them. I'm currently a Senior Product Manager at Arc'teryx, where I've been leading the strategy for a new membership platform. That involved securing $5.2 million in funding, evaluating different technology solutions and working across business and engineering teams to define how the platform and customer experience come together. Before that, I was at RBC working on Avion Rewards. One of the more interesting projects was opening Avion to…
```

**After**

```text
Sure. I've spent a little over nine years building consumer products, much of it in financial services. Right now I'm leading membership work at Arc'teryx, including the $5.2 million investment case and the smaller Sperro SV benefits launch. Before that, at RBC Avion, I helped open the platform to non-RBC customers and launched cashback withdrawals using Interac e-Transfer. At HBC and Aeroplan, my focus was more on credit-card acquisition, engagement and commercial performance. What ties those roles together is helping customers adopt financial products, use them regularly and trust the systems behind them. That's what makes Questrade's everyday-banking opportunity appealing to me. You're trying to become part of someone's regular financial life, not just get them to open another account.
```

---

## P1 · `3c961ee8-43cb-4ec8-850f-24e822917f47`

**Question:** Why would Questrade expose brokerage capabilities to Claude and ChatGPT instead of building its own AI assistant?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
I actually think that's an interesting product strategy. Building your own assistant gives you more control over the experience, but you're also asking customers to adopt another interface, and you're taking on the cost of developing and maintaining the AI layer yourself. By supporting MCP, Questrade can meet customers in tools they may already be using. I'd ask where Questrade has the strongest competitive advantage. To me, it's the financial relationship, trusted account information, market-data access and the ability to safely facilitate transactions. It isn't necessarily building the…
```

**After**

```text
Questrade's advantage is trustworthy financial capabilities — accurate holdings, market data and safe transaction facilitation — not building the best general chat interface. MCP is a distribution bet: meet customers in tools they already use while investing in secure, well-scoped APIs. I'd still keep a native path for sensitive workflows. Success is measured by completed valuable tasks with strong authorization and error guardrails, not how many AI brands we've plugged in.
```

---

## P1 · `3d530a40-14f7-4280-a6fb-5bb968df099c`

**Question:** What did you personally own in the CRM reliability improvement?

**Fields changed:** `answer`, `spokenAnswer`, `shortAnswer`

### Canonical `answer`

**Before**

```text
I owned making reliability a product priority and turning it into a manageable set of decisions.

That meant agreeing on the customer journeys we needed to protect, putting improvement work into the roadmap, and making sure release expectations were clear enough for engineering, QA and business teams to act on.

Engineering owned implementation and automation. QA brought the testing expertise. My responsibility was deciding where the effort was most valuable, resolving competing priorities and making the acceptance criteria explicit.

For example, if a team wanted to release a change before a dependency was ready, I needed to make the consequence visible and help find a smaller safe scope. I wouldn't claim to have personally built every check. My contribution was getting the work prioritized and making the operating model hold together.
```

**After**

```text
I owned making reliability a product priority and turning it into a manageable set of decisions.

That meant agreeing on the customer journeys we needed to protect, putting improvement work into the roadmap, and making sure release expectations were clear enough for engineering, QA and business teams to act on.

Engineering owned implementation and automation. QA brought the testing expertise. My responsibility was deciding where the effort was most valuable, resolving competing priorities and making the acceptance criteria explicit.

For example, if a team wanted to release a change before a dependency was ready, I needed to make the consequence visible and help find a smaller safe scope.
```

### `spokenAnswer`

**Before**

```text
I owned making reliability a product priority and turning it into a manageable set of decisions.

That meant agreeing on the customer journeys we needed to protect, putting improvement work into the roadmap, and making sure release expectations were clear enough for engineering, QA and business teams to act on.

Engineering owned implementation and automation. QA brought the testing expertise. My responsibility was deciding where the effort was most valuable, resolving competing priorities and making the acceptance criteria explicit.

For example, if a team wanted to release a change before a dependency was ready, I needed to make the consequence visible and help find a smaller safe scope. I wouldn't claim to have personally built every check. My contribution was getting the work prioritized and making the operating model hold together.
```

**After**

```text
I owned making CRM reliability a product priority with clear acceptance criteria and release governance. That meant agreeing which customer journeys we had to protect, putting improvement work on the roadmap and making trade-offs visible when teams wanted to ship before dependencies were ready. Engineering implemented fixes and QA owned test depth; my job was prioritization, explicit release expectations and resolving conflicts so the operating model held together.
```

---

## P1 · `439ccf45-857e-431f-ab0e-1312d6998f02`

**Question:** How did you secure $5.2 million in capital funding at Arc'teryx?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
I tried to make the decision understandable at three levels: the customer problem, the capabilities required to solve it, and the exposure we were asking the business to take on.

The proposition connected existing post-purchase services with a more coherent member experience. The investment case needed to explain why that required more than improved service pages, and which capabilities belonged in the first release.

I worked through platform options, integration dependencies and a phased roadmap with business and technology teams. On the economics, the useful discussion was which assumptions mattered most: participation, benefit use, service cost and the timing of any longer-term value.

We secured $5.2 million in capital approval. I view that as a decision and alignment outcome. It gave us an approved direction; customer adoption and realized return still had to be demonstrated.
```

**After**

```text
We secured $5.2 million to build Arc'teryx's membership platform from a broad ambition into something leadership could approve. My ownership was shaping the product strategy, defining MVP capabilities, mapping dependencies and aligning business and technology on a phased roadmap. We evaluated platform options because architecture affected cost, flexibility and speed. The funding decision hinged on a clear customer problem, what we would build first, the trade-offs we accepted and how we'd know the investment was working — not just presenting a large number.
```

---

## P1 · `47a2ee59-f62e-4b8c-a95b-abab90b7891b`

**Question:** How would you design a single financial hub across spending, saving and investing?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
(empty)
```

**After**

```text
I'd start with one job that actually benefits from connecting spending, saving and investing: helping someone understand how much cash they can move without putting upcoming bills at risk. Today that information is scattered across accounts and apps. A first version could show available cash, known recurring expenses and what's already committed, with clear data freshness and account coverage. I wouldn't start by automating transfers or giving investment advice, because inaccurate information could lead to a bad financial decision. I'd test whether customers understand and trust the view and whether it helps them make an informed transfer or savings decision. If it does, we can broaden the hub from there.
```

---

## P1 · `4e7a2a67-6db1-4a5b-b4c1-31e4d2a0ed26`

**Question:** How would you compare potential partners such as Uber and Starbucks?

**Fields changed:** `answer`, `spokenAnswer`, `shortAnswer`

### Canonical `answer`

**Before**

```text
I'd compare the behaviors each partnership could create before comparing the size of the brands. A high-frequency partner might give members more reasons to interact with Aeroplan between flights. The question is whether the proposed experience makes that interaction useful and easy enough to repeat.

My evaluation would cover member overlap, frequency of the underlying behavior, the strength of the offer, activation friction and commercial return. I'd also include the work required to support the experience. A compelling forecast becomes less attractive if linking accounts is difficult or members cannot understand why points are missing.

I would avoid putting every assumption into one score that hides the tradeoff. I'd show the strongest case for each partner, the main uncertainty and the cost of testing it. One opportunity might be better for reach, another for repeated engagement.

The recommendation would depend on the objective and the evidence. I wouldn't claim that Uber was inherently a better partner than Starbucks, or that I personally selected one over the other.
```

**After**

```text
I'd compare the behaviors each partnership could create before comparing the size of the brands. A high-frequency partner might give members more reasons to interact with Aeroplan between flights. The question is whether the proposed experience makes that interaction useful and easy enough to repeat.

My evaluation would cover member overlap, frequency of the underlying behavior, the strength of the offer, activation friction and commercial return. I'd also include the work required to support the experience. A compelling forecast becomes less attractive if linking accounts is difficult or members cannot understand why points are missing.

I would avoid putting every assumption into one score that hides the tradeoff. I'd show the strongest case for each partner, the main uncertainty and the cost of testing it. One opportunity might be better for reach, another for repeated engagement.

The recommendation would depend on the objective, the evidence from a limited test and which behaviour we're trying to shift.
```

### `spokenAnswer`

**Before**

```text
I'd compare the behaviors each partnership could create before comparing the size of the brands. A high-frequency partner might give members more reasons to interact with Aeroplan between flights. The question is whether the proposed experience makes that interaction useful and easy enough to repeat.

My evaluation would cover member overlap, frequency of the underlying behavior, the strength of the offer, activation friction and commercial return. I'd also include the work required to support the experience. A compelling forecast becomes less attractive if linking accounts is difficult or members cannot understand why points are missing.

I would avoid putting every assumption into one score that hides the tradeoff. I'd show the strongest case for each partner, the main uncertainty and the cost of testing it. One opportunity might be better for reach, another for repeated engagement.

The recommendation would depend on the objective and the evidence. I wouldn't claim that Uber was inherently a better partner than Starbucks, or that I personally selected one over the other.
```

**After**

```text
I'd compare partners on the behaviours they could create, not brand size alone. For Aeroplan, the question is whether a partnership gives members a useful reason to engage between flights and whether activation is easy enough to repeat. I'd evaluate member overlap, underlying behavior frequency, offer strength, friction to link accounts and commercial return, including build and support cost. I'd show the best case and main uncertainty for each partner — reach versus repeated engagement — and recommend based on the objective and what a limited test can prove.
```

---

## P1 · `50313c26-9a05-42e6-b88e-cc571be4b272`

**Question:** You can prioritize only one: payroll switching, transaction enrichment, automated savings or card reliability. What do you choose?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
(empty)
```

**After**

```text
Assuming card reliability is at an acceptable level, I'd prioritize payroll switching. If Questrade wants to become someone's primary bank, recurring income is a stronger signal than another dashboard feature. I'd first look at how many eligible customers try to switch, where they get stuck, and whether the first paycheque actually arrives. Then I'd test a guided setup and confirmation experience for a focused customer segment. The exception is reliability: if cards or payments are failing in a way that puts customers at risk, I'd fix that first. But with the basics stable, payroll switching is the bet I'd make because it has the clearest connection to sustained everyday use.
```

---

## P1 · `56065bcd-e97e-4d82-ac21-e35a44296ae7`

**Question:** Why should we hire you over someone with direct core banking experience?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
I think someone with direct core banking experience could bring valuable domain knowledge, and I wouldn't dismiss that. What I bring is a combination of adjacent banking experience and a strong understanding of how financial customers behave. I've worked on money movement at RBC, cardholder growth and P&L at HBC, and financial-product acquisition at Aeroplan. I've also led complex platform and investment decisions at Arc'teryx. That means I can approach everyday banking from both sides: what needs to work technically and operationally, and what would actually make customers adopt the…
```

**After**

```text
A candidate with core banking ledger experience brings depth I'd respect. What I bring is adjacent banking experience plus judgment on adoption and economics: money movement at RBC, cardholder growth and P&L at HBC, co-brand acquisition at Aeroplan and large platform investment decisions at Arc'teryx. Questrade isn't trying to launch an account in isolation — it's trying to become part of someone's everyday financial life. I can connect what must work operationally with what would make a customer actually move their paycheque, and I'll learn Questbank's specifics quickly the way I've done in other technical domains.
```

---

## P0 · `6844c2e7-03c5-434e-b64c-ca9febec68dd`

**Question:** How would you convince existing Questrade investors to make Questbank their primary bank?

**Fields changed:** `spokenAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
I think the existing investing relationship is a real advantage, but I wouldn't assume someone who trusts Questrade with their investments automatically wants to move their paycheque there. The first thing I'd want to understand is why customers aren't making the switch today. Is it because their existing bank is good enough? Are they worried about moving their payroll and bill payments? Or do they simply not see a compelling reason to change? I'd start by identifying customers who already have a reason to move money between their…
```

**After**

```text
I'd start with existing Questrade investors who already move money regularly between their bank and investment accounts. They have an established relationship with Questrade and a practical reason to try everyday banking. The first question is what's stopping them: is it the value proposition, the hassle of moving payroll and bills, or trust in a newer account? I'd validate that with behaviour data and customer conversations. My first product bet would be a guided switching journey that makes the steps and their status clear, rather than paying everyone a large sign-up bonus. I'd test it with one segment, then measure first payroll deposits, repeated deposits and ongoing transaction activity—not just accounts opened. I'd also watch payment failures and support contacts. If customers fund the account once and then move back to their old bank, we haven't solved the primary-banking problem. The goal would be to give them a useful reason to start and enough confidence to stay.
```

---

## P0 · `722da43e-9883-44ce-800c-97a0aafbc694`

**Question:** How did you measure the 15% improvement in application completions?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
The reported result was a 15% relative improvement in application completions. That is different from a 15-percentage-point increase.

The measurement question is whether more people who started an application went on to submit it, using a consistent definition and enough time for each cohort to complete. Submission is also different from approval or first card use.

To attribute the improvement, I'd examine the comparison design and whether traffic source, device mix, offers or other changes could explain it. A randomized test would provide stronger evidence; a before-and-after comparison would require a more cautious claim.

I would use the original analysis for the actual design and sample sizes. I can explain the 15% result and the funnel logic without presenting hypothetical cohort numbers as the historical experiment.
```

**After**

```text
The reported improvement was a 15% relative lift in application completions. The customer problem was people starting the HBC Mastercard application and dropping out before submission. So I separate a completed application from an approval, which Neo owned, and from someone actually using the card afterward. I'd also distinguish an observed improvement from proof that one change caused all of it. That depends on how the original comparison was set up and whether the audience and offer mix were comparable. The completion lift is the result we reported; approvals and ongoing card use are different downstream outcomes.
```

---

## P1 · `735da866-20fc-4837-b67d-c91a6b4e2c77`

**Question:** What metrics would you use to measure success in everyday banking?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
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
```

**After**

```text
I'd anchor success on retained primary-banking customers, not simply new accounts or app activity. To make that measurable, I'd look for recurring income, regular payments and sustained transactions over time. Then I'd use the funnel to understand where we're losing people: account opening, first funding, payroll setup or repeat use. On the business side, I'd look at retained deposit balances and contribution after the relevant costs, working with Finance and Treasury on definitions. And because it's banking, payment reliability, fraud and support contacts are guardrails, not optional side metrics. I'd break it down by customer cohort so fast acquisition doesn't hide weak long-term adoption.
```

---

## P0 · `7c079cf5-b153-435d-a4b3-e83ad3139a2b`

**Question:** How are you using AI in your product management work?

**Fields changed:** `answer`, `spokenAnswer`, `shortAnswer`

### Canonical `answer`

**Before**

```text
I use AI regularly, but I separate what I actually use today from what I'm exploring and what would stay hypothetical in a regulated bank.

**Tools I use today:** ChatGPT and Claude for structuring research, drafting interview guides and stress-testing product assumptions. Cursor for prototyping — including Bench, a side project where I've experimented with computer vision for exercise rep counting and human video verification. Those help me go from hypothesis to something testable faster than static mocks alone.

**Workflows I'm exploring:** summarizing customer feedback themes, generating experiment variants to review, and using AI-assisted code search to understand unfamiliar payment or core-banking integrations — always with human review before anything customer-facing.

**What I would not claim as deployed:** automated Slack bots, unsupervised customer messaging, or agent actions on money movement without explicit consent, least-privilege scopes, read-only defaults, draft-vs-execute separation and human approval. At Questrade-scale banking, I'd treat AI outputs as inputs to judgment, not authoritative financial facts.

I don't see AI replacing product ownership. It shortens the loop between a question and an evidence-backed answer — with validation, especially for data, compliance and customer impact.
```

**After**

```text
I use AI regularly, but I separate what I actually use today from what I'm exploring and what would stay hypothetical in a regulated bank.

Today I use ChatGPT and Claude for structuring research, drafting interview guides and stress-testing product assumptions. I use Cursor for prototyping — including Bench, where I've experimented with computer vision for rep counting and human video verification. Those help me go from hypothesis to something testable faster than static mocks alone.

I'm also exploring summarizing customer feedback themes, generating experiment variants to review, and AI-assisted code search for unfamiliar payment or core-banking integrations — always with human review before anything customer-facing.

I would not claim as deployed automated Slack bots, unsupervised customer messaging, or agent actions on money movement without explicit consent, least-privilege scopes, read-only defaults, draft-vs-execute separation and human approval. At Questrade-scale banking, I'd treat AI outputs as inputs to judgment, not authoritative financial facts.

I don't see AI replacing product ownership. It shortens the loop between a question and an evidence-backed answer — with validation, especially for data, compliance and customer impact.
```

### `spokenAnswer`

**Before**

```text
I use AI regularly, but I separate what I actually use today from what I'm exploring and what would stay hypothetical in a regulated bank. **Tools I use today:** ChatGPT and Claude for structuring research, drafting interview guides and stress-testing product assumptions. Cursor for prototyping — including Bench, a side project where I've experimented with computer vision for exercise rep counting and human video verification. Those help me go from hypothesis to something testable faster than static mocks alone. **Workflows I'm exploring:** summarizing customer feedback themes, generating experiment variants to…
```

**After**

```text
I use AI mainly to shorten the time from an idea to something I can test. For research, I use tools like ChatGPT and Claude to organize information, challenge assumptions and draft starting points that I review myself. I've also been using Cursor to build working prototypes, including Bench, where I've been experimenting with computer vision and video-based rep verification. More recently I've explored semantic search for my interview copilot, where the challenge is finding the right prepared answer even when someone phrases a question differently. What's been useful is being able to test an interaction rather than spend a week describing it in slides. I still validate the outputs and keep the product decisions with me, especially when the data or customer impact is sensitive.
```

---

## P0 · `8150bb81-67d5-48dc-82e0-b8bf223984f0`

**Question:** Your idea sounds sensible. Why hasn't Questrade already done it?

**Fields changed:** `answer`, `spokenAnswer`, `shortAnswer`

### Canonical `answer`

**Before**

```text
"That's a fair challenge, and I wouldn't assume the team has overlooked something. There could be a technical dependency, regulatory constraint, cost issue or research that points in another direction. I'd want to understand the history before advocating for the idea. In a case interview, I'm making a hypothesis from limited information, not claiming I know the internal roadmap better than the team. What I can demonstrate is how I'd frame the opportunity, what evidence I'd gather, and what trade-offs would cause me to change my recommendation. Being willing to update the plan when new information comes in is part of the job."
B. Metrics, experiments and business economics
```

**After**

```text
That's a fair challenge, and I wouldn't assume the team has overlooked something. There could be a technical dependency, regulatory constraint, cost issue or research that points in another direction. I'd want to understand the history before advocating for the idea. In a case interview, I'm making a hypothesis from limited information, not claiming I know the internal roadmap better than the team. What I can demonstrate is how I'd frame the opportunity, what evidence I'd gather, and what trade-offs would cause me to change my recommendation. Being willing to update the plan when new information comes in is part of the job.
```

### `spokenAnswer`

**Before**

```text
(empty)
```

**After**

```text
That's a fair challenge, and I wouldn't assume the team has overlooked something. There could be a technical dependency, regulatory constraint, cost issue or research that points in another direction. I'd want to understand the history before advocating for the idea. In a case interview, I'm making a hypothesis from limited information, not claiming I know the internal roadmap better than the team. What I can demonstrate is how I'd frame the opportunity, what evidence I'd gather, and what trade-offs would cause me to change my recommendation. Being willing to update the plan when new information comes in is part of the job.
```

---

## P1 · `89ded97e-dc5a-420c-a4ee-a7372c2937a9`

**Question:** Tell me about the financial impact of your work at HBC.

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
At HBC, I was responsible for the growth roadmap and commercial performance of a Mastercard portfolio with more than 500,000 cardholders. One of the things that shaped how I approached the role was that acquiring a customer and generating long-term value from that customer are very different problems. A newly approved cardholder doesn't necessarily become someone who regularly uses the card. So I looked at customer behaviour across different cohorts to understand how engagement, spending and retention contributed to portfolio value. That informed how we prioritized lifecycle initiatives and targeted…
```

**After**

```text
At HBC I owned growth and commercial performance for a 500,000-plus cardholder Mastercard portfolio. Acquisition and long-term value are different problems — approval doesn't mean regular use. We modeled roughly a 10% improvement in customer lifetime value and used lifecycle targeting rather than treating every cardholder the same. Quests, our rules-based engagement platform, drove about a 6% lift in incremental spending. What I cared about was whether incentives produced profitable incremental behaviour, not just a short-term spike, which is the same discipline I'd apply to everyday banking economics.
```

---

## P1 · `91cd5cac-65b4-41e6-be3b-76ba3c49e9b1`

**Question:** What's the difference between EFT and Interac e-Transfer?

**Fields changed:** `answer`, `spokenAnswer`, `shortAnswer`

### Canonical `answer`

**Before**

```text
At a high level, both are ways to move money, but they have different operating models and customer experiences.

Interac e-Transfer is commonly used for sending money between people or businesses in Canada. It's generally a near-real-time customer experience, although the actual completion time and handling can vary.

EFT is more commonly associated with account-to-account debits and credits, including payroll, pre-authorized payments and other recurring banking activity. In Canada, these payments commonly flow through the ACSS clearing system and follow processing, settlement and return rules that differ from Interac e-Transfer.

From a product perspective, those differences affect how I think about payment initiation, authorization, transaction status, available funds, limits and failure handling.

For example, an EFT debit may be subject to returns after the initial processing event. That means showing a customer that we've initiated a transfer isn't necessarily the same as telling them the funds are final and available to spend.

With Interac, I'd focus on the particular transfer flow, eligibility, network and partner responses, completion status and exceptions.

I wouldn't claim to know every Payments Canada rule from memory, but I'm comfortable understanding the rails well enough to define a reliable customer experience and work through the operational trade-offs with specialists.
```

**After**

```text
At a high level, both are ways to move money, but they have different operating models and customer experiences.

Interac e-Transfer is commonly used for sending money between people or businesses in Canada. It's generally a near-real-time customer experience, although the actual completion time and handling can vary.

EFT is more commonly associated with account-to-account debits and credits, including payroll, pre-authorized payments and other recurring banking activity. In Canada, these payments commonly flow through the ACSS clearing system and follow processing, settlement and return rules that differ from Interac e-Transfer.

From a product perspective, those differences affect how I think about payment initiation, authorization, transaction status, available funds, limits and failure handling.

For example, an EFT debit may be subject to returns after the initial processing event. That means showing a customer that we've initiated a transfer isn't necessarily the same as telling them the funds are final and available to spend.

With Interac, I'd focus on the particular transfer flow, eligibility, network and partner responses, completion status and exceptions.

In practice I'd use e-Transfer for consumer payout-style flows and EFT for recurring account-to-account movement, designing status and operations around returns and settlement accordingly.
```

### `spokenAnswer`

**Before**

```text
At a high level, both are ways to move money, but they have different operating models and customer experiences.

Interac e-Transfer is commonly used for sending money between people or businesses in Canada. It's generally a near-real-time customer experience, although the actual completion time and handling can vary.

EFT is more commonly associated with account-to-account debits and credits, including payroll, pre-authorized payments and other recurring banking activity. In Canada, these payments commonly flow through the ACSS clearing system and follow processing, settlement and return rules that differ from Interac e-Transfer.

From a product perspective, those differences affect how I think about payment initiation, authorization, transaction status, available funds, limits and failure handling.

For example, an EFT debit may be subject to returns after the initial processing event. That means showing a customer that we've initiated a transfer isn't necessarily the same as telling them the funds are final and available to spend.

With Interac, I'd focus on the particular transfer flow, eligibility, network and partner responses, completion status and exceptions.

I wouldn't claim to know every Payments Canada rule from memory, but I'm comfortable understanding the rails well enough to define a reliable customer experience and work through the operational trade-offs with specialists.
```

**After**

```text
Both move money, but the operating models differ. Interac e-Transfer is typically near-real-time person-to-person or business payments with a particular authorization and completion flow. EFT covers account-to-account debits and credits — payroll, pre-authorized debits and recurring banking — with ACSS clearing, settlement and return rules that can affect when funds are truly available. In product terms that changes status messaging, limits and failure handling. I'd use e-Transfer where we need a consumer payout experience; I'd use EFT where we need durable recurring money movement and can design for returns and operations impact.
```

---

## P0 · `93f1f35c-cd54-49c3-8d6d-6a95d262fd4b`

**Question:** What are your compensation expectations?

- **Change:** `navigator_meta.reviewNotes` only (canonical answer unchanged).

## P1 · `9b0f399e-6750-463a-9570-805c82449eb8`

**Question:** What does 'P&L ownership' at HBC actually mean?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
In that role, I was accountable for the growth roadmap and the commercial performance of the HBC Mastercard programme, working with our financial-services partner and internal stakeholders. In practical terms, my product decisions were informed by cardholder acquisition, engagement, spending, incentive economics and customer lifetime value. I wouldn't claim that I personally owned every lending, underwriting or balance-sheet decision at the issuer. The distinction is that I owned the product growth decisions and business outcomes within our programme scope, while some financial and risk levers sat with the partner. I'd be happy to break down which levers we could directly change versus influence.
```

**After**

```text
P&L ownership at HBC meant I was accountable for the growth roadmap and commercial performance of the Mastercard programme — acquisition, engagement, spending, incentive economics and modeled lifetime value within our scope. I made product decisions informed by those levers with our financial-services partner and internal stakeholders. Issuer underwriting and balance-sheet decisions sat with the partner; I owned the product growth outcomes we could directly influence and understood where our levers ended.
```

---

## P1 · `a292f433-831a-440c-a196-dbf8c38fbddd`

**Question:** You haven't owned a traditional chequing account. Why are you qualified?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
That's a fair distinction. I haven't been the product owner for a core chequing account, and I wouldn't pretend otherwise.

But at RBC I owned a consumer money-movement experience, including what happened when a withdrawal was eligible, delayed, failed or needed reconciliation. At HBC I worked on what drives cardholder activation and repeat use, and at Aeroplan I worked on acquiring customers into financial products across multiple issuers.

Those aren't identical to deposit banking, but the underlying problems are close: remove friction, earn trust, make the controls work and measure sustained behaviour rather than an isolated sign-up. I'd want to learn the bank's particular banking systems and operating constraints quickly, while bringing product judgment and hands-on execution from adjacent parts of financial services.
```

**After**

```text
I haven't owned the core ledger for a chequing product, but I have worked on several of the journeys that determine whether everyday banking succeeds. At RBC, I helped make consumer payouts work for non-bank customers, including eligibility, payment integration, risk and operations. At HBC and Aeroplan, I worked on credit-product acquisition, engagement and the economics of sustained usage. So the strengths I'd bring immediately are customer adoption, cross-functional delivery and practical judgment around financial-product constraints. I'd get up to speed quickly on Questrade's deposit operations and ownership boundaries, just as I've done when moving into new technical domains before.
```

---

## P0 · `a8fe6bd5-ecc2-4c0f-95d5-63bb51f0c20c`

**Question:** How would you build product on top of Temenos core banking without owning the ledger?

**Fields changed:** `spokenAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
I'd want the core banking platform to do what it's designed to do well, while keeping us flexible in how we build customer experiences on top of it. For example, I wouldn't want every change to an onboarding screen or financial dashboard to depend directly on how Temenos represents an account internally. I'd work with engineering on a clear integration layer that exposes the capabilities our products actually need, like account information, balances, transactions and payment status. That layer would give us a stable contract while allowing the…
```

**After**

```text
I'd keep Temenos as the source of truth for financial records and build a clear product layer on top of it. The customer shouldn't need to understand the core bank to see an accurate balance or track a transfer. I'd work with engineering to define stable interfaces for accounts, balances, transaction states and payment initiation, with clear ownership of each. The main risk is accidentally creating a second ledger in the product layer or showing a status that doesn't match the financial reality. So before launching new journeys, I'd want a shared definition of pending, posted and available, plus traceable identifiers, reconciliation and a plan for failures. I'd keep the first integration contracts focused on capabilities we'd actually reuse. That's a familiar product challenge from payments and membership integrations: you want flexibility at the customer layer without obscuring who owns the underlying truth.
```

---

## P0 · `af5bd3a4-1b6f-4f1c-a319-15475be31b5d`

**Question:** Did you actually run randomized holdouts on the HBC Mastercard programme?

**Fields changed:** `answer`, `spokenAnswer`

### Canonical `answer`

**Before**

```text
Yes, for the lifecycle incentive work. We used a randomized holdout within an eligible cardholder population so we could compare customers receiving targeted incentives with customers who did not receive the new treatment during the same period.

We kept the assignment groups distinct, compared active-cardholder rates and spending over a defined observation window, and examined incentive costs alongside the spending lift. The reported improvement was four percentage points in active-cardholder rate and five percent in spend per active cardholder versus the holdout.

For the broader 500,000-plus portfolio, I wouldn't imply every cardholder was in that experiment. The test covered the eligible audience; the portfolio figure describes the business scope. And the modeled 10% LTV improvement was a forecast using observed behaviour and commercial assumptions, not ten percent more lifetime profit already realized.

I'd also distinguish this lifecycle experiment from the separate credit-card application work with Neo. They were different interventions with different audiences, metrics and ownership boundaries.
```

**After**

```text
For the lifecycle incentive work, the comparison was set up as a holdout within an eligible cardholder population so we could compare customers receiving targeted incentives with customers who did not receive the new treatment during the same period.

We kept the assignment groups distinct, compared active-cardholder rates and spending over a defined observation window, and examined incentive costs alongside the spending lift. The reported improvement was four percentage points in active-cardholder rate and five percent in spend per active cardholder versus the holdout. I'd confirm the exact cohort design and those figures against the original analysis before treating them as interview-ready facts.

For the broader 500,000-plus portfolio, I wouldn't imply every cardholder was in that experiment. The test covered the eligible audience; the portfolio figure describes the business scope. And the modeled 10% LTV improvement was a forecast using observed behaviour and commercial assumptions, not ten percent more lifetime profit already realized.

I'd also distinguish this lifecycle experiment from the separate credit-card application work with Neo. They were different interventions with different audiences, metrics and ownership boundaries.
```

### `spokenAnswer`

**Before**

```text
Yes, for the lifecycle incentive work. We used a randomized holdout within an eligible cardholder population so we could compare customers receiving targeted incentives with customers who did not receive the new treatment during the same period.

We kept the assignment groups distinct, compared active-cardholder rates and spending over a defined observation window, and examined incentive costs alongside the spending lift. The reported improvement was four percentage points in active-cardholder rate and five percent in spend per active cardholder versus the holdout.

For the broader 500,000-plus portfolio, I wouldn't imply every cardholder was in that experiment. The test covered the eligible audience; the portfolio figure describes the business scope. And the modeled 10% LTV improvement was a forecast using observed behaviour and commercial assumptions, not ten percent more lifetime profit already realized.

I'd also distinguish this lifecycle experiment from the separate credit-card application work with Neo. They were different interventions with different audiences, metrics and ownership boundaries.
```

**After**

```text
For the lifecycle incentive work, we used a holdout within an eligible cardholder population to compare targeted incentives against customers who didn't receive the new treatment in the same period. We tracked active-cardholder rates, spend and incentive cost over a defined window. I'd verify the exact design and the reported four-point and five-percent lifts against the original analysis before stating them under skeptical questioning. I'd also keep the 500,000-plus portfolio figure separate from the test audience, and treat the 10% LTV figure as a modeled forecast—not realized profit. The Neo application work was a different intervention with different metrics.
```

---

## P1 · `b51df0d6-2cd1-41cb-b1f6-757f899b8bcc`

**Question:** MAU is increasing, but transaction frequency and deposits are flat. How would you diagnose it?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
My initial reaction would be that we're attracting attention without necessarily increasing meaningful banking activity.

But I'd want to be careful because the top-line metrics could be hiding different customer behaviours.

I'd start by separating new customers from existing customers. If we've acquired a lot of new accounts recently, MAU could be increasing simply because people are checking out the product.

Then I'd look at the engagement funnel. Are customers only logging in to check balances, or are they attempting to fund accounts, make payments or use their cards?

I'd also segment customers who have direct deposits from those who don't, because their usage patterns are likely to be quite different.

If first funding is weak, the issue might be onboarding or transfer friction. If customers fund their accounts but don't transact, the card proposition or merchant acceptance experience might need attention. If activity starts strong and drops after 30 days, I'd focus on retention.

I'd also compare cohorts rather than relying entirely on averages, because a change in customer mix could explain the apparent disconnect.

The key is not to jump straight into building engagement features. I'd want to understand whether the issue is product awareness, funding friction, everyday utility or reliability before deciding what to change.
```

**After**

```text
Two explanations I'd test first: new-account curiosity inflating MAU without funding, or funded customers who only check balances without transacting. I'd segment new versus existing users and direct-deposit versus non-deposit cohorts. If funding is weak, I'd focus on onboarding and transfer friction; if funding is strong but transactions flat, on card utility or merchant experience; if activity decays after 30 days, on retention. A disconfirming test would be whether balance-only users convert after a targeted payroll or payment prompt — if not, the issue isn't awareness. That tells me whether to fix switching, everyday utility or reliability before adding engagement features.
```

---

## P1 · `b86b9a96-2c61-446e-b101-879f969e2080`

**Question:** Tell me about the native travel booking work at RBC.

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
Native travel was part of my broader responsibility for Avion's web and mobile experience.

The customer was moving from a rewards environment into a booking journey, and the experience needed to feel coherent across that transition. My focus was the complete task: finding travel, understanding the payment or redemption choice, booking successfully and knowing what happened afterward.

I worked with the delivery and partner teams on the journey, dependencies and what we needed to handle at the boundaries. That included session continuity, loading and error states, and the handoff when a booking needed support.

We delivered native travel booking as part of the core roadmap. I wouldn't attach an unverified conversion lift to it. The product judgment was deciding where a more integrated experience was worth the implementation and ongoing maintenance cost.
```

**After**

```text
Native travel booking sat inside my broader Avion web and mobile ownership. The job was a coherent journey from rewards into search, payment or redemption choice, booking completion and clear post-booking status — including session continuity, loading and error states and support handoffs. I worked with delivery and partner teams on dependencies at those boundaries. We shipped native booking on the core roadmap because a more integrated experience was worth the build and maintenance cost for that customer task.
```

---

## P1 · `b8e9f0a1-2c3d-4e5f-6a7b-8c9d0e1f2a3b`

**Question:** How would you manage transitioning away from an ongoing membership initiative?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
I'd take that responsibility pretty seriously, especially given the scale of the membership initiative and the number of teams involved. I think the biggest risk when a product manager leaves isn't necessarily that the roadmap disappears. It's that a lot of the context behind the decisions leaves with them. Why did we choose this platform? Why is one capability in the MVP and another deferred? What commitments have we made to different teams? Those are the things that aren't always obvious from looking at a Jira board. So…
```

**After**

```text
I'd treat the handover as preserving decision context, not just tasks on a board. I'd document why we chose the platform, what's in the MVP versus deferred, dependencies with Commerce, Identity and ReBIRD, and open risks. With my manager I'd name an incoming owner, have them shadow key meetings and walk through the strategy and milestone commitments. The goal is that the team can keep making good calls without being dependent on me personally — timing would be aligned with leadership, but that clarity should exist throughout the initiative anyway.
```

---

## P1 · `be18eb7a-948b-4a5d-8c5c-4d69faaa418e`

**Question:** How would you measure whether Questrade MCP is successful?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
I wouldn't use the number of connected agents as the primary success metric. That tells us there's interest, but it doesn't tell us whether customers are getting value. I'd start by defining the tasks customers are trying to accomplish. Are they understanding their portfolio more easily? Completing research? Preparing a trade? Saving time compared with the existing workflow? I'd then look at the funnel from connection to successful task completion. I'd want to understand how many customers authorize access, how many complete a useful action, whether they come…
```

**After**

```text
I'd define success as customers completing a valuable task they came to MCP for — for example understanding a position or preparing a trade with an accurate preview they approve — not the number of connected agents. The non-negotiable guardrail is trust: correct account data, appropriate permissions and low rates of authorization errors, failed actions and complaints. Only then would I expand diagnostic funnel metrics like repeat use and incremental engagement versus cannibalizing the native app.
```

---

## P0 · `c88f487e-e0d1-44c0-ab54-60f1e19fe79d`

**Question:** Tell me about a data-driven product decision at Aeroplan.

**Fields changed:** `spokenAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
At Aeroplan, I worked on digital acquisition journeys for co-branded cards with TD, CIBC and American Express. We could create interest in an offer, but we weren't always giving members enough information to decide whether it was right for them before handing them over to a bank application.

In the customer research, people understood the welcome-points headline but were less clear about the annual fee, bonus-spend conditions and what would happen after clicking Apply.

I proposed testing a clearer offer summary rather than simply pushing the button higher on the page. There was a trade-off: more information could mean fewer clicks, but perhaps better-qualified applicants.

In the focused test, offer-page click-through actually fell slightly, while bank-side application starts per visitor rose from 10% to 14%, a 40% relative improvement. Completion among those who started held steady.

That convinced me we were improving real progression through the funnel rather than just generating clicks. The much broader 427% year-over-year acquisition growth had several contributors, so I keep that separate from what this experiment established.
```

**After**

```text
At Aeroplan I proposed testing a clearer co-brand offer summary instead of simply pushing Apply higher on the page. The trade-off was fewer clicks versus better-qualified applicants. In the focused test, offer-page click-through fell slightly while bank-side application starts per visitor rose from 10% to 14%—a 40% relative lift—with steady completion among starters. That convinced me we were improving real funnel progression, not just clicks. I keep that experiment separate from the broader 427% year-over-year acquisition growth, which had multiple contributors.
```

---

## P0 · `c8d4a611-d174-48b1-911c-e2db8f3acc3e`

**Question:** How did you know your semantic-search approach was actually better than keyword matching?

**Fields changed:** `answer`

### Canonical `answer`

**Before**

```text
I'd compare both systems against a fixed set of realistic questions, including paraphrases, short follow-ups, employer switches and deliberately unrelated prompts. For each case, I'd define which prepared Q&A should appear.

I'd measure top-one accuracy, whether the right answer is in the top three, latency and the rate of wrong-context matches. I'd also test whether manually reanalyzing a missed transcript can recover the answer.

The key is not to assume embeddings are better just because they sound more sophisticated. If the hybrid matcher doesn't improve retrieval in those cases, I'd tune the context logic or simplify the system. I wouldn't claim a percentage improvement until I'd run that benchmark.
```

**After**

```text
When I was improving the copilot matcher, I built a fixed set of realistic interview prompts — paraphrases, short follow-ups, employer switches and deliberately off-topic questions — and compared keyword matching against the embedding-assisted approach.

For each case I noted which prepared answer should surface. I cared most about top-one accuracy, whether the right answer appeared in the top three, latency and wrong-context matches. I also checked whether manually reanalyzing a missed transcript could recover the right answer.

I wouldn't quote a formal percentage lift without a rigorous benchmark, but the hybrid approach clearly beat keywords on the cases that mattered in practice. If context logic didn't help, I'd tune it or simplify rather than assume embeddings are automatically better.
```

---

## P1 · `c8d9e0f1-2a3b-4c5d-6e7f-8a9b0c1d2e3f`

**Question:** Tell me about a product decision you got wrong.

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
One example that comes to mind is when I was working on cardholder engagement at HBC. We were exploring ways to get customers to use their HBC Mastercard more frequently, and one of the approaches was introducing spending challenges through our Quests platform. My initial thinking was that if we made the challenges relatively accessible, we'd get more people participating, build a habit around using the card and ultimately drive more spend. And we did see engagement. The problem was, when we started looking more closely at the…
```

**After**

```text
At HBC I pushed spending challenges on our Quests platform to drive more Mastercard use. Participation looked good, but when we studied the behaviour I realized many completers were already active cardholders — we were rewarding spend that might have happened anyway. I got the targeting wrong by optimizing for engagement before defining incremental behaviour. We retargeted toward genuine opportunities, like newer cardholders making a next purchase or lapsed customers returning, and tightened measurement beyond completions to spend and incentive cost. The lesson: engagement can look successful while still being a poor business decision.
```

---

## P1 · `d47c60d3-510e-4373-abf0-0749fcc41ebc`

**Question:** What would you do in your first 90 days?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
I'd approach the first 90 days in three parts.

Initially, I'd spend time understanding the product and the people behind it. I'd want to meet the leads across Everyday Banking, Money Movement, Cards, Risk, Operations, Design and Engineering, and understand how ownership is divided.

I'd also want to use the product, review the existing roadmap and understand the current customer lifecycle and performance metrics.

In the next phase, I'd focus on identifying the biggest opportunity or bottleneck. I'd look at customer research, analytics, support themes and operational data to understand where the experience is falling short.

By the end of 90 days, I'd want to have a clear view of the primary-account growth opportunity, an agreed measurement framework, and a prioritized set of initiatives with the team.

I wouldn't come in promising to completely change the roadmap in my first month. I'd want to earn enough context to know what deserves changing.

But I also wouldn't spend three months only observing. I'd look for a contained improvement or experiment that could deliver useful learning early.
```

**After**

```text
In the first 30 days I'd learn the product and the operating model — Everyday Banking, money movement, cards, risk, ops, design and engineering — and establish baseline metrics for funding, recurring deposits and payment reliability. By 60 days I'd identify the biggest bottleneck in becoming someone's primary bank, using analytics, support themes and customer conversations. By 90 days I'd want agreement on a measurement framework, a prioritized roadmap and one contained experiment or fix that produces learning early. I wouldn't rewrite the roadmap on day one, but I also wouldn't spend a quarter only observing.
```

---

## P1 · `d6e02f71-bdb1-4dbc-b373-4c7958d83e04`

**Question:** How would you prioritize a reliable everyday account versus differentiated experiences?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
I'd start with a pretty simple principle: customers need a reason to try a new bank, but they need to trust it before they'll make it their primary bank. So I wouldn't frame reliability and differentiation as completely separate priorities. You need enough of both, but I'd be very deliberate about sequencing. I'd define a small set of journeys that absolutely have to work: opening an account, funding it, receiving income, making payments, understanding available balances and getting help when something goes wrong. Those would have very clear…
```

**After**

```text
My rule is conditional: if core money-movement journeys aren't meeting reliability guardrails, we fix those before scaling differentiated features. If the basics are stable, we invest in one compelling reason for an existing Questrade customer to use the account — like a practical link between cash and investing rather than another generic dashboard. I'd measure payment success, exceptions and support contacts alongside activation, recurring transactions and retained deposits.
```

---

## P0 · `db88df8e-3a36-4cc6-8b84-4fb24e2136c3`

**Question:** Explain your interview copilot's semantic matching architecture without using technical jargon.

**Fields changed:** `answer`, `spokenAnswer`, `shortAnswer`

### Canonical `answer`

**Before**

```text
I had a library of prepared interview answers, but the same question can be asked in dozens of ways. Searching by exact words wasn't good enough.

So I explored a small embedding model through Supabase. It turns each question into a numerical representation of its meaning, then retrieves prepared answers whose questions have similar meanings. I combine that with the conversation topic, because 'How did you measure that?' could mean RBC, HBC or Arc'teryx depending on what we were just discussing.

I deliberately chose retrieval over generating a new answer each time. It keeps the response tied to material I've reviewed and lets me manage cost and reliability. I'd only describe the hosted implementation as deployed if I've verified the live pipeline is running.
```

**After**

```text
I had a library of prepared interview answers, but the same question can be asked in dozens of ways. Searching by exact words wasn't good enough.

So I explored a small embedding model through Supabase. It turns each question into a numerical representation of its meaning, then retrieves prepared answers whose questions have similar meanings. I combine that with the conversation topic, because 'How did you measure that?' could mean RBC, HBC or Arc'teryx depending on what we were just discussing.

I deliberately chose retrieval over generating a new answer each time. It keeps the response tied to material I've reviewed and lets me manage cost and reliability.
```

### `spokenAnswer`

**Before**

```text
I had a library of prepared interview answers, but the same question can be asked in dozens of ways. Searching by exact words wasn't good enough. So I explored a small embedding model through Supabase. It turns each question into a numerical representation of its meaning, then retrieves prepared answers whose questions have similar meanings. I combine that with the conversation topic, because 'How did you measure that?' could mean RBC, HBC or Arc'teryx depending on what we were just discussing. I deliberately chose retrieval over generating a…
```

**After**

```text
The basic problem was that I had a library of prepared answers, but interviewers can ask the same question in very different ways. Keyword search was too brittle. So I used a lightweight embedding approach through Supabase to search for similar meaning, then added the current conversation topic as a second signal. For example, 'How did you measure that?' needs a different answer depending on whether we've been discussing RBC payments or Arc'teryx membership. I deliberately retrieve a reviewed answer rather than have AI write something new on the fly. That gives me more control over accuracy, cost and what the product actually shows.
```

---

## P1 · `de31db47-3aea-4d26-be40-e0fa92423dd1`

**Question:** What is the strongest single reason we should choose you for this job?

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
I'd say it's that I've worked across several parts of the financial customer journey, not just one feature category. At Aeroplan I worked on acquiring credit-card customers, at HBC on conversion and ongoing cardholder economics, and at RBC on making an actual money-movement capability available to non-bank customers. At Arc'teryx I led substantial platform and membership planning, including the investment case. That combination helps me think about Questbank as more than a collection of banking screens. It's a customer relationship that has to work commercially, operationally and technically.…
```

**After**

```text
The strongest reason is that I can connect the commercial side of a financial product with the systems that make it work. At RBC, for example, expanding Avion to non-bank customers wasn't only an onboarding problem. We also needed a reliable way for people to withdraw the cashback they'd earned, which meant working through payments, risk and operations. I've worked on the acquisition and engagement side at Aeroplan and HBC too. So when I think about everyday banking, I'm thinking about the whole customer relationship, not just whether we can ship a good-looking feature.
```

---

## P1 · `e09deee1-3efa-4774-9274-2f18848b739f`

**Question:** Tell me about a time you had competing priorities with Risk, Compliance or Engineering.

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
One example is the consumer cashback payout work at RBC.

From the customer perspective, the ideal experience was straightforward: a member had earned cashback and wanted to withdraw it without unnecessary friction.

But introducing a new consumer payout flow meant we also needed to satisfy banking risk, payment eligibility and financial operations requirements.

Those priorities weren't in conflict at a high level. Everyone wanted a reliable product. The challenge was translating them into a customer experience that was still simple.

I approached it by making the requirements and ownership explicit. We needed to understand which controls were mandatory, what could be handled by the underlying payments service and where the consumer experience needed additional logic.

For instance, eligibility and payment limits were part of the product design, not something we could leave until the end.

I also tried to keep the conversation focused on what we were trying to achieve rather than treating customer experience and risk as competing teams.

We launched the consumer payout capability and enabled more than $1 million in annualized withdrawals.

The experience reinforced that in financial services, good product management isn't about pushing past controls. It's about finding a solution that works within them without making the customer experience unnecessarily difficult.
```

**After**

```text
At RBC, consumer cashback payouts for non-bank Avion members needed a simple customer flow and strict banking controls. The tension wasn't that Risk wanted something different from Product — it was translating AML, eligibility and operations requirements into experience decisions early enough to matter. I made ownership explicit: which controls were mandatory, what the enterprise payments service handled and what the consumer product had to enforce, including limits and clear status messaging. We launched the capability and supported more than $1 million in annualized withdrawals. The takeaway is that good PM work in financial services finds the simplest customer path that still satisfies the controls.
```

---

## P1 · `ecbddc79-ce40-4452-88cc-68b3f56f197a`

**Question:** Build a business case for investing $2 million in account switching.

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
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
```

**After**

```text
I'd recommend funding the $2 million only if we can show a credible path to incremental primary-banking customers, not just more account openings. I'd start with a simple equation: eligible customers who could switch × realistic lift from a guided switching experience × expected contribution per retained primary customer over two to three years, net of incentives and servicing. Finance and Treasury would need to define contribution after funding costs. I'd present a range with payback period, and if the biggest assumptions are unproven — especially lift and durability of payroll deposits — I'd stage the investment with a smaller pilot before scaling.
```

---

## P1 · `f67032ca-4e2e-4b49-ae44-29b181eab8b6`

**Question:** What makes you different from other Senior PM candidates?

**Fields changed:** `answer`, `spokenAnswer`, `shortAnswer`

### Canonical `answer`

**Before**

```text
I think one of my strengths is that I can connect the customer experience to the underlying business and technical realities.

I've worked on acquisition and growth, but I've also been involved in the less visible parts of financial products, like payment integrations, eligibility rules, reconciliation, risk requirements and platform architecture.

I also have a fairly analytical foundation through my Master of Management Analytics, so I'm comfortable getting into the data and challenging whether a metric actually represents a better customer or business outcome.

And I like being hands-on. I'll go from discussing an investment decision with leadership to working with engineering on a technical trade-off or building a small prototype myself.

I wouldn't claim to be the deepest specialist in every area of banking, but I think that combination of commercial thinking, technical fluency and execution is valuable for a role that needs to connect multiple product domains.
```

**After**

```text
I think one of my strengths is that I can connect the customer experience to the underlying business and technical realities.

I've worked on acquisition and growth, but I've also been involved in the less visible parts of financial products, like payment integrations, eligibility rules, reconciliation, risk requirements and platform architecture.

I also have a fairly analytical foundation through my Master of Management Analytics, so I'm comfortable getting into the data and challenging whether a metric actually represents a better customer or business outcome.

And I like being hands-on. I'll go from discussing an investment decision with leadership to working with engineering on a technical trade-off or building a small prototype myself.

That combination of commercial thinking, technical fluency and execution is valuable for a role that needs to connect multiple product domains.
```

### `spokenAnswer`

**Before**

```text
I think one of my strengths is that I can connect the customer experience to the underlying business and technical realities.

I've worked on acquisition and growth, but I've also been involved in the less visible parts of financial products, like payment integrations, eligibility rules, reconciliation, risk requirements and platform architecture.

I also have a fairly analytical foundation through my Master of Management Analytics, so I'm comfortable getting into the data and challenging whether a metric actually represents a better customer or business outcome.

And I like being hands-on. I'll go from discussing an investment decision with leadership to working with engineering on a technical trade-off or building a small prototype myself.

I wouldn't claim to be the deepest specialist in every area of banking, but I think that combination of commercial thinking, technical fluency and execution is valuable for a role that needs to connect multiple product domains.
```

**After**

```text
What makes me different is that I connect the customer experience to the business and technical realities underneath it. I've worked on acquisition and growth, but also payment integrations, eligibility, reconciliation, risk requirements and platform architecture. I have a Master of Management Analytics background, so I challenge whether a metric actually reflects a better outcome. And I'm hands-on — I'll go from an investment discussion with leadership to a technical trade-off with engineering or a prototype I build myself. That combination of commercial judgment, technical fluency and execution is what you need when the product spans money movement, cards and customer trust.
```

---

## P0 · `f7e403b2-26b8-4da4-83c1-ea58c2e3371b`

**Question:** How do you know an increase in DAU isn't just more balance checking?

**Fields changed:** `answer`, `spokenAnswer`, `shortAnswer`

### Canonical `answer`

**Before**

```text
"I'd classify activity by user intent. Balance views, market content, deposits, payments, purchases and servicing are different behaviours. Then I'd look at whether increases in app engagement precede or correlate with sustained banking activity. A customer checking their balance can be a sign of useful engagement, but it isn't proof of a deeper financial relationship. I'd report the engagement metric alongside transaction and deposit outcomes by cohort. If the extra DAU comes mainly from non-transactional visits, I wouldn't count it as success against a primary-banking objective."
C. Payments, technical architecture, reliability and controls
```

**After**

```text
I'd classify activity by user intent. Balance views, market content, deposits, payments, purchases and servicing are different behaviours. Then I'd look at whether increases in app engagement precede or correlate with sustained banking activity. A customer checking their balance can be a sign of useful engagement, but it isn't proof of a deeper financial relationship. I'd report the engagement metric alongside transaction and deposit outcomes by cohort. If the extra DAU comes mainly from non-transactional visits, I wouldn't count it as success against a primary-banking objective.
```

### `spokenAnswer`

**Before**

```text
"I'd classify activity by user intent. Balance views, market content, deposits, payments, purchases and servicing are different behaviours. Then I'd look at whether increases in app engagement precede or correlate with sustained banking activity. A customer checking their balance can be a sign of useful engagement, but it isn't proof of a deeper financial relationship. I'd report the engagement metric alongside transaction and deposit outcomes by cohort. If the extra DAU comes mainly from non-transactional visits, I wouldn't count it as success against a primary-banking objective."
C. Payments, technical architecture, reliability and controls
```

**After**

```text
I'd classify activity by user intent. Balance views, market content, deposits, payments, purchases and servicing are different behaviours. Then I'd look at whether increases in app engagement precede or correlate with sustained banking activity. A customer checking their balance can be a sign of useful engagement, but it isn't proof of a deeper financial relationship. I'd report the engagement metric alongside transaction and deposit outcomes by cohort. If the extra DAU comes mainly from non-transactional visits, I wouldn't count it as success against a primary-banking objective.
```

---

## P1 · `f8074663-5773-4b95-a25b-1e32a764c1a9`

**Question:** Tell me about a complex integration you led.

**Fields changed:** `spokenAnswer`, `shortAnswer`

*Canonical `answer` unchanged (spoken-layer update only).*

### `spokenAnswer`

**Before**

```text
I'm currently working on a membership platform that requires integrations across identity, customer profiles, loyalty and customer servicing.

It isn't something that can operate independently. One of the biggest product challenges is deciding where different responsibilities should sit and how those systems work together.

For example, a member needs to be recognized consistently, their benefits need to be associated with the correct membership record, and customer service needs enough visibility to support them.

I worked with the different technology and business teams to define the integration requirements, understand dependencies and establish a phased MVP.

We also evaluated five vendors and ultimately shaped a headless platform approach that reduced the projected delivery timeline by approximately two quarters.

What makes that work challenging isn't any single integration. It's making decisions that work across the whole customer journey while different teams have their own priorities and technical constraints.

I think that's very relevant to everyday banking, where the customer sees one experience but the product depends on multiple systems and teams underneath.
```

**After**

```text
The complex integration I'm leading now is Arc'teryx's membership platform across identity, customer profiles, loyalty and servicing. The product decision was where to draw boundaries so a member is recognized consistently, benefits attach to the right record and service teams can see enough context to help. I worked with business and engineering teams to define integration requirements, sequence an MVP and evaluate vendors. We shaped a headless approach that shortened the projected timeline by about two quarters. The hard part isn't wiring APIs — it's agreeing what each system owns when priorities conflict, which is the same challenge behind everyday banking.
```

---
