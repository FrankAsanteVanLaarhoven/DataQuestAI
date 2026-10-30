# Agent Guidelines for DataQuestAI

## 1. UI Copy Integrity & No Instruction Leakage
- **Never replicate user instructions or prompt words into visible UI text**:
  - Do not use prompt adjectives or benchmark terms (e.g. "SOTA", "Benchmark", "Tier-0", "Cutting Edge", "Lucid-like", "Task / Example Design") as labels, badges, or headers.
  - Implement the requested feature cleanly in code, and display only professional, domain-native product labels (e.g. "Architecture Studio", "Relational Canvas", "UML Class Diagram", "Distributed Systems").
- **Audit All Text Elements**:
  - Keep all titles, subtitles, card headers, tooltips, and badges strictly focused on user domain functionality (SQL, database schemas, ERD, queries, metrics).

## 2. Code Quality & Standards
- Ensure all tests pass (`npm test -- --run`).
- Maintain zero TypeScript errors (`npm run build`).

## 3. Production Web Development & Design Quality Checklist (20 Mandatory Standards)
All development and UI implementations across the workspace must pass and adhere to these 20 checks:
1. **Production Domain & URL Hygiene**: Ensure all links, canonical tags, and environment references use verified custom domains; never ship or leak raw `vercel.app` or preview deployment URLs.
2. **Descriptive Page Titles**: Every route and modal must have unique, descriptive, keyword-rich titles (`Page • DataQuest AI`); never use generic "Next App", "Vite App", or "Home".
3. **Compelling Meta Descriptions**: Every public route must declare a concise, engaging `<meta name="description">` (120–160 chars) summarizing page value.
4. **Custom Branded Favicon & Icons**: Always supply custom branded SVGs/favicons (`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`); never leave default framework favicons.
5. **High-Resolution Open Graph Images**: Every public view must declare an on-brand 1200x630px `og:image`; never leave social preview images missing or broken.
6. **Canonical URLs**: Every page must declare `<link rel="canonical" href="..." />` to prevent duplicate indexing.
7. **Verified Social Previews**: Ensure complete Open Graph (`og:*`) and Twitter Card (`twitter:card="summary_large_image"`) metadata render without errors.
8. **Custom 404 & Error Pages**: Provide a dedicated on-brand custom 404 (`not-found.tsx`) and error boundary with navigation and return-to-canvas CTAs; no default framework 404s.
9. **Polished Skeleton & Loading States**: Always use geometry-matching skeleton screens with subtle shimmer animations to eliminate Cumulative Layout Shift (CLS); no generic "Loading..." text or raw unstyled spinners.
10. **Actionable, User-Friendly Error Messages**: Provide empathetic, clear error explanations with retry buttons or recovery paths; no raw exceptions or vague "Something went wrong" banners.
11. **Strict Semantic H1 & Heading Hierarchy**: Exactly one `<h1>` per page capturing primary intent, followed by `<h2>` -> `<h3>` without skipping levels.
12. **Meaningful Alt Text & a11y Tags**: Descriptive `alt` text for all informational images; `alt=""` and `aria-hidden="true"` for decorative icons; proper ARIA labels on icon buttons.
13. **Automated Sitemap & Robots.txt**: Automated `sitemap.xml` covering indexable routes and valid `robots.txt` specifying crawl rules and sitemap location.
14. **Zero Browser Console Errors**: Clean console during development and production runs; zero uncaught exceptions, React key warnings, or hydration mismatches.
15. **Clean Production Bundles (No Leftover Logs)**: Strip all debugging `console.log` statements before committing or via compiler transforms in production builds.
16. **Protected Production Source Maps**: Client-side source maps must remain disabled in public production builds (`productionBrowserSourceMaps: false`).
17. **Lean, Code-Split JS Bundles**: Keep initial bundle sizes minimal using dynamic imports (`next/dynamic`), route chunking, and tree-shaking; avoid massive monolithic bundles.
18. **Bulletproof Mobile-First Layouts**: Guaranteed flawless display from 320px viewports up; no horizontal overflow, proper touch padding, and minimum 44x44px touch targets.
19. **Consistent Design-Token UI Spacing**: Strict adherence to an 8pt/4pt design token spacing system; harmonious component margins and padding without arbitrary one-off pixels.
20. **Total Interactive Element Integrity**: Zero dead buttons or `#` placeholder links; every interactive element must be wired to state, navigation, or explicitly disabled with clear feedback.

