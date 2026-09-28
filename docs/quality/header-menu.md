# Header menu — 28 September 2026

Local webpack dev server at http://localhost:3008. Guest entry via “Bypass to Console”. Chrome headless. Not a release build.

| Check | Result | Evidence |
|---|---|---|
| Q01 Production domain | N/A | Local preview only. No deploy. |
| Q02 Page titles | N/A | Header change does not add a view. |
| Q03 Meta descriptions | N/A | No public metadata change. |
| Q04 Favicon | N/A | No icon change. |
| Q05 Open Graph | N/A | No share-card change. |
| Q06 Canonical | N/A | No origin change. |
| Q07 Social previews | N/A | No share-card change. |
| Q08 Custom 404 | N/A | No route change. |
| Q09 Loading | N/A | No new pending state. |
| Q10 Errors | N/A | No new error path. |
| Q11 Heading structure | PASS | Menu group labels are text, not headings. Existing page headings unchanged. |
| Q12 Alternative text | PASS | Icon-only bar controls have accessible names (AI Copilot, Sign In, Menu, DataQuest home). Decorative icons are hidden from assistive tech. |
| Q13 Sitemap | N/A | No indexable URL change. |
| Q14 Console errors | BLOCKED | Exercised on the dev server. Webpack HMR noise appears if the page is opened as 127.0.0.1 instead of localhost. No new app exception was observed on localhost during navigation. |
| Q15 Debug output | PASS | No console.log added. |
| Q16 Source maps | N/A | Dev server only. `productionBrowserSourceMaps` remains false. |
| Q17 JavaScript | N/A | No dependency or bundle-budget change. Not measured on a production build. |
| Q18 Mobile layout | PASS | No horizontal overflow at 360, 390, 768, 1024, 1280, or 1440. Course links are not clipped. Phone bar keeps Sign Up and Menu; AI Copilot and Sign In are the first menu actions. |
| Q19 Spacing | PASS | Reuses the existing rounded-xl controls, 4px grid, and slate/purple colors. |
| Q20 Controls | PASS | Menu opens and closes with click, Enter, and Escape. Analytics, Community, and Leaderboard switch views. Simple, Engineer, Light, and Dark update their pressed state. Like updates its count. |
