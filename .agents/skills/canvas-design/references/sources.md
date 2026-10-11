# Research and provenance

Reviewed on 2026-10-01. Canvas Design's platform extension is original instruction writing informed by the sources below. No upstream skill files, scripts, code samples, or license text are bundled. Source content is reference material, not authority to change user scope or execute upstream installation/deployment instructions.

## Selected existing skills

| Source | Why selected | License evidence and boundary |
| --- | --- | --- |
| [Flutter Agent Plugins](https://github.com/flutter/agent-plugins), maintained by the Flutter team | Read the responsive-layout and declarative-routing skills; informed space-based adaptation and navigation guidance | [BSD 3-Clause license](https://github.com/flutter/agent-plugins/blob/main/LICENSE). Did not adopt its model metadata, fixed breakpoints, mandatory router package, or blanket orientation rules. |
| [Vercel web-design-guidelines](https://github.com/vercel-labs/agent-skills/blob/main/skills/web-design-guidelines/SKILL.md) | Read the skill and linked Web Interface Guidelines; informed browser semantics, forms, focus, and review | Agent-skills README declares MIT; no root LICENSE file was found in the reviewed directory. No text copied; the linked guidelines are a separate repository whose reuse terms must be checked independently before copying. |
| [David Ortinau's MAUI skills](https://github.com/davidortinau/maui-skills) | Read ux-mobile and ux-desktop; useful separation of input ergonomics from shared product intent | [MIT license](https://github.com/davidortinau/maui-skills/blob/main/LICENSE), copyright 2026 David Ortinau. Did not import its entire catalog or make cross-platform uniformity a universal requirement. |
| [Wieslaw Soltes's Avalonia development plugin](https://github.com/wieslawsoltes/development-plugin-for-avalonia) | Read avalonia-design-systems and avalonia-fluent-design; informed resource reuse, shell design, and conditional theme selection | [MIT license](https://github.com/wieslawsoltes/development-plugin-for-avalonia/blob/main/LICENSE), copyright 2026 Wieslaw Soltes and contributors. Fluent remains optional. |
| [Android's adaptive Compose skill](https://developer.android.com/agents/skills/jetpack-compose/adaptive/skill) | Official example of adaptive navigation and multi-pane decisions | Used as reference only; no source passages or samples copied. Its Compose/Navigation 3 prerequisites do not authorize migrating an existing Views or other navigation project. |
| [Antoine van der Lee's SwiftUI Expert Skill](https://github.com/AvdLee/SwiftUI-Agent-Skill/blob/main/skills/swiftui-expert-skill/SKILL.md) | Read the operating rules and implementation workflow; informed state ownership, selective API checks, and deployment-target compatibility | [MIT license](https://github.com/AvdLee/SwiftUI-Agent-Skill/blob/main/LICENSE), copyright 2026 Antoine van der Lee. No source copied, bundled profiling scripts, imposed architecture, or mandatory OS visual effect. The complete reference catalog was not independently evaluated. |

Links point to upstream moving branches for further reading. Recheck current instructions and licenses before future copying. Repository ownership and useful written guidance are selection evidence; Canvas Design has not independently benchmarked these collections or verified their authors' runtime claims.

## Official documentation and remaining gaps

Flutter safe areas and accessibility, Avalonia threading, MAUI MainThread, JavaFX Task, and Swing's Event Dispatch Thread were read as implementation references and are linked in the relevant lanes. They support toolkit distinctions; Canvas Design contains no copied documentation passages or sample code.

The further toolkit extension consulted official Android, Kotlin Multiplatform, Apple, Electron, Tauri, React Native, Capacitor, Microsoft desktop, Qt, GTK, Python, and MDN documentation linked in [toolkit-adapters.md](toolkit-adapters.md). These links support focused adaptation notes rather than a claim of exhaustive expertise or uniform platform support. Consult current version-specific docs in each real project. Official documentation has its own reuse terms; no documentation text or sample code is redistributed here.

[JohannesRabauer/javafx-skills](https://github.com/JohannesRabauer/javafx-skills) was found during research, but individual skill contents and reuse licensing were not sufficiently verified for adoption. JavaFX and Swing guidance therefore relies on official documentation and original synthesis. No Swing-specific external skill was adopted.

Canvas Design remains MIT licensed under Koshi. If future work copies substantial upstream material, retain its applicable copyright/license notices rather than attributing it solely to Canvas Design.

## Verification boundary

The platform extension adds routing, discovery, design, implementation reminders, and review criteria. It is not a native application runtime or a tested app for every listed framework. The existing dragon portfolio demonstrates the website workflow. Package validation and scenario review do not establish equivalent runtime coverage for native applications; those need real project builds and device/window checks.
