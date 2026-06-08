<!--
  TODO(team): Replace bracketed placeholders <like-this> with real project info.
  Search this file for "TODO" before your first demo.
-->

# CENG318 — \<Project Name\>

> \<One-sentence description of what the app does and who it's for.\>

A cross-platform mobile application built with **React Native** and **TypeScript**
for the CENG318 term project.

<!-- Badges activate once CI is running on the default branch. -->
![CI](https://github.com/cagancaliskan/ceng318/actions/workflows/ci.yml/badge.svg)
![Platform](https://img.shields.io/badge/platform-iOS%20%7C%20Android-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Table of contents

- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)
- [Branching & commits](#branching--commits)
- [Testing](#testing)
- [Troubleshooting](#troubleshooting)
- [Team](#team)
- [License](#license)

## Tech stack

| Area        | Choice                                              |
| ----------- | --------------------------------------------------- |
| Framework   | React Native \<bare CLI / Expo — pick one\>         |
| Language    | TypeScript                                          |
| State       | \<e.g. Redux Toolkit / Zustand / Context\>          |
| Navigation  | \<e.g. React Navigation\>                           |
| Networking  | \<e.g. fetch / axios + React Query\>                |
| Testing     | \<e.g. Jest + React Native Testing Library\>        |
| Lint/format | ESLint + Prettier                                   |

## Prerequisites

- **Node.js 20** (an `.nvmrc` is provided — run `nvm use`)
- **npm** (or yarn — agree on one as a team and commit only that lockfile)
- **Watchman** (macOS: `brew install watchman`)
- **iOS:** Xcode + CocoaPods (`sudo gem install cocoapods`)
- **Android:** Android Studio + a configured SDK / emulator
- Follow the official [React Native environment setup](https://reactnative.dev/docs/environment-setup) for your OS.

## Getting started

```bash
# 1. Clone
git clone https://github.com/cagancaliskan/ceng318.git
cd ceng318

# 2. Use the project's Node version
nvm use            # reads .nvmrc

# 3. Install JS dependencies
npm install

# 4. iOS only — install native pods
cd ios && pod install && cd ..

# 5. Copy the env template and fill in values
cp .env.example .env

# 6. Run it
npm run ios        # or: npm run android
```

> **Note:** This repository currently holds the project's tooling and conventions.
> The React Native app itself is scaffolded in a follow-up step
> (`npx react-native@latest init` or `npx create-expo-app`). The scripts below
> are the agreed convention — wire them up in `package.json` when you scaffold.

## Available scripts

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `npm run ios`       | Build & launch the iOS app on a simulator     |
| `npm run android`   | Build & launch the Android app on an emulator |
| `npm start`         | Start the Metro bundler                       |
| `npm run lint`      | Lint with ESLint                              |
| `npm run format`    | Format the codebase with Prettier             |
| `npm run typecheck` | Type-check with `tsc --noEmit`                |
| `npm test`          | Run the unit test suite                       |

## Project structure

```text
ceng318/
├── .github/            # CI, issue/PR templates, CODEOWNERS, Dependabot
├── src/                # App source (added when the app is scaffolded)
│   ├── components/     # Reusable UI components
│   ├── screens/        # Screen-level components
│   ├── navigation/     # Navigators & route config
│   ├── services/       # API clients & data access
│   ├── hooks/          # Shared React hooks
│   ├── store/          # State management
│   └── utils/          # Helpers
├── __tests__/          # Test suites
├── .editorconfig
├── .gitignore
├── .nvmrc
└── README.md
```

## Environment variables

Secrets and machine-specific values live in `.env` (git-ignored). Commit a
redacted **`.env.example`** so teammates know which keys are required.

```bash
# .env.example
API_BASE_URL=https://api.example.com
```

Never commit a real `.env`, API keys, `google-services.json`, or
`GoogleService-Info.plist`.

## Branching & commits

We use short-lived feature branches, **Conventional Commits**, and pull requests
with at least one review. Full details in **[CONTRIBUTING.md](CONTRIBUTING.md)**.

## Testing

```bash
npm test            # run once
npm test -- --watch # watch mode
```

Aim to cover business logic (`services/`, `utils/`, `hooks/`) and critical
screens. CI runs the suite on every pull request.

## Troubleshooting

- **Metro cache weirdness:** `npm start -- --reset-cache`
- **iOS build fails after dependency changes:** `cd ios && pod install && cd ..`
- **Android Gradle issues:** `cd android && ./gradlew clean && cd ..`
- **Wrong Node version:** `nvm use` (or install Node 20)

## Team

<!-- TODO(team): add members + GitHub handles. Keep CODEOWNERS in sync. -->

| Name    | GitHub          | Role |
| ------- | --------------- | ---- |
| \<Name\> | @cagancaliskan | Maintainer |
| \<Name\> | @\<handle\>     | \<role\> |

## License

Released under the [MIT License](LICENSE).
