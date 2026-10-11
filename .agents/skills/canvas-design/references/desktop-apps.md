# Desktop applications and native toolkit notes

Use this lane for a windowed application. Toolkit guidance below also applies to mobile targets where the toolkit supports them; the requested platform still determines ergonomics. Preserve project manifests, dependencies, and existing UI architecture. Verify version-sensitive APIs against official documentation for the installed version.

## Design for working in a window

Choose a shell that supports the primary task: a document editor may need a canvas and tools; a data application may need a list and inspector. Dense controls are useful when they reduce work and remain readable. Do not automatically turn an application into a landing page or spread a simple task across unnecessary panels.

Define sensible resizing and minimum sizes from the actual content. Preserve context when panes collapse. Account for display scaling and long labels. Retain familiar window management unless custom chrome has a concrete benefit and equivalent behavior can be delivered.

Treat keyboard operation as a normal workflow. Establish focus order, a visible focus indicator, standard edit commands, and shortcuts for frequent actions where useful. Context menus and drag-and-drop may supplement visible actions. Hover can explain a control but must not be the only path for keyboard users.

For document or editing tasks, define save, unsaved-change, undo, and close behavior as relevant. For data tasks, define selection, progress, cancellation, and failures. Long I/O or computation must not freeze the interface; update controls through the toolkit's UI thread. Implement the agreed functionality without adding a service or plugin system merely because the app has several views.

## Toolkit translation

| Toolkit | Preserve and use | Check especially |
| --- | --- | --- |
| Avalonia | Existing .axaml, styles, resource dictionaries, bindings, and ViewModels; reusable semantic resources for the chosen theme | Selector and binding behavior, ThemeVariant when supported by the product, UI updates through Dispatcher.UIThread, scaling and keyboard focus |
| .NET MAUI | Existing XAML, C# markup, Reactor, or Hybrid approach; shared resources and bindings; Shell if it is the chosen navigation model | Target frameworks and installed workloads, safe areas on mobile, platform control differences, and UI access through MainThread or the appropriate dispatcher |
| JavaFX | Existing Java/FXML composition, layout panes, properties/bindings, and JavaFX stylesheets | Packaged resource loading, resizing, JavaFX-specific CSS, and Task/Service for suitable background work with UI updates on the JavaFX Application Thread |
| Swing | Existing layout managers, LookAndFeel, Actions, InputMap/ActionMap, and resource loading | Event Dispatch Thread updates, SwingWorker for suitable long tasks, scaling, keyboard traversal, and painting behavior |
| Flutter desktop | Existing widgets, theme, state, and routing; constraint-based layout plus desktop input handling | Window resizing, focus/shortcuts, pointer behavior, filesystem integration when requested, and actual native build |

These are focused design and implementation reminders, not complete engineering specifications. JavaFX CSS is not browser CSS; Swing has no browser DOM. Do not swap toolkits to use a favored library. Choose third-party themes only when compatible and justified. Fluent styling is appropriate when selected; it is not an automatic Avalonia or MAUI requirement.

For Electron/Tauri, SwiftUI/AppKit, Compose Multiplatform, Windows toolkits, Qt, GTK, or Python UI, read the matching section of [toolkit-adapters.md](toolkit-adapters.md). Combine the native/runtime details with this desktop workflow; browser rendering alone does not verify a desktop shell.

Translate the shared concept into native resources and controls. Paper texture may belong behind an illustration workspace; it should not obscure a data grid. Keep icon shapes, stroke weight, type hierarchy, and state treatment consistent. Store supplied/generated artwork in the toolkit's resource system and verify the packaged app can load it.

## Evidence

Build the requested target when its SDK is available. Inspect the running app, resize it, and exercise the key flow with pointer and keyboard. Check scaling and consequential states. Headless UI or ViewModel tests help verify behavior but cannot prove native rendering, window chrome, or assistive-technology behavior. Report each target's build and runtime evidence separately.

Research references: David Ortinau's [ux-desktop](https://github.com/davidortinau/maui-skills/blob/main/plugins/maui-skills/skills/ux-desktop/SKILL.md); Wieslaw Soltes's [avalonia-design-systems](https://github.com/wieslawsoltes/development-plugin-for-avalonia/blob/main/skills/avalonia-design-systems/SKILL.md) and [avalonia-fluent-design](https://github.com/wieslawsoltes/development-plugin-for-avalonia/blob/main/skills/avalonia-fluent-design/SKILL.md).

Official implementation references: [Avalonia threading](https://docs.avaloniaui.net/docs/app-development/threading), [MAUI MainThread](https://learn.microsoft.com/en-us/dotnet/maui/platform-integration/appmodel/main-thread), [JavaFX Task](https://openjfx.io/javadoc/25/javafx.graphics/javafx/concurrent/Task.html), and [Swing Event Dispatch Thread](https://docs.oracle.com/javase/tutorial/uiswing/concurrency/dispatch.html). The Oracle tutorial describes older JDK examples; verify current APIs and build tooling for the project's JDK.
