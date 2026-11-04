# Bristol ↔ Jaz shared questions and answers

Generated 2026-11-04 from `bristol-focused-curated.json`, `bristol-canonical-answers.json` (runtime resolution), and `questrade-jaz-curated.json`.

## How to read this

| | Bristol (Focused) | Jaz (Focused) |
|---|---|---|
| **Same question text** | 4 pairs use identical interviewer wording | Same |
| **Same answer text** | **None** — Bristol uses OpenTable-specific overrides or rewrites | Questrade framing where relevant |
| **Shared source** | Some Bristol rows trace to the same Questrade library UUIDs (`canonicalAnswerId`) that Jaz stories were derived from; Jaz does not resolve those UUIDs at runtime (inline answers only). |

Below: **14 paired entries** — same career stories or behavioral prompts we prepared for both interviews. Each section shows the **question Bristol uses**, the **question Jaz uses** (if different), then **both spoken answers as shown in each navigator**.

---

## B01 (Bristol) ↔ Q01 (Jaz)

**Bristol question:** Tell me about yourself.

### Bristol answer (`/live/bristol`)

Sure. I've spent a little over nine years in product, mostly across consumer technology, financial services, loyalty and growth.

At Arc'teryx I've been leading the strategy for a new membership proposition — building the business case, securing about $5.2 million in funding, and bringing a fairly complex set of technology and operating teams around an MVP.

Before that, I was at RBC Avion, where I worked on opening the platform to non-RBC customers and led the consumer product work for cashback withdrawals through Interac e-Transfer. Earlier, at HBC and Aeroplan, my focus was more commercial: acquisition, activation, spending and retention.

So I've had a mix of building new products and improving the economics of established ones. OpenTable interests me because those skills come together in a product that's genuinely used in a live business — one where a better decision about demand or capacity can make a difference that evening. The AI component is exciting, but it's the restaurant problem that makes the role compelling.

### Jaz answer (`/live/jaz`)

Sure. I've spent the last nine-plus years in product, mostly working on digital consumer experiences, financial products, and the platforms that support them.

I'm currently a Senior Product Manager at Arc'teryx, where I've been leading the product work for a new membership program focused on things like product care, repairs, and trade-ins.

It's been a pretty complex zero-to-one initiative. We secured $5.2 million in funding, evaluated different technology solutions, and I've been working across business and engineering teams to define what a realistic first release looks like, given the legacy systems and integration dependencies involved.

Before that, I was at RBC working on Avion Rewards, where I owned core experiences across web and mobile. One of the things we worked on was making cashback easier to earn through ShopPlus, a browser extension that brought relevant offers directly into people's online shopping experience.

We also expanded Avion to non-RBC customers, which introduced interesting challenges around identity, onboarding, and how those customers could access their rewards. I led the consumer product work for cashback withdrawals through Interac e-Transfer, integrating with RBC's existing payments infrastructure and working closely with Risk and Financial Operations.

Earlier in my career, I was at HBC managing growth for its Mastercard portfolio, including improving the digital credit application experience. And before that, I was at Aeroplan working on credit card acquisition with TD, CIBC, and American Express.

So I've had the opportunity to work across different parts of the financial customer journey, from acquisition and onboarding to payments, spending, and ongoing engagement.

What interests me about Questrade is the opportunity to bring those experiences together. You're not just trying to get someone to open another account. You're trying to become the place where they actually manage their everyday finances, and I think that's a really interesting product challenge.

---

## B40 (Bristol) ↔ Q15 (Jaz)

**Bristol question:** Walk me through the RBC Interac cashback withdrawal product end to end.

### Bristol answer (`/live/bristol`)

At RBC, we were opening Avion Rewards to non-RBC customers. Existing RBC banking customers could receive cashback into their RBC account, but these new members didn't have one. We needed a way for them to withdraw what they'd earned without becoming a banking customer.

We used Interac e-Transfer through an existing enterprise payments capability rather than building a payout rail from scratch. I owned the consumer product requirements and coordinated across engineering, AML, Risk and Financial Operations. The work went well beyond the request itself: eligibility and limits, how payouts were initiated, status and failure handling, settlement and reconciliation, and what customers needed to understand about timing.

We ultimately supported about 3,200 withdrawal requests a quarter, with roughly 99% confirmed within 24 hours — around $1.2 million annualized. The broader enterprise payments service handled more than five million settlement events annually; that figure wasn't generated by our feature alone.

My takeaway is that a simple customer promise depends on a lot of unglamorous operational detail. That's relevant to restaurant product too: the front-end interaction only works if the underlying service can reliably deliver it.

### Jaz answer (`/live/jaz`)

At RBC, one of the products I led was enabling cashback withdrawals for Avion members who weren't RBC banking customers.

The shopping experience and earning capability already existed, and RBC customers could receive cashback through their deposit accounts. The new challenge with opening Avion to non-bank customers was how to get their earned cashback to them without requiring them to open an RBC account.

We leveraged an existing enterprise payments capability and integrated Interac e-Transfer rather than build a separate payment service.

I owned the consumer experience and product requirements, coordinating engineering, enterprise payments, AML, Risk, and Financial Operations.

There were several product and systems considerations: who was eligible, how much cashback was available, how to communicate a request versus a completed transfer, what happened when a payment failed or expired, and how the records of cashback redeemed matched actual payouts.

We needed the experience to feel straightforward to the customer while respecting the operational and financial controls behind it.

The product supported about 3,200 withdrawal requests per quarter, roughly 99% processed within 24 hours, and about $1.2 million in annualized payouts.

One distinction I always make is that the enterprise payments service handled a much larger volume—more than five million annual settlement events—but that wasn't the volume of this specific cashback feature.

The lesson was that shipping a payment experience isn't just exposing an endpoint. You have to make sure it behaves predictably across the customer journey, controls, payment status, and reconciliation.

---

## B41 (Bristol) ↔ Q35 (Jaz)

**Bristol question:** Tell me about expanding Avion to non-RBC customers (Avion Select).

**Jaz question:** Tell me about a time you had to prioritize between two important initiatives.

### Bristol answer (`/live/bristol`)

Avion Select was RBC's expansion of Avion Rewards beyond customers who already banked with RBC.

That sounds like opening up a sign-up funnel, but it changes foundational assumptions. Non-RBC members don't arrive with the same identity and account relationship, so onboarding, authentication, eligibility and access to rewards all need to work differently. We also needed a practical cashback withdrawal mechanism, which is where the Interac e-Transfer work fitted into the broader proposition.

I led core consumer product work and worked with identity, platform, risk and payments stakeholders to make those experiences usable together. Avion Select grew to around 500,000 members.

I think the lesson is that entering a new customer segment often exposes platform assumptions that were invisible when you served only the original audience. I'd expect a similar challenge when taking a restaurant operating product into a market with different workflows.

### Jaz answer (`/live/jaz`)

Yeah, one example would be at RBC, when we were working on expanding Avion Rewards to customers who didn't bank with RBC.

At the same time, we had other improvements on the roadmap, including moving more of the travel-booking experience natively into our mobile apps.

Both were valuable initiatives.

The native travel experience would have improved an existing journey, particularly around making it feel more seamless within the app.

But Avion Select was opening the platform to an entirely new customer segment, and there were some fairly fundamental capabilities we needed to get right.

For example, existing RBC customers could receive cashback directly into their bank accounts. Non-RBC customers couldn't, so the expansion required us to support a separate withdrawal method through Interac e-Transfer.

We also had additional identity and onboarding requirements.

The challenge was that both initiatives were drawing on capacity across our web and mobile squad, along with integration and testing dependencies.

So I looked at the customer consequence of delaying each initiative.

With travel, customers already had a functioning booking experience through the existing web-based journey. It wasn't ideal, but they could still accomplish what they needed.

With Avion Select, launching without reliable onboarding and a way for customers to actually receive their cashback would mean bringing people into a rewards program without delivering the full value proposition.

So my recommendation was to protect the end-to-end Avion Select launch, including the payout capability, and sequence the broader native travel work afterward.

That meant being clear about what was essential for launch, aligning with the dependent teams, and keeping the travel improvements on the roadmap rather than allowing them to disappear.

The broader Avion Select proposition went on to reach roughly 500,000 members, and the Interac withdrawal capability supported around 3,200 requests per quarter, with about 99% processed within 24 hours.

I wouldn't attribute all of that growth to one prioritization decision, but those outcomes demonstrate the customer value of the capabilities we were protecting.

For me, the important distinction was that one initiative improved a journey customers could already complete, while the other enabled a new segment to use the product end to end.

And when resources are constrained, that's the kind of trade-off I try to make explicit rather than simply prioritizing whichever project has the most visibility.

---

## B42 (Bristol) ↔ Q34 (Jaz)

**Bristol question:** Tell me about HBC Mastercard growth and funnel experimentation.

**Jaz question:** Tell me about a growth experiment you ran and how you measured its success.

### Bristol answer (`/live/bristol`)

At HBC, I worked on the commercial performance of a Mastercard portfolio with more than 500,000 accounts. One lesson was that acquisition isn't enough; you need people to activate, use the product and keep getting value from it.

We used customer cohorts and controlled experiments to understand activation and spending behavior. On the application side, we worked with Neo on a redesigned digital application that improved completion by about 15%, with decisions typically available in under three minutes.

Across the portfolio, active cardholders improved by four percentage points and spend per active cardholder by about 5%. Our modeled customer lifetime value rose roughly 10%.

What I liked was having to make decisions at two levels: improve the immediate funnel, but also make sure those improvements helped the long-term economics. That's the same discipline I'd bring to restaurant bookings versus actual seated, profitable demand.

### Jaz answer (`/live/jaz`)

Yeah, one example would be at HBC, where I was responsible for growth across our Mastercard portfolio.

One of the things we were trying to improve was getting new cardholders to use the card more consistently after their initial purchase.

We had a pretty large portfolio, over 500,000 cardholders, and one thing we noticed was that some customers would make their first purchase but then go quiet.

Now, the obvious solution would have been to offer everyone more points or a larger spending incentive.

But I was concerned we'd end up rewarding customers who were already going to spend, without necessarily changing the behaviour of the customers we wanted to influence.

So I worked with our analytics team and Neo to identify a more specific cohort: customers who'd made an initial purchase but hadn't returned for a second transaction within the following few weeks.

The hypothesis was that a small, well-timed incentive might help establish a repeat-spending habit.

We tested a capped points accelerator on their next qualifying purchase, while keeping a comparable control group on the existing lifecycle experience.

And what was important to me was measuring everyone assigned to the test, not just the people who opened the message or redeemed the offer. Otherwise, we'd risk overstating the impact.

For the pilot, we saw a meaningful improvement in second-purchase conversion—around five percentage points over the control group in this example.

But the interesting part was looking at the economics.

We saw additional spending, but the uplift wasn't equally attractive across every customer segment once we accounted for the reward costs.

So rather than recommending that we extend the incentive to the whole portfolio, I focused on where the incremental behaviour justified the investment.

We also looked at whether those customers continued spending after the promotional period, because there's a difference between creating a habit and simply pulling someone's next purchase forward.

For me, that was a good example of using experimentation to make a commercial decision.

It wasn't just about finding an offer that increased transactions. It was about understanding which customers actually needed an intervention, whether it changed their behaviour, and whether the economics made sense before scaling it.

---

## B43 (Bristol) ↔ Q03 (Jaz)

**Bristol question:** Tell me about building Arc'teryx membership from zero to one.

**Jaz question:** Why are you looking to leave Arc'teryx?

### Bristol answer (`/live/bristol`)

At Arc'teryx, I've been leading the product strategy for a new membership program built around how customers use and care for their gear, not just how often they buy it. That includes repairs, care, trade-in and community experiences.

We had a big vision and a lot of systems and stakeholders involved. I worked on the business case, vendor evaluation, identity and eligibility dependencies, and the scope of a first release. We secured about $5.2 million in funding for the phase.

One decision I think was important was moving toward a web-first MVP rather than making a native app part of the initial launch. We also looked at which benefits could be delivered independently instead of waiting for every platform component.

That work taught me that 0-to-1 isn't about packing the entire vision into the first release. It's about making a credible product promise, getting agreement on the trade-offs and creating a path to learn. To be clear, I wouldn't describe the entire membership platform as already launched.

### Jaz answer (`/live/jaz`)

I've actually really enjoyed my time at Arc'teryx.

I was originally approached about helping build a new membership platform from the ground up, which was a pretty unique opportunity.

What attracted me wasn't necessarily loyalty as a category, but the chance to build a product from scratch. Most of the products I'd worked on were already established, so getting involved at that early stage was something I really wanted to experience, even though most of my background was in financial services.

It's been a valuable experience. I've been involved in shaping the MVP, evaluating technology solutions, and working through some significant investment and integration decisions.

But because it's been such a foundational initiative, a lot of my time has been spent in discovery, technical planning, and aligning different business teams.

And while I enjoy that side of product management, I've realized how much I also value getting products into customers' hands, seeing how they perform, and improving them based on real results. That's something I really enjoyed at RBC and HBC.

So I've been pretty selective about what I'd consider next. Questrade stood out because it brings me back to financial services, an industry I've always enjoyed, while giving me the opportunity to work on a meaningful product challenge in Everyday Banking.

For me, it's about bringing those experiences together and having the opportunity to own a product through its full lifecycle, from strategy and delivery through to measurable customer impact.

---

## B44 (Bristol) ↔ Q33 (Jaz)

**Bristol question:** Tell me about Aeroplan acquisition and conversion optimization.

**Jaz question:** Tell me about your Air Canada / Aeroplan experience.

### Bristol answer (`/live/bristol`)

At Aeroplan, I worked on digital acquisition across the co-brand credit-card partners, including TD, CIBC and Amex.

We looked at how people moved from understanding a card proposition to actually applying, where the experience was confusing or had too much friction, and how partner touchpoints connected to the conversion journey.

The redesigned acquisition experience improved conversion by about 40%, and co-brand card acquisition grew 427% year over year during the period. I wouldn't suggest the interface change alone explains the whole growth figure — there were broader commercial and partner factors too.

The transferable lesson is to understand both the customer funnel and the partnership mechanics, then measure outcomes without over-claiming the causal impact of one feature.

### Jaz answer (`/live/jaz`)

At Air Canada, I started in commercial strategy and partnerships before moving into product management focused on Aeroplan's digital growth.

A big part of my product role was improving credit card acquisition with TD, CIBC and American Express.

The journey was interesting because someone could discover an Aeroplan card offer through Air Canada, but the application and approval experience happened with the issuing bank.

So our challenge was making that journey straightforward, from understanding the offer and deciding which card was right through to starting an application.

I worked on redesigning digital acquisition using funnel data, segmentation and experimentation to identify where we could improve conversion. That work helped increase application conversion by 40%.

Earlier, I worked on the commercial side of partnerships, evaluating opportunities and building business cases.

So it gave me a foundation on both sides of product management: understanding the business opportunity and translating it into a customer experience that performs.

---

## B45 (Bristol) ↔ Q20 (Jaz)

**Bristol question:** Tell me about a customer problem you identified and solved — ShopPlus.

### Bristol answer (`/live/bristol`)

One consumer product example is the Shop+ cashback browser extension at RBC Avion. The customer problem was that cashback opportunities were easier to miss when people were shopping across retailers outside the Avion experience.

The extension brought cashback discovery closer to where customers were already shopping, and the product reached more than 100,000 downloads across supported browsers.

I'd be careful to distinguish distribution from sustained value. Downloads tell us the acquisition story, but the product questions I'd want to answer are whether people used it at eligible merchants, activated cashback successfully and came back to use it again.

This is a useful example of meeting customers in their existing workflow rather than expecting them to visit a separate product first. For a detailed behavioral interview, I would anchor follow-up claims to the specific discovery and prioritization decisions I can personally verify rather than inventing a research process.

### Jaz answer (`/live/jaz`)

One example would be ShopPlus at RBC.

We already had a cashback offering where customers could activate offers through Avion, and qualifying purchases could be recognized against their RBC cards. But there was a fundamental friction point: we were asking customers to visit our platform, find an offer, and activate it before shopping.

We started looking at how customers were discovering and engaging with offers, combining the offer funnel with customer feedback. One hypothesis was that customers weren't necessarily uninterested in cashback—they just weren't thinking about visiting Avion before buying something.

Most people start with a retailer or a product they're already looking for, not a rewards platform. We could have invested more in reminders or improving discovery within Avion, but that still depended on customers remembering to check us first.

So we took a different approach with ShopPlus: a browser extension that could surface eligible offers while someone was already on a participating retailer's site.

One of the design considerations was to make that moment contextual without being intrusive, so the customer could notice and activate the offer without disrupting their shopping.

There were also technical considerations around recognizing eligible merchants, offer activation, and attribution of qualifying purchases to the rewards account.

The extension eventually reached more than 100,000 downloads, which indicated reach. But downloads alone don't prove we're creating value; I'd look at activations, qualifying purchases and repeat usage as well.

The lesson for me is that sometimes improving a product isn't about adding more to your existing platform. It's about putting the experience where the customer is already trying to do something.

---

## B47 (Bristol) ↔ Q31 (Jaz)

**Bristol question:** RBC Avion overview — scope and impact.

**Jaz question:** Tell me about your RBC experience.

### Bristol answer (`/live/bristol`)

At RBC I owned core Avion Rewards experiences across web and mobile, with a cross-functional squad spanning design, frontend, backend, iOS, Android and QA, alongside architecture and business analysis.

Some of the major themes were expanding access to non-RBC customers, improving the mobile experience and enabling rewards to become useful cash value. Interac cashback withdrawals is a particularly good example because it involved the consumer journey, enterprise payments and financial controls coming together.

I also worked on measurement infrastructure, including event taxonomy and GA4 migration, so we could understand where customers were getting stuck instead of making product decisions based only on anecdote.

The thing I took from that role was the importance of owning an end-to-end customer outcome even when the dependencies span teams you don't manage.

### Jaz answer (`/live/jaz`)

At RBC, I was a Senior Product Manager on Avion Rewards, where I owned core web and mobile experiences, working with a cross-functional team of about 14 people.

A big part of the role was making it easier for customers to discover, earn and use rewards.

One example was ShopPlus, our cashback browser extension. Traditionally, customers often needed to visit Avion, find an offer and opt in. The backend could then recognize qualifying RBC card transactions, but the customer still had to remember to check offers before shopping.

With ShopPlus, we brought offer discovery into the shopping journey. Someone browsing a participating retailer could discover and activate eligible cashback without first opening Avion. That was a meaningful shift toward how people actually shopped.

Another major initiative was expanding Avion to non-RBC customers through Avion Select. That introduced identity and onboarding challenges, but also money movement. RBC banking customers could receive cashback into deposit accounts; non-bank customers needed another payout route.

I led the consumer product work for Interac e-Transfer withdrawals, integrating with RBC's enterprise payments infrastructure and working with Risk and Financial Operations. That capability supported around 3,200 requests per quarter with roughly 99% processed within 24 hours.

It was a broad role, but the common thread was improving the entire rewards journey—from discovering value through to receiving it.

---

## B48 (Bristol) ↔ Q30 (Jaz)

**Bristol question:** Arc'teryx overview — current responsibilities.

**Jaz question:** Tell me about your current responsibilities at Arc'teryx.

### Bristol answer (`/live/bristol`)

At Arc'teryx my focus has been guest services technology and, more recently, membership. I've been working on how to build a non-transactional membership experience around product ownership, care, repairs, trade-in and events.

That involved the customer proposition, funding and governance, evaluating platform vendors and connecting membership eligibility and identity to existing commerce and service systems.

A large part of the job is making trade-offs across teams: what's essential to the MVP, what can be phased, and what creates unnecessary dependency or operating cost. We secured roughly $5.2 million in funding and moved toward a web-first initial approach.

I also had direct PM and BA leadership responsibilities on the membership side. The work has given me a good balance of strategic planning, complex systems thinking and day-to-day decisions with the people actually building it.

### Jaz answer (`/live/jaz`)

I'm currently leading the product work for a new membership program at Arc'teryx.

The opportunity we're exploring is that someone might buy a jacket and own it for years, but there are plenty of reasons to continue that relationship beyond the initial purchase—care, repairs, trade-ins and community experiences.

My role has been working with the business to turn that proposition into something we can realistically build. That's involved customer research, the business case, securing about $5.2 million in funding, evaluating technology partners, and working through some pretty complex integrations.

I've also had people-management responsibilities, including a PM and business analyst on the membership team.

One of the bigger product decisions has been what actually needs to launch versus what can come later. Our systems are fragmented, so even a simple customer benefit can require significant work behind the scenes.

For example, we found opportunities to introduce a narrower set of customer benefits alongside a new product launch without waiting for the entire membership platform.

So it's been a lot of foundational product work and practical trade-offs between the experience we'd eventually like to offer and what makes sense to deliver first.

---

## B49 (Bristol) ↔ Q24 (Jaz)

**Bristol question:** How do you handle disagreement with engineering or design?

**Jaz question:** Tell me about a difficult stakeholder disagreement or dependency.

### Bristol answer (`/live/bristol`)

I usually try to work out what the disagreement is really about before choosing sides. Engineering may be protecting reliability, design may be seeing customer friction, and commercial teams may be worried about timing.

The worst version is when everyone comes to the meeting defending a solution. I'd bring us back to the outcome and make the trade-offs visible: what happens if we delay, simplify or change the approach?

At Arc'teryx, defining a realistic membership MVP required that kind of discussion across business and technology teams. Some capabilities were attractive, but making all of them launch dependencies would have increased the risk considerably.

I don't think alignment means unanimous agreement. It means people understand the decision, feel heard and know what we're collectively committing to. If we can't resolve it at the working level, I'd escalate with a recommendation rather than just competing opinions.

### Jaz answer (`/live/jaz`)

One example was a disagreement over whether the Arc'teryx mobile app needed to be part of our first membership release.

We were building a program around care, repairs, trade-ins and member benefits, but the underlying systems were fragmented and integration costs were significant.

I recommended deferring the full mobile experience because the app was run through an external technology partner, and adding membership would introduce substantial work without necessarily changing the core value we needed to validate first.

The mobile business team understandably wanted to be included. They had legitimate channel objectives, and the issue eventually reached the business sponsors.

My approach was to work with engineering and architecture to make the cost and dependencies understandable, then shift the discussion from whether mobile was 'in or out' to what mobile actually needed to achieve in the MVP.

We ultimately included a more limited mobile scope in the plan rather than committing to the full native integration. That wasn't my original recommendation, but it was a more focused option.

It taught me that stakeholder management isn't about getting everyone to agree with you. It's about making the trade-offs visible so the people responsible for the investment can decide.

Looking back, I'd have brought those decisions to the business sponsors earlier instead of letting requirements workshops become repeated negotiations over scope.

---

## B50 (Bristol) ↔ Q26 (Jaz)

**Bristol question:** How do you influence stakeholders without authority?

**Jaz question:** Tell me about a time you challenged leadership or influenced without authority.

### Bristol answer (`/live/bristol`)

I focus on making it easier for people to make a good decision together. At RBC, I didn't directly manage the engineers, but the Avion experiences I owned depended on mobile, frontend, backend, risk and payment operations all moving in the same direction.

I'd begin with the customer outcome and the constraints, bring technical partners into shaping the approach, and take responsibility for resolving dependencies and trade-offs. I don't want the team to feel like they're receiving a completed solution from product.

Over time, trust comes from following through, making decisions when needed and giving people credit for the expertise they bring. Reporting lines aren't the only source of leadership — consistency matters more.

### Jaz answer (`/live/jaz`)

At Arc'teryx, I was leading the technology product work for membership, but the business teams owned the proposition, funding and final scope decisions.

One decision was whether to introduce membership into the externally supported mobile app from day one. I'd recommended a web-first MVP because full mobile integration added cost and dependencies that weren't essential to validating the core proposition.

The mobile team had legitimate reasons to disagree and escalated the issue. I couldn't simply override them, so I tried to reframe the discussion.

Instead of arguing about whether mobile was in or out, I worked with our technical teams to show the difference between a fully integrated native membership experience and a much more limited mobile presence.

That gave the sponsors something more useful to decide on: what customer outcome they wanted at launch, what each option would cost, and what it would do to the timeline.

We landed on a more limited mobile scope in the MVP plan. It wasn't exactly the outcome I'd initially recommended, but it was a more focused compromise that acknowledged the business need without committing to the full integration.

What I learned is that influencing without authority isn't always persuading someone to take your original position. Sometimes it's changing the shape of the decision so different teams can find a workable option.

And once the accountable leaders make that call, I support execution while being clear about any remaining risks.

---

## B51 (Bristol) ↔ Q25 (Jaz)

**Bristol question:** Tell me about a time something didn't go as planned.

**Jaz question:** Tell me about something that didn't go as planned, or a project that failed.

### Bristol answer (`/live/bristol`)

A useful example is the membership planning work at Arc'teryx. The initial vision had a lot of connected experiences — registration, ownership, care and events — and it would have been tempting to package all of that into a single launch.

As we worked through the integration dependencies and operating implications, it became clear that treating everything as day-one scope would create risk without proving additional customer value.

We had to revisit the sequencing, move toward a more focused web-first MVP and consider which experiences could be delivered independently. That meant having difficult scope conversations with business partners, not simply asking engineering to move faster.

I wouldn't describe it as a failed launch; it's an example of an early assumption we corrected. The lesson is to be willing to change the plan when the dependencies or evidence don't support it.

### Jaz answer (`/live/jaz`)

One example is the broader membership launch at Arc'teryx. We'd researched the proposition, built the business case and secured about $5.2 million in funding, but ultimately weren't able to launch the full membership experience on the timeline we'd targeted.

The goal was to connect product care, repairs, trade-ins, secondhand purchases and member benefits. But our website, externally operated mobile app and secondhand marketplace ran across different systems and partners, so even reducing feature scope didn't reduce integration costs proportionately.

We also had several business teams contributing to the initiative with different expectations of what the MVP should include. The business sponsors owned those investment and proposition decisions, while my technology product team was responsible for defining what we could actually deliver.

I challenged requirements, worked with engineering and architecture to assess dependencies, and advocated a more phased approach. But we spent too long trying to reach working-level compromises on decisions that ultimately needed sponsor-level ownership.

We did support a narrower set of benefits tied to a separate product launch, while the larger membership program went back into discovery. I wouldn't present that as the successful launch we'd originally planned.

My biggest learning is that identifying and communicating a risk isn't the same as converting it into a decision. I was surfacing the problems, but I should have worked with my leadership earlier to create clearer investment boundaries, decision rights and escalation points.

That's what I'd do differently on the next cross-functional program: move unresolved trade-offs to the right decision-makers before they compound into delivery risk.

---

## B53 (Bristol) ↔ Q17 (Jaz)

**Bristol question:** How do you prioritize with limited resources and competing stakeholders?

### Bristol answer (`/live/bristol`)

I start by separating stakeholder requests from the outcome each team is trying to protect.

Arc'teryx membership touched a lot of business functions, so everyone had reasonable ideas for what should be included. But if every good idea became a launch requirement, we'd have a much slower and riskier product.

I brought the conversation back to what the initial customer proposition needed to prove, what the systems could support and what could wait. That helped us move toward a web-first MVP and phase dependencies rather than carrying the full vision into day one.

I don't see prioritization as a way of making everyone happy. It's a recommendation about where we'll create the most value with the capacity we have, and a clear explanation of what we're not doing yet.

### Jaz answer (`/live/jaz`)

I usually start by getting everyone aligned on the outcome, because different stakeholders can have reasonable priorities that don't contribute equally to the same customer or business result.

A good example is the membership program at Arc'teryx. We had an ambitious proposition across product care, repairs, trade-ins and benefits, but the integrations were expensive, and several business teams expected their channel or capability to be included in the MVP.

The challenge wasn't simply ranking a wish list. It was understanding which capabilities were essential to the first customer proposition and which would add major cost and dependencies without equivalent value.

For example, I recommended keeping the first release web-first and deferring the full mobile integration. The app was operated by an external partner, and adding membership there would increase complexity across an already fragmented landscape.

I worked with architecture and engineering to make those trade-offs clear in terms of customer value, effort and timing. The business sponsors wanted some mobile presence, so the plan ultimately included a more limited mobile scope rather than the full integration.

The broader program still didn't launch on the original timeline, and we ended up introducing narrower benefits separately. I don't portray that as an overall delivery success.

But it reinforced how I prioritize: make the cost of each choice visible, challenge scope against the outcome, and get investment decisions to the right sponsors early. Otherwise, you can spend months negotiating an MVP that isn't feasible.

---

## B55 (Bristol) ↔ Q24 (Jaz)

**Bristol question:** How do you navigate stakeholder disagreement on product direction?

**Jaz question:** Tell me about a difficult stakeholder disagreement or dependency.

### Bristol answer (`/live/bristol`)

I usually find that disagreements come from people optimizing for different risks. Commercial stakeholders may value a promised date; engineering may be worried about reliability; design may be pointing to a customer issue.

I try to make those concerns concrete and find the shared objective. What do we know? What would happen if we didn't ship this part? Which option is safest to reverse if we're wrong?

I'm comfortable pushing back when the evidence doesn't support a requested feature, but I'd do it with an alternative and a clear recommendation. An escalation should ask leadership to resolve a real trade-off, not outsource the PM's responsibility to make a call.

### Jaz answer (`/live/jaz`)

One example was a disagreement over whether the Arc'teryx mobile app needed to be part of our first membership release.

We were building a program around care, repairs, trade-ins and member benefits, but the underlying systems were fragmented and integration costs were significant.

I recommended deferring the full mobile experience because the app was run through an external technology partner, and adding membership would introduce substantial work without necessarily changing the core value we needed to validate first.

The mobile business team understandably wanted to be included. They had legitimate channel objectives, and the issue eventually reached the business sponsors.

My approach was to work with engineering and architecture to make the cost and dependencies understandable, then shift the discussion from whether mobile was 'in or out' to what mobile actually needed to achieve in the MVP.

We ultimately included a more limited mobile scope in the plan rather than committing to the full native integration. That wasn't my original recommendation, but it was a more focused option.

It taught me that stakeholder management isn't about getting everyone to agree with you. It's about making the trade-offs visible so the people responsible for the investment can decide.

Looking back, I'd have brought those decisions to the business sponsors earlier instead of letting requirements workshops become repeated negotiations over scope.

---

