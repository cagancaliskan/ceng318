# Contributing to EggChef

Thanks for working on EggChef! This guide keeps our history clean and our reviews fast. It's short — please read it once before your first pull request.

## Table of contents

- [Ground rules](#ground-rules)
- [Local setup](#local-setup)
- [Project conventions (read this!)](#project-conventions-read-this)
- [Adding a new screen](#adding-a-new-screen)
- [Branching model](#branching-model)
- [Commit messages](#commit-messages)
- [Pull requests](#pull-requests)
- [Code review](#code-review)

## Ground rules

- **Never push directly to `main`.** Every change lands through a pull request.
- **One logical change per PR.** Small PRs review faster and break less.
- **Keep `main` runnable.** It must always launch and pass `npm run typecheck`.
- **Don't commit generated/native folders.** `ios/`, `android/`, `node_modules/` are git-ignored on purpose (regenerated locally).

## Local setup

```bash
git clone https://github.com/cagancaliskan/ceng318.git   # into a space-free path
cd ceng318
npm install
npx expo run:ios     # or: npx expo start --go  (Expo Go, no Xcode)
```

Full setup + troubleshooting: **[docs/SETUP.md](./docs/SETUP.md)**. Architecture: **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)**.

## Project conventions (read this!)

These three rules keep the UI consistent with the Figma. Follow them and your code will "just match":

1. **Scale every dimension with `ds()`.** Sizes, padding, radius, font size — all in *design pixels* passed through `ds()`.
   ```tsx
   // ✅ good — matches the design on every phone
   <View style={{ width: ds(100), borderRadius: ds(16), padding: ds(14) }} />
   // ❌ bad — raw pixels won't scale
   <View style={{ width: 100, borderRadius: 16, padding: 14 }} />
   ```
2. **Use the theme, never hard-coded values.**
   - Colors → `import { C } from '../theme/colors'` (e.g. `C.bordo`, `C.bg`, `C.gray`).
   - Text → the `<Txt>` component (`size`, `weight`, `color`) or `hn(weight)` for raw `fontFamily`.
   - Shadows → `bs('0 4px 4px rgba(0,0,0,0.25)')` (a CSS-like shadow string; it auto-scales).
3. **Prefer `<Txt>` over `<Text>`** so font + scaling are handled for you.

Other conventions:

- **TypeScript:** keep `npm run typecheck` clean. Avoid `any`. Type props explicitly.
- **Naming:** `PascalCase` components, `camelCase` values/functions, `UPPER_SNAKE_CASE` constants.
- **Icons:** add new SVG icons to `src/icons/index.tsx` and accept `{ size, color, sw }`.
- **State:** cross-screen state goes in `src/state/session.tsx` (the `useSession()` context), not in component state.

## Adding a new screen

1. Create `src/screens/MyScreen.tsx` (start from an existing screen for the layout helpers).
2. Add its route to `src/navigation/types.ts` (`RootStackParamList`).
3. Register it in `src/navigation/RootNavigator.tsx` (as a normal screen, or inside the modal `Stack.Group` for a popup).
4. Wrap full screens in `<Screen>` + `<AppHeader>` and render `<BottomNav>` if it's a tab.
5. Run `npm run typecheck` and test the navigation both ways.

## Branching model

Short-lived branches off `main`, named `type/short-description`:

| Prefix | Use for | Example |
|---|---|---|
| `feat/` | A new feature | `feat/history-filter` |
| `fix/` | A bug fix | `fix/timer-direction` |
| `chore/` | Tooling, config, deps | `chore/bump-expo-54` |
| `docs/` | Documentation only | `docs/api-contract` |
| `refactor/` | No behavior change | `refactor/extract-ring` |
| `test/` | Adding or fixing tests | `test/session-timer` |

Merge or rebase `main` into your branch before requesting review so your diff is current.

## Commit messages

We follow [**Conventional Commits**](https://www.conventionalcommits.org/):

```text
<type>(<optional scope>): <short summary, imperative mood>

<optional body — what & why, not how>

<optional footer — e.g. "Closes #42">
```

Allowed types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`, `build`, `ci`, `style`, `revert`.

Examples:

```text
feat(cooking): add the 3 stage bubbles to the ring
fix(cooking): sweep the timer counter-clockwise
docs(readme): add iOS simulator quick start
```

## Pull requests

1. Push your branch and open a PR against `main`.
2. Describe **what** changed and **why**; link issues (`Closes #NN`); add **screenshots / screen recordings** for any UI change.
3. Make sure `npm run typecheck` passes and your branch is up to date with `main`.
4. Request a review from at least one teammate.
5. Resolve threads, then **squash & merge** to keep `main` linear, and delete the branch.

## Code review

- Try to review open PRs within ~24h on a working day — unblocking teammates is part of the job.
- Review the code, not the coder. Be specific and kind; explain the "why."
- Use **Request changes** only for correctness/convention issues; prefix style nits with `nit:` (non-blocking).

Happy cooking! 🥚
