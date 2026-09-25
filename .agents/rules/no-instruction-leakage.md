# Rule: Do Not Leak Prompt Instructions or Meta-Adjectives into UI

## Core Principle
Never replicate prompt instructions, quality descriptors, meta-adjectives, or task descriptions as visible text, badges, or headers in user-facing UI implementations. The platform is a production software product; instructions from users are to be *implemented*, not *quoted or repeated* on screen.

## Rules & Constraints
1. **Forbidden UI Badges & Text**:
   - Words from user prompts describing benchmarks or quality (e.g., "SOTA", "Benchmark", "Tier-0", "Cutting Edge", "Lusid-like", "Best-in-class").
   - Instructional phrases or task statements (e.g., "Task / Example Design", "Follow current course standards", "Ensure logins are properly implemented", "NMK,L").
   - Meta-prompts or development directives.

2. **Clean Product Copy**:
   - All UI badges, labels, subtitles, tabs, and buttons must use natural, professional, domain-native product terminology:
     - Good: "Architecture Studio", "Relational Schema", "UML Class Diagram", "Distributed Systems", "DDL Export".
     - Bad: "SOTA Modeling", "Benchmark UML", "Tier-0 Design", "Course Standards Canvas".

3. **Auditing UI Text**:
   - When creating or refactoring frontend components, verify every `<span>`, badge, `<p>`, header, and tooltip.
   - If any text reflects the wording of the prompt instructing how to build something, rewrite it to clean product terminology or remove the element.
