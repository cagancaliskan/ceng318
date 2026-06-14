# Deploying EggChef to the web (Vercel — free)

The whole demo ships as **one static site**:

| Path     | What                                            |
|----------|-------------------------------------------------|
| `/`      | Branded landing page (`site/index.html`)        |
| `/app`   | Phone app — Expo **web** export                 |
| `/watch` | Apple Watch demo (`watch-web/index.html`)       |

`build-web.sh` assembles all three into `public_out/`; `vercel.json` tells Vercel to
run that script and serve `public_out/`.

## One-time prerequisite
The phone app needs the web packages — already in `package.json`:
`react-dom`, `react-native-web`, `@expo/metro-runtime`.
If a fresh clone is ever missing them:

```bash
npx expo install react-dom react-native-web @expo/metro-runtime
```

## Verify locally first (recommended)
```bash
bash build-web.sh        # expo export + assemble public_out/
npx serve public_out     # open the printed URL → test  /  /app  /watch
```
If `expo export` errors, fix it here — Vercel runs the exact same command.

## Deploy with Vercel (Git integration — recommended)
1. Commit & push these files to `main`.
2. vercel.com → **Add New… → Project** → sign in with GitHub → import
   `cagancaliskan/ceng318`.
3. Vercel reads `vercel.json` automatically (build = `bash build-web.sh`,
   output = `public_out`). Leave the detected settings as-is.
4. **Deploy.** You get a `https://<project>.vercel.app` URL, and every push to
   `main` re-deploys automatically.

### Or via CLI
```bash
npm i -g vercel
vercel          # first run links/creates the project
vercel --prod   # production deploy
```

## Notes
- `app.json → experiments.baseUrl: "/app"` makes the phone bundle load its assets
  from `/app`. Keep it — it only affects the web build, not iOS/Android.
- React Navigation runs in-memory on web, so the phone app stays one URL (no extra
  rewrite/routing config needed).
- The watch demo is fully self-contained HTML; it needs no build.
