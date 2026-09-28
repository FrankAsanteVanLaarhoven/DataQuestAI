# Analytics live ingest — 28 September 2026

Local webpack dev server at http://localhost:3008. Guest entry via “Bypass to Console”. Chrome headless. Not a release build.

The preview starts from the library baseline (445 books, 820 users, +24% borrowings) and applies each live-feed event.

| Check | Result | Evidence |
|---|---|---|
| Q01–Q08, Q13, Q16, Q17 | N/A | No route, metadata, domain, or production-bundle change. |
| Q09 Loading | PASS | Live and Paused are explicit. Pausing stops new events; resuming continues them. |
| Q10 Errors | N/A | No new error path. A pre-existing 401 from session restore was observed and not introduced here. |
| Q11 Headings | PASS | The preview keeps its existing section heading. Chart labels are not headings. |
| Q12 Alternative text | PASS | Each chart has an accessible name with the current totals. The live control exposes pressed state. |
| Q14 Console | PASS | No new app exception during the preview flow. |
| Q15 Debug output | PASS | No console.log added. |
| Q18 Mobile | PASS | 390px shows the four charts stacked, with full category and role names. No horizontal overflow. |
| Q19 Spacing | PASS | Uses the existing card radius, pink accent, and 4px spacing. Two columns until the card is wide enough for four. |
| Q20 Controls | PASS | Book total moved 445 → 446 after a catalog ingest. Pause held the total. Add to Dashboard revealed the latency chart. |

Unit checks: `node --test --experimental-strip-types tests/analytics-ingest.test.mjs` — 3 passed.
