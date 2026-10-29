/**
 * ChatGPT-authored OpenTable Tier 1 + Tier 2 Q&A (verbatim). Imported by build-opentable-import-package.mjs.
 */

const PROFILE = "opentable";
const SOURCE = "opentable-approved-records.mjs";

function rec(partial) {
  return {
    aliases: [],
    category: "Recruiter",
    isPreferred: true,
    isAuthoritative: true,
    revisionStatus: "current",
    retrievalExcluded: false,
    followUps: [],
    evidenceStatus: "resume_supported",
    reviewRequired: false,
    reviewStatus: "ok",
    topicTags: ["priority:P0", PROFILE, "jd-aligned"],
    sourceFile: SOURCE,
    ...partial,
  };
}

export const OPENTABLE_APPROVED_RECORDS = [
  rec({
    externalId: "opentable-rec-001",
    canonicalQuestion: "Tell me about yourself.",
    aliases: ["Walk me through your background.", "Give me a quick overview of your career."],
    answer: `Sure. I've spent a little over nine years in product management, mostly working on digital consumer products, with a lot of my experience focused on growth, customer engagement, and the technology behind those experiences.

I'm currently at Arc'teryx, where I've been leading the development of a new membership proposition. That includes building the investment case, securing about $5.2 million in funding, and working through how the platform would come together across different business and technology teams.

Before that, I was at RBC Avion, where I worked on opening the platform to non-RBC customers and launched cashback withdrawals through Interac e-Transfer.

And earlier, at HBC and Aeroplan, my work was more commercially focused — things like credit-card acquisition, customer activation, spending, and retention.

So I've had a pretty good mix of building products from the ground up and improving the commercial performance of existing ones.

That's partly what interested me about OpenTable. It's an opportunity to bring those experiences together, but in a different industry, with AI playing a much bigger role in the products being built.`,
    spokenAnswer: `Sure. I've spent a little over nine years in product management, mostly working on digital consumer products, with a lot of my experience focused on growth, customer engagement, and the technology behind those experiences.

I'm currently at Arc'teryx, where I've been leading the development of a new membership proposition. That includes building the investment case, securing about $5.2 million in funding, and working through how the platform would come together across different business and technology teams.

Before that, I was at RBC Avion, where I worked on opening the platform to non-RBC customers and launched cashback withdrawals through Interac e-Transfer.

And earlier, at HBC and Aeroplan, my work was more commercially focused — things like credit-card acquisition, customer activation, spending, and retention.

So I've had a pretty good mix of building products from the ground up and improving the commercial performance of existing ones.

That's partly what interested me about OpenTable. It's an opportunity to bring those experiences together, but in a different industry, with AI playing a much bigger role in the products being built.`,
    shortAnswer:
      "Sure. I've spent a little over nine years in product management, mostly working on digital consumer products, with a lot of my experience focused on growth, customer engagement, and the technology behind those experiences.",
    roundRelevance: { recruiter: "very_high", hiring_manager: "high" },
    preparationTier: "P0",
    questionIntent: "main_story",
    experienceModuleId: "career-general",
    experienceLabel: "Career & Motivation",
    librarySection: "career_motivation",
    libraryCategory: "career_recruiter",
    adaptationType: "rewritten",
    sourceQuestradeRecordId: "2f3a780e-6b54-42b8-b56d-8936a471fa68",
    profileExclusive: "opentable",
    relatedExternalIds: ["opentable-rec-002", "opentable-rec-003"],
  }),
  rec({
    externalId: "opentable-rec-002",
    canonicalQuestion: "Why OpenTable?",
    aliases: [
      "Why do you want to work at OpenTable?",
      "What interests you about OpenTable?",
      "Why are you interested in OpenTable?",
    ],
    answer: `There's actually a personal connection for me. I'm a big foodie, and living in Toronto, I use OpenTable quite a bit when I'm looking for restaurants or making reservations. So it's a product I've been familiar with for a long time.

I've also helped a friend with his small business, and that gave me a better appreciation for how difficult it can be to get discovered and consistently bring in new customers.

That's one of the things I find interesting about OpenTable. From the diner's perspective, it's about finding somewhere good to eat. But from the restaurant's perspective, it's a tool that can have a meaningful impact on their business.

And when I saw that this role was specifically focused on AI and helping restaurants optimize revenue, it caught my attention. A lot of my background has been in growth, experimentation, and commercial performance, so it's a problem I'd genuinely enjoy working on.`,
    spokenAnswer: `There's actually a personal connection for me. I'm a big foodie, and living in Toronto, I use OpenTable quite a bit when I'm looking for restaurants or making reservations. So it's a product I've been familiar with for a long time.

I've also helped a friend with his small business, and that gave me a better appreciation for how difficult it can be to get discovered and consistently bring in new customers.

That's one of the things I find interesting about OpenTable. From the diner's perspective, it's about finding somewhere good to eat. But from the restaurant's perspective, it's a tool that can have a meaningful impact on their business.

And when I saw that this role was specifically focused on AI and helping restaurants optimize revenue, it caught my attention. A lot of my background has been in growth, experimentation, and commercial performance, so it's a problem I'd genuinely enjoy working on.`,
    roundRelevance: { recruiter: "very_high", hiring_manager: "high" },
    preparationTier: "P0",
    experienceModuleId: "career-general",
    experienceLabel: "Career & Motivation",
    librarySection: "career_motivation",
    libraryCategory: "career_recruiter",
    adaptationType: "newly_authored",
    profileExclusive: "opentable",
    category: "Motivation",
  }),
  rec({
    externalId: "opentable-rec-003",
    canonicalQuestion: "Why this particular Senior Product Manager role?",
    aliases: [
      "Why this role?",
      "Why Senior Product Manager at OpenTable?",
      "What drew you to this specific PM role?",
    ],
    answer: `I think it's the combination of the commercial focus and the opportunity to build something new.

I've always enjoyed product work where you can draw a fairly direct connection between what you're building and how it improves the business.

The 0-to-1 aspect also appeals to me. At Arc'teryx and RBC, I've had opportunities to take fairly ambiguous problems, work out what the product should look like, and bring different teams together to make it happen.

And then there's the AI component. I've been spending quite a bit of my own time building AI-enabled applications, so I'm particularly interested in finding opportunities to apply that knowledge to real business problems.

This role brings together several things I've enjoyed doing and want to continue developing.`,
    spokenAnswer: `I think it's the combination of the commercial focus and the opportunity to build something new.

I've always enjoyed product work where you can draw a fairly direct connection between what you're building and how it improves the business.

The 0-to-1 aspect also appeals to me. At Arc'teryx and RBC, I've had opportunities to take fairly ambiguous problems, work out what the product should look like, and bring different teams together to make it happen.

And then there's the AI component. I've been spending quite a bit of my own time building AI-enabled applications, so I'm particularly interested in finding opportunities to apply that knowledge to real business problems.

This role brings together several things I've enjoyed doing and want to continue developing.`,
    roundRelevance: { recruiter: "very_high", hiring_manager: "high" },
    preparationTier: "P0",
    experienceModuleId: "career-general",
    experienceLabel: "Career & Motivation",
    librarySection: "career_motivation",
    libraryCategory: "career_recruiter",
    adaptationType: "newly_authored",
    profileExclusive: "opentable",
    category: "Motivation",
  }),
  rec({
    externalId: "opentable-rec-004",
    canonicalQuestion:
      "Your background is primarily financial services and retail. Why move into hospitality?",
    aliases: [
      "Why hospitality?",
      "Why restaurants after banking and retail?",
      "You don't have restaurant industry experience — why this pivot?",
    ],
    answer: `I actually think a lot of the underlying business challenges are quite similar.

At HBC, for example, I was managing growth for a large credit-card portfolio. We were looking at things like customer acquisition, spending behaviour, retention, and how to improve the economics of that portfolio.

At Aeroplan, there was a similar focus on customer growth and partner performance.

With restaurants, the operating model is obviously different, but you're still trying to understand customer demand and how to turn that demand into revenue.

What's especially interesting is that restaurant capacity is perishable. If you have empty tables during a particular seating window, you can't necessarily recover that opportunity tomorrow.

So the idea of using data and predictive analytics to help restaurants make better decisions is something I find really compelling.`,
    spokenAnswer: `I actually think a lot of the underlying business challenges are quite similar.

At HBC, for example, I was managing growth for a large credit-card portfolio. We were looking at things like customer acquisition, spending behaviour, retention, and how to improve the economics of that portfolio.

At Aeroplan, there was a similar focus on customer growth and partner performance.

With restaurants, the operating model is obviously different, but you're still trying to understand customer demand and how to turn that demand into revenue.

What's especially interesting is that restaurant capacity is perishable. If you have empty tables during a particular seating window, you can't necessarily recover that opportunity tomorrow.

So the idea of using data and predictive analytics to help restaurants make better decisions is something I find really compelling.`,
    roundRelevance: { recruiter: "very_high", hiring_manager: "high" },
    preparationTier: "P0",
    experienceModuleId: "career-general",
    experienceLabel: "Career & Motivation",
    librarySection: "career_motivation",
    libraryCategory: "career_recruiter",
    adaptationType: "newly_authored",
    profileExclusive: "opentable",
    category: "Motivation",
  }),
  rec({
    externalId: "opentable-rec-005",
    canonicalQuestion: "Tell me about a 0-to-1 product you've launched.",
    aliases: [
      "Tell me about a zero-to-one product you've launched.",
      "Describe a product you built from scratch.",
      "Walk me through a 0-to-1 launch you led.",
    ],
    answer: `Yeah, one example would be cashback withdrawals for non-RBC customers on Avion Rewards.

We'd opened Avion to people who weren't RBC banking customers, which created an interesting problem. These members could earn cashback, but we still needed a practical way for them to actually receive that money.

Rather than building a completely separate payment service, we looked at adapting an existing enterprise payments capability using Interac e-Transfer.

I owned the consumer product requirements and worked with engineering, Risk, and Financial Operations to figure out how the experience would work, including eligibility, controls, transaction status, and reconciliation.

We ultimately launched the capability, and it supported roughly 3,200 withdrawal requests per quarter, with about 99% confirmed within 24 hours. That represented approximately $1.2 million in annualized payouts.

It was a good example of taking a customer problem that sounded fairly straightforward and working through all the complexity behind it to actually deliver something usable.`,
    spokenAnswer: `Yeah, one example would be cashback withdrawals for non-RBC customers on Avion Rewards.

We'd opened Avion to people who weren't RBC banking customers, which created an interesting problem. These members could earn cashback, but we still needed a practical way for them to actually receive that money.

Rather than building a completely separate payment service, we looked at adapting an existing enterprise payments capability using Interac e-Transfer.

I owned the consumer product requirements and worked with engineering, Risk, and Financial Operations to figure out how the experience would work, including eligibility, controls, transaction status, and reconciliation.

We ultimately launched the capability, and it supported roughly 3,200 withdrawal requests per quarter, with about 99% confirmed within 24 hours. That represented approximately $1.2 million in annualized payouts.

It was a good example of taking a customer problem that sounded fairly straightforward and working through all the complexity behind it to actually deliver something usable.`,
    roundRelevance: { recruiter: "very_high", hiring_manager: "very_high", cross_functional_panel: "high" },
    preparationTier: "P0",
    questionIntent: "main_story",
    experienceModuleId: "rbc-cashback",
    experienceLabel: "RBC — Cashback withdrawals",
    librarySection: "product_experience",
    libraryCategory: "resume_deep_dive",
    adaptationType: "reused",
    sourceQuestradeRecordId: "244e239c-2f88-4b6e-968f-ef8ce65daa70",
    category: "Experience",
  }),
  rec({
    externalId: "opentable-rec-006",
    canonicalQuestion: "Tell me more about what you're doing at Arc'teryx.",
    aliases: [
      "What are you currently working on at Arc'teryx?",
      "Tell me about your current role at Arc'teryx.",
      "What are you building at Arc'teryx?",
    ],
    answer: `I'm currently leading the product work for a new membership proposition.

The idea is to build a relationship with customers that goes beyond buying another jacket. Arc'teryx products can last for years, so there are opportunities around care, repairs, trade-in, and community experiences that make sense over the lifetime of the product.

I've been involved in building the business case, securing approximately $5.2 million in funding, evaluating technology vendors, and defining how the different systems would need to work together.

One of the more interesting challenges has been figuring out what actually needs to be part of the larger platform versus what we can deliver independently.

For example, with the Sperro SV launch, we had an opportunity to introduce specific customer benefits without waiting for the entire membership platform to be ready.

So it's been a mix of long-term product strategy and making fairly practical decisions about scope, dependencies, and what we can deliver sooner.`,
    spokenAnswer: `I'm currently leading the product work for a new membership proposition.

The idea is to build a relationship with customers that goes beyond buying another jacket. Arc'teryx products can last for years, so there are opportunities around care, repairs, trade-in, and community experiences that make sense over the lifetime of the product.

I've been involved in building the business case, securing approximately $5.2 million in funding, evaluating technology vendors, and defining how the different systems would need to work together.

One of the more interesting challenges has been figuring out what actually needs to be part of the larger platform versus what we can deliver independently.

For example, with the Sperro SV launch, we had an opportunity to introduce specific customer benefits without waiting for the entire membership platform to be ready.

So it's been a mix of long-term product strategy and making fairly practical decisions about scope, dependencies, and what we can deliver sooner.`,
    roundRelevance: { recruiter: "very_high", hiring_manager: "high" },
    preparationTier: "P0",
    experienceModuleId: "arcteryx-membership",
    experienceLabel: "Arc'teryx — Membership",
    librarySection: "product_experience",
    libraryCategory: "resume_deep_dive",
    adaptationType: "lightly_edited",
    sourceQuestradeRecordId: "1fd9478b-7396-4778-bc00-e62aee52de52",
    category: "Experience",
  }),
  rec({
    externalId: "opentable-rec-007",
    canonicalQuestion: "Tell me about a time you improved a commercial or revenue outcome.",
    aliases: [
      "Tell me about driving commercial results.",
      "Give me an example where you moved revenue or engagement metrics.",
    ],
    answer: `One example that comes to mind is my time at HBC, where I managed growth for a Mastercard portfolio of more than 500,000 accounts.

One of the challenges was that acquiring new cardholders was only part of the equation. You could get someone approved for a card, but if they weren't actively using it, there wasn't much ongoing value being created.

So we spent a lot of time looking at customer cohorts, spending patterns, and activation behaviour to understand where we could improve engagement.

We used controlled experiments to refine the incentives and experiences we were offering customers.

That work helped increase the active-cardholder rate by four percentage points and spending per active cardholder by five percent compared with our holdout groups. We also saw a modeled lifetime-value improvement of about ten percent.

I think that experience is particularly relevant here because it taught me to look beyond the immediate conversion metric.

For OpenTable, I'd imagine there's a similar distinction between getting someone to make a reservation and helping the restaurant generate additional, profitable business.`,
    spokenAnswer: `One example that comes to mind is my time at HBC, where I managed growth for a Mastercard portfolio of more than 500,000 accounts.

One of the challenges was that acquiring new cardholders was only part of the equation. You could get someone approved for a card, but if they weren't actively using it, there wasn't much ongoing value being created.

So we spent a lot of time looking at customer cohorts, spending patterns, and activation behaviour to understand where we could improve engagement.

We used controlled experiments to refine the incentives and experiences we were offering customers.

That work helped increase the active-cardholder rate by four percentage points and spending per active cardholder by five percent compared with our holdout groups. We also saw a modeled lifetime-value improvement of about ten percent.

I think that experience is particularly relevant here because it taught me to look beyond the immediate conversion metric.

For OpenTable, I'd imagine there's a similar distinction between getting someone to make a reservation and helping the restaurant generate additional, profitable business.`,
    roundRelevance: { recruiter: "high", hiring_manager: "very_high", cross_functional_panel: "high" },
    preparationTier: "P0",
    questionIntent: "measurement_impact",
    experienceModuleId: "hbc-portfolio",
    experienceLabel: "HBC — Cardholder portfolio",
    librarySection: "product_experience",
    libraryCategory: "resume_deep_dive",
    adaptationType: "lightly_edited",
    sourceQuestradeRecordId: "89ded97e-dc5a-420c-a4ee-a7372c2937a9",
    category: "Experience",
  }),
  rec({
    externalId: "opentable-rec-008",
    canonicalQuestion: "Have you built and shipped AI/ML-powered products?",
    aliases: [
      "Do you have production AI/ML experience?",
      "Tell me about your AI/ML product experience.",
      "Have you shipped machine learning products in production?",
    ],
    answer: `I haven't been the product lead for an enterprise AI/ML launch yet, but I've built up a fairly strong foundation on both the analytical and hands-on development sides.

I have a Master of Management Analytics from Queen's, so I came into this with a background in statistics and predictive modelling. That's been helpful as I've gotten deeper into concepts like embeddings, vector search, and how different models are evaluated.

More recently, I've been using AI-assisted development to build and deploy my own web applications.

One is a tool that explores semantic matching and AI-assisted retrieval, and another is Bench, where I've been experimenting with computer vision for exercise recognition.

I've also become much more comfortable working across the application stack — using Git, Vercel, Supabase, and integrating model APIs. And that's exposed me to some of the practical decisions around retrieval accuracy, latency, token usage, and cost.

So while I wouldn't equate those projects with leading an enterprise-scale ML launch, I do bring that technical and analytical foundation alongside nine-plus years of experience building and launching products commercially.`,
    spokenAnswer: `I haven't been the product lead for an enterprise AI/ML launch yet, but I've built up a fairly strong foundation on both the analytical and hands-on development sides.

I have a Master of Management Analytics from Queen's, so I came into this with a background in statistics and predictive modelling. That's been helpful as I've gotten deeper into concepts like embeddings, vector search, and how different models are evaluated.

More recently, I've been using AI-assisted development to build and deploy my own web applications.

One is a tool that explores semantic matching and AI-assisted retrieval, and another is Bench, where I've been experimenting with computer vision for exercise recognition.

I've also become much more comfortable working across the application stack — using Git, Vercel, Supabase, and integrating model APIs. And that's exposed me to some of the practical decisions around retrieval accuracy, latency, token usage, and cost.

So while I wouldn't equate those projects with leading an enterprise-scale ML launch, I do bring that technical and analytical foundation alongside nine-plus years of experience building and launching products commercially.`,
    roundRelevance: { recruiter: "very_high", hiring_manager: "very_high", cross_functional_panel: "very_high" },
    preparationTier: "P0",
    questionIntent: "technical_implementation",
    experienceModuleId: "opentable-revenue-ai",
    experienceLabel: "AI / ML product craft",
    librarySection: "product_banking_knowledge",
    libraryCategory: "product_analytics",
    panelDiscipline: "ai_agentic",
    adaptationType: "newly_authored",
    category: "AI/ML",
    relatedExternalIds: ["opentable-rec-019"],
  }),
  rec({
    externalId: "opentable-rec-009",
    canonicalQuestion: "How are you using AI in your day-to-day product work?",
    aliases: [
      "How do you use AI as a PM?",
      "Tell me about AI in your workflow.",
      "How are you using AI in your product management work?",
    ],
    answer: `Quite a bit, actually. The biggest change for me is how quickly I can go from having an idea to building something I can test.

I use ChatGPT and Claude for things like research, challenging assumptions, and working through different approaches to a problem.

But where I've spent more time recently is with Cursor, building actual applications rather than just creating mockups or writing requirements.

I've been experimenting with computer vision, semantic search, and integrating AI models into different user experiences.

And you start running into practical questions pretty quickly. Is the output reliable enough? Is the response fast enough? Is the extra model complexity actually improving the experience?

I like that it's given me a much more hands-on understanding of the technology, while still approaching it from a product perspective.`,
    spokenAnswer: `Quite a bit, actually. The biggest change for me is how quickly I can go from having an idea to building something I can test.

I use ChatGPT and Claude for things like research, challenging assumptions, and working through different approaches to a problem.

But where I've spent more time recently is with Cursor, building actual applications rather than just creating mockups or writing requirements.

I've been experimenting with computer vision, semantic search, and integrating AI models into different user experiences.

And you start running into practical questions pretty quickly. Is the output reliable enough? Is the response fast enough? Is the extra model complexity actually improving the experience?

I like that it's given me a much more hands-on understanding of the technology, while still approaching it from a product perspective.`,
    roundRelevance: { recruiter: "very_high", hiring_manager: "high", cross_functional_panel: "high" },
    preparationTier: "P0",
    experienceModuleId: "opentable-revenue-ai",
    experienceLabel: "AI / ML product craft",
    librarySection: "product_banking_knowledge",
    libraryCategory: "product_analytics",
    panelDiscipline: "ai_agentic",
    adaptationType: "rewritten",
    sourceQuestradeRecordId: "7c079cf5-b153-435d-a4b3-e83ad3139a2b",
    category: "AI/ML",
    relatedExternalIds: ["opentable-rec-019"],
  }),
  rec({
    externalId: "opentable-rec-010",
    canonicalQuestion: "How would you approach identifying an AI opportunity that improves restaurant revenue?",
    aliases: [
      "How would you find AI opportunities for restaurants?",
      "How would you use AI to optimize restaurant revenue?",
      "Where would you start with AI for restaurant revenue?",
    ],
    answer: `I'd probably start by spending time understanding where restaurants are actually losing revenue today.

For example, is the bigger challenge unfilled tables, last-minute cancellations, predicting demand, or something else entirely?

I'd also want to understand what OpenTable already provides and where restaurant operators still find themselves making decisions without enough information.

One area I'd be interested in exploring is demand forecasting. If a restaurant can anticipate that certain seating windows are likely to have unused capacity, there might be an opportunity to recommend actions before that revenue is lost.

But I wouldn't necessarily start by building a sophisticated ML model.

I'd first want to validate that the recommendation is useful, understand what operators are willing to act on, and establish whether we're genuinely creating incremental revenue.

If the data supports a more advanced model, that's where I'd invest further.

For me, the interesting part isn't the prediction by itself. It's whether that prediction helps someone make a better decision.`,
    spokenAnswer: `I'd probably start by spending time understanding where restaurants are actually losing revenue today.

For example, is the bigger challenge unfilled tables, last-minute cancellations, predicting demand, or something else entirely?

I'd also want to understand what OpenTable already provides and where restaurant operators still find themselves making decisions without enough information.

One area I'd be interested in exploring is demand forecasting. If a restaurant can anticipate that certain seating windows are likely to have unused capacity, there might be an opportunity to recommend actions before that revenue is lost.

But I wouldn't necessarily start by building a sophisticated ML model.

I'd first want to validate that the recommendation is useful, understand what operators are willing to act on, and establish whether we're genuinely creating incremental revenue.

If the data supports a more advanced model, that's where I'd invest further.

For me, the interesting part isn't the prediction by itself. It's whether that prediction helps someone make a better decision.`,
    roundRelevance: { recruiter: "high", hiring_manager: "very_high", cross_functional_panel: "very_high" },
    preparationTier: "P0",
    questionIntent: "problem_discovery",
    experienceModuleId: "opentable-revenue-ai",
    experienceLabel: "OpenTable — Revenue & AI",
    librarySection: "product_banking_knowledge",
    libraryCategory: "product_analytics",
    panelDiscipline: "data_experimentation",
    adaptationType: "newly_authored",
    profileExclusive: "opentable",
    category: "Product case",
    relatedExternalIds: ["opentable-rec-011"],
  }),
  rec({
    externalId: "opentable-rec-011",
    canonicalQuestion: "How would you measure success for a restaurant revenue-optimization product?",
    aliases: [
      "What metrics would you use for restaurant revenue optimization?",
      "How do you measure incrementality for restaurant revenue features?",
    ],
    answer: `I'd want to make sure we're measuring the actual commercial outcome, not just activity within the product.

For example, if we introduced a feature that helps restaurants fill otherwise empty tables, reservation volume alone wouldn't tell us enough.

I'd want to understand whether those reservations resulted in additional seated diners and whether that translated into incremental revenue.

So I'd look at things like table utilization, completed covers, cancellation and no-show rates, and actual guest spending where we have that data.

I'd also be careful about incrementality. Are we genuinely bringing in additional business, or just shifting reservations that would have happened anyway?

And then there are the operational considerations. If a recommendation increases revenue but creates problems for staffing or service quality, that's not necessarily a good outcome.

So I'd be looking at both the commercial improvement and whether the product is actually helping restaurants operate more effectively.`,
    spokenAnswer: `I'd want to make sure we're measuring the actual commercial outcome, not just activity within the product.

For example, if we introduced a feature that helps restaurants fill otherwise empty tables, reservation volume alone wouldn't tell us enough.

I'd want to understand whether those reservations resulted in additional seated diners and whether that translated into incremental revenue.

So I'd look at things like table utilization, completed covers, cancellation and no-show rates, and actual guest spending where we have that data.

I'd also be careful about incrementality. Are we genuinely bringing in additional business, or just shifting reservations that would have happened anyway?

And then there are the operational considerations. If a recommendation increases revenue but creates problems for staffing or service quality, that's not necessarily a good outcome.

So I'd be looking at both the commercial improvement and whether the product is actually helping restaurants operate more effectively.`,
    roundRelevance: { recruiter: "medium", hiring_manager: "very_high", cross_functional_panel: "very_high" },
    preparationTier: "P0",
    questionIntent: "measurement_impact",
    experienceModuleId: "opentable-revenue-ai",
    experienceLabel: "OpenTable — Revenue & AI",
    librarySection: "product_banking_knowledge",
    libraryCategory: "product_analytics",
    panelDiscipline: "data_experimentation",
    adaptationType: "newly_authored",
    profileExclusive: "opentable",
    category: "Product case",
    parentExternalId: "opentable-rec-010",
  }),
  rec({
    externalId: "opentable-rec-012",
    canonicalQuestion: "How comfortable are you working with engineering, data science, and technical teams?",
    aliases: [
      "How do you partner with ML engineering and data science?",
      "Tell me about working with technical teams.",
    ],
    answer: `Very comfortable. A lot of the products I've worked on have had fairly complex technical dependencies behind what looks like a straightforward customer experience.

At RBC, for example, I was working across web, mobile, backend engineering, architecture, and payments infrastructure.

At Arc'teryx, it's been more about connecting systems like identity, commerce, loyalty, and customer service.

I'm comfortable getting into technical discussions and understanding the trade-offs, although I don't pretend to be the engineer making every implementation decision.

And more recently, building applications myself has helped me get closer to those decisions.

With machine learning, I'd approach it similarly. I'd want to understand the data, how the model is being evaluated, and the practical implications for accuracy, cost, and user experience.

I think my role is to be technically fluent enough to challenge assumptions and make good product decisions, while working closely with the people who have the deeper engineering and ML expertise.`,
    spokenAnswer: `Very comfortable. A lot of the products I've worked on have had fairly complex technical dependencies behind what looks like a straightforward customer experience.

At RBC, for example, I was working across web, mobile, backend engineering, architecture, and payments infrastructure.

At Arc'teryx, it's been more about connecting systems like identity, commerce, loyalty, and customer service.

I'm comfortable getting into technical discussions and understanding the trade-offs, although I don't pretend to be the engineer making every implementation decision.

And more recently, building applications myself has helped me get closer to those decisions.

With machine learning, I'd approach it similarly. I'd want to understand the data, how the model is being evaluated, and the practical implications for accuracy, cost, and user experience.

I think my role is to be technically fluent enough to challenge assumptions and make good product decisions, while working closely with the people who have the deeper engineering and ML expertise.`,
    roundRelevance: { recruiter: "high", hiring_manager: "very_high", cross_functional_panel: "very_high" },
    preparationTier: "P0",
    experienceModuleId: "leadership-general",
    experienceLabel: "Cross-functional leadership",
    librarySection: "leadership_behavioural",
    libraryCategory: "leadership_behavioural",
    panelDiscipline: "engineering_platform",
    adaptationType: "newly_authored",
    category: "Collaboration",
  }),
  rec({
    externalId: "opentable-rec-013",
    canonicalQuestion: "How do you move quickly when building something new?",
    aliases: ["How do you balance speed and quality on 0-to-1 products?", "How do you iterate quickly on new products?"],
    answer: `I try to figure out what we need to learn before deciding how much we need to build.

A lot of the time, the temptation with a new product is to start defining all the capabilities it should eventually have.

But I'd rather understand the biggest uncertainty first. Do customers actually need this? Can we deliver it with the technology we have? Does the business case make sense?

At Arc'teryx, for example, we had a much broader membership vision, but there were certain benefits we could deliver independently without waiting for the full platform.

That meant being deliberate about scope and separating what was essential from what could come later.

I think that same approach is particularly useful with AI, where it's now possible to prototype something relatively quickly, but that doesn't necessarily mean it's worth building into a full product.`,
    spokenAnswer: `I try to figure out what we need to learn before deciding how much we need to build.

A lot of the time, the temptation with a new product is to start defining all the capabilities it should eventually have.

But I'd rather understand the biggest uncertainty first. Do customers actually need this? Can we deliver it with the technology we have? Does the business case make sense?

At Arc'teryx, for example, we had a much broader membership vision, but there were certain benefits we could deliver independently without waiting for the full platform.

That meant being deliberate about scope and separating what was essential from what could come later.

I think that same approach is particularly useful with AI, where it's now possible to prototype something relatively quickly, but that doesn't necessarily mean it's worth building into a full product.`,
    roundRelevance: { recruiter: "medium", hiring_manager: "very_high", cross_functional_panel: "high" },
    preparationTier: "P1",
    questionIntent: "prioritization",
    experienceModuleId: "arcteryx-membership",
    experienceLabel: "Arc'teryx — Membership",
    librarySection: "leadership_behavioural",
    libraryCategory: "leadership_behavioural",
    adaptationType: "lightly_edited",
    category: "Execution",
  }),
  rec({
    externalId: "opentable-rec-014",
    canonicalQuestion: "How do you handle conflicting executive or stakeholder priorities?",
    aliases: [
      "Tell me about aligning executives on conflicting priorities.",
      "How do you manage stakeholder disagreement?",
    ],
    answer: `I try to understand what's driving the disagreement first, because often the different teams are optimizing for slightly different things.

At Arc'teryx, for example, membership involved teams across commerce, marketing, customer service, ReBIRD, and technology.

They all had legitimate priorities, but we couldn't necessarily accommodate everything in the initial scope.

A lot of my role was making those trade-offs visible — what was essential to the customer experience, what had technical dependencies, and what we could reasonably deliver within the timeline and investment we had.

I find those conversations become much easier when everyone understands what we're actually trying to achieve and what each decision means.

You won't necessarily get everyone agreeing with every decision, but you can usually get alignment around the rationale.`,
    spokenAnswer: `I try to understand what's driving the disagreement first, because often the different teams are optimizing for slightly different things.

At Arc'teryx, for example, membership involved teams across commerce, marketing, customer service, ReBIRD, and technology.

They all had legitimate priorities, but we couldn't necessarily accommodate everything in the initial scope.

A lot of my role was making those trade-offs visible — what was essential to the customer experience, what had technical dependencies, and what we could reasonably deliver within the timeline and investment we had.

I find those conversations become much easier when everyone understands what we're actually trying to achieve and what each decision means.

You won't necessarily get everyone agreeing with every decision, but you can usually get alignment around the rationale.`,
    roundRelevance: { recruiter: "medium", hiring_manager: "very_high", cross_functional_panel: "high" },
    preparationTier: "P1",
    experienceModuleId: "leadership-general",
    experienceLabel: "Stakeholder alignment",
    librarySection: "leadership_behavioural",
    libraryCategory: "leadership_behavioural",
    adaptationType: "lightly_edited",
    sourceQuestradeRecordId: "e09deee1-3efa-4774-9274-2f18848b739f",
    category: "Leadership",
  }),
  rec({
    externalId: "opentable-rec-015",
    canonicalQuestion: "Have you worked with two-sided marketplaces?",
    aliases: ["Tell me about marketplace dynamics.", "How do you balance diner and restaurant incentives?"],
    answer: `Not a traditional two-sided marketplace in the same way OpenTable operates, but I've worked on products where there are multiple groups with different incentives, and the economics have to work for everyone involved.

At Aeroplan, for example, I worked on acquisition across several financial partners, where we had to think about the customer experience alongside partner performance.

And at HBC, there was a similar balance between encouraging customer engagement and making sure the economics of those incentives actually worked.

What I find interesting about OpenTable is that a better experience for diners doesn't automatically mean a better commercial outcome for every restaurant.

You have to think about both sides and make sure the incentives remain aligned.

So it's a different marketplace structure from what I've worked on, but that way of thinking about the product is familiar.`,
    spokenAnswer: `Not a traditional two-sided marketplace in the same way OpenTable operates, but I've worked on products where there are multiple groups with different incentives, and the economics have to work for everyone involved.

At Aeroplan, for example, I worked on acquisition across several financial partners, where we had to think about the customer experience alongside partner performance.

And at HBC, there was a similar balance between encouraging customer engagement and making sure the economics of those incentives actually worked.

What I find interesting about OpenTable is that a better experience for diners doesn't automatically mean a better commercial outcome for every restaurant.

You have to think about both sides and make sure the incentives remain aligned.

So it's a different marketplace structure from what I've worked on, but that way of thinking about the product is familiar.`,
    roundRelevance: { recruiter: "medium", hiring_manager: "high", cross_functional_panel: "high" },
    preparationTier: "P1",
    profileExclusive: "opentable",
    experienceModuleId: "opentable-revenue-ai",
    experienceLabel: "Marketplace economics",
    librarySection: "product_banking_knowledge",
    libraryCategory: "banking_strategy",
    adaptationType: "newly_authored",
    category: "Marketplace",
  }),
  rec({
    externalId: "opentable-rec-016",
    canonicalQuestion: "Why are you looking for a new opportunity now?",
    aliases: [
      "Why leave Arc'teryx?",
      "Why are you considering leaving your current role?",
      "What's motivating your job search?",
    ],
    answer: `I've really enjoyed my time at Arc'teryx, especially the opportunity to build a new membership proposition and be involved in some fairly significant product and technology decisions.

I'm not necessarily looking to leave for just any role. I've been pretty selective about opportunities that feel like a meaningful next step.

What caught my attention about OpenTable is the combination of commercial ownership, building something from the ground up, and applying AI to real business problems.

A lot of my experience has been around growth, experimentation, and commercial performance, and I've also been spending quite a bit of my own time building AI applications.

So when I came across this role, it felt like a really interesting opportunity to bring those experiences together.

It's less about wanting to leave what I'm doing today and more about finding the right next challenge.`,
    spokenAnswer: `I've really enjoyed my time at Arc'teryx, especially the opportunity to build a new membership proposition and be involved in some fairly significant product and technology decisions.

I'm not necessarily looking to leave for just any role. I've been pretty selective about opportunities that feel like a meaningful next step.

What caught my attention about OpenTable is the combination of commercial ownership, building something from the ground up, and applying AI to real business problems.

A lot of my experience has been around growth, experimentation, and commercial performance, and I've also been spending quite a bit of my own time building AI applications.

So when I came across this role, it felt like a really interesting opportunity to bring those experiences together.

It's less about wanting to leave what I'm doing today and more about finding the right next challenge.`,
    roundRelevance: { recruiter: "very_high", hiring_manager: "high" },
    preparationTier: "P0",
    experienceModuleId: "career-general",
    experienceLabel: "Career & Motivation",
    librarySection: "career_motivation",
    libraryCategory: "career_recruiter",
    adaptationType: "rewritten",
    sourceQuestradeRecordId: "28571e7f-620f-4880-9cd7-cdfc2e146aa8",
    profileExclusive: "opentable",
    category: "Motivation",
  }),
  rec({
    externalId: "opentable-rec-017",
    canonicalQuestion: "What are your compensation expectations?",
    aliases: ["What salary range are you targeting?", "What are your salary expectations?"],
    answer: `As I mentioned when scheduling, I've generally been targeting somewhere around $185,000 to $205,000 in base for my next role, depending on the scope.

That said, I do look at compensation more holistically. Base is one component, and bonus and equity can make a meaningful difference.

I did notice OpenTable's published range is below what I'd typically be targeting, but I was interested enough in the role to have the conversation.

I'd be curious to understand how the overall package is structured and whether there's flexibility depending on experience and fit.`,
    spokenAnswer: `As I mentioned when scheduling, I've generally been targeting somewhere around $185,000 to $205,000 in base for my next role, depending on the scope.

That said, I do look at compensation more holistically. Base is one component, and bonus and equity can make a meaningful difference.

I did notice OpenTable's published range is below what I'd typically be targeting, but I was interested enough in the role to have the conversation.

I'd be curious to understand how the overall package is structured and whether there's flexibility depending on experience and fit.`,
    roundRelevance: { recruiter: "high", hiring_manager: "medium" },
    preparationTier: "P2",
    experienceModuleId: "career-general",
    experienceLabel: "Career & Motivation",
    librarySection: "career_motivation",
    libraryCategory: "career_recruiter",
    adaptationType: "rewritten",
    sourceQuestradeRecordId: "93f1f35c-cd54-49c3-8d6d-6a95d262fd4b",
    profileExclusive: "opentable",
    category: "Logistics",
    followUps: [
      {
        externalId: "opentable-fu-017-firm-range",
        question: "If the recruiter says the published range is firm",
        answer: `That's helpful to know. I think the opportunity itself is genuinely interesting, so I'd still like to understand what the total package could look like, particularly with equity.

At the same time, I want to be respectful of everyone's time. If there's a significant gap that we wouldn't be able to bridge, it's probably better for us to understand that early.`,
      },
    ],
  }),
  rec({
    externalId: "opentable-rec-018",
    canonicalQuestion: "Are you comfortable with the hybrid model, and when could you start?",
    aliases: [
      "When can you start?",
      "Are you okay with hybrid work in Toronto?",
      "What's your notice period?",
    ],
    answer: `Yeah, two days a week in the Toronto office works well for me.

I've worked with distributed teams for quite a while, so I'm comfortable collaborating remotely, but I do think there's value in being together in person, especially for early product discussions or when teams are working through difficult decisions.

In terms of timing, I'd want to give my current team an appropriate transition, but I have some flexibility. I'd generally plan around a minimum two-week notice period, depending on how the process progresses.`,
    spokenAnswer: `Yeah, two days a week in the Toronto office works well for me.

I've worked with distributed teams for quite a while, so I'm comfortable collaborating remotely, but I do think there's value in being together in person, especially for early product discussions or when teams are working through difficult decisions.

In terms of timing, I'd want to give my current team an appropriate transition, but I have some flexibility. I'd generally plan around a minimum two-week notice period, depending on how the process progresses.`,
    roundRelevance: { recruiter: "high", hiring_manager: "low" },
    preparationTier: "P2",
    experienceModuleId: "career-general",
    experienceLabel: "Career & Motivation",
    librarySection: "career_motivation",
    libraryCategory: "career_recruiter",
    adaptationType: "newly_authored",
    category: "Logistics",
  }),
  rec({
    externalId: "opentable-rec-019",
    canonicalQuestion: "Tell me more about one of the AI applications you've built.",
    aliases: [
      "Walk me through your semantic matching project.",
      "Tell me about your interview copilot or retrieval project.",
    ],
    answer: `Sure. One I've been working on is an AI-assisted tool for finding relevant information in a structured knowledge library.

The problem I was trying to solve was that traditional keyword search can be pretty limiting. Someone can ask the same question in several different ways, and you still want the system to recognize what they're looking for.

So I've been exploring semantic matching, where you're looking at the meaning of a question rather than just matching exact words.

I've also been building the application around that experience, working with the frontend, Supabase for the backend and data layer, and Git and Vercel for deployment.

What's been interesting is that you start to appreciate how many decisions sit outside the model itself.

For example, how much information do you retrieve? How do you balance relevance with response speed? And when does using a more capable model actually justify the additional latency or cost?

It's given me a much more practical appreciation for AI product development, because you're not just thinking about whether the model can produce an answer. You're thinking about whether the entire experience works well enough to be useful.`,
    spokenAnswer: `Sure. One I've been working on is an AI-assisted tool for finding relevant information in a structured knowledge library.

The problem I was trying to solve was that traditional keyword search can be pretty limiting. Someone can ask the same question in several different ways, and you still want the system to recognize what they're looking for.

So I've been exploring semantic matching, where you're looking at the meaning of a question rather than just matching exact words.

I've also been building the application around that experience, working with the frontend, Supabase for the backend and data layer, and Git and Vercel for deployment.

What's been interesting is that you start to appreciate how many decisions sit outside the model itself.

For example, how much information do you retrieve? How do you balance relevance with response speed? And when does using a more capable model actually justify the additional latency or cost?

It's given me a much more practical appreciation for AI product development, because you're not just thinking about whether the model can produce an answer. You're thinking about whether the entire experience works well enough to be useful.`,
    roundRelevance: { recruiter: "high", hiring_manager: "very_high", cross_functional_panel: "very_high" },
    preparationTier: "P0",
    questionIntent: "technical_implementation",
    experienceModuleId: "opentable-revenue-ai",
    experienceLabel: "Personal AI applications",
    librarySection: "product_banking_knowledge",
    libraryCategory: "product_analytics",
    panelDiscipline: "ai_agentic",
    adaptationType: "newly_authored",
    parentExternalId: "opentable-rec-008",
    relatedExternalIds: ["opentable-rec-008", "opentable-rec-009"],
    category: "AI/ML",
  }),
];
