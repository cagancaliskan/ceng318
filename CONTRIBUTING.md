# Contributing to CENG318

Thanks for working on this project! These conventions keep our shared history
clean and our reviews fast. Read this once before your first pull request.

## Table of contents

- [Ground rules](#ground-rules)
- [Local setup](#local-setup)
- [Branching model](#branching-model)
- [Commit messages](#commit-messages)
- [Pull requests](#pull-requests)
- [Code review](#code-review)
- [Code style](#code-style)
- [Reporting bugs & proposing features](#reporting-bugs--proposing-features)

## Ground rules

- **Never push directly to `main`.** All changes land through a pull request.
- **One logical change per PR.** Small PRs get reviewed faster and break less.
- **Keep `main` releasable.** It must always build and pass CI.
- **Don't commit secrets.** Use `.env` (git-ignored) and update `.env.example`.

## Local setup

```bash
nvm use            # Node 20, from .nvmrc
npm install
cp .env.example .env
```

See the [README](README.md#getting-started) for platform-specific (iOS/Android) steps.

## Branching model

Short-lived branches off `main`, named `type/short-description`:

| Prefix      | Use for                                  | Example                      |
| ----------- | ---------------------------------------- | ---------------------------- |
| `feat/`     | A new feature                            | `feat/login-screen`          |
| `fix/`      | A bug fix                                | `fix/crash-on-empty-list`    |
| `chore/`    | Tooling, config, deps, no product change | `chore/bump-rn-0.75`         |
| `docs/`     | Documentation only                       | `docs/api-usage`             |
| `refactor/` | Code change with no behavior change      | `refactor/extract-api-hook`  |
| `test/`     | Adding or fixing tests                   | `test/cart-reducer`          |

Rebase or merge `main` into your branch before requesting review so your diff is
current and conflict-free.

## Commit messages

We follow [**Conventional Commits**](https://www.conventionalcommits.org/).

```text
<type>(<optional scope>): <short summary in imperative mood>

<optional body — what & why, not how>

<optional footer — e.g. "Closes #42">
```

Allowed types: `feat`, `fix`, `chore`, `docs`, `refactor`, `test`, `perf`,
`build`, `ci`, `style`, `revert`.

Examples:

```text
feat(auth): add email/password login screen
fix(cart): prevent negative quantities
chore: configure ESLint + Prettier
docs(readme): document Android build steps
```

Why it matters: a consistent history makes `git log` readable, enables automated
changelogs, and makes it obvious what each change does.

## Pull requests

1. Push your branch and open a PR against `main`.
2. Fill in the PR template — describe **what** changed and **why**, link issues
   (`Closes #NN`), and add screenshots/screen recordings for any UI change.
3. Make sure **CI is green** and your branch is up to date with `main`.
4. Request a review from at least one teammate (see [CODEOWNERS](.github/CODEOWNERS)).
5. Resolve review threads, then **squash & merge** to keep `main` linear.
6. Delete the branch after merge.

## Code review

- Aim to review open PRs within ~24h on a working day — unblocking teammates is
  part of the job.
- Review the code, not the coder. Be specific and kind; explain the "why."
- Use **Request changes** only for correctness, security, or convention issues.
  Style nits should be marked as non-blocking (prefix with `nit:`).
- The author resolves threads; the reviewer who requested changes re-approves.

## Code style

- **Formatting** is handled by Prettier — run `npm run format` (config in
  `.prettierrc.json`). Don't hand-format; let the tool win.
- **Linting** is handled by ESLint — run `npm run lint`. When the app is
  scaffolded, extend the React Native config:
  `{ "extends": "@react-native" }` (bare) or the Expo ESLint config.
- **Types:** prefer explicit types at module boundaries; avoid `any`. Keep
  `npm run typecheck` clean.
- **Naming:** `PascalCase` for components, `camelCase` for variables/functions,
  `UPPER_SNAKE_CASE` for constants.

## Reporting bugs & proposing features

Open an issue using the templates under **New issue** (Bug report / Feature
request). Search existing issues first to avoid duplicates. For anything
security-sensitive, see [SECURITY.md](SECURITY.md).
