# Toolkit selection and adaptation

Read the section matching the project, alongside its web, mobile, or desktop lane. This reference covers decision points rather than complete framework tutorials. Preserve the user's toolkit and existing architecture. Do not install every toolkit, read every section, or migrate a working project to fit these notes.

## Identify the actual UI stack

Separate language from UI technology and target. Kotlin might mean Android Views, Jetpack Compose, or Compose Multiplatform. Swift might mean SwiftUI, UIKit, or AppKit. JavaScript might mean a website, React Native, Electron, or a hybrid app. C# does not automatically mean MAUI. Use manifests, dependencies, source files, and the user's brief as evidence.

Record only relevant facts: requested OS/runtime; UI toolkit and version; existing navigation and state conventions; resource packaging; available build and preview tools. Clarify consequential ambiguity when the project does not resolve it. Never interpret "universal skill" as permission to generate every platform for a single request.

## Kotlin: Android and Compose Multiplatform

- Inspect Gradle configuration, AndroidManifest.xml, source sets, and the UI code. Preserve Android Views/XML or Compose as found; do not make migration a prerequisite for a visual redesign.
- With Compose, keep state ownership explicit and rendering separate from durable data. Remembered UI state is not a substitute for persistent journal entries or user records. Use lifecycle-aware work appropriate to the existing architecture.
- Adapt to usable window space, system insets, and the keyboard. Choose compact and expanded arrangements from tasks; preserve selection and navigation context during reflow.
- Use standard interactive components and semantics for custom ones. Verify TalkBack and keyboard access where relevant; custom drawing still needs accessible controls and descriptions.
- Preserve the existing navigation library and back behavior. An adaptive-navigation reference requiring a particular library is useful only when the project meets those prerequisites; do not automatically install or migrate to it.
- For Compose Multiplatform, distinguish shared UI/business code from target-specific integrations and resources. Do not put Android-only APIs into common code or assume one target's successful build establishes another's behavior.

References: official [Android adaptive skill](https://developer.android.com/agents/skills/jetpack-compose/adaptive/skill), [Compose accessibility](https://developer.android.com/develop/ui/compose/accessibility), and [Compose Multiplatform relationship to Jetpack Compose](https://kotlinlang.org/docs/multiplatform/compose-multiplatform-and-jetpack-compose.html). Verify compatibility against the project's Gradle and SDK versions.

## Swift: SwiftUI, UIKit, and AppKit

- Inspect the Xcode project or package, deployment targets, and current view composition. Keep UIKit/AppKit where established; SwiftUI is not a mandatory migration.
- For SwiftUI, distinguish owned from injected state, keep view identity stable, and avoid making every screen depend on unrelated changing state. Keep expensive work out of view rendering and perform UI updates on the appropriate main actor/thread.
- Choose stack, split-view, tab, and window structure from the target and workflow. Preserve native back/dismissal behavior and unsaved edits; a phone screen and a macOS window need different input and density decisions.
- Use the target's text scaling, accessibility labels/values, and native controls where suitable. Verify custom controls with VoiceOver when the environment allows it.
- Check availability for the deployment target and provide appropriate fallbacks. Do not require a recent OS visual effect, new state API, or a reference skill's minimum SDK unless the product or project requires it.
- Build and inspect using available Apple tooling. A Windows source review, browser mockup, or another platform's build does not verify an iOS/macOS app. Keep the requested implementation and identify missing target checks.

References: [Apple SwiftUI navigation](https://developer.apple.com/documentation/swiftui/navigationstack), [accessibility fundamentals](https://developer.apple.com/documentation/swiftui/accessibility-fundamentals), [UIKit](https://developer.apple.com/documentation/uikit), and [AppKit](https://developer.apple.com/documentation/appkit). Also reviewed [Antoine van der Lee's SwiftUI Expert Skill](https://github.com/AvdLee/SwiftUI-Agent-Skill/blob/main/skills/swiftui-expert-skill/SKILL.md); use its version-sensitive references selectively rather than importing every rule or workflow.

## Electron and Tauri: web UI with native integration

Apply both web and desktop lanes. Retain the existing renderer framework; Electron or Tauri does not dictate React, Vue, Svelte, or a styling library.

For Electron, distinguish main-process responsibilities, the preload bridge, and renderer UI. Keep privileged functionality behind narrow, validated IPC operations. Do not expose raw IPC or unrestricted Node/file access to renderer content to make an effect or file button work. Retain context isolation and suitable renderer sandboxing; do not weaken them to hide an integration bug. Validate the sender and operation inputs, and handle external URLs and navigation deliberately.

Use real native file dialogs, menus, clipboard, or window APIs when requested, with cancellation and failure feedback. Check that bundled artwork and renderer routes work in the packaged layout. Keep ordinary window management and keyboard conventions. Tray behavior, auto-start, auto-updates, and custom chrome are scope decisions, not standard additions to every app.

For Tauri, follow its own commands, plugins, capability scopes, and webview boundary. Grant only the capabilities required by the feature; do not copy Electron's APIs into Tauri or enable broad native access as a shortcut.

Verify in the actual shell as well as the renderer preview. Browser checks can establish web layout but cannot verify IPC, native dialogs, menus, packaging, or window lifecycle. A working development shell is not evidence that every requested OS package was built.

References: Electron's [process model](https://www.electronjs.org/docs/latest/tutorial/process-model), [context isolation](https://www.electronjs.org/docs/latest/tutorial/context-isolation), and [security guidance](https://www.electronjs.org/docs/latest/tutorial/security); Tauri's [capabilities](https://v2.tauri.app/security/capabilities/).

## Other major UI families

These concise translation notes complement the detailed platform lanes. Research version-sensitive APIs when needed; do not interpret this table as a tested implementation catalog.

| Family | How to translate the design |
| --- | --- |
| React Native / Expo | Use native components, platform accessibility props, safe areas, and the project's router/state approach. Web CSS and DOM behavior do not transfer literally. Validate in the native runtime. [Accessibility docs](https://reactnative.dev/docs/accessibility). |
| Ionic / Capacitor or another hybrid WebView app | Keep the web UI and use explicit native integrations where required. Check touch, keyboard, native back, resources, and plugins in the installed app; calling a website a hybrid app does not implement its native features. [Capacitor workflow](https://capacitorjs.com/docs/basics/workflow). |
| PWA | Apply the web lane; distinguish installability from native delivery. Add offline/cache behavior only when requested or needed, with deliberate update and stale-data handling. [MDN PWA guide](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps). |
| WPF / WinUI / Windows Forms | Keep the actual framework's controls, resources, bindings/event model, and dispatcher conventions. Similar C#/XAML vocabulary does not make APIs interchangeable; target Windows when that is the framework's scope. [WPF](https://learn.microsoft.com/en-us/dotnet/desktop/wpf/overview/), [WinUI](https://learn.microsoft.com/en-us/windows/apps/winui/winui3/). |
| Qt Widgets / Qt Quick, PySide / PyQt | Distinguish Widgets from QML/Quick and the selected language binding. Reuse native layouts, models, actions, and accessible controls; match resources and UI-thread/event-loop behavior to the binding. [Qt accessibility](https://doc.qt.io/qt-6/accessible.html), [Qt for Python](https://doc.qt.io/qtforpython-6/). |
| GTK and related bindings | Preserve widget composition, the binding's event loop, accessibility, actions, and native resources. Research the installed GTK generation rather than mixing APIs. [GTK docs](https://docs.gtk.org/gtk4/). |
| Tkinter / ttk and other Python desktop toolkits | Use toolkit layouts and event-loop scheduling, preserve keyboard behavior, and verify assets in the distributed app. Long operations must not block the window. [Tkinter docs](https://docs.python.org/3/library/tkinter.html). |
| Flutter, MAUI, Avalonia, JavaFX, Swing | Use the existing toolkit notes in [mobile-apps.md](mobile-apps.md) and [desktop-apps.md](desktop-apps.md), combined with the requested surface. |
| Browser stacks, including plain HTML, React, Vue, Svelte, Angular, and Blazor | Use [web-apps.md](web-apps.md), the existing framework's components and state/routing conventions, and its official documentation for implementation. Server-rendered and client-rendered screens need the same truthful content and useful task flow. |

## Adapt any toolkit not listed

1. Identify the requested surface, actual UI toolkit, version, and build target from the brief and project.
2. Apply shared discovery and art direction plus the relevant input/window/device lane. Keep decisions grounded in the user's task rather than the toolkit's demo template.
3. Consult official docs for the relevant mechanisms: layout, state/navigation, resources, accessibility, lifecycle/threading, and any required native integration. Check existing local examples before inventing APIs. Read only what the task needs.
4. Translate visual intent into real toolkit controls, functional tokens/resources, and behavior. Preserve native conventions unless the chosen concept calls for a justified alternative.
5. Verify the requested runtime and build when available. Distinguish confirmed API behavior, reasoned design choices, and unresolved/tooling limits. Never silently substitute a different framework or claim unperformed target testing.

For prompt-only work, include these decisions in the standalone prompt without promising implementation. If documentation or tooling is unavailable, continue useful design work and identify precisely what remains unverified.
