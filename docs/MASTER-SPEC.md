# Master Specification — General VA Portfolio + Static Admin CMS

## Goal
A professional General Virtual Assistant portfolio that communicates reliable, organized, creative, and tech-aware support. The public site is static; editable content lives in versioned JSON. The separate admin editor lets the owner update content without repeating edits in HTML.

## Positioning
**Primary role:** General Virtual Assistant. Supporting strengths: administrative workflow support, creative production, and website/digital support. Do not position as Executive Assistant or imply executive-level experience.

## Audience
Remote-first businesses, agencies, small business owners, and teams that need email/task organization, presentation work, creative production, website content updates, or basic QA.

## Content principles
1. Distinguish a service offered from prior paid experience.
2. Keep planned demos in draft until real artifacts exist.
3. Use context/problem → approach → deliverables → evidence/limitations.
4. Never invent metrics, testimonials, client names, or outcomes.
5. Label concept, fan-made, academic, internship, freelance, and demo work accurately.
6. Hide drafts from the public site.
7. Prefer specific nonredundant services and plain language.

## Design system
The supplied HTML is a copy workspace, not the actual live portfolio source. These are implementation references from the unified spec; reconcile with the actual production CSS/tokens before final production: canvas `#FAFAF7`, white surface `#FFFFFF`, ink `#172A2F`, cobalt `#1A52D4`, pale blue `#EAF0FF`, pale teal `#DFE9E5`; Gilda Display for display headings, IBM Plex Mono for utility labels, Inter/system sans for body. Editorial spacing, fine borders, rounded cards, restrained ornament. Do not invent a new identity.

## Architecture
- `public/`: static HTML/CSS/JS site
- `admin/`: local JSON editor
- `content/*.json`: canonical content
- `schemas/`: schema references
- `scripts/validate-content.mjs`: validation
- `api/publish.js`: intentionally disabled placeholder
- Cloudinary URLs may be referenced in content; secrets must stay server-side
- No database required

## Data handling
Stable lowercase kebab-case IDs. Project status is `draft`, `published`, or `archived`; service status is `active` or `archived`. Browser editor state is a working copy only. Export is required to persist edits. Git history is the source-control audit trail. Do not store confidential client data in public JSON.

## Publishing
Baseline: edit → save in browser → export bundle → update repo JSON → validate → commit/push → deploy. Direct publishing requires a separate authenticated server-side endpoint; never store credentials in browser JavaScript. The included API is intentionally disabled, not a production publisher.

## Accessibility and quality
Responsive layouts, visible keyboard focus, semantic headings, reduced-motion support, meaningful image alt text, visible validation errors, external-link safety, no draft rendering, and production base-path testing.
