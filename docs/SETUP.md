# Setup & running guide

Everything you need to get EggChef running, plus fixes for every issue we actually hit during development. If something breaks, **Ctrl-F the error message** in the [Troubleshooting](#troubleshooting) table below.

- [Prerequisites](#prerequisites)
- [Run on the iOS simulator](#run-on-the-ios-simulator)
- [Run in Expo Go (no Xcode)](#run-in-expo-go-no-xcode)
- [Choosing a simulator device](#choosing-a-simulator-device)
- [Why SDK 54](#why-sdk-54)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

You need a **Mac** to build for iOS.

| Tool | Install | Check |
|---|---|---|
| Node 18+ | [nodejs.org](https://nodejs.org) or `brew install node` | `node -v` |
| Git | comes with Xcode CLT | `git --version` |
| Xcode 16 | Mac App Store, then open it once | `xcodebuild -version` |
| Xcode CLT | `xcode-select --install` | `xcode-select -p` |
| Watchman | `brew install watchman` | `watchman -v` |
| CocoaPods | `brew install cocoapods` | `pod --version` |

> After installing Xcode, open it once so it can install additional components, and make sure a simulator runtime is present: **Xcode → Settings → Components**.

---

## Run on the iOS simulator

```bash
# 1. Clone into a path WITHOUT spaces (important — see troubleshooting)
git clone https://github.com/cagancaliskan/ceng318.git
cd ceng318

# 2. Install JS dependencies
npm install

# 3. Build the native app, start Metro, and launch the simulator — all in one
npx expo run:ios
```

What happens:

1. `expo run:ios` runs **prebuild** (generates the `ios/` folder), then `pod install`, then builds with Xcode.
2. The **first** build compiles all native pods — **~10 minutes, once**. Later builds are seconds.
3. It boots an iPhone simulator, installs the app, and launches it.
4. The same terminal keeps running **Metro** (the JavaScript bundler/dev server).

> 🔴 **Keep that terminal open.** If you close it, Metro stops and the app shows *"No script URL provided."* Just re-run `npx expo run:ios` (or `npx expo start`) to bring Metro back.

### Driving it from Xcode instead

```bash
npx expo prebuild -p ios          # generate ios/ (run if it's missing)
open ios/eggchef.xcworkspace       # ALWAYS the .xcworkspace, not .xcodeproj
```
Then pick an iPhone simulator in the toolbar and press **⌘R**. (Metro still needs to run — `npx expo start` in a separate terminal.)

### Fast reload while developing

- Save a file → Metro **fast-refreshes** automatically.
- Force a reload: press **`r`** in the Metro terminal, or **⌘R** in the simulator.
- Open the dev menu: **⌘D** in the simulator.

---

## Run in Expo Go (no Xcode)

Great for quick UI checks, or if you don't have a Mac:

```bash
npx expo start --go      # then press  i  (iOS)  or scan the QR with Expo Go
```

This skips the native build entirely and runs the JS inside the Expo Go app. All of EggChef's libraries are Expo-Go-compatible, so the full app works.

---

## Choosing a simulator device

```bash
xcrun simctl list devices            # list installed simulators
npx expo run:ios --device "iPhone 16 Pro"   # target a specific one
```

If no simulator opens, open **Xcode → Window → Devices and Simulators** and add an iPhone simulator, or open the **Simulator** app first.

---

## Why SDK 54

We pin **Expo SDK 54 / React Native 0.81** on purpose.

The newest Expo SDK (56) ships Swift packages that declare `swift-tools-version: 6.2`, which requires **Xcode 26 (Swift 6.2)**. On **Xcode 16 (Swift 6.1)** the native build fails at the very end with:

```
xcodebuild: error: Could not resolve package dependencies:
  package 'apple' is using Swift tools version 6.2.0 but the installed version is 6.1.0
```

SDK 54 (RN 0.81) **predates** that requirement *and* the "prebuilt React Core" pod, so it builds cleanly on Xcode 16. If your team standardizes on Xcode 26 later, bumping the SDK is straightforward (`npx expo install expo@latest && npx expo install --fix`).

The exact versions are pinned in [`package.json`](../package.json); `npx expo install --fix` re-aligns them to the SDK if they ever drift.

---

## Troubleshooting

| Error / symptom | Cause | Fix |
|---|---|---|
| **`No script URL provided … unsanitizedScriptURLString = (null)`** | Metro (the JS server) isn't running. | Run `npx expo start` (or `npx expo run:ios`) and **leave it open**. Then ⌘R in the simulator. |
| iOS build fails on **`React-Core-prebuilt … Missing required attribute 'source'`** | Your project path contains a **space** (the prebuilt tarball download breaks on it). | Move/clone the repo to a space-free path, e.g. `~/dev/ceng318`, then `rm -rf ios && npx expo run:ios`. |
| **`package 'apple' is using Swift tools version 6.2.0 …`** | Expo SDK newer than 54 needs Xcode 26. | Stay on SDK 54 (we are), or update Xcode to 26. See [Why SDK 54](#why-sdk-54). |
| Build error after changing dependencies | Stale native project / pods. | `rm -rf ios node_modules package-lock.json && npm install && npx expo run:ios`. |
| Metro shows a red bundling error | A JS/TS error in the code. | Read the file/line Metro prints; fix it; it hot-reloads. Run `npm run typecheck` to catch types. |
| Weird Metro cache behavior | Cached bundle. | `npx expo start -c` (clears the cache). |
| `pod install` is slow or fails | CocoaPods spec repo. | `cd ios && pod install --repo-update && cd ..` |
| Simulator never opens | No simulator runtime. | Open Xcode → Settings → Components, install an iOS runtime; or open the **Simulator** app first. |
| Fonts look like the system default, not Helvetica Neue | You're on Android (Helvetica Neue is iOS-only). | Expected — it falls back to the platform sans-serif on Android. iOS renders Helvetica Neue natively. |

Still stuck? Copy the **exact** error text (and whatever Metro printed) into a GitHub issue — that's almost always enough to diagnose it.
