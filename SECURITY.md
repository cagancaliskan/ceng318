# Security Policy

## Supported versions

This is an active course project; only the `main` branch is supported.

## Reporting a vulnerability

Please **do not** open a public issue for security problems.

Instead, report it privately:

- Use GitHub's **[Report a vulnerability](https://github.com/cagancaliskan/ceng318/security/advisories/new)**
  (Security → Advisories), **or**
- Email a maintainer at **\<add-a-contact-email@example.com\>**.
  <!-- TODO(team): replace with a real contact. -->

Please include steps to reproduce, the impact, and any suggested fix. We'll
acknowledge your report as soon as we can and keep you updated on the fix.

## Handling secrets

- Never commit credentials, API keys, `.env` files, `google-services.json`, or
  `GoogleService-Info.plist`.
- If a secret is committed by accident, **rotate it immediately** — removing it
  from history is not enough, assume it is compromised.
