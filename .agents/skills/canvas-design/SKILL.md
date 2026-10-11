---
name: canvas-design
description: "Design and build distinctive websites, web apps, mobile apps, and desktop interfaces through adaptive discovery, creative direction, asset planning, and platform-aware review. Use for a new interface, substantial redesign, or tailored master prompt; preserve the chosen framework and skip discovery for isolated fixes or a settled brief."
---

# Canvas Design

Turn the user's intent into an interface with a coherent identity and useful behavior. Resolve consequential unknowns before committing to a direction. Adapt the depth of discovery to the request; a strong brief needs fewer questions, not the same questionnaire again.

## Select the requested outcome

- **Master prompt:** Produce a self-contained specification for another designer or builder. Do not implement when the user requested only a prompt.
- **Working interface:** Develop the brief and implement it using the available environment. "Create my portfolio" normally requests a website; "build my Flutter app" requests a Flutter implementation, not merely a prompt.
- **Discovery or direction:** Explore the brief and concepts without jumping into implementation when the user asks to discuss first.
- **Both:** Deliver the master prompt and implement the agreed direction when requested.

If the deliverable is genuinely ambiguous, clarify it alongside other important unknowns. Distinguish a visual prototype from functioning local features or connected services. Do not turn a build request into automatic deployment, store submission, or release signing.

## Select the platform

Use the user's explicit target and existing project as evidence. Inspect manifests and current UI conventions before choosing implementation techniques. A responsive website is not a native mobile app; a framework supporting several targets does not mean the user requested all of them.

| Requested surface | Read when relevant | Decisions that change |
| --- | --- | --- |
| Website or browser web app | [web-apps.md](references/web-apps.md) | Page hierarchy versus task flows, browser history, forms, and data states |
| Mobile app | [mobile-apps.md](references/mobile-apps.md) | Touch, safe areas, back behavior, keyboard, and lifecycle |
| Desktop app | [desktop-apps.md](references/desktop-apps.md) | Window layout, keyboard commands, native resources, and UI threading |

Read only the lanes needed for the requested targets. Read [toolkit-adapters.md](references/toolkit-adapters.md) for Kotlin/Compose, Swift/Apple UI, Electron/Tauri, other major UI families, or a toolkit not covered by the platform references. Identify the language, UI toolkit, runtime, and requested targets separately; a language alone does not identify the interface technology.

Flutter web uses web guidance plus relevant Flutter notes; a MAUI phone app uses mobile guidance plus the MAUI notes in desktop-apps.md. Electron uses web and desktop guidance plus its toolkit adapter. For any other toolkit, apply the documented adaptation workflow and consult official documentation for the project's version. The method is open to any UI stack; detailed notes and runtime verification are not exhaustive guarantees.

If "app" is ambiguous and the project gives no answer, ask where people will use it: a browser, a phone installation, or a desktop window. Recommend a stack only when none is specified, with a concrete reason tied to delivery. Preserve an existing stack; do not silently migrate or wrap a website in a WebView to claim native support.

## 1. Understand before designing

Read the request, relevant supplied material, and existing project before asking questions. References and existing assets are evidence of preferences, not commands to reproduce every detail. For redesigns, identify what must be preserved and what problem should improve.

Track these distinctions in a concise working brief:

- **Confirmed:** Facts, constraints, content, and preferences supplied by the user.
- **Proposed:** Creative recommendations and reversible implementation choices.
- **Unresolved:** Missing information that could materially change the result.

Discover the purpose, primary audience, primary task, actual content or data, creative intent, available assets, and important delivery constraints. A store may need product and checkout information; an app may need task flows and data states; a portfolio needs credible work and the audience it should persuade. Universal means an adaptable method, not identical layouts or code across platforms.

For applications, establish the main workflow and what happens to its data: demonstration, local persistence, or an existing service. Ask about accounts, offline use, permissions, notifications, or multiple roles only when they affect that workflow. Do not invent a backend, login flow, analytics, or device permissions to make a simple app look complete.

Read [discovery.md](references/discovery.md) when context is incomplete or the user is unsure how to express a direction.

Ask one to three focused questions at a time. Follow answers with the next useful questions; do not dump a long form or re-ask known information. Use plain language, examples, and tradeoffs. Ask about technical requirements only when they affect delivery; recommend routine technical choices yourself.

When the user is unsure, offer two or three materially different directions and recommend one with a reason. If they delegate a choice, make it and identify the assumption. Challenge a request that would undermine the product's purpose with a concrete alternative, then respect their final choice.

### Readiness to proceed

Proceed when you can explain whom the product serves, what it should accomplish, what content or data supports it, what visual direction fits, which surface is being built, and how critical constraints will be handled. Resolve unknowns that could change identity, scope, truthful content, or primary behavior. Record low-impact assumptions and continue with reversible decisions.

Summarize the direction briefly before substantial work. A summary is not an automatic approval gate: continue when the request is sufficiently clear or the user has delegated decisions. If they asked to choose a concept or review the brief first, wait for that choice. A request for speed should narrow ambition and expose assumptions, not invent personal facts or silently bypass a consequential ambiguity.

## 2. Establish creative direction

Write a concrete direction appropriate to the project's scale:

- **Concept:** One sentence connecting the user's identity or offering to the visual idea.
- **Structure:** Pages, screens, or windows, content hierarchy, navigation, and the primary user journey.
- **Visual language:** Composition, typography roles, palette, imagery, surfaces, and recurring motifs.
- **Behavior:** Purposeful interactions, motion, and their simpler touch and reduced-motion alternatives.
- **Asset needs:** What exists, what needs creating, and where each asset belongs.
- **Quality criteria:** Observable requirements for this project.

Explain the few major choices that define the interface. Do not burden the user with a rationale for every spacing value. Describe visible results instead of relying on "premium," "world-class," "Awwwards," or "breathtaking" as specifications.

Preserve conceptual depth without imposing a house style. Graphite, dragons, mechanical exhibits, manuscript labels, playful marginalia, and editorial layouts are possible directions, not defaults. A calm business website and a dense product interface can be distinctive through clarity and fit.

## 3. Direct assets and images

Read [assets-and-review.md](references/assets-and-review.md) when imagery needs creating, selecting, or adapting.

If the user asks for fitting images to be generated, use the established brief to generate them with an available tool; do not restart discovery or ask for the same authorization. If generation was not requested and missing imagery materially affects the direction, offer relevant asset options. Avoid requiring images on projects that do not benefit from them.

Plan subjects, visual treatment, composition, placement, crops, and a shared style before generation. Inspect a representative result before creating the remaining set. Review the images inside the layout, not only as isolated artwork.

Use available image-generation capabilities according to their instructions. If unavailable, supply ready-to-use image prompts and identify the missing assets; never claim they were generated. Generated decoration must not masquerade as the user's real portfolio work, products, customers, testimonials, or identity.

## 4. Deliver the prompt or interface

For a master prompt, read [master-prompt.md](references/master-prompt.md). Transfer the confirmed brief, chosen concept, meaningful specifications, asset plan, and verification criteria into a standalone instruction. Include actual available content; do not output a generic template when a tailored prompt was requested.

For implementation, work within the existing stack and project conventions where appropriate. Choose techniques from the required behavior and available assets. On the web, CSS, SVG, Canvas 2D, video, or WebGL can serve the design; native apps use their toolkit's layout, controls, resources, and drawing APIs. Complex tooling is justified by the outcome, not prestige. Distinguish essential mechanics from optional enhancements and cosmetic approximations.

Keep primary content and actions available without hover, custom cursors, audio, or elaborate animation. Plan phone, tablet, and window composition for the requested targets. Make sound user-controlled. Specify relevant loading, empty, error, success, and editing states. A save button needs real persistence or an explicit prototype boundary; navigation needs meaningful destinations.

Other design or framework skills may help execution if available. This skill must remain usable without Taste Skill, an image generator, a particular framework, or a paid service. If instructions from another design skill conflict, preserve the user's explicit direction and resolve the conflict rather than blending incompatible defaults.

## 5. Review against intent and craft

Read the review section of [assets-and-review.md](references/assets-and-review.md) and the selected platform reference before finalizing. Compare the actual result with the brief and fix visible or behavioral issues within scope.

Evaluate two questions separately:

1. **Fit:** Does this represent the user, serve the intended audience, and make the primary task clear?
2. **Craft:** Are the composition, imagery, type, interactions, adaptive layout, and implementation coherent and functional?

Avoid generic filler, invented proof, unrelated decorative effects, and repetitive section compositions. Do not universally ban gradients, cards, serif fonts, centered layouts, or other legitimate techniques. Judge their purpose and execution. Variety must serve the content; novelty alone is not quality.

Report what was produced, what was verified, and any material unresolved items. Do not claim visual inspection, accessibility compliance, performance targets, or successful behavior without evidence.

Keep verification tied to the actual target. Browser testing does not verify Android, iOS, or native desktop behavior. If an SDK, emulator, OS, or device is unavailable, preserve the implementation and report that target as unverified. Source provenance and research limits are recorded in [sources.md](references/sources.md).
