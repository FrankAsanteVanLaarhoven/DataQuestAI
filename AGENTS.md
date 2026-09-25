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
