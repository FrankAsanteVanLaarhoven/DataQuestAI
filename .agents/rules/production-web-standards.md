# Rule: Production Web Development & Design Quality Standards (20 Core Checklist)

## Mandatory Compliance Directive
All development, page designs, components, and full-stack implementations across the workspace must strictly comply with and pass these 20 fundamental design, engineering, and SEO standards. Every feature implementation must be audited against these checks before being marked complete.

---

### 1. Production Domain & URL Hygiene (`no vercel.app / preview domain`)
- **Standard**: All canonical tags, API endpoints, sitemaps, open-graph URLs, and public links must resolve to the verified production custom domain (or configured production environment variable), never to staging or default preview URLs (`*.vercel.app`, preview deployment subdomains).
- **Rule**: Never hardcode preview or temporary URLs in markup, metadata, or auth redirect handlers.

### 2. Descriptive Page Titles (`no generic page titles`)
- **Standard**: Every route and modal view must provide a unique, descriptive, keyword-rich title formatted consistently (e.g., `Page Subject • DataQuest AI`).
- **Rule**: Never permit default framework titles such as "Next App", "Create Next App", "Vite App", "Home", or "Untitled".

### 3. Compelling Meta Descriptions (`no missing meta descriptions`)
- **Standard**: Every public and indexable page must contain a concise, informative `<meta name="description">` (120–160 characters) accurately summarizing the view's value proposition and content.
- **Rule**: Meta descriptions must never be empty, truncated, or copied verbatim from boilerplate templates.

### 4. Custom Branded Favicon & Icons (`no default favicon`)
- **Standard**: Provide a custom branded SVG and multi-resolution PNG favicon set (`favicon.ico`, `favicon.svg`, `apple-touch-icon.png`).
- **Rule**: Never allow the default framework favicon (e.g., Next.js black-and-white triangle, Vercel logo, Vite bolt, React atom) to appear in the browser tab.

### 5. High-Resolution Open Graph Images (`no missing open graph image`)
- **Standard**: Every public route must declare an Open Graph image (`og:image`) measuring 1200x630px at 1.91:1 aspect ratio, featuring branded graphics, typography, and clear visual identity.
- **Rule**: Never deploy pages without an `og:image` or with placeholder dummy images.

### 6. Canonical URLs (`no missing canonical URLs`)
- **Standard**: Every page must declare a canonical link tag `<link rel="canonical" href="..." />` matching the canonical URL structure of the page without tracking query parameters.
- **Rule**: Avoid duplicate content penalties by enforcing consistent trailing-slash or non-trailing-slash canonical URLs.

### 7. Verified Social Previews (`no broken social previews`)
- **Standard**: Full Open Graph (`og:type`, `og:site_name`, `og:title`, `og:description`, `og:image`) and Twitter Card (`twitter:card`, `twitter:site`, `twitter:creator`, `twitter:image`) metadata must be validated to render complete rich cards on X/Twitter, LinkedIn, Slack, and Discord.
- **Rule**: Use `summary_large_image` for Twitter cards and verify preview tags in page headers.

### 8. Custom 404 & Error Pages (`no missing custom 404`)
- **Standard**: Implement a dedicated, on-brand custom 404 (`not-found.tsx`) and global error boundary (`error.tsx`) page featuring helpful guidance, search, and a return-to-canvas / home call-to-action.
- **Rule**: Never show browser-default or framework-generic "404 | This page could not be found" screens.

### 9. Polished Skeleton & Loading States (`no generic loading states`)
- **Standard**: Replace raw "Loading...", blank screens, or jittery spinners with layout-matching skeleton screens (using shimmer animations and CSS pulse tokens) that match the geometry of the forthcoming UI.
- **Rule**: Zero Cumulative Layout Shift (CLS) during asynchronous data fetching; loading skeletons must reserve exact dimensions.

### 10. Actionable, User-Friendly Error Messages (`no generic error messages`)
- **Standard**: When network requests or user actions fail, present clear, non-technical, empathetic error messages accompanied by a concrete recovery path (e.g., "Retry Request", "Check Connection", or "Restore Draft").
- **Rule**: Never expose raw stack traces, uncaught promise rejections, or vague "Something went wrong" messages to the user.

### 11. Strict Semantic H1 & Heading Hierarchy (`no broken H1 structure`)
- **Standard**: Every page must have exactly one semantic `<h1>` element representing the primary subject. Subsequent subsections must strictly follow `<h2>` -> `<h3>` -> `<h4>` hierarchy without skipping levels.
- **Rule**: Never use multiple `<h1>` tags on a page, and never select heading levels purely for styling purposes (use CSS utility classes for sizing).

### 12. Meaningful Alt Text & a11y Tags (`no missing alt text`)
- **Standard**: All informative `<img>` tags and graphic figures must have concise, descriptive `alt` text explaining what is depicted. Purely decorative elements must include `alt=""` and `aria-hidden="true"`.
- **Rule**: Never leave `alt` attributes empty for content images or use filler text like `alt="image"` or `alt="picture"`.

### 13. Automated Sitemap & Robots.txt (`no missing sitemap.xml`)
- **Standard**: Provide an automated `sitemap.xml` covering all public routes and dynamic catalog URLs, paired with a properly formatted `robots.txt` specifying crawler allow/disallow paths and the sitemap index URL.
- **Rule**: Ensure staging, preview, and administrative routes are disallowed while public learning modules are discoverable.

### 14. Zero Browser Console Errors (`no console errors`)
- **Standard**: The browser console must remain 100% clean during development and production usage. No uncaught errors, no React key warnings (`Each child in a list should have a unique 'key' prop`), no hydration mismatches, and no 404 network asset failures.
- **Rule**: Any warning or error logged in the browser console is considered a blocking defect that must be resolved immediately.

### 15. Clean Production Bundles (`no leftover console.logs`)
- **Standard**: Strip all debugging `console.log`, `console.debug`, `console.info`, and testing statements prior to committing or in compiler production build pipelines (`compiler.removeConsole`).
- **Rule**: Only structured errors logged via dedicated logging utilities (`console.error` in controlled error handlers) are permissible in production.

### 16. Protected Production Source Maps (`no exposed source maps`)
- **Standard**: Never expose raw source code to the public through exposed `.map` files in client bundles (`productionBrowserSourceMaps: false`).
- **Rule**: If source maps are generated for crash analytics (e.g. Sentry/Datadog), upload them privately during CI/CD and restrict public web access.

### 17. Lean, Code-Split JS Bundles (`no massive JS bundles`)
- **Standard**: Keep initial JavaScript bundle footprints lean by leveraging route-level chunking, dynamic imports (`next/dynamic` or `React.lazy`), tree-shaking, and lightweight dependencies.
- **Rule**: Heavy visualization modules, code editors, and audio synthesis engines must be dynamically loaded only when needed.

### 18. Bulletproof Mobile-First Layouts (`no broken mobile layouts`)
- **Standard**: Test and guarantee flawless presentation on viewport widths down to 320px. Ensure zero unintended horizontal scrollbars, proper viewport metadata, flex/grid wrapping, and safe-area inset padding (`env(safe-area-inset-bottom)`).
- **Rule**: Touch targets for buttons, inputs, and links must measure at least 44x44px with comfortable touch padding.

### 19. Consistent Design-Token UI Spacing (`no inconsistent UI spacing`)
- **Standard**: All margins, paddings, gaps, and positioning must adhere strictly to the design system's spacing scale (4px / 8px grid tokens: `p-2`, `p-4`, `p-6`, `p-8`, `gap-3`, `gap-4`).
- **Rule**: Prohibit arbitrary one-off pixel values (e.g. `margin: 13px;`, `top: 23px`) that break visual rhythm and visual hierarchy.

### 20. Total Interactive Element Integrity (`no dead buttons & links`)
- **Standard**: Every button, navigation tab, menu item, anchor tag, and interactive icon must perform an intentional, functional action (navigation, state change, modal toggle).
- **Rule**: Dead click targets, placeholder `#` hrefs, and silent unhandled buttons are strictly forbidden. If an action is temporarily unavailable, the element must be visibly disabled with an informative tooltip or message.
