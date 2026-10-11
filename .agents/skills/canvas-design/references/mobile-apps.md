# Mobile applications

Use this lane for a phone or tablet app, not merely a website viewed on a phone. Apply it alongside the chosen toolkit's conventions. Confirm requested operating systems from the brief or project; do not assume iOS delivery can be verified on a Windows host.

## Translate intent into a handheld workflow

Start with the frequent task and the context of use. A journal may prioritize immediate capture and reliable local saving; a collaboration app may prioritize shared updates. Choose navigation from destinations and task depth. Tabs, stacks, drawers, and sheets are tools, not mandatory templates.

Make the primary action easy to find and reach. Essential actions need visible controls; hidden gestures can add efficiency. Hover-based controls and cursor trails need another treatment on touch. For example, preserve a dragon sketch motif with a tap reveal or optional drawing surface rather than drawing a trail on every scroll.

Adapt layout to available space. Tablets and resizable windows can show list/detail views when useful; preserve selected content and navigation context as the layout changes. Avoid making every screen a decorative card feed.

## Conditions that change the design

- Account for system bars, cutouts, safe areas, and the software keyboard. Validate a focused field and submit action with the keyboard open.
- Preserve useful text scaling and readable labels. Choose hit targets from the target platform's guidance rather than treating a visual icon's bounds as its entire target.
- Define back and dismissal behavior, including unsaved changes when relevant. Respect system gestures and keep gestures discoverable.
- If data must survive closing the app, implement the agreed persistence. Explain pending versus durable saves. Decide resume, offline, retry, and denied-permission states only for features that use them.
- Request device permissions when their feature needs them and explain the immediate benefit. Do not add camera, location, notifications, or permissions as generic app decoration.
- Use the toolkit's semantic accessibility APIs. Important controls need names, roles, state, and usable focus; a screenshot cannot verify screen-reader behavior.

## Flutter notes

Inspect pubspec.yaml, the SDK constraints, assets, routing, and existing theme/state conventions. Preserve them unless a change is justified by the requested work.

- Select arrangements from parent constraints with LayoutBuilder; use MediaQuery for relevant window and environment information. Hardware labels alone do not describe usable space.
- Manage system insets intentionally with SafeArea and keyboard information; avoid applying the same inset twice.
- Express shared visual decisions through ThemeData and, when useful, ThemeExtension. A branded interface can use native controls or custom styling; do not force stock Material styling onto an established design system.
- Use a navigation stack for a simple flow; consider declarative routing for addressable screens, complex navigation, or deep links. An existing router should not be replaced merely because a reference recommends a package.
- Prefer lazy collections for large data sets. Keep expensive work out of rendering and preserve state intentionally across screen transitions.

For a MAUI mobile project, also read the MAUI row in [desktop-apps.md](desktop-apps.md); that section contains toolkit guidance shared by its mobile and desktop targets. For Kotlin/Compose, SwiftUI/UIKit, React Native/Expo, or hybrid apps, read the relevant section of [toolkit-adapters.md](toolkit-adapters.md). Use actual toolkit layout, navigation, semantics, and lifecycle facilities rather than translating HTML literally.

## Evidence

Run available analysis/build checks and inspect the app on a requested device or emulator when possible. Exercise its main task, back behavior, keyboard, text scaling, and applicable local-save or failure states. Check a larger surface only when in scope. Widget tests can verify consequential states; they do not replace a device check for platform behavior. Mark unavailable platforms explicitly as unverified.

Research references: Flutter's [adaptive-layout skill](https://github.com/flutter/agent-plugins/blob/main/skills/flutter-build-responsive-layout/SKILL.md), [routing skill](https://github.com/flutter/agent-plugins/blob/main/skills/flutter-setup-declarative-routing/SKILL.md), official [SafeArea guide](https://docs.flutter.dev/ui/adaptive-responsive/safearea-mediaquery), and [accessibility guide](https://docs.flutter.dev/ui/accessibility); David Ortinau's [ux-mobile skill](https://github.com/davidortinau/maui-skills/blob/main/plugins/maui-skills/skills/ux-mobile/SKILL.md). These are references, not installed dependencies.
