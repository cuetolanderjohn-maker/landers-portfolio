# Tailored master prompt

Produce a standalone instruction another builder can use without reading this conversation or having this skill installed. Match detail to the project: a simple portfolio needs less than an interactive exhibition.

## Include what changes the result

Use the following structure when helpful; omit irrelevant sections rather than forcing every project into it.

1. **Assignment and deliverable:** What to create, for whom, and whether it is a working website/app, prototype, or design specification. Include requested targets and chosen toolkit; do not silently select additional platforms.
2. **Purpose and user journey:** Primary audience, intended task, priorities, and success criteria.
3. **Content and structure:** Pages, screens, or windows, their distinct roles, navigation, supplied copy, project facts, data, and real assets.
4. **Creative concept:** The central idea and its relationship to the user's identity or offering.
5. **Art direction:** Layout and hierarchy, typography roles, palette with functional roles, imagery, surfaces, and motif placement. Include precise values only when chosen and useful.
6. **Asset specification:** Existing asset locations, planned image subjects and compositions, generation prompts when requested, aspect ratios, mobile crops, and transparent cutouts when appropriate.
7. **Interaction behavior:** Triggers, visible outcomes, relevant states, interruption behavior, and touch, keyboard, and reduced-motion alternatives. For apps, include relevant back/dismissal, editing, pending-save, failure, and resume behavior.
8. **Implementation constraints:** Existing stack and versions when known, necessary integrations, data/persistence boundaries, maintainability, and behavior-specific techniques. Separate required features from optional enhancements and prototype stubs.
9. **Verification:** Concrete checks for visual fit, content integrity, primary actions, target-specific layout and input, accessibility, and any agreed performance target. Identify required builds, runtime checks, and unavailable targets without promising unperformed verification.
10. **Unresolved inputs:** Only material missing inputs and explicitly identified assumptions.

## Writing rules

- Lead with the project and user, not a generic "world-class designer" persona.
- Translate adjectives into visible decisions. "Tactile" might mean directional graphite grain, light paper fibers, and roughened display lettering with readable body text.
- Specify relationships and behavior. "Reveal the dragon's contour as this section enters view, retaining a complete static illustration for reduced motion" is more useful than "add stunning animation."
- Explain where a motif belongs and where content takes priority. Avoid reproducing the hero composition in every section.
- Include actual provided copy and facts. Clearly mark missing content or demonstration material; never invent credentials, clients, product claims, or portfolio projects.
- Do not force handwritten body text, dark-mode inversion, audio, shaders, 3D, or a particular library because a reference uses them.
- Define exact technology only when required or already selected. If a mechanism is central, say whether an approximation is acceptable.
- Keep the prompt self-contained. Local file paths can accompany attached assets; a remote builder needs accessible attachments or descriptive asset specifications, not an assumption that it can read the user's filesystem.
- Resolve contradictory requirements before handoff. Make priorities and accepted tradeoffs explicit.
- Do not promise identical reproduction, awards, or quality guarantees from wording alone.

## Completion check

A builder should be able to answer: What am I building? What content belongs here? What makes this direction specific to this user? What must work? Which assets exist? What needs supplying? How do I judge the result?

For an app prompt, transfer the relevant platform decisions into the prompt itself. An external builder should not need to install Canvas Design or fetch its references to learn that the app uses Flutter, saves locally, or needs keyboard operation. Keep exact SDK requirements consistent with the project; do not freeze every project to the versions seen during research.

Return a complete copyable prompt when requested. Save it as a Markdown file when useful. In an implementation task, a concise working brief is enough unless the user also requested a separate master-prompt artifact.
