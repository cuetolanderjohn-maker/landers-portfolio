# Websites and browser applications

Use this lane for browser delivery, including Flutter web. Keep a portfolio's content hierarchy when that is the job. For an application, organize around repeated tasks rather than automatically adding a marketing hero, testimonials, and pricing sections.

## Establish what must work

Identify the primary workflow, its entry point, data source, and completion condition. Define only relevant states: initial loading, no records, no search matches, failed request with retry, validation, pending save, saved result, or unavailable access. Preserve user input when a request fails. Demonstration data is acceptable for an agreed prototype; label it and describe what is not connected.

Use a small flow description when behavior is unclear: user action → state change → visible feedback → persistence or next destination. Decide which state belongs in the URL, in the current session, or in durable storage. Do not introduce authentication or cloud sync unless needed by the requested product.

## Browser-specific delivery

- Make meaningful routes support direct entry, refresh, and browser back/forward. A transient dialog need not become a route; a shareable document may need one.
- Use HTML controls for their native behavior, with accessible labels and visible keyboard focus. Manage focus deliberately when dialogs open and close.
- Keep form labels visible; provide useful field errors and preserve entered values. Permit normal paste and autofill. Prevent duplicate submissions while explaining progress.
- Adapt navigation and dense content to available space. A narrow layout may need a focused detail view rather than a compressed multi-column dashboard. Choose a readable table treatment from the task: scrolling, priority columns, or another presentation.
- Use reusable functional tokens and existing components where present. Preserve meaning across selected, focused, disabled, error, and success states; changing color alone may not communicate the state.
- Respect reduced motion. Decorative pointer effects remain optional and must not intercept clicks or replace navigation.

Keep the project's web stack. Framework-specific engineering skills may help when available, but React, Tailwind, a component library, or a hosting vendor is not required by Canvas Design. For Flutter web, apply relevant [Flutter notes](mobile-apps.md) and verify browser history and accessibility in the actual web build.

## Evidence

Inspect the key flow in a wide and narrow browser window, including keyboard access and important failure or empty states. For a routed app, check a direct URL and refresh, not just navigation from the home screen. Run the project's appropriate build and focused checks. Report functional integrations separately from mock behavior.

Research reference: [Vercel web-design-guidelines](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) and its linked [Web Interface Guidelines](https://github.com/vercel-labs/web-interface-guidelines/blob/main/command.md). This lane is a selective synthesis; it does not import every upstream rule or its output format.
