# CLAUDE.md — cashflow

Browser replica of the Kiyosaki **Cashflow** board game. Angular 21 SPA, Playwright e2e, no backend.

## Stack

- Angular 21 standalone components
- Tailwind via PostCSS (`postcss.config.js`)
- Service Worker (`ngsw-config.json`) — runs as a PWA
- Playwright for e2e (no unit tests by default)

## Layout

```
src/                          # Angular app
angular.json                  # @angular/build builder
postcss.config.js             # Tailwind pipeline
ngsw-config.json              # PWA cache strategy
playwright.config.ts          # e2e config
playwright-report/            # last run output — gitignored
docs/
  requirements.md             # gameplay rules / acceptance criteria
  plan.md                     # design notes
  tasks.md                    # backlog
  playwright-testing.md       # e2e conventions
BALANCE_REVIEW.md             # ongoing game-balance notes (read before tweaking numbers)
Dockerfile + nginx.conf       # node:25-alpine → nginx:1.30-alpine
docker-compose.yml            # local prod-image check
Makefile                      # convenience wrappers
```

## Commands

```bash
npm install --legacy-peer-deps
npm start                     # ng serve at :4200
npm run build                 # → dist/
npm run build:prod
npm run test:e2e              # Playwright
npm run test:e2e:ui           # Playwright UI mode
npm run test:e2e:install      # first-time browser install
```

## Conventions

- **Standalone components** only — no NgModules.
- **Signals** for game state; keep the state shape thin and serializable so it can survive a service-worker reload.
- **Game balance changes** go through `BALANCE_REVIEW.md` first — that doc captures the rationale for current numbers and the user expects deltas to be reasoned through.
- **Playwright over unit tests** — gameplay correctness is easier to assert through user-visible flows than through component-level mocks.
- Tailwind classes in templates; per-component SCSS only for layout-specific rules.

## Deploy

Frontend-only archetype — push image to GitLab registry, then `kubectl rollout restart deployment/cashflow -n apps` against the shared SPA deployment.

## Gotchas

- PWA service worker can serve stale builds. After deploy, hard-reload or bump `ngsw-config.json` `appData.version` to force update.
- Playwright report dir is large — keep it out of commits.
