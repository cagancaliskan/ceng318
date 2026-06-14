#!/usr/bin/env bash
# ----------------------------------------------------------------------------
# EggChef — web deploy build (Vercel)
# Produces a single static site in ./public_out :
#     /        → branded landing page (site/index.html)
#     /app     → the phone app (Expo web export; assets under /app via app.json baseUrl)
#     /watch   → the Apple Watch demo (watch-web/index.html)
# Run locally to preview:  bash build-web.sh && npx serve public_out
# ----------------------------------------------------------------------------
set -euo pipefail

echo "▶ 1/2  Exporting phone app to static web (expo export)…"
npx expo export --platform web          # → ./dist  (asset URLs prefixed with /app)

echo "▶ 2/2  Assembling public_out/ …"
rm -rf public_out
mkdir -p public_out/app public_out/watch

cp -R dist/.                public_out/app/                 # phone   → /app
cp    watch-web/index.html  public_out/watch/index.html    # watch   → /watch
cp    site/index.html       public_out/index.html          # landing → /

# carry a favicon to the root if one exists
[ -f assets/favicon.png ] && cp assets/favicon.png public_out/favicon.png || true

echo "✓ Done. Static site is in ./public_out  ( / , /app , /watch )"
